import fs from "fs";
import deepmerge from "deepmerge";
import { lilconfig } from "lilconfig";
import {
  PROJECT_ROOT_DIRECTORY,
  BUILDER_NAME,
  BUILDER_DEFAULT_NRG_CONFIG,
} from "./constants.mjs";

let lilconfigInstance;
let configFilepath;

function getLilconfigInstance() {
  if (lilconfigInstance) {
    return lilconfigInstance;
  }

  lilconfigInstance = lilconfig(BUILDER_NAME, {
    searchPlaces: [
      "package.json",
      `.${BUILDER_NAME}rc.json`,
      `${BUILDER_NAME}.config.js`,
      `${BUILDER_NAME}.config.cjs`,
      `${BUILDER_NAME}.config.mjs`,
    ],
    stopDir: PROJECT_ROOT_DIRECTORY,
    cache: false,
  });

  lilconfigInstance.clearCaches;
  return lilconfigInstance;
}

// TODO: define schema, parse, verify version
async function loadConfig() {
  const lilconfigInstance = getLilconfigInstance();

  let projectConfig;
  if (configFilepath) {
    projectConfig = await lilconfigInstance.load(configFilepath);
  } else {
    const configFileSearchResult = await lilconfigInstance.search();
    if (!configFileSearchResult) throw new Error("not an nrg project");
    projectConfig = configFileSearchResult;
  }

  const defaultConfig = JSON.parse(
    fs.readFileSync(BUILDER_DEFAULT_NRG_CONFIG, {
      encoding: "utf-8",
    })
  );

  const mergedConfig = deepmerge(defaultConfig, projectConfig.config);
  configFilepath = projectConfig.filepath;
  return {
    filepath: projectConfig.filepath,
    config: mergedConfig,
  };
}

export { loadConfig };
