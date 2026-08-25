# Marona A2A

Provider-neutral Agent-to-Agent examples for Marona AI Runtime in Python,
TypeScript, and Java. Each language demonstrates:

- `a2a`: expose an Agent Card and task endpoint
- `a2a-peer`: discover and call an independent peer safely
- `a2a-realtime`: carry peer collaboration into a streamed interaction

The examples use a deterministic travel-planning domain so tests do not call a
model provider or require paid credentials.

## Language examples

| Language | A2A server | Secure peer | Realtime |
| --- | --- | --- | --- |
| [Python](examples/python) | HTTP+JSON and JSON-RPC | Marona `A2APeer` | SSE task/artifact stream |
| [TypeScript](examples/typescript) | HTTP+JSON | Marona `A2APeer` | SSE task/artifact stream |
| [Java](examples/java) | JSON-RPC | Marona `A2APeer` | Started/completed lifecycle events |

See [A2A architecture and trust boundaries](docs/architecture.md) before
adapting an example for production.

## Quick start

Start the Python peer server:

```bash
docker compose up --build python
curl http://127.0.0.1:8100/.well-known/agent-card.json
```

Run TypeScript instead:

```bash
docker compose --profile typescript up --build typescript
```

Java resolves `ai.marona:marona:0.14.2` directly from Maven Central. No local
SDK installation is required before building its JAR or image.

## Security defaults

- Plain HTTP is accepted only for localhost development.
- Peer inputs redact known payment and identity fields.
- Skills and tool permissions are allowlisted.
- Containers run as non-root users.
- No API key or bearer token is included in an Agent Card.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes and use the
private process in [SECURITY.md](SECURITY.md) for vulnerabilities.

## License

[MIT](LICENSE) © 2026 Blessing Nyuwani
