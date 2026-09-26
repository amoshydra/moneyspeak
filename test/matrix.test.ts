import { describe, expect, it } from "vitest";
import { resolveCurrency, verbalizeMoney } from "../src/index.js";
import matrix from "../data/example-matrix.json";

// The locale and currency surface lives in data/example-matrix.json, shared with
// the docs demo and matrix:dump so the three cannot drift apart.
const LOCALES = matrix.locales;
const CURRENCIES = matrix.currencies;

const AMOUNTS = ["0", "0.45", "1", "1.01", "123", "123.45", "-123.45"];

const SYMBOLS = ["$", "€", "£", "¥", "₹", "฿", "₩", "₺"];

/** Exponent overrides from data/overrides.json, where CLDR's digits differ from ISO 4217. */
const EXPONENT_OVERRIDES: Record<string, number> = { IDR: 2 };

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

        const nameParts = new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          currencyDisplay: "name",
        }).formatToParts(1);
        const currencyIndex = nameParts.findIndex((part) => part.type === "currency");
        const integerIndex = nameParts.findIndex((part) => part.type === "integer");
        expect(resolved.order, `${currency} order`).toBe(currencyIndex < integerIndex ? "prefix" : "suffix");

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

          // A bare code may only appear when the runtime has no name for it,
          // which is what the warning records. Match it as a word: `EUR` is a
          // substring of `EURO`.
          const unnamed = result.warnings.some((warning) => warning.includes("no currency name"));
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
