FROM ghcr.io/astral-sh/uv:0.8.15 AS uv

FROM python:3.12-slim AS builder

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/opt/venv
WORKDIR /build
COPY --from=uv /uv /usr/local/bin/uv
COPY examples/python/pyproject.toml examples/python/uv.lock ./
COPY examples/python/src ./src
RUN uv sync --frozen --no-dev --no-editable

FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/opt/venv/bin:$PATH \
    A2A_TASK_STORE=/data/tasks.sqlite
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
RUN groupadd --gid 10001 marona \
    && useradd --uid 10001 --gid marona --no-create-home marona \
    && mkdir /data \
    && chown marona:marona /data
USER 10001:10001
EXPOSE 8100
ENTRYPOINT ["python", "-m", "marona_a2a.server"]

