import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import deepmerge from "deepmerge";
import killPort from "kill-port";
import detectPort from "detect-port";
import WebSocket from "ws";
import {
  PROJECT_ROOT_DIRECTORY,
  NODE_RED_EXECUTABLE,
  NODE_RED_SETTINGS_FILE,
  NODE_RED_DIRECTORY,
} from "./constants.mjs";

let nodeRedProcess = null;
let wss;

function setupWebSocket(config) {
  if (!wss) {
    console.log("Setting up WebSocket server...");
    wss = new WebSocket.Server({ port: config.watch.port });

    wss.on("connection", (ws) => {
      console.log("Client connected to WebSocket");

      ws.on("message", (message) => {
        console.log("Received message:", message);
      });
    });
  }
}

function setupNodeRedDirectory(config) {
  if (!fs.existsSync(NODE_RED_DIRECTORY)) {
    fs.mkdirSync(NODE_RED_DIRECTORY, { recursive: true });
  }

  const nodeRedSettings = deepmerge(config.nodeRed, {
    userDir: NODE_RED_DIRECTORY,
    // NOTE: this works, but it break locales https://github.com/node-red/node-red/issues/1604
    nodesDir: PROJECT_ROOT_DIRECTORY,
  });

  fs.writeFileSync(
    NODE_RED_SETTINGS_FILE,
    `module.exports = ${JSON.stringify(nodeRedSettings, null, 2)}`,
    { encoding: "utf-8" }
  );
}

async function killNodeRedProcess(config) {
  if (nodeRedProcess) {
    nodeRedProcess.kill();
  } else {
    const port = await detectPort(config.nodeRed.uiPort);
    if (port !== config.nodeRed.uiPort) {
      await killPort(config.nodeRed.uiPort);
    }
  }
}

function buildCommand(debug) {
  let args = [
    ...(debug ? ["--inspect"] : []),
    NODE_RED_EXECUTABLE,
    "--settings",
    NODE_RED_SETTINGS_FILE,
  ];

  return {
    executable: "node",
    args,
  };
}

async function startNodeRed(config) {
  await killNodeRedProcess(config);
  setupNodeRedDirectory(config);

  const { executable, args } = buildCommand(config.debug);
  nodeRedProcess = spawn(executable, args);
  nodeRedProcess.stdout.on("data", (data) => {
    const message = data.toString().trim();
    console.log(`Node-RED: ${message}`);

    if (
      data.includes(
        `Server now running at http://127.0.0.1:${config.nodeRed.uiPort}/`
      )
    ) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send("refresh");
        }
      });
    }
  });

  nodeRedProcess.stderr.on("data", (data) => {
    const message = data.toString().trim();
    if (
      message.includes("Debugger attached") ||
      message.includes("Debugger ending")
    ) {
      // Optionally log or handle debugger messages differently
      console.log(`Debugging info: ${message}`);
    } else {
      console.error(`Node-RED Error: ${message}`);
    }
  });

  if (!wss) {
    setupWebSocket(config);
  }
}

export { startNodeRed };
