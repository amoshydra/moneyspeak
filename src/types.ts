export interface MoneyInput {
  /** Amount in major units, e.g. `123.45`. Use a string or bigint for very large values. */
  amount: number | string | bigint;
  /** ISO 4217 code, e.g. `"SGD"`. */
  currency: string;
  /** BCP 47 tag. Defaults to the runtime locale. */
  locale?: string;
}

export type Strategy = "major-minor" | "decimal-name" | "major-only";

export interface VerbalizeOptions {
  /** Force a strategy. Defaults to `"auto"`. */
  style?: "auto" | Strategy;
  /** Replace the derived spoken currency name. */
  name?: string;
  /** Replace the subunit name, or disable the minor unit with `false`. */
  subunit?: string | false;
  /** Replace the connector between major and minor. */
  connector?: string;
  /**
   * Insert an invisible word joiner before the decimal separator in `spoken`
   * for non-Latin scripts, so a screen reader does not parse the number and
   * insert an English "point". `"auto"` (default) does this; `"none"` disables.
   */
  decimalBreak?: "auto" | "none";
  /** BCP 47 tag; overrides `input.locale`. */
  locale?: string;
}

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

/** CLDR plural forms. `other` is required; the rest depend on the locale. */
export type PluralForms = { other: string } & Partial<
  Record<Exclude<PluralCategory, "other">, string>
>;

export type Source = "intl" | "data";

export interface ResolvedCurrency {
  code: string;
  locale: string;
  symbol: string;
  /** Fraction digits used for speech. */
  exponent: number;
  name: PluralForms;
  subunit: PluralForms | null;
  order: "prefix" | "suffix";
  /** Whether this locale naturally splits an amount into major and minor units. */
  split: boolean;
  connector: string;
  /** Where each value came from: derived from `Intl`, or shipped in `data/`. */
  sources: Record<string, Source>;
}

export interface Result {
  /** The string to hand a speech synthesizer. */
  spoken: string;
  /** The conventional visible form for the locale. */
  display: string;
  strategy: Strategy;
  warnings: string[];
}

export interface ParsedMoney {
  amount: string;
  currency: string;
  locale: string;
  warnings: string[];
}
