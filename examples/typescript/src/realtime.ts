import { randomUUID } from "node:crypto";

import type { A2AEvent } from "./protocol.js";

export async function* streamPeer(
  url = process.env.A2A_PEER_URL ?? "http://127.0.0.1:8100",
): AsyncGenerator<A2AEvent> {
  const token = process.env.A2A_BEARER_TOKEN;
  const response = await fetch(`${url.replace(/\/+$/, "")}/message:stream`, {
    method: "POST",
    headers: {
      "A2A-Version": "1.0",
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message: {
        messageId: randomUUID(),
        role: "ROLE_USER",
        parts: [{
          data: { origin: "Harare", destination: "Victoria Falls" },
          mediaType: "application/json",
        }],
        metadata: { requested_skill: "plan-travel" },
      },
      configuration: { returnImmediately: false },
    }),
  });
  if (!response.ok || !response.body) throw new Error(`A2A stream failed with HTTP ${response.status}`);

  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      const line = frame.split("\n").find((value) => value.startsWith("data:"));
      if (line) yield JSON.parse(line.slice(5).trim()) as A2AEvent;
    }
  }
}

const isEntryPoint = process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href;
if (isEntryPoint) {
  (async () => {
    for await (const event of streamPeer()) console.log(JSON.stringify(event));
  })().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}

