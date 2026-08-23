# A2A architecture and trust boundaries

Each language follows the same flow:

1. A server publishes a public Agent Card under `/.well-known/agent-card.json`.
2. A peer discovers the card and validates its skills and interface.
3. A local policy restricts skills, payload size, transport, and sensitive data.
4. The peer submits a structured A2A 1.0 task rather than sharing conversation
   state or credentials.
5. The server returns task status and an artifact or normalized output.
6. Realtime consumers receive stable lifecycle events for progressive UI.

## Production controls

- Use HTTPS for every non-local peer.
- Authenticate task endpoints while keeping the public Agent Card discoverable.
- Allowlist skills and exact local permissions.
- Redact credentials, identity documents, and payment fields before transport.
- Apply request/response limits and disable redirects to reduce SSRF exposure.
- Persist task identifiers, not credentials, for continuation and audit.
- Put rate limiting, structured logs, and distributed tracing at the edge.

The examples are deterministic by design. Replace the route handler with a
Marona Agent only after adding model credentials, guardrails, and observability.

