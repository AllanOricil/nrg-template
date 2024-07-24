import Node from "src/lib/node";
import fetch from "node-fetch";

export default class Node1 extends Node {
  // TODO: enforce node type declaration so that registerNodes, from src/lib/node, can be simplified to registerNodes(RED, [Node1, Node2])
  constructor(config) {
    super(config);
    console.log("constructed node 1");
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
