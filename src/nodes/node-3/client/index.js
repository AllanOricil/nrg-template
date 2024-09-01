export default {
  category: "custom nodes",
  color: "#FFFFFF",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "icon-3.png",
  align: "left",
  paletteLabel: function () {
    return this.name || this._("node-3.name") || "node-3";
  },
  label: function () {
    return this.name || this._("node-3.name") || "node-3";
  },
  oneditprepare: function () {},
  oneditcancel: function () {},
  oneditdelete: function () {},
};
