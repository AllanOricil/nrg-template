// NOTE: the only purpose of this mixin is to ensure RED is available to the class scope. This could be solved at build time instead of runtime
export default function createNodeMixin(RED) {
  return function (BaseClass) {
    return class extends BaseClass {
      constructor(config) {
        super(config);

        // NOTE: RED.nodes.createNode(this, config); is added here and not in the parent class (Node) because it must be called before this.setupEventHandlers();
        RED.nodes.createNode(this, config);
        this.RED = RED;

        // NOTE: if RED.nodes.createNode(this, config) is called after setting up event handlers, event handlers won't work
        this.setupEventHandlers();
      }
    };
  };
}
