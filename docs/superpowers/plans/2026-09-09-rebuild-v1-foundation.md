# Rebuild v1 Foundation Implementation Plan

> **For agentic workers:** Execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the retired implementation workflow with a clean ChatGPT + Google AI Studio + GitHub rebuild foundation in the private `surang-saathi-dev` repository.

**Architecture:** Preserve the authoritative project brief and existing verified private history, implement governance on `rebuild/v1`, and keep coding tasks bounded through versioned AI Studio packets. GitHub remains canonical; the public repository is untouched.

**Tech Stack:** Markdown governance documents, Git/GitHub, Python 3 governance verification, GitHub Actions, existing Docker Compose PostGIS/MinIO foundation.

**Spec:** `docs/superpowers/specs/2026-09-09-rebuild-v1-design.md`

## Global Constraints

- Product name: **सुरंग साथी / Surang Saathi** only.
- Private engineering source: `surang-saathi-dev`.
- Public repository: `surang-saathi`, curated and unchanged during this plan.
- Active rebuild integration branch: `rebuild/v1`.
- `PROJECT_BRIEF.md` remains authoritative and is not scope-rewritten.
- No obsolete implementation-agent protocol remains in the active tree.
- No application feature code is introduced by this foundation plan.
- Existing Git authorship/history is preserved.

---

### Task 1: Replace active engineering workflow documentation

**Files:**
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: `docs/DECISIONS.md`
- Create: `docs/GITHUB_STRATEGY.md`
- Create: `docs/WORKFLOW.md`
- Delete: `CLAUDE.md`
- Delete: `docs/claude-packets/0001-phase-0a-backend-contract-skeleton.md`

**Interfaces:**
- Consumes: approved rebuild design and existing ADRs.
- Produces: one unambiguous human/AI/GitHub operating model.

- [ ] Rewrite root navigation and source-of-truth references.
- [ ] Add rebuild/GitHub ADRs without changing earlier accepted architectural ADRs.
- [ ] Document private branch and public promotion rules.
- [ ] Remove retired active protocol files; rely on Git history for provenance.
- [ ] Run `python scripts/verify-governance.py` and require no retired-protocol references.

### Task 2: Lock UI, roadmap, and build-state governance

**Files:**
- Create: `docs/UI_PRINCIPLES.md`
- Create: `docs/REBUILD_ROADMAP.md`
- Create: `docs/BUILD_STATE.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/QA_CHECKLIST.md`
- Modify: `docs/DEMO.md`

**Interfaces:**
- Consumes: `PROJECT_BRIEF.md` design principles, user roles, phase roadmap, and canonical action cycle.
- Produces: reviewable UI rules, execution sequencing, current-state truth, and release gates.

- [ ] Encode the eight locked colors and prohibited aesthetics exactly.
- [ ] Define field control sizes, bilingual behavior, status semantics, offline/geofence distinctions, and AI accountability rules.
- [ ] Map rebuild workstreams onto authoritative phases 0–5 without replacing them.
- [ ] Record current build state as foundation-only with no false feature claims.
- [ ] Ensure QA and demo docs reference the Golden Workflow rather than screen count.

### Task 3: Add Google AI Studio implementation contract

**Files:**
- Create: `AI_STUDIO.md`
- Create: `docs/ai-studio/README.md`
- Create: `docs/ai-studio/MASTER_PROMPT.md`
- Create: `docs/ai-studio/PACKET_TEMPLATE.md`
- Create: `docs/ai-studio/packets/0001-design-system-foundation.md`

**Interfaces:**
- Consumes: authority order, architecture, UI principles, GitHub strategy.
- Produces: bounded implementation instructions that can be pasted into/imported with Google AI Studio.

- [ ] Define what AI Studio may decide and what requires product/architecture review.
- [ ] Require branch isolation, bounded files, tests, verification, and a structured completion report.
- [ ] Create a reusable packet template with objective, allowed files, contracts, acceptance criteria, out-of-scope, tests, and stop condition.
- [ ] Create packet 0001 for the design system foundation only.

### Task 4: Preserve approved visual references without inheriting old code

**Files:**
- Create: `docs/reference/ui/README.md`
- Create: `docs/reference/ui/controls.png`
- Create: `docs/reference/ui/field-records.png`
- Create: `docs/reference/ui/foundations.png`

**Interfaces:**
- Consumes: user-provided screenshots approved as visual-direction references.
- Produces: private visual references explicitly subordinate to tokens and UI principles.

- [ ] Copy only the three unique screenshots.
- [ ] Label them reference-only and prohibit pixel-copying old implementation structure.

### Task 5: Add mechanical governance checks for GitHub

**Files:**
- Create: `scripts/verify-governance.py`
- Create: `.github/workflows/governance.yml`
- Create: `.github/pull_request_template.md`
- Create: `.github/CODEOWNERS`

**Interfaces:**
- Consumes: required files and locked governance markers.
- Produces: a CI-failing verification command: `python scripts/verify-governance.py`.

- [ ] Verify required governance files exist.
- [ ] Reject active legacy product naming and retired implementation-agent references.
- [ ] Verify the locked palette and architectural phrases are present.
- [ ] Reject common secret/token signatures from tracked text files.
- [ ] Add a PR checklist matching private review gates.
- [ ] Configure GitHub Actions to run governance verification and `git diff --check`.

### Task 6: Verify and commit the rebuild foundation

**Files:** all files from Tasks 1–5.

**Interfaces:**
- Produces: clean `rebuild/v1` foundation commit ready for GitHub push.

- [ ] Run `python scripts/verify-governance.py` and require exit 0.
- [ ] Run `git diff --check` and require exit 0.
- [ ] Run `git status --short` and inspect every changed path.
- [ ] Confirm `surang-saathi` public workspace was not modified.
- [ ] Commit to private `rebuild/v1` using the configured real author identity.
