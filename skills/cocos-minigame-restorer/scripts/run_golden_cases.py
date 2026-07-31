#!/usr/bin/env python3
"""Run deterministic combat, wave, interval, and base-HP golden cases."""

from __future__ import annotations

import argparse
import json
import math
import re
from pathlib import Path


def damage(case: dict) -> int:
    raw = (
        float(case["attack"])
        * float(case.get("effectRatio", 10000)) / 10000
        * float(case.get("hitFactor", 10000)) / 10000
        * float(case.get("critFactor", 10000)) / 10000
        * float(case.get("damageCoefficient", 10000)) / 10000
    )
    return max(1, math.floor(raw))


def battle_phase(case: dict) -> str:
    if float(case["selfHp"]) <= 0:
        return "lost"
    if bool(case["scheduleComplete"]) and int(case["enemiesAlive"]) == 0:
        if int(case["roundIndex"]) >= int(case["roundCount"]) - 1:
            return "won"
        return "roundClear"
    return "battle"


def refresh_transition(case: dict) -> dict:
    normal_times = int(case["normalRefreshTimes"])
    gold = int(case["gold"])
    cost = 0 if normal_times == 0 else int(case["refreshCost"])
    allowed = gold >= cost
    return {
        "allowed": allowed,
        "cost": cost if allowed else 0,
        "gold": gold - cost if allowed else gold,
        "normalRefreshTimes": normal_times + (1 if allowed else 0),
    }


def placement_allowed(case: dict) -> bool:
    rows = int(case["rows"])
    columns = int(case["columns"])
    target_row, target_col = case["target"]
    indexes = []
    for row_offset, col_offset in case["shape"]:
        row = int(target_row) + int(row_offset)
        col = int(target_col) + int(col_offset)
        if row < 0 or row >= rows or col < 0 or col >= columns:
            return False
        indexes.append(row * columns + col)
    unlocked = {int(value) for value in case.get("unlocked", [])}
    if bool(case.get("gridUnlock", False)):
        return all(index not in unlocked for index in indexes)
    occupied = {int(value) for value in case.get("occupied", [])}
    power_index = int(case["powerIndex"])
    return all(index in unlocked and index != power_index and index not in occupied for index in indexes)


def read_typescript_rounds(source: Path) -> list[dict]:
    """Read the literal ROUNDS table used by a lightweight Cocos reconstruction.

    This deliberately handles only literal number and quoted-string arrays. It
    provides an implementation-to-golden consistency gate without pretending to
    be a general TypeScript parser.
    """
    text = source.read_text(encoding="utf-8")
    table = re.search(
        r"const\s+ROUNDS\s*:\s*RoundConfig\[\]\s*=\s*\[(.*?)\n\s*\];",
        text,
        re.DOTALL,
    )
    if not table:
        raise ValueError("literal ROUNDS table was not found")
    entries = re.findall(
        r"times\s*:\s*\[([^\]]*)\].*?monsters\s*:\s*\[([^\]]*)\]",
        table.group(1),
        re.DOTALL,
    )
    if not entries:
        raise ValueError("no literal round entries were found")
    rounds = []
    for times_text, entities_text in entries:
        times = [int(value) for value in re.findall(r"\b\d+\b", times_text)]
        entities = re.findall(r"['\"]([^'\"]+)['\"]", entities_text)
        rounds.append({"times": times, "entities": entities})
    return rounds


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("cases", type=Path)
    parser.add_argument(
        "--implementation-source",
        type=Path,
        help="optional TypeScript source containing a literal ROUNDS table",
    )
    args = parser.parse_args()
    data = json.loads(args.cases.read_text(encoding="utf-8"))
    results = []
    implementation_rounds = None
    implementation_error = None
    if args.implementation_source:
        try:
            implementation_rounds = read_typescript_rounds(args.implementation_source)
        except (OSError, ValueError) as error:
            implementation_error = str(error)

    for case in data.get("damage", []):
        actual = damage(case)
        results.append({
            "kind": "damage",
            "name": case.get("name", "unnamed"),
            "expected": case["expected"],
            "actual": actual,
            "passed": actual == case["expected"],
        })
    for wave_index, case in enumerate(data.get("waves", [])):
        source_index = int(case.get("implementationRound", wave_index + 1)) - 1
        if implementation_error:
            actual = implementation_error
        elif implementation_rounds is not None and 0 <= source_index < len(implementation_rounds):
            source_round = implementation_rounds[source_index]
            actual = list(zip(source_round["times"], source_round["entities"]))
        elif implementation_rounds is not None:
            actual = f"implementation round {source_index + 1} is missing"
        else:
            actual = list(zip(case.get("times", []), case.get("entities", [])))
        expected = [tuple(item) for item in case.get("expected", [])]
        results.append({
            "kind": "wave",
            "name": case.get("name", "unnamed"),
            "expected": expected,
            "actual": actual,
            "passed": actual == expected,
        })
    for case in data.get("baseHp", []):
        actual = max(0, case["start"] - sum(case.get("damage", [])))
        results.append({
            "kind": "baseHp",
            "name": case.get("name", "unnamed"),
            "expected": case["expected"],
            "actual": actual,
            "passed": actual == case["expected"],
        })
    for case in data.get("intervals", []):
        interval = float(case["interval"])
        duration = float(case["duration"])
        initial = bool(case.get("spawnAtZero", True))
        actual = math.floor(duration / interval) + (1 if initial else 0)
        results.append({
            "kind": "interval",
            "name": case.get("name", "unnamed"),
            "expected": case["expectedCount"],
            "actual": actual,
            "passed": actual == case["expectedCount"],
        })
    for case in data.get("refreshEconomy", []):
        actual = refresh_transition(case)
        expected = case["expected"]
        results.append({
            "kind": "refreshEconomy",
            "name": case.get("name", "unnamed"),
            "expected": expected,
            "actual": actual,
            "passed": actual == expected,
        })
    for case in data.get("placements", []):
        actual = placement_allowed(case)
        expected = bool(case["expectedAllowed"])
        results.append({
            "kind": "placement",
            "name": case.get("name", "unnamed"),
            "expected": expected,
            "actual": actual,
            "passed": actual == expected,
        })
    for case in data.get("conditions", []):
        required = {
            "selfHp", "scheduleComplete", "enemiesAlive",
            "roundIndex", "roundCount", "expectedPhase",
        }
        missing = sorted(required - set(case))
        if missing:
            results.append({
                "kind": "condition",
                "name": case.get("name", "unnamed"),
                "expected": case.get("expectedPhase"),
                "actual": f"missing fields: {', '.join(missing)}",
                "passed": False,
            })
            continue
        actual = battle_phase(case)
        results.append({
            "kind": "condition",
            "name": case.get("name", "unnamed"),
            "expected": case["expectedPhase"],
            "actual": actual,
            "passed": actual == case["expectedPhase"],
        })

    failed = [item for item in results if not item["passed"]]
    print(json.dumps({
        "passed": not failed,
        "caseCount": len(results),
        "failedCount": len(failed),
        "results": results,
    }, ensure_ascii=False, indent=2))
    return 0 if results and not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
