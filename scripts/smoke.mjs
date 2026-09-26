// Packaging smoke test: pack the library, install the tarball into a temp
// directory, and load it the way a consumer does. The unit suite imports src/,
// so it passes even when the published artifact is broken; this catches a wrong
// exports map, a file missing from `files`, a broken CJS build, or a stale dist.
//
// Usage: pnpm smoke

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (args, cwd) =>
  execFileSync("npm", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

let failures = 0;
function check(label, fn) {
  try {
    fn();
    console.log(`  ok    ${label}`);
  } catch (error) {
    failures += 1;
    console.log(`  FAIL  ${label}: ${error.message}`);
  }
}

// `npm pack` runs prepack, which builds dist.
const tarball = run(["pack", "--silent"], root).trim().split("\n").pop();
const tarballPath = join(root, tarball);
console.log(`packed ${tarball}`);

const dir = mkdtempSync(join(tmpdir(), "moneyspeak-smoke-"));
writeFileSync(
  join(dir, "package.json"),
  JSON.stringify({ name: "smoke", private: true, type: "module" }),
);
run(["install", "--silent", "--no-audit", "--no-fund", tarballPath], dir);

const pkgDir = join(dir, "node_modules", "moneyspeak");
const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));

// Every non-JSON path the exports map names must exist in the tarball.
const paths = (value) =>
  typeof value === "string" ? [value] : Object.values(value).flatMap(paths);
for (const [key, value] of Object.entries(pkg.exports)) {
  for (const target of paths(value).filter((p) => !p.endsWith(".json"))) {
    check(`exports["${key}"] -> ${target}`, () => {
      if (!existsSync(join(pkgDir, target))) throw new Error("missing file");
    });
  }
}

// Load each entry point as a consumer would.
const probe = (file) =>
  execFileSync(process.execPath, [file], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
writeFileSync(
  join(dir, "esm.mjs"),
  `import { verbalizeMoney } from "moneyspeak";
const spoken = verbalizeMoney({ amount: "123.45", currency: "SGD", locale: "en-US" }).spoken;
if (spoken !== "123 Singapore dollars and 45 cents") throw new Error("unexpected: " + spoken);
`,
);
writeFileSync(
  join(dir, "cjs.cjs"),
  `const { parseMoney } = require("moneyspeak");
const { currency } = parseMoney("SGD123.45", "en-SG");
if (currency !== "SGD") throw new Error("unexpected: " + currency);
`,
);
writeFileSync(
  join(dir, "dom.mjs"),
  `import { setAccessibleMoney, defineCurrencyAmount, srOnlyCss } from "moneyspeak/dom";
if (typeof setAccessibleMoney !== "function") throw new Error("setAccessibleMoney");
if (typeof defineCurrencyAmount !== "function") throw new Error("defineCurrencyAmount");
if (typeof srOnlyCss !== "string") throw new Error("srOnlyCss");
`,
);
check('import "moneyspeak" (ESM)', () => probe(join(dir, "esm.mjs")));
check('require("moneyspeak") (CJS)', () => probe(join(dir, "cjs.cjs")));
check('import "moneyspeak/dom"', () => probe(join(dir, "dom.mjs")));

// The data files ship so a consumer can import them by subpath.
for (const file of [
  "data/subunits.json",
  "data/subunit-kinds.json",
  "data/overrides.json",
  "data/example-matrix.json",
]) {
  check(`ships ${file}`, () => {
    if (!existsSync(join(pkgDir, file))) throw new Error("missing");
  });
}

rmSync(dir, { recursive: true, force: true });
rmSync(tarballPath, { force: true });

if (failures > 0) {
  console.log(`\n${failures} smoke check(s) failed`);
  process.exit(1);
}
console.log("\nall smoke checks passed");
