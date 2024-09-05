import { Node } from "@allanoricil/node-red-node";

export default class Node4 extends Node {
  constructor(config) {
    super(config);
    this.log(`constructed type: ${Node4.type} id: ${this.id}`);
  }
}
