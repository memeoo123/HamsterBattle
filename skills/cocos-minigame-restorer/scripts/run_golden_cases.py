#!/usr/bin/env python3
"""Run deterministic combat, wave, interval, and base-HP golden cases."""

from __future__ import annotations

import argparse
import json
import math
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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("cases", type=Path)
    args = parser.parse_args()
    data = json.loads(args.cases.read_text(encoding="utf-8"))
    results = []

    for case in data.get("damage", []):
        actual = damage(case)
        results.append({
            "kind": "damage",
            "name": case.get("name", "unnamed"),
            "expected": case["expected"],
            "actual": actual,
            "passed": actual == case["expected"],
        })
    for case in data.get("waves", []):
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
