package ai.marona.examples.a2a;

import ai.marona.A2APeer;
import ai.marona.A2APolicy;
import ai.marona.A2ATask;
import ai.marona.ToolContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;

public final class PeerExample {
    private static final ObjectMapper JSON = new ObjectMapper();

    private PeerExample() {
    }

    public static A2APeer create(String url) {
        return new A2APeer("travel-planner", url)
                .description("Prepare a route through an independent A2A peer.")
                .permissions("travel.route.read")
                .policy(new A2APolicy(
                        true,
                        1_000_000,
                        10_000_000,
                        List.of("payment_credentials", "identity_document")
                ));
    }

    public static A2ATask call(String url) {
        ObjectNode input = JSON.createObjectNode()
                .put("origin", "Harare")
                .put("destination", "Victoria Falls");
        ToolContext context = new ToolContext(
                "example-user",
                "travel-session",
                null,
                List.of("travel.route.read"),
                List.of(),
                null
        );
        return create(url).run(input, "plan-travel", context);
    }

    public static void main(String[] args) throws Exception {
        String url = args.length > 0 ? args[0] : environment(
                "A2A_PEER_URL",
                "http://127.0.0.1:8100"
        );
        System.out.println(JSON.writerWithDefaultPrettyPrinter().writeValueAsString(call(url)));
    }

    private static String environment(String name, String fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : value;
    }
}

