import { createNodeRedNodeMixin } from "@allanoricil/nrg-nodes";

function createNode(Node, type) {
  return async function (RED) {
    const NodeRedNodeMixin = createNodeRedNodeMixin(RED);
    const _Node = await NodeRedNodeMixin(Node, type);
    RED.nodes.registerType(type, _Node, _Node.registrationProperties());
  };
}

export { createNode };
