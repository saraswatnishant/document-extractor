.PHONY: dev test lint

dev:
	uv run --locked uvicorn app.main:app --reload
test:
	uv run --locked pytest

lint:
	uv run --locked ruff check .
