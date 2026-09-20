import subunitsJson from "../data/subunits.json";
import overridesJson from "../data/overrides.json";
import type { PluralForms } from "./types.js";

interface SubunitFile {
  subunits: Record<string, Record<string, PluralForms> | null>;
}

interface OverridesFile {
  exponent?: Record<string, number>;
  names?: Record<string, Record<string, string>>;
  locales?: Record<string, { connector?: string; split?: boolean }>;
}

const subunits = subunitsJson as unknown as SubunitFile;
const overrides = overridesJson as unknown as OverridesFile;

const language = (locale: string): string => locale.split("-")[0] ?? locale;

/**
 * Subunit names are not in CLDR, so they live in `data/subunits.json`.
 * Returns `null` for a currency that has no subunit, and `undefined` when the
 * currency or the locale is simply not covered yet.
 */
export function lookupSubunit(currency: string, locale: string): PluralForms | null | undefined {
  const entry = subunits.subunits[currency];
  if (entry === undefined) return undefined;
  if (entry === null) return null;
  return entry[locale] ?? entry[language(locale)];
}

export function exponentOverride(currency: string): number | undefined {
  return overrides.exponent?.[currency];
}

export function nameOverride(locale: string, currency: string): string | undefined {
  return overrides.names?.[locale]?.[currency] ?? overrides.names?.[language(locale)]?.[currency];
}

export function localeProfile(locale: string): { connector?: string; split?: boolean } {
  return overrides.locales?.[locale] ?? overrides.locales?.[language(locale)] ?? {};
}
