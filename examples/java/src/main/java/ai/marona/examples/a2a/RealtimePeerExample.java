package ai.marona.examples.a2a;

import ai.marona.A2ATask;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public final class RealtimePeerExample {
    private static final ObjectMapper JSON = new ObjectMapper();

    private RealtimePeerExample() {
    }

    public static void main(String[] args) throws Exception {
        String url = args.length > 0 ? args[0] : "http://127.0.0.1:8100";
        emit("a2a.task.started", null);
        A2ATask task = PeerExample.call(url);
        emit("a2a.task.completed", task);
    }

    private static void emit(String type, A2ATask task) throws Exception {
        ObjectNode event = JSON.createObjectNode().put("type", type);
        if (task != null) {
            event.put("task_id", task.id())
                    .put("state", task.state())
                    .set("output", task.output());
        }
        System.out.println(JSON.writeValueAsString(event));
    }
}

