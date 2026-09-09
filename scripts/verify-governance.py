#!/usr/bin/env python3
"""Fail fast on Surang Saathi repository-governance regressions.

This is intentionally dependency-free so it can run in a fresh clone and in
GitHub Actions before application toolchains are installed.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "PROJECT_BRIEF.md",
    "README.md",
    "CONTRIBUTING.md",
    "AI_STUDIO.md",
    "docs/DECISIONS.md",
    "docs/ARCHITECTURE.md",
    "docs/UI_PRINCIPLES.md",
    "docs/GITHUB_STRATEGY.md",
    "docs/GITHUB_SETUP.md",
    "docs/WORKFLOW.md",
    "docs/REBUILD_ROADMAP.md",
    "docs/BUILD_STATE.md",
    "docs/QA_CHECKLIST.md",
    "docs/DEMO.md",
    "docs/ai-studio/MASTER_PROMPT.md",
    "docs/ai-studio/PACKET_TEMPLATE.md",
    "docs/ai-studio/packets/0001-design-system-foundation.md",
    ".github/pull_request_template.md",
    ".github/workflows/governance.yml",
]

LOCKED_COLORS = {
    "#F7F3EA",
    "#FFFDF8",
    "#8C4A2F",
    "#D4A72C",
    "#4F5D4A",
    "#C6472D",
    "#2F3A44",
    "#D8CCBA",
}

ARCH_MARKERS = [
    "offline-first",
    "append-only",
    "last-write-wins",
    "modular monolith",
    "SHA-256",
    "rule-based",
    "contributing factors",
]

SECRET_PATTERNS = {
    "Google API key": re.compile(r"AIza[0-9A-Za-z_-]{30,}"),
    "GitHub classic token": re.compile(r"ghp_[0-9A-Za-z]{20,}"),
    "GitHub fine-grained token": re.compile(r"github_pat_[0-9A-Za-z_]{20,}"),
    "OpenAI-style secret": re.compile(r"\bsk-[0-9A-Za-z_-]{20,}"),
    "Private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
}

TEXT_SUFFIXES = {
    ".md", ".txt", ".py", ".yml", ".yaml", ".json", ".toml", ".ini",
    ".env", ".example", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".dart",
    ".html", ".css", ".sh",
}


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)
    print(f"FAIL: {message}")


def tracked_files() -> list[Path]:
    try:
        output = subprocess.check_output(
            ["git", "ls-files"], cwd=ROOT, text=True, stderr=subprocess.DEVNULL
        )
        return [ROOT / line for line in output.splitlines() if line.strip()]
    except (subprocess.CalledProcessError, FileNotFoundError):
        return [p for p in ROOT.rglob("*") if p.is_file() and ".git" not in p.parts]


def looks_text(path: Path) -> bool:
    if path.name in {"Dockerfile", ".gitignore", "CODEOWNERS"}:
        return True
    return path.suffix.lower() in TEXT_SUFFIXES or path.name.endswith(".example")


def read_text(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return None


def main() -> int:
    failures: list[str] = []

    for rel in REQUIRED:
        if not (ROOT / rel).is_file():
            fail(f"required file missing: {rel}", failures)

    brief = read_text(ROOT / "PROJECT_BRIEF.md") or ""
    if "Project Brief: Surang Saathi" not in brief:
        fail("PROJECT_BRIEF.md must use the active product name", failures)

    ui = read_text(ROOT / "docs/UI_PRINCIPLES.md") or ""
    missing_colors = sorted(LOCKED_COLORS - set(re.findall(r"#[0-9A-Fa-f]{6}", ui)))
    if missing_colors:
        fail(f"UI principles missing locked colors: {', '.join(missing_colors)}", failures)

    architecture = read_text(ROOT / "docs/ARCHITECTURE.md") or ""
    for marker in ARCH_MARKERS:
        if marker.lower() not in architecture.lower():
            fail(f"architecture missing locked marker: {marker}", failures)

    files = tracked_files()
    for path in files:
        if not looks_text(path):
            continue
        text = read_text(path)
        if text is None:
            continue
        rel = path.relative_to(ROOT).as_posix()

        if re.search(r"Khanij\s+Rakshak", text, flags=re.IGNORECASE):
            fail(f"legacy product name present in active tracked file: {rel}", failures)

        process_artifact = rel.startswith("docs/superpowers/")
        if rel != "scripts/verify-governance.py" and not process_artifact and re.search(r"\bClaude\b", text, flags=re.IGNORECASE):
            fail(f"retired implementation-agent reference present in active tracked file: {rel}", failures)

        for label, pattern in SECRET_PATTERNS.items():
            if pattern.search(text):
                fail(f"possible {label} found in tracked file: {rel}", failures)

    if (ROOT / "CLAUDE.md").exists():
        fail("retired root implementation protocol still exists", failures)

    if (ROOT / "docs/claude-packets").exists():
        fail("retired implementation packet directory still exists", failures)

    if failures:
        print(f"\nGovernance verification failed: {len(failures)} issue(s).")
        return 1

    print(f"Governance verification passed: {len(REQUIRED)} required files checked.")
    print("Locked product name, palette, architecture markers, workflow, and secret patterns are clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
