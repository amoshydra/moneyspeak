// Compare the hand-written data against CLDR and ISO 4217.
//
//   - plural categories: the draft subunit entries carry { one, other }.
//     CLDR (via Intl.PluralRules) may require more for the locale.
//   - exponent: Intl reports CLDR's display digits, which are not always the
//     ISO 4217 minor unit.
//
// Usage: node scripts/compare-data.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const subunits = JSON.parse(readFileSync(join(root, "data/subunits.json"), "utf8")).subunits;
const overrides = JSON.parse(readFileSync(join(root, "data/overrides.json"), "utf8"));

// ISO 4217 minor units, from the standard's "Minor unit" column.
// 0 means no minor unit. The names of minor units are not in the standard.
const ISO_MINOR_UNITS = {
  USD: 2, EUR: 2, GBP: 2, JPY: 0, CNY: 2, TWD: 2, HKD: 2, SGD: 2, MYR: 2,
  IDR: 2, INR: 2, THB: 2, KRW: 0, VND: 0, AUD: 2, CAD: 2, NZD: 2, CHF: 2,
  ZAR: 2, PHP: 2, SEK: 2, NOK: 2, DKK: 2, KWD: 3, CLF: 4, ISK: 0,
};

const categoriesFor = (locale) =>
  new Intl.PluralRules(locale).resolvedOptions().pluralCategories;

console.log("== plural categories: draft { one, other } vs CLDR ==\n");
const missing = [];
for (const [currency, byLocale] of Object.entries(subunits)) {
  if (byLocale === null) continue;
  for (const [lang, forms] of Object.entries(byLocale)) {
    const needed = categoriesFor(lang);
    const have = Object.keys(forms);
    const gaps = needed.filter((category) => !have.includes(category));
    if (gaps.length > 0) {
      missing.push({ currency, lang, needed, have, gaps });
    }
  }
}
if (missing.length === 0) {
  console.log("  every draft entry covers the CLDR categories for its locale\n");
} else {
  for (const row of missing) {
    console.log(
      `  ${row.currency} ${row.lang}: CLDR needs [${row.needed.join(", ")}], draft has [${row.have.join(", ")}], missing [${row.gaps.join(", ")}]`,
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
    mismatch.push({ currency, intlDigits, iso, override });
  }
}
if (mismatch.length === 0) {
  console.log("  no mismatches\n");
} else {
  for (const row of mismatch) {
    const handled = row.override === row.iso ? "overridden" : "NOT overridden";
    console.log(
      `  ${row.currency}: Intl=${row.intlDigits}, ISO=${row.iso} (${handled})`,
    );
  }
}

console.log("\n== locale coverage of the subunit draft ==\n");
const languages = new Set();
for (const byLocale of Object.values(subunits)) {
  if (byLocale === null) continue;
  for (const lang of Object.keys(byLocale)) languages.add(lang);
}
console.log(`  languages covered: ${[...languages].sort().join(", ")}`);
