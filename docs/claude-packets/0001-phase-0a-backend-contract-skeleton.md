# Claude Implementation Packet 0001 — Phase 0A Backend Contract Skeleton

**Status:** Ready for implementation after reviewer handoff
**Milestone:** Phase 0 — Foundations
**Repository:** `surang-saathi-dev`
**Required branch:** `feat/backend-foundation`

## Objective

Create the minimal FastAPI backend foundation for Surang Saathi without implementing business workflows yet. The result must provide a testable application shell, configuration boundary, database connection boundary, and empty domain packages matching the accepted modular-monolith architecture.

## Read first

1. `PROJECT_BRIEF.md`
2. `docs/DECISIONS.md`
3. `docs/ARCHITECTURE.md`
4. `CLAUDE.md`

If this packet conflicts with those documents, report the conflict before coding.

## Files in scope

Create:

```text
backend/
├── pyproject.toml
├── README.md
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── db.py
│   └── modules/
│       ├── __init__.py
│       ├── auth/__init__.py
│       ├── inspections/__init__.py
│       ├── hazards/__init__.py
│       ├── sync/__init__.py
│       ├── compliance/__init__.py
│       ├── corrective_actions/__init__.py
│       ├── audit/__init__.py
│       ├── notifications/__init__.py
│       ├── risk/__init__.py
│       └── documents/__init__.py
└── tests/
    ├── __init__.py
    ├── test_health.py
    └── test_module_imports.py
```

Modify only if required for the runnable backend:

```text
.env.example
docker-compose.yml
README.md
```

Do not create migrations or business tables in this ticket.

## Architecture constraints

- FastAPI/Python modular monolith.
- Domain package names must match `docs/ARCHITECTURE.md` exactly.
- Empty module packages are boundaries only; do not create fake endpoints or placeholder business logic.
- Configuration comes from environment variables, not constants containing credentials.
- Database setup must target PostgreSQL/PostGIS and remain isolated behind `app/db.py`.
- Health endpoint must not require the database to be available; infrastructure readiness is a separate concern from process liveness.
- Do not add Redis, TimescaleDB, Kafka, Celery, gRPC, Kubernetes, or microservice deployment in this ticket.
- Do not implement auth, hazard, inspection, sync, compliance, ledger, risk, OCR, notifications, or mobile/web behavior yet.

## Required public interface

### Health endpoint

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "surang-saathi-backend"
}
```

HTTP status: `200`.

### Configuration object

Expose one application settings boundary from `app/config.py`. It must support at least:

```text
APP_ENV
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_HOST
POSTGRES_PORT
```

The database URL may be a computed property; password values must never be logged by application startup code.

### Database boundary

`app/db.py` owns SQLAlchemy engine/session construction. No domain module may instantiate its own database engine.

## Dependency expectations

Keep dependencies minimal. A reasonable foundation includes:

```text
fastapi
uvicorn
pydantic-settings
sqlalchemy
asyncpg
pytest
httpx
```

Add a formatter/linter only if the repository uses it immediately in verification. Do not add libraries pre-emptively for future modules.

## Test-first acceptance

Write tests before the corresponding implementation behavior.

### Health test

Verify:

- FastAPI application imports successfully.
- `GET /health` returns 200.
- JSON response is exactly:

```json
{"status":"ok","service":"surang-saathi-backend"}
```

### Module-boundary import test

Verify all accepted module packages import successfully:

```text
auth
inspections
hazards
sync
compliance
corrective_actions
audit
notifications
risk
documents
```

This test confirms package boundaries only. Do not populate the modules to make the test more impressive.

## Local runtime expectation

The reviewer must be able to run:

```bash
cd backend
python -m pytest
uvicorn app.main:app --reload
```

and receive a successful `/health` response.

If you wire the backend into Docker Compose, the Compose change must be minimal and the existing PostGIS/MinIO services must remain intact.

## Acceptance criteria

- [ ] `backend` installs from `pyproject.toml` in a clean Python environment.
- [ ] `/health` returns the exact contract above.
- [ ] Health endpoint does not fail when PostgreSQL is unavailable.
- [ ] Settings are environment-driven.
- [ ] Database engine/session construction has one owner: `app/db.py`.
- [ ] All ten domain module packages exist and import.
- [ ] No business endpoint or fake implementation is introduced.
- [ ] Tests pass.
- [ ] `git diff --check` passes.
- [ ] No secrets are introduced.

## Out of scope

Explicitly do not implement:

- database migrations/entities
- OAuth/OIDC
- RBAC
- hazard API
- inspection API
- offline sync API
- event sourcing tables
- corrective-action state machine
- audit hash-chain behavior
- MRI calculation
- OCR
- notifications
- seed/demo data
- Flutter or Next.js code

Those receive separate reviewed packets.

## Required implementation report

Follow the exact report structure in `CLAUDE.md`:

1. Files created
2. Files modified
3. Architecture impact
4. Tests and exact commands
5. Verification commands
6. Known limitations
7. Cross-module impact

Stop after this packet. Do not begin the next module.
