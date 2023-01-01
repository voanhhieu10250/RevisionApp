import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  root: "./src/renderer",
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    outDir: "dist/renderer",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        dir: "./dist/renderer",
        entryFileNames: "[name].[hash].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  // fix for assets import in index.html
  experimental: {
    renderBuiltUrl(filename) {
      return filename;
    },
  },
});
