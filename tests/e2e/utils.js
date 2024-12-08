import { selectors } from "./constants";

function getNodeSelector(node) {
  return `${selectors.PALETTE} [data-palette-type="${node}"]`;
}

async function dragNodeToFlow(page, node) {
  const nodeSelector = getNodeSelector(node);
  await page.waitForSelector(nodeSelector);

  const target = await page.locator(selectors.FLOW);
  const source = await page.locator(getNodeSelector(node));

  await source.dragTo(target, {
    targetPosition: {
      x: 0,
      y: 1,
    },
  });
}

async function createFlow(page) {
  await page.waitForSelector(selectors.ADD_FLOW_BUTTON);
  await page.locator(selectors.ADD_FLOW_BUTTON).click();
}

async function clickDeployOptionsButton(page) {
  await page.waitForSelector(selectors.DEPLOY_OPTIONS_BUTTON);
  await page.locator(selectors.DEPLOY_OPTIONS_BUTTON).click();
}

async function clickDeployButton(page) {
  await page.waitForSelector(selectors.DEPLOY_BUTTON);
  await page.locator(selectors.DEPLOY_BUTTON).click();
}

async function deployAllFlows(page) {
  await clickDeployOptionsButton(page);

  await page.waitForSelector(selectors.DEPLOY_OPTION_FULL);
  await page.locator(selectors.DEPLOY_OPTION_FULL).click();

  await clickDeployButton(page);
}

async function deployModifiedFlows(page) {
  await clickDeployOptionsButton(page);

  await page.waitForSelector(selectors.DEPLOY_OPTION_MODIFIED_FLOWS);
  await page.locator(selectors.DEPLOY_OPTION_MODIFIED_FLOWS).click();

  await clickDeployButton(page);
}

async function deployModifiedNodes(page) {
  await clickDeployOptionsButton(page);

  await page.waitForSelector(selectors.DEPLOY_OPTION_MODIFIED_NODES);
  await page.locator(selectors.DEPLOY_OPTION_MODIFIED_NODES).click();

  await clickDeployButton(page);
}

export {
  createFlow,
  dragNodeToFlow,
  deployAllFlows,
  deployModifiedFlows,
  deployModifiedNodes,
};
