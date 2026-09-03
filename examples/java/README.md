# Java A2A examples

Marona Runtime-backed A2A execution requires a Marona Developer Key. The local
protocol tests do not contact the Runtime; configure the key before using these
examples in a Runtime flow:

```bash
export MARONA_API_KEY=mr_live_xxxxx # placeholder; use your real key locally
```

Maven resolves `ai.marona:marona:1.0.0` directly from Maven Central. No
sibling checkout or local SDK installation is required:

```bash
mvn verify
java -jar target/marona-a2a-java-example.jar
```

Call the running peer or emit newline-delimited lifecycle events:

```bash
java -cp target/marona-a2a-java-example.jar ai.marona.examples.a2a.PeerExample
java -cp target/marona-a2a-java-example.jar ai.marona.examples.a2a.RealtimePeerExample
```

SDK 1.0.0 provides JSON-RPC server/peer support but not an SSE client helper;
the realtime example therefore emits stable started/completed lifecycle events
around the same secured peer task. The Python and TypeScript examples include
full SSE streaming.
