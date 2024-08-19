import { Node } from "@allanoricil/node-red-node";

export default class Node2 extends Node {
  constructor(config) {
    super(config);
    console.log("constructed node 2");
  }

  static init(RED) {
    RED.httpAdmin.get("/test", async function (req, res) {
      try {
        res.status(200).json({ message: "success" });
      } catch (err) {
        RED.log.error("ERROR:" + err.message);
        res.status(500).json({ message: "something unknown happened" });
      }
    });
  }

  onInput(msg) {
    console.log("node-2 on input", msg.payload);
    this.send({ payload: "received input in node 2" });
  }

  onClose() {
    console.log("node-2 on close");
  }
}
