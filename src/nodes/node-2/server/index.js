import { Node } from "@allanoricil/node-red-node";
import { format } from "util";
import axios from "axios";

export default class Node2 extends Node {
  constructor(config) {
    super(config);
    this.log(`constructed type: ${Node2.type} id: ${this.id}`);

    this.log(format("%j", this.credentials));
  }

  static init() {
    axios.get("https://dog.ceo/api/breeds/image/random").then((result) => {
      this.RED.log.debug(`[${this.type}]`);
      this.RED.log.debug(result.data);
    });

    this.RED.httpAdmin.get("/test", async function (req, res) {
      try {
        res.status(200).json({ message: "success" });
      } catch (err) {
        this.RED.log.error("ERROR:" + err.message);
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
    this.log("node-2 on input", msg.payload);
    this.log(format("%j", this.credentials));

    this.send({ payload: `received input in ${Node2.type}-${this.id}` });
  }

  // NOTE: example showing how to use removed/done
  onClose(removed, done) {
    if (removed) {
      this.log(`type: ${Node2.type} id: ${this.id} disabled/deleted`);
    } else {
      this.log(`type: ${Node2.type} id: ${this.id} restarted`);
    }
    done();
  }
}
