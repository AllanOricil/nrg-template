import Node from "src/lib/node";

export default class Node2 extends Node {
  constructor(config) {
    super(config);
    console.log("constructed node 2");
  }

  onInput(msg) {
    console.log("node-2 on input", msg.payload);

    this.send({ payload: "received input in node 2" });
  }

  onClose() {
    console.log("node-2 on close");
  }
}
