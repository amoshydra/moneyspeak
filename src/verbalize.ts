import {
  canonicalLocale,
  deriveExponent,
  deriveName,
  deriveOrder,
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
    order: deriveOrder(loc, code),
    split: profile.split ?? true,
    connector: profile.connector ?? "",
    sources,
  };
}

function toPlainString(amount: number | string | bigint): string {
  if (typeof amount === "bigint") return amount.toString();
  if (typeof amount === "number") {
    if (!Number.isFinite(amount)) throw new RangeError(`amount must be finite, got ${amount}`);
    const text = String(amount);
    if (!/[eE]/.test(text)) return text;
    // `toFixed` also returns exponential notation for |x| >= 1e21, so expand
    // the integer case directly instead of relying on it.
    if (Number.isInteger(amount)) return BigInt(amount).toString();
    throw new RangeError(`amount ${text} is too large to represent exactly; pass a string`);
  }
  return amount.trim();
}

interface Scaled {
  negative: boolean;
  major: bigint;
  minor: bigint;
}

/** Split an amount into integer major and minor units without floating point arithmetic. */
function scale(amount: number | string | bigint, exponent: number): Scaled {
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
  amount: number | string | bigint,
  minor: bigint,
): string {
  // The visible form follows CLDR's convention for the currency (IDR shows no
  // fractions, KWD shows three), which is not necessarily the speech exponent
  // we overrode. Raise it only when the amount has a fraction the convention
  // would round away, so `IDR 123` stays `Rp 123` but `IDR 123.45` keeps its sen.
  const displayDigits =
    new Intl.NumberFormat(resolved.locale, {
      style: "currency",
      currency: resolved.code,
    }).resolvedOptions().maximumFractionDigits ?? 0;
  const fractionDigits = minor !== 0n ? Math.max(displayDigits, resolved.exponent) : displayDigits;

  return new Intl.NumberFormat(resolved.locale, {
    style: "currency",
    currency: resolved.code,
    currencyDisplay: "symbol",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Number(toPlainString(amount)));
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
  // Take the shape (order, spacing, literals) from Intl, then substitute our
  // own digit strings. That keeps the locale's layout while dropping grouping
  // and avoiding the precision loss of converting the amount to a Number.
  const template = new Intl.NumberFormat(resolved.locale, {
    style: "currency",
    currency: resolved.code,
    currencyDisplay: "name",
    minimumFractionDigits: resolved.exponent,
    maximumFractionDigits: resolved.exponent,
  }).formatToParts(1);

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

  return template
    .map((part) => {
      switch (part.type) {
        case "integer":
          return majorText;
        case "fraction":
          return minorText;
        case "currency":
          return name;
        case "group":
          return "";
        case "decimal":
          // Only an ASCII "." has the screen-reader bug, and a word joiner
          // before it stops the number being parsed so the synthesizer
          // normalizes it itself. Other separators (Arabic U+066B, for example)
          // are left alone, because TalkBack reads U+2060 aloud.
          return breakBeforeDecimal && part.value === "." ? WORD_JOINER + part.value : part.value;
        default:
          return part.value;
      }
    })
    .join("");
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

  // A code with no CLDR data resolves to the code itself as the name, which is
  // the one case where the spoken form would contain a bare ISO code.
  const resolvedName = resolved.name.other.trim();
  if (resolvedName === "" || resolvedName.toUpperCase() === resolved.code) {
    warnings.push(
      `no currency name for ${resolved.code} in ${resolved.locale}; the code will be read as letters`,
    );
  }

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

  return { spoken, display: displayString(resolved, input.amount, minor), strategy, warnings };
}
