import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";

export default defineConfig({
  root: "./src/renderer",
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: false,
  },
  // fix for assets import in index.html
  experimental: {
    renderBuiltUrl(filename) {
      return filename;
    },
  },
});
