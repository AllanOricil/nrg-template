import { packageDirectorySync } from "pkg-dir";
import { startNodeRed } from "./node-red.mjs";
import { build } from "./builder.mjs";
import { loadConfig } from "./config.mjs";

const main = async () => {
  try {
    const { config } = await loadConfig();
    await build(config);
    await startNodeRed(config);
  } catch (err) {
    console.error("something went wrong", err);
    process.exit(1);
  }
};

main();
