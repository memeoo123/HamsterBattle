#!/usr/bin/env python3
"""Validate a per-target battlefield restoration state file."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


SUBSYSTEMS = (
    "phase-flow",
    "preparation",
    "deployment-and-production",
    "entities-and-attributes",
    "targeting-and-movement",
    "attack-and-damage",
    "skills-buffs-status",
    "waves-and-scaling",
    "outcomes-and-persistence",
    "presentation-and-feedback",
)
SCOPES = {"required", "deferred", "not-applicable"}
EVIDENCE = {"unknown", "partial", "confirmed"}
IMPLEMENTATION = {"missing", "partial", "implemented"}
VALIDATION_ORDER = ("untested", "numeric-pass", "integration-pass", "replay-pass")
VALIDATION = set(VALIDATION_ORDER)
GATE_STATUS = {"pending", "pass", "blocked"}
CLAIMS = {"incomplete", "representative-level", "battlefield-faithful"}
VALIDATION_RANK = {name: index for index, name in enumerate(VALIDATION_ORDER)}


def nonempty_list(value: Any) -> bool:
    return isinstance(value, list) and bool(value)


def load(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ValueError("root must be a JSON object")
    return value


def validate(data: dict[str, Any], require_evidence: bool, require_complete: bool) -> list[str]:
    errors: list[str] = []
    if data.get("schemaVersion") != "1.0":
        errors.append("schemaVersion must be '1.0'")

    target = data.get("target")
    if not isinstance(target, dict):
        errors.append("target must be an object")
    else:
        for key in ("appId", "version", "representativeLevel"):
            if target.get(key) in (None, "", "..."):
                errors.append(f"target.{key} must be populated")

    claim = data.get("completionClaim")
    if claim not in CLAIMS:
        errors.append(f"completionClaim must be one of {sorted(CLAIMS)}")

    subsystems = data.get("subsystems")
    if not isinstance(subsystems, dict):
        errors.append("subsystems must be an object")
        subsystems = {}

    required_entries: list[tuple[str, dict[str, Any]]] = []
    deferred_count = 0
    for subsystem_id in SUBSYSTEMS:
        entry = subsystems.get(subsystem_id)
        prefix = f"subsystems.{subsystem_id}"
        if not isinstance(entry, dict):
            errors.append(f"{prefix} must be an object")
            continue

        scope = entry.get("scope")
        evidence_status = entry.get("evidenceStatus")
        implementation_status = entry.get("implementationStatus")
        validation_status = entry.get("validationStatus")
        if scope not in SCOPES:
            errors.append(f"{prefix}.scope must be one of {sorted(SCOPES)}")
        if evidence_status not in EVIDENCE:
            errors.append(f"{prefix}.evidenceStatus must be one of {sorted(EVIDENCE)}")
        if implementation_status not in IMPLEMENTATION:
            errors.append(f"{prefix}.implementationStatus must be one of {sorted(IMPLEMENTATION)}")
        if validation_status not in VALIDATION:
            errors.append(f"{prefix}.validationStatus must be one of {sorted(VALIDATION)}")

        evidence = entry.get("evidence")
        unknowns = entry.get("unknowns")
        tests = entry.get("tests")
        if not isinstance(evidence, list):
            errors.append(f"{prefix}.evidence must be a list")
        if not isinstance(unknowns, list):
            errors.append(f"{prefix}.unknowns must be a list")
        if not isinstance(tests, list):
            errors.append(f"{prefix}.tests must be a list")

        if evidence_status == "confirmed":
            if not nonempty_list(evidence):
                errors.append(f"{prefix} confirmed evidence requires at least one citation")
            if nonempty_list(unknowns):
                errors.append(f"{prefix} cannot be confirmed while unknowns remain")
        if validation_status in {"numeric-pass", "integration-pass", "replay-pass"}:
            if implementation_status != "implemented":
                errors.append(f"{prefix} validated behavior must be implemented")
            if not nonempty_list(tests):
                errors.append(f"{prefix} validated behavior requires tests or trace evidence")
        if validation_status == "replay-pass" and not nonempty_list(evidence):
            errors.append(f"{prefix} replay-pass requires original evidence")
        if scope == "not-applicable" and not entry.get("notes"):
            errors.append(f"{prefix} not-applicable scope requires notes")
        if scope == "required":
            required_entries.append((prefix, entry))
        elif scope == "deferred":
            deferred_count += 1

    extras = sorted(set(subsystems) - set(SUBSYSTEMS))
    if extras:
        errors.append(f"unexpected subsystem ids: {', '.join(extras)}")

    gates = data.get("gates")
    if not isinstance(gates, dict):
        errors.append("gates must be an object")
    else:
        for gate_id in ("evidence", "deterministic", "integration", "matchedReplay"):
            gate = gates.get(gate_id)
            if not isinstance(gate, dict):
                errors.append(f"gates.{gate_id} must be an object")
                continue
            if gate.get("status") not in GATE_STATUS:
                errors.append(f"gates.{gate_id}.status must be one of {sorted(GATE_STATUS)}")
            if not isinstance(gate.get("evidence"), list):
                errors.append(f"gates.{gate_id}.evidence must be a list")

    blockers = data.get("blockers")
    if not isinstance(blockers, list):
        errors.append("blockers must be a list")
        blockers = []
    if not isinstance(data.get("nextActions"), list):
        errors.append("nextActions must be a list")

    evidence_ready = all(
        entry.get("evidenceStatus") == "confirmed" and not entry.get("unknowns")
        for _, entry in required_entries
    )
    representative_ready = evidence_ready and all(
        entry.get("implementationStatus") == "implemented"
        and VALIDATION_RANK.get(entry.get("validationStatus"), -1)
        >= VALIDATION_RANK["integration-pass"]
        for _, entry in required_entries
    )
    faithful_ready = representative_ready and all(
        entry.get("validationStatus") == "replay-pass" for _, entry in required_entries
    ) and deferred_count == 0 and not blockers

    if require_evidence and not evidence_ready:
        errors.append("evidence gate is not satisfied for every required subsystem")
    if claim == "representative-level" and not representative_ready:
        errors.append("representative-level claim is not supported by subsystem states")
    if claim == "battlefield-faithful" and not faithful_ready:
        errors.append("battlefield-faithful claim requires matched replay, no deferred scope, and no blockers")
    if require_complete and not faithful_ready:
        errors.append("complete battlefield fidelity gate is not satisfied")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("state", type=Path)
    parser.add_argument("--require-evidence-gate", action="store_true")
    parser.add_argument("--require-complete", action="store_true")
    args = parser.parse_args()

    try:
        data = load(args.state)
        errors = validate(data, args.require_evidence_gate, args.require_complete)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        errors = [str(exc)]

    result = {"valid": not errors, "errors": errors}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
