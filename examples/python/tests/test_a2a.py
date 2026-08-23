from pathlib import Path

import httpx
import pytest
from marona.a2a import A2APeer, A2APolicy, A2ATaskStore

from marona_a2a.server import create_server


@pytest.mark.asyncio
async def test_card_peer_task_and_realtime_stream(tmp_path: Path) -> None:
    server = create_server(tmp_path / "server.sqlite")
    peer = A2APeer(
        name="travel-planner",
        url="http://127.0.0.1:8100",
        policy=A2APolicy(
            allowed_skills=("plan-travel",),
            denied_fields=("payment_credentials",),
        ),
        task_store=A2ATaskStore(tmp_path / "client.sqlite"),
        http_transport=httpx.ASGITransport(app=server),
    )

    card = await peer.discover()
    assert card["name"] == "Marona Travel Planner"
    assert card["skills"][0]["id"] == "plan-travel"

    task = await peer.run(
        input={
            "origin": "Harare",
            "destination": "Victoria Falls",
            "payment_credentials": "must-not-leave-device",
        },
        skill="plan-travel",
    )
    assert task.completed
    assert task.output["destination"] == "Victoria Falls"
    assert "must-not-leave-device" not in str(task.raw)

    events = [
        event
        async for event in peer.client.stream(
            {"origin": "Harare", "destination": "Victoria Falls"},
            skill="plan-travel",
        )
    ]
    assert events[0].type == "a2a.task.started"
    assert events[-1].type == "a2a.task.completed"
    assert any(event.type == "a2a.artifact.updated" for event in events)


def test_non_local_plain_http_peer_is_rejected() -> None:
    with pytest.raises(Exception, match="HTTPS"):
        A2APeer(name="unsafe", url="http://example.com")
