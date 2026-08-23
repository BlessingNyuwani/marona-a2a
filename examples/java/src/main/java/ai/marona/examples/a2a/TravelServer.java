package ai.marona.examples.a2a;

import ai.marona.A2AServer;

public final class TravelServer {
    private TravelServer() {
    }

    public static A2AServer create(String baseUrl) {
        return new A2AServer(TravelProtocol.agentCard(baseUrl), TravelProtocol::handle);
    }

    public static void main(String[] args) {
        int port = Integer.parseInt(environment("PORT", "8100"));
        String baseUrl = environment("A2A_BASE_URL", "http://127.0.0.1:" + port);
        create(baseUrl).run("0.0.0.0", port);
    }

    private static String environment(String name, String fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : value;
    }
}

