import { defineConfig } from "vite";

// Builds a single ES module straight into the integration's www folder,
// which the integration serves and registers in every dashboard.
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "terral-home.js",
    },
    outDir: "../custom_components/terral_home/www",
    emptyOutDir: false,
    target: "es2021",
    sourcemap: false,
  },
});
