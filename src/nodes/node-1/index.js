export default function (RED) {
  function Node1(n) {
    console.log(RED);
    RED.nodes.createNode(this, n);
  }
  RED.nodes.registerType("node1", Node1);
}
