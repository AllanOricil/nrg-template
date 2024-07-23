// NOTE: the only purpose of this mixin is to ensure RED is available to the class scope. This could be solved at build time instead of runtime
function createNodeRedNodeMixin(RED) {
  return function (BaseClass) {
    return class extends BaseClass {
      static RED = RED;
      constructor(config) {
        super(config);

        console.log("derived class");
      }
    };
  };
}

export function registerNodes(RED, nodes) {
  const nodeRedNodeMixin = createNodeRedNodeMixin(RED);
  for (const node of nodes) {
    RED.nodes.registerType(node.name, nodeRedNodeMixin(node.class));
  }
}
