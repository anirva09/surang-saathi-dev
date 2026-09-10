# Backend Teammate Setup — Windows

These steps assume Windows CMD.

## 0. Required software

Install:

- Git
- GitHub CLI (`gh`) or GitHub web access
- Docker Desktop
- Python 3.12

Node.js is not required for backend development, but may already be installed for the full project.

## 1. Accept collaborator invitation

The repository is private. Confirm you can open:

```text
https://github.com/anirva09/surang-saathi-dev
```

If access fails, stop and ask the repository owner for collaborator access.

## 2. Clone the repository

Run:

```cmd
cd /d "%USERPROFILE%\Downloads"
```

Then:

```cmd
git clone https://github.com/anirva09/surang-saathi-dev.git
```

Then:

```cmd
cd /d "%USERPROFILE%\Downloads\surang-saathi-dev"
```

## 3. Confirm remote and branch

Run:

```cmd
git remote -v
```

Then:

```cmd
git switch main
```

Then:

```cmd
git pull --ff-only origin main
```

Then:

```cmd
git status --short
```

The working tree should be clean before feature work.

## 4. Create your branch

Run:

```cmd
git switch -c feat/ai-assisted-safety
```

Verify:

```cmd
git branch --show-current
```

Expected:

```text
feat/ai-assisted-safety
```

## 5. Start Docker Desktop

Open Docker Desktop and wait until its Linux engine is ready.

Verify:

```cmd
docker info
```

Do not continue until Docker server information is displayed without a daemon/pipe error.

## 6. Create root local environment

If `.env` does not exist:

```cmd
copy .env.example .env
```

Never commit `.env`.

## 7. Start current backend stack

Run:

```cmd
docker compose up -d --build
```

Because a brand-new PostGIS volume can briefly restart PostgreSQL during initialisation, check:

```cmd
docker compose ps -a
```

If the API exited while PostgreSQL was initialising:

```cmd
docker compose start api
```

Then:

```cmd
docker compose ps
```

## 8. Verify existing runtime

Run:

```cmd
curl http://localhost:8000/health
```

Expected:

```json
{"status":"ok","service":"surang-saathi-api"}
```

Then:

```cmd
curl http://localhost:8000/ready
```

Expected:

```json
{"status":"ready","database":"ok","objectStorage":"ok"}
```

## 9. Load deterministic demo data

Run:

```cmd
docker compose exec -T api python -m app.seed.run
```

Then verify the demo mine:

```cmd
curl "http://localhost:8000/api/v1/dashboard/summary?mineId=MINE-03"
```

Do not begin enhancement work if this still returns `Mine not found`.

## 10. Create Python development environment for tests

Run:

```cmd
cd /d "%USERPROFILE%\Downloads\surang-saathi-dev\apps\api"
```

Then:

```cmd
py -3.12 -m venv .venv
```

Then:

```cmd
.venv\Scripts\python -m pip install --upgrade pip
```

Read `pyproject.toml`.

If it defines a `dev` optional dependency group, install:

```cmd
.venv\Scripts\python -m pip install -e ".[dev]"
```

If there is no `dev` optional dependency group, install the project and pytest explicitly:

```cmd
.venv\Scripts\python -m pip install -e . pytest
```

## 11. Run baseline backend tests BEFORE editing code

Run:

```cmd
.venv\Scripts\python -m pytest -q
```

The existing baseline must be green before feature work.

If baseline tests fail, stop and report the failures. Do not begin implementing new features on top of a broken baseline.

## 12. Return to repository root

Run:

```cmd
cd /d "%USERPROFILE%\Downloads\surang-saathi-dev"
```

Then:

```cmd
git status --short
```

Expected local-only files such as `.env` and `apps/api/.venv/` should be ignored. Do not proceed if unexpected tracked files are modified.

## 13. WHEN TO GIVE THE MASTER PROMPT

Only now should you open the coding AI/agent.

The agent must be launched with the repository root as its workspace:

```text
%USERPROFILE%\Downloads\surang-saathi-dev
```

Then paste the complete content of:

```text
docs/team/BACKEND_MASTER_PROMPT.md
```

If using a browser-only AI that cannot read the local repository, upload at minimum:

- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/api/openapi.json`
- `apps/api/pyproject.toml`
- a ZIP of `apps/api/`
- `docs/team/BACKEND_API_TARGET.md`
- `docs/team/BACKEND_ONE_DAY_SPRINT.md`
- `docs/team/BACKEND_VALIDATION.md`

A local coding agent is preferred because it can inspect and edit the real branch directly.

## 14. Before pushing

Run all validation in:

```text
docs/team/BACKEND_VALIDATION.md
```

Then commit only intended backend files.

## 15. Push feature branch

Run:

```cmd
git push -u origin feat/ai-assisted-safety
```

Do not push directly to `main`.

## 16. Open Pull Request

With GitHub CLI:

```cmd
gh pr create --base main --head feat/ai-assisted-safety --title "feat(api): add AI-assisted safety milestone"
```

Use the checklist in:

```text
docs/team/BACKEND_PR_HANDOFF.md
```

The repository owner reviews and merges the PR.
