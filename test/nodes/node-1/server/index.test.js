import { describe, it, expect, vi } from "vitest";
import helper from "node-red-node-test-helper";
import Node1 from "@/nodes/node-1/server";
import { createNodeRedNodeMixin } from "@allanoricil/nrg-nodes";
import axios from "axios";

vi.mock("axios");

function createNode(Node, type) {
  return async function (RED) {
    const NodeRedNodeMixin = createNodeRedNodeMixin(RED);
    const _Node = await NodeRedNodeMixin(Node, type);
    RED.nodes.registerType(type, _Node, _Node.registrationProperties());
  };
}

describe("node-1", () => {
  beforeEach(async () => {
    await helper.startServer();
  });

  afterEach(async () => {
    await helper.unload();
    await helper.stopServer();
  });

  it("should be loaded", async () => {
    const flow = [
      {
        id: "n1",
        type: "node-1",
        name: "node-1",
        z: "flow",
      },
    ];

    // NOTE: mock for the init callout
    axios.get.mockResolvedValue({
      data: {},
    });

    await helper.load(createNode(Node1, "node-1"), flow);

    const n1 = helper.getNode("n1");
    expect(n1).to.have.property("name", "node-1");
    expect(n1).to.have.property("type", "node-1");
  });

  it("should return an url", async () => {
    const flow = [
      {
        id: "n1",
        type: "node-1",
        name: "node-1",
        wires: [["n2"]],
        z: "flow",
      },
      {
        id: "n2",
        type: "helper",
        z: "flow",
      },
    ];

    const expectedUrl1 =
      "https://images.dog.ceo/breeds/springer-english/n02102040_735.jpg";
    // NOTE: mock for the init callout
    axios.get.mockResolvedValueOnce({
      data: {
        message: expectedUrl1,
        status: "success",
      },
    });

    const expectedUrl2 =
      "https://images.dog.ceo/breeds/german-shepherd/n02106662_10366.jpg";
    // NOTE: mock for the input callout
    axios.get.mockResolvedValueOnce({
      data: {
        message: expectedUrl2,
        status: "success",
      },
    });

    await helper.load(createNode(Node1, "node-1"), flow);
    const n1 = helper.getNode("n1");
    const n2 = helper.getNode("n2");

    const inputReceived = new Promise((resolve) => {
      n2.on("input", async (msg) => {
        resolve(msg);
      });
    });

    n1.receive();

    const msg = await inputReceived;
    expect(msg).to.have.property("payload");
    expect(msg.payload).to.have.property("message", expectedUrl2);
  });
});
