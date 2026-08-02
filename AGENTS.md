# HamsterBattle project instructions

## Resume from project state

For any request to analyze, restore, continue, check progress, or finish this WeChat
mini-game reconstruction, use the repository skill at
`skills/wechat-minigame-reconstruction-orchestrator/SKILL.md` first. Treat
`ORCHESTRATION_STATE.json` as authoritative and run the orchestrator `status` command
before choosing work. Do not ask the user to restate completed phases.

Use the specialized repository skills routed by the orchestrator:

- `skills/wechat-minigame-file-locator/`
- `skills/wechat-minigame-package-inventory/`
- `skills/wechat-minigame-reverse-expert/`
- `skills/cocos-minigame-restorer/`
- `skills/wechat-minigame-battlefield-restorer/`

Resolve every bundled script and reference relative to its owning `SKILL.md`. Do not use
machine-specific absolute paths. Keep findings isolated by AppID and version, preserve
source packages and recovered assets, and never bypass an orchestration gate by editing
the phase directly.

If the repository skills are not present in the Codex skill catalog, they can be installed
with `scripts/install-project-skills.ps1`; the checked-in copies remain the source of truth.
