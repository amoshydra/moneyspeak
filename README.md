# moneyspeak

Turn a currency amount into a string a speech synthesizer reads correctly.

Engines read numbers fine and currency codes badly: `USD123.45` becomes "US dollars" on some, `SGD123.45` is spelled out on others. `verbalizeMoney` returns the words and leaves the digits to the engine.

```ts
import { verbalizeMoney } from "moneyspeak";

verbalizeMoney({ amount: 123.45, currency: "SGD", locale: "en-US" });
// {
//   spoken: "123 Singapore dollars and 45 cents",
//   display: "SGD 123.45",
//   strategy: "major-minor",
//   warnings: []
// }
```

## API

`verbalizeMoney(input, options?) => Result`

| `input` | |
| --- | --- |
| `amount` | `number \| string \| bigint`, in major units |
| `currency` | ISO 4217 code |
| `locale` | BCP 47 tag, defaults to the runtime locale |

| `options` | |
| --- | --- |
| `style` | `"auto" \| "major-minor" \| "decimal-name" \| "major-only"` |
| `name` | replace the spoken currency name |
| `subunit` | replace the minor unit name, or `false` to drop it |
| `connector` | replace the word joining major and minor |
| `decimalBreak` | `"auto"` inserts a word joiner before an ASCII `.` for non-Latin scripts; default `"none"` |
| `locale` | override `input.locale` |

Returns `{ spoken, display, strategy, warnings }`.

Also exported:

- `resolveCurrency(currency, locale)` — the derived name, symbol, exponent, subunit, order; `sources` records where the values that can come from data (`name`, `exponent`, `subunit`) came from.
- `parseMoney(text, locale, { currency })` — best-effort read of a formatted amount.

DOM helpers, in `moneyspeak/dom`:

- `setAccessibleMoney(el, input, options?)` — writes a visually hidden spoken form and the conventional display form. The hidden node is a `<div>` carrying `lang` (and `dir="auto"`), because VoiceOver honors `lang` on a block element and ignores it on a `<span>` even with `display:block`.
- `defineCurrencyAmount()` — registers `<currency-amount amount currency locale>`.
- `srOnlyCss` — the stylesheet for the hidden node. Add it to the page once, or the spoken form is visible:
  ```ts
  const style = document.createElement("style");
  style.textContent = srOnlyCss;
  document.head.append(style);
  ```

## Strategy

| Condition | `strategy` | Output |
| --- | --- | --- |
| exponent > 0 and a subunit resolves for the locale | `major-minor` | `123 Singapore dollars and 45 cents` |
| exponent > 0 and no subunit resolves | `decimal-name` | `123.45 Singapore dollars` |
| fraction is zero, or exponent is 0 | `major-only` | `123 Japanese yen` |

A subunit resolves from the language's word for the currency's kind, or, when the language has no such word, from the kind's international name. The decimal reading is left for a currency whose kind is unknown.

`spoken` never contains a currency symbol, and never a bare ISO code except for a code with no CLDR name at all, which warns and falls back to the code.

## Data

Everything derivable comes from `Intl` at runtime: the name (singular and plural), symbol, order, digits and exponent.

Three files hold the rest:

- `data/subunit-kinds.json` — the subunit **kind** for each currency (`USD` -> `cent`, `EUR` -> `eurocent`, `GBP` -> `penny`), and the **international name** for each kind. `null` marks a currency with no subunit. The kind is the concept, so it is not repeated per currency.
- `data/subunits.json` — the **word** for each kind per language, e.g. `en` -> `cent` -> `{ one: "cent", other: "cents" }`. One entry serves every currency that shares the kind, so adding a language means adding words, not re-entering "cent" for each currency.
- `data/overrides.json` — exponent corrections, spoken name overrides, per-locale connector and split settings, and per-locale or per-language **subunit exceptions** (a word that differs from the kind's default, e.g. `zh` -> `USD` -> `美分`).

A subunit is resolved in four tiers, most specific first:

1. an explicit override for the locale, then for the language; `null` there means no subunit.
2. the currency's kind, from `subunit-kinds.json`. A currency absent from the file is guessed only when its exponent is 0, which means no subunit; exponents 2 and 3 are not guessed, because they are not a cent or a fils in general (`CZK` is haléř, `PLN` is grosz).
3. the language's word for that kind, from `subunits.json`.
4. the kind's international name, so a known kind never reaches the decimal reading only because a language lacks a word.

The decimal reading is left for a currency whose kind is unknown.

`data/example-matrix.json` holds the locale and currency surface used by the docs demo, the matrix test and `matrix:dump`, so the three cannot drift apart. It is an example set, not a support boundary: any BCP 47 locale and any ISO 4217 code is accepted.

`pnpm compare:data` checks the subunit plural categories against CLDR and the exponents against ISO 4217, reports the model coverage, and names the currencies whose exponent deliberately differs from ISO. Per-entry sources are in `data/SOURCES.md`.

## Limits

- Output follows the runtime's CLDR, so it can differ between browsers and Node versions.
- The fraction digits come from CLDR by default. `data/overrides.json` corrects the cases where CLDR's display digits are not the ISO 4217 minor unit (`IDR`), and `compare:data` lists the currencies where the two disagree on purpose (`LAK`, `MMK`, whose subunits are out of use).
- One minor unit per currency. Intermediate units (`jiao`, `dime`) are not modelled, because no synthesizer verbalizes them.
- When a language has no word for a kind, the reading uses the kind's international name, which can put a non-native word inside another language: Korean with a Swedish krona reads `1 스웨덴 크로나 5 øre`, and Hindi with a Swiss franc reads `1 स्विस फ़्रैंक 5 centimes`. It keeps the reading major-plus-minor instead of dropping to the decimal, and `data/subunits.json` is where a language's own word replaces it.
- The integer digits are left to the engine. The decimal separator is not. VoiceOver on macOS and on iOS 26 parsed the number itself and read an ASCII `.` as an English "point" even with a Chinese or Japanese voice, and `lang` only selects the voice. An opt-in workaround, `{ decimalBreak: "auto" }`, inserts an invisible word joiner (`U+2060`) before an ASCII `.` for non-Latin scripts, which stops the parsing so the synthesizer normalizes the number itself. It is **off by default**, because it is harmful elsewhere: measured on Google TTS the joiner drops the fractional part (`123<wj>.45人民币` reads 一百二十三人民币), and TalkBack on Android reads `U+2060` aloud as "word joiner". iOS 27 no longer has the original bug.
- Measured on Google TTS (`com.google.android.tts`, OnePlus 6T, Android 15): the fifteen locale renders all read the minor unit with no "point". On that build the bare codes `USD123.45`, `SGD123.45` and `CNY123.45` are named correctly too, so the library's value there is consistency, not a rescue. The engines that spell a code out are the ones the corpus documented.

## Develop

```bash
pnpm install
pnpm test          # vitest, includes the full locale x currency matrix
pnpm build         # tsdown, ESM and CJS
pnpm typecheck     # tsc --noEmit
pnpm docs          # Vite docs app
pnpm compare:data  # data vs CLDR and ISO 4217, exits non-zero on a gap
pnpm matrix:dump   # full matrix for review when the runtime or data changes
```

MIT
