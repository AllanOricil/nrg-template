import { registerNodes } from "src/lib/helper";
import { Node1, Node2 } from "@nodes";

export default function (RED) {
  registerNodes(RED, [Node1, Node2]);
}
