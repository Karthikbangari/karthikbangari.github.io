import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// The pipeline app is built as an EMBEDDABLE widget for the existing static
// site. Production output goes to ../assets/cicd-pipeline/ with STABLE entry
// filenames so index.html can reference it permanently. Dev mode serves the
// local host page (index.html) with HMR and a mock valley background.
export default defineConfig(({ command }) => ({
  // In build, chunks/assets are served from the Pages sub-path; in dev, root.
  base: command === "build" ? "/assets/cicd-pipeline/" : "/",
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, "../assets/cicd-pipeline"),
    emptyOutDir: true,
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      // Entry is the embed bootstrap, NOT an html file — this produces a
      // self-mounting widget script.
      input: resolve(__dirname, "src/embed.tsx"),
      output: {
        entryFileNames: "cicd-pipeline.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: (asset) =>
          asset.names?.some((n) => n.endsWith(".css"))
            ? "cicd-pipeline.css"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
}));
