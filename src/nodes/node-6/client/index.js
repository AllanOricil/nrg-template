export default {
  category: "custom nodes",
  color: "#FFFFFF",
  defaults: {
    name: { value: "" },
    test: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "icon-6.png",
  align: "left",
  paletteLabel: function () {
    return this.name || this._("node-6.name") || "node-6";
  },
  label: function () {
    return this.name || this._("node-6.name") || "node-6";
  },
  oneditprepare: function () {},
  oneditcancel: function () {},
  oneditdelete: function () {},
};
