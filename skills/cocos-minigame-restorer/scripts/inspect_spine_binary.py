#!/usr/bin/env python3
"""Inspect Spine binary version, animation-name candidates, and atlas textures."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


PRINTABLE = re.compile(rb"[\x20-\x7e]{3,}")
VERSION = re.compile(r"^\d+\.\d+(?:\.\d+)?$")
ANIMATION_NAMES = {
    "idle", "move", "run", "walk", "attack", "die", "death",
    "skill", "skill01", "skill02", "daiji", "gongji", "siwang",
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("skeleton", type=Path)
    parser.add_argument("--atlas", type=Path)
    parser.add_argument("--runtime")
    args = parser.parse_args()

    data = args.skeleton.read_bytes()
    strings = [
        match.group().decode("ascii", errors="ignore")
        for match in PRINTABLE.finditer(data)
    ]
    version = next((item for item in strings if VERSION.fullmatch(item)), None)
    animations = sorted(
        {
            item
            for item in strings
            if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", item)
            and (
                item.lower() in ANIMATION_NAMES
                or item.lower().startswith(("attack", "skill"))
            )
        }
    )
    textures: list[str] = []
    if args.atlas:
        for line in args.atlas.read_text(encoding="utf-8", errors="replace").splitlines():
            value = line.strip()
            if value.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                textures.append(value)
    compatible = None
    if args.runtime and version:
        compatible = ".".join(version.split(".")[:2]) == ".".join(args.runtime.split(".")[:2])
    result = {
        "skeleton": str(args.skeleton.resolve()),
        "byteLength": len(data),
        "version": version,
        "requestedRuntime": args.runtime,
        "majorMinorCompatible": compatible,
        "animationNameCandidates": animations,
        "atlas": str(args.atlas.resolve()) if args.atlas else None,
        "atlasTextures": textures,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if version and compatible is not False else 1


if __name__ == "__main__":
    raise SystemExit(main())
