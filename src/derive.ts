import type { PluralCategory, PluralForms } from "./types.js";

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
/**
 * The name part of a formatted currency, which is not always the first one: in
 * Turkish, CLDR renders the symbol before the name (`$` then `ABD doları`), and
 * for code-first currencies the code comes before the name too. The name is the
 * last currency part.
 */
function currencyPart(locale: string, currency: string, value: number, fractionDigits: number): string {
  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "name",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  const parts = fmt.formatToParts(value).filter((part) => part.type === "currency");
  return parts.at(-1)?.value ?? "";
}

/** Index of the last currency part, which is the name. */
function namePartIndex(parts: Intl.NumberFormatPart[]): number {
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (parts[i]?.type === "currency") return i;
  }
  return -1;
}

// Sample values used to obtain each CLDR plural form of a currency name. The
// category of a value is not fixed by language: Russian puts 5 in `many` and
// fractions in `other`, Arabic puts 2 in `two`, French puts fractions in
// `other`. The form is therefore taken from a value that actually selects the
// category, not from a fixed pair of values.
const PLURAL_SAMPLES: Array<{ value: number; fractionDigits: number }> = [
  { value: 0, fractionDigits: 0 },
  { value: 1, fractionDigits: 0 },
  { value: 2, fractionDigits: 0 },
  { value: 3, fractionDigits: 0 },
  { value: 4, fractionDigits: 0 },
  { value: 5, fractionDigits: 0 },
  { value: 6, fractionDigits: 0 },
  { value: 10, fractionDigits: 0 },
  { value: 11, fractionDigits: 0 },
  { value: 20, fractionDigits: 0 },
  { value: 21, fractionDigits: 0 },
  { value: 100, fractionDigits: 0 },
  { value: 1000, fractionDigits: 0 },
  { value: 1000000, fractionDigits: 0 },
  { value: 1.5, fractionDigits: 1 },
];

/** Every CLDR plural form of a currency name, each sampled from `Intl`. */
export function deriveName(locale: string, currency: string): PluralForms {
  const rules = new Intl.PluralRules(locale);
  const categories = rules.resolvedOptions().pluralCategories as PluralCategory[];
  const forms: Partial<Record<PluralCategory, string>> = {};

  for (const category of categories) {
    const sample = PLURAL_SAMPLES.find((candidate) => rules.select(candidate.value) === category);
    if (sample) forms[category] = currencyPart(locale, currency, sample.value, sample.fractionDigits);
  }
  if (forms.other === undefined) forms.other = currencyPart(locale, currency, 2, 0);

  return forms as PluralForms;
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
  const currencyIndex = namePartIndex(parts);
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

/**
 * Integer digits for speech, without grouping. A grouping separator is a
 * period in several locales (de, es, it, nl, id), and a synthesizer can read
 * `1.234` as a decimal, so the spoken form omits grouping entirely.
 */
export function formatInteger(locale: string, value: bigint): string {
  return new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 0 }).format(value);
}

/** The locale's minus sign, for spoken numbers. */
export function minusSign(locale: string): string {
  return (
    new Intl.NumberFormat(locale)
      .formatToParts(-1)
      .find((part) => part.type === "minusSign")?.value ?? "-"
  );
}

export function selectPlural(locale: string, value: bigint): PluralCategory {
  return new Intl.PluralRules(locale).select(Number(value)) as PluralCategory;
}

/**
 * Plural category of a full decimal value, for the currency name in the
 * decimal-name reading. The category depends on the fraction, so it cannot be
 * taken from the integer part alone: French puts `1,5` in `one`.
 */
export function selectPluralValue(
  locale: string,
  major: bigint,
  minor: bigint,
  exponent: number,
): PluralCategory {
  const value =
    exponent > 0
      ? Number(`${major}.${minor.toString().padStart(exponent, "0")}`)
      : Number(major);
  return new Intl.PluralRules(locale).select(value) as PluralCategory;
}

/** True when the locale's script is Latin, where a plain "." already reads correctly. */
export function isLatinScript(locale: string): boolean {
  try {
    return new Intl.Locale(locale).maximize().script === "Latn";
  } catch {
    return true;
  }
}
