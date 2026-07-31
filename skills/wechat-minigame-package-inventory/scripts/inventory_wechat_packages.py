#!/usr/bin/env python3
"""Inventory and compare WeChat .wxapkg metadata without reading packages."""

from __future__ import annotations

import argparse
import json
import os
import platform as platform_module
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, Iterator, Optional


APP_ID_PATTERN = re.compile(r"^wx[0-9a-fA-F]{16}$")
MAX_PACKAGE_DEPTH = 6


@dataclass(frozen=True)
class PackageRoot:
    layout: str
    path: str


@dataclass(frozen=True)
class PackageFile:
    layout: str
    package_root: str
    app_id: Optional[str]
    version: Optional[str]
    role: str
    name: str
    full_path: str
    relative_path: str
    size_bytes: int
    modified_utc: str


def utc_iso(timestamp: float) -> str:
    return datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat()


def normalized(path: Path) -> Path:
    return Path(os.path.abspath(os.path.expanduser(str(path))))


def add_root(
    roots: list[PackageRoot],
    seen: set[str],
    layout: str,
    candidate: Path,
) -> None:
    candidate = normalized(candidate)
    try:
        exists = candidate.is_dir()
    except OSError:
        return
    if not exists:
        return

    key = os.path.normcase(str(candidate))
    if key in seen:
        return
    seen.add(key)
    roots.append(PackageRoot(layout=layout, path=str(candidate)))


def child_directories(parent: Path) -> Iterator[Path]:
    try:
        for child in parent.iterdir():
            try:
                if child.is_dir() and not child.is_symlink():
                    yield child
            except OSError:
                continue
    except OSError:
        return


def configured_windows_data_roots(appdata: Path) -> Iterator[Path]:
    config_dir = appdata / "Tencent" / "xwechat" / "config"
    if not config_dir.is_dir():
        return

    try:
        config_files = list(config_dir.glob("*.ini"))
    except OSError:
        return

    for config_file in config_files:
        try:
            if not config_file.is_file() or config_file.stat().st_size > 4096:
                continue
            value = config_file.read_text(
                encoding="utf-8", errors="strict"
            ).strip()
            candidate = Path(value)
            if candidate.is_absolute() and candidate.is_dir():
                yield normalized(candidate)
        except (OSError, UnicodeError):
            continue


def add_windows_account_candidates(
    roots: list[PackageRoot],
    seen: set[str],
    layout: str,
    account_container: Path,
) -> None:
    add_root(roots, seen, layout, account_container / "Applet")
    add_root(roots, seen, layout, account_container / "applet" / "packages")
    for account in child_directories(account_container):
        add_root(roots, seen, layout, account / "Applet")
        add_root(roots, seen, layout, account / "applet" / "packages")


def windows_roots(home: Path, appdata: Path) -> list[PackageRoot]:
    roots: list[PackageRoot] = []
    seen: set[str] = set()

    runtime_bases = [
        appdata / "Tencent" / "xwechat" / "radium",
        appdata / "Tencent" / "WeChat" / "radium",
    ]
    for runtime_base in runtime_bases:
        add_root(
            roots,
            seen,
            "windows-xwechat-radium",
            runtime_base / "Applet" / "packages",
        )
        add_root(
            roots,
            seen,
            "windows-xwechat-radium",
            runtime_base / "applet" / "packages",
        )
        users_root = runtime_base / "users"
        for account in child_directories(users_root):
            add_root(
                roots,
                seen,
                "windows-xwechat-radium-user",
                account / "applet" / "packages",
            )

    documents = home / "Documents"
    add_root(
        roots,
        seen,
        "windows-legacy-applet",
        documents / "WeChat Files" / "Applet",
    )
    add_root(
        roots,
        seen,
        "windows-legacy-applet",
        documents / "xwechat_files" / "Applet",
    )

    for data_root in configured_windows_data_roots(appdata):
        add_windows_account_candidates(
            roots,
            seen,
            "windows-configured-data-root",
            data_root / "xwechat_files",
        )
        add_windows_account_candidates(
            roots,
            seen,
            "windows-configured-data-root",
            data_root / "WeChat Files",
        )

    return roots


def add_globbed_roots(
    roots: list[PackageRoot],
    seen: set[str],
    layout: str,
    base: Path,
    patterns: Iterable[str],
) -> None:
    if not base.is_dir():
        return
    for pattern in patterns:
        try:
            matches = base.glob(pattern)
            for match in matches:
                add_root(roots, seen, layout, match)
        except OSError:
            continue


def macos_roots(home: Path) -> list[PackageRoot]:
    roots: list[PackageRoot] = []
    seen: set[str] = set()
    data = (
        home
        / "Library"
        / "Containers"
        / "com.tencent.xinWeChat"
        / "Data"
    )

    add_root(
        roots,
        seen,
        "macos-wxapplet",
        data / ".wxapplet" / "packages",
    )
    add_root(
        roots,
        seen,
        "macos-cache-applet-release",
        data / "Library" / "Caches" / "applet" / "release",
    )
    add_root(
        roots,
        seen,
        "macos-cache-applet-debug",
        data / "Library" / "Caches" / "applet" / "debug",
    )

    support = (
        data
        / "Library"
        / "Application Support"
        / "com.tencent.xinWeChat"
    )
    add_globbed_roots(
        roots,
        seen,
        "macos-legacy-application-support",
        support,
        (
            "*/WeChat Files/Applet",
            "*/WeChat Files/*/Applet",
            "*/Message/Applet",
            "*/*/Message/Applet",
        ),
    )

    documents = data / "Documents"
    add_windows_account_candidates(
        roots,
        seen,
        "macos-container-documents",
        documents / "xwechat_files",
    )
    add_windows_account_candidates(
        roots,
        seen,
        "macos-container-documents",
        documents / "WeChat Files",
    )

    return roots


def detect_platform(requested: str) -> str:
    if requested != "auto":
        return requested
    system = platform_module.system().lower()
    if system == "windows":
        return "windows"
    if system == "darwin":
        return "macos"
    raise RuntimeError(
        "Unsupported operating system. Use --platform windows or --platform "
        "macos only for an approved mounted profile."
    )


def package_files(root: PackageRoot) -> tuple[list[PackageFile], list[str]]:
    results: list[PackageFile] = []
    errors: list[str] = []
    root_path = Path(root.path)

    def onerror(error: OSError) -> None:
        errors.append(f"{error.filename}: {error.strerror}")

    try:
        walker = os.walk(root_path, topdown=True, onerror=onerror, followlinks=False)
        for current, directories, files in walker:
            current_path = Path(current)
            try:
                relative_dir = current_path.relative_to(root_path)
                depth = len(relative_dir.parts)
            except ValueError:
                directories[:] = []
                continue

            directories[:] = [
                name
                for name in directories
                if not (current_path / name).is_symlink()
            ]
            if depth >= MAX_PACKAGE_DEPTH:
                directories[:] = []

            for name in files:
                if not name.lower().endswith(".wxapkg"):
                    continue
                full_path = current_path / name
                try:
                    if full_path.is_symlink() or not full_path.is_file():
                        continue
                    stat = full_path.stat()
                except OSError as error:
                    errors.append(f"{full_path}: {error}")
                    continue

                relative = full_path.relative_to(root_path)
                segments = relative.parts
                app_id: Optional[str] = None
                version: Optional[str] = None
                for index, segment in enumerate(segments):
                    if APP_ID_PATTERN.fullmatch(segment):
                        app_id = segment.lower()
                        if index + 1 < len(segments):
                            version = segments[index + 1]
                        break

                lower_name = name.lower()
                if lower_name == "__app__.wxapkg":
                    role = "main"
                elif lower_name == "__plugincode__.wxapkg":
                    role = "plugin"
                elif lower_name == "__without_multi_plugincode__.wxapkg":
                    role = "plugin-bundle"
                else:
                    role = "subpackage"

                results.append(
                    PackageFile(
                        layout=root.layout,
                        package_root=root.path,
                        app_id=app_id,
                        version=version,
                        role=role,
                        name=name,
                        full_path=str(normalized(full_path)),
                        relative_path=str(relative),
                        size_bytes=stat.st_size,
                        modified_utc=utc_iso(stat.st_mtime),
                    )
                )
    except OSError as error:
        errors.append(f"{root.path}: {error}")

    return results, errors


def group_packages(packages: list[PackageFile]) -> list[dict[str, object]]:
    groups: dict[tuple[str, str, str], list[PackageFile]] = {}
    for package in packages:
        key = (
            package.package_root,
            package.app_id or "unknown-appid",
            package.version or "unknown-version",
        )
        groups.setdefault(key, []).append(package)

    inventory: list[dict[str, object]] = []
    for (_, app_id, version), files in groups.items():
        ordered = sorted(
            files, key=lambda item: item.modified_utc, reverse=True
        )
        main_packages = [
            item.full_path for item in ordered if item.role == "main"
        ]
        related = [
            item.full_path for item in ordered if item.role != "main"
        ]
        inventory.append(
            {
                "layout": ordered[0].layout,
                "packageRoot": ordered[0].package_root,
                "appId": None if app_id == "unknown-appid" else app_id,
                "version": (
                    None if version == "unknown-version" else version
                ),
                "mainPackage": main_packages[0] if main_packages else None,
                "additionalMainPackages": main_packages[1:],
                "relatedPackages": related,
                "packageFileCount": len(ordered),
                "totalBytes": sum(item.size_bytes for item in ordered),
                "lastModifiedUtc": ordered[0].modified_utc,
                "classification": "unknown-from-metadata",
                "contentRead": False,
            }
        )

    return sorted(
        inventory,
        key=lambda item: str(item["lastModifiedUtc"]),
        reverse=True,
    )


def report_key(item: dict[str, object]) -> str:
    return "|".join(
        (
            os.path.normcase(str(item.get("packageRoot") or "")),
            str(item.get("appId") or "unknown-appid"),
            str(item.get("version") or "unknown-version"),
        )
    )


def candidate_confidence(item: dict[str, object]) -> str:
    if item.get("appId") and item.get("version") and item.get("mainPackage"):
        return "high"
    if item.get("appId") and item.get("version"):
        return "medium"
    return "low"


def compare_reports(
    before: dict[str, object],
    current: dict[str, object],
) -> dict[str, object]:
    before_groups = {
        report_key(item): item for item in before.get("inventory", [])
    }
    changes: list[dict[str, object]] = []
    for item in current.get("inventory", []):
        key = report_key(item)
        previous = before_groups.get(key)
        change = "new"
        if previous is not None:
            unchanged = (
                previous.get("packageFileCount") == item.get("packageFileCount")
                and previous.get("totalBytes") == item.get("totalBytes")
                and previous.get("lastModifiedUtc") == item.get("lastModifiedUtc")
            )
            if unchanged:
                continue
            change = "modified"
        changes.append({"change": change, **item})

    candidates = [
        {
            "platform": current.get("platform"),
            "layout": item.get("layout"),
            "packageRoot": item.get("packageRoot"),
            "appId": item.get("appId"),
            "version": item.get("version"),
            "mainPackage": item.get("mainPackage"),
            "relatedPackages": item.get("relatedPackages", []),
            "confidence": candidate_confidence(item),
            "evidence": "before-after-filesystem-metadata-diff",
            "classification": "unknown-from-metadata",
            "contentRead": False,
        }
        for item in changes
    ]
    return {
        "schemaVersion": "2.0",
        "mode": "diff",
        "sourceReadOnly": True,
        "contentRead": False,
        "platform": current.get("platform"),
        "baselineScannedAtUtc": before.get("scannedAtUtc"),
        "scannedAtUtc": current.get("scannedAtUtc"),
        "summary": {
            "changedGroupCount": len(changes),
            "changedAppIdCount": len(
                {item.get("appId") for item in changes if item.get("appId")}
            ),
        },
        "changes": changes,
        "handoffCandidates": candidates,
        "accessErrors": current.get("accessErrors", []),
    }


def ensure_safe_output(path: Path, roots: list[PackageRoot]) -> Path:
    output = normalized(path)
    for root in roots:
        root_path = normalized(Path(root.path))
        try:
            output.relative_to(root_path)
        except ValueError:
            continue
        raise ValueError(
            f"Output path must not be inside a WeChat package root: {root.path}"
        )
    if not output.parent.is_dir():
        raise ValueError(f"Output parent directory does not exist: {output.parent}")
    return output


def emit_report(
    report: dict[str, object],
    output: Optional[Path],
    roots: list[PackageRoot],
) -> None:
    text = json.dumps(report, ensure_ascii=False, indent=2)
    if output is not None:
        safe_output = ensure_safe_output(output, roots)
        safe_output.write_text(text + "\n", encoding="utf-8")
    print(text)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "List local WeChat .wxapkg files using filesystem metadata only."
        )
    )
    parser.add_argument(
        "--mode",
        choices=("scan", "snapshot", "diff"),
        default="scan",
        help="Scan now, save a full snapshot, or compare against a snapshot.",
    )
    parser.add_argument(
        "--platform",
        choices=("auto", "windows", "macos"),
        default="auto",
    )
    parser.add_argument("--home", type=Path)
    parser.add_argument("--appdata", type=Path)
    parser.add_argument(
        "--custom-root",
        action="append",
        type=Path,
        default=[],
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=200,
        help="Maximum inventory groups to return; 0 returns all.",
    )
    parser.add_argument(
        "--snapshot",
        type=Path,
        help="Snapshot file written by snapshot mode or read by diff mode.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Also write the emitted JSON report to this approved path.",
    )
    return parser


def discover(args: argparse.Namespace) -> tuple[str, list[PackageRoot]]:
    selected_platform = detect_platform(args.platform)
    home = normalized(args.home or Path.home())
    if selected_platform == "windows":
        appdata_value = args.appdata or os.environ.get("APPDATA")
        if not appdata_value:
            raise RuntimeError("APPDATA is unavailable; pass --appdata PATH.")
        roots = windows_roots(home, normalized(Path(appdata_value)))
    else:
        roots = macos_roots(home)

    seen = {os.path.normcase(item.path) for item in roots}
    for custom_root in args.custom_root:
        add_root(roots, seen, "user-approved-custom-root", custom_root)
    return selected_platform, roots


def build_report(
    args: argparse.Namespace,
    selected_platform: str,
    roots: list[PackageRoot],
    include_all: bool,
) -> dict[str, object]:
    packages: list[PackageFile] = []
    access_errors: list[str] = []
    for root in roots:
        root_packages, root_errors = package_files(root)
        packages.extend(root_packages)
        access_errors.extend(root_errors)

    packages.sort(key=lambda item: item.modified_utc, reverse=True)
    inventory = group_packages(packages)
    visible_inventory = (
        inventory
        if include_all or args.limit == 0
        else inventory[: args.limit]
    )
    app_ids = {item.app_id for item in packages if item.app_id}
    versions = {
        (item.app_id, item.version)
        for item in packages
        if item.app_id and item.version
    }

    report = {
        "schemaVersion": "2.0",
        "mode": "snapshot" if include_all else "scan",
        "sourceReadOnly": True,
        "contentRead": False,
        "platform": selected_platform,
        "forcedPlatform": args.platform != "auto",
        "homeOverride": args.home is not None,
        "appdataOverride": args.appdata is not None,
        "scannedAtUtc": datetime.now(timezone.utc).isoformat(),
        "roots": [asdict(item) for item in roots],
        "summary": {
            "rootCount": len(roots),
            "appIdCount": len(app_ids),
            "versionGroupCount": len(versions),
            "inventoryGroupCount": len(inventory),
            "visibleInventoryGroupCount": len(visible_inventory),
            "packageFileCount": len(packages),
            "totalBytes": sum(item.size_bytes for item in packages),
            "classification": "unknown-from-metadata",
            "truncated": len(visible_inventory) < len(inventory),
            "accessErrorCount": len(access_errors),
        },
        "inventory": visible_inventory,
        "accessErrors": access_errors,
    }
    return report


def main() -> int:
    args = build_parser().parse_args()
    if args.limit < 0:
        raise SystemExit("--limit must be 0 or greater.")
    if args.mode in {"snapshot", "diff"} and args.snapshot is None:
        raise SystemExit(f"--snapshot is required in {args.mode} mode.")

    try:
        selected_platform, roots = discover(args)
        if args.mode == "diff":
            snapshot_path = normalized(args.snapshot)
            if not snapshot_path.is_file():
                raise ValueError(f"Snapshot file not found: {snapshot_path}")
            before = json.loads(snapshot_path.read_text(encoding="utf-8"))
            if before.get("schemaVersion") not in {"1.0", "2.0"}:
                raise ValueError(
                    f"Unsupported snapshot schema: {before.get('schemaVersion')}"
                )
            current = build_report(args, selected_platform, roots, True)
            emit_report(compare_reports(before, current), args.output, roots)
            return 0

        report = build_report(
            args,
            selected_platform,
            roots,
            include_all=args.mode == "snapshot",
        )
        if args.mode == "snapshot":
            safe_snapshot = ensure_safe_output(args.snapshot, roots)
            safe_snapshot.write_text(
                json.dumps(report, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
        emit_report(report, args.output, roots)
    except (OSError, RuntimeError, ValueError, json.JSONDecodeError) as error:
        print(json.dumps({"error": str(error)}, ensure_ascii=False))
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
