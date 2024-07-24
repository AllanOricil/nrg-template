import { registerNodes } from "src/lib/helper";
import { Node1, Node2 } from "@nodes";

// NOTE: this could created at build time if there was a way to map node name with class name from within the node class itself
// TODO: simplify it to registerNodes(RED, [Node1, Node2]). For this, this.type declaration must be enforced
export default function (RED) {
  registerNodes(RED, [
    {
      name: "node1",
      class: Node1,
    },
    {
      name: "node2",
      class: Node2,
    },
  ]);
}
