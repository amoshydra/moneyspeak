# moneyspeak

Turn a currency amount into a string a speech synthesizer reads correctly.

Screen readers get numbers right. They get currency codes wrong. `USD123.45` becomes "US dollars" on one engine and `SGD123.45` is spelled out letter by letter on another, because the synthesizer's text normalizer decides, and every engine decides differently.

moneyspeak supplies the part the engine gets wrong: the currency words. The digits are left alone, because the engine already reads them well.

```ts
import { verbalizeMoney } from "moneyspeak";

verbalizeMoney({ amount: 123.45, currency: "SGD", locale: "en-US" });
// { spoken: "123 Singapore dollars and 45 cents",
//   display: "SGD 123.45",
//   strategy: "major-minor",
//   warnings: [] }
```

## How it works

Everything that can be derived comes from `Intl` at runtime:

- the currency name, singular and plural, via `formatToParts` at 1 and 2
- the symbol, the word order, the digits and separators
- the fraction digits, via `resolvedOptions().maximumFractionDigits`

Two things `Intl` cannot give are shipped as data:

- `data/subunits.json` — minor unit names (`cent`, `paise`, `fils`). CLDR has none.
- `data/overrides.json` — exponent corrections (`IDR`), spoken-name overrides (`id-ID` USD), and per-locale connector and split settings.

That is the entire maintenance surface.

## Shapes

| Condition | Strategy | Example |
| --- | --- | --- |
| exponent > 0, subunit known, locale splits units | `major-minor` | `123 Singapore dollars and 45 cents` |
| otherwise | `decimal-name` | `123.45 Singapore dollars` |
| fraction is zero, or exponent is 0 | `major-only` | `123 Japanese yen` |

The invariant: `spoken` never contains a bare ISO code or a currency symbol.

## Decisions

- One shape rule per locale, so every amount of a currency reads the same way. Consistency matters more than matching any single engine's quirks.
- The currency name is always spelled out, so the amount stays recognisable to a listener even when the engine would have read the code as letters.
- One minor unit per currency, the one ISO 4217's exponent defines. Intermediate units such as `jiao`, `dime` or `毫` are not modelled, because no synthesizer verbalizes them.

## Accessibility

```ts
import { setAccessibleMoney } from "moneyspeak/dom";

setAccessibleMoney(el, { amount: 123.45, currency: "SGD", locale: "en-SG" });
```

renders the conventional form for sighted users and the spoken form for assistive technology, keeping the amount in one text node.

## Development

```bash
pnpm install
pnpm test          # vitest
pnpm build         # tsdown, ESM and CJS
pnpm typecheck     # tsc --noEmit
pnpm docs          # Vite docs app
pnpm compare:data  # check the subunit data against CLDR and ISO 4217
```

The docs deploy to GitHub Pages from `main` via `.github/workflows/pages.yml`. Enable Pages with "GitHub Actions" as the source in the repository settings.

## Status

Prototype. The subunit data is a draft and the spoken forms follow the runtime's CLDR, so they can differ between browsers and Node versions.

## License

MIT
