#!/usr/bin/env python3
"""Validate the restoration handoff and its implementation-ready gate."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


REQUIRED = {
    "schemaVersion",
    "implementationReady",
    "target",
    "design",
    "representativeLevel",
    "scene",
    "assets",
    "entities",
    "spawners",
    "combat",
    "rounds",
    "goldenCases",
    "unknowns",
    "evidenceIndex",
}
STATUSES = {"confirmed", "inferred", "unknown"}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("spec", type=Path)
    parser.add_argument("--require-ready", action="store_true")
    args = parser.parse_args()

    errors: list[str] = []
    warnings: list[str] = []
    try:
        data = json.loads(args.spec.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        print(json.dumps({"valid": False, "errors": [str(error)]}, indent=2))
        return 2

    missing = sorted(REQUIRED - set(data))
    if missing:
        errors.append(f"Missing top-level fields: {', '.join(missing)}")
    if data.get("schemaVersion") != "1.0":
        errors.append("schemaVersion must be 1.0")
    target = data.get("target", {})
    if target.get("engine") != "cocos":
        errors.append("target.engine must be cocos")
    if not target.get("appId") or not target.get("version"):
        errors.append("target.appId and target.version are required")

    def walk(value: object, path: str = "$") -> None:
        if isinstance(value, dict):
            if "status" in value:
                status = value.get("status")
                if status not in STATUSES:
                    errors.append(f"{path}.status is invalid: {status}")
                if status in {"confirmed", "inferred"} and not value.get("evidence"):
                    errors.append(f"{path} requires evidence for status {status}")
            for key, child in value.items():
                walk(child, f"{path}.{key}")
        elif isinstance(value, list):
            for index, child in enumerate(value):
                walk(child, f"{path}[{index}]")

    walk(data)
    unknowns = data.get("unknowns", [])
    for index, item in enumerate(unknowns):
        if not isinstance(item, dict) or not item.get("field") or not item.get("verification"):
            errors.append(f"unknowns[{index}] needs field and verification")

    if len(data.get("rounds", [])) == 0:
        warnings.append("No rounds are defined")
    if len(data.get("assets", [])) == 0:
        warnings.append("No assets are mapped")
    if len(data.get("entities", [])) == 0:
        warnings.append("No entities are defined")
    if args.require_ready:
        if data.get("implementationReady") is not True:
            errors.append("implementationReady must be true")
        if unknowns:
            errors.append("Ready spec must not contain unresolved blocking unknowns")

    result = {
        "valid": not errors,
        "implementationReady": data.get("implementationReady") is True,
        "errors": errors,
        "warnings": warnings,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
