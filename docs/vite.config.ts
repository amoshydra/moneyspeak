import { defineConfig } from "vite";

// Vite resolves its config relative to the root passed on the command line
// (`vite docs`), so this file is the one that applies to the docs app.
export default defineConfig({
  base: "./",
  build: {
    outDir: "../docs-dist",
    emptyOutDir: true,
  },
});
