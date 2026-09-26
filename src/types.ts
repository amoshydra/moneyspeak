/**
 * Anything whose `toString` yields a plain decimal string. `string`, `number`,
 * `bigint`, and decimal-library values all satisfy this.
 */
export interface Stringable {
  toString(): string;
}

export interface MoneyInput {
  /**
   * Amount in major units. A `string` is the safest, because it is exact. A
   * `number`, `bigint`, or any value with a `toString` that yields a plain
   * decimal (including a decimal library's value) also works; the library
   * always reads it as text, never through `Number`.
   */
  amount: Stringable;
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
   * VoiceOver workaround, off by default. `"auto"` inserts an invisible word
   * joiner (U+2060) before an ASCII "." for non-Latin scripts, which stops
   * VoiceOver reading the "." as an English "point". Measured on macOS 26.5.2
   * it turns `123.45人民币` into 点四五, and iOS 27 no longer needs it.
   * Kept off because it is harmful elsewhere: on Google TTS it drops the
   * fractional part entirely, and TalkBack reads U+2060 aloud as "word joiner".
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
}
