import fs from "fs";
import path from "path";
import { build } from "./builder.mjs";
import { loadConfig } from "./config.mjs";
import { startNodeRed } from "./node-red.mjs";
import {
  PROJECT_ROOT_DIRECTORY,
  SRC_DIRECTORY,
  DIST_DIRECTORY,
  NODE_RED_EXECUTABLE,
  NODE_RED_SETTINGS_FILE,
  NODE_RED_DIRECTORY,
} from "./constants.mjs";

async function run(config) {
  await build(config, true);
  await startNodeRed(config);
}

function watchFiles(config, configFilepath) {
  let debounceTimeout;

  let _config = config;
  const onChange = async (eventType, filename) => {
    if (filename) {
      console.log(`File changed: ${filename}`);
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(async () => {
        if (filename === path.basename(configFilepath)) {
          const { config } = await loadConfig();
          _config = config;
        }
        await run(_config);
      }, 100);
    }
  };

  fs.watch(SRC_DIRECTORY, { recursive: true }, onChange);
  fs.watch(configFilepath, onChange);
}

const main = async () => {
  try {
    const { config, filepath } = await loadConfig();
    watchFiles(config, filepath);
    await run(config);
  } catch (err) {
    console.error("something went wrong", err);
    process.exit(1);
  }
};

main();
