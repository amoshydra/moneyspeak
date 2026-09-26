// Compare the hand-written data against CLDR and ISO 4217.
//
//   - plural categories: the draft subunit words carry { one, other }.
//     CLDR (via Intl.PluralRules) may require more for the language.
//   - exponent: Intl reports CLDR's display digits, which are not always the
//     ISO 4217 minor unit.
//
// Usage: node scripts/compare-data.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const subunits = JSON.parse(readFileSync(join(root, "data/subunits.json"), "utf8")).subunits;
const kindFile = JSON.parse(readFileSync(join(root, "data/subunit-kinds.json"), "utf8"));
const kinds = kindFile.kinds;
const kindNames = kindFile.names;
const overrides = JSON.parse(readFileSync(join(root, "data/overrides.json"), "utf8"));

// ISO 4217 minor units, from the standard's "Minor unit" column.
// 0 means no minor unit. The names of minor units are not in the standard.
const ISO_MINOR_UNITS = {
  USD: 2, EUR: 2, GBP: 2, JPY: 0, CNY: 2, TWD: 2, HKD: 2, SGD: 2, MYR: 2,
  IDR: 2, INR: 2, THB: 2, KRW: 0, VND: 0, AUD: 2, CAD: 2, NZD: 2, CHF: 2,
  ZAR: 2, PHP: 2, SEK: 2, NOK: 2, DKK: 2, KWD: 3, CLF: 4, ISK: 0,
  LKR: 2, KHR: 2, LAK: 2, MMK: 2,
};

// Currencies where ISO 4217 names a minor unit that is no longer in use, so the
// spoken form deliberately has none and CLDR's 0 is kept.
const NO_SUBUNIT_IN_PRACTICE = {
  LAK: "the att is no longer in regular use",
  MMK: "the pya is no longer in regular use",
};

const categoriesFor = (locale) =>
  new Intl.PluralRules(locale).resolvedOptions().pluralCategories;

console.log("== plural categories: draft forms vs CLDR ==\n");
const missing = [];
for (const [lang, byKind] of Object.entries(subunits)) {
  for (const [kind, forms] of Object.entries(byKind)) {
    const needed = categoriesFor(lang);
    const have = Object.keys(forms);
    const gaps = needed.filter((category) => !have.includes(category));
    if (gaps.length > 0) {
      missing.push({ lang, kind, needed, have, gaps });
    }
  }
}
if (missing.length === 0) {
  console.log("  every draft entry covers the CLDR categories for its language\n");
} else {
  for (const row of missing) {
    console.log(
      `  ${row.lang} ${row.kind}: CLDR needs [${row.needed.join(", ")}], draft has [${row.have.join(", ")}], missing [${row.gaps.join(", ")}]`,
    );
  }
  console.log(`\n  ${missing.length} entry/entries need more categories\n`);
}

console.log("== exponent: Intl (CLDR digits) vs ISO 4217 ==\n");
const mismatch = [];
for (const currency of Object.keys(ISO_MINOR_UNITS)) {
  const intlDigits = new Intl.NumberFormat("en", { style: "currency", currency })
    .resolvedOptions().maximumFractionDigits;
  const iso = ISO_MINOR_UNITS[currency];
  const override = overrides.exponent?.[currency];
  if (intlDigits !== iso) {
    mismatch.push({ currency, intlDigits, iso, override, note: NO_SUBUNIT_IN_PRACTICE[currency] });
  }
}
if (mismatch.length === 0) {
  console.log("  no mismatches\n");
} else {
  for (const row of mismatch) {
    const handled =
      row.override === row.iso
        ? "overridden"
        : row.note
          ? `deliberate: ${row.note}`
          : "NOT overridden";
    console.log(
      `  ${row.currency}: Intl=${row.intlDigits}, ISO=${row.iso} (${handled})`,
    );
  }
}

console.log("\n== coverage of the subunit model ==\n");
const languages = Object.keys(subunits).sort();
console.log(`  languages covered: ${languages.join(", ")}`);

const words = new Set();
for (const byKind of Object.values(subunits)) {
  for (const kind of Object.keys(byKind)) words.add(kind);
}
const mappedKinds = new Set();
const noSubunit = [];
for (const [currency, kind] of Object.entries(kinds)) {
  if (kind === null) noSubunit.push(currency);
  else mappedKinds.add(kind);
}
console.log(`  kinds mapped by a currency: ${[...mappedKinds].sort().join(", ")}`);
console.log(`  currencies with no subunit (exponent 0): ${noSubunit.sort().join(", ")}`);

const wordless = [...mappedKinds].filter((kind) => !words.has(kind)).sort();
const named = new Set(Object.keys(kindNames));
const resolvedByName = wordless.filter((kind) => named.has(kind));
const unnamed = wordless.filter((kind) => !named.has(kind));
if (resolvedByName.length > 0) {
  console.log(
    `  kinds with no language word, resolved by the international name: ${resolvedByName.join(", ")}`,
  );
}
if (unnamed.length > 0) {
  console.log(
    `  kinds with neither a word nor an international name (always fall back): ${unnamed.join(", ")}`,
  );
} else {
  console.log("  every mapped kind resolves for every language");
}
