export default function (RED) {
  function Node2(n) {
    console.log(RED);
    RED.nodes.createNode(this, n);
  }
  RED.nodes.registerType("node2", Node2);
}
