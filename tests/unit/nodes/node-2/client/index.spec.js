import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import axios from "axios";
import Node2 from "@/nodes/node-2/client";

vi.mock("axios");

describe("node-2", () => {
  it("should return the correct icon", () => {
    expect(Node2.icon()).toBe("icon-2.png");
  });

  it("should return the correct palette label", () => {
    const context = { name: "Test Node", _: vi.fn(() => "Localized Name") };
    expect(Node2.paletteLabel.call(context)).toBe("Test Node");
    expect(context._).not.toHaveBeenCalled();

    context.name = "";
    expect(Node2.paletteLabel.call(context)).toBe("Localized Name");
    expect(context._).toHaveBeenCalledWith("node-2.name");

    context._.mockReturnValue("");
    expect(Node2.paletteLabel.call(context)).toBe("node-2");
  });

  it("should return the correct label", () => {
    const context = { name: "Label Test", _: vi.fn(() => "Localized Label") };
    expect(Node2.label.call(context)).toBe("Label Test");
    expect(context._).not.toHaveBeenCalled();

    context.name = "";
    expect(Node2.label.call(context)).toBe("Localized Label");
    expect(context._).toHaveBeenCalledWith("node-2.name");

    context._.mockReturnValue("");
    expect(Node2.label.call(context)).toBe("node-2");
  });

  it("should define required credentials", () => {
    expect(Node2.credentials).toEqual({
      username: { type: "text", required: true },
      password: { type: "password", required: true },
    });
  });

  describe("oneditprepare", () => {
    let mockNode2;

    beforeEach(() => {
      mockNode2 = document.createElement("div");
      mockNode2.id = "node-2";
      document.body.appendChild(mockNode2);

      vi.spyOn(mockNode2, "appendChild").mockImplementation((child) => {
        mockNode2.append(child);
      });
    });

    afterEach(() => {
      document.body.innerHTML = "";
      vi.clearAllMocks();
    });

    it("should add a button to the DOM", () => {
      Node2.oneditprepare.call({ type: "node-2" });

      const node2 = document.getElementById("node-2");
      const button = node2.querySelector("button");

      expect(button).toBeDefined();
      expect(mockNode2.appendChild).toHaveBeenCalled();
    });

    it("should fetch and display a dog image on button click", async () => {
      axios.get.mockResolvedValue({
        data: { message: "https://example.com/dog.jpg" },
      });

      Node2.oneditprepare.call({ type: "node-2" });

      const button = mockNode2.querySelector("button");
      expect(button).toBeDefined();

      await button.click();

      expect(axios.get).toHaveBeenCalledWith(
        "https://dog.ceo/api/breeds/image/random",
      );

      const img = mockNode2.querySelector("img");
      expect(img).toBeDefined();
      expect(img.src).toBe("https://example.com/dog.jpg");
    });

    it("should handle errors gracefully on button click", async () => {
      axios.get.mockRejectedValue(new Error("Network Error"));

      Node2.oneditprepare.call({ type: "node-2" });

      const button = mockNode2.querySelector("button");
      expect(button).toBeDefined();

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation();
      await button.click();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "something went wrong",
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
