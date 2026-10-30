# Document Extractor backend

Minimal FastAPI application. No database, worker, authentication, or extraction
integration is implemented yet.

## Setup and run

Requires uv and Python 3.13 (selected by `.python-version`).
From this directory:

```bash
uv sync --locked
uv run uvicorn app.main:app --reload
```

- Liveness: <http://127.0.0.1:8000/health/live>
- Interactive API documentation: <http://127.0.0.1:8000/docs>
- OpenAPI schema: <http://127.0.0.1:8000/openapi.json>

`--reload` is for local development only. Docker and production server
configuration will be added separately.

## Tests

```bash
uv run pytest
```

pytest runs the tests; httpx2 powers the installed Starlette/FastAPI
in-process `TestClient` (the older httpx integration is deprecated).
The liveness test checks the HTTP status and exact JSON response without
starting a network server or requiring external services.

## Lint

From this directory:

```bash
make lint
```

Runs `uv run --locked ruff check .` with Ruff's default rules plus import sorting.
The source root is explicitly configured so local hooks and CI classify
application imports consistently.
Reports issues without modifying files. Formatting and type checking are
not configured yet.

## How it works

- `app/__init__.py` identifies the application package.
- `app/main.py` defines `create_app()`, which constructs a FastAPI instance
  and registers the liveness endpoint.
- The module-level `app` is the ASGI application that Uvicorn imports.
- `tests/test_health.py` creates an independent application for its test.

`GET /health/live` returns `{"status": "ok"}`. This indicates only that the API
can respond; it does not assert database, broker, worker, or provider readiness.
Separate readiness checks will be introduced with those integrations.
