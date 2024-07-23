// NOTE: the only purpose of this mixin is to ensure RED is available to the class scope. This could be solved at build time instead of runtime
export default function createNodeRedNodeMixin(RED) {
  return function (BaseClass) {
    return class extends BaseClass {
      static RED = RED;
      constructor(config) {
        super(config);

        console.log("derived class");
      }
    };
  };
}
