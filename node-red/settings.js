const path = require("path");

console.log("NODE_RED_SETTINGS");
console.log(path.resolve(__dirname, "../node-red"));
console.log(path.resolve(__dirname, "../dist"));

module.exports = {
  flowFile: "flows.json",
  flowFilePretty: true,
  userDir: path.resolve(__dirname, "../node-red"),
  nodesDir: path.resolve(__dirname, "../dist"),
  uiPort: process.env.PORT || 1880,
  diagnostics: {
    enabled: true,
    ui: true,
  },
  runtimeState: {
    enabled: false,
    ui: false,
  },
  logging: {
    console: {
      level: "info",
      metrics: false,
      audit: false,
    },
  },
  exportGlobalContextKeys: false,
  externalModules: {},
  editorTheme: {
    palette: {},
    projects: {
      enabled: false,
      workflow: {
        mode: "manual",
      },
    },
    codeEditor: {
      lib: "monaco",
      options: {},
    },
    markdownEditor: {
      mermaid: {
        enabled: true,
      },
    },
    multiplayer: {
      enabled: false,
    },
  },
  functionExternalModules: true,
  functionTimeout: 0,
  functionGlobalContext: {},
  debugMaxLength: 1000,
  mqttReconnectTime: 15000,
  serialReconnectTime: 15000,
};
