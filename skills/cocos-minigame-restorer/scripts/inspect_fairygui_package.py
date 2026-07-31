#!/usr/bin/env python3
"""Decompress and inventory strings in a FairyGUI package binary."""

from __future__ import annotations

import argparse
import json
import re
import zlib
from pathlib import Path


ASCII = re.compile(rb"[A-Za-z_][A-Za-z0-9_./@-]{2,80}")
COMPONENT = re.compile(
    r"(?:Com|Comp|Component|View|Page|Bar|Btn|Button|Cell|Panel|Scene)$",
    re.IGNORECASE,
)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("package", type=Path)
    parser.add_argument("--output-raw", type=Path)
    args = parser.parse_args()

    source = args.package.read_bytes()
    compression = "none"
    raw = source
    try:
        raw = zlib.decompress(source)
        compression = "zlib"
    except zlib.error:
        pass
    if args.output_raw:
        output = args.output_raw.resolve()
        if not output.parent.is_dir():
            raise SystemExit(f"Output parent does not exist: {output.parent}")
        output.write_bytes(raw)

    strings = []
    seen = set()
    for match in ASCII.finditer(raw):
        value = match.group().decode("ascii")
        if value not in seen:
            seen.add(value)
            strings.append(value)
    components = [value for value in strings if COMPONENT.search(value)]
    result = {
        "source": str(args.package.resolve()),
        "sourceBytes": len(source),
        "compression": compression,
        "rawBytes": len(raw),
        "stringCount": len(strings),
        "likelyComponents": components,
        "strings": strings,
        "limitation": "String inventory is not a coordinate/layout parser.",
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
