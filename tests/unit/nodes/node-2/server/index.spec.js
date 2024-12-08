import { describe, it, expect, vi } from "vitest";
import { createNode } from "../../utils";
import helper from "node-red-node-test-helper";
import Node2 from "@/nodes/node-2/server";
import axios from "axios";

vi.mock("axios");

describe("node-2", () => {
  beforeEach(async () => {
    await helper.startServer();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await helper.unload();
    await helper.stopServer();
  });

  it("should be created with type and name as node-2", async () => {
    const flow = [
      {
        id: "n1",
        type: "node-2",
        name: "node-2",
        z: "flow",
      },
    ];

    // NOTE: mock for the init callout
    axios.get.mockResolvedValue({
      data: {},
    });

    await helper.load(createNode(Node2, "node-2"), flow);

    const n1 = helper.getNode("n1");
    expect(n1).to.have.property("name", "node-2");
    expect(n1).to.have.property("type", "node-2");
  });

  it("should expose credentials", async () => {
    const credentials = Node2.credentials();
    expect(credentials).to.have.property("username");
    expect(credentials).to.have.property("password");
    expect(credentials.username).to.have.property("type", "text");
    expect(credentials.password).to.have.property("type", "password");
  });

  it("should call dogs api when type is created", async () => {
    const flow = [
      {
        id: "n1",
        type: "node-2",
        name: "node-2",
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

    await helper.load(createNode(Node2, "node-2"), flow);
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalledWith(
      "https://dog.ceo/api/breeds/image/random",
    );
  });

  it("should acnowledge when receiving input", async () => {
    const flow = [
      {
        id: "n1",
        type: "node-2",
        name: "node-2",
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

    await helper.load(createNode(Node2, "node-2"), flow);
    const n1 = helper.getNode("n1");
    const n2 = helper.getNode("n2");

    const inputReceived = new Promise((resolve) => {
      n2.on("input", async (msg) => {
        resolve(msg);
      });
    });

    n1.receive();

    const msg = await inputReceived;
    expect(msg).to.have.property("payload", "received input in node-2-n1");
  });
});
