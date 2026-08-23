"""Stream A2A task and artifact updates for a realtime user interface."""

from __future__ import annotations

import asyncio
import json

from .peer import create_peer


async def stream_peer() -> None:
    peer = create_peer()
    async for event in peer.client.stream(
        {"origin": "Harare", "destination": "Victoria Falls"},
        skill="plan-travel",
    ):
        print(json.dumps({
            "type": event.type,
            "task_id": event.task_id,
            "state": event.state,
            "output": event.output,
        }))


def main() -> None:
    asyncio.run(stream_peer())


if __name__ == "__main__":
    main()

