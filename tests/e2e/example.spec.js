import { test, expect } from "@playwright/test";
import {
  createFlow,
  dragNodeToFlow,
  deployAllFlows,
  deployModifiedFlows,
  deployModifiedNodes,
} from "./utils";

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
