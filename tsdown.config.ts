import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/dom.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
});
