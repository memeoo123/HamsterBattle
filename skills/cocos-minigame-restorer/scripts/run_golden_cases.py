#!/usr/bin/env python3
"""Run deterministic combat, wave, preparation, and base-HP golden cases."""

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


DEFEAT_MULTIPLIERS = [
    0.95, 0.9025, 0.8574, 0.8145, 0.7738,
    0.7351, 0.6983, 0.6634, 0.6302, 0.5987,
    0.5688, 0.5404, 0.5133, 0.4877, 0.4633,
]


def defeat_compensation(failed_attempts: int) -> float:
    if failed_attempts <= 0:
        return 1
    return DEFEAT_MULTIPLIERS[min(failed_attempts, len(DEFEAT_MULTIPLIERS)) - 1]


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
    power_index = int(case["powerIndex"])
    # Original BagLike placement permits ordinary occupied cells: setBrick places
    # the dragged gear and returns every displaced whole gear to ChooseCom.
    return all(index in unlocked and index != power_index for index in indexes)


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


def read_typescript_gears(source: Path) -> tuple[dict[str, dict], int]:
    """Read the literal GEARS table and grid size from the reconstruction."""
    text = source.read_text(encoding="utf-8")
    table = re.search(
        r"const\s+GEARS\s*:\s*Record<GearId,\s*GearConfig>\s*=\s*\{(.*?)\n\s*\};",
        text,
        re.DOTALL,
    )
    if not table:
        raise ValueError("literal GEARS table was not found")
    gears = {}
    for match in re.finditer(r"^\s*([A-Z][A-Z0-9]+):\s*\{([^\n]+)\},?\s*$", table.group(1), re.MULTILINE):
        item_id, body = match.groups()
        next_match = re.search(r"nextId:\s*['\"]([^'\"]+)['\"]", body)
        coin_match = re.search(r"coinAmount:\s*([0-9.]+)", body)
        power_match = re.search(r"powerPerTrigger:\s*([0-9.]+)", body)
        shape_match = re.search(r"shape:\s*(\[\[.*?\]\])(?:,\s*gridUnlock|\s*$)", body)
        shape = []
        if shape_match:
            shape = [
                [int(row), int(col)]
                for row, col in re.findall(r"\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]", shape_match.group(1))
            ]
        gears[item_id] = {
            "nextId": next_match.group(1) if next_match else None,
            "coinAmount": float(coin_match.group(1)) if coin_match else 0,
            "powerPerTrigger": float(power_match.group(1)) if power_match else 0,
            "shape": shape,
        }
    grid_match = re.search(r"const\s+GRID_CELL\s*=\s*(\d+)", text)
    if not gears or not grid_match:
        raise ValueError("literal gear entries or GRID_CELL were not found")
    return gears, int(grid_match.group(1))


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
    implementation_gears = None
    implementation_grid_size = None
    implementation_error = None
    if args.implementation_source:
        try:
            implementation_rounds = read_typescript_rounds(args.implementation_source)
            implementation_gears, implementation_grid_size = read_typescript_gears(args.implementation_source)
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
    for case in data.get("workerProduction", []):
        configured_power = float(case["powerPerTrigger"])
        if implementation_error:
            actual = implementation_error
        elif implementation_gears is not None:
            configured_power = implementation_gears.get(case["itemId"], {}).get("powerPerTrigger", 0)
            total_power = configured_power * int(case["coreContacts"]) * int(case["laps"])
            actual = {
                "completed": math.floor(total_power / 100),
                "remainder": total_power % 100,
            }
        else:
            total_power = configured_power * int(case["coreContacts"]) * int(case["laps"])
            actual = {
                "completed": math.floor(total_power / 100),
                "remainder": total_power % 100,
            }
        results.append({
            "kind": "workerProduction",
            "name": case.get("name", "unnamed"),
            "expected": case["expected"],
            "actual": actual,
            "passed": actual == case["expected"],
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
    for case in data.get("merges", []):
        if implementation_error:
            actual = implementation_error
        elif implementation_gears is not None:
            left = case["dragged"]
            right = case["target"]
            actual = implementation_gears.get(left, {}).get("nextId") if left == right else None
        else:
            actual = case.get("configuredResult") if case["dragged"] == case["target"] else None
        expected = case.get("expectedResult")
        results.append({
            "kind": "merge",
            "name": case.get("name", "unnamed"),
            "expected": expected,
            "actual": actual,
            "passed": actual == expected,
        })
    for case in data.get("footprints", []):
        if implementation_error:
            actual = implementation_error
        elif implementation_gears is not None and implementation_grid_size is not None:
            shape = implementation_gears.get(case["itemId"], {}).get("shape", [])
            rows = max((cell[0] for cell in shape), default=-1) + 1
            columns = max((cell[1] for cell in shape), default=-1) + 1
            actual = {
                "shape": shape,
                "width": columns * implementation_grid_size,
                "height": rows * implementation_grid_size,
            }
        else:
            shape = case.get("shape", [])
            rows = max((cell[0] for cell in shape), default=-1) + 1
            columns = max((cell[1] for cell in shape), default=-1) + 1
            actual = {"shape": shape, "width": columns * 100, "height": rows * 100}
        expected = case["expected"]
        results.append({
            "kind": "footprint",
            "name": case.get("name", "unnamed"),
            "expected": expected,
            "actual": actual,
            "passed": actual == expected,
        })
    for case in data.get("coinProduction", []):
        if implementation_error:
            actual = implementation_error
        elif implementation_gears is not None:
            actual = implementation_gears.get(case["itemId"], {}).get("coinAmount")
            if isinstance(actual, float) and actual.is_integer():
                actual = int(actual)
        else:
            actual = case.get("configuredAmount")
        expected = case["expectedAmount"]
        results.append({
            "kind": "coinProduction",
            "name": case.get("name", "unnamed"),
            "expected": expected,
            "actual": actual,
            "passed": actual == expected,
        })
    for case in data.get("defeatCompensation", []):
        actual = defeat_compensation(int(case["failedAttempts"]))
        expected = case["expectedMultiple"]
        results.append({
            "kind": "defeatCompensation",
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
