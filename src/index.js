import { registerNodes } from "src/lib/helper";
import { Node1, Node2 } from "@nodes";

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
