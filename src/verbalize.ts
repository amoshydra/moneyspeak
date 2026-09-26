import {
  canonicalLocale,
  deriveExponent,
  deriveName,
  deriveSymbol,
  formatInteger,
  isLatinScript,
  minusSign,
  selectPlural,
  selectPluralValue,
} from "./derive.js";
import { exponentOverride, localeProfile, lookupSubunit, nameOverride } from "./patch.js";
import type {
  MoneyInput,
  PluralCategory,
  PluralForms,
  ResolvedCurrency,
  Result,
  Source,
  Strategy,
  Stringable,
  VerbalizeOptions,
} from "./types.js";

/** Resolve everything the spoken form needs, deriving from `Intl` and patching the gaps. */
export function resolveCurrency(currency: string, locale?: string): ResolvedCurrency {
  const code = currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) {
    throw new RangeError(`currency must be a 3-letter ISO 4217 code, got ${JSON.stringify(currency)}`);
  }

  const loc = canonicalLocale(locale);
  const override = nameOverride(loc, code);
  const expOverride = exponentOverride(code);
  const exponent = expOverride ?? deriveExponent(loc, code);
  const subunit = lookupSubunit(code, loc, exponent) ?? null;
  const profile = localeProfile(loc);

  const sources: Record<string, Source> = {
    name: override ? "data" : "intl",
    exponent: expOverride !== undefined ? "data" : "intl",
  };
  if (subunit) sources.subunit = "data";

  return {
    code,
    locale: loc,
    symbol: deriveSymbol(loc, code),
    exponent,
    name: override ? { one: override, other: override } : deriveName(loc, code),
    subunit,
    split: profile.split ?? true,
    connector: profile.connector ?? "",
    sources,
  };
}

/** Expand exponential notation into a plain decimal string, exactly as written. */
function expandExponential(text: string): string {
  const match = /^([+-]?)(\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/.exec(text);
  if (!match) throw new TypeError(`invalid amount: ${JSON.stringify(text)}`);

  const sign = match[1] === "-" ? "-" : "";
  const integer = match[2] ?? "0";
  const fraction = match[3] ?? "";
  const digits = integer + fraction;
  const pointAt = integer.length + Number(match[4]);

  if (pointAt <= 0) return `${sign}0.${"0".repeat(-pointAt)}${digits}`;
  if (pointAt >= digits.length) return `${sign}${digits}${"0".repeat(pointAt - digits.length)}`;
  return `${sign}${digits.slice(0, pointAt)}.${digits.slice(pointAt)}`;
}

/**
 * Read any amount as a plain decimal string. The value is only ever read
 * through `toString`, so a string is exact, a bigint is exact, and a number is
 * expanded from its own shortest representation rather than re-parsed.
 */
function toPlainString(amount: Stringable): string {
  const text = amount.toString().trim();
  if (/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(text)) return text;
  if (/[eE]/.test(text)) return expandExponential(text);
  throw new TypeError(`invalid amount: ${JSON.stringify(text)}`);
}

interface Scaled {
  negative: boolean;
  major: bigint;
  minor: bigint;
}

/** Split an amount into integer major and minor units without floating point arithmetic. */
function scale(amount: Stringable, exponent: number): Scaled {
  const raw = toPlainString(amount);
  const match = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(raw);
  if (!match) throw new TypeError(`invalid amount: ${JSON.stringify(raw)}`);

  const negative = match[1] === "-";
  const integer = match[2] || "0";
  const fraction = (match[3] ?? "").padEnd(exponent + 1, "0");
  let major = BigInt(integer);

  if (exponent === 0) {
    if (Number(fraction[0] ?? "0") >= 5) major += 1n;
    return { negative, major, minor: 0n };
  }

  let minor = BigInt(fraction.slice(0, exponent) || "0");
  if (Number(fraction[exponent] ?? "0") >= 5) {
    minor += 1n;
    if (minor === 10n ** BigInt(exponent)) {
      minor = 0n;
      major += 1n;
    }
  }
  return { negative, major, minor };
}

function pick(forms: PluralForms, locale: string, value: bigint): string {
  return pickByCategory(forms, selectPlural(locale, value));
}

function pickByCategory(forms: PluralForms, category: PluralCategory): string {
  return forms[category] ?? forms.other;
}

function minorNumber(locale: string, minor: bigint): string {
  return new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 0 }).format(minor);
}

function displayString(
  resolved: ResolvedCurrency,
  negative: boolean,
  major: bigint,
  minor: bigint,
): string {
  // The visible form follows CLDR's convention for the currency (IDR shows no
  // fractions, KWD shows three), raised only when the amount has a fraction the
  // convention would round away. Built from the scaled bigint parts, not from a
  // Number, so a large amount keeps its digits.
  const displayDigits =
    new Intl.NumberFormat(resolved.locale, {
      style: "currency",
      currency: resolved.code,
    }).resolvedOptions().maximumFractionDigits ?? 0;
  const fractionDigits = minor !== 0n ? Math.max(displayDigits, resolved.exponent) : displayDigits;

  const zero = major === 0n && minor === 0n;
  const sign = negative && !zero ? minusSign(resolved.locale) : "";
  const majorText =
    sign +
    new Intl.NumberFormat(resolved.locale, { useGrouping: true, maximumFractionDigits: 0 }).format(major);
  const minorText =
    fractionDigits > 0
      ? new Intl.NumberFormat(resolved.locale, {
          useGrouping: false,
          minimumIntegerDigits: fractionDigits,
          maximumFractionDigits: 0,
        }).format(minor)
      : "";
  const decimalSeparator =
    new Intl.NumberFormat(resolved.locale).formatToParts(1.1).find((part) => part.type === "decimal")
      ?.value ?? ".";
  const numberText = fractionDigits > 0 ? `${majorText}${decimalSeparator}${minorText}` : majorText;

  // Place the symbol using the locale's own pattern, including the literal
  // between the symbol and the number.
  const parts = new Intl.NumberFormat(resolved.locale, {
    style: "currency",
    currency: resolved.code,
    currencyDisplay: "symbol",
  }).formatToParts(1);
  const currencyIndex = parts.findIndex((part) => part.type === "currency");
  const integerIndex = parts.findIndex((part) => part.type === "integer");
  if (currencyIndex === -1 || integerIndex === -1) return numberText;

  const symbol = parts[currencyIndex]?.value ?? "";
  const gap = parts
    .slice(Math.min(currencyIndex, integerIndex) + 1, Math.max(currencyIndex, integerIndex))
    .filter((part) => part.type === "literal")
    .map((part) => part.value)
    .join("");
  return currencyIndex < integerIndex ? `${symbol}${gap}${numberText}` : `${numberText}${gap}${symbol}`;
}

const WORD_JOINER = "\u2060";

function decimalNameString(
  resolved: ResolvedCurrency,
  negative: boolean,
  major: bigint,
  minor: bigint,
  forms: PluralForms,
  breakBeforeDecimal: boolean,
): string {
  // The name's plural depends on the whole decimal value, not the integer part:
  // French puts 1,5 in `one`.
  const name = pickByCategory(
    forms,
    selectPluralValue(resolved.locale, major, minor, resolved.exponent),
  );

  const majorText =
    (negative ? minusSign(resolved.locale) : "") + formatInteger(resolved.locale, major);
  const minorText = new Intl.NumberFormat(resolved.locale, {
    useGrouping: false,
    minimumIntegerDigits: resolved.exponent,
    maximumFractionDigits: 0,
  }).format(minor);
  const separator =
    new Intl.NumberFormat(resolved.locale).formatToParts(1.1).find((part) => part.type === "decimal")
      ?.value ?? ".";

  // Only an ASCII "." has the screen-reader bug, and a word joiner before it
  // stops the number being parsed so the synthesizer normalizes it itself.
  // Other separators (Arabic U+066B, for example) are left alone, because
  // TalkBack reads U+2060 aloud.
  const joiner = breakBeforeDecimal && separator === "." ? WORD_JOINER : "";
  const numberText =
    resolved.exponent > 0 ? `${majorText}${joiner}${separator}${minorText}` : majorText;

  // Place the name using the locale's own pattern. The name is the last
  // currency part: some locales put the symbol, or the code, before it, and
  // those prefixes must be left out rather than filled with the name again.
  const parts = new Intl.NumberFormat(resolved.locale, {
    style: "currency",
    currency: resolved.code,
    currencyDisplay: "name",
    minimumFractionDigits: resolved.exponent,
    maximumFractionDigits: resolved.exponent,
  }).formatToParts(1);
  const nameIndex = parts.reduce((acc, part, index) => (part.type === "currency" ? index : acc), -1);
  const integerIndex = parts.findIndex((part) => part.type === "integer");
  if (nameIndex === -1 || integerIndex === -1) return `${numberText} ${name}`;

  const gap = parts
    .slice(Math.min(nameIndex, integerIndex) + 1, Math.max(nameIndex, integerIndex))
    .filter((part) => part.type === "literal")
    .map((part) => part.value)
    .join("");
  return nameIndex < integerIndex ? `${name}${gap}${numberText}` : `${numberText}${gap}${name}`;
}

/**
 * Turn a currency amount into a string a speech synthesizer reads correctly.
 *
 * The digits are left to the synthesizer, which already reads numbers well.
 * What this supplies is the part every engine gets wrong: the currency words.
 */
export function verbalizeMoney(input: MoneyInput, options: VerbalizeOptions = {}): Result {
  const resolved = resolveCurrency(input.currency, options.locale ?? input.locale);
  const warnings: string[] = [];

  const { negative, major, minor } = scale(input.amount, resolved.exponent);

  const overrideSubunit =
    typeof options.subunit === "string" ? { one: options.subunit, other: options.subunit } : undefined;
  const subunitForms = options.subunit === false ? null : (overrideSubunit ?? resolved.subunit);
  const effectiveName = options.name ? { one: options.name, other: options.name } : resolved.name;
  const breakBeforeDecimal =
    options.decimalBreak === "auto" && !isLatinScript(resolved.locale);

  const requested = options.style ?? "auto";
  let strategy: Strategy;
  if (requested !== "auto") {
    strategy = requested;
  } else if (resolved.exponent === 0 || minor === 0n || options.subunit === false) {
    strategy = "major-only";
  } else if (resolved.split && subunitForms !== null) {
    strategy = "major-minor";
  } else {
    strategy = "decimal-name";
  }

  // A forced style can still be impossible: the currency may have no minor
  // unit, or no subunit name may resolve. Fall to the nearest shape that can
  // actually be spoken.
  if (strategy === "major-minor" && resolved.exponent === 0) {
    warnings.push(`${resolved.code} has no minor unit; using major-only`);
    strategy = "major-only";
  }
  if (strategy === "major-minor" && subunitForms === null) {
    if (options.subunit === false) {
      strategy = "major-only";
    } else {
      warnings.push(`no subunit name for ${resolved.code} in ${resolved.locale}; using decimal-name`);
      strategy = "decimal-name";
    }
  }
  if (strategy === "decimal-name" && resolved.exponent === 0) {
    warnings.push(`${resolved.code} has no minor unit; using major-only`);
    strategy = "major-only";
  }
  if (
    strategy === "decimal-name" &&
    requested === "auto" &&
    resolved.exponent > 0 &&
    minor > 0n &&
    resolved.split &&
    subunitForms === null
  ) {
    warnings.push(`no subunit name for ${resolved.code} in ${resolved.locale}; using decimal-name`);
  }

  const majorName = pick(effectiveName, resolved.locale, major);
  const sign = negative ? "-" : "";
  const connector = options.connector ?? resolved.connector;

  let spoken: string;
  if (strategy === "major-only") {
    // -0.004 rounds to zero, and "-0 US dollars" is wrong.
    const majorSign = major === 0n ? "" : sign;
    spoken = `${majorSign}${formatInteger(resolved.locale, major)} ${majorName}`;
  } else if (strategy === "major-minor") {
    const forms = subunitForms as PluralForms;
    const minorName = pick(forms, resolved.locale, minor);
    const minorText = `${negative && major === 0n ? "-" : ""}${minorNumber(resolved.locale, minor)} ${minorName}`;
    if (major === 0n) {
      spoken = minorText;
    } else {
      const join = connector ? ` ${connector}` : "";
      spoken = `${sign}${formatInteger(resolved.locale, major)} ${majorName}${join} ${minorText}`;
    }
  } else {
    spoken = decimalNameString(resolved, negative, major, minor, effectiveName, breakBeforeDecimal);
  }

  // A code with no CLDR name resolves to the code itself, and some names embed
  // the code (`BAM`) or carry it in a non-`other` form (`XSU`), so the check is
  // on the finished string rather than on one form of the name.
  if (new RegExp(`\\b${resolved.code}\\b`).test(spoken)) {
    warnings.push(
      `the spoken form contains the ISO code ${resolved.code} for ${resolved.locale}; a reader may spell it out`,
    );
  }

  return { spoken, display: displayString(resolved, negative, major, minor), strategy, warnings };
}
