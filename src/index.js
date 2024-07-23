import createNodeRedNodeMixin from "./helper";
import { Node1, Node2 } from "@nodes";

export default function (RED) {
  const nodeRedNodeMixin = createNodeRedNodeMixin(RED);
  RED.nodes.registerType("node1", nodeRedNodeMixin(Node1));
  RED.nodes.registerType("node2", nodeRedNodeMixin(Node2));
}
