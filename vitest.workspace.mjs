import { defineWorkspace } from "vitest/config";
import * as path from "path";

export default defineWorkspace([
  {
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
  },
  {
    test: {
      name: "browser",
      include: ["test/browser/**/*.{test,spec}.js"],
      browser: {
        provider: "playwright",
        enabled: true,
        name: "chromium",
      },
      globalSetup: "./global-setup.mjs",
    },
  },
]);
