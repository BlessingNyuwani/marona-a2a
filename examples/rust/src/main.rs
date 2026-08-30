use marona::{A2APeer, A2APolicy, A2AServer, ToolContext};
use serde_json::{json, Value};

fn agent_card() -> Value {
    json!({
        "name": "Rust Flight Agent",
        "description": "Finds deterministic return-flight options.",
        "version": "1.0.0",
        "protocolVersion": "1.0",
        "url": "http://127.0.0.1:8120",
        "skills": [{
            "id": "find-flight",
            "name": "Find flight",
            "description": "Find a return flight for a route and dates."
        }]
    })
}

async fn serve_peer() -> marona::Result<()> {
    let server = A2AServer::new(agent_card(), |request| async move {
        Ok(json!({
            "id": "task_rust_flight",
            "contextId": "travel_example",
            "status": {"state": "TASK_STATE_COMPLETED"},
            "output": {
                "flight": "Harare to Cape Town return",
                "price_usd": 640,
                "request": request
            }
        }))
    });
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8120")
        .await
        .map_err(|error| marona::Error::A2A(error.to_string()))?;
    println!("Rust A2A peer: http://127.0.0.1:8120");
    axum::serve(listener, server.router())
        .await
        .map_err(|error| marona::Error::A2A(error.to_string()))
}

async fn call_peer() -> marona::Result<()> {
    let peer = A2APeer::new("flight-agent", "http://127.0.0.1:8120")?
        .description("Independently deployed flight agent.")
        .permissions(["travel.route.read"])
        .policy(A2APolicy {
            require_https: true,
            denied_fields: vec!["passport_number".into(), "payment_card".into()],
            ..Default::default()
        });
    let context = ToolContext {
        user_id: Some("rust-example-user".into()),
        session_id: "rust-a2a-session".into(),
        permissions: vec!["travel.route.read".into()],
        ..Default::default()
    };
    let task = peer
        .run(
            json!({
                "origin": "Harare",
                "destination": "Cape Town",
                "passport_number": "redacted-before-send"
            }),
            Some("find-flight"),
            &context,
        )
        .await?;
    println!("{}", task.output);
    Ok(())
}

#[tokio::main]
async fn main() -> marona::Result<()> {
    match std::env::args().nth(1).as_deref() {
        Some("peer") => call_peer().await,
        _ => serve_peer().await,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn card_and_secure_peer_configuration_are_valid() {
        assert_eq!(agent_card()["skills"][0]["id"], "find-flight");
        let peer = A2APeer::new("flight-agent", "http://127.0.0.1:8120")
            .expect("localhost peer is valid")
            .permissions(["travel.route.read"]);
        assert_eq!(peer.permissions, vec!["travel.route.read"]);
    }
}
