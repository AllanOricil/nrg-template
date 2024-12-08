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
    paletteCategories: ["custom nodes"],
    editorTheme: {
      tours: false,
    },
    logging: {
      console: {
        level: "debug",
      },
    },
  },
};
