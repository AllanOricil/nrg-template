import { test, expect } from "@playwright/test";
import {
  createFlow,
  dragNodeToFlow,
  deployAllFlows,
  deployModifiedFlows,
  deployModifiedNodes,
} from "./utils";

// NOTE: these tests are experiments to validate utility functions. They are not asserting anything related to the node yet. I plan to write functions that will enable validating all possible node states and behaviors when using the editor.

// TODO: possible assertions
// 1 - node form (states and behaviors)
// 2 - node label in the palette and in the canvas
// 3 - node has labels for input and output
// 4 - node has an image
// 5 - node has documentation
// 6 - i18n
// 7 - node states in the canvas (e.g display state when something is loading)

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Node-RED : Flow 1/);
});

test("get started link", async ({ page }) => {
  await page.goto("/");
  await dragNodeToFlow(page, "node-1");

  await createFlow(page);
});

test("deploy all flows", async ({ page }) => {
  await page.goto("/");
  await dragNodeToFlow(page, "node-1");

  await deployAllFlows(page);
});

test("deploy modified flows", async ({ page }) => {
  await page.goto("/");
  await dragNodeToFlow(page, "node-1");

  await deployModifiedFlows(page);
});

test("deploy modified nodes", async ({ page }) => {
  await page.goto("/");
  await dragNodeToFlow(page, "node-1");

  await deployModifiedNodes(page);
});
