// node-red-editor.test.ts
import { test, expect } from "vitest";
import { chromium } from "playwright";

test("should open Node-RED editor", async () => {
  const browser = await chromium.launch(); // Launch a Chromium instance
  const page = await browser.newPage(); // Open a new browser page

  // Navigate to Node-RED editor on localhost (default port is 1880)
  await page.goto("http://localhost:1880");

  // Check that the editor's title is present
  const title = await page.title();
  expect(title).toContain("Node-RED");

  // Close the browser after the test
  await browser.close();
});
