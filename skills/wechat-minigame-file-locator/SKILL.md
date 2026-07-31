---
name: wechat-minigame-file-locator
description: Locate authorized WeChat mini-game package files on Windows without opening or extracting them. Use when Codex needs to find xwechat/Radium or legacy package roots, identify a target AppID/version with before/after snapshots or a bounded metadata watch, rank changed package groups, or produce a machine-readable handoff for later authorized analysis.
---

# WeChat Mini-Game File Locator

Locate package files without reading their contents. Treat the result as an inventory for a later, separately authorized workflow.

## Guardrails

- Confirm that the user owns the files or is authorized to inspect them.
- Read only directory entries and `.wxapkg` filesystem metadata.
- Never unpack, decrypt, patch, inject into, or hook WeChat or a mini-game.
- Never inspect credentials, login material, cookies, MMKV values, databases, network tokens, logs, or chat content.
- Write snapshots only inside the current workspace or another user-approved output directory.
- Keep `contentRead: false`; do not hash packages in this metadata-only stage.
- Do not identify an AppID as a named game without evidence from the user or visible, authorized UI.

## Run a normal scan

Resolve `scripts/locate_wechat_minigame_packages.ps1` relative to this file, then run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "<skill-dir>\scripts\locate_wechat_minigame_packages.ps1" -Mode Scan
```

Report:

- each detected package root;
- package, AppID, and version counts;
- the most recently modified main packages and subpackages;
- whether the result came from current `xwechat/Radium` or a legacy layout.

Do not run an unbounded whole-drive search. If no root is found, read [references/windows-layouts.md](references/windows-layouts.md), check its bounded candidates, then ask the user for any custom WeChat storage path.

## Identify one target game

Use a before/after filesystem-metadata comparison:

1. Create a snapshot directory inside the current workspace.
2. Capture the baseline:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "<skill-dir>\scripts\locate_wechat_minigame_packages.ps1" -Mode Snapshot -SnapshotPath "<workspace>\.wechat-minigame-locator\before.json"
```

3. Ask the user to open the target in desktop WeChat and enter a representative level. Pause until the user confirms.
4. Compare the current state:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "<skill-dir>\scripts\locate_wechat_minigame_packages.ps1" -Mode Diff -SnapshotPath "<workspace>\.wechat-minigame-locator\before.json"
```

5. Rank changed groups by modification time. Prefer an AppID group containing `__APP__.wxapkg`; include changed subpackages belonging to the same AppID and version.
6. If several AppIDs changed, present the candidates and repeat the snapshot around one clean launch rather than guessing.

If no files change, ask the user to confirm that the game was launched in desktop WeChat and that the relevant level finished loading. Some games or resources may not be available in the desktop client.

## Use a bounded watch when timing is uncertain

Run a short metadata-only polling window while the user launches the game:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "<skill-dir>\scripts\locate_wechat_minigame_packages.ps1" -Mode Watch -DurationSeconds 30 -OutputPath "<workspace>\.wechat-minigame-locator\watch.json"
```

Keep agent-side waits below 60 seconds. Increase `DurationSeconds` only when the user
explicitly wants a longer monitor. Watch mode does not copy, hash, or open packages.

## Return the handoff

Return a compact result with:

```json
{
  "platform": "xwechat-radium",
  "packageRoot": "absolute path",
  "appId": "wx...",
  "version": "version folder",
  "mainPackage": "absolute path or null",
  "relatedPackages": ["absolute paths"],
  "confidence": "high | medium | low",
  "evidence": "before-after metadata diff",
  "classification": "unknown-from-metadata",
  "contentRead": false
}
```

Use `handoffCandidates` emitted by Diff or Watch. State clearly when the root was found
but the target AppID remains unidentified. Do not carry package titles inferred from
filenames into the next stage.
