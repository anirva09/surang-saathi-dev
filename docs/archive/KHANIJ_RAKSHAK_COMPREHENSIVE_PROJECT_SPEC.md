# Khanij Rakshak - Comprehensive Project Specification
## AI-Based Smart Governance & Compliance Monitoring System for Coal Mines (SIH26024)

**Project Codename:** Khanij Rakshak  
**Version:** 2.0 (Merged & Enhanced)  
**Last Updated:** September 8, 2026  
**Status:** DRAFT - Architecture & Implementation Ready  
**Target Deployment:** Government of India - Ministry of Coal & Coal India Limited

---

## Document Status & Completion Tracker

### ✅ COMPLETED SECTIONS (Ready for Implementation)
1. Executive Summary & Problem Context
2. Solution Architecture Overview
3. System Architecture with Java Backend
4. User Roles & Access Tiers
5. Core Technology Stack (Java-focused)
6. Data Model & Database Schema
7. Security & Compliance Framework
8. Module-by-Module Specifications (Partial)

### 🚧 INCOMPLETE SECTIONS (To Be Completed)
1. **Web Portal Complete UI/UX Specifications** - Only structure outlined, needs detailed wireframes and component specs
2. **Mobile App Detailed Screen Specifications** - Navigation done, but individual screen components need expansion
3. **API Contract Specifications** - REST/gRPC endpoint documentation needed
4. **DevOps & CI/CD Pipeline Details** - Only high-level mentioned
5. **Testing Strategy & QA Framework** - Not yet documented
6. **Training & User Onboarding Materials** - Mentioned but not detailed
7. **Deployment Runbook & SOP** - Needs creation
8. **Performance Benchmarking Criteria** - Needs detailed metrics
9. **Disaster Recovery & Business Continuity Plan** - Not documented
10. **Integration Specifications** (ERP, HRMS, existing CIL systems) - Needs research

### 📋 NEXT STEPS FOR CONTINUATION
- Complete API documentation with Swagger/OpenAPI specs
- Finalize all UI component specifications with detailed wireframes
- Add Java Spring Boot code structure and package organization
- Document microservice communication patterns
- Create database migration scripts
- Add comprehensive testing strategy
- Document deployment architecture for NIC Cloud

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Context](#2-problem-context)
3. [Solution Overview](#3-solution-overview)
4. [Non-Negotiable Design Principles](#4-non-negotiable-design-principles)
5. [User Roles & Access Tiers](#5-user-roles--access-tiers)
6. [System Architecture](#6-system-architecture)
7. [Technology Stack](#7-technology-stack)
8. [Core Modules - Detailed Specifications](#8-core-modules---detailed-specifications)
9. [Data Model & Database Design](#9-data-model--database-design)
10. [Mobile Application Architecture](#10-mobile-application-architecture)
11. [Web Portal Architecture](#11-web-portal-architecture)
12. [Corporate Dashboard Architecture](#12-corporate-dashboard-architecture)
13. [API Design & Microservices](#13-api-design--microservices)
14. [Security & Compliance](#14-security--compliance)
15. [Offline-First Architecture](#15-offline-first-architecture)
16. [AI/ML Components](#16-aiml-components)
17. [GIS & Spatial Intelligence](#17-gis--spatial-intelligence)
18. [Deployment Architecture](#18-deployment-architecture)
19. [Implementation Phases](#19-implementation-phases)
20. [Acceptance Criteria](#20-acceptance-criteria)

---

## 1. Executive Summary

### 1.1 Project Overview

**Khanij Rakshak** is a comprehensive, AI-driven smart governance and compliance monitoring platform designed specifically for Coal India Limited (CIL) and its subsidiaries (SECL, MCL, ECL, etc.) to transform coal mine operations from paper-based, delayed reporting systems to a real-time, offline-capable, tamper-evident digital ecosystem.

### 1.2 Key Objectives

- **Digitize field operations** with offline-first mobile inspections
- **Automate statutory compliance** tracking (DGMS, CPCB, MoEFCC)
- **Enable real-time decision-making** across mine → subsidiary → ministry hierarchy
- **Ensure accountability** through geo-fenced, tamper-evident audit trails
- **Predict and prevent** safety incidents using AI risk scoring
- **Centralize contractor management** with cross-mine trust scoring
- **Provide national visibility** to policy makers with aggregate analytics

### 1.3 Target Users

- **412 Coal Mines** across India
- **~2,80,000 Field Workers** (overmen, mining sirdars, safety officers)
- **~5,000 Managers** (colliery managers, area GMs, subsidiary directors)
- **~500 Corporate/Ministry Officials** (CIL HQ, Ministry of Coal, DGMS auditors)
- **~1,200 Registered Contractors**

### 1.4 Expected Outcomes

- **30% reduction** in inspection cycle time
- **20% YoY decrease** in statutory violations
- **95%+ on-time** inspection completion rate
- **99.5% system uptime** with offline resilience
- **100% audit trail** coverage for compliance events
- **Zero data loss** in offline-to-online sync scenarios

---

## 2. Problem Context

### 2.1 Current State Challenges

Coal India Limited operates 412 mines spanning open-cast and underground operations across India. Current governance mechanisms suffer from:

#### 2.1.1 Paper-Based Inefficiency
- Manual logbooks for shift handovers, safety inspections, equipment maintenance
- Spreadsheets maintained independently per site with no cross-mine visibility
- Physical document storage leading to loss, damage, and retrieval delays
- No structured way to search historical records

#### 2.1.2 Delayed & Unreliable Reporting
- Multi-day lag between field events and management awareness
- No real-time visibility into critical safety incidents
- Delayed statutory compliance reporting to DGMS/CPCB
- Information bottlenecks at each hierarchy level

#### 2.1.3 Weak Accountability
- No verifiable proof of inspection occurrence (time, location, personnel)
- Easy to backdate or fabricate paper records
- Difficulty attributing non-compliance to specific actors
- No systematic tracking of corrective action closure

#### 2.1.4 Compliance Gaps
- Missed statutory deadlines due to manual tracking
- Inconsistent interpretation of regulations across mines
- No automated escalation for overdue violations
- Difficulty producing audit-ready documentation for DGMS inspections

#### 2.1.5 Contractor Management Siloing
- Contractor violations at Mine A unknown to Mine B during bidding
- No unified contractor performance tracking
- Manual blacklist management with loopholes
- Wage payment verification done ad-hoc

#### 2.1.6 Data Fragmentation
- No single source of truth for operational/compliance data
- Duplicate data entry across systems
- Inability to perform cross-mine analytics
- No correlation between equipment downtime and safety incidents

### 2.2 Regulatory Context

The system must ensure compliance with:

- **Mines Act, 1952** - Statutory safety and operational requirements
- **Coal Mines Regulations (CMR), 2017** - Updated safety and health standards
- **DGMS Circulars** - Technical guidelines from Directorate General of Mines Safety
- **Environment (Protection) Act, 1986** - Environmental compliance
- **Air & Water Pollution Control Acts** - Emission and effluent monitoring
- **Forest Conservation Act** - Buffer zone and green belt requirements
- **IT Act, 2000** - Digital signatures, electronic records, data protection
- **Personal Data Protection Bill (DPDP Act)** - Privacy and consent management
- **Right to Information Act, 2005** - Public data access provisions

### 2.3 Operational Context

- **Connectivity Challenges:** Underground mines and remote open-cast sites often have zero mobile data connectivity
- **Workforce Profile:** Field workers have varying literacy levels; multilingual support (Hindi, Bengali, Odia, English) is mandatory
- **Device Constraints:** Field devices must withstand harsh conditions (dust, moisture, temperature extremes)
- **Scale:** System must handle 412 mines generating ~50,000+ inspection events per day at full adoption
- **Legacy Integration:** Must coexist with existing CIL ERP, HRMS, and production tracking systems

---

## 3. Solution Overview

### 3.1 Vision Statement

Build **one centralized, offline-capable, AI-driven platform** — **Khanij Rakshak** — that connects three organizational tiers in real-time while functioning seamlessly in zero-connectivity environments.

```
┌──────────────────────────────────────────────────────────────────┐
│                          KHANIJ RAKSHAK                          │
│        Smart Governance & Compliance Monitoring Platform         │
└──────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│  FIELD LEVEL   │    │ SUBSIDIARY LEVEL│    │ CORPORATE LEVEL │
│                │    │                 │    │                 │
│ Mobile App     │◄───┤ Web Portal      │◄───┤ National        │
│ (Offline-First)│    │ (Real-time Ops) │    │ Dashboard       │
│                │    │                 │    │                 │
│ • Inspections  │    │ • Cross-mine    │    │ • Aggregate KPIs│
│ • Hazards      │    │   analytics     │    │ • Policy        │
│ • Attendance   │    │ • Escalations   │    │   analytics     │
│ • Voice/Photo  │    │ • Contractor    │    │ • Audit access  │
│ • OCR Scanning │    │   management    │    │ • National GIS  │
└────────────────┘    └─────────────────┘    └─────────────────┘
```

### 3.2 Core Capabilities

#### 3.2.1 Field Operations (Mobile-First)
- **Geo-fenced Inspections:** GPS-verified, time-stamped safety and environmental inspections
- **Offline Resilience:** Full functionality with zero connectivity; auto-sync when network available
- **Multilingual Voice Input:** Hindi, Bengali, Odia, English speech-to-text
- **Hazard Reporting:** Photo + voice + AI-assisted severity classification
- **OCR Document Scanning:** Digitize legacy paper logbooks and certificates
- **Attendance Tracking:** Geo-fenced worker and contractor check-in/out

#### 3.2.2 Compliance Automation (Backend Intelligence)
- **Statutory Calendar:** Auto-track DGMS, CPCB, MoEFCC deadlines with alerts
- **Smart Escalation:** Multi-tier automated escalation based on SLA breaches
- **One-Click Dossiers:** Auto-generate signed PDF audit packages for regulators
- **Rule-Based Workflows:** Regulatory rules stored as data (no code changes for rule updates)
- **Corrective Action Tracking:** Assign, monitor, approve, and close violation remediation

#### 3.2.3 AI & Analytics Layer
- **Mine Risk Index (MRI):** Explainable composite risk score per mine
- **Anomaly Detection:** Real-time sensor data monitoring (PM2.5, PM10, gas levels)
- **Predictive Maintenance Correlation:** Link equipment downtime to safety incidents
- **On-Device Hazard Triage:** Lightweight ML model classifying severity offline
- **OCR Intelligence:** Extract structured data from scanned documents with confidence scoring

#### 3.2.4 Contractor Governance
- **Cross-Mine Trust Score:** Aggregate contractor performance across all CIL operations
- **Blacklist Propagation:** Auto-flag contractors blacklisted at any mine during new bids
- **Wage Verification:** Track contractor payment compliance
- **Document Management:** Centralized contractor license and certificate repository

#### 3.2.5 Audit & Accountability
- **Hash-Chained Ledger:** Tamper-evident audit trail using SHA-256 chaining
- **Immutable Records:** Append-only event sourcing (corrections create new entries)
- **Digital Signatures:** Cryptographic signing of statutory dossiers
- **Photo Hash Verification:** Detect tampered evidence photos

#### 3.2.6 Spatial Intelligence (GIS)
- **National Compliance Map:** India-wide heatmap colored by MRI bands
- **Mine Boundary Verification:** PostGIS polygons for geo-fence validation
- **Sensor & Hazard Visualization:** Interactive map layers showing live alerts
- **2D Digital Twin:** Simplified top-down mine section view with live data overlay

---

## 4. Non-Negotiable Design Principles

These constraints are **mandatory** and must be preserved during all implementation decisions:

### 4.1 Offline-First, Not Offline-Tolerant

**Rationale:** Underground mines have **zero** mobile connectivity. Workers cannot wait for network access to log critical safety observations.

**Requirements:**
- Mobile app must be **fully functional** with no network connection
- All forms, media capture, voice input must work offline
- Local data storage using SQLite/WatermelonDB with encryption
- Sync queue must handle multi-day offline periods without data loss
- Conflict resolution must be explicit (never silent overwrites)

### 4.2 Explainability Over Black-Box ML

**Rationale:** Risk scores may affect accountability, penalties, and resource allocation. Stakeholders need **justification**, not just a number.

**Requirements:**
- Every AI-generated score must include a `contributing_factors[]` breakdown
- Show which metrics contributed, their weights, and current values
- Prefer rule-based systems for MVP; add ML only when historical data exists
- No opaque neural network outputs on compliance-facing screens

### 4.3 Append-Only, Tamper-Evident Records

**Rationale:** Compliance records are legal documents. Retroactive editing undermines auditability.

**Requirements:**
- No in-place updates to inspection logs, sign-offs, or corrective actions
- All corrections must create new entries referencing the original
- Hash-chained audit ledger for all state-changing events
- Photo/media hashing at capture time to detect tampering

### 4.4 Rule-Based MVP Before ML

**Rationale:** No historical training data exists at project start. Cannot block launch on ML model accuracy.

**Requirements:**
- Ship **transparent weighted-scoring** systems first (Mine Risk Index, Contractor Trust Score)
- Design data collection pipelines from day one
- Plan ML integration as Phase 3 enhancement, not MVP dependency
- Maintain API contracts so rule-based → ML transition is seamless

### 4.5 Low-Literacy, Low-Connectivity, Multilingual Field UX

**Rationale:** Field workers have diverse educational backgrounds and operate in harsh environments.

**Requirements:**
- **Voice-first** affordance on all text input fields
- Large touch targets (min 48x48 dp) for gloved hands
- Minimal nested navigation (max 3 levels deep)
- **Mandatory language support:** Hindi, Bengali, Odia, English
- WhatsApp fallback channel for zero-install hazard reporting
- Visual status indicators (color-coded, icon-based)

### 4.6 Security & Privacy by Design

**Rationale:** Government system handling worker PII, location data, and statutory compliance records.

**Requirements:**
- **OAuth2/OIDC** authentication with multi-factor support
- **RBAC** scoped by mine/subsidiary/national hierarchy
- **AES-256** encryption at rest (database, local storage, backups)
- **TLS 1.3** encryption in transit
- **Digital signatures** on statutory dossiers
- **Audit logging** of all access and state changes
- **Data minimization:** Collect only what's statutorily required

---

## 5. User Roles & Access Tiers

### 5.1 Role-Based Access Control (RBAC) Matrix

| Tier | Role | Primary Interface | Scope | Key Permissions |
|------|------|-------------------|-------|-----------------|
| **Field / Mine Level** | Overman | Mobile App | Single Mine Section | Submit inspections, report hazards, mark attendance |
| | Mining Sirdar | Mobile App | Single Mine Section | Submit inspections, upload equipment logs |
| | Safety Officer | Mobile App + Web | Single Mine | Submit/approve inspections, assign corrective actions, view mine-level reports |
| | Mine Manager | Web Portal | Single Mine | Approve corrective actions, manage users, view compliance dashboard |
| **Area / Subsidiary Level** | Colliery Manager | Web Portal | Multiple Mines (Area) | Approve escalated actions, manage contractors, view cross-mine analytics |
| | Area General Manager | Web Portal | Area (10-20 mines) | Strategic oversight, budget allocation, cross-mine benchmarking |
| | Subsidiary Director | Web Portal | Subsidiary (50-100 mines) | Policy setting, subsidiary-wide reporting, contractor blacklisting |
| **Corporate / Ministry Level** | CIL HQ Analyst | Corporate Dashboard | All CIL Mines (National) | View aggregate KPIs, download reports, no edit rights |
| | Ministry of Coal Official | Corporate Dashboard | National | Policy analytics, trend analysis, audit dossier access |
| | DGMS Auditor | Corporate Dashboard | National (Read-Only) | Verify audit trails, download signed dossiers |
| **Contractor** | Contractor Admin | Contractor Portal | Own Operations Only | Submit compliance docs, view trust score, respond to violations |
| **System** | System Admin | Admin Console | Global | User/role management, system configuration, audit log access |
| | DevOps | Infrastructure | Global | Deployment, monitoring, incident response |

### 5.2 Permission Model

Permissions are expressed as `{action}:{resource}:{scope}`

**Actions:** `read`, `write`, `approve`, `escalate`, `delete`, `admin`  
**Resources:** `inspection`, `hazard`, `corrective_action`, `contractor`, `user`, `report`, `audit_log`  
**Scopes:** `mine:<mine_id>`, `subsidiary:<subsidiary_id>`, `national`, `own`

**Examples:**
- Overman: `write:inspection:mine:12345`, `write:hazard:mine:12345`
- Safety Officer: `write:inspection:mine:12345`, `approve:corrective_action:mine:12345`, `read:report:mine:12345`
- Area GM: `read:inspection:subsidiary:SECL`, `approve:corrective_action:subsidiary:SECL`, `admin:user:subsidiary:SECL`
- Ministry Official: `read:*:national`, `read:audit_log:national`

### 5.3 Authentication Flow

```
User → Login Screen → OAuth2/OIDC Provider (Keycloak/Azure AD)
                              ↓
                    Identity Verification (Username + Password + OTP)
                              ↓
                    JWT Token Issued (contains role, scope claims)
                              ↓
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   Mobile App            Web Portal          Corporate Dashboard
        │                     │                     │
   Local Token Cache    Session Storage       Session Storage
        │                     │                     │
   API Calls (Bearer Token in Authorization Header)
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ↓
                    API Gateway (Token Validation)
                              ↓
                    Extract role/scope claims
                              ↓
                    Route to appropriate microservice
                              ↓
                    Enforce RBAC at service level
```

---

## 6. System Architecture

### 6.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  Mobile App          Web Portal          Corporate         Contractor│
│  (Flutter)           (React/Next.js)     Dashboard         Portal   │
│  SQLite local        Redux state         (React)           (React)  │
│  Offline-first       Real-time updates   Read-only                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                         REST/gRPC over HTTPS
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│  Spring Cloud Gateway / Kong                                        │
│  • OAuth2 Token Validation (Keycloak integration)                   │
│  • Rate Limiting (per role: 1000 req/hr field, 5000 req/hr mgmt)   │
│  • Request Routing & Load Balancing                                 │
│  • API Versioning (/v1/, /v2/)                                      │
│  • CORS Configuration                                               │
│  • Request/Response Logging                                         │
└─────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                    CORE BACKEND (Java Microservices)                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Inspection   │  │ Compliance   │  │ User/Role    │             │
│  │ Service      │  │ Engine       │  │ Service      │             │
│  │ (Spring Boot)│  │ (Spring Boot)│  │ (Spring Boot)│             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Notification │  │ Document     │  │ Audit Ledger │             │
│  │ Service      │  │ Service      │  │ Service      │             │
│  │ (Spring Boot)│  │ (Spring Boot)│  │ (Spring Boot)│             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Sync/Conflict│  │ Contractor   │  │ GIS/Spatial  │             │
│  │ Service      │  │ Service      │  │ Service      │             │
│  │ (Spring Boot)│  │ (Spring Boot)│  │ (Spring Boot)│             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│  Inter-service Communication: REST + Spring Cloud OpenFeign         │
│  Service Discovery: Eureka / Consul                                 │
│  Config Management: Spring Cloud Config Server                      │
│  Circuit Breaker: Resilience4j                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                  AI/ML LAYER (Python Microservices)                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Risk Scoring │  │ OCR/Document │  │ Speech-to-   │             │
│  │ Engine       │  │ Understanding│  │ Text Service │             │
│  │ (FastAPI)    │  │ (FastAPI)    │  │ (FastAPI)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐                               │
│  │ Anomaly      │  │ On-Device    │                               │
│  │ Detection    │  │ Model Server │                               │
│  │ (FastAPI)    │  │ (TFLite)     │                               │
│  └──────────────┘  └──────────────┘                               │
│                                                                     │
│  Called via REST/gRPC from Java services                            │
│  Model Registry: MLflow                                             │
│  Model Serving: TensorFlow Serving / TorchServe                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ PostgreSQL 15 + PostGIS (Primary Transactional DB)       │      │
│  │ • User, Role, Mine, Inspection, Hazard, Violation tables │      │
│  │ • Spatial data (mine boundaries, GPS coordinates)        │      │
│  │ • Hash-chained append-only audit tables                  │      │
│  │ • Read Replicas for analytics queries                    │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ TimescaleDB / InfluxDB (Time-Series Sensor Data)         │      │
│  │ • PM2.5, PM10, gas sensor readings                       │      │
│  │ • Equipment telemetry                                    │      │
│  │ • High-frequency data retention policies                 │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ Redis Cluster (Caching & Message Queue)                  │      │
│  │ • Session management                                     │      │
│  │ • API response caching (TTL-based)                       │      │
│  │ • Celery task queue (scheduled jobs, notifications)      │      │
│  │ • Pub/Sub for real-time updates                          │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ S3-Compatible Object Storage (MinIO / AWS S3)            │      │
│  │ • Photos, audio recordings, scanned documents            │      │
│  │ • Generated PDF dossiers                                 │      │
│  │ • Versioning enabled for audit trail                     │      │
│  │ • Lifecycle policies (archive to cold storage after 5y)  │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ Elasticsearch (Full-Text Search & Log Aggregation)       │      │
│  │ • Document content search                                │      │
│  │ • Inspection/hazard report search                        │      │
│  │ • Application logs (via Logstash)                        │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE & MONITORING                      │
├─────────────────────────────────────────────────────────────────────┤
│  Deployment: Kubernetes (K8s) on NIC Cloud / AWS GovCloud          │
│  Container Registry: Harbor / Amazon ECR                            │
│  Monitoring: Prometheus + Grafana                                   │
│  Logging: ELK Stack (Elasticsearch, Logstash, Kibana)              │
│  APM: New Relic / Datadog / Elastic APM                            │
│  Secrets Management: HashiCorp Vault / AWS Secrets Manager         │
│  CI/CD: Jenkins / GitLab CI / GitHub Actions                       │
│  IaC: Terraform + Ansible                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Microservice Breakdown

Each microservice is a **Spring Boot 3.x** application with:
- **RESTful APIs** (primary) + **gRPC** (for internal high-performance calls)
- **PostgreSQL database** (one logical DB per service, schema isolation)
- **Independent deployment** (containerized with Docker)
- **Health checks** (`/actuator/health`, `/actuator/info`)
- **Metrics export** (Prometheus format via Micrometer)
- **Distributed tracing** (Sleuth + Zipkin/Jaeger)

---

## 7. Technology Stack

### 7.1 Frontend Technologies

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Mobile App** | **Flutter 3.x** | Single codebase (Android + iOS), excellent offline support, native performance, strong community |
| **Web Portal** | **React 18 + Next.js 14** | Server-side rendering for performance, rich ecosystem, government app precedent |
| **UI Framework** | **Tailwind CSS + shadcn/ui** | Rapid development, accessibility-first components, consistent design system |
| **State Management** | **Redux Toolkit (Web), Provider (Mobile)** | Predictable state, debugging tools, offline-first state persistence |
| **Charts/Viz** | **Recharts, D3.js** | Accessible, customizable, works offline |
| **Maps** | **Leaflet + MapLibre GL** | Open-source, no API keys, works with PostGIS |

### 7.2 Backend Technologies (Java Ecosystem)

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| **Core Framework** | **Spring Boot** | 3.2.x | Industry standard for Java microservices, government IT precedent, mature ecosystem |
| **Build Tool** | **Maven** | 3.9.x | Standard for government Java projects, reliable dependency management |
| **Java Version** | **Java 21 (LTS)** | 21.0.x | Latest LTS, modern language features, performance improvements |
| **API Gateway** | **Spring Cloud Gateway** | 4.1.x | Native Spring integration, non-blocking, WebFlux-based |
| **Service Discovery** | **Eureka** | 4.1.x | Battle-tested, Spring Cloud integration |
| **Config Management** | **Spring Cloud Config** | 4.1.x | Externalized configuration, Git-backed |
| **Circuit Breaker** | **Resilience4j** | 2.2.x | Lightweight, functional programming style, Spring Boot integration |
| **API Documentation** | **SpringDoc OpenAPI 3** | 2.3.x | Auto-generates Swagger UI, JAX-RS/Spring annotations |
| **Authentication** | **Spring Security + OAuth2** | 6.2.x | OIDC support, JWT validation, role-based access |
| **Identity Provider** | **Keycloak** | 23.x | Open-source, SAML/OIDC, user federation, MFA support |
| **ORM** | **Spring Data JPA (Hibernate)** | 6.4.x | Standard Java ORM, query derivation, repository pattern |
| **Database Migration** | **Flyway** | 10.x | Version-controlled schema migrations, rollback support |
| **Validation** | **Hibernate Validator** | 8.0.x | Bean Validation (JSR-380), declarative constraints |
| **Testing** | **JUnit 5 + Mockito + TestContainers** | 5.10.x | Unit, integration, and database testing |
| **Logging** | **SLF4J + Logback** | 2.0.x | Structured logging, JSON output for Logstash |
| **Caching** | **Spring Cache + Redis** | 3.2.x | Annotation-driven caching, distributed cache |
| **Scheduling** | **Spring Scheduler + Quartz** | 2.3.x | Cron-based jobs, distributed job coordination |
| **Messaging** | **Spring AMQP (RabbitMQ)** | 3.1.x | Async task processing, event-driven architecture |
| **Monitoring** | **Spring Boot Actuator + Micrometer** | 1.12.x | Prometheus metrics, health checks |

### 7.3 AI/ML Technologies (Python Ecosystem)

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| **ML Framework** | **FastAPI** | 0.109.x | High-performance async, OpenAPI auto-generation, easy Java integration |
| **NLP/OCR** | **LayoutLM, Tesseract, TrOCR** | Latest | Document understanding, multilingual OCR |
| **ML Models** | **Scikit-learn, XGBoost** | Latest | Explainable risk scoring, anomaly detection |
| **STT** | **AI4Bharat IndicASR** | Latest | Indian language support, mining vocabulary tuning |
| **On-Device ML** | **TensorFlow Lite** | Latest | Offline hazard triage on mobile |
| **Model Serving** | **TensorFlow Serving / TorchServe** | Latest | Production ML deployment |
| **Model Registry** | **MLflow** | 2.x | Experiment tracking, model versioning |

### 7.4 Database Technologies

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| **Primary DB** | **PostgreSQL** | 15.x | ACID compliance, JSON support, government standard |
| **Spatial Extension** | **PostGIS** | 3.4.x | Geo-fencing, mine boundary queries |
| **Time-Series DB** | **TimescaleDB** | 2.14.x | Sensor data, built on PostgreSQL |
| **Cache/Queue** | **Redis** | 7.2.x | Sub-millisecond latency, pub/sub, Lua scripting |
| **Search Engine** | **Elasticsearch** | 8.12.x | Full-text search, log aggregation |
| **Object Storage** | **MinIO** | Latest | S3-compatible, on-premise option for NIC Cloud |

### 7.5 DevOps & Infrastructure

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Containerization** | **Docker** | Standard container runtime |
| **Orchestration** | **Kubernetes (K8s)** | Auto-scaling, self-healing, NIC Cloud support |
| **Container Registry** | **Harbor** | Vulnerability scanning, image signing |
| **CI/CD** | **Jenkins** | Government IT standard, plugin ecosystem |
| **IaC** | **Terraform + Ansible** | Multi-cloud provisioning, configuration management |
| **Monitoring** | **Prometheus + Grafana** | Metrics collection, visualization |
| **Logging** | **ELK Stack** | Centralized logging, search, analysis |
| **APM** | **Elastic APM** | Application performance, distributed tracing |
| **Secrets** | **HashiCorp Vault** | Secret management, encryption-as-a-service |

### 7.6 Security Technologies

| Component | Technology | Justification |
|-----------|------------|---------------|
| **TLS Certificates** | **Let's Encrypt / NIC CA** | Auto-renewal, trusted CA |
| **Encryption** | **AES-256 (at rest), TLS 1.3 (in transit)** | Government security standards |
| **Digital Signature** | **Java KeyStore (JKS) + Bouncy Castle** | PDF signing, audit trail verification |
| **SIEM** | **Wazuh / Splunk** | Security event monitoring, compliance |
| **Vulnerability Scanning** | **OWASP Dependency-Check, Trivy** | Detect vulnerable dependencies/images |

---

## 8. Core Modules - Detailed Specifications

### 8.1 Inspection & Field Reporting Module

#### 8.1.1 Purpose
Enable field workers to log statutory safety, environmental, and operational inspections with geo-verification, offline capability, and media evidence capture.

#### 8.1.2 Data Model (Java Entities)

```java
@Entity
@Table(name = "inspections")
public class Inspection {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "mine_id", nullable = false)
    private Mine mine;
    
    @ManyToOne
    @JoinColumn(name = "section_id")
    private MineSection section;
    
    @ManyToOne
    @JoinColumn(name = "inspector_id", nullable = false)
    private User inspector;
    
    @Column(name = "gps_latitude", nullable = false)
    private Double gpsLatitude;
    
    @Column(name = "gps_longitude", nullable = false)
    private Double gpsLongitude;
    
    @Column(name = "geofence_valid", nullable = false)
    private Boolean geofenceValid;
    
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private InspectionType type; // SAFETY, ENVIRONMENTAL, ATTENDANCE, EQUIPMENT
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InspectionStatus status; // DRAFT, SUBMITTED, APPROVED, FLAGGED
    
    @OneToMany(mappedBy = "inspection", cascade = CascadeType.ALL)
    private List<InspectionMedia> media = new ArrayList<>();
    
    @Column(name = "voice_note_url")
    private String voiceNoteUrl;
    
    @Column(name = "voice_transcript", columnDefinition = "TEXT")
    private String voiceTranscript;
    
    @Column(name = "sync_status")
    @Enumerated(EnumType.STRING)
    private SyncStatus syncStatus; // QUEUED, SYNCED, CONFLICT
    
    @Column(name = "ledger_hash", length = 64)
    private String ledgerHash; // SHA-256 hash for tamper detection
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at")
    private Instant updatedAt;
}
```

#### 8.1.3 Key Features

**Geo-Fencing Logic:**
- Each mine/section stored as PostGIS polygon
- Mobile app caches polygons locally (works offline)
- Client-side: ST_Contains check before submission
- Server-side: Re-validates against authoritative PostGIS polygon on sync

**Offline Capture:**
- Every action gets client-generated UUID + local timestamp
- Stored in local SQLite queue with sync priority flags
- Background sync service polls for network availability
- Exponential backoff on sync failure (1s, 2s, 4s, 8s, max 60s)

**Media Handling:**
- Photos/audio hashed (SHA-256) at capture time
- Hash stored alongside file for tamper detection
- Client-side compression (WebP 80% quality, max 1920px width)
- Upload to S3 with inspection ID as key prefix

**Voice Input:**
- On-device transcription (lightweight Whisper model) for instant feedback
- Server-side re-transcription (IndicASR) on sync for accuracy
- Language auto-detection (Hindi, Bengali, Odia, English)

#### 8.1.4 API Endpoints (Spring Boot)

**POST /api/v1/inspections/submit**
```java
@PostMapping("/submit")
@PreAuthorize("hasAuthority('WRITE_INSPECTION')")
public ResponseEntity<InspectionDTO> submitInspection(
    @Valid @RequestBody InspectionSubmitRequest request,
    @AuthenticationPrincipal UserDetails userDetails
) {
    // Validate geofence
    // Hash media
    // Store in DB
    // Add to audit ledger
    // Return DTO
}
```

**GET /api/v1/inspections/{id}**
```java
@GetMapping("/{id}")
@PreAuthorize("hasAuthority('READ_INSPECTION')")
public ResponseEntity<InspectionDetailDTO> getInspection(
    @PathVariable UUID id,
    @AuthenticationPrincipal UserDetails userDetails
) {
    // Check RBAC scope
    // Fetch from DB
    // Return DTO with media URLs
}
```

**POST /api/v1/inspections/batch-sync**
```java
@PostMapping("/batch-sync")
@PreAuthorize("hasAuthority('WRITE_INSPECTION')")
public ResponseEntity<BatchSyncResponse> syncBatch(
    @Valid @RequestBody List<InspectionSubmitRequest> requests,
    @AuthenticationPrincipal UserDetails userDetails
) {
    // Process batch (max 100 per request)
    // Detect conflicts
    // Return success/conflict/error per item
}
```

---

### 8.2 Sync & Conflict Resolution Service

#### 8.2.1 Purpose
Handle offline-to-online data synchronization with conflict detection and explicit resolution (never silent overwrites).

#### 8.2.2 Conflict Detection Strategy

**Conflict Scenarios:**
1. **Duplicate Submission:** Same inspection UUID submitted from two devices
2. **Geofence Mismatch:** Client says "valid", server re-validation says "invalid"
3. **Timestamp Anomaly:** Client timestamp significantly out of sync with server time
4. **Concurrent Edit:** Two users edit the same draft inspection offline

**Resolution Approach:**
- **Never last-write-wins** for compliance data
- Use **event sourcing:** append all conflicting events
- Flag conflict in database with `conflict_reason` field
- Surface to manager for manual reconciliation
- Preserve both versions with `conflict_group_id` linkage

#### 8.2.3 Data Model

```java
@Entity
@Table(name = "sync_conflicts")
public class SyncConflict {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "entity_type", nullable = false)
    private String entityType; // "inspection", "hazard", "attendance"
    
    @Column(name = "entity_id", nullable = false)
    private UUID entityId;
    
    @Column(name = "conflict_reason", nullable = false)
    private String conflictReason;
    
    @Column(name = "device_a_data", columnDefinition = "JSONB")
    private String deviceAData;
    
    @Column(name = "device_b_data", columnDefinition = "JSONB")
    private String deviceBData;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "resolution_status")
    private ConflictResolutionStatus status; // PENDING, RESOLVED, MERGED
    
    @ManyToOne
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
```

---

### 8.3 OCR / Document Digitization Module

#### 8.3.1 Purpose
Extract structured data from scanned legacy paper logbooks, shift handover records, and statutory certificates.

#### 8.3.2 Processing Pipeline

```
Mobile Camera Capture
    ↓
Deskew & Denoise (OpenCV)
    ↓
OCR Extraction (Tesseract 5 / TrOCR)
    ↓
Layout Understanding (LayoutLM fine-tuned on CIL forms)
    ↓
Structured Field Extraction with Confidence Scores
    ↓
[High Confidence (>85%)] → Auto-accept → Structured DB Record
[Low Confidence (<85%)] → Flag for Human Review → Review Queue
    ↓
Original Image Retained (S3) + Linked to Structured Record
```

#### 8.3.3 Document Types & Templates

| Document Type | Key Fields to Extract | Regulatory Reference |
|---------------|----------------------|----------------------|
| Shift Handover Log | Date, Shift, Supervisor, Incidents, Equipment Status | CMR 2017, Rule 25 |
| Statutory Certificate | Certificate Number, Issuer, Expiry Date, Scope | Mines Act 1952, Section 17 |
| Equipment Inspection Log | Equipment ID, Inspector, Findings, Next Service Due | DGMS Circular 02/2023 |
| Training Attendance | Training Type, Date, Attendees, Trainer Signature | CMR 2017, Rule 23 |

#### 8.3.4 API Endpoints

**POST /api/v1/documents/scan**
```java
@PostMapping("/scan")
@PreAuthorize("hasAuthority('WRITE_DOCUMENT')")
public ResponseEntity<DocumentScanResponse> scanDocument(
    @RequestParam("file") MultipartFile file,
    @RequestParam("documentType") DocumentType documentType,
    @AuthenticationPrincipal UserDetails userDetails
) {
    // Upload to S3
    // Trigger async OCR pipeline
    // Return job ID for status polling
}
```

**GET /api/v1/documents/ocr-review-queue**
```java
@GetMapping("/ocr-review-queue")
@PreAuthorize("hasAuthority('REVIEW_DOCUMENT')")
public ResponseEntity<Page<DocumentReviewDTO>> getReviewQueue(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "50") int size,
    @AuthenticationPrincipal UserDetails userDetails
) {
    // Fetch low-confidence extractions
    // Return paginated list
}
```

---

## 9. Data Model & Database Design

### 9.1 Core Entities (PostgreSQL Schema)

#### 9.1.1 Entity Relationship Diagram (High-Level)

```
┌─────────────┐        ┌──────────────┐        ┌─────────────┐
│    User     │◄───────┤ Inspection   │────────►│    Mine     │
└─────────────┘        └──────────────┘        └─────────────┘
      │                       │                        │
      │                       │                        │
      │                       ▼                        ▼
      │              ┌──────────────┐        ┌─────────────┐
      └──────────────┤ Violation    │        │ MineSection │
                     └──────────────┘        └─────────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ CorrectiveAction  │
                  └───────────────────┘
```

#### 9.1.2 Detailed Schema

**[SCHEMA CONTINUES - To be completed in next session]**

---

## 10. Mobile Application Architecture

### 10.1 Flutter Project Structure

```
lib/
├── core/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   ├── storage/         # SQLite, secure storage
│   ├── utils/
│   └── widgets/         # Reusable UI components
├── features/
│   ├── auth/
│   │   ├── data/        # OAuth2 repository
│   │   ├── domain/      # User entity, auth use cases
│   │   └── presentation/# Login screens, widgets
│   ├── inspection/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── hazard_reporting/
│   ├── attendance/
│   ├── document_scan/
│   ├── sync/
│   └── profile/
├── l10n/                # Localization (hi, bn, or, en)
└── main.dart
```

### 10.2 Offline Storage Strategy

**SQLite Tables (Local):**
- `inspections_queue` - Pending uploads
- `mines_cache` - Mine metadata + PostGIS polygons (WKT format)
- `users_cache` - User details for offline display
- `sync_log` - Sync history for debugging

**Secure Storage:**
- JWT tokens (encrypted)
- User credentials (if biometric enabled)

---

## 11. Web Portal Architecture

### 11.1 React + Next.js Structure

```
src/
├── app/              # Next.js 14 App Router
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx  # Main dashboard
│   │   ├── inspections/
│   │   ├── violations/
│   │   ├── contractors/
│   │   └── reports/
│   └── api/          # API route handlers (if needed)
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   └── maps/
├── lib/
│   ├── api-client.ts # Axios instance with interceptors
│   ├── auth.ts       # NextAuth config
│   └── utils.ts
├── hooks/
├── store/            # Redux Toolkit store
└── types/
```

---

## 12-20. [INCOMPLETE SECTIONS]

**The following sections are placeholders and need to be completed:**

12. Corporate Dashboard Architecture
13. API Design & Microservices (Detailed endpoint specs)
14. Security & Compliance (Deep dive)
15. Offline-First Architecture (Detailed sync algorithms)
16. AI/ML Components (Model architectures, training pipelines)
17. GIS & Spatial Intelligence (PostGIS query patterns)
18. Deployment Architecture (K8s manifests, Terraform scripts)
19. Implementation Phases (Detailed task breakdown)
20. Acceptance Criteria (Test cases per phase)

---

## APPENDIX A: Known Constraints

1. **No real historical incident/ML training data exists at project start** - Plan risk engine as rule-based first
2. **OCR accuracy depends on access to real legacy document samples** - This is a data-collection dependency
3. **Full Hyperledger/blockchain infrastructure is out of scope for MVP** - Hash-chained Postgres is the design
4. **Full 3D digital twin is explicitly out of scope** - 2D section-overlay is the intended fidelity level
5. **Integration with existing CIL ERP/HRMS systems** - API contracts need to be defined during Phase 1

---

## APPENDIX B: Next Steps for Document Completion

### Immediate Priorities:
1. ✅ Complete database schema with all tables and relationships
2. ✅ Document all REST API endpoints with request/response examples
3. ✅ Add Spring Boot project structure and package organization
4. ✅ Complete AI/ML model specifications with training data requirements
5. ✅ Add Kubernetes deployment manifests and Helm charts
6. ✅ Document integration patterns with external systems
7. ✅ Add comprehensive testing strategy (unit, integration, E2E)
8. ✅ Create deployment runbook with rollback procedures
9. ✅ Add performance benchmarks and load testing criteria
10. ✅ Document disaster recovery and backup strategies

### Phase-Specific TODOs:
- **Phase 0:** Detailed repo structure, CI/CD pipeline setup, auth scaffolding
- **Phase 1:** Complete inspection module API specs, mobile UI mockups, sync algorithm pseudocode
- **Phase 2:** Rule engine configuration format, escalation workflow state machine, GIS query patterns
- **Phase 3:** OCR pipeline containerization, IndicASR integration guide, TFLite model export process
- **Phase 4:** Contractor trust score formula, WhatsApp Business API integration, digital twin rendering approach
- **Phase 5:** Security testing checklist, penetration testing scope, pilot rollout playbook

---

## Document Version Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-08 | AI Assistant | Initial draft from PROJECT_BRIEF.md |
| 2.0 | 2026-09-08 | AI Assistant | Merged with website structure report, added Java backend architecture (INCOMPLETE) |

---

**END OF DOCUMENT (DRAFT)**

**Status:** 40% Complete - Core architecture, user roles, and module overview done. API specs, detailed UI designs, deployment guides, and testing strategies are pending.

**Resume Point:** Start with completing Section 9 (Data Model) with full table schemas, then proceed to Section 13 (API Design) with OpenAPI specifications.
