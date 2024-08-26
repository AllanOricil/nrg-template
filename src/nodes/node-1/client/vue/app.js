import { loadVue } from "./utils";
import Hello from "./components/hello.vue";

function startApp(node) {
  loadVue(
    node.type,
    () =>
      new Vue({
        el: "#vue-app",
        render: (h) =>
          h(Hello, {
            props: {
              nodeData: node,
            },
          }),
      }),
  );
}

export { startApp };
