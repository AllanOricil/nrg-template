import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue2";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/nodes": path.resolve(__dirname, "./src/nodes"),
    },
  },
  test: {
    name: "unit",
    include: ["tests/unit/nodes/**/client/*.{test,spec}.js"],
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      enabled: true,
      include: ["src/nodes/**/client/**/*"],
      reportsDirectory: "./coverage/client",
    },
  },
});
