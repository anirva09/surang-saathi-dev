# Project Brief: Khanij Rakshak
## AI-Based Smart Governance & Compliance Monitoring System for Coal Mines (SIH26024)

> **Purpose of this document:** This is a planning-grade brief intended for an implementation agent (human or AI) to break the project into build phases, design subsystems, and generate detailed subplans. It contains the problem context, full architecture, module-level detail, screen/page-level structure for mobile and web, the end-to-end action cycle, and a phased implementation roadmap with acceptance criteria. Treat every "Detail Level" subsection as the minimum spec required before writing code for that component.

---

## 1. Problem Context (Why This Exists)

Coal India Limited (CIL) and its subsidiaries (SECL, MCL, ECL, etc.) run large, geographically distributed mining operations. Governance activities — statutory compliance, safety inspections, environmental monitoring, worker attendance, contractor management, grievance handling, production reporting — are currently done through:

- Paper logbooks and manual shift-handover records
- Spreadsheets maintained independently per site
- Delayed, non-real-time reporting up the management chain
- No reliable proof that a field inspection actually happened where/when claimed
- Manual tracking of statutory deadlines (DGMS, CPCB, MoEFCC), which are easy to miss

**Consequence:** data inconsistency, delayed decision-making, compliance gaps, weak field-level accountability, duplicated records, and no real-time operational visibility.

## 2. Solution Summary

Build **one centralized, offline-capable, AI-driven platform** — codename **Khanij Rakshak** — that connects three tiers:

```
Mine / Colliery Level  →  Subsidiary / Area HQ Level  →  Corporate / Ministry Level
(field workers)            (regional managers)             (CIL, Ministry of Coal)
```

It replaces paper-based workflows with: geo-fenced mobile inspections, OCR digitization of legacy records, an AI risk-scoring engine, automated statutory workflows with escalation, a GIS dashboard, and a tamper-proof (hash-chained) audit ledger.

### 2.1 Non-Negotiable Design Principles
Any agent planning implementation must preserve these constraints:
1. **Offline-first, not offline-tolerant.** Underground mines have no connectivity. The mobile app must be fully usable with zero network and sync later without data loss or silent overwrite.
2. **Explainability over black-box ML.** Every risk score must show the contributing factors. Officials need justification, not just a number, since scores may affect accountability/penalties.
3. **Append-only, tamper-evident records.** Inspection logs and sign-offs are never mutated in place; corrections are new entries referencing the original.
4. **Rule-based MVP before ML.** Do not block launch on having historical training data. Ship a transparent weighted-scoring system first; layer ML in once real data accumulates.
5. **Low-literacy, low-connectivity, multilingual field UX.** Voice-first where possible (Hindi, Bengali, Odia, English); minimize required text entry; provide a WhatsApp-based fallback channel.

---

## 3. User Roles & Access Tiers

| Tier | Roles | Primary Surface | Core Actions |
|---|---|---|---|
| **Field / Mine Level** | Overman, Mining Sirdar, Safety Officer | Mobile App | Log inspections, report hazards, mark attendance, upload corrective-action proof, voice/photo capture |
| **Area / Subsidiary Level** | Colliery Manager, Area General Manager, Subsidiary Director | Web Portal | Review/approve corrective actions, monitor cross-mine compliance, manage escalations, view contractor records |
| **Corporate / Ministry Level** | CIL HQ Analyst, Ministry of Coal Official, DGMS Auditor | Corporate Dashboard | View aggregate KPIs, national safety trends, emission heatmaps, download audit dossiers, no edit rights on raw records |
| **Contractor** | Contractor Admin | Contractor Web Portal (lightweight) | Submit compliance documents, view own trust score, respond to flagged violations |
| **System** | Admin/DevOps | Admin Console | User/role management, rule configuration, system health |

RBAC model: every role maps to a permission set (read/write/approve/escalate) scoped by mine ID, subsidiary ID, or "national" scope. Use OAuth2/OIDC + JWT claims carrying `role`, `scope_type`, `scope_id`.

---

## 4. System Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│ CLIENT LAYER                                                       │
│  Mobile App (Flutter)     Web Portal (React/Next.js)                │
│  Corporate Dashboard (React/Next.js)   Contractor Portal (React)    │
└───────────────────────────────────────────────────────────────────┘
                              │  REST/gRPC via API Gateway
┌───────────────────────────────────────────────────────────────────┐
│ API GATEWAY  — Auth (OAuth2/OIDC), rate limiting, routing           │
└───────────────────────────────────────────────────────────────────┘
                              │
┌───────────────────────────────────────────────────────────────────┐
│ CORE BACKEND (microservices)                                        │
│  Inspection Service | Compliance Engine | User/Role Service         │
│  Notification Service | Document Service | Audit Ledger Service     │
│  Sync/Conflict Service | Contractor Service                         │
└───────────────────────────────────────────────────────────────────┘
                              │
┌───────────────────────────────────────────────────────────────────┐
│ AI/ML LAYER (Python microservices, called via REST/gRPC)            │
│  Risk Scoring Engine | OCR/Doc Understanding | Speech-to-Text        │
│  Anomaly Detection (sensors) | On-device Triage Model (TFLite)      │
└───────────────────────────────────────────────────────────────────┘
                              │
┌───────────────────────────────────────────────────────────────────┐
│ DATA LAYER                                                          │
│  PostgreSQL + PostGIS (transactional + spatial)                     │
│  TimescaleDB/InfluxDB (sensor time-series: PM2.5, PM10, gas)         │
│  Redis (cache, queues) | S3/MinIO (photos, audio, scanned docs)     │
│  Hash-chained append-only ledger tables                              │
└───────────────────────────────────────────────────────────────────┘
```

**Recommended stack:** Flutter (mobile) · React/Next.js + Tailwind (web) · Spring Boot or FastAPI (backend services) · Python/FastAPI (ML services) · PostgreSQL + PostGIS · Redis · TimescaleDB · S3/MinIO · OAuth2/OIDC · SHA-256 hash-chaining for the ledger.

---

## 5. Core Modules — Detailed Spec

Each module below is written to the level of detail an implementation agent needs to scope a build phase.

### 5.1 Inspection & Field Reporting Module
- **Data model:** `Inspection { id, mine_id, section_id, inspector_id, gps_lat, gps_lon, geofence_valid: bool, timestamp, type[safety|environmental|attendance], status, media[] }`
- **Geo-fencing logic:** each mine/section stored as a PostGIS polygon. On submit, client checks device GPS against a locally cached polygon (works offline); server re-validates on sync as source of truth.
- **Offline capture:** every action gets a client-generated UUID + local timestamp before any server contact. Stored in local SQLite/WatermelonDB queue.
- **Media handling:** photos/audio hashed (SHA-256) client-side at capture time; hash stored alongside the file so any post-capture tampering is detectable.
- **Hazard reporting:** structured form + free-text/voice note + severity tag (self-reported + AI-suggested via on-device triage model).
- **Attendance:** geo-fenced check-in/out, tied to shift schedule.

### 5.2 Sync & Conflict Resolution Service
- **Never last-write-wins for compliance data.** Use append-only event sourcing: each sync uploads a batch of immutable events; server never overwrites, only appends. Current "state" of an inspection is derived by replaying events.
- **Conflict handling:** if two devices report conflicting geofence validity or duplicate submissions, both are stored; a dedup/merge flag surfaces to a manager for manual reconciliation — never silently dropped.
- **Sync triggers:** automatic on network detection; manual "sync now" button; background sync when charging + WiFi (Android/iOS platform channels).

### 5.3 OCR / Document Digitization Module
- **Pipeline:** photo capture → deskew/denoise (OpenCV) → OCR (Tesseract/TrOCR) → structured field extraction (LayoutLM fine-tuned on CIL's own recurring logbook/form templates) → confidence scoring → low-confidence fields flagged for human review → stored as structured record + original image retained.
- **Why template-tuning matters:** generic OCR underperforms on real legacy mine logbooks; fine-tuning on CIL's actual historical forms (shift handover sheets, statutory certificates) is a key accuracy lever — plan a labeled dataset creation task early.
- **Output:** structured JSON per document type, linked to the original scanned image for audit purposes.

### 5.4 AI Risk & Anomaly Engine
- **Mine Risk Index (MRI):** composite score per mine site.
  - **Phase 1 (MVP):** transparent weighted rule-based score — inputs: inspection frequency vs. target, count of overdue corrective actions, incident history (rolling window), sensor threshold breaches (PM2.5/PM10/gas).
  - **Phase 2 (ML upgrade):** XGBoost/Isolation Forest models trained once sufficient historical data exists; must retain the same explainability contract (feature contribution breakdown per score).
- **Explainability requirement:** every MRI score returned by the API must include a `contributing_factors[]` array (factor name, weight, current value) — this is a hard requirement, not optional polish.
- **Anomaly detection:** time-series anomaly detection on sensor streams (Isolation Forest or seasonal decomposition) to catch environmental threshold breaches early.
- **Predictive maintenance ↔ safety correlation (innovation add-on):** join equipment downtime logs with incident history to surface lead-lag patterns (e.g., "mines with rising downtime show safety incidents 2–3 weeks later"). Ships as a Phase 3 analytics feature, not core MVP.

### 5.5 Statutory Compliance & Workflow Engine
- **Rules as data, not code:** statutory rule table `{ regulation_ref, applicable_scope, deadline_rule, responsible_role }` so DGMS/CPCB rule changes don't require redeployment.
- **State machine per violation:** `Open → Acknowledged → Overdue → Escalated → Resolved`, with SLA timers.
- **Escalation ladder:** Mine Safety Officer → Colliery Manager → Area General Manager → Subsidiary Director, triggered automatically when SLA breached.
- **One-click dossier generation:** signed PDF audit packages (PDFBox/iText or WeasyPrint) pre-filled from structured data for DGMS/MoEFCC/CPCB submissions.
- **Scheduler:** cron-style job (Quartz/Spring Batch or Celery) checks overdue items on an interval and fires escalations/notifications.

### 5.6 Contractor Management Module (innovation add-on)
- **Contractor Trust Score:** aggregates a contractor's violation history, corrective-action timeliness, and safety incidents **across all mines/subsidiaries they work at** — not siloed per site.
- **Data model:** `Contractor { id, name, registered_mines[], violations[], trust_score, blacklist_flags[] }`
- **Cross-mine flagging:** if a contractor is blacklisted at Mine A, any bid/onboarding attempt at Mine B auto-surfaces the flag to the approving manager.

### 5.7 Audit Ledger Module
- **Mechanism:** hash-chained append-only PostgreSQL table — each row stores `SHA256(content + previous_row_hash)`. This gives tamper-evidence without needing a full blockchain stack for MVP.
- **Scale-up path:** Hyperledger Fabric noted as a production-scale option, not required for MVP — flag as a later-phase consideration only.
- **What gets ledgered:** every inspection sign-off, corrective-action closure, statutory dossier generation, and escalation resolution.
- **Verification API:** any 3rd party (e.g., DGMS auditor) can request a hash-chain verification report proving no record was altered post-facto.

### 5.8 GIS & Spatial Dashboard Module
- **Backend:** PostGIS for mine boundary polygons, sensor pin locations, section geometry.
- **Frontend:** Leaflet or Mapbox, color-coded by current MRI band (low/medium/high risk), clustered markers for hazard reports, toggle layers (compliance status, sensor readings, active escalations).
- **Digital Twin — Mine Section View (innovation add-on):** simplified 2D top-down diagram of mine sections with live inspection/sensor data overlaid — intentionally not full 3D, to stay in scope for build time while still visually compelling.

### 5.9 Multilingual Voice & Chat Interface
- **Languages:** Hindi, Bengali, Odia, English.
- **STT engine:** AI4Bharat IndicASR/IndicWav2Vec (tuned for Indian regional accents/mining vocabulary) rather than generic Whisper.
- **On-device fallback:** lightweight local transcription option when fully offline; server-side re-transcription on sync for accuracy.
- **WhatsApp Grievance Fallback (innovation add-on):** WhatsApp Business API bot as a zero-install channel for workers to report hazards/grievances via text or voice note — routes into the same Inspection/Hazard data model as the app.

### 5.10 On-Device Hazard Triage (innovation add-on)
- **Model:** lightweight TensorFlow Lite classifier running on the phone, classifying hazard description/photo into severity buckets **before** sync.
- **Critical path:** if classified as high-severity and the device has no data connectivity, trigger an **SMS-based emergency alert** (SMS often works where mobile data doesn't) to the relevant Safety Officer/Colliery Manager.

### 5.11 Notification & Escalation Service
- Channels: push (mobile), email, SMS (critical/offline fallback), in-app.
- Triggers: SLA breach, new high-severity hazard, contractor blacklist flag hit, sensor threshold breach.

---

## 6. Mobile App — Structure & Screens

**Platform:** Flutter (single codebase, Android priority given field-device profile; iOS secondary).
**Local storage:** SQLite via Drift/`sqflite`, or WatermelonDB, for offline queue + cached geofence polygons + cached reference data (mine sections, rule tables).

### 6.1 Navigation Structure
```
Splash / Auth
 └─ Login (OAuth2, biometric unlock optional)
     └─ Home (role-aware dashboard: today's tasks, sync status indicator)
         ├─ Inspections
         │    ├─ New Inspection (type selector → dynamic form → geo-fence check → media capture)
         │    ├─ My Inspections (list, filter by status/date)
         │    └─ Inspection Detail (view, edit before sync, view sync/ledger status)
         ├─ Hazard Report
         │    ├─ Quick Report (voice-first, photo, severity auto-suggested)
         │    └─ My Reports (status tracking)
         ├─ Attendance
         │    └─ Geo-fenced Check-in/Check-out
         ├─ Document Scan (OCR capture)
         │    ├─ Camera Capture → Crop/Deskew Preview → Submit
         │    └─ Scan History
         ├─ Corrective Actions (assigned to me)
         │    └─ Upload Proof / Mark Resolved
         ├─ Notifications
         ├─ Sync Center (queued items, last sync time, manual sync trigger, conflict list)
         └─ Profile / Settings (language selection, offline data management)
```

### 6.2 Key UX Requirements
- Persistent **sync status indicator** (queued / syncing / synced / conflict) visible from every screen.
- **Voice-first affordance** on every text-entry field (mic icon inline).
- Large touch targets, minimal nested navigation — designed for gloved hands and outdoor/underground light conditions.
- All destructive/irreversible actions (submit inspection, close corrective action) require explicit confirmation, since records become append-only/ledgered after submission.

---

## 7. Web Portal — Structure & Pages

**Audience:** Colliery Manager, Area GM, Subsidiary Director.
**Framework:** React/Next.js + Tailwind.

```
Login (OAuth2/OIDC)
 └─ Dashboard (scope-aware: mine / area / subsidiary)
     ├─ Compliance Overview (MRI per mine, trend charts, overdue items count)
     ├─ GIS Map View (mine boundaries, sensor pins, hazard clusters, MRI color-coding)
     ├─ Inspections
     │    ├─ All Inspections (filterable table: mine, status, inspector, date)
     │    └─ Inspection Detail (media, geofence proof, ledger hash reference)
     ├─ Violations & Escalations
     │    ├─ Active Escalations (state-machine view, SLA countdown)
     │    └─ Resolved / Historical
     ├─ Corrective Actions (approve/reject proof, reassign)
     ├─ Contractors
     │    ├─ Contractor Directory (trust score, blacklist flags)
     │    └─ Contractor Detail (cross-mine violation history)
     ├─ Statutory Calendar (upcoming deadlines, auto-generated dossiers)
     ├─ Document Digitization Queue (OCR review: confirm/correct low-confidence extractions)
     ├─ Reports (one-click DGMS/CPCB/MoEFCC dossier generation)
     └─ Admin (user/role management — scoped to manager's own tier)
```

---

## 8. Corporate / Ministry Dashboard — Structure

**Audience:** CIL HQ, Ministry of Coal, DGMS auditors. Read-heavy, aggregate-focused; no raw-record editing.

```
Login (OAuth2/OIDC, elevated scope)
 └─ National Overview
     ├─ Aggregate KPIs (safety incidents, compliance rate, emission trends — national + per subsidiary)
     ├─ Heatmap View (GIS, national coalfield risk overlay)
     ├─ Subsidiary Benchmarking (cross-subsidiary comparison tables/charts)
     ├─ Policy Analytics (trend lines over time, regulation-adherence rates)
     ├─ Audit Dossier Access (download signed PDF packages, verify ledger hash-chain)
     └─ Predictive Insights (Phase 3: downtime↔incident correlation, MRI forecasting)
```

---

## 9. Contractor Portal — Structure (lightweight)

```
Login
 └─ Dashboard
     ├─ My Trust Score & History
     ├─ Active Assignments (per mine)
     ├─ Document Submission (licenses, safety training certs)
     └─ Flagged Issues (respond to violations)
```

---

## 10. End-to-End Action Cycle (Reference Walkthrough)

This is the canonical data flow an agent should use to validate that all modules are wired correctly.

1. **Field capture (offline):** A Safety Officer opens the mobile app underground (no signal). They log a hazard report — voice note in Hindi, photo of the hazard, GPS auto-tagged. On-device triage model classifies it as "high severity." App stores the event locally with a UUID, hashes the photo, and — because severity is high and there's no data connectivity — fires an **SMS alert** to the Colliery Manager immediately.
2. **Sync:** Worker walks back into network range. App auto-syncs the queued event batch to the **Sync Service**, which appends it as an immutable event (never overwrites).
3. **Server-side validation:** **Inspection Service** re-validates the geofence against the authoritative PostGIS polygon; confirms photo hash integrity.
4. **Document digitization (parallel path):** If the officer also scanned a paper handover log, the **OCR pipeline** extracts structured fields, flags low-confidence values for manager review.
5. **Risk engine update:** **AI Risk & Anomaly Engine** recalculates the mine's MRI, incorporating the new hazard + any sensor data breaches, and returns an explainable score with contributing factors.
6. **Compliance workflow trigger:** **Compliance Engine** opens a new "violation/corrective-action" record in `Open` state, assigns SLA timer, and — if related to a specific statutory regulation — links it to the relevant DGMS/CMR clause.
7. **Notification fan-out:** **Notification Service** alerts the Colliery Manager (push/email) and, since this was already flagged high-severity, the Area GM is CC'd per escalation-ladder rules.
8. **Manager action (Web Portal):** Colliery Manager reviews the hazard, GIS location, and photo; assigns a corrective action; sets a deadline.
9. **SLA monitoring:** Scheduler checks daily; if the corrective action isn't closed by deadline, it **auto-escalates** to Area GM, then Subsidiary Director if still unresolved.
10. **Resolution & ledgering:** Once corrective action proof is uploaded and approved, the record moves to `Resolved`. The resolution event, along with the original hazard event, corrective action, and approval, are all written to the **hash-chained audit ledger**.
11. **Dossier generation:** At month-end (or on-demand), the **Statutory Workflow Engine** auto-generates a signed PDF compliance dossier referencing all ledgered events for that period — ready for DGMS inspection.
12. **Corporate visibility:** The event rolls up into the **Corporate Dashboard's** national KPIs and heatmap without any manual reporting step.
13. **Contractor linkage (if applicable):** If the hazard involved contractor equipment/personnel, the event also updates that **Contractor's Trust Score**, and — if severe enough — flags them across all mines they operate in.

---

## 11. Data Model Overview (Key Entities)

```
User(id, name, role, scope_type, scope_id, phone, preferred_language)
Mine(id, name, subsidiary_id, boundary_polygon[PostGIS], sections[])
MineSection(id, mine_id, geometry[PostGIS])
Inspection(id, mine_id, section_id, inspector_id, gps, geofence_valid, timestamp, type, status, media[])
HazardReport(id, mine_id, reporter_id, severity, ai_suggested_severity, description, voice_note_url, photo_url, status)
CorrectiveAction(id, violation_id, assigned_to, deadline, status, proof_media[])
Violation(id, mine_id, regulation_ref, status[open|acknowledged|overdue|escalated|resolved], sla_deadline, escalation_level)
Contractor(id, name, registered_mines[], trust_score, blacklist_flags[])
MineRiskScore(id, mine_id, score, contributing_factors[], computed_at, model_version)
AuditLedgerEntry(id, ref_type, ref_id, content_hash, previous_hash, created_at)
Document(id, source_type, ocr_extracted_fields{}, confidence, original_image_url, review_status)
SensorReading(id, mine_id, sensor_type[PM2.5|PM10|gas], value, timestamp)
```

---

## 12. Non-Functional Requirements

- **Offline resilience:** mobile app must survive multi-day offline periods without data loss.
- **Security:** OAuth2/OIDC, RBAC scoped by mine/subsidiary/national tier, encrypted at rest and in transit, signed PDF dossiers.
- **Auditability:** every state-changing action traceable to a user, timestamp, and (where applicable) a ledger hash.
- **Scalability:** architecture must support incremental rollout — single mine pilot → subsidiary-wide → all-CIL — without redesign.
- **Explainability:** no opaque ML output surfaces to a compliance-facing screen without a factor breakdown.
- **Localization:** UI and voice support for Hindi, Bengali, Odia, English from day one; architecture should allow adding more languages without core changes.

---

## 13. Known Constraints / Honest Assumptions for Planning

- **No real historical incident/ML training data exists at project start.** Plan the Risk Engine as rule-based first; do not assume ML accuracy claims before real data collection.
- **OCR accuracy depends on access to real legacy document samples** for template tuning — this is a data-collection dependency, not just a modeling task.
- **Full Hyperledger/blockchain infrastructure is out of scope for MVP** — hash-chained Postgres is the load-bearing design for tamper-evidence.
- **Full 3D digital twin is explicitly out of scope** — 2D section-overlay is the intended fidelity level.

---

## 14. Implementation Phases (Roadmap for Agent Planning)

Each phase below should be expanded by the planning agent into its own detailed subplan (tasks, file/service boundaries, test criteria) before implementation begins. Phases are sequential but Phase 2 and Phase 3 workstreams can partially parallelize once Phase 1's data model is stable.

### Phase 0 — Foundations (Setup)
**Goal:** working skeleton, no business logic yet.
- Repo structure (monorepo or polyrepo decision), CI/CD pipeline skeleton.
- Auth service with OAuth2/OIDC, base RBAC scaffolding (roles/scopes from Section 3).
- Core data model migrations for entities in Section 11 (start with User, Mine, MineSection, Inspection).
- API Gateway skeleton + routing conventions.
- Base Flutter app shell (navigation skeleton from Section 6.1, no real screens yet) + base Next.js web portal shell (Section 7 nav skeleton).
- **Acceptance criteria:** a user can log in on both mobile and web against the same auth service; empty-state screens render per role.

### Phase 1 — Core MVP: Field Reporting + Compliance Backbone
**Goal:** the primary value loop works end-to-end, without AI.
- Mobile: New Inspection flow with offline queue, local geofence check, media capture + client-side hashing (Section 5.1, 6.1).
- Sync Service: append-only event upload, conflict flagging (Section 5.2).
- Backend: Inspection Service, Violation state machine, manual (non-AI) severity tagging (Section 5.5 minus rules-engine automation).
- Web Portal: Inspections table + detail view, manual corrective-action assignment/approval (Section 7).
- Audit Ledger: hash-chaining implemented for inspection sign-offs and corrective-action closures (Section 5.7).
- **Acceptance criteria:** a field worker can submit an inspection fully offline, sync it, have a manager see and act on it in the web portal, and have the sign-off be ledger-verifiable.

### Phase 2 — Statutory Automation + Rule-Based Risk Engine
**Goal:** replace manual tracking with automated workflows.
- Statutory rule table + scheduler for SLA/overdue detection (Section 5.5).
- Auto-escalation ladder wired to Notification Service.
- Rule-based Mine Risk Index (weighted scoring, explainable factor breakdown) (Section 5.4 Phase 1).
- GIS Dashboard: mine map with MRI color-coding (Section 5.8, Section 7).
- One-click PDF dossier generation (Section 5.5).
- **Acceptance criteria:** an overdue corrective action auto-escalates without manual intervention; a manager can view an MRI score with its contributing factors; a compliance dossier PDF is generated on demand.

### Phase 3 — AI/ML Layer + Document Digitization
**Goal:** layer intelligence onto the working backbone.
- OCR pipeline: capture → preprocessing → extraction → confidence-flagged review queue (Section 5.3).
- Multilingual voice input (STT integration, Section 5.9).
- On-device hazard triage model + SMS fallback for high-severity offline reports (Section 5.10).
- Sensor ingestion + anomaly detection (Section 5.4).
- Begin ML-based MRI once sufficient real data exists (explicitly gated, not assumed ready).
- **Acceptance criteria:** a scanned legacy logbook produces a structured, reviewable record; a voice-reported hazard in Hindi is transcribed and logged; a high-severity offline report triggers an SMS alert.

### Phase 4 — Innovation Additions
**Goal:** differentiation features, built once the core is stable.
- Contractor Trust Score + cross-mine blacklist flagging (Section 5.6) + Contractor Portal (Section 9).
- WhatsApp Grievance Fallback bot, routed into the same hazard data model (Section 5.9).
- Digital Twin 2D mine-section overlay (Section 5.8).
- Predictive maintenance ↔ safety incident correlation analytics (Section 5.4).
- Corporate/Ministry Dashboard full build-out (Section 8), including predictive insights view.
- **Acceptance criteria:** a contractor blacklisted at one mine is auto-flagged at another; a worker can report a hazard via WhatsApp with no app installed; a manager can view a 2D live-overlaid mine section.

### Phase 5 — Hardening, Scale & Rollout
**Goal:** production readiness.
- Security review (penetration testing, RBAC edge cases, encrypted storage audit).
- Load testing for multi-mine, multi-subsidiary scale.
- Pilot rollout at a single mine → iterate → expand to subsidiary → expand to all-CIL (per Section 12 scalability requirement).
- Documentation, training materials for field staff (given literacy/connectivity constraints, prioritize video/voice training content).
- **Acceptance criteria:** system passes security review; pilot mine runs for a defined trial period with acceptable sync-failure and data-loss rates; rollout runbook exists for subsidiary-wide expansion.

---

## 15. How an Agent Should Use This Document

1. Treat Sections 5–9 as the authoritative spec for what each module/screen must contain — do not invent scope beyond what's described without flagging it as a new assumption.
2. Use Section 10 (Action Cycle) as the integration test script — every phase's acceptance criteria should map back to some segment of this cycle.
3. Use Section 14 as the phase backbone, but expand each phase into its own sub-document with concrete tasks, service boundaries, and test plans before coding starts.
4. Where a design principle (Section 2.1) and a convenience shortcut conflict during implementation, the design principle wins — flag the conflict rather than silently resolving it.
5. Section 13's constraints are hard boundaries for MVP scope — do not plan Hyperledger, full 3D, or production ML accuracy claims into early phases.
