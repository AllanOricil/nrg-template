import Node from "src/lib/node";
import fetch from "node-fetch";

export default class Node1 extends Node {
  constructor(config) {
    super(config);
    console.log("constructed node 1");
  }

  // NOTE: in the future I plan to make the parent register event handlers automatically
  setupEventHandlers() {
    this.on("input", this.onInput);
  }

  // NOTE: example showing how to use async/await
  async onInput(msg, send, done) {
    try {
      console.log("node-1 on input", msg.payload);
      this.status({
        fill: "blue",
        shape: "ring",
        text: "fetching data",
      });
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      this.status({
        fill: "green",
        shape: "dot",
        text: "success",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      send({ payload: data });

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
