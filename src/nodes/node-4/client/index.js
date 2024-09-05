export default {
  category: "custom nodes",
  color: "#FFFFFF",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "icon-4.png",
  align: "left",
  paletteLabel: function () {
    return this.name || this._("node-4.name") || "node-4";
  },
  label: function () {
    return this.name || this._("node-4.name") || "node-4";
  },
  oneditprepare: function () {},
  oneditcancel: function () {},
  oneditdelete: function () {},
};
