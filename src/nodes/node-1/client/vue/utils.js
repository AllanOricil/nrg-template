function loadVue(node, onLoadCallback) {
  const nodeElement = document.getElementById(node);
  var vueAppElementId = "vue-app";
  var vueAppElement = nodeElement.querySelector(`#${vueAppElementId}`);
  if (!vueAppElement) {
    vueAppElement = document.createElement("div");
    vueAppElement.id = vueAppElementId;
    nodeElement.appendChild(vueAppElement);
  }

  if (typeof Vue === "undefined") {
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js";
    script.type = "text/javascript";
    script.onload = function () {
      onLoadCallback();
    };
    document.head.appendChild(script);
  } else {
    onLoadCallback();
  }
}

export { loadVue };
