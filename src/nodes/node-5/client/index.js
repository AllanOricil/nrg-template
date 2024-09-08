export default {
  category: "custom nodes",
  color: "#FFFFFF",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "icon-5.png",
  align: "left",
  paletteLabel: function () {
    return this.name || this._("node-5.name") || "node-5";
  },
  label: function () {
    return this.name || this._("node-5.name") || "node-5";
  },
  oneditprepare: function () {},
  oneditcancel: function () {},
  oneditdelete: function () {},
};
