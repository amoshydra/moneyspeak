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
| `decimalBreak` | `"auto"` (default) inserts a word joiner before the separator for non-Latin scripts; `"none"` disables |
| `locale` | override `input.locale` |

Returns `{ spoken, display, strategy, warnings }`.

Also exported:

- `resolveCurrency(currency, locale)` — the derived name, symbol, exponent, subunit, order, and the source (`intl` or `data`) of each value.
- `parseMoney(text, locale, { currency })` — best-effort read of a formatted amount.

DOM helpers, in `moneyspeak/dom`:

- `setAccessibleMoney(el, input, options?)` — writes a visually hidden spoken form and the conventional display form. The hidden node is a `<div>` carrying `lang` (and `dir="auto"`), because VoiceOver honors `lang` on a block element and ignores it on a `<span>` even with `display:block`.
- `defineCurrencyAmount()` — registers `<currency-amount amount currency locale>`.

## Strategy

| Condition | `strategy` | Output |
| --- | --- | --- |
| exponent > 0 and a subunit is known for the locale | `major-minor` | `123 Singapore dollars and 45 cents` |
| otherwise | `decimal-name` | `123.45 Singapore dollars` |
| fraction is zero, or exponent is 0 | `major-only` | `123 Japanese yen` |

`spoken` never contains a bare ISO code or a currency symbol.

## Data

Everything derivable comes from `Intl` at runtime: the name (singular and plural), symbol, order, digits and exponent.

Two files hold the rest:

- `data/subunits.json` — minor unit names per currency and language. CLDR has none.
- `data/overrides.json` — exponent corrections, spoken name overrides, and per-locale connector and split settings.

`pnpm compare:data` checks the subunit plural categories against CLDR and the exponents against ISO 4217. Per-entry sources are in `data/SOURCES.md`.

## Limits

- Output follows the runtime's CLDR, so it can differ between browsers and Node versions.
- One minor unit per currency, the one ISO 4217's exponent defines. Intermediate units (`jiao`, `dime`) are not modelled, because no synthesizer verbalizes them.
- The integer digits are left to the engine. The decimal separator is not. VoiceOver on macOS parses the number itself and reads an ASCII `.` as an English "point" even with a Chinese or Japanese voice, and `lang` only selects the voice. `spoken` therefore inserts an invisible word joiner (`U+2060`) before the separator for non-Latin scripts, which stops VoiceOver parsing the number so the synthesizer normalizes it itself. Latin scripts are untouched, and `{ decimalBreak: "none" }` disables it.

## Develop

```bash
pnpm install
pnpm test          # vitest
pnpm build         # tsdown, ESM and CJS
pnpm typecheck     # tsc --noEmit
pnpm docs          # Vite docs app
pnpm compare:data  # data vs CLDR and ISO 4217
```

MIT
