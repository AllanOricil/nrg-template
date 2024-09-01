import isOdd from "is-odd";
import { mountApp, destroyApp } from "./vue/app";

isOdd("1");

export default {
  category: "custom nodes",
  color: "#AAAAAA",
  defaults: {
    name: { value: "" },
    test: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "icon-1.png",
  align: "left",
  paletteLabel: function () {
    return this.name || this._("node-1.name") || "node-1";
  },
  label: function () {
    return this.name || this._("node-1.test.test") || "node-1";
  },
  oneditprepare: function () {
    const mySetting = RED.settings.node1test;
    document.getElementById("node-input-test").value = mySetting;
    mountApp(this);
  },
  oneditcancel: function () {
    destroyApp(this);
  },
  oneditdelete: function () {
    destroyApp(this);
  },
};
