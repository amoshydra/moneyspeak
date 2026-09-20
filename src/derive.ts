import type { PluralForms } from "./types.js";

/** Canonicalize a BCP 47 tag, falling back to the runtime locale. */
export function canonicalLocale(locale?: string): string {
  if (!locale) return new Intl.NumberFormat().resolvedOptions().locale;
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? locale;
  } catch {
    return locale;
  }
}

/**
 * The currency name as CLDR writes it for `value`.
 * Zero fraction digits is deliberate: with the default `.00` every value is
 * plural, so `format(1)` would never yield the singular form.
 */
function currencyPart(locale: string, currency: string, value: number, fractionDigits: number): string {
  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "name",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return fmt.formatToParts(value).find((part) => part.type === "currency")?.value ?? "";
}

/** Singular and plural currency names, derived from `Intl`. */
export function deriveName(locale: string, currency: string): PluralForms {
  return {
    one: currencyPart(locale, currency, 1, 0),
    other: currencyPart(locale, currency, 2, 0),
  };
}

export function deriveSymbol(locale: string, currency: string): string {
  const parts = new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(1);
  return parts
    .filter((part) => part.type === "currency")
    .map((part) => part.value)
    .join("");
}

export function deriveOrder(locale: string, currency: string): "prefix" | "suffix" {
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "name",
  }).formatToParts(1);
  const currencyIndex = parts.findIndex((part) => part.type === "currency");
  const integerIndex = parts.findIndex((part) => part.type === "integer");
  if (currencyIndex === -1 || integerIndex === -1) return "suffix";
  return currencyIndex < integerIndex ? "prefix" : "suffix";
}

/** CLDR's display fraction digits for the currency. Not always the ISO 4217 minor unit. */
export function deriveExponent(locale: string, currency: string): number {
  const digits = new Intl.NumberFormat(locale, { style: "currency", currency }).resolvedOptions()
    .maximumFractionDigits;
  return digits ?? 2;
}

export function formatInteger(locale: string, value: bigint): string {
  return new Intl.NumberFormat(locale, { useGrouping: true, maximumFractionDigits: 0 }).format(value);
}

export function selectPlural(locale: string, value: bigint): "one" | "other" {
  const category = new Intl.PluralRules(locale).select(Number(value));
  return category === "one" ? "one" : "other";
}
