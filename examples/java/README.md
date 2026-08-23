# Java A2A examples

The Java SDK is not yet on Maven Central. First install
`ai.marona:marona:0.13.8` from `edge-node-service/clients/java` with
`mvn install`, then:

```bash
mvn verify
java -jar target/marona-a2a-java-example.jar
```

Call the running peer or emit newline-delimited lifecycle events:

```bash
java -cp target/marona-a2a-java-example.jar ai.marona.examples.a2a.PeerExample
java -cp target/marona-a2a-java-example.jar ai.marona.examples.a2a.RealtimePeerExample
```

SDK 0.13.8 provides JSON-RPC server/peer support but not an SSE client helper;
the realtime example therefore emits stable started/completed lifecycle events
around the same secured peer task. The Python and TypeScript examples include
full SSE streaming.
