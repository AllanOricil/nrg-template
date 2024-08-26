import { loadVue } from "./utils";
import Hello from "./components/hello.vue";

function startApp(node) {
  loadVue(
    node,
    () =>
      new Vue({
        el: "#vue-app",
        render: (h) => h(Hello),
      }),
  );
}

export { startApp };
