import { describe, it, expect, vi } from "vitest";
import helper from "node-red-node-test-helper";
import Node1 from "@/nodes/node-1/server";
import { createNodeRedNodeMixin } from "@allanoricil/nrg-nodes";
import axios from "axios";

vi.mock("axios");

describe("Basic test", () => {
  beforeEach(async function () {
    helper.startServer();
  });

  afterEach(async function () {
    helper.unload();
    helper.stopServer();
  });

  it("adds 1 + 2 to equal 3", () => {
    expect(1 + 2).toBe(3);
  });

  it("test node1", () => {
    const flow = [
      {
        id: "n1",
        type: "node-1",
        name: "node-1",
        z: "flow",
      },
    ];

    axios.get.mockResolvedValue({
      data: {},
    });

    helper.load(
      async function (RED) {
        const NodeRedNodeMixin = createNodeRedNodeMixin(RED);
        const _Node1 = await NodeRedNodeMixin(Node1, "node-1");
        RED.nodes.registerType(
          "node-1",
          _Node1,
          _Node1.registrationProperties()
        );
      },
      flow,
      function () {
        const n1 = helper.getNode("n1");
        n1.should.have.property();
      }
    );
  });
});
