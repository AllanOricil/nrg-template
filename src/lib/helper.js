import Node from "./node";
// NOTE: this mixin ensures RED is available to the class scope. It also registers event handlers automatically
function createNodeRedNodeMixin(RED) {
  return function (BaseClass) {
    if (!(BaseClass.prototype instanceof Node)) {
      throw new Error(`${BaseClass.name} must extend Node`);
    }

    // NOTE: this is a definition to ensure event handler methods can be identified
    const EVENT_HANDLER_PREFIX_RESERVED_WORD = "on";

    // NOTE: this ensures the source of thruth for event handler method names is the Node parent class. Every method that starts with "on" is an event handler method.
    const EVENT_HANDLER_RESERVED_METHOD_NAMES = Object.getOwnPropertyNames(
      Node.prototype,
    ).filter((methodName) =>
      methodName.startsWith(EVENT_HANDLER_PREFIX_RESERVED_WORD),
    );

    return class extends BaseClass {
      static RED = RED;

      constructor(config) {
        super(config);
        console.log("derived class");

        // NOTE: ensure event handlers are configured. It is called here because it is certain that it happens after this.constructor.RED.nodes.createNode(this, config);
        this.setupEventHandlers();
      }

      // NOTE: this enforces setupEventHandlers to be defined by all nodes
      setupEventHandlers() {
        Object.getOwnPropertyNames(BaseClass.prototype)
          .filter((methodName) =>
            EVENT_HANDLER_RESERVED_METHOD_NAMES.includes(methodName),
          )
          .forEach((methodName) => {
            this.on(
              methodName
                .split(EVENT_HANDLER_PREFIX_RESERVED_WORD)[1]
                .toLocaleLowerCase(),
              this[methodName],
            );
          });
      }
    };
  };
}

export function registerNodes(RED, nodes) {
  const nodeRedNodeMixin = createNodeRedNodeMixin(RED);
  for (const node of nodes) {
    if (!node.type) {
      throw new Error(
        `${node.name} must declare its type as a static prop called type`,
      );
    }
    RED.nodes.registerType(node.type, nodeRedNodeMixin(node));
  }
}
