import subunitsJson from "../data/subunits.json";
import subunitKindsJson from "../data/subunit-kinds.json";
import overridesJson from "../data/overrides.json";
import type { PluralForms } from "./types.js";

/** Minor unit words, keyed by language and then by subunit kind. */
interface SubunitFile {
  subunits: Record<string, Record<string, PluralForms>>;
}

/** Currency -> subunit kind. `null` means the currency has no subunit. */
interface SubunitKindsFile {
  kinds: Record<string, string | null>;
}

interface OverridesFile {
  exponent?: Record<string, number>;
  names?: Record<string, Record<string, string>>;
  /** Per-locale or per-language subunit exceptions. `null` disables the subunit. */
  subunits?: Record<string, Record<string, PluralForms | null>>;
  locales?: Record<string, { connector?: string; split?: boolean }>;
}

const subunits = subunitsJson as unknown as SubunitFile;
const kinds = subunitKindsJson as unknown as SubunitKindsFile;
const overrides = overridesJson as unknown as OverridesFile;

const language = (locale: string): string => locale.split("-")[0] ?? locale;

/**
 * Resolve the minor unit name for `currency` in `locale`.
 *
 * Three tiers, most specific first:
 *   1. an explicit override for the locale, then for the language; `null` there
 *      means the currency has no subunit in that language.
 *   2. the currency's subunit kind, from `data/subunit-kinds.json`. An absent
 *      currency is unknown, a `null` kind means the currency has no subunit.
 *   3. the language's word for that kind, from `data/subunits.json`.
 *
 * Returns `null` for a currency that has no subunit, and `undefined` when the
 * currency kind is unknown or the language has no word for it, so the caller
 * falls back to the decimal reading.
 */
export function lookupSubunit(currency: string, locale: string): PluralForms | null | undefined {
  const lang = language(locale);

  const localeOverride = overrides.subunits?.[locale]?.[currency];
  if (localeOverride !== undefined) return localeOverride;
  const languageOverride = overrides.subunits?.[lang]?.[currency];
  if (languageOverride !== undefined) return languageOverride;

  const kind = kinds.kinds[currency];
  if (kind === undefined) return undefined;
  if (kind === null) return null;

  return subunits.subunits[lang]?.[kind];
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
