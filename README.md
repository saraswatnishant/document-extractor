# Document Extractor

A parameter extraction and authoring application being developed with
production use and multi-developer collaboration in mind.

**Status: initial project setup.** The frontend starter is runnable. Backend
has a minimal FastAPI application with a liveness endpoint and test. No
extraction pipeline has been implemented. This repository is not
production-ready.

## Intended workflow

1. Select a PKM recipe from a third-party system.
2. Upload source documents.
3. Trigger asynchronous OCR and LLM extraction.
4. Review candidate parameter values with links to exact source evidence.
5. Select or author values and complete the review workflow.

Recipes may contain thousands of parameters in deeply nested JSON structures
of approximately 40,000 lines. Uploads commonly contain 20-50 documents, but
final limits are not yet defined.

A parameter can have multiple extracted candidates. Candidates, user
selections, authored values, and approvals must remain distinguishable.
Extraction must not silently finalize a value on the user's behalf.

## Current implementation

| Area | Status |
|---|---|
| Backend | FastAPI application with `/health/live`, an endpoint test, and Uvicorn; Python 3.13 selected locally |
| Frontend | React + TypeScript + Vite starter with an introductory screen |
| Frontend testing | Vitest, jsdom, React Testing Library, and one component test |
| Frontend checks | Strict TypeScript checks, Oxlint, and production build |
| Docker / Compose | Planned; no container configuration yet |
| Database and workers | Planned; no PostgreSQL, Redis, or Celery integration yet |
| CI/CD and AWS | GitHub Actions lint/test workflow configured; deployment and infrastructure are not implemented |

No recipe integration, document upload, extraction, authentication, or review
workflow exists yet.

## Repository structure

```text
.
├── AGENTS.md       # Project context and development guidance
├── README.md       # Project overview and getting started
├── backend/        # FastAPI application, tests, and dependency lockfile
└── frontend/       # React application, tests, and frontend tooling
```

See [AGENTS.md](./AGENTS.md) for engineering expectations and unresolved product
questions, the [backend README](./backend/README.md) for API details, and the
[frontend README](./frontend/README.md) for frontend details.

## Prerequisites

- Git.
- [uv](https://docs.astral.sh/uv/) for Python and backend dependency management.
- Python 3.13 for the selected local backend baseline.
- Node.js 22.12+ within 22.x, or Node.js 24.x, with npm.
  The frontend was initially verified with Node.js 24.11.1 and npm 11.6.2.

Docker-based development is the intended workflow, but is not configured yet.
The commands below describe the current host-based setup.

## Getting started

Run commands from the repository root unless stated otherwise.

### Git hooks (macOS)

With [Homebrew](https://brew.sh) and Make available, run once per clone:

```bash
make pre-commit-install
```

This installs the pre-commit CLI using Homebrew and registers the `pre-commit`
and `commit-msg` Git hooks. Backend dependencies and frontend dependencies must
also be installed for their lint hooks to run.

The [hook configuration](./.pre-commit-config.yaml) checks lint, YAML,
whitespace, final newlines, merge conflicts, branch names, and Conventional
Commit messages such as `feat: add uploads`. Use branches such as
`feat/document-upload`; direct commits to `main` and `master` are blocked.
Whitespace and newline hooks may modify files; review and stage those changes
before retrying a commit. Local hooks can be bypassed and do not replace CI.

### Backend environment

```bash
cd backend
uv sync --locked
uv run python --version
uv run uvicorn app.main:app --reload
```

`uv sync --locked` installs the dependencies recorded in `uv.lock` into a local
`.venv` and fails if the lockfile needs updating. The `.python-version` file
selects Python 3.13 locally; `pyproject.toml` currently declares `>=3.13`.

Open <http://127.0.0.1:8000/docs> for interactive API documentation.
`GET /health/live` returns `{"status": "ok"}`; it is a liveness check only,
not a database or worker readiness check. `--reload` is for development only.

Run the backend test from `backend/`:

```bash
uv run pytest
```

Run `make lint` from `backend/` for Ruff lint checks.
Backend type-check tooling has not been configured yet.

### Frontend development

In a new terminal, from the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite. The page currently contains only the
application introduction and does not call a backend.

### Frontend validation

From `frontend/`:

```bash
npm test
npm run lint
npm run build
```

Additional commands:

- `npm run test:watch`: rerun tests as files change.
- `npm run preview`: inspect a production build locally after building.

The initial component test, lint checks, and TypeScript/production build passed.
The development server was also checked for HTTP responses. These checks do
not constitute end-to-end testing or production-readiness verification.
Vite's development and preview servers are not production servers.

## Planned processing architecture

```text
React frontend → FastAPI → Celery tasks via Redis
                              |
                              v
                    OCR / LLM extraction
                              |
                              v
                      Raw artifacts in S3
                              |
                              v
                   Candidate ingestion task
                              |
                              v
                         PostgreSQL
```

This is a logical pipeline, not an implemented deployment diagram.
Worker counts, task granularity, and stage scheduling remain to be designed.

- S3 will retain source documents and processing artifacts.
- PostgreSQL will hold workflow state, extracted candidates, selections,
  and audit records.
- Redis will act as the Celery broker, not the sole durable record of work.
- Processing must tolerate retries and duplicate delivery without duplicating
  business effects or silently overwriting reviewed values.
- Evidence must identify the retained source version, supporting text, and
  a verifiable page or format-appropriate location.
- Handoffs between database commits, S3 writes, and task publication need
  explicit recovery; they are not one atomic transaction.

## Deployment direction

- Amazon ECS on Fargate is preferred, subject to workload validation.
- Amazon RDS for PostgreSQL.
- Amazon ElastiCache for a compatible Redis broker configuration.
- Amazon S3 for documents and processing artifacts.
- GitHub Actions for application CI/CD.
- Terraform provisioning in a separate infrastructure repository.

The infrastructure repository and cross-repository deployment contract will
be established later. Application deployment ownership must be explicit so
Terraform and application workflows do not compete over resource settings.

The OCR engine, LLM provider, and Celery result backend are not selected.

## Contributing and development approach

[GitHub Actions](./.github/workflows/ci.yml) runs backend Ruff/pytest and
frontend lint/tests on pull requests targeting `main` (including subsequent
pushes to those PRs) and pushes to `main`. Feature-branch pushes without a PR
do not trigger CI. A change-detection job enables
each service job only when its folder changes; changes to the CI workflow
enable both. Pull requests compare against their base, and pushes compare
against the previous pushed revision. Jobs use read-only permissions, including
pull-request read access for change detection. No deployment is performed.

- Work in small, explainable increments with focused changes.
- Use pull requests, code review, and relevant automated checks.
- Commit dependency manifests and lockfiles; do not commit virtual
  environments, `node_modules`, or generated build output.
- Never commit credentials or confidential documents. Use synthetic or
  explicitly approved, sanitized fixtures.
- Keep documentation aligned with implemented behavior and distinguish
  planned capabilities from working features.
- Explain significant design decisions and record accepted decisions as
  the architecture evolves.

See [AGENTS.md](./AGENTS.md) for the full learning-first collaboration and
engineering guide.
