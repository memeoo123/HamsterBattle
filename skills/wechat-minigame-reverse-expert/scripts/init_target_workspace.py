#!/usr/bin/env python3
"""Create or resume an AppID/version-isolated reverse-analysis workspace."""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path


APP_ID = re.compile(r"^wx[0-9a-fA-F]{16}$")
SAFE_VERSION = re.compile(r"^[A-Za-z0-9._-]+$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--analysis-root", required=True, type=Path)
    parser.add_argument("--app-id", required=True)
    parser.add_argument("--version", required=True)
    parser.add_argument("--handoff", type=Path)
    parser.add_argument("--engine", default="unknown")
    return parser.parse_args()


def load_handoff(path: Path | None) -> dict:
    if path is None:
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schemaVersion") not in {"2.0"}:
        raise ValueError("Handoff must use schemaVersion 2.0")
    candidates = data.get("handoffCandidates") or []
    return {"source": str(path.resolve()), "candidates": candidates}


def main() -> int:
    args = parse_args()
    app_id = args.app_id.lower()
    if not APP_ID.fullmatch(app_id):
        raise SystemExit("--app-id must match wx followed by 16 hex characters")
    if not SAFE_VERSION.fullmatch(args.version):
        raise SystemExit("--version may contain letters, digits, dot, underscore, or dash")

    root = args.analysis_root.resolve()
    root.mkdir(parents=True, exist_ok=True)
    target = root / "targets" / app_id / args.version
    for name in ("evidence", "generated", "work"):
        (target / name).mkdir(parents=True, exist_ok=True)

    now = datetime.now(timezone.utc).isoformat()
    handoff = load_handoff(args.handoff)
    manifest_path = target / "manifest.json"
    resumed = manifest_path.exists()
    if resumed:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    else:
        manifest = {
            "schemaVersion": "1.0",
            "target": {
                "appId": app_id,
                "version": args.version,
                "engine": args.engine,
            },
            "authorization": {"status": "to-confirm", "scope": ""},
            "createdAtUtc": now,
            "updatedAtUtc": now,
            "sourceArtifacts": [],
            "generatedArtifacts": [],
            "commands": [],
            "engineEvidence": [],
            "currentStage": "inventory-inputs",
            "handoff": handoff,
        }
        manifest_path.write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    progress_path = target / "REVERSE_PROGRESS.md"
    if not progress_path.exists():
        progress_path.write_text(
            (
                "# REVERSE_PROGRESS\n\n"
                "## 目标\n\n"
                f"- AppID: `{app_id}`\n"
                f"- 版本: `{args.version}`\n"
                f"- 引擎: `{args.engine}`\n"
                "- 授权范围: [待确认]\n"
                "- 当前阶段: 输入盘点\n"
                f"- 最后更新: {now}\n\n"
                "## 阶段\n\n"
                "| 阶段 | 状态 | 输出 | 证据 |\n"
                "|---|---|---|---|\n"
                "| 输入盘点 | 进行中 | | |\n"
                "| 解密/解包 | 未开始 | | |\n"
                "| 分包重建 | 未开始 | | |\n"
                "| 引擎识别 | 未开始 | | |\n"
                "| 静态逻辑 | 未开始 | | |\n"
                "| 数据 Schema | 未开始 | | |\n"
                "| 还原交接 | 未开始 | | |\n\n"
                "## 已确认结论\n\n"
                "| ID | 结论 | 证据 | 验证命令 | 影响 |\n"
                "|---|---|---|---|---|\n\n"
                "## 待确认\n\n"
                "| ID | 假设 | 缺失证据 | 验证方案 |\n"
                "|---|---|---|---|\n\n"
                "## 阻塞点\n\n- 无。\n\n"
                "## 下一步\n\n- [ ] 确认授权并登记源文件。\n"
            ),
            encoding="utf-8",
        )

    index_path = root / "REVERSE_TARGETS.json"
    index = {"schemaVersion": "1.0", "targets": []}
    if index_path.exists():
        index = json.loads(index_path.read_text(encoding="utf-8"))
    key = f"{app_id}/{args.version}"
    targets = [item for item in index.get("targets", []) if item.get("key") != key]
    targets.append(
        {
            "key": key,
            "path": str(target.relative_to(root)),
            "engine": manifest["target"].get("engine", "unknown"),
            "currentStage": manifest.get("currentStage", "inventory-inputs"),
            "updatedAtUtc": now,
        }
    )
    index["targets"] = sorted(targets, key=lambda item: item["key"])
    index_path.write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        json.dumps(
            {
                "status": "resumed" if resumed else "created",
                "targetRoot": str(target),
                "manifest": str(manifest_path),
                "progress": str(progress_path),
                "index": str(index_path),
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

