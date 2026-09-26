import subunitsJson from "../data/subunits.json";
import subunitKindsJson from "../data/subunit-kinds.json";
import overridesJson from "../data/overrides.json";
import type { PluralForms } from "./types.js";

/** Minor unit words, keyed by language and then by subunit kind. */
interface SubunitFile {
  subunits: Record<string, Record<string, PluralForms>>;
}

/** Currency -> subunit kind, plus the international name per kind. */
interface SubunitKindsFile {
  names: Record<string, PluralForms>;
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
 * Default kind for a currency with no explicit entry. Only the safe case is
 * guessed: exponent 0 means no subunit. An exponent of 2 or 3 is not a cent or
 * a fils in general (CZK is haléř, PLN is grosz), so those stay unknown and the
 * caller falls back rather than naming the wrong unit.
 */
function defaultKind(exponent: number): string | null | undefined {
  if (exponent === 0) return null;
  return undefined;
}

/**
 * Resolve the minor unit name for `currency` in `locale`.
 *
 * Four tiers, most specific first:
 *   1. an explicit override for the locale, then for the language; `null` there
 *      means the currency has no subunit in that language.
 *   2. the currency's subunit kind, from `data/subunit-kinds.json`, or a default
 *      from the exponent when the currency has no entry.
 *   3. the language's word for that kind, from `data/subunits.json`.
 *   4. the kind's international name, so a currency with a known kind never
 *      reaches the decimal reading only because a language lacks a word.
 *
 * Returns `null` for a currency that has no subunit, and `undefined` only when
 * the kind is unknown and no international name exists.
 */
export function lookupSubunit(
  currency: string,
  locale: string,
  exponent: number,
): PluralForms | null | undefined {
  const lang = language(locale);

  const localeOverride = overrides.subunits?.[locale]?.[currency];
  if (localeOverride !== undefined) return localeOverride;
  const languageOverride = overrides.subunits?.[lang]?.[currency];
  if (languageOverride !== undefined) return languageOverride;

  const entry = kinds.kinds[currency];
  const kind = entry !== undefined ? entry : defaultKind(exponent);
  if (kind === undefined) return undefined;
  if (kind === null) return null;

  const word = subunits.subunits[lang]?.[kind];
  if (word !== undefined) return word;

  return kinds.names[kind];
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
