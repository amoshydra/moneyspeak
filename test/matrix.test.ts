import { describe, expect, it } from "vitest";
import { resolveCurrency, verbalizeMoney } from "../src/index.js";
import matrix from "../data/example-matrix.json";
import overrides from "../data/overrides.json";

// The locale and currency surface lives in data/example-matrix.json, shared with
// the docs demo and matrix:dump so the three cannot drift apart.
const LOCALES = matrix.locales;
const CURRENCIES = matrix.currencies;

/** Exponent overrides come from the data, not a constant that can go stale. */
const EXPONENT_OVERRIDES: Record<string, number> = overrides.exponent ?? {};

const AMOUNTS = ["0", "0.45", "1", "1.01", "123", "123.45", "-123.45"];

const SYMBOLS = ["$", "€", "£", "¥", "₹", "฿", "₩", "₺"];

const STRATEGIES = ["major-minor", "decimal-name", "major-only"];

describe("matrix: every locale x currency", () => {
  for (const locale of LOCALES) {
    it(locale, () => {
      for (const currency of CURRENCIES) {
        const resolved = resolveCurrency(currency, locale);

        // Derived values must agree with the same runtime's Intl, which keeps
        // this a test of our logic rather than of a CLDR snapshot.
        const symbolFormat = new Intl.NumberFormat(locale, { style: "currency", currency });
        const expectedExponent =
          EXPONENT_OVERRIDES[currency] ?? symbolFormat.resolvedOptions().maximumFractionDigits ?? 0;
        expect(resolved.exponent, `${currency} exponent`).toBe(expectedExponent);

        const symbolParts = symbolFormat.formatToParts(1);
        const symbol = symbolParts
          .filter((part) => part.type === "currency")
          .map((part) => part.value)
          .join("");
        expect(resolved.symbol, `${currency} symbol`).toBe(symbol);

        // Independent of derive.ts: locate the part that equals CLDR's display
        // name for the currency, rather than repeating the first-part logic.
        const displayName = new Intl.DisplayNames([locale], { type: "currency" }).of(currency);
        if (displayName) {
          const nameParts = new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            currencyDisplay: "name",
          }).formatToParts(1);
          const nameIndex = nameParts.findIndex(
            (part) =>
              part.type === "currency" && part.value.toLowerCase() === displayName.toLowerCase(),
          );
          const integerIndex = nameParts.findIndex((part) => part.type === "integer");
          if (nameIndex !== -1 && integerIndex !== -1) {
            expect(resolved.order, `${currency} order`).toBe(
              nameIndex < integerIndex ? "prefix" : "suffix",
            );
          }
        }

        for (const amount of AMOUNTS) {
          const label = `${currency} ${amount}`;
          const result = verbalizeMoney({ amount, currency, locale });

          expect(result.spoken.length, `${label} spoken`).toBeGreaterThan(0);
          expect(result.display.length, `${label} display`).toBeGreaterThan(0);
          expect(STRATEGIES, `${label} strategy`).toContain(result.strategy);
          expect(result.spoken, `${label} joiner`).not.toContain("\u2060");
          for (const glyph of SYMBOLS) {
            expect(result.spoken, `${label} symbol ${glyph}`).not.toContain(glyph);
          }

          // A bare code may only appear when the runtime has no usable name for
          // it, which is what the warning records. Match it as a word: `EUR` is
          // a substring of `EURO`.
          const unnamed = result.warnings.some((warning) => warning.includes("contains the ISO code"));
          if (!unnamed) {
            expect(result.spoken.toUpperCase(), `${label} bare code`).not.toMatch(
              new RegExp(`\\b${currency}\\b`),
            );
          }

          // A currency with no minor unit can only be major-only.
          if (resolved.exponent === 0) {
            expect(result.strategy, `${label} exponent 0`).toBe("major-only");
          }

          // major-minor must name the minor unit.
          if (result.strategy === "major-minor") {
            expect(resolved.subunit, `${label} subunit`).not.toBeNull();
          }
        }
      }
    });
  }
});
