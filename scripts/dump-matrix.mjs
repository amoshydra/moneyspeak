// Dump the full locale x currency x amount matrix for review when the runtime
// or the data changes. Informational: it never fails, it is a record to diff.
//
// Usage: pnpm build && node scripts/dump-matrix.mjs > matrix.txt
//
// Run it on two runtimes and diff the files to see CLDR drift, for example
// between two Node versions or between Node and a browser.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { verbalizeMoney } from "../dist/index.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const matrix = JSON.parse(readFileSync(join(root, "data/example-matrix.json"), "utf8"));

const AMOUNTS = ["0", "0.45", "1.01", "123.45", "-123.45"];

console.log(
  [
    `# node\t${process.version}`,
    `# icu\t${process.versions.icu ?? "unknown"}`,
    `# date\t${new Date().toISOString()}`,
  ].join("\n"),
);
console.log(["locale", "currency", "amount", "strategy", "spoken", "display"].join("\t"));

for (const locale of matrix.locales) {
  for (const currency of matrix.currencies) {
    for (const amount of AMOUNTS) {
      const result = verbalizeMoney({ amount, currency, locale });
      console.log(
        [locale, currency, amount, result.strategy, result.spoken, result.display].join("\t"),
      );
    }
  }
}
