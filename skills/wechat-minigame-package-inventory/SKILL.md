---
name: wechat-minigame-package-inventory
description: Inventory and compare authorized local WeChat .wxapkg caches on Windows or macOS without opening package contents. Use when Codex needs to list cached AppIDs and versions, summarize main/subpackage metadata, save or diff before/after snapshots, identify changed package groups, or produce a machine-readable handoff for later authorized analysis.
---

# WeChat Mini-Game Package Inventory

Build a cross-platform, metadata-only inventory of local WeChat package caches.

## Guardrails

- Confirm that the user owns the computer or is authorized to inspect its local files.
- Enumerate only candidate directories and `.wxapkg` filesystem metadata.
- Never unpack, decrypt, parse, copy, upload, patch, inject into, or hook a package or WeChat.
- Never inspect credentials, login material, cookies, MMKV values, databases, logs, network tokens, or chat content.
- Do not alter macOS privacy permissions or Windows access controls.
- Treat package type as `unknown-from-metadata`: a `.wxapkg` path alone does not reliably distinguish a mini-game from an ordinary mini program.

## Run the inventory

Resolve `scripts/inventory_wechat_packages.py` relative to this file, then run:

```shell
python "<skill-dir>/scripts/inventory_wechat_packages.py" --platform auto
```

Use `python3` if `python` is unavailable on macOS.

The script:

- detects Windows or macOS;
- checks bounded current and legacy WeChat cache candidates;
- finds `.wxapkg` files without reading their contents;
- groups files by AppID and version;
- returns JSON with roots, totals, main-package paths, related package paths, sizes, and modification times.
- emits schema `2.0` with `sourceReadOnly: true` and `contentRead: false`.

If automatic discovery returns no roots, read [references/platform-layouts.md](references/platform-layouts.md). Ask the user for a custom package root, then run:

```shell
python "<skill-dir>/scripts/inventory_wechat_packages.py" --platform auto --custom-root "<approved-package-root>"
```

Repeat `--custom-root` when the user provides multiple roots. Never replace bounded discovery with an unprompted whole-disk search.

## Present the result

Lead with:

- detected platform and layout;
- root, AppID, version-group, and package-file counts;
- total package bytes;
- access errors or truncated results.

Then show a compact table sorted by latest modification:

| AppID | Version | Main package | Related packages | Total size | Last modified | Classification |
|---|---:|---|---:|---:|---|---|

Label every row `unknown-from-metadata` unless separate authorized evidence establishes that it is a mini-game. Never infer a game title from an AppID.

## Compare before and after

Save snapshots only in the current workspace or another approved directory:

```shell
python "<skill-dir>/scripts/inventory_wechat_packages.py" --mode snapshot --snapshot "<workspace>/.wechat-packages-before.json" --platform auto
```

After the user launches the target game and loads a representative level:

```shell
python "<skill-dir>/scripts/inventory_wechat_packages.py" --mode diff --snapshot "<workspace>/.wechat-packages-before.json" --platform auto
```

Use `handoffCandidates` as candidates, not proof of a game title. Prefer `high`
confidence candidates containing AppID, version, and `__APP__.wxapkg`. Repeat a clean
before/after window when several candidates changed.

On Windows, `$wechat-minigame-file-locator` provides the same focused workflow plus
a bounded metadata-watch mode.

## Optional controls

Use:

```text
--limit N          Return only the N most recently modified groups; 0 returns all.
--platform windows Force Windows candidates.
--platform macos   Force macOS candidates.
--home PATH        Override the home directory for testing or an approved mounted profile.
--appdata PATH     Override Windows APPDATA.
--custom-root PATH Add an exact, user-approved package root.
--mode MODE        Use scan, snapshot, or diff.
--snapshot PATH    Write/read the full metadata baseline.
--output PATH      Also save the emitted JSON report.
```

State when a forced platform or override was used.
