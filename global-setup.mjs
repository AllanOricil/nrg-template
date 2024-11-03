// global-setup.js

const { spawn } = require("child_process");
const path = require("path");

let nodeRedProcess;

function waitForFlowsStarted() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Node-RED did not start flows in time."));
    }, 20000); // Set a maximum wait time of 20 seconds

    nodeRedProcess.stdout.on("data", (data) => {
      const message = data.toString();
      if (message.includes("Started flows")) {
        clearTimeout(timeout);
        console.log("Node-RED server is fully ready.");
        resolve();
      }
    });

    nodeRedProcess.stderr.on("data", (data) => {
      console.error("Node-RED error:", data.toString());
    });
  });
}

export async function setup() {
  const redPath = path.join(__dirname, "node_modules", "node-red", "red.js");
  const settingsPath = path.join(__dirname, "node-red/settings.js");

  console.log("Starting Node-RED server...");
  nodeRedProcess = spawn("node", [redPath, "-s", settingsPath], {
    stdio: ["ignore", "pipe", "pipe"], // Capture stdout and stderr
    env: process.env,
  });

  // Wait for "Started flows" message to ensure Node-RED is fully initialized
  await waitForFlowsStarted();
}

export async function teardown() {
  console.log("Stopping Node-RED server...");
  if (nodeRedProcess) {
    nodeRedProcess.kill();
  }
}
