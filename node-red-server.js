const { spawn } = require("child_process");
const path = require("path");

// Path to red.js in the Node-RED module
const redPath = path.join(__dirname, "node_modules", "node-red", "red.js");
const settingsPath = path.join(__dirname, "node-red/settings.js");

// Start Node-RED as a subprocess
const nodeRedProcess = spawn("node", [redPath, "-s", settingsPath], {
  stdio: "inherit", // This will pipe the Node-RED output to the main process console
  env: process.env, // Inherit the environment variables from the parent process
});

// Optional: handle process exit events for cleanup
nodeRedProcess.on("close", (code) => {
  console.log(`Node-RED process exited with code ${code}`);
});

nodeRedProcess.on("error", (err) => {
  console.error("Failed to start Node-RED:", err);
});
