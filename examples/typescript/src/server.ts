import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";

import { isRecord, taskFor } from "./protocol.js";

const MAX_REQUEST_BYTES = 1_000_000;

export async function startServer(port = Number(process.env.PORT ?? "8100")): Promise<Server> {
  const server = createServer(handleRequest);
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "0.0.0.0", resolve);
  });
  return server;
}

async function handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const baseUrl = publicBaseUrl(request);
  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }
  if (request.method === "GET" && [
    "/.well-known/agent-card.json",
    "/.well-known/agent.json",
  ].includes(request.url ?? "")) {
    sendJson(response, 200, agentCard(baseUrl));
    return;
  }
  if (request.method !== "POST" || !["/message:send", "/message:stream"].includes(request.url ?? "")) {
    sendJson(response, 404, { error: { message: "Not found." } });
    return;
  }
  if (!authorized(request)) {
    response.setHeader("WWW-Authenticate", "Bearer");
    sendJson(response, 401, { error: { message: "A2A authentication required." } });
    return;
  }

  try {
    const body = await readJson(request);
    const message = isRecord(body.message) ? body.message : undefined;
    if (!message) throw new Error("SendMessage requires a message.");
    const task = taskFor(message);
    if (request.url === "/message:stream") {
      sendStream(response, task);
    } else {
      sendJson(response, 200, { task }, "application/a2a+json");
    }
  } catch (error) {
    sendJson(response, 400, { error: { message: error instanceof Error ? error.message : String(error) } });
  }
}

function agentCard(baseUrl: string): Record<string, unknown> {
  const secured = Boolean(process.env.A2A_BEARER_TOKEN);
  return {
    name: "Marona Travel Planner",
    description: "Plans routes without booking or charging the traveller.",
    version: "1.0.0",
    protocolVersion: "1.0",
    url: baseUrl,
    supportedInterfaces: [{
      url: baseUrl,
      protocolBinding: "HTTP+JSON",
      protocolVersion: "1.0",
    }],
    capabilities: { streaming: true, pushNotifications: false },
    defaultInputModes: ["text", "data"],
    defaultOutputModes: ["text", "data"],
    skills: [{
      id: "plan-travel",
      name: "Plan travel",
      description: "Prepare a route recommendation between two locations.",
    }],
    ...(secured ? { security: [{ bearer: [] }] } : {}),
  };
}

function publicBaseUrl(request: IncomingMessage): string {
  return process.env.A2A_BASE_URL ?? `http://${request.headers.host ?? "127.0.0.1:8100"}`;
}

function authorized(request: IncomingMessage): boolean {
  const token = process.env.A2A_BEARER_TOKEN;
  return !token || request.headers.authorization === `Bearer ${token}`;
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > MAX_REQUEST_BYTES) throw new Error("A2A request exceeds the size limit.");
    chunks.push(buffer);
  }
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  if (!isRecord(parsed)) throw new Error("A2A request must be an object.");
  return parsed;
}

function sendStream(response: ServerResponse, task: Record<string, unknown>): void {
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff",
  });
  const working = { ...task, status: { state: "TASK_STATE_WORKING" }, artifacts: [] };
  response.write(`data: ${JSON.stringify({ task: working })}\n\n`);
  const artifacts = Array.isArray(task.artifacts) ? task.artifacts : [];
  for (const artifact of artifacts) {
    response.write(`data: ${JSON.stringify({ artifactUpdate: { taskId: task.id, artifact } })}\n\n`);
  }
  response.end(`data: ${JSON.stringify({ statusUpdate: { taskId: task.id, status: task.status } })}\n\n`);
}

function sendJson(
  response: ServerResponse,
  status: number,
  value: unknown,
  contentType = "application/json",
): void {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body),
    "X-Content-Type-Options": "nosniff",
  });
  response.end(body);
}

const isEntryPoint = process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href;
if (isEntryPoint) {
  startServer().then((server) => {
    const address = server.address();
    console.log(`Marona A2A TypeScript example listening on ${JSON.stringify(address)}`);
  }).catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}

