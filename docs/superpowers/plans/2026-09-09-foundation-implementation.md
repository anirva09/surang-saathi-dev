# Surang Saathi Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a reviewable private development repository and a curated public-repository bootstrap for Surang Saathi, with the source brief normalized, architectural decisions locked, Claude instructions defined, and reproducible local infrastructure ready for the first Phase-1 vertical slice.

**Architecture:** The SIH implementation starts as a modular monolith with clear domain boundaries while preserving the service contracts from `PROJECT_BRIEF.md`. The private `surang-saathi-dev` repo is the engineering source; the public `surang-saathi` repo receives only reviewed, secret-safe, presentation-ready artifacts.

**Tech Stack:** Flutter/Dart, Next.js/React/TypeScript, FastAPI/Python, PostgreSQL/PostGIS, SQLite/Drift, S3-compatible object storage/MinIO, REST, OAuth2/OIDC-compatible auth, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-09-09-foundation-design.md`

## Global Constraints

- Product name is **सुरंग साथी / Surang Saathi**; `Khanij Rakshak` is legacy naming and must not remain in active project documentation.
- `PROJECT_BRIEF.md` remains the authoritative functional and technical specification.
- Field workflows are offline-first and must support multi-day zero-connectivity operation.
- Submitted compliance events are append-only; no silent last-write-wins conflict handling.
- Mine Risk Index starts rule-based and every surfaced risk score includes explainable contributing factors.
- MVP tamper evidence uses a SHA-256 hash chain in PostgreSQL; do not introduce blockchain or Hyperledger.
- Full 3D digital twin and unsupported production-ML accuracy claims are out of MVP scope.
- SIH backend begins as a modular monolith with explicit domain boundaries.
- Private repository is the development source; public repository receives reviewed milestones only.
- Never fabricate or rewrite Git authorship.

---

### Task 1: Normalize the authoritative project brief

**Files:**
- Create: `PROJECT_BRIEF.md`
- Source: `/mnt/data/Pasted markdown.md`

**Interfaces:**
- Consumes: the uploaded planning brief supplied by the product owner.
- Produces: a clean root-level `PROJECT_BRIEF.md` used by all later implementation tasks.

- [ ] **Step 1: Strip upload wrapper text while preserving the brief body**

Create `PROJECT_BRIEF.md` from lines 2 through 383 of the uploaded source so the outer four-backtick wrapper and attachment metadata are excluded.

- [ ] **Step 2: Normalize the approved product name**

Replace exactly these legacy references:

```text
# Project Brief: Khanij Rakshak
→
# Project Brief: Surang Saathi

codename **Khanij Rakshak**
→
platform **Surang Saathi**
```

Do not change functional requirements, architecture, module definitions, roadmap, or acceptance criteria.

- [ ] **Step 3: Verify naming and document integrity**

Run:

```bash
grep -n "Khanij Rakshak" PROJECT_BRIEF.md && exit 1 || true
grep -n "# Project Brief: Surang Saathi" PROJECT_BRIEF.md
grep -n "## 15. How an Agent Should Use This Document" PROJECT_BRIEF.md
```

Expected: no legacy-name match; title and final section both present.

- [ ] **Step 4: Stage the normalized brief**

```bash
git add PROJECT_BRIEF.md
```

Do not commit unless a real Git author name and email are already configured.

---

### Task 2: Create the decision, architecture, QA, demo, and Claude operating documents

**Files:**
- Create: `docs/DECISIONS.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/QA_CHECKLIST.md`
- Create: `docs/DEMO.md`
- Create: `CLAUDE.md`

**Interfaces:**
- Consumes: `PROJECT_BRIEF.md` and the approved foundation design.
- Produces: stable engineering rules for Claude, implementation reviews, QA gates, and SIH demo preparation.

- [ ] **Step 1: Write `docs/DECISIONS.md`**

Record ADR-001 through ADR-011 as `Accepted` decisions with context, decision, rationale, consequences, and change-control rule. Include modular-monolith scope, offline-first, append-only events, rule-first MRI, explainability, hash-chain ledger, no 3D, AI-as-support, and private/public repo governance.

- [ ] **Step 2: Write `docs/ARCHITECTURE.md`**

Document:

```text
Clients
  Flutter mobile
  Next.js manager web
        |
        v
FastAPI modular monolith
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
        |
        +--> PostgreSQL + PostGIS
        +--> MinIO/S3
```

Define module responsibilities, the immutable event/sync contract, media hashing boundary, risk-engine explainability contract, audit-chain boundary, and extraction path to production microservices without claiming they already exist.

- [ ] **Step 3: Write `docs/QA_CHECKLIST.md`**

Define P0 demo-blocking checks for offline capture, duplicate-safe sync, conflict visibility, geofence revalidation, append-only history, corrective-action lifecycle, ledger verification, role access, secret leakage, and demo reset. Define P1 checks for accessibility, multilingual copy integrity, loading/empty/error states, and responsive manager views.

- [ ] **Step 4: Write `docs/DEMO.md`**

Create executable 2-minute and 5-minute demo scripts centered on the canonical hazard workflow. Add judge Q&A answers for offline operation, AI honesty, tamper evidence, scalability, government adoption realism, and why blockchain/full 3D were rejected.

- [ ] **Step 5: Write `CLAUDE.md`**

Lock Claude to `PROJECT_BRIEF.md`, ADRs, bounded implementation packets, no independent scope expansion, no approved-UI redesign, test-first changes where behavior exists, and a mandatory implementation report containing files changed, tests run, commands, limitations, and cross-module impact.

- [ ] **Step 6: Verify no architecture drift was introduced**

Run:

```bash
! grep -ni "Khanij Rakshak" CLAUDE.md docs/DECISIONS.md docs/ARCHITECTURE.md docs/QA_CHECKLIST.md docs/DEMO.md
grep -n "modular monolith" docs/ARCHITECTURE.md
grep -n "Offline-first" docs/DECISIONS.md
grep -n "2-minute" docs/DEMO.md
```

Expected: no legacy naming; required foundation concepts present.

- [ ] **Step 7: Stage the governance documents**

```bash
git add docs/DECISIONS.md docs/ARCHITECTURE.md docs/QA_CHECKLIST.md docs/DEMO.md CLAUDE.md
```

---

### Task 3: Create repository metadata and reproducible local infrastructure

**Files:**
- Create: `README.md`
- Create: `CONTRIBUTING.md`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `docker-compose.yml`

**Interfaces:**
- Consumes: accepted repository model and local stack decisions.
- Produces: contributor instructions and a minimal PostGIS/MinIO development environment; no fake application service is created.

- [ ] **Step 1: Write the private-repo README**

README must identify `surang-saathi-dev` as the private engineering source, summarize the problem and golden workflow, list the locked stack, link to the brief/ADRs/architecture/QA/demo docs, and state that the public repo is promotion-only.

- [ ] **Step 2: Write `CONTRIBUTING.md`**

Define branch prefixes:

```text
feat/<scope>
fix/<scope>
docs/<scope>
chore/<scope>
```

Define Conventional Commit examples, review gates, no direct public promotion before approval, no secrets, and no Git-author rewriting.

- [ ] **Step 3: Write `.gitignore`**

Ignore environment files except `.env.example`, Node/Next artifacts, Flutter/Dart artifacts, Python caches/virtualenvs, IDE/OS metadata, generated coverage, local media/object-store data, and `.worktrees/`.

- [ ] **Step 4: Write `.env.example`**

Define non-secret local variables:

```dotenv
APP_ENV=development
POSTGRES_DB=surang_saathi
POSTGRES_USER=surang_saathi
POSTGRES_PASSWORD=change-me-local-only
POSTGRES_PORT=5432
MINIO_ROOT_USER=surang_saathi
MINIO_ROOT_PASSWORD=change-me-local-only
MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001
MINIO_BUCKET=surang-saathi-media
```

- [ ] **Step 5: Write `docker-compose.yml`**

Create only two real foundation services:

```yaml
services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    ports:
      - "${MINIO_API_PORT:-9000}:9000"
      - "${MINIO_CONSOLE_PORT:-9001}:9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
```

`latest` is acceptable only for this local foundation bootstrap; pin the MinIO image before the first public runnable release.

- [ ] **Step 6: Validate configuration**

Run:

```bash
python - <<'PY'
from pathlib import Path
import yaml
for path in [Path('docker-compose.yml')]:
    yaml.safe_load(path.read_text())
print('yaml-ok')
PY

git diff --check
```

Expected: `yaml-ok`; no whitespace errors.

- [ ] **Step 7: Stage repository metadata**

```bash
git add README.md CONTRIBUTING.md .gitignore .env.example docker-compose.yml
```

---

### Task 4: Bootstrap the curated public repository locally

**Files:**
- Create sibling repository: `/mnt/data/surang-saathi`
- Create: `/mnt/data/surang-saathi/README.md`
- Create: `/mnt/data/surang-saathi/PROJECT_BRIEF.md`
- Create: `/mnt/data/surang-saathi/CONTRIBUTING.md`
- Create: `/mnt/data/surang-saathi/docs/ARCHITECTURE.md`
- Create: `/mnt/data/surang-saathi/docs/DEMO.md`
- Create: `/mnt/data/surang-saathi/.gitignore`
- Create: `/mnt/data/surang-saathi/.env.example`
- Create: `/mnt/data/surang-saathi/docker-compose.yml`

**Interfaces:**
- Consumes: only foundation artifacts that are safe and useful to external reviewers.
- Produces: a local public-repo bootstrap ready for remote creation when GitHub write access is available.

- [ ] **Step 1: Initialize the sibling repository**

```bash
mkdir -p /mnt/data/surang-saathi/docs
cd /mnt/data/surang-saathi
git init -b main
```

- [ ] **Step 2: Copy only public-safe foundation artifacts**

Copy the normalized brief, contributor guide, architecture, demo guide, environment example, compose file, and gitignore. Do not copy `CLAUDE.md`, internal superpowers specs/plans, or internal QA working notes.

- [ ] **Step 3: Write a public-facing README**

The README must explain the SIH problem, Surang Saathi's field-to-governance workflow, why offline-first/explainability/tamper evidence matter, current milestone status, architecture summary, and an explicit statement that demo/synthetic data is not represented as live Coal India production data.

- [ ] **Step 4: Validate the public repo**

Run:

```bash
cd /mnt/data/surang-saathi
grep -Rni "Khanij Rakshak" . --exclude-dir=.git && exit 1 || true
git diff --check
```

Expected: no legacy naming and no whitespace errors.

- [ ] **Step 5: Stage public bootstrap files**

```bash
git add .
```

Do not commit unless a real Git author name and email are configured.

---

### Task 5: Foundation verification and handoff

**Files:**
- Verify all files created by Tasks 1–4.

**Interfaces:**
- Consumes: completed private/public bootstrap.
- Produces: a verified Milestone-0 foundation and the first Claude implementation target.

- [ ] **Step 1: Verify required private files**

Run:

```bash
cd /mnt/data/surang-saathi-dev
for f in \
  PROJECT_BRIEF.md README.md CONTRIBUTING.md CLAUDE.md \
  docs/DECISIONS.md docs/ARCHITECTURE.md docs/QA_CHECKLIST.md docs/DEMO.md \
  .gitignore .env.example docker-compose.yml \
  docs/superpowers/specs/2026-09-09-foundation-design.md \
  docs/superpowers/plans/2026-09-09-foundation-implementation.md; do
  test -s "$f" || { echo "missing-or-empty: $f"; exit 1; }
done
```

Expected: exit 0 with no missing files.

- [ ] **Step 2: Verify product constraints mechanically**

Run:

```bash
! grep -ni "Khanij Rakshak" \
  PROJECT_BRIEF.md README.md CONTRIBUTING.md CLAUDE.md docs/DECISIONS.md docs/ARCHITECTURE.md docs/QA_CHECKLIST.md docs/DEMO.md

grep -qi "offline-first" docs/DECISIONS.md
grep -qi "append-only" docs/DECISIONS.md
grep -qi "explain" docs/DECISIONS.md
grep -qi "hash" docs/DECISIONS.md
grep -qi "modular monolith" docs/ARCHITECTURE.md
```

Expected: all commands exit 0.

- [ ] **Step 3: Verify no secret values are committed by design**

Run:

```bash
! grep -RniE "(AKIA[0-9A-Z]{16}|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|ghp_[A-Za-z0-9]+)" \
  . --exclude-dir=.git
```

Expected: no matches.

- [ ] **Step 4: Report Git identity status**

Run:

```bash
git config user.name || true
git config user.email || true
git status --short --branch
```

If identity is absent, keep changes staged and report that commits/remotes were intentionally not fabricated.

- [ ] **Step 5: Define the next implementation ticket**

The next build ticket is **Phase 0A — Backend Contract Skeleton**: FastAPI app shell, health endpoint, configuration, PostgreSQL connection boundary, module package skeleton, and contract-first models for the Golden Workflow. It must receive its own bounded/architectural design review before code is added.
