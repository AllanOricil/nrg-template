const vuePlugin = require("esbuild-vue");

module.exports = {
  version: "0.0.0",
  build: {
    client: {
      plugins: [
        vuePlugin({
          production: true,
        }),
      ],
    },
  },
  nodeRed: {
    logging: {
      console: {
        level: "debug",
      },
    },
  },
};
