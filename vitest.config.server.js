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
    include: ["tests/unit/nodes/**/server/*.{test,spec}.js"],
    globals: true,
    environment: "node",
    coverage: {
      provider: "istanbul",
      enabled: true,
      include: ["src/nodes/**/server/**/*"],
      reportsDirectory: "./coverage/server",
    },
  },
});
