# TypeScript A2A examples

Marona Runtime-backed A2A execution requires a Marona Developer Key. The local
protocol tests do not contact the Runtime; configure the key before using these
examples in a Runtime flow:

```bash
export MARONA_API_KEY=mr_live_xxxxx # placeholder; use your real key locally
```

```bash
pnpm install
pnpm test
pnpm start
```

In a second terminal:

```bash
pnpm peer
pnpm realtime
```

`A2APeer` from `marona@1.0.0` handles discovery, policy enforcement,
redaction, and task normalization. The small Node server exposes A2A 1.0
HTTP+JSON and SSE endpoints without a web-framework dependency.
