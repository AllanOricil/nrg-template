import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { packageDirectorySync } from "pkg-dir";

const PROJECT_ROOT_DIRECTORY = packageDirectorySync();

let nodeRedProcess = null;
let wss;

const NODE_RED_EXECUTABLE = path.resolve(
  PROJECT_ROOT_DIRECTORY,
  "node_modules/.bin/node-red"
);
const NODE_RED_SETTINGS_FILE = path.resolve(
  PROJECT_ROOT_DIRECTORY,
  "node-red/settings.js"
);

console.log("NODE_RED_SETTINGS_FILE");
console.log(NODE_RED_SETTINGS_FILE);

const DIST_DIRECTORY = path.resolve(PROJECT_ROOT_DIRECTORY, "dist");
if (!fs.existsSync(DIST_DIRECTORY)) {
  console.error(
    `Error: The 'dist' directory does not exist at ${DIST_DIRECTORY}`
  );
  process.exit(1);
}

const NODE_RED_DIRECTORY = path.resolve("node-red");
if (!fs.existsSync(NODE_RED_DIRECTORY)) {
  fs.mkdirSync(NODE_RED_DIRECTORY, { recursive: true });
}

function startNodeRed() {
  if (nodeRedProcess) {
    nodeRedProcess.kill();
  }

  const command = `${NODE_RED_EXECUTABLE} --settings ${NODE_RED_SETTINGS_FILE}`;
  nodeRedProcess = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Node-RED failed to start: ${error.message}`);
    }
    if (stderr) {
      console.error(`Node-RED stderr: ${stderr}`);
    }
    console.log(`Node-RED stdout: ${stdout}`);
  });

  nodeRedProcess.stdout.on("data", (data) => {
    console.log(`Node-RED: ${data}`);
  });

  nodeRedProcess.stderr.on("data", (data) => {
    console.error(`Node-RED Error: ${data}`);
  });
}

execSync("npm run build");
startNodeRed();
