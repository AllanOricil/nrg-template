// NOTE: we could make this class simulate a true abstract class at runtime using js only. However, it is way easier to do it using ts. Therefore, I'm not doing it here.
export default class Node {
  constructor(config) {
    console.log(config);
    console.log("parent");

    // NOTE: this must be called before this.setupEventHanlders(), otherwise event handlers won't work
    this.constructor.RED.nodes.createNode(this, config);

    // NOTE: add anything that has to be available to all nodes
  }

  /* eslint-disable no-unused-vars */
  onInput(...args) {
    console.warn("onInput() not implemented in this node.");
  }

  /* eslint-disable no-unused-vars */
  onClose(...args) {
    console.warn("onClose() not implemented in this node.");
  }

  /* eslint-disable no-unused-vars */
  onReady(...args) {
    console.warn("onReady() not implemented in this node.");
  }

  /* eslint-disable no-unused-vars */
  onStatus(...args) {
    console.warn("onStatus() not implemented in this node.");
  }

  /* eslint-disable no-unused-vars */
  onConfig(...args) {
    console.warn("onConfig() not implemented in this node.");
  }

  // NOTE: add other event handlers here
}
