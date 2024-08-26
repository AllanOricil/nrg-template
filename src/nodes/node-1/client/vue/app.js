import { loadVue } from "./utils";
import Hello from "./components/hello.vue";

let vueInstance = null;

function mountApp(node) {
  loadVue(node.type, () => {
    vueInstance = new Vue({
      el: "#vue-app",
      render: (h) =>
        h(Hello, {
          props: {
            nodeData: node,
          },
        }),
    });
  });
}

function destroyApp() {
  if (vueInstance) {
    vueInstance.$destroy(); // Destroy the Vue instance
    vueInstance = null; // Clear the reference to the Vue instance
  }
}

export { mountApp, destroyApp };
