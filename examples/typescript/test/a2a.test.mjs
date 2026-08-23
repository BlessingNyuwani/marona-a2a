import assert from "node:assert/strict";
import test from "node:test";

import { callPeer } from "../dist/peer.js";
import { streamPeer } from "../dist/realtime.js";
import { startServer } from "../dist/server.js";

test("Agent Card, peer task, and realtime stream interoperate", async (context) => {
  const server = await startServer(0);
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}`;

  const cardResponse = await fetch(`${url}/.well-known/agent-card.json`);
  assert.equal(cardResponse.status, 200);
  const card = await cardResponse.json();
  assert.equal(card.skills[0].id, "plan-travel");

  const task = await callPeer(url);
  assert.equal(task.state, "TASK_STATE_COMPLETED");
  assert.equal(task.output.destination, "Victoria Falls");

  const events = [];
  for await (const event of streamPeer(url)) events.push(event);
  assert.equal(events.length, 3);
  assert.equal(events[0].task.status.state, "TASK_STATE_WORKING");
  assert.equal(events[2].statusUpdate.status.state, "TASK_STATE_COMPLETED");
});

test("peer rejects non-local plain HTTP", async () => {
  await assert.rejects(() => callPeer("http://example.com"), /HTTPS/);
});

