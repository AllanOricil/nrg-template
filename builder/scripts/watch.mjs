import fs from "fs";
import path from "path";
import { build } from "./builder.mjs";
import { loadConfig } from "./config.mjs";
import { startNodeRed } from "./node-red.mjs";
import detectPort from "detect-port";
import {
  PROJECT_ROOT_DIRECTORY,
  SRC_DIRECTORY,
  DIST_DIRECTORY,
  NODE_RED_EXECUTABLE,
  NODE_RED_SETTINGS_FILE,
  NODE_RED_DIRECTORY,
} from "./constants.mjs";

async function run(config) {
  console.log("configuring watch port");
  const port = await detectPort(config.watch?.port || 3000);
  config.watch = {
    port,
  };

  await build(config);
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
          // NOTE: if config file is an esm module, I need to wait for this change to be released https://github.com/antonk52/lilconfig/pull/54
          const { config } = await loadConfig();
          _config = config;
        }
        await run(_config);
      }, 100);
    }
  };

  if (Array.isArray(config.watch?.paths)) {
    config.watch.paths.forEach((path) => {
      if (fs.existsSync(path)) {
        fs.watch(path, { recursive: true }, onChange);
      }
    });
  }
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
