#!/usr/bin/env python3
"""Manage the end-to-end WeChat mini-game reconstruction state machine."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


STATE_NAME = "ORCHESTRATION_STATE.json"
STATUS_NAME = "ORCHESTRATION_STATUS.md"
APP_ID = re.compile(r"^wx[0-9a-fA-F]{16}$")
VERSION = re.compile(r"^[A-Za-z0-9._-]+$")
PHASES = [
    "discovery",
    "target-identification",
    "reverse-analysis",
    "restore-specification",
    "implementation",
    "validation",
    "complete",
]
ACCEPTANCE_LEVELS = (
    "functional-complete",
    "representative-level",
    "battlefield-faithful",
)
ACCEPTANCE_RANK = {name: index for index, name in enumerate(ACCEPTANCE_LEVELS)}
BATTLEFIELD_VALIDATION_RANK = {
    "untested": 0,
    "numeric-pass": 1,
    "integration-pass": 2,
    "replay-pass": 3,
}
ARTIFACT_KINDS = {
    "packageInventory",
    "handoff",
    "mainPackage",
    "extractedRoot",
    "reverseManifest",
    "restoreSpec",
    "goldenCases",
    "cocosProject",
    "battlefieldState",
    "originalReference",
    "validationManifest",
    "validationReport",
}
MECHANICS_CHECK = "mechanicsData"
TECHNICAL_CHECKS = {"goldenCases", "assetImport", "typescript"}
PRESENTATION_CHECKS = {"visualBaseline"}
FUNCTIONAL_CHECKS = {MECHANICS_CHECK, *TECHNICAL_CHECKS}
DEFAULT_CHECK_DEPENDENCIES = {
    "mechanicsData": ("restoreSpec", "goldenCases", "cocosProject", "battlefieldState", "validationManifest"),
    "goldenCases": ("goldenCases", "cocosProject", "validationManifest"),
    "assetImport": ("cocosProject", "validationManifest"),
    "typescript": ("cocosProject", "validationManifest"),
    "visualBaseline": (
        "cocosProject",
        "battlefieldState",
        "originalReference",
        "validationManifest",
        "validationReport",
    ),
    "gameplaySmoke": ("cocosProject", "validationManifest"),
}
FINGERPRINT_EXCLUDED_DIRS = {
    ".git",
    "build",
    "cache",
    "library",
    "native",
    "profiles",
    "temp",
}
_FINGERPRINT_CACHE: dict[tuple[str, str], dict[str, Any]] = {}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def clear_fingerprint_cache() -> None:
    """Clear the per-process audit cache; CLI invocations normally need this only once."""
    _FINGERPRINT_CACHE.clear()


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser()
    commands = root.add_subparsers(dest="command", required=True)

    def project_arg(command: argparse.ArgumentParser) -> None:
        command.add_argument("--project-root", required=True, type=Path)

    init = commands.add_parser("init")
    project_arg(init)
    init.add_argument("--project-name")

    register = commands.add_parser("register-target")
    project_arg(register)
    register.add_argument("--app-id", required=True)
    register.add_argument("--version", required=True)
    register.add_argument("--platform", choices=("windows", "macos", "unknown"), default="unknown")
    register.add_argument("--engine", default="unknown")
    register.add_argument("--acceptance-target", choices=ACCEPTANCE_LEVELS, default="functional-complete")
    register.add_argument("--activate", action="store_true")

    authorize = commands.add_parser("authorize")
    project_arg(authorize)
    authorize.add_argument("--target", required=True)
    authorize.add_argument("--scope", required=True)

    artifact = commands.add_parser("record-artifact")
    project_arg(artifact)
    artifact.add_argument("--target", required=True)
    artifact.add_argument("--kind", required=True, choices=sorted(ARTIFACT_KINDS))
    artifact.add_argument("--path", required=True, type=Path)
    artifact.add_argument("--status", choices=("confirmed", "inferred"), default="confirmed")

    engine = commands.add_parser("set-engine")
    project_arg(engine)
    engine.add_argument("--target", required=True)
    engine.add_argument("--engine", required=True)
    engine.add_argument("--evidence", required=True)

    acceptance = commands.add_parser("set-acceptance")
    project_arg(acceptance)
    acceptance.add_argument("--target", required=True)
    acceptance.add_argument("--level", required=True, choices=ACCEPTANCE_LEVELS)
    acceptance.add_argument("--reason", required=True)

    check = commands.add_parser("set-check")
    project_arg(check)
    check.add_argument("--target", required=True)
    check.add_argument("--name", required=True)
    check.add_argument("--result", choices=("pass", "fail", "pending"), required=True)
    check.add_argument("--evidence", required=True)
    check.add_argument(
        "--depends-on",
        action="append",
        choices=sorted(ARTIFACT_KINDS),
        help="artifact dependency to fingerprint; repeat as needed",
    )

    invalidate = commands.add_parser("invalidate-check")
    project_arg(invalidate)
    invalidate.add_argument("--target", required=True)
    invalidate.add_argument("--name", required=True)
    invalidate.add_argument("--reason", required=True)

    reopen = commands.add_parser("reopen")
    project_arg(reopen)
    reopen.add_argument("--target", required=True)
    reopen.add_argument("--phase", choices=("implementation", "validation"), default="validation")
    reopen.add_argument("--reason", required=True)

    migrate = commands.add_parser("migrate-state")
    project_arg(migrate)
    migrate.add_argument("--target")
    migrate.add_argument("--acceptance-target", choices=ACCEPTANCE_LEVELS)

    advance = commands.add_parser("advance")
    project_arg(advance)
    advance.add_argument("--target")
    advance.add_argument("--all-ready", action="store_true")

    for name in ("status", "render-status"):
        command = commands.add_parser(name)
        project_arg(command)
        command.add_argument("--target")
    return root


def project_root(path: Path) -> Path:
    root = path.resolve()
    if not root.is_dir():
        raise ValueError(f"Project root does not exist: {root}")
    return root


def state_path(root: Path) -> Path:
    return root / STATE_NAME


def load(root: Path) -> dict[str, Any]:
    path = state_path(root)
    if not path.is_file():
        raise ValueError(f"State is missing; run init first: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schemaVersion") != "1.0":
        raise ValueError(f"Unsupported state schema: {data.get('schemaVersion')}")
    return data


def save(root: Path, data: dict[str, Any]) -> None:
    data["updatedAtUtc"] = now()
    target = state_path(root)
    temporary = target.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, target)


def target_key(app_id: str, version: str) -> str:
    app_id = app_id.lower()
    if not APP_ID.fullmatch(app_id):
        raise ValueError("AppID must be wx followed by 16 hexadecimal characters")
    if not VERSION.fullmatch(version):
        raise ValueError("Version may contain letters, digits, dot, underscore, or dash")
    return f"{app_id}/{version}"


def select_target(data: dict[str, Any], requested: str | None) -> tuple[str, dict[str, Any]]:
    key = requested or data.get("activeTarget")
    if not key:
        raise ValueError("No active target; register or select a target")
    target = data.get("targets", {}).get(key)
    if target is None:
        raise ValueError(f"Unknown target: {key}")
    return key, target


def fingerprint_path(path: Path, kind: str | None = None) -> dict[str, Any]:
    path = path.resolve()
    cache_key = (str(path).casefold(), kind or "")
    cached = _FINGERPRINT_CACHE.get(cache_key)
    if cached is not None:
        return cached
    if not path.exists():
        result = {"kind": "missing"}
        _FINGERPRINT_CACHE[cache_key] = result
        return result
    if path.is_file():
        digest = hashlib.sha256()
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
        stat = path.stat()
        result = {
            "kind": "file",
            "sha256": digest.hexdigest(),
            "size": stat.st_size,
        }
        _FINGERPRINT_CACHE[cache_key] = result
        return result

    digest = hashlib.sha256()
    file_count = 0
    total_bytes = 0
    latest_mtime_ns = 0
    for candidate in sorted(path.rglob("*"), key=lambda value: value.as_posix().lower()):
        if not candidate.is_file():
            continue
        relative = candidate.relative_to(path)
        if any(part.lower() in FINGERPRINT_EXCLUDED_DIRS for part in relative.parts[:-1]):
            continue
        if kind == "cocosProject" and len(relative.parts) == 1 and relative.suffix.lower() in {".md", ".log"}:
            continue
        stat = candidate.stat()
        encoded = relative.as_posix().encode("utf-8", errors="surrogatepass")
        digest.update(encoded)
        digest.update(b"\0")
        digest.update(str(stat.st_size).encode("ascii"))
        digest.update(b"\0")
        digest.update(str(stat.st_mtime_ns).encode("ascii"))
        digest.update(b"\n")
        file_count += 1
        total_bytes += stat.st_size
        latest_mtime_ns = max(latest_mtime_ns, stat.st_mtime_ns)
    result = {
        "kind": "directory-metadata",
        "sha256": digest.hexdigest(),
        "fileCount": file_count,
        "totalBytes": total_bytes,
        "latestMtimeNs": latest_mtime_ns,
    }
    _FINGERPRINT_CACHE[cache_key] = result
    return result


def artifact_fingerprint(target: dict[str, Any], kind: str) -> dict[str, Any]:
    item = target.get("artifacts", {}).get(kind)
    if not item:
        return {"kind": "unrecorded"}
    return fingerprint_path(Path(item.get("path", "")), kind)


def artifact_exists(target: dict[str, Any], kind: str) -> bool:
    item = target.get("artifacts", {}).get(kind)
    return bool(item and Path(item.get("path", "")).exists())


def restore_spec_ready(target: dict[str, Any]) -> bool:
    item = target.get("artifacts", {}).get("restoreSpec")
    if not item:
        return False
    try:
        spec = json.loads(Path(item["path"]).read_text(encoding="utf-8"))
        return (
            spec.get("schemaVersion") == "1.0"
            and spec.get("implementationReady") is True
            and not spec.get("unknowns")
        )
    except (OSError, json.JSONDecodeError):
        return False


def reverse_manifest_ready(target: dict[str, Any]) -> bool:
    item = target.get("artifacts", {}).get("reverseManifest")
    if not item:
        return False
    try:
        manifest = json.loads(Path(item["path"]).read_text(encoding="utf-8"))
        return (
            manifest.get("schemaVersion") == "1.0"
            and manifest.get("reverseAnalysisComplete") is True
        )
    except (OSError, json.JSONDecodeError):
        return False


def battlefield_supported_claim(data: dict[str, Any]) -> str:
    subsystems = data.get("subsystems") if isinstance(data.get("subsystems"), dict) else {}
    required = [
        entry for entry in subsystems.values()
        if isinstance(entry, dict) and entry.get("scope") == "required"
    ]
    gates = data.get("gates") if isinstance(data.get("gates"), dict) else {}
    representative = bool(required) and all(
        entry.get("evidenceStatus") == "confirmed"
        and not entry.get("unknowns")
        and entry.get("implementationStatus") == "implemented"
        and BATTLEFIELD_VALIDATION_RANK.get(entry.get("validationStatus"), -1)
        >= BATTLEFIELD_VALIDATION_RANK["integration-pass"]
        for entry in required
    ) and all(
        gates.get(name, {}).get("status") == "pass"
        for name in ("evidence", "deterministic", "integration")
    )
    faithful = representative and all(
        entry.get("validationStatus") == "replay-pass" for entry in required
    ) and gates.get("matchedReplay", {}).get("status") == "pass" and not any(
        isinstance(entry, dict) and entry.get("scope") == "deferred"
        for entry in subsystems.values()
    ) and not data.get("blockers")
    declared = data.get("completionClaim", "incomplete")
    if declared == "battlefield-faithful" and faithful:
        return "battlefield-faithful"
    if declared in {"representative-level", "battlefield-faithful"} and representative:
        return "representative-level"
    return "incomplete"


def battlefield_declared_claim(target: dict[str, Any]) -> str:
    item = target.get("artifacts", {}).get("battlefieldState")
    if not item:
        return "unrecorded"
    try:
        state = json.loads(Path(item["path"]).read_text(encoding="utf-8"))
        return str(state.get("completionClaim", "incomplete"))
    except (OSError, json.JSONDecodeError):
        return "invalid"


def battlefield_claim(target: dict[str, Any]) -> str:
    item = target.get("artifacts", {}).get("battlefieldState")
    if not item:
        return "unrecorded"
    try:
        state = json.loads(Path(item["path"]).read_text(encoding="utf-8"))
        return battlefield_supported_claim(state)
    except (OSError, json.JSONDecodeError):
        return "invalid"


def check_stale_reason(target: dict[str, Any], name: str) -> str | None:
    check = target.get("checks", {}).get(name, {})
    if check.get("result") != "pass":
        return None
    dependencies = check.get("dependencies")
    if not isinstance(dependencies, dict) or not dependencies:
        return "dependency fingerprints were not recorded"
    for kind, recorded in dependencies.items():
        current = artifact_fingerprint(target, kind)
        if current != recorded:
            return f"artifact changed: {kind}"
    return None


def stale_checks(target: dict[str, Any]) -> dict[str, str]:
    stale: dict[str, str] = {}
    for name in target.get("checks", {}):
        reason = check_stale_reason(target, name)
        if reason:
            stale[name] = reason
    return stale


def check_passes(target: dict[str, Any], name: str) -> bool:
    check = target.get("checks", {}).get(name, {})
    return check.get("result") == "pass" and check_stale_reason(target, name) is None


def acceptance_blockers(target: dict[str, Any], level: str) -> list[str]:
    missing: list[str] = []
    if not artifact_exists(target, "validationReport"):
        missing.append("validationReport")
    for name in sorted(FUNCTIONAL_CHECKS):
        if not check_passes(target, name):
            missing.append(f"check:{name}")
    if ACCEPTANCE_RANK[level] >= ACCEPTANCE_RANK["representative-level"]:
        if not artifact_exists(target, "battlefieldState"):
            missing.append("battlefieldState")
        claim = battlefield_claim(target)
        if claim not in {"representative-level", "battlefield-faithful"}:
            missing.append("battlefield:representative-level")
        if not check_passes(target, "visualBaseline"):
            missing.append("check:visualBaseline")
    if level == "battlefield-faithful" and battlefield_claim(target) != "battlefield-faithful":
        missing.append("battlefield:battlefield-faithful")
    return list(dict.fromkeys(missing))


def completion_level(target: dict[str, Any]) -> str:
    achieved = "incomplete"
    for level in ACCEPTANCE_LEVELS:
        if acceptance_blockers(target, level):
            break
        achieved = level
    return achieved


def blockers(target: dict[str, Any]) -> list[str]:
    phase = target["phase"]
    missing: list[str] = []
    if phase == "discovery":
        if not artifact_exists(target, "packageInventory"):
            missing.append("packageInventory")
    elif phase == "target-identification":
        if not artifact_exists(target, "handoff"):
            missing.append("handoff")
        if target.get("authorization", {}).get("status") != "confirmed":
            missing.append("authorization")
    elif phase == "reverse-analysis":
        if not artifact_exists(target, "reverseManifest"):
            missing.append("reverseManifest")
        elif not reverse_manifest_ready(target):
            missing.append("ready reverseManifest")
        if target.get("engine", "unknown") == "unknown":
            missing.append("confirmed engine")
    elif phase == "restore-specification":
        if target.get("engine") != "cocos":
            missing.append("installed implementation skill for confirmed engine")
        if not restore_spec_ready(target):
            missing.append("ready restoreSpec")
        if not artifact_exists(target, "goldenCases"):
            missing.append("goldenCases")
    elif phase == "implementation":
        if not artifact_exists(target, "cocosProject"):
            missing.append("cocosProject")
    elif phase in {"validation", "complete"}:
        level = target.get("acceptanceTarget", "functional-complete")
        missing.extend(acceptance_blockers(target, level))
    return list(dict.fromkeys(missing))


def next_skill(target: dict[str, Any]) -> str | None:
    phase = target["phase"]
    if phase == "discovery":
        return "wechat-minigame-package-inventory"
    if phase == "target-identification":
        return "wechat-minigame-file-locator" if target.get("platform") == "windows" else "wechat-minigame-package-inventory"
    if phase in {"reverse-analysis", "restore-specification"}:
        return "wechat-minigame-reverse-expert"
    if phase in {"implementation", "validation", "complete"}:
        level = target.get("acceptanceTarget", "functional-complete")
        if not check_passes(target, MECHANICS_CHECK):
            return "wechat-minigame-battlefield-restorer"
        if ACCEPTANCE_RANK[level] >= ACCEPTANCE_RANK["representative-level"]:
            if battlefield_claim(target) not in {"representative-level", "battlefield-faithful"}:
                return "wechat-minigame-battlefield-restorer"
        if target.get("engine") == "cocos" and blockers(target):
            return "cocos-minigame-restorer"
    return None


def validation_stage(target: dict[str, Any]) -> str | None:
    if target["phase"] not in {"implementation", "validation", "complete"}:
        return None
    if not check_passes(target, MECHANICS_CHECK):
        return "mechanics-data"
    if any(not check_passes(target, name) for name in TECHNICAL_CHECKS):
        return "technical-integration"
    level = target.get("acceptanceTarget", "functional-complete")
    if ACCEPTANCE_RANK[level] >= ACCEPTANCE_RANK["representative-level"]:
        claim = battlefield_claim(target)
        if claim not in {"representative-level", "battlefield-faithful"}:
            return "battlefield-integration"
        if not check_passes(target, "visualBaseline"):
            return "presentation-polish"
    if level == "battlefield-faithful" and battlefield_claim(target) != "battlefield-faithful":
        return "matched-replay"
    return "complete"


def status(data: dict[str, Any], requested: str | None) -> dict[str, Any]:
    if not requested and not data.get("activeTarget"):
        return {
            "schemaVersion": "1.0",
            "activeTarget": None,
            "phase": "discovery",
            "status": "in_progress",
            "blockers": ["identify and register one AppID/version target"],
            "missingArtifactPaths": [],
            "staleChecks": {},
            "nextSkill": "wechat-minigame-package-inventory",
            "nextAction": "Use $wechat-minigame-package-inventory, then register the selected target",
        }
    key, target = select_target(data, requested)
    missing_paths = [
        kind for kind, item in target.get("artifacts", {}).items()
        if not Path(item.get("path", "")).exists()
    ]
    current_blockers = blockers(target)
    stage = validation_stage(target)
    skill = next_skill(target)
    if stage == "mechanics-data":
        action = "Use $wechat-minigame-battlefield-restorer to restore or revalidate mechanics/data"
    elif stage in {"battlefield-integration", "matched-replay"}:
        action = f"Use $wechat-minigame-battlefield-restorer to complete {stage}"
    elif skill:
        action = f"Use ${skill} to complete {target['phase']} ({stage or 'phase gate'})"
    elif current_blockers:
        action = "Resolve the reported blockers, then rerun status"
    else:
        action = "The configured acceptance target is satisfied"
    effective_status = "complete" if target["phase"] == "complete" and not current_blockers else "in_progress"
    return {
        "schemaVersion": "1.0",
        "activeTarget": key,
        "phase": target["phase"],
        "status": effective_status,
        "storedStatus": target.get("status"),
        "platform": target.get("platform"),
        "engine": target.get("engine"),
        "authorization": target.get("authorization"),
        "acceptanceTarget": target.get("acceptanceTarget", "functional-complete"),
        "completionLevel": completion_level(target),
        "battlefieldDeclaredClaim": battlefield_declared_claim(target),
        "battlefieldClaim": battlefield_claim(target),
        "validationStage": stage,
        "blockers": current_blockers,
        "missingArtifactPaths": missing_paths,
        "staleChecks": stale_checks(target),
        "nextSkill": skill,
        "nextAction": action,
    }


def validate_artifact(kind: str, path: Path) -> None:
    if not path.exists():
        raise ValueError(f"Artifact does not exist: {path}")
    if kind in {"packageInventory", "handoff"}:
        data = json.loads(path.read_text(encoding="utf-8"))
        if data.get("schemaVersion") != "2.0":
            raise ValueError(f"{kind} must use schemaVersion 2.0")
    if kind == "restoreSpec":
        data = json.loads(path.read_text(encoding="utf-8"))
        if data.get("schemaVersion") != "1.0":
            raise ValueError("restoreSpec must use schemaVersion 1.0")
    if kind == "battlefieldState":
        data = json.loads(path.read_text(encoding="utf-8"))
        if data.get("schemaVersion") != "1.0":
            raise ValueError("battlefieldState must use schemaVersion 1.0")
        if data.get("completionClaim") not in {"incomplete", "representative-level", "battlefield-faithful"}:
            raise ValueError("battlefieldState has an invalid completionClaim")
        declared = data.get("completionClaim")
        supported = battlefield_supported_claim(data)
        if declared != "incomplete" and supported != declared:
            raise ValueError(f"battlefieldState declares {declared} but supports only {supported}")
    if kind == "validationManifest":
        data = json.loads(path.read_text(encoding="utf-8"))
        if data.get("schemaVersion") != "1.0" or "passed" not in data:
            raise ValueError("validationManifest must use schemaVersion 1.0 and contain passed")
    if kind == "cocosProject" and not ((path / "package.json").is_file() and (path / "assets").is_dir()):
        raise ValueError("cocosProject must contain package.json and assets/")


def transition(target: dict[str, Any]) -> None:
    current = target["phase"]
    index = PHASES.index(current)
    if index >= len(PHASES) - 1:
        return
    following = PHASES[index + 1]
    target.setdefault("history", []).append({"from": current, "to": following, "atUtc": now()})
    target["phase"] = following
    target["status"] = "complete" if following == "complete" else "in_progress"


def reopen_target(target: dict[str, Any], phase: str, reason: str) -> None:
    previous = target.get("phase")
    target["phase"] = phase
    target["status"] = "in_progress"
    target.setdefault("history", []).append({
        "event": "reopened",
        "from": previous,
        "to": phase,
        "reason": reason,
        "atUtc": now(),
    })


def render_markdown(data: dict[str, Any]) -> str:
    lines = ["# ORCHESTRATION_STATUS", "", f"- Active target: `{data.get('activeTarget') or 'none'}`", ""]
    lines.extend([
        "| Target | Phase | Effective status | Acceptance target | Achieved | Battlefield | Next skill | Blockers |",
        "|---|---|---|---|---|---|---|---|",
    ])
    for key, target in sorted(data.get("targets", {}).items()):
        snapshot = status(data, key)
        missing = ", ".join(snapshot["blockers"]) or "none"
        skill = snapshot["nextSkill"] or "none"
        lines.append(
            f"| `{key}` | {snapshot['phase']} | {snapshot['status']} | "
            f"{snapshot['acceptanceTarget']} | {snapshot['completionLevel']} | "
            f"{snapshot['battlefieldClaim']} | `{skill}` | {missing} |"
        )
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    args = parser().parse_args()
    try:
        root = project_root(args.project_root)
        if args.command == "init":
            path = state_path(root)
            if path.exists():
                result = {"status": "resumed", "state": str(path)}
            else:
                data = {
                    "schemaVersion": "1.0",
                    "project": {"name": args.project_name or root.name, "root": str(root)},
                    "activeTarget": None,
                    "targets": {},
                    "createdAtUtc": now(),
                    "updatedAtUtc": now(),
                }
                save(root, data)
                result = {"status": "created", "state": str(path)}
        else:
            data = load(root)
            if args.command == "register-target":
                key = target_key(args.app_id, args.version)
                if key not in data["targets"]:
                    data["targets"][key] = {
                        "phase": "target-identification",
                        "status": "in_progress",
                        "platform": args.platform,
                        "engine": args.engine,
                        "acceptanceTarget": args.acceptance_target,
                        "authorization": {"status": "pending", "scope": ""},
                        "artifacts": {},
                        "checks": {},
                        "history": [{"event": "registered", "atUtc": now()}],
                    }
                if args.activate or not data.get("activeTarget"):
                    data["activeTarget"] = key
                save(root, data)
                result = status(data, key)
            elif args.command == "authorize":
                key, target = select_target(data, args.target)
                target["authorization"] = {"status": "confirmed", "scope": args.scope, "atUtc": now()}
                target["history"].append({"event": "authorized", "atUtc": now()})
                save(root, data)
                result = status(data, key)
            elif args.command == "record-artifact":
                key, target = select_target(data, args.target)
                path = args.path.resolve()
                validate_artifact(args.kind, path)
                target["artifacts"][args.kind] = {
                    "path": str(path),
                    "status": args.status,
                    "fingerprint": fingerprint_path(path, args.kind),
                    "recordedAtUtc": now(),
                }
                target["history"].append({"event": "artifact", "kind": args.kind, "atUtc": now()})
                save(root, data)
                result = status(data, key)
            elif args.command == "set-engine":
                key, target = select_target(data, args.target)
                target["engine"] = args.engine.lower()
                target["engineEvidence"] = args.evidence
                target["history"].append({"event": "engine", "value": target["engine"], "atUtc": now()})
                save(root, data)
                result = status(data, key)
            elif args.command == "set-acceptance":
                key, target = select_target(data, args.target)
                previous = target.get("acceptanceTarget", "functional-complete")
                target["acceptanceTarget"] = args.level
                target["history"].append({
                    "event": "acceptance-target",
                    "from": previous,
                    "to": args.level,
                    "reason": args.reason,
                    "atUtc": now(),
                })
                if target.get("phase") == "complete" and acceptance_blockers(target, args.level):
                    reopen_target(target, "validation", f"acceptance target changed: {args.reason}")
                save(root, data)
                result = status(data, key)
            elif args.command == "set-check":
                key, target = select_target(data, args.target)
                requested_dependencies = args.depends_on
                if requested_dependencies is None:
                    requested_dependencies = [
                        kind for kind in DEFAULT_CHECK_DEPENDENCIES.get(args.name, ())
                        if artifact_exists(target, kind)
                    ]
                dependencies = {
                    kind: artifact_fingerprint(target, kind)
                    for kind in dict.fromkeys(requested_dependencies)
                }
                target["checks"][args.name] = {
                    "result": args.result,
                    "evidence": args.evidence,
                    "dependencies": dependencies,
                    "atUtc": now(),
                }
                target["history"].append({"event": "check", "name": args.name, "result": args.result, "atUtc": now()})
                if args.result != "pass" and target.get("phase") == "complete":
                    reopen_target(target, "validation", f"check {args.name} set to {args.result}")
                save(root, data)
                result = status(data, key)
            elif args.command == "invalidate-check":
                key, target = select_target(data, args.target)
                check = target.get("checks", {}).get(args.name)
                if not check:
                    raise ValueError(f"Unknown check: {args.name}")
                check["result"] = "pending"
                check["invalidatedAtUtc"] = now()
                check["invalidationReason"] = args.reason
                target["history"].append({"event": "check-invalidated", "name": args.name, "reason": args.reason, "atUtc": now()})
                if target.get("phase") == "complete":
                    reopen_target(target, "validation", f"check invalidated: {args.name}")
                save(root, data)
                result = status(data, key)
            elif args.command == "reopen":
                key, target = select_target(data, args.target)
                reopen_target(target, args.phase, args.reason)
                save(root, data)
                result = status(data, key)
            elif args.command == "migrate-state":
                keys = [select_target(data, args.target)[0]] if args.target else list(data.get("targets", {}))
                migrated = []
                for key in keys:
                    target = data["targets"][key]
                    target.setdefault("acceptanceTarget", args.acceptance_target or "functional-complete")
                    if args.acceptance_target:
                        target["acceptanceTarget"] = args.acceptance_target
                    for kind, item in target.get("artifacts", {}).items():
                        path = Path(item.get("path", ""))
                        if path.exists():
                            item["fingerprint"] = fingerprint_path(path, kind)
                    target.setdefault("history", []).append({"event": "state-migrated", "atUtc": now()})
                    migrated.append(key)
                save(root, data)
                result = {"migratedTargets": migrated, "active": status(data, args.target)}
            elif args.command == "advance":
                key, target = select_target(data, args.target)
                moved = []
                while True:
                    missing = blockers(target)
                    if missing or target["phase"] == "complete":
                        break
                    previous = target["phase"]
                    transition(target)
                    moved.append({"from": previous, "to": target["phase"]})
                    if not args.all_ready:
                        break
                save(root, data)
                result = {"transitions": moved, **status(data, key)}
            elif args.command == "status":
                result = status(data, args.target)
            elif args.command == "render-status":
                text = render_markdown(data)
                output = root / STATUS_NAME
                output.write_text(text, encoding="utf-8")
                result = {"statusFile": str(output), "active": status(data, args.target)}
            else:
                raise ValueError(f"Unsupported command: {args.command}")
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(json.dumps({"error": str(error)}, ensure_ascii=False, indent=2))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
