import { describe, it, expect, vi } from "vitest";
import Node1 from "@/nodes/node-1/client";

describe("node-1", () => {
  it("should have the correct default properties", () => {
    expect(Node1.category).toBe("custom nodes");
    expect(Node1.color).toBe("#FFFFFF");
    expect(Node1.defaults).toEqual({
      name: { value: "" },
      test: { value: "" },
    });
    expect(Node1.inputs).toBe(1);
    expect(Node1.outputs).toBe(1);
    expect(Node1.icon).toBe("icon-1.png");
    expect(Node1.align).toBe("left");
  });

  it("should return correct paletteLabel", () => {
    Node1.name = "Test Node";
    expect(Node1.paletteLabel()).toBe("Test Node");

    Node1.name = "";
    Node1._ = vi.fn(() => "Fallback Name");
    expect(Node1.paletteLabel()).toBe("Fallback Name");
  });

  it("should return correct label", () => {
    Node1.name = "Test Node";
    expect(Node1.label()).toBe("Test Node");

    Node1.name = "";
    Node1._ = vi.fn(() => "Fallback Label");
    expect(Node1.label()).toBe("Fallback Label");
  });

  it("should expose edit methods", () => {
    expect(Node1).toHaveProperty("oneditprepare");
    expect(typeof Node1.oneditprepare).toBe("function");

    expect(Node1).toHaveProperty("oneditcancel");
    expect(typeof Node1.oneditcancel).toBe("function");

    expect(Node1).toHaveProperty("oneditdelete");
    expect(typeof Node1.oneditdelete).toBe("function");
  });
});
