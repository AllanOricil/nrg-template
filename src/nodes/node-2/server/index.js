import { Node } from "@allanoricil/node-red-node";
import { format } from "util";

export default class Node2 extends Node {
  constructor(config) {
    super(config);
    console.log(`constructed type: ${this.type} id: ${this.id}`);
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

  static credentials() {
    return {
      username: { type: "text" },
      password: { type: "password" },
    };
  }

  onInput(msg) {
    console.log("node-2 on input", msg.payload);
    console.log(format("%j", this.credentials));

    this.send({ payload: `received input in ${this.type}-${this.id}` });
  }

  onClose() {
    console.log(`type: ${this.type} id: ${this.id} removed on close`);
  }
}
