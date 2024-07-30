import { registerNodes } from "@allanoricil/node-red-node";
import { Node1, Node2 } from "@nodes";

export default function (RED) {
  registerNodes(RED, [Node1, Node2]);
}
