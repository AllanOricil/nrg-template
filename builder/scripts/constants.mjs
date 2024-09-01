import path from "path";
import { packageDirectorySync } from "pkg-dir";

export const BUILDER_NAME = "nrg";

export const PROJECT_ROOT_DIRECTORY = packageDirectorySync();

export const BUILDER_ROOT_DIRECTORY = path.resolve(
  PROJECT_ROOT_DIRECTORY,
  "builder"
);
export const BUILDER_DEFAULTS_DIRECTORY = path.resolve(
  BUILDER_ROOT_DIRECTORY,
  "defaults"
);
export const BUILDER_DEFAULT_NRG_CONFIG = path.resolve(
  BUILDER_DEFAULTS_DIRECTORY,
  "nrg.json"
);
export const BUILDER_TEMPLATES = path.resolve(
  BUILDER_ROOT_DIRECTORY,
  "templates"
);
export const BUILDER_DOT_DIRECTORY = path.resolve(
  PROJECT_ROOT_DIRECTORY,
  ".nrg"
);
export const BUNDLER_TMP_DIRECTORY = path.resolve(BUILDER_DOT_DIRECTORY, "tmp");
export const BUNDLER_SERVER_TMP_DIRECTORY = path.resolve(
  BUNDLER_TMP_DIRECTORY,
  "server"
);
export const BUNDLER_SERVER_TMP_SRC_DIRECTORY = path.resolve(
  BUNDLER_SERVER_TMP_DIRECTORY,
  "src"
);
export const BUNDLER_CLIENT_TMP_DIRECTORY = path.resolve(
  BUNDLER_TMP_DIRECTORY,
  "client"
);
export const BUNDLER_CLIENT_TMP_SRC_DIRECTORY = path.resolve(
  BUNDLER_CLIENT_TMP_DIRECTORY,
  "src"
);

export const BUNDLER_TMP_SRC_DIRECTORY = path.resolve(
  BUNDLER_TMP_DIRECTORY,
  "src"
);
export const BUNDLER_TMP_DIST_DIRECTORY = path.resolve(
  BUNDLER_TMP_DIRECTORY,
  "dist"
);

export const SRC_DIRECTORY = path.resolve(PROJECT_ROOT_DIRECTORY, "src");
export const DIST_DIRECTORY = path.resolve(PROJECT_ROOT_DIRECTORY, "dist");

export const NODE_RED_EXECUTABLE = path.resolve(
  PROJECT_ROOT_DIRECTORY,
  "node_modules/.bin/node-red"
);

export const NODE_RED_SETTINGS_FILE = path.resolve(
  PROJECT_ROOT_DIRECTORY,
  "node-red/settings.js"
);

export const NODE_RED_DIRECTORY = path.resolve(
  PROJECT_ROOT_DIRECTORY,
  "node-red"
);
