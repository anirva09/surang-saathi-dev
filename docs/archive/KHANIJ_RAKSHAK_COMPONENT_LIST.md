# Khanij Rakshak - Complete Component Development List
## Comprehensive Development Breakdown for Implementation

**Project:** AI-Based Smart Governance & Compliance Monitoring System for Coal Mines  
**Generated:** September 8, 2026  
**Purpose:** Complete list of all components to be developed across all tiers

---

## Overview

This document provides a comprehensive, categorized list of ALL components that need to be developed for the Khanij Rakshak platform, organized by technology stack and implementation phase.

---

## 🏗️ BACKEND COMPONENTS (Java/Spring Boot Microservices)

### 1. Core Backend Microservices (9 Services)

#### 1.1 Inspection Service
**Technology:** Spring Boot 3.2, Java 21, Spring Data JPA, PostgreSQL  
**Responsibilities:**
- Inspection CRUD operations
- Geo-fence validation (PostGIS queries)
- Inspection status workflow management
- Media attachment handling
- Inspection approval/rejection workflow
- Inspection history and audit trail

**Key Components:**
- `InspectionController.java` - REST API endpoints
- `InspectionService.java` - Business logic
- `InspectionRepository.java` - Data access layer
- `GeofenceValidator.java` - Spatial validation
- `InspectionDTO.java` - Data transfer objects
- `InspectionEntity.java` - JPA entity
- `InspectionMapper.java` - Entity ↔ DTO mapping

**API Endpoints:**
- `POST /api/v1/inspections/submit`
- `GET /api/v1/inspections/{id}`
- `GET /api/v1/inspections/mine/{mineId}`
- `PUT /api/v1/inspections/{id}/approve`
- `PUT /api/v1/inspections/{id}/reject`
- `GET /api/v1/inspections/search`
- `POST /api/v1/inspections/batch-sync`

---

#### 1.2 Compliance Engine Service
**Technology:** Spring Boot 3.2, Quartz Scheduler, Redis, PostgreSQL  
**Responsibilities:**
- Statutory rule management (DGMS, CPCB, MoEFCC)
- Violation tracking and state machine
- SLA monitoring and auto-escalation
- Corrective action workflow
- Compliance calendar generation
- PDF dossier generation (WeasyPrint/iText)

**Key Components:**
- `ComplianceController.java`
- `ViolationService.java`
- `CorrectiveActionService.java`
- `StatutoryRuleEngine.java`
- `EscalationScheduler.java` - Quartz job
- `SLAMonitorJob.java` - Cron job
- `DossierGeneratorService.java`
- `ViolationStateMachine.java` - State transitions

**API Endpoints:**
- `POST /api/v1/violations/create`
- `GET /api/v1/violations/{id}`
- `PUT /api/v1/violations/{id}/escalate`
- `POST /api/v1/corrective-actions/assign`
- `PUT /api/v1/corrective-actions/{id}/complete`
- `GET /api/v1/compliance/calendar`
- `POST /api/v1/compliance/dossier/generate`
- `GET /api/v1/statutory-rules`

---

#### 1.3 User & Role Service (Identity & Access Management)
**Technology:** Spring Boot 3.2, Spring Security, Keycloak Client, PostgreSQL  
**Responsibilities:**
- User CRUD operations
- Role and permission management
- RBAC enforcement
- User authentication integration with Keycloak
- Scope-based access control (mine/subsidiary/national)
- User profile management

**Key Components:**
- `UserController.java`
- `RoleController.java`
- `UserService.java`
- `RBACService.java` - Permission checking
- `KeycloakIntegrationService.java`
- `ScopeValidator.java`
- `PermissionEvaluator.java`

**API Endpoints:**
- `POST /api/v1/users`
- `GET /api/v1/users/{id}`
- `PUT /api/v1/users/{id}`
- `DELETE /api/v1/users/{id}`
- `GET /api/v1/users/search`
- `POST /api/v1/roles`
- `GET /api/v1/roles`
- `POST /api/v1/users/{id}/assign-role`
- `GET /api/v1/users/{id}/permissions`

---

#### 1.4 Notification Service
**Technology:** Spring Boot 3.2, RabbitMQ, Redis, Firebase Cloud Messaging  
**Responsibilities:**
- Push notifications (mobile)
- Email notifications (SMTP)
- SMS notifications (gateway integration)
- In-app notification management
- Notification templates
- Notification preferences per user
- Notification history

**Key Components:**
- `NotificationController.java`
- `NotificationService.java`
- `PushNotificationService.java` - FCM integration
- `EmailService.java` - SMTP client
- `SMSService.java` - SMS gateway integration
- `NotificationTemplateEngine.java`
- `NotificationQueueConsumer.java` - RabbitMQ listener

**API Endpoints:**
- `POST /api/v1/notifications/send`
- `GET /api/v1/notifications/user/{userId}`
- `PUT /api/v1/notifications/{id}/read`
- `GET /api/v1/notifications/preferences`
- `PUT /api/v1/notifications/preferences`

---

#### 1.5 Document Service
**Technology:** Spring Boot 3.2, MinIO/S3 Client, PostgreSQL  
**Responsibilities:**
- Document upload/download
- Document metadata management
- OCR processing queue management
- Document versioning
- Document search
- Access control for documents
- Document lifecycle (retention policies)

**Key Components:**
- `DocumentController.java`
- `DocumentService.java`
- `S3StorageService.java` - MinIO/S3 integration
- `DocumentMetadataRepository.java`
- `OCRQueueService.java` - Submit to OCR pipeline
- `DocumentSearchService.java` - Elasticsearch integration

**API Endpoints:**
- `POST /api/v1/documents/upload`
- `GET /api/v1/documents/{id}`
- `GET /api/v1/documents/{id}/download`
- `DELETE /api/v1/documents/{id}`
- `GET /api/v1/documents/search`
- `POST /api/v1/documents/{id}/submit-ocr`
- `GET /api/v1/documents/ocr-status/{jobId}`

---

#### 1.6 Audit Ledger Service
**Technology:** Spring Boot 3.2, PostgreSQL (Hash-chained tables)  
**Responsibilities:**
- Immutable audit log creation
- SHA-256 hash-chaining for tamper detection
- Ledger verification API
- Audit trail query interface
- Digital signature verification

**Key Components:**
- `AuditLedgerController.java`
- `AuditLedgerService.java`
- `HashChainService.java` - SHA-256 chaining logic
- `LedgerVerificationService.java`
- `DigitalSignatureService.java` - JKS + Bouncy Castle

**API Endpoints:**
- `POST /api/v1/audit/log`
- `GET /api/v1/audit/entity/{entityType}/{entityId}`
- `POST /api/v1/audit/verify-chain`
- `GET /api/v1/audit/search`

---

#### 1.7 Sync & Conflict Resolution Service
**Technology:** Spring Boot 3.2, Redis (queue), PostgreSQL  
**Responsibilities:**
- Batch sync from mobile clients
- Conflict detection (duplicate submissions, geofence mismatches)
- Conflict resolution workflow
- Event sourcing for offline events
- Sync status tracking

**Key Components:**
- `SyncController.java`
- `SyncService.java`
- `ConflictDetectionService.java`
- `ConflictResolutionService.java`
- `EventSourcingRepository.java`
- `SyncQueueProcessor.java`

**API Endpoints:**
- `POST /api/v1/sync/batch`
- `GET /api/v1/sync/status/{deviceId}`
- `GET /api/v1/sync/conflicts`
- `POST /api/v1/sync/conflicts/{id}/resolve`

---

#### 1.8 Contractor Service
**Technology:** Spring Boot 3.2, PostgreSQL  
**Responsibilities:**
- Contractor CRUD operations
- Trust score calculation
- Cross-mine blacklist management
- Contractor violation tracking
- Contractor document verification
- Wage payment compliance tracking

**Key Components:**
- `ContractorController.java`
- `ContractorService.java`
- `TrustScoreCalculator.java`
- `BlacklistService.java`
- `ContractorViolationService.java`

**API Endpoints:**
- `POST /api/v1/contractors`
- `GET /api/v1/contractors/{id}`
- `GET /api/v1/contractors/{id}/trust-score`
- `GET /api/v1/contractors/{id}/violations`
- `POST /api/v1/contractors/{id}/blacklist`
- `GET /api/v1/contractors/search`

---

#### 1.9 GIS & Spatial Service
**Technology:** Spring Boot 3.2, PostGIS, GeoTools  
**Responsibilities:**
- Mine boundary management
- Geo-fence validation
- Spatial queries (nearest mine, within boundary)
- GIS data export (GeoJSON, KML)
- Sensor location management
- Spatial analytics

**Key Components:**
- `GISController.java`
- `SpatialService.java`
- `GeofenceService.java`
- `MineGeometryRepository.java` - PostGIS queries
- `SpatialAnalyticsService.java`

**API Endpoints:**
- `GET /api/v1/gis/mine/{mineId}/boundary`
- `POST /api/v1/gis/validate-geofence`
- `GET /api/v1/gis/mines/nearby`
- `GET /api/v1/gis/export/{format}`
- `POST /api/v1/gis/mine/{mineId}/boundary`

---

### 2. Supporting Backend Components

#### 2.1 API Gateway
**Technology:** Spring Cloud Gateway 4.1  
**Responsibilities:**
- Request routing to microservices
- OAuth2 token validation
- Rate limiting per role
- CORS configuration
- Request/response logging
- API versioning

**Key Components:**
- `GatewayConfig.java`
- `AuthenticationFilter.java`
- `RateLimitFilter.java`
- `LoggingFilter.java`

---

#### 2.2 Service Discovery
**Technology:** Spring Cloud Eureka 4.1  
**Responsibilities:**
- Service registration
- Service health monitoring
- Load balancing

**Key Components:**
- `EurekaServerApplication.java`
- `application.yml` - Eureka config

---

#### 2.3 Config Server
**Technology:** Spring Cloud Config 4.1  
**Responsibilities:**
- Centralized configuration management
- Git-backed config storage
- Environment-specific configs

**Key Components:**
- `ConfigServerApplication.java`
- Git repository with config files

---

#### 2.4 Admin Console Service
**Technology:** Spring Boot 3.2, React Admin Dashboard  
**Responsibilities:**
- System health monitoring
- User management UI
- Configuration management UI
- Log viewer
- Database backup/restore triggers

**Key Components:**
- `AdminController.java`
- `SystemHealthService.java`
- `BackupService.java`

---

## 🤖 AI/ML COMPONENTS (Python/FastAPI Microservices)

### 3. ML Services (5 Services)

#### 3.1 Risk Scoring Engine
**Technology:** FastAPI, XGBoost, Scikit-learn, PostgreSQL  
**Responsibilities:**
- Mine Risk Index (MRI) calculation
- Explainable factor breakdown
- Historical trend analysis
- Risk forecasting (Phase 3 ML upgrade)

**Key Components:**
- `main.py` - FastAPI app
- `risk_scoring_service.py`
- `mri_calculator.py` - Rule-based scoring
- `mri_ml_model.py` - XGBoost model (Phase 3)
- `explainability_engine.py` - SHAP values
- `feature_engineering.py`

**API Endpoints:**
- `POST /ml/v1/risk/calculate`
- `GET /ml/v1/risk/mine/{mineId}`
- `GET /ml/v1/risk/factors/{mineId}`
- `POST /ml/v1/risk/forecast`

---

#### 3.2 OCR & Document Understanding Service
**Technology:** FastAPI, Tesseract, TrOCR, LayoutLM, OpenCV  
**Responsibilities:**
- Image preprocessing (deskew, denoise)
- OCR extraction
- Layout understanding
- Structured field extraction
- Confidence scoring

**Key Components:**
- `main.py`
- `ocr_service.py`
- `preprocessing.py` - OpenCV operations
- `tesseract_engine.py`
- `layoutlm_extractor.py` - Fine-tuned model
- `confidence_scorer.py`

**API Endpoints:**
- `POST /ml/v1/ocr/process`
- `GET /ml/v1/ocr/status/{jobId}`
- `POST /ml/v1/ocr/extract-fields`

---

#### 3.3 Speech-to-Text Service
**Technology:** FastAPI, AI4Bharat IndicASR, Whisper  
**Responsibilities:**
- Multilingual transcription (Hindi, Bengali, Odia, English)
- Mining vocabulary tuning
- Real-time transcription
- Batch transcription

**Key Components:**
- `main.py`
- `stt_service.py`
- `indic_asr_engine.py`
- `language_detector.py`
- `audio_preprocessor.py`

**API Endpoints:**
- `POST /ml/v1/stt/transcribe`
- `POST /ml/v1/stt/transcribe-batch`
- `GET /ml/v1/stt/status/{jobId}`

---

#### 3.4 Anomaly Detection Service
**Technology:** FastAPI, Scikit-learn (Isolation Forest), TimescaleDB  
**Responsibilities:**
- Sensor data anomaly detection (PM2.5, PM10, gas)
- Time-series anomaly detection
- Threshold breach alerts
- Pattern recognition

**Key Components:**
- `main.py`
- `anomaly_service.py`
- `isolation_forest_detector.py`
- `sensor_data_processor.py`
- `threshold_monitor.py`

**API Endpoints:**
- `POST /ml/v1/anomaly/detect`
- `GET /ml/v1/anomaly/mine/{mineId}`
- `POST /ml/v1/anomaly/train-model`

---

#### 3.5 On-Device Model Server
**Technology:** FastAPI, TensorFlow Lite, TorchServe  
**Responsibilities:**
- Serve TFLite models for mobile download
- Model versioning
- A/B testing for models
- Model performance tracking

**Key Components:**
- `main.py`
- `model_server.py`
- `tflite_converter.py`
- `model_registry.py`

**API Endpoints:**
- `GET /ml/v1/models/hazard-triage/latest`
- `GET /ml/v1/models/{modelId}/download`
- `POST /ml/v1/models/upload`

---

## 📱 MOBILE APPLICATION COMPONENTS (Flutter)

### 4. Mobile App (1 Application, Multiple Modules)

#### 4.1 Core App Structure
**Technology:** Flutter 3.x, Dart  
**Platform:** Android (priority), iOS (secondary)

---

#### 4.2 Feature Modules (8 Modules)

##### 4.2.1 Authentication Module
**Responsibilities:**
- OAuth2 login flow
- Biometric authentication (fingerprint/face ID)
- Token management (JWT)
- Session management
- Logout

**Key Components:**
- `auth/data/auth_repository.dart`
- `auth/domain/login_usecase.dart`
- `auth/presentation/login_screen.dart`
- `auth/presentation/biometric_auth_widget.dart`

---

##### 4.2.2 Inspection Module
**Responsibilities:**
- Create new inspections
- Select inspection type (safety/environmental/equipment)
- Dynamic form generation based on type
- Geo-fence validation
- Media capture (photo/audio)
- Voice input
- Offline queue management
- Inspection history

**Key Components:**
- `inspection/data/inspection_repository.dart`
- `inspection/data/local/inspection_local_db.dart` - SQLite
- `inspection/domain/inspection_entity.dart`
- `inspection/presentation/new_inspection_screen.dart`
- `inspection/presentation/inspection_form_widget.dart`
- `inspection/presentation/geofence_validator_widget.dart`
- `inspection/presentation/media_capture_widget.dart`
- `inspection/presentation/inspection_history_screen.dart`

---

##### 4.2.3 Hazard Reporting Module
**Responsibilities:**
- Quick hazard report
- Severity classification (manual + AI-suggested)
- Photo capture
- Voice note recording
- Location tagging
- Offline SMS alert for high-severity

**Key Components:**
- `hazard/data/hazard_repository.dart`
- `hazard/presentation/quick_report_screen.dart`
- `hazard/presentation/severity_selector_widget.dart`
- `hazard/presentation/hazard_list_screen.dart`

---

##### 4.2.4 Attendance Module
**Responsibilities:**
- Geo-fenced check-in/check-out
- Shift schedule display
- Attendance history

**Key Components:**
- `attendance/data/attendance_repository.dart`
- `attendance/presentation/checkin_screen.dart`
- `attendance/presentation/attendance_history_screen.dart`

---

##### 4.2.5 Document Scanning Module (OCR)
**Responsibilities:**
- Camera capture
- Image cropping and deskewing
- Submit to OCR service
- View extraction results
- Scan history

**Key Components:**
- `document_scan/data/document_repository.dart`
- `document_scan/presentation/camera_capture_screen.dart`
- `document_scan/presentation/crop_preview_screen.dart`
- `document_scan/presentation/scan_history_screen.dart`

---

##### 4.2.6 Corrective Actions Module
**Responsibilities:**
- View assigned corrective actions
- Upload proof of completion
- Mark as resolved
- Track status

**Key Components:**
- `corrective_action/data/corrective_action_repository.dart`
- `corrective_action/presentation/action_list_screen.dart`
- `corrective_action/presentation/action_detail_screen.dart`
- `corrective_action/presentation/proof_upload_widget.dart`

---

##### 4.2.7 Sync Center Module
**Responsibilities:**
- Display queued items
- Manual sync trigger
- Sync status indicator
- Conflict resolution UI
- Sync history

**Key Components:**
- `sync/data/sync_repository.dart`
- `sync/domain/sync_service.dart`
- `sync/presentation/sync_center_screen.dart`
- `sync/presentation/conflict_resolver_screen.dart`
- `sync/presentation/sync_status_widget.dart`

---

##### 4.2.8 Profile & Settings Module
**Responsibilities:**
- User profile display
- Language selection
- Offline data management (clear cache)
- App version info
- Help & support

**Key Components:**
- `profile/presentation/profile_screen.dart`
- `profile/presentation/settings_screen.dart`
- `profile/presentation/language_selector_widget.dart`

---

#### 4.3 Core Services & Utilities

##### 4.3.1 Local Database Service
**Technology:** SQLite (sqflite package)
**Responsibilities:**
- Offline data storage
- Sync queue management
- Cached reference data

**Key Components:**
- `core/storage/database_helper.dart`
- `core/storage/inspection_dao.dart`
- `core/storage/sync_queue_dao.dart`

---

##### 4.3.2 Network Service
**Technology:** Dio (HTTP client)
**Responsibilities:**
- API calls to backend
- Token injection
- Response handling
- Retry logic

**Key Components:**
- `core/network/api_client.dart`
- `core/network/interceptors.dart`

---

##### 4.3.3 Location Service
**Technology:** geolocator package
**Responsibilities:**
- GPS coordinate retrieval
- Geo-fence validation (local)
- Location permission handling

**Key Components:**
- `core/services/location_service.dart`
- `core/services/geofence_service.dart`

---

##### 4.3.4 Media Service
**Technology:** image_picker, camera packages
**Responsibilities:**
- Photo capture
- Audio recording
- Media compression
- SHA-256 hashing

**Key Components:**
- `core/services/media_service.dart`
- `core/services/hash_service.dart`

---

##### 4.3.5 Voice Input Service
**Technology:** speech_to_text package
**Responsibilities:**
- Voice recording
- On-device transcription
- Language detection

**Key Components:**
- `core/services/voice_service.dart`

---

##### 4.3.6 Background Sync Service
**Technology:** workmanager package
**Responsibilities:**
- Background sync scheduling
- Network detection
- Battery-aware sync

**Key Components:**
- `core/services/background_sync_service.dart`

---

## 🌐 WEB PORTAL COMPONENTS (React/Next.js)

### 5. Web Portal (Next.js Application)

#### 5.1 Core Application Structure
**Technology:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS

---

#### 5.2 Page Components (11 Main Pages)

##### 5.2.1 Authentication Pages
- `app/(auth)/login/page.tsx` - Login form
- `app/(auth)/logout/page.tsx` - Logout handler
- `app/(auth)/forgot-password/page.tsx`

---

##### 5.2.2 Dashboard Page
- `app/(dashboard)/page.tsx` - Main dashboard (role-aware)
- `components/dashboard/ComplianceOverviewWidget.tsx`
- `components/dashboard/MRICard.tsx`
- `components/dashboard/OverdueItemsList.tsx`
- `components/dashboard/TrendCharts.tsx`

---

##### 5.2.3 Inspections Pages
- `app/(dashboard)/inspections/page.tsx` - Inspection list (filterable table)
- `app/(dashboard)/inspections/[id]/page.tsx` - Inspection detail view
- `components/inspections/InspectionTable.tsx`
- `components/inspections/InspectionFilters.tsx`
- `components/inspections/MediaGallery.tsx`
- `components/inspections/GeofenceProofMap.tsx`

---

##### 5.2.4 Violations & Escalations Pages
- `app/(dashboard)/violations/page.tsx` - Active violations list
- `app/(dashboard)/violations/[id]/page.tsx` - Violation detail
- `app/(dashboard)/escalations/page.tsx` - Escalation queue
- `components/violations/ViolationStateMachine.tsx`
- `components/violations/SLACountdown.tsx`
- `components/violations/EscalationTimeline.tsx`

---

##### 5.2.5 Corrective Actions Pages
- `app/(dashboard)/corrective-actions/page.tsx` - Actions list
- `app/(dashboard)/corrective-actions/[id]/page.tsx` - Action detail
- `components/corrective-actions/ApprovalWorkflow.tsx`
- `components/corrective-actions/ProofViewer.tsx`

---

##### 5.2.6 Contractors Pages
- `app/(dashboard)/contractors/page.tsx` - Contractor directory
- `app/(dashboard)/contractors/[id]/page.tsx` - Contractor profile
- `components/contractors/TrustScoreCard.tsx`
- `components/contractors/ViolationHistory.tsx`
- `components/contractors/BlacklistBadge.tsx`
- `components/contractors/CrossMineActivity.tsx`

---

##### 5.2.7 GIS Map Page
- `app/(dashboard)/gis/page.tsx` - Interactive map
- `components/gis/LeafletMap.tsx`
- `components/gis/MineBoundaryLayer.tsx`
- `components/gis/HazardMarkers.tsx`
- `components/gis/SensorPins.tsx`
- `components/gis/MRIHeatmap.tsx`
- `components/gis/LayerToggle.tsx`

---

##### 5.2.8 Statutory Calendar Page
- `app/(dashboard)/statutory/calendar/page.tsx`
- `components/statutory/ComplianceCalendar.tsx`
- `components/statutory/DeadlineAlerts.tsx`
- `components/statutory/DossierGenerator.tsx`

---

##### 5.2.9 Document Digitization Pages
- `app/(dashboard)/documents/page.tsx` - Document library
- `app/(dashboard)/documents/ocr-queue/page.tsx` - OCR review queue
- `components/documents/DocumentTable.tsx`
- `components/documents/OCRReviewCard.tsx`
- `components/documents/ConfidenceScoreIndicator.tsx`
- `components/documents/FieldCorrector.tsx`

---

##### 5.2.10 Reports Page
- `app/(dashboard)/reports/page.tsx`
- `components/reports/ReportBuilder.tsx`
- `components/reports/PrebuiltReports.tsx`
- `components/reports/ExportOptions.tsx`

---

##### 5.2.11 Admin Pages
- `app/(dashboard)/admin/users/page.tsx` - User management
- `app/(dashboard)/admin/roles/page.tsx` - Role management
- `app/(dashboard)/admin/system/page.tsx` - System settings
- `components/admin/UserTable.tsx`
- `components/admin/RolePermissionEditor.tsx`

---

#### 5.3 Shared UI Components (shadcn/ui + Custom)

##### 5.3.1 UI Components
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/table.tsx`
- `components/ui/dialog.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/input.tsx`
- `components/ui/select.tsx`
- `components/ui/toast.tsx`
- `components/ui/badge.tsx`
- `components/ui/progress.tsx`
- `components/ui/tabs.tsx`
- `components/ui/calendar.tsx`

##### 5.3.2 Form Components
- `components/forms/InspectionApprovalForm.tsx`
- `components/forms/CorrectiveActionAssignmentForm.tsx`
- `components/forms/ContractorRegistrationForm.tsx`
- `components/forms/UserCreateForm.tsx`

##### 5.3.3 Chart Components
- `components/charts/MRITrendChart.tsx` (Recharts)
- `components/charts/ComplianceBarChart.tsx`
- `components/charts/IncidentHeatmap.tsx`
- `components/charts/ContractorPerformanceChart.tsx`

##### 5.3.4 Layout Components
- `components/layout/Header.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/Breadcrumb.tsx`
- `components/layout/Footer.tsx`

---

#### 5.4 State Management & API Layer

##### 5.4.1 Redux Store
**Technology:** Redux Toolkit
- `store/store.ts` - Store configuration
- `store/slices/authSlice.ts`
- `store/slices/inspectionSlice.ts`
- `store/slices/violationSlice.ts`
- `store/slices/contractorSlice.ts`
- `store/slices/notificationSlice.ts`

##### 5.4.2 API Client
- `lib/api-client.ts` - Axios instance
- `lib/api/inspections.ts` - Inspection APIs
- `lib/api/violations.ts`
- `lib/api/contractors.ts`
- `lib/api/users.ts`
- `lib/api/documents.ts`

##### 5.4.3 Hooks
- `hooks/useAuth.ts`
- `hooks/useInspections.ts`
- `hooks/useViolations.ts`
- `hooks/useRBAC.ts` - Permission checking
- `hooks/useToast.ts`

---

## 📊 CORPORATE DASHBOARD COMPONENTS (React/Next.js)

### 6. Corporate Dashboard (Separate Next.js App)

#### 6.1 Dashboard Pages (5 Main Pages)

##### 6.1.1 National Overview Page
- `app/national-overview/page.tsx`
- `components/national/AggregateKPICards.tsx`
- `components/national/IndiaHeatmap.tsx`
- `components/national/SafetyTrendChart.tsx`
- `components/national/SubsidiaryComparison.tsx`

##### 6.1.2 GIS National Map Page
- `app/gis-national/page.tsx`
- `components/gis/NationalCoalfieldMap.tsx`
- `components/gis/RiskOverlayLayer.tsx`

##### 6.1.3 Policy Analytics Page
- `app/policy-analytics/page.tsx`
- `components/policy/RegulationAdherenceChart.tsx`
- `components/policy/TrendAnalysis.tsx`
- `components/policy/ImpactAssessment.tsx`

##### 6.1.4 Audit Dossier Access Page
- `app/audit-dossiers/page.tsx`
- `components/audit/DossierTable.tsx`
- `components/audit/HashChainVerifier.tsx`
- `components/audit/DigitalSignatureChecker.tsx`

##### 6.1.5 Predictive Insights Page (Phase 3)
- `app/predictive-insights/page.tsx`
- `components/insights/DowntimeIncidentCorrelation.tsx`
- `components/insights/MRIForecast.tsx`

---

## 🏪 CONTRACTOR PORTAL COMPONENTS (React)

### 7. Contractor Portal (Lightweight React SPA)

#### 7.1 Pages (4 Pages)
- `src/pages/Login.tsx`
- `src/pages/Dashboard.tsx`
  - Trust score display
  - Active assignments
- `src/pages/DocumentSubmission.tsx`
  - License upload
  - Safety certificate upload
- `src/pages/FlaggedIssues.tsx`
  - Violation list
  - Response form

---

## 🗄️ DATABASE COMPONENTS

### 8. Database Schema & Scripts

#### 8.1 PostgreSQL Schema Files
- `db/migrations/V001__create_users_tables.sql` (Flyway)
- `db/migrations/V002__create_mines_tables.sql`
- `db/migrations/V003__create_inspections_tables.sql`
- `db/migrations/V004__create_violations_tables.sql`
- `db/migrations/V005__create_contractors_tables.sql`
- `db/migrations/V006__create_audit_ledger_tables.sql`
- `db/migrations/V007__create_documents_tables.sql`
- `db/migrations/V008__create_gis_tables.sql`
- `db/migrations/V009__create_indexes.sql`
- `db/migrations/V010__create_views.sql`

#### 8.2 Seed Data Scripts
- `db/seeds/S001__seed_roles_permissions.sql`
- `db/seeds/S002__seed_statutory_rules.sql`
- `db/seeds/S003__seed_mines_demo_data.sql`

#### 8.3 PostGIS Functions
- `db/functions/F001__geofence_validation.sql`
- `db/functions/F002__nearest_mine.sql`

---

## ☁️ INFRASTRUCTURE COMPONENTS

### 9. DevOps & Infrastructure

#### 9.1 Kubernetes Manifests
- `k8s/namespaces/khanij-rakshak-prod.yaml`
- `k8s/deployments/inspection-service.yaml`
- `k8s/deployments/compliance-engine.yaml`
- `k8s/deployments/user-service.yaml`
- `k8s/deployments/notification-service.yaml`
- `k8s/deployments/document-service.yaml`
- `k8s/deployments/audit-ledger-service.yaml`
- `k8s/deployments/sync-service.yaml`
- `k8s/deployments/contractor-service.yaml`
- `k8s/deployments/gis-service.yaml`
- `k8s/deployments/api-gateway.yaml`
- `k8s/services/` - Service definitions
- `k8s/ingress/nginx-ingress.yaml`
- `k8s/configmaps/` - Config files
- `k8s/secrets/` - Sealed secrets

#### 9.2 Helm Charts
- `helm/khanij-rakshak/Chart.yaml`
- `helm/khanij-rakshak/values.yaml`
- `helm/khanij-rakshak/templates/` - K8s templates

#### 9.3 Terraform Scripts
- `terraform/main.tf`
- `terraform/vpc.tf` - Network setup
- `terraform/kubernetes-cluster.tf`
- `terraform/postgresql.tf` - RDS/managed DB
- `terraform/redis.tf`
- `terraform/s3.tf` - Object storage
- `terraform/monitoring.tf` - Prometheus, Grafana

#### 9.4 Ansible Playbooks
- `ansible/postgres-setup.yml`
- `ansible/keycloak-setup.yml`
- `ansible/monitoring-setup.yml`

#### 9.5 CI/CD Pipelines
- `Jenkinsfile` - Main pipeline
- `.gitlab-ci.yml` - Alternative GitLab CI
- `docker-compose.yml` - Local development
- `Dockerfile.inspection-service`
- `Dockerfile.compliance-engine`
- `Dockerfile.mobile-app-builder`
- `Dockerfile.web-portal`

---

## 📡 MONITORING & OBSERVABILITY COMPONENTS

### 10. Monitoring Stack

#### 10.1 Prometheus Configuration
- `monitoring/prometheus/prometheus.yml`
- `monitoring/prometheus/alert-rules.yml`

#### 10.2 Grafana Dashboards
- `monitoring/grafana/dashboards/microservices-health.json`
- `monitoring/grafana/dashboards/database-performance.json`
- `monitoring/grafana/dashboards/api-metrics.json`
- `monitoring/grafana/dashboards/business-kpis.json`

#### 10.3 ELK Stack Configuration
- `monitoring/logstash/logstash.conf`
- `monitoring/elasticsearch/index-templates.json`
- `monitoring/kibana/dashboards/` - Pre-built dashboards

#### 10.4 APM Configuration
- `monitoring/apm/elastic-apm.yml`

---

## 🔐 SECURITY COMPONENTS

### 11. Security & Identity

#### 11.1 Keycloak Configuration
- `keycloak/realm-config.json` - Realm export
- `keycloak/client-configs/` - OAuth2 client configs
- `keycloak/user-federation/` - LDAP integration (if needed)

#### 11.2 TLS/SSL Certificates
- `certs/generate-certs.sh` - Let's Encrypt script
- `certs/cert-manager.yaml` - K8s cert-manager config

#### 11.3 Security Scanning
- `.github/workflows/security-scan.yml`
- `trivy-config.yaml` - Container scanning
- `owasp-dependency-check-config.xml`

---

## 🧪 TESTING COMPONENTS

### 12. Test Suites

#### 12.1 Backend Unit Tests (Java)
- `InspectionServiceTest.java`
- `ComplianceEngineTest.java`
- `GeofenceValidatorTest.java`
- `HashChainServiceTest.java`
- `TrustScoreCalculatorTest.java`

#### 12.2 Backend Integration Tests
- `InspectionAPIIntegrationTest.java` - TestContainers
- `SyncServiceIntegrationTest.java`
- `PostgresIntegrationTest.java`

#### 12.3 Mobile App Tests (Flutter)
- `test/unit/inspection_test.dart`
- `test/unit/sync_service_test.dart`
- `test/widget/login_screen_test.dart`
- `test/integration/offline_sync_test.dart`

#### 12.4 Web Portal Tests (React)
- `__tests__/components/InspectionTable.test.tsx` - Jest + RTL
- `__tests__/pages/Dashboard.test.tsx`
- `cypress/e2e/inspection-workflow.cy.ts` - E2E tests

#### 12.5 Load Testing
- `load-tests/jmeter/inspection-api-load-test.jmx`
- `load-tests/gatling/MineRiskCalculation.scala`

---

## 📚 DOCUMENTATION COMPONENTS

### 13. Documentation

#### 13.1 API Documentation
- `openapi/inspection-service.yaml` - OpenAPI 3.0 spec
- `openapi/compliance-engine.yaml`
- `openapi/contractor-service.yaml`
- Swagger UI (auto-generated)

#### 13.2 Developer Documentation
- `docs/SETUP.md` - Local development setup
- `docs/ARCHITECTURE.md` - System architecture
- `docs/API_REFERENCE.md` - API guide
- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/TROUBLESHOOTING.md`

#### 13.3 User Documentation
- `docs/user-guides/field-worker-guide.md`
- `docs/user-guides/manager-guide.md`
- `docs/user-guides/admin-guide.md`
- Video tutorials (to be created)

#### 13.4 Training Materials
- `training/field-worker-training.pptx`
- `training/manager-training.pptx`
- `training/video-scripts/` - Training video scripts

---

## 🔧 UTILITY & SUPPORT COMPONENTS

### 14. Utilities

#### 14.1 Data Migration Tools
- `tools/data-migration/legacy-csv-importer.py`
- `tools/data-migration/excel-to-db.py`

#### 14.2 Admin Scripts
- `scripts/create-admin-user.sh`
- `scripts/backup-database.sh`
- `scripts/restore-database.sh`
- `scripts/generate-reports.py`

#### 14.3 Development Tools
- `tools/mock-data-generator/` - Generate test data
- `tools/geofence-visualizer/` - Visualize mine boundaries
- `tools/hash-chain-verifier/` - Standalone verifier

---

## 📦 SUMMARY BY TECHNOLOGY

### Total Component Count: ~250+ Components

| Category | Count | Technology |
|----------|-------|------------|
| **Backend Microservices** | 9 | Java/Spring Boot |
| **ML Services** | 5 | Python/FastAPI |
| **Mobile App Modules** | 8 | Flutter/Dart |
| **Web Portal Pages** | 11 | React/Next.js |
| **Corporate Dashboard Pages** | 5 | React/Next.js |
| **Contractor Portal Pages** | 4 | React |
| **Shared UI Components** | 30+ | React |
| **Database Migrations** | 20+ | SQL |
| **Kubernetes Manifests** | 25+ | YAML |
| **Infrastructure Scripts** | 15+ | Terraform/Ansible |
| **Monitoring Configs** | 10+ | Prometheus/Grafana |
| **Test Suites** | 50+ | JUnit/Jest/Cypress |
| **Documentation Files** | 20+ | Markdown |

---

## 🎯 DEVELOPMENT PRIORITY ORDER

### Phase 0: Foundation (4 weeks)
1. Database schema + migrations
2. API Gateway
3. Service Discovery + Config Server
4. Keycloak setup
5. Basic Spring Boot service template

### Phase 1: Core MVP (12 weeks)
1. Inspection Service (backend + mobile + web)
2. User & Role Service
3. Sync Service
4. Audit Ledger Service
5. Basic notification service
6. Mobile app (inspection module only)
7. Web portal (inspection list + detail)

### Phase 2: Compliance Automation (8 weeks)
1. Compliance Engine Service
2. GIS Service
3. Statutory workflows
4. PDF dossier generation
5. Web portal (compliance pages)

### Phase 3: AI/ML (10 weeks)
1. Risk Scoring Engine (rule-based first)
2. OCR Service
3. Speech-to-Text Service
4. Document scanning (mobile + web)
5. Anomaly Detection Service

### Phase 4: Contractor & Analytics (6 weeks)
1. Contractor Service
2. Contractor Portal
3. Corporate Dashboard
4. Advanced analytics

### Phase 5: Hardening (6 weeks)
1. Security testing
2. Load testing
3. Documentation
4. Training materials
5. Deployment automation

---

## 📂 REPOSITORY STRUCTURE RECOMMENDATION

```
khanij-rakshak/
├── backend/
│   ├── api-gateway/
│   ├── service-discovery/
│   ├── config-server/
│   ├── inspection-service/
│   ├── compliance-engine/
│   ├── user-service/
│   ├── notification-service/
│   ├── document-service/
│   ├── audit-ledger-service/
│   ├── sync-service/
│   ├── contractor-service/
│   └── gis-service/
├── ml-services/
│   ├── risk-scoring/
│   ├── ocr-service/
│   ├── speech-to-text/
│   ├── anomaly-detection/
│   └── model-server/
├── mobile-app/
│   └── khanij_rakshak/
├── web-portal/
│   └── khanij-rakshak-web/
├── corporate-dashboard/
│   └── khanij-rakshak-corporate/
├── contractor-portal/
│   └── khanij-rakshak-contractor/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── functions/
├── infrastructure/
│   ├── k8s/
│   ├── helm/
│   ├── terraform/
│   └── ansible/
├── monitoring/
│   ├── prometheus/
│   ├── grafana/
│   └── elk/
├── docs/
├── tests/
└── tools/
```

---

**END OF COMPONENT LIST**

This comprehensive list covers all components required to build the complete Khanij Rakshak platform. Use this as a master checklist for development planning, resource allocation, and project tracking.
