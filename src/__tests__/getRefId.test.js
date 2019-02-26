import { eventJS } from "../__mocks__/";
import { getRefId } from "../lib/getRefId";

test("returns refId for create event", async () => {
  const event = await eventJS("create_a_pr");
  const result = getRefId(event);
  expect(result).toEqual("elenchos_demo");
});

test("returns refId for closed event", async () => {
  const event = await eventJS("closed_a_pr");
  const result = getRefId(event);
  expect(result).toEqual("elenchos_demo");
});

test("returns refId for initial push event", async () => {
  const event = await eventJS("push_to_intial_branch");
  const result = getRefId(event);
  expect(result).toEqual("elenchos_demo");
});

test("returns false for push to master", async () => {
  const event = await eventJS("push_to_master");
  const result = getRefId(event);
  expect(result).toEqual(false);
});

test("returns refId when pr is reopened", async () => {
  const event = await eventJS("reopen_a_pr");
  const result = getRefId(event);
  expect(result).toEqual("elenchos_demo");
});

test("returns refId when a branch is updated", async () => {
  const event = await eventJS("update_to_branch");
  const result = getRefId(event);
  expect(result).toEqual("elenchos_demo");
});