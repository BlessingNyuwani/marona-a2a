"""Expose a deterministic travel specialist through Marona A2A 1.0."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from marona import Agent
from marona.a2a import A2ARequestContext, A2AServer


def plan_route(input_value: Any, context: A2ARequestContext) -> dict[str, Any]:
    request = input_value if isinstance(input_value, dict) else {"request": input_value}
    return {
        "origin": request.get("origin", "Harare"),
        "destination": request.get("destination", "Victoria Falls"),
        "recommendation": "Review available routes and confirm before booking.",
        "handled_by": "travel-planner",
        "task_id": context.task_id,
    }


def create_server(task_store_path: str | Path | None = None) -> A2AServer:
    public_url = os.getenv("A2A_BASE_URL", "http://127.0.0.1:8100")
    agent = Agent(
        name="Marona Travel Planner",
        description="Plans routes without booking or charging the traveller.",
    )
    return A2AServer(
        agent=agent,
        skills=[
            {
                "id": "plan-travel",
                "name": "Plan travel",
                "description": "Prepare a route recommendation between two locations.",
            }
        ],
        url=public_url,
        api_key=os.getenv("A2A_BEARER_TOKEN"),
        executor=plan_route,
        task_store_path=task_store_path or os.getenv("A2A_TASK_STORE", "/data/tasks.sqlite"),
        metadata={"version": "1.0.0"},
    )


def main() -> None:
    create_server().run(host="0.0.0.0", port=int(os.getenv("PORT", "8100")))


if __name__ == "__main__":
    main()
