#!/usr/bin/env python3
"""Manage the end-to-end WeChat mini-game reconstruction state machine."""

from __future__ import annotations

import argparse
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
ARTIFACT_KINDS = {
    "packageInventory",
    "handoff",
    "mainPackage",
    "extractedRoot",
    "reverseManifest",
    "restoreSpec",
    "goldenCases",
    "cocosProject",
    "originalReference",
    "validationReport",
}
MECHANICS_CHECK = "mechanicsData"
TECHNICAL_CHECKS = {"goldenCases", "assetImport", "typescript"}
PRESENTATION_CHECKS = {"visualBaseline"}
REQUIRED_CHECKS = {MECHANICS_CHECK, *TECHNICAL_CHECKS, *PRESENTATION_CHECKS}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


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

    check = commands.add_parser("set-check")
    project_arg(check)
    check.add_argument("--target", required=True)
    check.add_argument("--name", required=True)
    check.add_argument("--result", choices=("pass", "fail", "pending"), required=True)
    check.add_argument("--evidence", required=True)

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


def artifact_exists(target: dict[str, Any], kind: str) -> bool:
    item = target.get("artifacts", {}).get(kind)
    return bool(item and Path(item.get("path", "")).exists())


def restore_spec_ready(target: dict[str, Any]) -> bool:
    item = target.get("artifacts", {}).get("restoreSpec")
    if not item:
        return False
    try:
        spec = json.loads(Path(item["path"]).read_text(encoding="utf-8"))
        return spec.get("schemaVersion") == "1.0" and spec.get("implementationReady") is True
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
    elif phase == "validation":
        if not artifact_exists(target, "validationReport"):
            missing.append("validationReport")
        checks = target.get("checks", {})
        for name in sorted(REQUIRED_CHECKS):
            if checks.get(name, {}).get("result") != "pass":
                missing.append(f"check:{name}")
    return missing


def next_skill(target: dict[str, Any]) -> str | None:
    phase = target["phase"]
    if phase == "discovery":
        return "wechat-minigame-package-inventory"
    if phase == "target-identification":
        return "wechat-minigame-file-locator" if target.get("platform") == "windows" else "wechat-minigame-package-inventory"
    if phase in {"reverse-analysis", "restore-specification"}:
        return "wechat-minigame-reverse-expert"
    if (
        phase in {"implementation", "validation"}
        and target.get("checks", {}).get(MECHANICS_CHECK, {}).get("result") != "pass"
    ):
        return "wechat-minigame-battlefield-restorer"
    if phase in {"implementation", "validation"} and target.get("engine") == "cocos":
        return "cocos-minigame-restorer"
    return None


def validation_stage(target: dict[str, Any]) -> str | None:
    if target["phase"] not in {"implementation", "validation", "complete"}:
        return None
    checks = target.get("checks", {})
    if checks.get(MECHANICS_CHECK, {}).get("result") != "pass":
        return "mechanics-data"
    if any(checks.get(name, {}).get("result") != "pass" for name in TECHNICAL_CHECKS):
        return "technical-integration"
    if any(checks.get(name, {}).get("result") != "pass" for name in PRESENTATION_CHECKS):
        return "presentation-polish"
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
            "nextSkill": "wechat-minigame-package-inventory",
            "nextAction": "Use $wechat-minigame-package-inventory, then register the selected target",
        }
    key, target = select_target(data, requested)
    missing_paths = [
        kind for kind, item in target.get("artifacts", {}).items()
        if not Path(item.get("path", "")).exists()
    ]
    stage = validation_stage(target)
    skill = next_skill(target)
    if stage == "mechanics-data":
        action = (
            "Use $wechat-minigame-battlefield-restorer to complete and validate "
            "mechanics/data before effects, audio, or presentation polish"
        )
    elif skill:
        action = f"Use ${skill} to complete {target['phase']} ({stage or 'phase gate'})"
    else:
        action = "Resolve blockers or the target is complete"
    return {
        "schemaVersion": "1.0",
        "activeTarget": key,
        "phase": target["phase"],
        "status": target["status"],
        "platform": target.get("platform"),
        "engine": target.get("engine"),
        "authorization": target.get("authorization"),
        "validationStage": stage,
        "blockers": blockers(target),
        "missingArtifactPaths": missing_paths,
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


def render_markdown(data: dict[str, Any]) -> str:
    lines = ["# ORCHESTRATION_STATUS", "", f"- Active target: `{data.get('activeTarget') or 'none'}`", ""]
    lines.extend(["| Target | Phase | Status | Engine | Next skill | Blockers |", "|---|---|---|---|---|---|"])
    for key, target in sorted(data.get("targets", {}).items()):
        missing = ", ".join(blockers(target)) or "none"
        skill = next_skill(target) or "none"
        lines.append(f"| `{key}` | {target['phase']} | {target['status']} | {target.get('engine', 'unknown')} | `{skill}` | {missing} |")
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
                target["artifacts"][args.kind] = {"path": str(path), "status": args.status, "recordedAtUtc": now()}
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
            elif args.command == "set-check":
                key, target = select_target(data, args.target)
                target["checks"][args.name] = {"result": args.result, "evidence": args.evidence, "atUtc": now()}
                target["history"].append({"event": "check", "name": args.name, "result": args.result, "atUtc": now()})
                save(root, data)
                result = status(data, key)
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
