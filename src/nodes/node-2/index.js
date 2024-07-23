import Node from "src/lib/node";

export default class Node2 extends Node {
  constructor(config) {
    super(config);
    console.log("constructed node 2");
  }

  // NOTE: in the future I plan to make the parent register event handlers automatically
  setupEventHandlers() {
    this.on("input", this.onInput);
    this.on("close", this.onClose);
  }

  onInput(msg) {
    console.log("node-2 on input", msg.payload);

    this.send({ payload: "received input in node 2" });
  }

  onClose() {
    console.log("node-2 on close");
  }
}
