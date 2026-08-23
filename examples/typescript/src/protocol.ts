import { randomUUID } from "node:crypto";

export interface A2AEvent {
  task?: Record<string, unknown>;
  artifactUpdate?: Record<string, unknown>;
  statusUpdate?: Record<string, unknown>;
}

export function planRoute(input: unknown): Record<string, unknown> {
  const request = isRecord(input) ? input : { request: input };
  return {
    origin: request.origin ?? "Harare",
    destination: request.destination ?? "Victoria Falls",
    recommendation: "Review available routes and confirm before booking.",
    handled_by: "travel-planner",
  };
}

export function taskFor(message: Record<string, unknown>): Record<string, unknown> {
  const taskId = typeof message.taskId === "string" ? message.taskId : randomUUID();
  const contextId = typeof message.contextId === "string" ? message.contextId : taskId;
  const parts = Array.isArray(message.parts) ? message.parts : [];
  const firstPart = isRecord(parts[0]) ? parts[0] : {};
  const input = "data" in firstPart ? firstPart.data : firstPart.text;
  return {
    id: taskId,
    contextId,
    status: { state: "TASK_STATE_COMPLETED", timestamp: new Date().toISOString() },
    artifacts: [{
      artifactId: randomUUID(),
      name: "travel-plan",
      parts: [{ data: planRoute(input), mediaType: "application/json" }],
    }],
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

