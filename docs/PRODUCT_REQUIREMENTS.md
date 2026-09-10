# Surang Saathi â€” Product Requirements Document

**Document:** Product Requirements Document (PRD)
**Product:** Surang Saathi
**Programme:** Smart India Hackathon 2026
**Problem Statement:** SIH26024 â€” AI-Based Smart Governance & Compliance Monitoring System for Coal Mines
**Status:** MVP implementation + final SIH polish + pilot roadmap
**Primary product principle:** Mine worker usability â†’ Government authenticity â†’ SIH feasibility â†’ Consistency â†’ Visual polish

> **Prototype notice:** Surang Saathi is a Smart India Hackathon 2026 student prototype. It is not an official Government of India, Ministry of Coal, Coal India, or DGMS service and must not imply government endorsement.

---

# 1. Product Vision

Surang Saathi is a government-grade mine-safety and compliance platform that converts field hazards into verified evidence, accountable corrective action, explainable risk, and auditable governance.

The product should make the following operational chain visible and trustworthy:

```text
FIELD HAZARD
    â†“
VERIFIED EVIDENCE
    â†“
MANAGER ACTION
    â†“
CORRECTIVE ACTION
    â†“
RESOLUTION
    â†“
EXPLAINABLE RISK
    â†“
AUDITABLE GOVERNANCE
```

A judge, mine manager, safety officer, or government reviewer should be able to understand the safety workflow without needing a long verbal explanation.

---

# 2. Product Goals

## 2.1 Primary goals

Surang Saathi must help users answer:

1. What is unsafe?
2. What is overdue?
3. Who owns the issue?
4. What requires action now?
5. Can the evidence be trusted?
6. Why is the mine considered high-risk?
7. Can the record history be independently verified?

## 2.2 Product positioning

Surang Saathi is not a generic SaaS dashboard.

It should feel like:

- a serious public-sector operational system
- a mine-safety governance platform
- a field-to-management accountability system
- an explainable compliance system
- a pilotable government technology product

It should not feel like:

- a fintech dashboard
- a startup landing-page template
- a decorative AI demo
- a futuristic "black box" monitoring system
- a portfolio project

---

# 3. Current MVP Scope

The current MVP focuses on the Golden Workflow rather than broad enterprise scope.

## 3.1 Public web

Route:

```text
/
```

Responsibilities:

- explain Surang Saathi clearly
- establish government/public-sector visual credibility
- explain field-to-governance workflow
- provide product feature overview
- allow entry into the operational portal
- remain honest about SIH prototype status

The primary CTA is:

```text
Login to Portal
```

For the current prototype, this routes directly to:

```text
/dashboard
```

No fake authentication or government SSO should be shown.

## 3.2 Manager portal

Required routes:

```text
/dashboard
/hazards
/hazards/[id]
/risk
/audit
```

The operational portal must share the same design language as the public homepage while remaining denser and more task-oriented.

## 3.3 Backend-supported Golden Workflow

The backend supports:

- dashboard summary
- hazard listing
- hazard detail
- hazard creation
- hazard acknowledgement
- manager review / escalation
- corrective-action creation
- corrective-action update / acknowledgement
- corrective-action resolution
- multipart evidence upload
- server-side SHA-256 verification
- optional client hash comparison
- MinIO evidence storage
- PostGIS geofence validation
- local/server geofence conflict detection
- sync-state tracking
- hash-chained PostgreSQL audit events
- audit-ledger verification
- explainable Mine Risk Index
- risk snapshot persistence
- risk recalculation
- health/readiness endpoints
- stable API error envelopes
- Docker-based local runtime
- frozen OpenAPI integration contract

The backend is authoritative for API field names and public behavior.

---

# 4. Current MVP Architecture

## 4.1 Web

- Next.js
- React
- TypeScript
- Tailwind CSS
- server-side API access
- English-default localization
- Hindi only after explicit language selection
- Playwright + Vitest testing

## 4.2 API

- FastAPI
- Python 3.12
- Pydantic
- SQLAlchemy
- Alembic
- REST
- OpenAPI

## 4.3 Data and evidence

- PostgreSQL
- PostGIS
- MinIO
- SHA-256 evidence integrity
- deterministic SIH demo seed

## 4.4 Audit and risk

- PostgreSQL hash-chained audit ledger
- no blockchain
- explainable rule-based Mine Risk Index
- no black-box AI on compliance screens

---

# 5. Current Demo Context

Default demonstration environment:

| Field | Value |
|---|---|
| Organisation | Coal India Limited â€” SIH Prototype |
| Area | Jharia Area |
| Mine | Demo Mine 03 |
| Mine ID | `MINE-03` |
| Manager | M. Sharma |
| Prototype actor | `USR-MSHARMA` |

Canonical demo hazard:

| Field | Value |
|---|---|
| Hazard ID | `HZRD-2026-442` |
| Title | Roof support damage observed |
| Location | Seam 2 Main Gallery |
| Severity | HIGH |
| Lifecycle | ESCALATED |
| Reported by | Rajesh Kumar |
| Assigned manager | M. Sharma |
| Evidence count | 1 |
| Sync state | CONFLICT |
| Geofence state | CONFLICT |

The UI must prefer real backend responses over hard-coded demo values.

---

# 6. Current Gaps â€” Must Fix Before Final SIH Demo

These are not future enterprise features. They are final-MVP quality issues.

## 6.1 Golden Master visual mismatch

The current web implementation is not yet sufficiently close to the approved Golden Master.

Required work:

- match the approved homepage structure and proportions more closely
- unify the visual language across public and operational pages
- refine typography scale and hierarchy
- refine spacing rhythm
- reduce generic dashboard/SaaS appearance
- improve header, masthead, nav, footer, and section proportions
- improve card density and border treatment
- improve operational information hierarchy
- improve desktop 1440px fidelity
- improve 390px / 360px responsiveness
- remove visual remnants from older layouts
- preserve the warm government/mining character

## 6.2 First-run Docker reliability

Observed issue:

A fresh PostgreSQL/PostGIS volume briefly restarts during initialization. The API can attempt Alembic migration during this interval and exit.

Required final behavior:

- one setup command must recover from this race
- reviewer should not need to discover the problem manually
- setup documentation must explain the behavior
- no destructive reset should be required

## 6.3 Demo seed onboarding

Observed issue:

A clean database contains schema but no demo mine until deterministic seed is run.

Required final behavior:

- setup flow must load demo seed explicitly
- README must document the seed step
- "Mine not found" should never surprise a first-time reviewer following the documented setup

## 6.4 Evidence upload final verification

Evidence upload must be validated on the actual local stack with MinIO running:

```text
file selected
â†’ upload
â†’ stored in MinIO
â†’ server SHA-256 calculated
â†’ optional client SHA compared
â†’ GPS checked
â†’ PostGIS geofence evaluated
â†’ conflict state returned
â†’ UI displays result
```

## 6.5 Obsolete frontend cleanup

Remove unused files left from previous homepage/dashboard iterations only after verifying they have no imports.

Do not delete anything blindly.

## 6.6 Final end-to-end verification

Before final SIH submission, validate:

```text
Homepage
â†’ Portal
â†’ Dashboard
â†’ Hazard Register
â†’ Hazard Detail
â†’ Manager Action
â†’ Corrective Action
â†’ Evidence
â†’ Risk
â†’ Audit
â†’ Ledger Verification
```

---

# 7. UI Golden Master Acceptance Criteria

The approved Golden Master is the visual authority for final SIH polish.

## 7.1 Visual character

Required:

- warm institutional paper/ivory surfaces
- restrained rust/terracotta primary
- ochre/saffron accent
- dark charcoal/slate typography
- muted institutional green for success
- thin borders
- low corner radii
- restrained shadows
- strong mining imagery
- public-sector information architecture
- serious government-portal character
- high information clarity

Avoid:

- glassmorphism
- neon
- blue fintech visual language
- generic SaaS cards
- giant rounded containers
- soft modern startup gradients
- futuristic AI motifs
- excessive motion
- decorative grunge
- Vercel-style minimalism

## 7.2 Locked approximate palette

```text
Background       #F7F3EA
Utility surface  #F5EFE3
Surface          #FAF6EF
Primary rust     #8F3E21
Primary hover    #7A3419
Accent ochre     #C58729
Heading text     #1C2530
Muted text       #5B6570
Stat/navy-slate  #1C2F49
Success          #515C40
Danger           #C6472D
Border           #D8CCBA
Soft border      #E7DECF
```

## 7.3 Typography

Preferred:

- Noto Sans
- Noto Sans Devanagari

Requirements:

- English must be the default UI language
- no decorative Hindi
- no simultaneous English/Hindi labels
- Hindi appears only after the user explicitly selects `à¤¹à¤¿à¤¨à¥à¤¦à¥€`
- language preference persists
- technical identifiers stay unchanged
- heading hierarchy must remain clear at all responsive sizes

## 7.4 Desktop Golden Master target

Primary review viewport:

```text
1440px desktop
```

Check:

- utility-bar height
- brand lockup
- navigation spacing
- hero split
- hero line wrapping
- CTA sizing
- section spacing
- stats-strip proportions
- feature-card alignment
- credibility band
- footer hierarchy
- operational portal density

## 7.5 Mobile acceptance

Review at:

```text
390px
360px
```

Requirements:

- no horizontal overflow
- touch targets at least 40px where feasible
- operational tables transform into readable stacked rows/cards
- statuses remain visible without horizontal scrolling
- language selector remains usable
- mobile nav is keyboard accessible
- content priority is preserved

## 7.6 Operational UI requirements

The manager portal must emphasize:

- severity
- lifecycle
- ownership
- overdue state
- evidence integrity
- location conflict
- corrective action
- risk contribution
- auditability

Avoid decorative charts that do not improve decisions.

---

# 8. Localization Requirements

## 8.1 Default language

Default:

```text
English
```

All user-facing interface copy must initially render in English.

## 8.2 Hindi behavior

Hindi appears only after explicit user action:

```text
English â†’ à¤¹à¤¿à¤¨à¥à¤¦à¥€
```

When Hindi is active, translate:

- navigation
- headings
- buttons
- static explanatory text
- loading messages
- empty states
- errors
- accessibility labels where practical

Do not translate:

- IDs
- hashes
- coordinates
- database identifiers
- hazard IDs
- audit IDs
- action IDs

No external translation API is required for the MVP.

Use curated local translation resources.

---

# 9. Future Capability â€” Photo Attendance

**Roadmap stage:** Pilot / Future MVP Extension

## 9.1 Objective

Allow mine attendance to be recorded with image evidence rather than relying only on paper registers or manual checklists.

## 9.2 Proposed workflow

```text
Select worker / shift
â†’ capture attendance photo
â†’ timestamp
â†’ mine/location context
â†’ submit
â†’ attendance record stored
â†’ manager verification where required
â†’ audit event appended
```

## 9.3 Minimum record

Attendance record should include:

- worker identifier
- worker name
- mine
- area
- shift
- attendance state
- capture timestamp
- image evidence reference
- capture location when available
- recorded-by user
- verification state
- audit provenance

## 9.4 Privacy principle

The first version should use:

- worker/shift selection
- image evidence
- timestamp
- location

It should **not require facial recognition**.

Biometric identification must not be added casually. If ever considered, it requires separate privacy, legal, accuracy, fairness, retention, consent, and deployment review.

---

# 10. Future Capability â€” PPE / Safety Gear Check

**Roadmap stage:** Pilot / AI-assisted field workflow

## 10.1 Objective

Use the attendance or field-capture photograph to assist supervisors in checking whether visible safety gear is present.

Initial PPE classes may include:

- safety helmet
- high-visibility vest
- other mine-configured visible PPE

## 10.2 AI behavior

The computer-vision system should return:

```text
Detected
Not detected
Uncertain
```

with:

- confidence
- detected object
- optional bounding region
- model/version
- review status

## 10.3 Decision policy

AI assists the supervisor.

AI must not automatically create a disciplinary or compliance violation solely from a low-confidence visual result.

Low-confidence or ambiguous cases require human review.

## 10.4 Audit requirement

Store:

- original image
- model result
- confidence
- model/version
- reviewer
- reviewer decision
- corrections
- timestamp

---

# 11. Future Capability â€” AI Hazard Image Analysis

**Roadmap stage:** Pilot / AI-assisted risk triage

## 11.1 Objective

Analyze hazard and evidence images to identify visible risk cues and help managers prioritize review.

Examples may include:

- damaged roof support
- visible obstruction
- missing safety equipment
- unsafe material placement
- standing water
- damaged infrastructure
- other clearly-defined mine-safety visual categories

## 11.2 Output

AI should produce:

- detected risk cues
- suggested severity
- suggested priority
- confidence
- reason/explanation
- model/version

## 11.3 Human control

AI output is advisory.

The manager retains the authoritative compliance decision.

The system must show:

```text
AI suggestion
Manager decision
Difference, if any
```

and keep the decision trail.

## 11.4 Relationship with Mine Risk Index

Image analysis must **not replace** the explainable rule-based Mine Risk Index.

Preferred architecture:

```text
AI image analysis
      â†“
risk cue / suggested priority
      â†“
human review
      â†“
validated structured event
      â†“
explainable governance workflow
```

The compliance screen must never present an opaque model score as the only reason for enforcement.

---

# 12. Future Capability â€” Paper Record Digitization

**Roadmap stage:** Pilot / Legacy data migration

## 12.1 Objective

Convert historical paper mine records into searchable structured software records.

## 12.2 Workflow

```text
scan / photograph record
â†’ OCR
â†’ language detection
â†’ text extraction
â†’ field extraction
â†’ structured draft
â†’ human verification
â†’ approved software record
â†’ provenance retained
```

## 12.3 Language requirements

Initial priority:

- English
- Hindi

Future extension may include additional regional/native Indian languages based on mine deployment geography and data quality.

## 12.4 OCR confidence

Every extracted field should carry:

- extracted value
- confidence
- source page/image reference
- review state

Low-confidence fields must be highlighted for human correction.

## 12.5 Source preservation

Never discard the original paper scan.

Store:

- source image/PDF
- extracted text
- structured fields
- reviewer corrections
- approved record
- timestamps
- actor identity
- provenance links

The converted record must remain traceable to the original source.

---

# 13. AI Governance Requirements

All future AI features must follow these rules.

## 13.1 Explainability

Show:

- what the AI detected
- confidence
- why it recommended a priority
- model/version
- whether a person confirmed the result

## 13.2 Human-in-the-loop

AI may:

- assist
- classify
- recommend
- prioritize
- extract

AI must not silently become the final compliance authority.

## 13.3 Provenance

Retain:

```text
original input
â†’ AI output
â†’ human review
â†’ final accepted record
```

## 13.4 Auditing

Audit AI-assisted changes including:

- who reviewed
- what changed
- AI suggestion
- accepted/rejected result
- timestamp
- model/version

## 13.5 Failure behavior

Low confidence must produce:

```text
Needs human review
```

rather than pretending the system is certain.

---

# 14. Future Product Areas

These are legitimate future extensions but not current SIH MVP claims.

## 14.1 Worker mobile application

- Flutter
- Android priority
- offline-first
- SQLite/Drift local queue
- camera capture
- GPS
- queued sync
- deterministic conflict handling
- low-literacy icon-first UX

## 14.2 Authentication and authorization

Production requires:

- OIDC/OAuth2
- secure sessions/JWT where appropriate
- RBAC
- organisation/area/mine scoping
- least privilege
- user lifecycle management

## 14.3 Notifications and escalation

Potential channels:

- in-app
- email
- SMS
- push notifications

Escalation logic must be policy-driven.

## 14.4 Inspection domain

A future inspection module may include:

- inspection schedules
- inspection forms
- findings
- due dates
- signatures
- evidence
- non-compliance links
- corrective-action linkage

Do not fabricate inspection data until this domain exists.

## 14.5 Sensor / gas telemetry

Future telemetry support may ingest:

- gas readings
- environmental sensors
- equipment states

Telemetry must not be simulated as "live" in the MVP.

## 14.6 Reporting

Potential production reporting:

- compliance summaries
- overdue-action reports
- mine risk history
- evidence exports
- audit exports
- scheduled reports

---

# 15. Production Hardening Roadmap

## 15.1 Authentication / RBAC

Required for pilot:

```text
User
â†’ Role
â†’ Organisation
â†’ Area
â†’ Mine
â†’ Permitted actions
```

## 15.2 Evidence security

Production additions:

- signed URLs
- content-type validation
- file-size limits
- malware scanning
- retention policy
- encryption policy
- access logging

## 15.3 Operations

Production additions:

- staging environment
- production environment
- TLS
- secret management
- structured logging
- correlation/request IDs
- monitoring
- alerting
- backups
- restore testing
- disaster recovery
- deployment rollback

## 15.4 Security testing

Before production:

- SAST
- dependency scanning
- SBOM
- VAPT
- penetration testing
- secrets review
- API abuse testing
- authorization-boundary testing

## 15.5 Performance

Validate:

- concurrent managers
- large hazard registers
- evidence upload size
- API latency
- database indexes
- risk recalculation performance
- audit-ledger growth

---

# 16. Roadmap

## Stage A â€” Current MVP

Status: implemented / integration-complete with final local verification still required.

Scope:

- homepage
- dashboard
- hazards
- hazard detail
- corrective actions
- evidence integrity
- geofence validation
- MRI
- audit ledger
- language switching
- Docker runtime
- OpenAPI contract

## Stage B â€” SIH Final Polish

Highest priority now:

1. bring all web screens to Golden Master quality
2. improve visual consistency
3. clean obsolete frontend files
4. verify real evidence upload with MinIO
5. verify complete Golden Workflow
6. ensure first-run setup is reliable
7. improve repo onboarding
8. replace/refine temporary logo only after core UI is stable
9. capture final desktop/mobile screenshots
10. run final test/typecheck/lint/build/a11y gates

## Stage C â€” Pilot

Priority:

- authentication
- RBAC
- mine/area user scoping
- real Flutter worker app
- offline sync
- photo attendance
- PPE image check
- AI-assisted hazard image triage
- legacy OCR import
- production evidence security
- notifications
- monitoring
- backups
- staging deployment

## Stage D â€” Production / Enterprise

Potential:

- enterprise SSO
- multi-area / multi-mine governance
- inspection domain
- telemetry
- reporting
- HA
- DR
- formal security accreditation
- scale testing
- operational support / SLA
- production retention policies

---

# 17. Non-Goals for the Current SIH MVP

Do not spend final SIH time on:

- full production authentication
- biometric face recognition
- live sensor platform
- broad inspection suite
- admin console
- enterprise reporting suite
- Kubernetes
- Kafka
- Redis
- blockchain
- production ML pipelines
- unnecessary decorative charts
- logo redesign before UI/workflow stability

---

# 18. Final SIH Acceptance Checklist

## Product

- [ ] Homepage communicates the problem and value clearly.
- [ ] Login to Portal opens the operational dashboard.
- [ ] Dashboard uses real API data.
- [ ] Hazard list uses real API data.
- [ ] Hazard detail uses real API data.
- [ ] Manager workflow mutations work.
- [ ] Corrective actions work.
- [ ] Evidence upload reaches MinIO.
- [ ] SHA-256 result is visible.
- [ ] Geofence result is visible.
- [ ] Sync/geofence conflict is understandable.
- [ ] Mine Risk Index is explainable.
- [ ] Audit events display.
- [ ] Ledger verification works.
- [ ] No mock fallback appears when the API is unavailable.

## UI

- [ ] Homepage is visually close to the Golden Master.
- [ ] Dashboard uses the same design language.
- [ ] Hazard screens use the same design language.
- [ ] Risk page uses the same design language.
- [ ] Audit page uses the same design language.
- [ ] No generic SaaS styling remains.
- [ ] English is default.
- [ ] Hindi appears only after explicit selection.
- [ ] 1440px view is polished.
- [ ] 390px / 360px views have no horizontal overflow.
- [ ] Keyboard navigation is usable.
- [ ] Contrast remains accessible.

## Runtime

- [ ] Fresh clone setup is documented.
- [ ] Docker Desktop requirement is clear.
- [ ] PostgreSQL/PostGIS starts.
- [ ] MinIO starts.
- [ ] API starts.
- [ ] `/health` passes.
- [ ] `/ready` reports database and object storage OK.
- [ ] deterministic seed loads.
- [ ] frontend starts.
- [ ] no secrets are committed.

## Verification

- [ ] `npm run test`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run a11y`
- [ ] backend tests
- [ ] Golden Workflow manual/E2E verification
- [ ] final screenshots captured

---

# 19. Success Criteria

For the SIH MVP, success means a reviewer can:

1. clone and start the project without undocumented knowledge
2. understand the product from the homepage
3. enter the management portal
4. see real seeded mine data
5. identify an unsafe condition
6. understand its severity and ownership
7. inspect evidence integrity/location
8. perform a manager action
9. understand corrective action
10. understand why mine risk is high
11. verify the audit trail
12. distinguish working MVP features from future roadmap features

For a pilot, success additionally requires real field users, authentication, RBAC, offline mobile capture, operational security, privacy controls, and production observability.

---

# 20. Product Principle

Surang Saathi should make technology disappear behind the safety workflow.

The product is not valuable because it says "AI."

It is valuable because it makes mine-safety decisions:

- faster
- verifiable
- explainable
- accountable
- auditable
- usable in the field

**Safer mines. Stronger accountability.**
