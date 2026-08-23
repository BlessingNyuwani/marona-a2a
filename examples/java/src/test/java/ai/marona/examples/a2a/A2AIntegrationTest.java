package ai.marona.examples.a2a;

import ai.marona.A2AServer;
import ai.marona.A2ATask;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.ServerSocket;

import static org.junit.jupiter.api.Assertions.assertEquals;

final class A2AIntegrationTest {
    @Test
    void agentCardAndPeerTaskInteroperate() throws IOException {
        int port;
        try (ServerSocket socket = new ServerSocket(0)) {
            port = socket.getLocalPort();
        }
        String url = "http://127.0.0.1:" + port;
        try (A2AServer server = TravelServer.create(url)) {
            server.start("127.0.0.1", port);
            A2ATask task = PeerExample.call(url);

            assertEquals("TASK_STATE_COMPLETED", task.state());
            assertEquals("Victoria Falls", task.output().path("destination").asText());
            assertEquals("travel-planner", task.output().path("handled_by").asText());
        }
    }
}

