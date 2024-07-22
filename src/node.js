// NOTE: we could make this class simulate an abstract using just js, however in ts is easier. Therefore, I'm not doing it here
export default class Node {
  constructor(config) {
    console.log(config);
    console.log("parent");

    // NOTE: add anything that has to be available to all nodes
    // NOTE: I cant call RED.nodes.createNode(this, config); here because it is not available, that is why I do it in the mixin, at runtime. The only purpose of this class it to serve as a template for child nodes.
    // NOTE: child classes implement setupEventHandlers for now but I think I can handle it here, or in the future at build time
  }

  setupEventHandlers() {
    console.warn("setupEventHandlers() not implemented in this node.");
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
