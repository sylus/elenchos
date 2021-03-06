import { create } from "../events/create";
import { eventJS } from "../__mocks__";
import { saveReleaseToDB, getRelease } from "../db/queries";
import { pollCluster } from "../lib/pollCluster";
import { getConfig, createCluster } from "../api/";
import { createDeployment } from "../lib/githubNotify";

jest.mock("../lib/pollCluster", () => ({
  pollCluster: jest.fn(() => {
    const clusterResult = {
      kubernetes_cluster: {
        id: "6852836d-d150-4187-be50-861c62b0ffe0",
        name: "stage-cluster-01",
        region: "nyc1",
        version: "1.12.1-do.2",
        cluster_subnet: "10.244.0.0/16",
        service_subnet: "10.245.0.0/16",
        ipv4: "68.183.135.145",
        endpoint:
          "https://6852836d-d150-4187-be50-861c62b0ffe0.k8s.ondigitalocean.com",
        tags: ["stage", "k8s", "k8s:6852836d-d150-4187-be50-861c62b0ffe0"],
        node_pools: [
          {
            id: "b0316731-32ff-47f4-88c4-04d98bf1c514",
            name: "frontend-pool",
            size: "s-1vcpu-2gb",
            count: 1,
            tags: [
              "frontend",
              "k8s",
              "k8s:6852836d-d150-4187-be50-861c62b0ffe0",
              "k8s:worker"
            ],
            nodes: [
              {
                id: "d1cefeb9-4186-4784-a31b-aa3b45422b73",
                name: "romantic-jepsen-uk62",
                status: { state: "running" },
                created_at: "2019-02-28T14:11:59Z",
                updated_at: "2019-02-28T14:14:18Z"
              }
            ]
          }
        ],
        status: { state: "running" },
        created_at: "2019-02-28T14:11:59Z",
        updated_at: "2019-02-28T14:14:18Z"
      }
    };
    return clusterResult;
  })
}));

jest.mock("../db/queries", () => ({
  saveReleaseToDB: jest.fn(() => {
    return true;
  }),
  getRelease: jest.fn(() => {
    return {};
  })
}));

jest.mock("../api", () => ({
  createCluster: jest.fn(() => {
    // cluster.kubernetes_cluster && cluster.kubernetes_cluster.id
    return { kubernetes_cluster: { id: "123" } };
  }),
  getConfig: jest.fn(() => {
    return true;
  })
}));

jest.mock("../lib/githubNotify", () => ({
  createDeployment: jest.fn(() => {
    return { id: "123", ip: "192.168.2.10" };
  })
}));

test("throws error if bad event sent", async () => {
  try {
    await create();
  } catch (e) {
    console.log(e.message);
    expect(e.message).toEqual("invalid event passed");
  }
});

test("throws error if bad event sent", async () => {
  try {
    await create({ body: {} });
  } catch (e) {
    console.log(e.message);
    expect(e.message).toEqual("refId not defined");
  }
});

test("throws error if no sha", async () => {
  try {
    // repository.full_name
    await create({
      body: {
        action: "opened",
        repository: { full_name: "the_repo_name" },
        pull_request: { head: { ref: "1234" } }
      }
    });
  } catch (e) {
    console.log(e.message);
    expect(e.message).toEqual("sha or prState not defined");
  }
});

test("creates cluster and saves to the database", async () => {
  const event = await eventJS("create_a_pr");
  await create({ body: event });
  expect(createCluster).toHaveBeenCalledTimes(1);
  expect(pollCluster).toHaveBeenCalledTimes(1);
  expect(createDeployment).toHaveBeenCalledTimes(1);
  expect(getConfig).toHaveBeenCalledTimes(1);
  expect(saveReleaseToDB).toHaveBeenCalledTimes(3);
  expect(getRelease).toHaveBeenCalledTimes(1);
});
