#!/usr/bin/env python3
"""Run bounded Cocos validation profiles and write one machine-readable manifest."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


PROFILES = ("fast", "mechanics", "presentation", "release")


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def evidence_entry(path: Path) -> dict[str, Any]:
    resolved = path.resolve()
    if not resolved.exists():
        return {"path": str(resolved), "exists": False}
    if resolved.is_file():
        stat = resolved.stat()
        return {
            "path": str(resolved),
            "exists": True,
            "kind": "file",
            "size": stat.st_size,
            "sha256": file_sha256(resolved),
            "modifiedAtUtc": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(),
        }
    files = [item for item in resolved.rglob("*") if item.is_file()]
    latest = max((item.stat().st_mtime for item in files), default=resolved.stat().st_mtime)
    return {
        "path": str(resolved),
        "exists": True,
        "kind": "directory",
        "fileCount": len(files),
        "modifiedAtUtc": datetime.fromtimestamp(latest, timezone.utc).isoformat(),
    }


def run_command(name: str, command: list[str], cwd: Path) -> dict[str, Any]:
    started = now()
    completed = subprocess.run(
        command,
        cwd=cwd,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    stdout = completed.stdout.strip()
    stderr = completed.stderr.strip()
    return {
        "name": name,
        "command": command,
        "startedAtUtc": started,
        "finishedAtUtc": now(),
        "exitCode": completed.returncode,
        "passed": completed.returncode == 0,
        "stdoutTail": stdout[-4000:],
        "stderrTail": stderr[-4000:],
    }


def parse_json_tail(value: str) -> dict[str, Any] | None:
    try:
        parsed = json.loads(value)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        return None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", required=True, type=Path)
    parser.add_argument("--profile", choices=PROFILES, default="fast")
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--creator-root", type=Path)
    parser.add_argument("--golden-cases", type=Path)
    parser.add_argument("--implementation-source", type=Path)
    parser.add_argument("--original-reference", action="append", type=Path, default=[])
    parser.add_argument("--runtime-evidence", action="append", type=Path, default=[])
    parser.add_argument("--visual-baseline-result", choices=("pass", "pending", "fail"), default="pending")
    parser.add_argument("--build-output", type=Path)
    args = parser.parse_args()

    project = args.project.resolve()
    output = args.output.resolve()
    skill_dir = Path(__file__).resolve().parent.parent
    commands: list[dict[str, Any]] = []
    requirements: list[dict[str, Any]] = []

    check_command = [
        sys.executable,
        str(skill_dir / "scripts" / "check_cocos_project.py"),
        str(project),
    ]
    if args.creator_root:
        check_command.extend(["--creator-root", str(args.creator_root.resolve())])
    commands.append(run_command("cocos-project", check_command, project))

    if args.golden_cases:
        golden_command = [
            sys.executable,
            str(skill_dir / "scripts" / "run_golden_cases.py"),
            str(args.golden_cases.resolve()),
        ]
        if args.implementation_source:
            golden_command.extend(["--implementation-source", str(args.implementation_source.resolve())])
        commands.append(run_command("golden-cases", golden_command, project))
    else:
        requirements.append({"name": "golden-cases", "passed": False, "reason": "--golden-cases was not provided"})

    if args.profile in {"mechanics", "presentation", "release"}:
        tests_dir = project / "tests"
        test_files = sorted(tests_dir.glob("*.test.mjs")) if tests_dir.is_dir() else []
        if not test_files:
            requirements.append({"name": "node-tests", "passed": False, "reason": "no tests/*.test.mjs files found"})
        for test_file in test_files:
            commands.append(run_command(f"node:{test_file.name}", ["node", str(test_file)], project))

    original_entries = [evidence_entry(path) for path in args.original_reference]
    runtime_entries = [evidence_entry(path) for path in args.runtime_evidence]
    if args.profile in {"presentation", "release"}:
        requirements.append({
            "name": "original-reference",
            "passed": bool(original_entries) and all(item["exists"] for item in original_entries),
            "evidence": original_entries,
        })
        requirements.append({
            "name": "runtime-evidence",
            "passed": bool(runtime_entries) and all(item["exists"] for item in runtime_entries),
            "evidence": runtime_entries,
        })
        requirements.append({
            "name": "visual-baseline-decision",
            "passed": args.visual_baseline_result == "pass",
            "result": args.visual_baseline_result,
            "reason": "Set pass only when every required fidelity row is confirmed.",
        })
    if args.profile == "release":
        build_entry = evidence_entry(args.build_output) if args.build_output else None
        requirements.append({
            "name": "build-output",
            "passed": bool(build_entry and build_entry["exists"]),
            "evidence": build_entry,
        })

    project_result = parse_json_tail(commands[0]["stdoutTail"]) if commands else None
    passed = all(item["passed"] for item in commands) and all(item.get("passed") for item in requirements)
    manifest = {
        "schemaVersion": "1.0",
        "generator": {
            "path": str(Path(__file__).resolve()),
            "sha256": file_sha256(Path(__file__).resolve()),
            "python": sys.version.split()[0],
        },
        "profile": args.profile,
        "visualBaselineResult": args.visual_baseline_result,
        "passed": passed,
        "generatedAtUtc": now(),
        "project": str(project),
        "creatorVersion": (project_result or {}).get("creatorVersion"),
        "assetFileCount": (project_result or {}).get("assetFileCount"),
        "missingMetaCount": (project_result or {}).get("missingMetaCount"),
        "testFileCount": sum(1 for item in commands if item["name"].startswith("node:")),
        "passedCommandCount": sum(1 for item in commands if item["passed"]),
        "commandCount": len(commands),
        "commands": commands,
        "requirements": requirements,
        "originalReferences": original_entries,
        "runtimeEvidence": runtime_entries,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "passed": passed,
        "profile": args.profile,
        "manifest": str(output),
        "commandCount": len(commands),
        "testFileCount": manifest["testFileCount"],
        "failed": [item["name"] for item in commands if not item["passed"]]
            + [item["name"] for item in requirements if not item.get("passed")],
    }, ensure_ascii=False, indent=2))
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
