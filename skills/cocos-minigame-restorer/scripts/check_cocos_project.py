#!/usr/bin/env python3
"""Check Cocos project structure, asset metadata, and optional TypeScript."""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("project", type=Path)
    parser.add_argument("--creator-root", type=Path)
    args = parser.parse_args()

    project = args.project.resolve()
    errors: list[str] = []
    warnings: list[str] = []
    package_path = project / "package.json"
    if not package_path.is_file():
        errors.append("package.json is missing")
        package = {}
    else:
        package = json.loads(package_path.read_text(encoding="utf-8"))
    assets = project / "assets"
    if not assets.is_dir():
        errors.append("assets directory is missing")

    asset_files = []
    missing_meta = []
    if assets.is_dir():
        for path in assets.rglob("*"):
            if not path.is_file() or path.suffix == ".meta":
                continue
            asset_files.append(path)
            if not Path(str(path) + ".meta").is_file():
                missing_meta.append(str(path.relative_to(project)))
    if missing_meta:
        warnings.append(
            f"{len(missing_meta)} asset files have no .meta and need a Creator import pass"
        )

    typescript = {"ran": False}
    if args.creator_root:
        creator = args.creator_root.resolve()
        tsc = (
            creator
            / "resources"
            / "app.asar.unpacked"
            / "node_modules"
            / "typescript"
            / "bin"
            / "tsc"
        )
        tsconfig = project / "tsconfig.json"
        if tsc.is_file() and tsconfig.is_file():
            completed = subprocess.run(
                [
                    "node",
                    str(tsc),
                    "--project",
                    str(tsconfig),
                    "--pretty",
                    "false",
                    "--skipLibCheck",
                    "true",
                ],
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                check=False,
            )
            typescript = {
                "ran": True,
                "exitCode": completed.returncode,
                "stdout": completed.stdout,
                "stderr": completed.stderr,
            }
            if completed.returncode:
                errors.append("TypeScript project check failed")
        else:
            warnings.append("Creator TypeScript compiler or project tsconfig was not found")

    report = {
        "valid": not errors,
        "project": str(project),
        "creatorVersion": package.get("creator", {}).get("version"),
        "assetFileCount": len(asset_files),
        "missingMetaCount": len(missing_meta),
        "missingMeta": missing_meta[:100],
        "typescript": typescript,
        "errors": errors,
        "warnings": warnings,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
