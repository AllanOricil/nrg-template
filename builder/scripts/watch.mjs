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

function setupWebSocket() {
  if (!wss) {
    console.log("Setting up WebSocket server...");
    wss = new WebSocket.Server({ port: 3001 }); // Use a different port from Vite server

    wss.on("connection", (ws) => {
      console.log("Client connected to WebSocket");

      ws.on("message", (message) => {
        console.log("Received message:", message);
      });
    });
  }
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
    // Check if Node-RED is ready
    if (data.includes("Server now running at http://127.0.0.1:1880/")) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send("refresh");
        }
      });
    }
  });

  nodeRedProcess.stderr.on("data", (data) => {
    console.error(`Node-RED Error: ${data}`);
  });

  // Ensure WebSocket server is initialized
  if (!wss) {
    setupWebSocket();
  }
}

function build() {
  execSync("npm run build");
}

function watchFiles() {
  fs.watch("src", { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`File changed: ${filename}`);
      build();
      setTimeout(startNodeRed, 2000);
    }
  });
}

build();
startNodeRed();
watchFiles();
