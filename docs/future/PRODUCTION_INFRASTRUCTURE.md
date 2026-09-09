# Production Infrastructure — Non-Binding Reference

## Principle

Choose infrastructure based on measured pilot needs and actual government hosting/security requirements, not because an enterprise stack looks impressive.

## Candidate capabilities for pilot/production

- enterprise OIDC provider / MFA
- PostgreSQL HA, backup/PITR
- managed/object storage with lifecycle policy
- Redis or broker for justified async workloads
- vulnerability/dependency scanning
- centralized logs/metrics/traces
- SIEM integration
- secret management
- signed artifacts/dossiers
- load testing
- disaster recovery

## Hosting

Older planning proposed NIC Cloud and Kubernetes. Treat those as candidates, not confirmed mandates. Before production planning, verify actual Ministry/CIL/NIC deployment requirements, network constraints, approved software, data-localization obligations, and procurement constraints.

## CI/CD

For the project now, GitHub Actions is sufficient for reproducible build/test/security gates where available. A future government deployment may require Jenkins/GitLab/other approved tooling; keep pipeline concepts portable.

## Containers / orchestration

Docker is useful for reproducible local/server setup. Kubernetes is introduced only if deployment scale/operations require it.
