import { Node } from "@allanoricil/node-red-node";
import axios from "axios";

export default class Node1 extends Node {
  constructor(config) {
    super(config);
    console.log("constructed node 1");
  }

  // NOTE: example showing how to use async/await
  async onInput(msg, send, done) {
    try {
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
    } catch (error) {
      this.status({
        fill: "red",
        shape: "ring",
        text: "error",
      });
      console.error("Failed to fetch dog image:", error);
      done(error);
    } finally {
      setTimeout(() => {
        this.status({});
      }, 3000);
    }
  }
}
