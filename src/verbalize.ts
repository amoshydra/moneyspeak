import {
  canonicalLocale,
  deriveExponent,
  deriveName,
  deriveOrder,
  deriveSymbol,
  formatInteger,
  selectPlural,
} from "./derive.js";
import { exponentOverride, localeProfile, lookupSubunit, nameOverride } from "./patch.js";
import type {
  MoneyInput,
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
  const subunit = lookupSubunit(code, loc) ?? null;
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
    exponent: expOverride ?? deriveExponent(loc, code),
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
    return amount.toFixed(20).replace(/0+$/, "").replace(/\.$/, "");
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
  return selectPlural(locale, value) === "one" ? forms.one : forms.other;
}

function minorNumber(locale: string, minor: bigint): string {
  return new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 0 }).format(minor);
}

function displayString(resolved: ResolvedCurrency, amount: number | string | bigint): string {
  return new Intl.NumberFormat(resolved.locale, {
    style: "currency",
    currency: resolved.code,
    currencyDisplay: "symbol",
    minimumFractionDigits: resolved.exponent,
    maximumFractionDigits: resolved.exponent,
  }).format(Number(toPlainString(amount)));
}

function decimalNameString(
  resolved: ResolvedCurrency,
  amount: number | string | bigint,
  name: string,
): string {
  const parts = new Intl.NumberFormat(resolved.locale, {
    style: "currency",
    currency: resolved.code,
    currencyDisplay: "name",
    minimumFractionDigits: resolved.exponent,
    maximumFractionDigits: resolved.exponent,
  }).formatToParts(Number(toPlainString(amount)));
  return parts.map((part) => (part.type === "currency" ? name : part.value)).join("");
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

  if (strategy === "major-minor" && subunitForms === null) {
    warnings.push(`no subunit name for ${resolved.code} in ${resolved.locale}; using decimal-name`);
    strategy = "decimal-name";
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
    spoken = `${sign}${formatInteger(resolved.locale, major)} ${majorName}`;
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
    spoken = decimalNameString(resolved, input.amount, effectiveName.other);
  }

  return { spoken, display: displayString(resolved, input.amount), strategy, warnings };
}
