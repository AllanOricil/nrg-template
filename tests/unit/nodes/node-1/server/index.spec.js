import { describe, it, expect, vi } from "vitest";
import { createNode } from "../../utils";
import helper from "node-red-node-test-helper";
import Node1 from "@/nodes/node-1/server";
import axios from "axios";

vi.mock("axios");

describe("node-1", () => {
  beforeEach(async () => {
    await helper.startServer();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await helper.unload();
    await helper.stopServer();
  });

  it("should be created with type and name as node-1", async () => {
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

  it("should expose settings", async () => {
    // NOTE: mock for the init callout
    axios.get.mockResolvedValueOnce({
      data: {},
    });

    const settings = Node1.settings();
    expect(settings).to.have.property("test");
    expect(settings.test).to.have.property("value", "my super settings value");
    expect(settings.test).to.have.property("exportable", true);
  });

  it("should call dogs api when node type is created", async () => {
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

    // NOTE: mock for the init callout
    axios.get.mockResolvedValueOnce({
      data: {
        message:
          "https://images.dog.ceo/breeds/springer-english/n02102040_735.jpg",
        status: "success",
      },
    });

    await helper.load(createNode(Node1, "node-1"), flow);
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledWith(
      "https://dog.ceo/api/breeds/image/random",
    );
  });

  it("should return dogs api response when receiving input", async () => {
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

    // NOTE: mock for the init callout
    axios.get.mockResolvedValueOnce({
      data: {
        message:
          "https://images.dog.ceo/breeds/springer-english/n02102040_735.jpg",
        status: "success",
      },
    });

    // NOTE: mock for the input callout
    axios.get.mockResolvedValue({
      data: {
        message:
          "https://images.dog.ceo/breeds/german-shepherd/n02106662_10366.jpg",
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
    expect(axios.get).toHaveBeenCalled(2);
    expect(msg.payload).to.have.property(
      "message",
      "https://images.dog.ceo/breeds/german-shepherd/n02106662_10366.jpg",
    );
  });
});
