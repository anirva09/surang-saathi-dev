# Frontend ↔ backend integration

How this app talks to the Surang Saathi API, and how to check that it still
does after either side changes.

## The rule

**The backend contract wins.** Every field name, path, enum member and error
code in `src/lib/api/` is transcribed from the backend's
`docs/api/openapi.json`. Nothing is inferred from an older frontend mock, and no
endpoint, request body or error shape is invented. When the two disagree, the
frontend adapts.

## Where the contract lives

| File | What it holds |
| --- | --- |
| `src/lib/api/openapi.snapshot.json` | A frontend-owned copy of the backend's frozen contract. |
| `src/lib/api/contract.ts` | TypeScript types and enums mirroring that contract. |
| `src/lib/api/endpoints.ts` | Every path this app calls, and the typed call for each. |
| `src/lib/api/client.ts` | Transport: base URL, timeouts, the error envelope. |
| `src/lib/api/errors.ts` | The backend's error codes and the `ApiError` they produce. |
| `src/lib/api/failure.ts` | The serialisable failure the UI renders. |

`tests/contract.test.ts` asserts the first two against each other. If the
backend renames a route, drops a field, or adds a fifth dashboard KPI, that
suite fails — which is the point. It runs in `npm test`, needs no backend, and
takes under a second.

### Re-syncing after a deliberate backend change

1. Copy the backend's `docs/api/openapi.json` over
   `src/lib/api/openapi.snapshot.json`.
2. Run `npm test`.
3. Fix whatever fails, in `contract.ts` and the screens that read the changed
   field. Do not edit the snapshot to make a test pass — the snapshot is
   evidence, not a fixture.

## The error envelope

The backend answers every failure with a stable envelope, confirmed against its
own hardening tests:

```json
{
  "error": { "code": "NOT_FOUND", "message": "Hazard not found", "status": 404 },
  "detail": "Hazard not found"
}
```

`error` is the field this client reads; `detail` is the legacy FastAPI field the
backend still emits for compatibility. A validation failure adds
`error.details` — FastAPI's per-field error list — which the forms render beside
the field each message names.

`code` is one of `BAD_REQUEST`, `NOT_FOUND`, `CONFLICT`, `PAYLOAD_TOO_LARGE`,
`UNSUPPORTED_MEDIA_TYPE`, `UNPROCESSABLE_ENTITY`, `SERVICE_UNAVAILABLE`,
`VALIDATION_ERROR`, or `HTTP_<status>` for anything else. This client adds
`NETWORK_ERROR` and `TIMEOUT` at status 0 for a request the API never answered.

## Where requests run

On the server — Server Components for reads, Server Actions for writes. That
choice has three consequences worth knowing:

- `API_BASE_URL` and `PROTOTYPE_ACTOR_ID` stay server-side; neither reaches the
  browser bundle.
- The backend's CORS allowlist does not need this app's origin, because the
  browser never calls the API.
- A user whose network cannot reach the API is not the reason a page fails —
  only the server's reachability matters.

Every read sets `cache: "no-store"` and every route is `dynamic = "force-dynamic"`.
Safety and compliance figures are never served from a cache.

## No fallback data, ever

When the API cannot be reached, each screen renders `ApiErrorState`: what
failed, the code the backend or client raised, and how to recover. It does not
substitute demonstration figures. `tests/workspace.pw.ts` and
`tests/dashboard.pw.ts` assert this directly — with the API down, none of the
seeded values may appear anywhere on the page.

## Authentication

There is none. The backend has no auth service, so this app mints no token,
renders no sign-in form, and implies no verified government session. Mutations
are recorded against `PROTOTYPE_ACTOR_ID`, the hazard screen says so in as many
words, and the audit ledger records that id honestly.

## Running the whole thing locally

```bash
# 1. Backend (from the backend worktree)
docker compose up            # Postgres, MinIO, API on :8000
python -m app.seed.run       # seeds MINE-03 and the Golden Workflow hazard

# 2. Frontend (from this directory)
cp .env.example .env.local
npm run dev                  # :3000
```

## The verification gate

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest: component + contract suites
npm run lint
npm run build
npm run a11y        # Playwright: accessibility, layout, i18n, integration
```

The Playwright suite probes `${API_BASE_URL}/health` once and then runs one of
two sets of real assertions:

- **API reachable** — the data assertions run against the seeded Golden
  Workflow, and `tests/golden-workflow.pw.ts` drives a corrective action from
  the browser through to a verified hash-chain entry in the ledger.
- **API unreachable** — the honest-failure assertions run instead, proving each
  screen reports the outage and substitutes nothing.

The accessibility, layout, and English-default localization gates run either
way, against whichever state the page is actually in. Nothing is skipped
silently: a skipped test always names why.
