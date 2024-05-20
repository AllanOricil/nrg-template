import node1 from "./nodes/node-1";
import node2 from "./nodes/node-2";

export default function (RED) {
  node1(RED);
  node2(RED);
}
