# Java A2A examples

Maven resolves `ai.marona:marona:0.14.2` directly from Maven Central. No
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

SDK 0.14.2 provides JSON-RPC server/peer support but not an SSE client helper;
the realtime example therefore emits stable started/completed lifecycle events
around the same secured peer task. The Python and TypeScript examples include
full SSE streaming.
