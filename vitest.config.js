import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/nodes": path.resolve(__dirname, "./src/nodes"),
    },
  },
  test: {
    name: "unit",
    include: ["test/unit/nodes/**/*.{test,spec}.js"],
    globals: true,
    environment: "node",
    reporters: ["html"],
    coverage: {
      enabled: true,
      provider: "istanbul",
      reportsDirectory: "./coverage",
      reporter: ["html"],
    },
  },
});
