function icon() {
  return "icon-2.png";
}

function paletteLabel() {
  return this.name || this._("node-2.name") || "node-2";
}

function label() {
  return this.name || this._("node-2.name") || "node-2";
}

export default {
  category: "custom nodes",
  color: "#FFFFFF",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  align: "left",
  icon,
  paletteLabel,
  label,
};
