---
name: wechat-minigame-reverse-expert
description: Analyze authorized WeChat mini-game packages and extracted projects with CLI-first, evidence-based workflows. Use for package decryption or unpacking, subpackage reconstruction, Cocos/Laya/Unity fingerprinting, JavaScript or WASM static analysis, Cocos module extraction, compact-table decoding, level-schema recovery, or producing a verified RESTORE_SPEC.json handoff. Isolate progress by AppID and version so parallel targets never share conclusions.
---

# WeChat Mini-Game Reverse Expert

Analyze only artifacts the user owns or is authorized to inspect. Record authorization
once for each target and keep it in that target's progress file.

## Enforce target isolation

Never mix two AppIDs or versions in one progress record. Initialize or resume:

```shell
python "<skill-dir>/scripts/init_target_workspace.py" \
  --analysis-root "<analysis-root>" \
  --app-id "wx..." \
  --version "<version>" \
  --handoff "<optional locator/inventory JSON>"
```

Use:

```text
<analysis-root>/
├─ REVERSE_TARGETS.json
└─ targets/<appid>/<version>/
   ├─ REVERSE_PROGRESS.md
   ├─ manifest.json
   ├─ evidence/
   ├─ generated/
   └─ work/
```

Read the selected target's `REVERSE_PROGRESS.md` before inspecting artifacts. Update it
after a completed stage and before ending substantive analysis. Never silently replace a
confirmed finding; append a correction with new evidence.

## Preserve evidence integrity

- Preserve source packages and write every transformation to `work/` or `generated/`.
- Capture SHA-256 only after the user has authorized content analysis; locator and
  inventory handoffs intentionally contain metadata only.
- Cite text as `path:line`. For one-line minified files, retain offsets or a mapping to
  a formatted derivative.
- Cite binary findings with path, offset range, bytes/decoded value, and parser command.
- Mark incomplete claims `[待确认]` and state the smallest verification action.
- Record exact commands, tool versions, exit codes, and meaningful failures.
- Inspect and pin third-party tools before downloads or execution. Obtain approval for
  network downloads, dependency installation, or untrusted code.

## Run the first incomplete stage

1. Inventory inputs and hash authorized source artifacts.
2. Verify a pinned toolchain.
3. Decrypt/unpack into a separate directory and validate outputs.
4. Reconstruct main/subpackage relationships from loaders and configuration.
5. Fingerprint the engine with at least two independent indicators.
6. Trace runtime logic from bootstrap/configuration to business behavior.
7. Recover level/resource schemas and validate them against multiple records.
8. Produce the restoration handoff only after the implementation gate passes.

For engine-specific routing:

- Read [references/cocos-analysis.md](references/cocos-analysis.md) for Cocos bundles,
  `System.register`, compact local data, FairyGUI, Spine, and the bundled scripts.
- Read [references/unity-analysis.md](references/unity-analysis.md) for UnityPlugin,
  WASM split, data packages, AssetBundles, and path-mapping evidence.
- Read [references/handoff-contracts.md](references/handoff-contracts.md) before consuming
  locator/inventory JSON or producing `RESTORE_SPEC.json`.

## Apply the implementation gate

Do not start a playable reconstruction from genre, filenames, or screenshots alone.
Before handoff, confirm or explicitly mark unknown:

- gameplay loop and phase transitions;
- scene coordinate system and stable anchors;
- player/enemy bases or equivalent objectives;
- unit/gear/tower creation rules and timings;
- targeting, movement, hit delay, cooldown, and damage equations;
- level/round schedules and scaling multipliers;
- asset paths, atlas rectangles, animation names, and UI hierarchy;
- at least one representative level with expected numeric outcomes.

Write unresolved values as structured unknowns with verification plans. Never replace
them with convenient normalized values.

## Produce the restoration handoff

Create `generated/RESTORE_SPEC.json` following
[references/handoff-contracts.md](references/handoff-contracts.md). Every nontrivial value
must carry a status (`confirmed`, `inferred`, or `unknown`) and evidence references.

Create `generated/golden-cases.json` containing representative:

- damage calculations;
- wave spawn times and identities;
- base HP transitions;
- unit creation intervals;
- success/failure conditions.

When the user requests implementation, hand these artifacts to
`$cocos-minigame-restorer`. Keep analysis and reconstruction as separate stages.

## Use bundled scripts

Resolve scripts relative to this skill:

- `init_target_workspace.py`: create/resume an isolated target.
- `analyze-cocos-static.js`: summarize likely Cocos entry points.
- `capture-cocos-module-registry.js`: capture registered modules in an isolated VM.
- `extract-cocos-module-source.js`: extract selected module factories separately.
- `analyze-cocos-localdata.ps1`: decode the observed compact ZIP/table family.
- `build-cocos-level-model.ps1`: join trunk levels, rounds, monsters, rewards, and skills.
- `analyze-cocos-nonmain-rounds.ps1`: classify unreferenced/non-main rounds.
- `build-cocos-special-mode-model.ps1`: model daily/endless/extra-monster scaling.
- `export-normal-level-runtime-data.ps1`: export reconstruction-oriented level JSON.

Treat schema-specific postprocessors as candidates: first verify required table names and
column semantics. Never force them onto an unrelated game.

## Report findings

Use `[已确认]` or `[待确认]`, followed by evidence, verification command, and impact.
Finish with the completed stage, blocker, and next one to three smallest actions.

