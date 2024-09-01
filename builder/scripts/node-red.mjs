import fs from "fs";
import path from "path";
import { exec, execSync } from "child_process";
import deepmerge from "deepmerge";
import killPort from "kill-port";
import detectPort from "detect-port";
import WebSocket from "ws";

import {
  DIST_DIRECTORY,
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
    nodesDir: DIST_DIRECTORY,
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

async function startNodeRed(config) {
  await killNodeRedProcess(config);
  setupNodeRedDirectory(config);

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
    console.error(`Node-RED Error: ${message}`);
  });

  if (!wss) {
    setupWebSocket(config);
  }
}

export { startNodeRed };
