import { Node } from "@allanoricil/node-red-node";

export default class Node5 extends Node {
  constructor(config) {
    super(config);
    this.log(`constructed type: ${Node5.type} id: ${this.id}`);
  }

  // NOTE: example showing how to use context
  onInput(msg, send, done) {
    const contextRandomValue = this.nodeContext.get("random-values") || [];
    contextRandomValue.push(Math.random());
    this.nodeContext.set("random-values", contextRandomValue);

    const flowContextRandomValues = this.flowContext.get("random-values") || [];
    flowContextRandomValues.push(Math.random());
    this.flowContext.set("random-values", flowContextRandomValues);

    const globalContextRandomValues =
      this.globalContext.get("random-values") || [];
    globalContextRandomValues.push(Math.random());
    this.globalContext.set("random-values", globalContextRandomValues);

    done();
  }
}
