import axios from "axios";

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
  credentials: {
    username: { type: "text", required: true },
    password: { type: "password", required: true },
  },
  inputs: 1,
  outputs: 1,
  align: "left",
  icon,
  paletteLabel,
  label,
  oneditprepare: function () {
    const node2 = document.getElementById(this.type);
    const button = document.createElement("button");
    button.textContent = "Click Me";
    button.id = "my-button";
    button.onclick = async () => {
      try {
        const response = await axios.get(
          "https://dog.ceo/api/breeds/image/random",
        );
        const oldImage = document.getElementById("dog-image");
        const newImage = document.createElement("img");
        newImage.id = "dog-image";
        newImage.src = response.data.message;
        newImage.alt = "Random Dog Image";
        newImage.style.display = "block";
        if (oldImage) node2.removeChild(oldImage);
        node2.appendChild(newImage);
      } catch (error) {
        console.error("something went wrong", error);
      }
    };
    node2.appendChild(button);
  },
};
