import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/nodes": path.resolve(__dirname, "./src/nodes"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "c8",
      reportsDirectory: "./coverage",
    },
  },
});
