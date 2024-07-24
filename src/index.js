import { registerNodes } from "src/lib/helper";
import { Node1, Node2 } from "@nodes";

// NOTE: this could created at build time if there was a way to map node name with class name from within the node class itself
export default function (RED) {
  registerNodes(RED, [Node1, Node2]);
}
