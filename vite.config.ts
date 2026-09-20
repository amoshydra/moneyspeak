import { defineConfig } from "vite";

// The docs app lives in docs/. Run it with `vite docs` and build with
// `vite build docs`; keeping `root` out of here so vitest uses the repo root.
export default defineConfig({
  build: {
    outDir: "../docs-dist",
    emptyOutDir: true,
  },
});
