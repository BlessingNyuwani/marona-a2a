package ai.marona.examples.a2a;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.time.Instant;
import java.util.UUID;

final class TravelProtocol {
    private TravelProtocol() {
    }

    static ObjectNode agentCard(String baseUrl) {
        ObjectNode card = JsonNodeFactory.instance.objectNode()
                .put("name", "Marona Travel Planner")
                .put("description", "Plans routes without booking or charging the traveller.")
                .put("version", "1.0.0")
                .put("protocolVersion", "1.0")
                .put("url", baseUrl);
        card.putArray("interfaces").addObject()
                .put("url", baseUrl)
                .put("protocolBinding", "JSONRPC")
                .put("protocolVersion", "1.0");
        card.putArray("supportedInterfaces").addObject()
                .put("url", baseUrl)
                .put("protocolBinding", "JSONRPC")
                .put("protocolVersion", "1.0");
        card.putObject("capabilities")
                .put("streaming", false)
                .put("pushNotifications", false);
        card.putArray("defaultInputModes").add("text").add("data");
        card.putArray("defaultOutputModes").add("text").add("data");
        card.putArray("skills").addObject()
                .put("id", "plan-travel")
                .put("name", "Plan travel")
                .put("description", "Prepare a route recommendation between two locations.");
        return card;
    }

    static ObjectNode handle(JsonNode parameters) {
        JsonNode message = parameters.path("message");
        JsonNode input = message.path("parts").path(0).path("data");
        String taskId = message.path("taskId").asText(UUID.randomUUID().toString());
        String contextId = message.path("contextId").asText(taskId);
        ObjectNode output = JsonNodeFactory.instance.objectNode()
                .put("origin", input.path("origin").asText("Harare"))
                .put("destination", input.path("destination").asText("Victoria Falls"))
                .put("recommendation", "Review available routes and confirm before booking.")
                .put("handled_by", "travel-planner");
        ObjectNode task = JsonNodeFactory.instance.objectNode()
                .put("id", taskId)
                .put("contextId", contextId)
                .set("output", output);
        task.putObject("status")
                .put("state", "TASK_STATE_COMPLETED")
                .put("timestamp", Instant.now().toString());
        return task;
    }
}

