import { canonicalLocale } from "./derive.js";
import type { ParsedMoney } from "./types.js";

const UNAMBIGUOUS_SYMBOLS: Record<string, string> = {
  "€": "EUR",
  "£": "GBP",
  "₹": "INR",
  "฿": "THB",
  "₩": "KRW",
  "₺": "TRY",
};

const AMBIGUOUS_SYMBOLS: Record<string, string[]> = {
  $: ["USD", "CAD", "AUD", "SGD", "HKD", "NZD", "MYR"],
  "¥": ["JPY", "CNY"],
  kr: ["SEK", "NOK", "DKK", "ISK"],
};

/**
 * Best-effort reader for a formatted amount. Pass `{ currency }` when the
 * symbol is ambiguous, which `$` and `¥` are.
 */
export function parseMoney(
  text: string,
  locale?: string,
  options: { currency?: string } = {},
): ParsedMoney {
  const loc = canonicalLocale(locale);
  const warnings: string[] = [];

  let currency = options.currency?.toUpperCase();
  if (!currency) {
    currency = /\b([A-Z]{3})(?![A-Za-z])/.exec(text)?.[1];
  }
  if (!currency) {
    for (const [symbol, code] of Object.entries(UNAMBIGUOUS_SYMBOLS)) {
      if (text.includes(symbol)) {
        currency = code;
        break;
      }
    }
  }
  if (!currency) {
    for (const [symbol, codes] of Object.entries(AMBIGUOUS_SYMBOLS)) {
      if (text.includes(symbol)) {
        warnings.push(`${symbol} is ambiguous (${codes.join(", ")}); pass { currency }`);
        break;
      }
    }
    throw new TypeError("could not determine the currency; pass { currency }");
  }

  const decimal =
    new Intl.NumberFormat(loc).formatToParts(1.1).find((part) => part.type === "decimal")?.value ?? ".";
  const raw = text.replace(/[^\d.,+\-]/g, "");
  const normalized =
    decimal === "," ? raw.replace(/\./g, "").replace(/,/g, ".") : raw.replace(/,/g, "");

  if (!/^[+-]?\d+(\.\d+)?$/.test(normalized)) {
    throw new TypeError(`could not read an amount from ${JSON.stringify(text)}`);
  }

  return { amount: normalized, currency, locale: loc, warnings };
}
