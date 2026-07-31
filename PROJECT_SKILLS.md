# Project skills

The repository copy under `skills/` is the source of truth for this project's Codex
workflow. It contains the complete reconstruction chain:

| Skill | Responsibility |
|---|---|
| `wechat-minigame-reconstruction-orchestrator` | Own the state machine and choose the next stage. |
| `wechat-minigame-file-locator` | Locate Windows package files using metadata only. |
| `wechat-minigame-package-inventory` | Inventory and compare package caches. |
| `wechat-minigame-reverse-expert` | Recover engine, logic, schemas, restore spec, and golden cases. |
| `cocos-minigame-restorer` | Implement and validate the Cocos reconstruction. |

## Set up on another device

After cloning the repository, run PowerShell from the repository root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-project-skills.ps1
```

If an older copy is already installed, replace it while preserving a timestamped backup:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-project-skills.ps1 -Force
```

The default destination is `$env:CODEX_HOME\skills`, or
`%USERPROFILE%\.codex\skills` when `CODEX_HOME` is unset. Use `-Destination` only for a
nonstandard Codex installation. Open a new Codex task after installation so the skill
catalog refreshes.

`AGENTS.md` also directs Codex to the repository copies, so the project workflow and
state remain discoverable before installation. Continue from `ORCHESTRATION_STATE.json`;
do not reconstruct progress from chat history.

## Maintain the bundle

Edit the repository copy first. Validate every changed skill with Codex's
`quick_validate.py`, run the relevant script tests, reinstall with `-Force`, and commit
the skill change together with any state-contract migration it requires.

Generated dependencies and editor caches remain intentionally untracked. Restore them
with each subproject's package manager or Cocos Creator after cloning.
