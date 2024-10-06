import { Node } from "@allanoricil/nrg-nodes";
import axios from "axios";

export default class Node3 extends Node {
  constructor(config) {
    super(config);
    this.log(`constructed type: ${Node3.type} id: ${this.id}`);
  }

  static settings() {
    return {
      test: {
        value: "my super settings value",
        exportable: true,
      },
    };
  }

  onInput(msg, send, done) {
    this.log(`Hi! from type: ${Node3.type} id: ${this.id}`);
    msg.payload = `Hi! from type: ${Node3.type} id: ${this.id}`;
    send(msg);
    done();
  }

  // NOTE: example showing how to use async/await
  async onClose(done) {
    try {
      this.log(`closing type: ${Node3.type} id: ${this.id}`);
      this.log("fetching dog");
      const response = await axios.get(
        "https://dog.ceo/api/breeds/image/random",
      );
      this.log(response.data);
      this.log("dog fetched");
      done();
    } catch (error) {
      this.error("failed to fetch dog before closing the node", error);
      done(error);
    }
  }
}
