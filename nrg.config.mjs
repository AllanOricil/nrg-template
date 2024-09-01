export default {
  version: "0.0.0",
  build: {
    server: {
      // common options
      nodes: {
        "node-1": {
          // node specific options override global option
        },
        "node-2": {
          // node specific options override global option
        },
      },
    },
    client: {
      // common options
      nodes: {
        "node-1": {
          // node specific options override global option
        },
        "node-2": {
          // node specific options override global option
        },
      },
    },
  },
};
