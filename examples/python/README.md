# Python A2A examples

```bash
uv sync --extra dev
uv run pytest -q
uv run ruff check .
uv run mypy src
uv run marona-a2a
```

In a second terminal, call the peer or consume the SSE task stream:

```bash
uv run marona-a2a-peer
uv run marona-a2a-realtime
```

The peer allows only `plan-travel`, redacts sensitive fields locally, and
requires HTTPS for non-local URLs.
