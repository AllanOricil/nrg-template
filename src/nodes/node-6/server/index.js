import { Node } from "@allanoricil/node-red-node";

export default class Node6 extends Node {
  constructor(config) {
    super(config);
    this.log(`constructed type: ${Node6.type} id: ${this.id}`);

    this.test = config.test;
  }
}
