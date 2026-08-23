"""Discover and call an independent A2A peer with a restrictive local policy."""

from __future__ import annotations

import asyncio
import json
import os
from typing import Any

from marona.a2a import A2APeer, A2APolicy


def create_peer(**overrides: Any) -> A2APeer:
    token = os.getenv("A2A_BEARER_TOKEN")
    return A2APeer(
        name="travel-planner",
        url=os.getenv("A2A_PEER_URL", "http://127.0.0.1:8100"),
        authentication={"type": "bearer", "token": token} if token else None,
        permissions=["travel.route.read"],
        policy=A2APolicy(
            allowed_skills=("plan-travel",),
            denied_fields=("payment_credentials", "identity_document"),
        ),
        **overrides,
    )


async def call_peer() -> None:
    task = await create_peer().run(
        input={"origin": "Harare", "destination": "Victoria Falls"},
        skill="plan-travel",
    )
    print(json.dumps(task.to_dict(), indent=2))


def main() -> None:
    asyncio.run(call_peer())


if __name__ == "__main__":
    main()

