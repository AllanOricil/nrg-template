import vuePlugin from "esbuild-vue";

export default {
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
    uiPort: 2020,
  },
};
