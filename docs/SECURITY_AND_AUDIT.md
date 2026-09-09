# Surang Saathi — Security, Authorization, and Audit

## 1. Security posture for SIH

The MVP should demonstrate correct security boundaries without pretending to implement an entire national production security program.

Priorities:

1. role/scope authorization
2. safe secret handling
3. encrypted transport in deployed environments
4. append-only audit history
5. tamper evidence
6. no fabricated production compliance claims

## 2. Identity and RBAC target

Use OAuth2/OIDC-compatible identity. Authorization claims should represent:

```text
role
scope_type
scope_id
```

Example scopes:

- mine
- area/subsidiary
- national
- own contractor operations

Server authorization is authoritative; hiding a button in the UI is not access control.

## 3. Principle of least privilege

Examples:

- field worker: create field evidence within allowed mine/section
- manager: review and act within allowed management scope
- corporate/ministry: aggregate/read/audit; no raw-record editing by default
- auditor: read/verify/export only

## 4. Permanent action semantics

Ledger-relevant actions require consequence-aware confirmation and server authorization.

Examples:

- submit inspection/hazard as permanent evidence
- approve corrective-action closure
- finalize sign-off

## 5. Audit event model

A ledger entry contains:

```text
id
ref_type
ref_id
action
actor_id
timestamp
canonical_payload
previous_hash
current_hash
```

Use deterministic canonical serialization. `current_hash = SHA256(previous_hash || canonical_payload_bytes)` or an equivalently documented unambiguous construction.

## 6. Ledger guarantees and limits

The hash chain provides tamper evidence: modifying an earlier ledger payload invalidates downstream verification.

It does **not** make PostgreSQL magically immutable, replace access controls/backups, or justify calling the solution blockchain.

## 7. Verification

Verifier walks entries in deterministic order and checks:

- expected previous hash
- recomputed current hash
- first broken link/entry

Acceptance tests must prove that altering an earlier test fixture breaks verification.

## 8. Secrets and PII

- no secrets in Git
- `.env.example` contains placeholders only
- logs avoid tokens/passwords and unnecessary PII
- collect only required user/location data
- object/media URLs should not be indefinitely public

## 9. Production evolution

Later pilot/production stages may introduce:

- managed/self-hosted OIDC provider such as Keycloak if required
- MFA
- KMS/Vault-style secret management
- SIEM integration
- formal vulnerability scanning
- signed dossiers
- DR/backup policy
- database-level security controls

These are future hardening items, not excuses to postpone the core workflow.
