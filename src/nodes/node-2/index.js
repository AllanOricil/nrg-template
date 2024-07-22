import Node from "src/node";

export default class Node2 extends Node {
  constructor(config) {
    super(config);
    console.log("constructed node 2");
  }

  // NOTE: in the future I plan to make the parent register event handlers automatically
  setupEventHandlers() {
    this.on("input", this.onInput);
  }

  onInput(msg) {
    console.log("node-2 on input", msg.payload);

    this.send({ payload: "received input in node 2" });
  }
}
