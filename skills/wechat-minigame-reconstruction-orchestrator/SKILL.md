---
name: wechat-minigame-reconstruction-orchestrator
description: Orchestrate authorized WeChat mini-game work from package discovery through target identification, reverse analysis, RESTORE_SPEC generation, Cocos reconstruction, and final validation. Use when the user asks to analyze, reproduce, restore, continue, resume, check progress, or finish a long-running WeChat mini-game project and should not have to choose or sequence the locator, inventory, reverse-expert, and Cocos-restorer skills manually.
---

# WeChat Mini-Game Reconstruction Orchestrator

Own the end-to-end workflow. Do not ask the user to remember phases, select sub-skills,
or restate completed evidence. Delegate domain work to the specialized skills and keep one
machine-readable project state.

## Initialize or resume first

Locate `ORCHESTRATION_STATE.json` in the project root. If missing, initialize:

```shell
python "<skill-dir>/scripts/orchestrate.py" init \
  --project-root "<project-root>" --project-name "<name>"
```

Then run:

```shell
python "<skill-dir>/scripts/orchestrate.py" status \
  --project-root "<project-root>"
```

Treat the returned `activeTarget`, `phase`, `blockers`, and `nextSkill` as authoritative.
Never infer the phase from conversation length. Read
[references/state-contract.md](references/state-contract.md) when repairing state.

## Keep the hierarchy

Route, do not duplicate:

- Use `$wechat-minigame-package-inventory` for cross-platform metadata inventory and
  before/after comparison.
- Use `$wechat-minigame-file-locator` for focused Windows target identification or a
  bounded metadata watch.
- Use `$wechat-minigame-reverse-expert` for authorized package-content analysis,
  engine/logic/schema recovery, `RESTORE_SPEC.json`, and golden cases.
- Use `$cocos-minigame-restorer` only after the restore-spec gate passes, for Cocos
  implementation and validation.

Read [references/routing.md](references/routing.md) for phase-to-skill mapping and artifact
contracts.

## Register one target at a time

After AppID/version is known:

```shell
python "<skill-dir>/scripts/orchestrate.py" register-target \
  --project-root "<project-root>" --app-id "wx..." --version "<version>" \
  --platform windows --activate
```

Store separate state for every AppID/version. If multiple targets exist, keep one active.
Switch only when the user names a target or evidence makes it unambiguous. Never merge
Unity and Cocos findings because they are in the same folder.

Record authorization once:

```shell
python "<skill-dir>/scripts/orchestrate.py" authorize \
  --project-root "<project-root>" --target "wx.../<version>" \
  --scope "user-approved local package analysis and reconstruction"
```

## Record every handoff

After a sub-skill produces an artifact:

```shell
python "<skill-dir>/scripts/orchestrate.py" record-artifact \
  --project-root "<project-root>" --target "wx.../<version>" \
  --kind handoff --path "<absolute path>"
```

Supported kinds include `packageInventory`, `handoff`, `mainPackage`, `extractedRoot`,
`reverseManifest`, `restoreSpec`, `goldenCases`, `cocosProject`, `originalReference`, and
`validationReport`.

Do not record a promised output. Require the path to exist. The script validates handoff
and restore-spec schema where applicable.

## Advance only through gates

Run:

```shell
python "<skill-dir>/scripts/orchestrate.py" advance \
  --project-root "<project-root>" --target "wx.../<version>" --all-ready
```

The state machine enforces:

1. discovery → target identification: package inventory exists;
2. target identification → reverse analysis: target handoff and authorization exist;
3. reverse analysis → restore specification: reverse manifest has
   `reverseAnalysisComplete: true` and a confirmed engine exists;
4. restore specification → implementation: Cocos engine, ready restore spec, and golden
   cases exist;
5. implementation → validation: Cocos project exists;
6. validation → complete: validation report exists and required checks pass.

Never bypass a failed gate by editing the phase directly. Record the missing artifact or
return to the responsible sub-skill.

An in-progress `manifest.json` is evidence, not a completed reverse-analysis handoff. Set
`reverseAnalysisComplete: true` only when that target has finished the reverse-analysis
stage needed for the next phase. Keep it `false` while package reconstruction, engine
confirmation, or required runtime/schema recovery remains open.

## Record validation checks

Use:

```shell
python "<skill-dir>/scripts/orchestrate.py" set-check \
  --project-root "<project-root>" --target "wx.../<version>" \
  --name goldenCases --result pass --evidence "<report or command>"
```

Required completion checks are `goldenCases`, `assetImport`, `typescript`, and
`visualBaseline`. A successful compile is not a visual or gameplay acceptance test.

## Continue autonomously

For “继续”“看进度”“做完它” or similar requests:

1. Run `status` without asking the user to summarize.
2. Verify recorded paths still exist.
3. Invoke `nextSkill` and complete the smallest unfinished stage.
4. Record the produced artifacts and checks.
5. Run `advance --all-ready`.
6. Render the human summary:

```shell
python "<skill-dir>/scripts/orchestrate.py" render-status \
  --project-root "<project-root>"
```

Ask the user only for genuinely external actions or missing authority, such as opening a
target game for a clean metadata diff or approving a package download. Do not ask which
sub-skill to run.

## Preserve evidence and user work

- Keep locator/inventory metadata-only until content analysis is authorized.
- Preserve original packages and recovered assets.
- Never overwrite unrelated project state or user edits.
- Keep historical phase transitions append-only in the orchestration state.
- Mark a target complete only after the validation gate passes.
