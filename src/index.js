import createNodeMixin from "./helper";
import { Node1, Node2 } from "@nodes";

export default function (RED) {
  const NodeMixin = createNodeMixin(RED);
  RED.nodes.registerType("node1", NodeMixin(Node1));
  RED.nodes.registerType("node2", NodeMixin(Node2));
}
