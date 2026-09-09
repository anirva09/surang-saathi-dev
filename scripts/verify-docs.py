from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    ROOT / "PROJECT_BRIEF.md",
    ROOT / "docs" / "README.md",
    ROOT / "docs" / "DECISIONS.md",
    ROOT / "docs" / "ARCHITECTURE.md",
    ROOT / "docs" / "MVP_SCOPE.md",
    ROOT / "docs" / "REBUILD_ROADMAP.md",
    ROOT / "docs" / "UI_PRINCIPLES.md",
    ROOT / "docs" / "DATA_AND_SYNC.md",
    ROOT / "docs" / "SECURITY_AND_AUDIT.md",
    ROOT / "docs" / "QA_CHECKLIST.md",
    ROOT / "docs" / "DEMO.md",
    ROOT / "docs" / "GITHUB_STRATEGY.md",
    ROOT / "docs" / "WORKFLOW.md",
]

errors = []
for p in REQUIRED:
    if not p.exists():
        errors.append(f"missing required file: {p.relative_to(ROOT)}")

for p in ROOT.rglob("*.md"):
    rel = p.relative_to(ROOT).as_posix()
    if rel.startswith("docs/archive/"):
        continue
    text = p.read_text(encoding="utf-8")
    if "Khanij Rakshak" in text or "KHANIJ RAKSHAK" in text:
        errors.append(f"active legacy product name in {rel}")
    for i, line in enumerate(text.splitlines(), 1):
        if line.rstrip() != line:
            errors.append(f"trailing whitespace: {rel}:{i}")
    for token in ("TBD", "TODO", "fill in details", "implement later"):
        if token.lower() in text.lower():
            errors.append(f"placeholder token '{token}' in {rel}")

brief = (ROOT / "PROJECT_BRIEF.md").read_text(encoding="utf-8") if (ROOT / "PROJECT_BRIEF.md").exists() else ""
for marker in (
    "FastAPI Modular Monolith",
    "offline",
    "append-only",
    "contributing_factors",
    "SHA-256",
    "Flutter",
    "Next.js",
    "PostgreSQL + PostGIS",
):
    if marker.lower() not in brief.lower():
        errors.append(f"PROJECT_BRIEF.md missing required marker: {marker}")

if errors:
    print("Documentation verification FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print(f"Documentation verification passed: {len(REQUIRED)} required canonical files checked.")
