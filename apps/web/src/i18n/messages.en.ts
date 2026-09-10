/**
 * English messages — the default and the source of truth for keys.
 *
 * `messages.hi.ts` must declare exactly these keys; the type in
 * `LanguageProvider` enforces it at compile time, so a missing Hindi string is
 * a build error rather than an English word leaking into a Hindi page.
 *
 * Not translated anywhere: hazard/action/audit IDs, hashes, coordinates,
 * timestamps, and proper names (M. Sharma, Demo Mine 03, Jharia Area).
 */
export const en = {
  // ── Government utility strip ───────────────────────────────────────
  "gov.country": "Government of India",
  "gov.ministry": "Ministry of Coal",
  "gov.skip": "Skip to main content",

  // ── Accessibility + language controls ──────────────────────────────
  "a11y.textSize": "Text size",
  "a11y.textSmaller": "Smaller text size",
  "a11y.textDefault": "Default text size",
  "a11y.textLarger": "Larger text size",
  "lang.group": "Interface language",
  "lang.english": "English",
  "lang.hindi": "हिन्दी",
  "lang.switchToEnglish": "Switch interface to English",
  "lang.switchToHindi": "Switch interface to Hindi",

  // ── Prototype notice ───────────────────────────────────────────────
  "proto.title": "SIH 2026 prototype.",
  "proto.body":
    "Surang Saathi is a student project and is not an official Government of India service. All figures shown are illustrative demonstration data.",

  // ── Brand ──────────────────────────────────────────────────────────
  "brand.name": "Surang Saathi",
  "brand.tagline": "Safer Mines. Stronger Tomorrow.",
  "brand.descriptor": "Smart Mine Safety & Compliance Platform",
  "brand.home": "Surang Saathi — home",

  // ── Public navigation ──────────────────────────────────────────────
  "nav.primary": "Primary",
  "nav.footer": "Footer",
  "nav.home": "Home",
  "nav.about": "About",
  "nav.features": "Features",
  "nav.fieldTeams": "For Field Teams",
  "nav.managers": "For Managers",
  "nav.resources": "Resources",
  "nav.contact": "Contact",
  "nav.menu": "Menu",
  "nav.close": "Close",
  "nav.openMenu": "Menu",
  "nav.closeMenu": "Close menu",
  "nav.login": "Login to Portal",
  "nav.loginShort": "Login",

  // ── Hero ───────────────────────────────────────────────────────────
  "hero.eyebrow": "A digital platform for safer mines",
  "hero.headlineLead": "Empowering People.",
  "hero.headlineAccent": "Safer Mines. Stronger Tomorrow.",
  "hero.body":
    "Surang Saathi is a unified digital platform for mine safety: field teams record hazards and inspections even with no network, evidence is verified server-side, corrective actions carry a named owner and a deadline, and every step is written to an append-only audit record.",
  "hero.getStarted": "Get Started",
  "hero.knowMore": "Know More",
  "hero.imageAlt":
    "A mine safety officer in high-visibility clothing and a helmet recording an inspection on a tablet at an opencast mine.",
  "hero.placeholder": "Placeholder image",
  "hero.panelLine1": "Safer Mines",
  "hero.panelLine2": "Stronger India",
  "hero.pillarPeople": "People",
  "hero.pillarSafety": "Safety",
  "hero.pillarAccountability": "Accountability",
  "hero.pillarSustainability": "Sustainability",

  // ── Statistics ─────────────────────────────────────────────────────
  "stats.heading": "Platform statistics — illustrative prototype figures",
  "stats.disclaimer": "Illustrative prototype figures — not live data",
  "stats.inspections": "Inspections Recorded",
  "stats.hazards": "Hazards Identified",
  "stats.users": "Field Users",
  "stats.resolved": "Issues Resolved",

  // ── Key features ───────────────────────────────────────────────────
  "features.heading": "Key Features",
  "features.exploreAll": "Explore All Features",
  "features.inspections.title": "Digital Inspections",
  "features.inspections.body":
    "Capture hazards, evidence and observations on the go — including with no network underground.",
  "features.analytics.title": "Safety Analytics",
  "features.analytics.body":
    "Track safety performance across sites with an explainable, rule-based risk index.",
  "features.accountability.title": "Accountability",
  "features.accountability.body":
    "Every corrective action carries a named owner, a deadline and an escalation path.",
  "features.evidence.title": "Geo-verified Evidence",
  "features.evidence.body":
    "Photos, location and time stamps verified server-side for every inspection.",
  "features.compliance.title": "Regulatory Compliance",
  "features.compliance.body":
    "Statutory obligations, due dates and the evidence dossier that closes them.",

  // ── Credibility band ───────────────────────────────────────────────
  "band.heading": "About Surang Saathi",
  "band.quote": "Technology for safer mines and stronger accountability.",
  "band.attribution": "Surang Saathi project statement",
  "band.cta": "Learn More",
  "band.imageAlt":
    "A wide view of an opencast coal mine with terraced benches and haul roads.",

  // ── Footer ─────────────────────────────────────────────────────────
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Use",
  "footer.help": "Help",
  "footer.sihBadge": "SIH 2026",
  "footer.sihSub": "Student prototype",
  "footer.youtube": "Project channel on YouTube",
  "footer.linkedin": "Project page on LinkedIn",
  "footer.disclaimerTitle": "Prototype disclaimer.",
  "footer.disclaimer":
    "Surang Saathi is a Smart India Hackathon 2026 student prototype. It is not an official Government of India, Ministry of Coal, Coal India or DGMS service and carries no government endorsement. All figures shown are illustrative demonstration data.",
  "footer.domainNote":
    "Built for the Ministry of Coal problem domain; not affiliated with or endorsed by it.",

  // ── Not found ──────────────────────────────────────────────────────
  "notfound.title": "This page is not built yet",
  "notfound.body1":
    "This build covers the public homepage and the manager safety dashboard. The About, For Field Teams, For Managers and Resources pages — along with the hazard register, corrective actions, risk and audit ledger screens — are on the roadmap and are not implemented yet.",
  "notfound.body2":
    "The link you followed points at the route this page will occupy, so nothing here is a decorative button — it simply has not been built yet.",
  "notfound.home": "Return to the homepage",
  "notfound.dashboard": "Open the safety dashboard",

  // ── Signed-in workspace navigation ─────────────────────────────────
  "work.nav": "Workspace",
  "work.nav.dashboard": "Dashboard",
  "work.nav.hazards": "Hazards",
  "work.nav.risk": "Risk",
  "work.nav.audit": "Audit",
  "work.backToSite": "Back to the public site",

  // ── Error and empty states ─────────────────────────────────────────
  "state.error.unreachable.title": "The safety API could not be reached",
  "state.error.unreachable.body":
    "This screen reads live data from the Surang Saathi API. The API did not answer, so there is nothing to show. No demonstration data is substituted — a blank figure is more honest than an invented one.",
  "state.error.unreachable.hint":
    "Start the backend with docker compose up, then reload this page.",
  "state.error.notFound.title": "This record does not exist",
  "state.error.notFound.body":
    "The API reported that the record you asked for is not in the register.",
  "state.error.conflict.title": "This change is not allowed right now",
  "state.error.conflict.body":
    "The record's current state forbids the action you attempted. Reload to see where it stands now.",
  "state.error.validation.title": "The submission was rejected",
  "state.error.validation.body":
    "The API rejected the values sent. Each field's own message is shown beside it.",
  "state.error.generic.title": "This data could not be loaded",
  "state.error.generic.body":
    "The API answered with an error. The code it returned is shown below so the failure can be traced.",
  "state.error.codeLabel": "Error code",
  "state.error.statusLabel": "HTTP status",
  "state.error.messageLabel": "Reported message",
  "state.error.retry": "Reload this page",
  "state.empty.title": "Nothing to show",
  "state.empty.hazards":
    "No hazard in the register matches the current filters.",
  "state.empty.audit": "The audit ledger has no events yet.",
  "state.empty.evidence": "No evidence has been attached to this hazard.",
  "state.empty.actions":
    "No corrective action has been raised against this hazard.",
  "state.loading": "Loading live data…",

  // ── Shared domain vocabulary ───────────────────────────────────────
  "domain.severity": "Severity",
  "domain.severity.LOW": "Low",
  "domain.severity.MEDIUM": "Medium",
  "domain.severity.HIGH": "High",
  "domain.status": "Status",
  "domain.status.OPEN": "Open",
  "domain.status.ACKNOWLEDGED": "Acknowledged",
  "domain.status.OVERDUE": "Overdue",
  "domain.status.ESCALATED": "Escalated",
  "domain.status.RESOLVED": "Resolved",
  "domain.sync": "Sync",
  "domain.sync.QUEUED": "Queued",
  "domain.sync.SYNCING": "Syncing",
  "domain.sync.SYNCED": "Synced",
  "domain.sync.CONFLICT": "Sync conflict",
  "domain.sync.OFFLINE": "Offline",
  "domain.geofence": "Location proof",
  "domain.geofence.LOCAL_VALID": "Valid on device",
  "domain.geofence.SERVER_PENDING": "Awaiting server check",
  "domain.geofence.SERVER_VERIFIED": "Verified by server",
  "domain.geofence.OUTSIDE_GEOFENCE": "Outside mine boundary",
  "domain.geofence.CONFLICT": "Location conflict",
  "domain.reportedBy": "Reported by",
  "domain.assignedTo": "Owner",
  "domain.unassigned": "Unassigned",
  "domain.location": "Location",
  "domain.capturedAt": "Captured",
  "domain.syncedAt": "Synced",
  "domain.dueAt": "Due",
  "domain.mine": "Mine",
  "domain.area": "Area",
  "domain.evidenceCount": "Evidence",
  "domain.actionCount": "Actions",

  // ── Manager dashboard ──────────────────────────────────────────────
  "dash.title": "Safety Dashboard",
  "dash.subtitle":
    "What is unsafe, what is overdue, who owns it, and what needs action now — for {mine}.",
  "dash.asOf": "Live data as of {timestamp}",
  "dash.kpi.heading": "Current safety position",
  "dash.kpi.openHazards": "Open hazards",
  "dash.kpi.openHazards.help": "Reported and not yet resolved",
  "dash.kpi.highRiskHazards": "High-severity hazards",
  "dash.kpi.highRiskHazards.help": "Open and rated HIGH",
  "dash.kpi.overdueCorrectiveActions": "Overdue actions",
  "dash.kpi.overdueCorrectiveActions.help": "Past their deadline, unresolved",
  "dash.kpi.conflictedHazards": "Evidence conflicts",
  "dash.kpi.conflictedHazards.help": "Sync or location proof disputed",
  "dash.risk.heading": "Mine risk index",
  "dash.risk.none":
    "No risk snapshot has been calculated for this mine yet. Run a recalculation on the risk screen to create the first one.",
  "dash.risk.factors": "Contributing factors",
  "dash.risk.weight": "Weight",
  "dash.risk.currentValue": "Current value",
  "dash.risk.open": "Open the risk breakdown",
  "dash.next.heading": "Where to act",
  "dash.next.hazards": "Review the hazard register",
  "dash.next.hazards.help":
    "Every reported hazard with its owner, deadline and evidence state.",
  "dash.next.risk": "Examine the risk index",
  "dash.next.risk.help":
    "How each factor contributes to the score, and recalculate it.",
  "dash.next.audit": "Verify the audit ledger",
  "dash.next.audit.help":
    "The append-only record of every change, and its hash-chain verdict.",

  // ── Hazard register ────────────────────────────────────────────────
  "hazards.title": "Hazard Register",
  "hazards.subtitle":
    "Every hazard reported at {mine}, with its owner, evidence and sync state.",
  "hazards.showing": "Showing {shown} of {total} hazards",
  "hazards.filter.heading": "Filter the register",
  "hazards.filter.severity": "Severity",
  "hazards.filter.status": "Status",
  "hazards.filter.any": "Any",
  "hazards.filter.apply": "Apply filters",
  "hazards.filter.clear": "Clear filters",
  "hazards.table.caption": "Reported hazards",
  "hazards.open": "Open hazard {id}",
  "hazards.prev": "Previous page",
  "hazards.next": "Next page",
  "hazards.page": "Page {page} of {pages}",

  // ── Hazard detail ──────────────────────────────────────────────────
  "hazard.back": "Back to the hazard register",
  "hazard.description": "Reported description",
  "hazard.facts": "Record",
  "hazard.evidence.heading": "Evidence",
  "hazard.evidence.file": "File",
  "hazard.evidence.size": "Size",
  "hazard.evidence.hash": "SHA-256",
  "hazard.evidence.captured": "Captured",
  "hazard.evidence.coords": "Coordinates",
  "hazard.evidence.accuracy": "Accuracy",
  "hazard.evidence.localState": "Device verdict",
  "hazard.evidence.serverState": "Server verdict",
  "hazard.evidence.noCoords": "Not recorded",
  "hazard.actions.heading": "Corrective actions",
  "hazard.actions.owner": "Owner",
  "hazard.actions.due": "Deadline",
  "hazard.actions.acknowledged": "Acknowledged",
  "hazard.actions.resolved": "Resolved",

  // ── Hazard mutations ───────────────────────────────────────────────
  "mutate.heading": "Manager decision",
  "mutate.actingAs": "Acting as {actor}",
  "mutate.noAuthNotice":
    "This prototype has no authentication service. Actions are recorded against a configured demonstration user, and the audit ledger names that user honestly rather than implying a verified government sign-in.",
  "mutate.acknowledge": "Acknowledge hazard",
  "mutate.acknowledge.help":
    "Records that a manager has seen this hazard. Written to the audit ledger.",
  "mutate.review.heading": "Review and re-grade",
  "mutate.review.severity": "Revised severity",
  "mutate.review.status": "Revised status",
  "mutate.review.unchanged": "Leave unchanged",
  "mutate.review.submit": "Record review",
  "mutate.action.heading": "Raise a corrective action",
  "mutate.action.description": "What must be done",
  "mutate.action.assignee": "Assign to (user ID)",
  "mutate.action.due": "Deadline",
  "mutate.action.submit": "Raise action",
  "mutate.action.resolve": "Mark resolved",
  "mutate.action.resolve.help":
    "Resolving the last open action on a hazard resolves the hazard itself.",
  "mutate.evidence.heading": "Attach evidence",
  "mutate.evidence.file": "Photograph",
  "mutate.evidence.fileHelp": "JPEG, PNG or WebP, up to 10 MB.",
  "mutate.evidence.latitude": "Latitude",
  "mutate.evidence.longitude": "Longitude",
  "mutate.evidence.accuracy": "GPS accuracy (metres)",
  "mutate.evidence.capturedAt": "Captured at",
  "mutate.evidence.submit": "Upload evidence",
  "mutate.evidence.tooLarge": "That file is larger than the 10 MB limit.",
  "mutate.evidence.wrongType": "Evidence must be a JPEG, PNG or WebP image.",
  "mutate.evidence.hashVerified":
    "The server recomputed the file hash and it matched.",
  "mutate.evidence.hashMismatch":
    "The server's hash did not match the one sent with the file.",
  "mutate.success": "Recorded. The ledger has been updated.",
  "mutate.pending": "Recording…",
  "mutate.required": "Required",

  // ── Risk ───────────────────────────────────────────────────────────
  "risk.title": "Mine Risk Index",
  "risk.subtitle":
    "An explainable, rule-based score for {mine} — every factor, its weight and its contribution.",
  "risk.score": "Risk score",
  "risk.level": "Risk level",
  "risk.calculatedAt": "Calculated {timestamp}",
  "risk.snapshotId": "Snapshot",
  "risk.factors.caption": "Risk factors and their contributions",
  "risk.factors.name": "Factor",
  "risk.factors.weight": "Weight",
  "risk.factors.value": "Current value",
  "risk.factors.score": "Factor score",
  "risk.factors.contribution": "Contribution",
  "risk.factors.source": "Source",
  "risk.notCalculated": "Not calculated",
  "risk.recalc.heading": "Recalculate the index",
  "risk.recalc.body":
    "Recalculation reads the current hazard and action data and writes a new snapshot to the audit ledger. The previous snapshot is kept.",
  "risk.recalc.gasBreaches": "Gas threshold breaches (last 30 days)",
  "risk.recalc.coverage": "Inspection coverage against target (%)",
  "risk.recalc.optional": "Optional — leave blank to keep the stored value",
  "risk.recalc.submit": "Recalculate",

  // ── Audit ledger ───────────────────────────────────────────────────
  "audit.title": "Audit Ledger",
  "audit.subtitle":
    "An append-only, hash-chained record of every change. Each entry's hash covers the entry before it, so a silent edit breaks the chain.",
  "audit.verify.heading": "Chain verification",
  "audit.verify.valid": "The hash chain is intact",
  "audit.verify.validBody":
    "All {checked} of {total} entries verified. No entry has been altered or removed since it was written.",
  "audit.verify.invalid": "The hash chain is broken",
  "audit.verify.invalidBody":
    "Verification failed at entry {sequence}. An entry has been altered or removed since it was written.",
  "audit.verify.head": "Head hash",
  "audit.verify.reason": "Reported reason",
  "audit.verify.unavailable":
    "The chain could not be verified because the API did not answer.",
  "audit.events.heading": "Ledger entries",
  "audit.events.caption": "Audit ledger entries, newest first",
  "audit.events.sequence": "#",
  "audit.events.event": "Event",
  "audit.events.entity": "Entity",
  "audit.events.actor": "Actor",
  "audit.events.recorded": "Recorded",
  "audit.events.hash": "Entry hash",
  "audit.events.previousHash": "Previous hash",
  "audit.events.payload": "Recorded values",
  "audit.events.noActor": "System",
  "audit.events.showing": "Showing {shown} of {total} entries",
  "audit.events.expand": "Show the recorded values for entry {sequence}",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
