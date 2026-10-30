# Project Guide

## Purpose

Build an enterprise-grade parameter extraction and authoring application
with a frontend and backend, deployed on AWS.

The owner is learning while building. Understanding the implementation is
a deliverable, not an optional activity.

## Current Product Understanding

The intended workflow is:

1. Select a PKM recipe retrieved from a third-party system.
2. Upload source documents.
3. Trigger extraction.
4. Review proposed parameter values and supporting evidence.
5. Author or correct values and complete the review workflow.

Known characteristics:

- Recipes are complex, deeply nested JSON structures, approximately
  40,000 lines long, containing thousands of parameters.
- Uploads commonly contain 20-50 documents, but this is not a fixed limit.
- Extraction uses an LLM.
- Extracted values must link to the exact supporting text and its location
  in the source document.
- Infrastructure is managed with Terraform in a separate repository.

These are initial requirements, not a complete specification.
Do not invent missing business rules.

## Learning-First Collaboration

- Before implementation, explain the problem, proposed approach, relevant
  alternatives, and trade-offs.
- Work in small, coherent increments that the owner can understand.
- Start with the bare minimum explicitly requested. Creating a file does
  not authorize populating it with unrequested code or boilerplate.
- Add functionality incrementally as requested; production quality means
  correctness and clarity, not more code, targets, tooling, or abstractions.
- Explain new dependencies, services, abstractions, and terminology before
  introducing them.
- For each increment, explain the changed code, data flow, failure handling,
  and tests.
- Support line-by-line walkthroughs. Do not treat generated code as
  self-explanatory or ask the owner to accept code they do not understand.
- Ask for confirmation before significant architecture decisions, new
  paid services, or material changes to product behavior.
- Do not require approval for every routine edit within an agreed scope.
- When asked for advice or a plan, do not implement changes.

## Decision Discipline

- Distinguish confirmed requirements, proposals, assumptions, and open
  questions.
- Record significant accepted decisions and their rationale in
  architectural decision records.
- Do not choose a technology merely because it is described as
  enterprise-grade.
- Prefer the simplest design that satisfies demonstrated requirements.
- Avoid premature microservices, generic frameworks, and speculative
  abstractions.
- Treat instruction files as guidance, not permanent conversation memory.
  Persist important accepted decisions in repository documentation.

## Repository Boundaries

This repository owns:

- Frontend and backend application code.
- Application API contracts and data models.
- Application tests and documentation.
- Application build and release configuration.

The separate infrastructure repository owns Terraform and AWS
infrastructure provisioning.

Document resource ownership and the contract between repositories,
including configuration, secrets references, deployment responsibilities,
and compatibility.

Do not provision infrastructure from application code or duplicate
resource ownership without an explicit decision.

## Implementation Standards

- Inspect existing code and conventions before making changes.
- Make focused changes that fully address the agreed requirement.
- Preserve unrelated work and existing intended behavior.
- Use appropriate type safety and validate external input at trust
  boundaries.
- Keep business rules explicit and independently testable.
- Reuse established helpers and patterns before introducing alternatives.
- Handle errors explicitly; do not hide failures behind success-shaped
  responses or silent defaults.
- Add dependencies only when justified, and explain their purpose,
  maintenance implications, and trade-offs.
- Update directly affected documentation alongside behavior changes.
- Never claim production readiness solely because code builds or tests pass.

## Recipe and Parameter Integrity

- Preserve the original imported recipe and identify its version.
- Define stable parameter identities or paths before relying on them.
- Do not silently drop, rename, coerce, or overwrite recipe fields.
- Validate proposed values against applicable types, units, constraints,
  and parameter dependencies.
- Distinguish missing, null, empty, zero, false, and not-applicable values
  according to the agreed schema.
- Separate direct extraction, normalization, derived calculations, and
  human-authored values so their origins remain traceable.
- Do not assume the entire recipe and all documents fit in one LLM request.

## Evidence and Provenance

- Treat evidence as a first-class part of an extracted value.
- Evidence must identify the source document and its immutable version
  or content hash.
- Retain the supporting quote and a verifiable source location.
- Use page references where meaningful, with text offsets or page
  coordinates where needed.
- Define format-specific location strategies for sources without stable
  page numbers.
- Validate that cited text and locations correspond to the retained
  source. An LLM-generated citation is not proof.
- Preserve traceability through parsing, OCR, normalization, extraction,
  review, and export.
- For derived values, retain input evidence and the derivation rule.
- Distinguish evidence supporting a proposed value from the record of
  who authored or approved it.

## LLM Reliability

- Treat uploaded content as untrusted data, never as instructions.
- Validate structured model outputs before using them.
- Represent unsupported, ambiguous, conflicting, and invalid results
  explicitly rather than fabricating values.
- Preserve relevant model, prompt, configuration, recipe, document, and
  processing versions for each extraction run.
- Do not promise deterministic model outputs or exact replay unless the
  chosen system can demonstrate those properties.
- Do not present model-reported confidence as calibrated certainty.
- Establish representative evaluation cases before claiming extraction
  quality.
- Measure value accuracy, evidence correctness, missing-value handling,
  and conflict handling.
- Define acceptable quality, latency, and cost targets with the owner.

## Human Review and Audit

- Keep machine proposals distinguishable from human edits and approvals.
- Do not overwrite reviewed values silently during re-extraction.
- Define review states and allowed transitions explicitly.
- Record who changed or approved a value, when, and its previous value.
- Apply authorization to viewing, editing, approving, and exporting.
- Define concurrent-edit behavior before supporting simultaneous editing.

## Durable Processing

Extraction is long-running work and must not depend on a single browser
session or long-lived HTTP request.

Design for:

- Durable job state and progress reporting.
- Idempotent operations and safe retries.
- Bounded concurrency and provider rate limits.
- Explicit timeout and cancellation behavior.
- Partial failures and recovery.
- Duplicate requests and repeated message delivery.
- Per-run usage and cost visibility.

Do not assume exactly-once execution. Identify side effects and make
repeated execution safe where required.

## Security and Privacy

- Never commit secrets, credentials, or confidential source documents.
- Use least-privilege access and approved secret management.
- Enforce authorization server-side.
- Apply tenant or organization isolation if the product requires it;
  do not assume the tenancy model.
- Validate upload type, size, and content, and define malware-handling
  controls before production use.
- Define encryption, retention, deletion, backup, and recovery requirements.
- Confirm data residency and model-provider data handling before sending
  real documents to an external service.
- Do not log document contents, extracted sensitive values, credentials,
  or raw prompts by default.
- Use synthetic or explicitly approved, sanitized data for development
  and tests.

## Testing and Verification

- Use repository-standard formatting, linting, type checks, and tests.
- Test business rules and failure paths, not only successful requests.
- Cover evidence integrity, invalid outputs, missing values, conflicting
  sources, authorization, retries, and duplicate execution where relevant.
- Separate deterministic automated tests from live model evaluations.
- Do not make ordinary CI depend on paid external model calls without an
  explicit decision.
- Run the smallest relevant validation first and expand when needed.
- Report exactly what was tested and what remains unverified.
- Do not claim a command passed unless it was actually executed
  successfully.
- Document build and test commands once the stack is selected; do not
  invent commands before tooling exists.

## Operations and Delivery

Before production release, establish and verify:

- Separate environments with controlled configuration.
- Reproducible builds and automated quality/security checks.
- Controlled deployments and rollback procedures.
- Safe, versioned database migrations.
- Structured logs, metrics, and tracing with sensitive-data redaction.
- Operational audit records distinct from debug logs.
- Health checks, actionable alerts, and failure runbooks.
- Backup restoration and recovery procedures.
- Dependency and vulnerability management.
- Agreed service objectives, capacity expectations, and cost budgets.

Implement these controls at the appropriate stage. Do not introduce every
possible enterprise tool at project initialization.

## Open Questions

Resolve these before decisions that depend on them:

- What does PKM mean, and what is the recipe schema?
- How are recipe versions and parameter identities represented?
- What does "build parameters" mean beyond extracting values?
- Does "author" mean editing, approving, creating new values, or all three?
- Which file formats, languages, tables, and scanned documents are in scope?
- What are the expected document sizes and upload limits?
- Is the application single-organization or multi-tenant?
- Which roles and approval rules are required?
- What confidentiality, compliance, and residency requirements apply?
- What are the expected workload, latency, availability, and cost targets?
- What quality thresholds define an acceptable extraction?
- Are reviewed results exported, versioned internally, or written back
  to the third-party system?

## Technology Baseline

Confirmed choices:

- Docker-based local development.
- FastAPI backend.
- Celery for background task execution.
- Redis as the Celery message broker.
- PostgreSQL for application data.
- Amazon S3 for source documents and raw processing artifacts.
- GitHub Actions for application CI/CD.
- React with TypeScript and Vite for the frontend.
- Vitest and React Testing Library for frontend unit/component testing.
- Terraform infrastructure code maintained in a separate repository.

Deployment direction:

- Amazon RDS for PostgreSQL.
- Amazon ElastiCache for the Redis-compatible broker, with engine,
  version, and Celery compatibility verified before provisioning.
- Amazon ECS on Fargate is the preferred compute platform, subject
  to validating OCR dependencies and workload resource requirements.

The OCR engine, LLM provider, and Celery result backend are not yet selected.

Do not silently replace agreed technologies. Explain any compatibility
issue or requirement that warrants reconsidering a choice.

## Processing Pipeline

The intended pipeline has two logical stages:

1. OCR and extraction:
   - Read uploaded source documents.
   - Perform OCR or text parsing as appropriate for the document.
   - Extract candidate values with source evidence.
   - Write raw processing artifacts to S3.

2. Candidate ingestion:
   - Read the completed artifacts from S3.
   - Validate artifact structure, parameter references, values, and evidence.
   - Persist valid extracted candidates and provenance in PostgreSQL.
   - Record rejected results and processing failures explicitly.

These are logical stages, not a requirement to run exactly one worker
process or one task for the entire upload.

Define task granularity, queue routing, concurrency, and resource limits
from measured workload characteristics.

Do not perform long-running OCR or extraction inside API request handlers.

## Candidate Selection and Authoring

- A parameter may have zero, one, or multiple extracted candidate values.
- Preserve distinct candidates and their supporting evidence.
- The UI must allow users to inspect candidates and choose a value.
- Do not silently select or approve a candidate, even when only one exists.
- Keep extracted candidates separate from the user's selected or authored
  value and its approval state.
- Retain the candidate and extraction-run references behind a selection.
- Do not replace existing selections when new extraction results arrive.
- Define how equivalent candidates are grouped without losing evidence.
- Do not assume a parameter with multiple candidates is itself a
  multi-valued parameter; cardinality comes from the recipe schema.
- Clarify rejection, manual entry, and multi-selection behavior before
  implementing those interactions.

## Processing Reliability and Data Ownership

- PostgreSQL is the authoritative store for application workflow state,
  candidates, selections, and audit records.
- S3 is the authoritative store for retained documents and processing
  artifacts.
- Redis is a transport component, not the sole record of job progress
  or completed business work.
- Pass identifiers and artifact references through the queue rather than
  large documents or extraction payloads.
- Use a safe, explicitly configured task serializer; do not enable
  untrusted executable serialization formats.
- Version artifact schemas and associate artifacts with their documents,
  recipe version, extraction run, and producing stage.
- Publish artifact completion explicitly so ingestion does not mistake
  a partially completed set of artifacts for a finished run.
- Make artifact publication and candidate ingestion safe to retry.
- Use database constraints and transactions to prevent duplicate
  candidates or partially committed ingestion.
- Do not assume a database commit, S3 write, and task publication form
  one atomic operation. Design recovery for failures between them.
- Provide a recovery mechanism for committed work that was not queued,
  lost task delivery, and abandoned or stalled jobs.
- Configure task acknowledgements, visibility timeouts, execution limits,
  retries, and shutdown behavior together.
- Bound retries, distinguish retryable failures from permanent ones,
  and expose exhausted failures for operational recovery.
- Avoid repeating successful paid OCR or LLM calls unnecessarily during
  downstream retries.

## Multi-Developer Working Practices

- Use trunk-based development: `main` is the integration branch; use small,
  short-lived topic branches and pull requests, not long-lived develop branches.
- Do not push directly to `main`. Require at least one independent approval
  and required CI checks before merging; squash merge and delete merged branches.
- Treat this as a shared production codebase, not a personal prototype.
- Maintain documented local setup and reproducible dependency versions.
- Use pull requests and required automated checks before merging.
- Require review for application, schema, security, and delivery changes.
- Keep API contracts, artifact schemas, and database migrations versioned.
- Support overlapping application and worker versions during deployments,
  or explicitly coordinate changes that cannot be backward compatible.
- Use reviewed migrations; do not modify deployed database schemas
  through application startup side effects.
- Use synthetic or approved sanitized fixtures that developers can share.
- Keep environment-specific configuration outside source code.
- Document ownership and update operational instructions when behavior
  changes.
- Tests and observability must cover the worker pipeline as well as
  API endpoints.

## Container and Delivery Practices

- Use Docker Compose for the agreed local multi-service workflow.
- Keep API, worker, database, and broker processes independently runnable.
- Share application code or images where appropriate without coupling
  process lifecycles.
- Run production application containers as non-root where supported.
- Keep credentials out of images and use AWS task roles in deployment.
- Build an immutable application image and promote the same artifact
  between environments.
- Use short-lived AWS credentials for GitHub Actions through OIDC rather
  than stored long-lived AWS access keys.
- Keep infrastructure provisioning in the Terraform repository.
- Define which repository owns application service deployment and
  prevent GitHub Actions and Terraform from competing over the same
  resource configuration.
- Verify graceful worker shutdown, interrupted-task recovery, and
  database connection limits before production deployment.
