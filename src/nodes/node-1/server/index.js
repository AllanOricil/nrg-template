import { Node } from "@allanoricil/node-red-node";
import axios from "axios";

export default class Node1 extends Node {
  constructor(config) {
    super(config);
    this.log(`constructed type: ${this.type} id: ${this.id}`);
  }

  static settings() {
    return {
      test: {
        value: "my super settings value",
        exportable: true,
      },
    };
  }

  // NOTE: example showing how to use async/await
  async onInput(msg, send, done) {
    try {
      this.log("fetching dogs");
      this.status({
        fill: "blue",
        shape: "ring",
        text: "fetching data",
      });
      const response = await axios.get(
        "https://dog.ceo/api/breeds/image/random",
      );
      this.status({
        fill: "green",
        shape: "dot",
        text: "success",
      });
      send({ payload: response.data });
      done();
      this.log("dogs fetched");
    } catch (error) {
      this.status({
        fill: "red",
        shape: "ring",
        text: "error",
      });
      this.error("Failed to fetch dog image:", error);
      done(error);
    } finally {
      setTimeout(() => {
        this.log("clearing status");
        this.status({});
      }, 3000);
    }
  }

  onClose() {
    this.log(`type: ${this.type} id: ${this.id} removed on close`);
  }
}
