import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// This is the source for the main karthikbangari.github.io page. GitHub Pages
// serves the repo root of `main` directly (no Actions build step), so
// production output is written straight to the repo root: index.html at
// root, hashed JS/CSS under root/assets/. emptyOutDir is OFF on purpose —
// outDir IS the repo root, and clearing it would wipe unrelated files
// (favicon, .git, references/, this very source folder's sibling dirs).
// Old/removed assets are cleaned up manually as part of the cutover, not by
// this config.
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, ".."),
    emptyOutDir: false,
    assetsDir: "assets",
    sourcemap: false,
  },
});
