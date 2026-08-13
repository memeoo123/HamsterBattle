---
name: cocos-minigame-restorer
description: Reconstruct and maintain authorized Cocos Creator mini-games from evidence-backed reverse-analysis artifacts. Use when Codex needs to implement or fix a Cocos project from RESTORE_SPEC.json, recovered assets, level tables, or combat formulas; run repeatable validation profiles; or compare a representative level against matched references without inventing missing gameplay.
---

# Cocos Mini-Game Restorer

Build from evidence, not genre assumptions. Preserve the user's project and unrelated
changes. Use one representative level as the fidelity baseline before scaling out.

## Require a restoration contract

Read `RESTORE_SPEC.json`, its evidence index, and `golden-cases.json`. Validate:

```shell
python "<skill-dir>/scripts/validate_restore_spec.py" \
  "<target>/RESTORE_SPEC.json" --require-ready
```

If the gate fails, return the missing evidence to
`$wechat-minigame-reverse-expert`. Do not substitute normalized combat, convenient
coordinates, generic towers, placeholder waves, or guessed UI semantics.

Read [references/restore-contract.md](references/restore-contract.md) when creating or
repairing the contract.

## Stage safely

- Inspect the Cocos Creator version in `package.json` and match the original runtime when
  practical.
- Inspect git status before editing. Preserve user changes.
- When the project is outside the writable workspace, prepare exact source state in a
  writable staging directory and perform one reviewed batch sync.
- Keep original assets immutable. Put crops, converted files, and generated metadata in
  separate output paths with source mappings.
- Do not generate `.meta` UUIDs manually unless the user explicitly requires deterministic
  metadata. Prefer one Creator import pass.

## Restore in this order

1. Establish design resolution, scene anchors, and a minimal observable/debuggable scene.
2. Rebuild the preparation/deployment state and interaction model.
3. Implement deterministic unit creation, targeting, movement, attack timing, and cleanup.
4. Implement confirmed combat, skill/status, economy, reward, and outcome rules without
   adding unsupported attributes.
5. Load the exact representative-level unit, round, scaling, and progression data.
6. Run golden and integration tests through production simulation code; compare event and
   numeric traces, and pass the orchestrator's `mechanicsData` check only when all required
   non-presentation behavior agrees with evidence.
7. Import and bind the recovered backgrounds, UI, bases/objectives, models, and animations
   needed for the faithful scene. Run Creator import and TypeScript validation.
8. Restore fine animation timing, particles, hit/skill effects, camera feedback, damage
   text, audio, fonts, and touch polish.
9. Compare matched captures and replay traces, record remaining differences, and complete
   `visualBaseline` last.

Steps 1–6 are the default priority. A recovered asset may be imported earlier when it is
required to operate or inspect a mechanism, but do not turn that dependency into a general
presentation-polish pass.

Keep simulation logic separable from Cocos nodes so formulas and schedules can be tested
without launching the editor.

Keep gameplay and presentation clocks separate. A production interval, cooldown, or
configuration period does not prove a visible animation speed. Gate every animated object
by phase and validate preparation, battle, pause, speed-up, round-clear, and retry states.

## Maintain completed reconstructions

For a reported regression, run the orchestrator first. Invalidate the affected check and
reopen validation before editing. Identify the earliest divergence, preserve old evidence,
add a failing production-code test, implement the correction, and create a fresh validation
manifest. Do not rely on a build or screenshot produced before the changed source.

## Inspect recovered assets

Use:

```shell
python "<skill-dir>/scripts/inspect_spine_binary.py" model.skel \
  --atlas model.atlas --runtime 3.8

python "<skill-dir>/scripts/inspect_fairygui_package.py" package.bin \
  --output-raw "<workspace>/package.raw"
```

The FairyGUI inspector produces strings and likely component names, not guaranteed layout
coordinates. Require package-format parsing or runtime screenshots before claiming
pixel-perfect positions.

## Verify behavior

Run:

```shell
python "<skill-dir>/scripts/run_golden_cases.py" golden-cases.json
```

Golden cases must cover at least:

- three damage calculations, including a resistance or critical modifier;
- the representative wave schedule;
- base HP change;
- unit creation interval;
- victory and defeat conditions.

Do not call combat faithful when only TypeScript compiles.

## Verify the Cocos project

Run:

```shell
python "<skill-dir>/scripts/check_cocos_project.py" "<project>" \
  --creator-root "<optional Creator version directory>"
```

Read [references/cocos-import-validation.md](references/cocos-import-validation.md) before
running Creator. Check for existing editor/build processes first. Start one bounded build
attempt, capture logs and file activity, and terminate only the exact process started by
the current task if it stalls. Never terminate a pre-existing interactive editor.

Generate one current machine-readable validation summary:

```shell
python "<skill-dir>/scripts/generate_validation_manifest.py" \
  --project "<project>" --profile mechanics \
  --golden-cases "<target>/generated/golden-cases.json" \
  --creator-root "<Creator version directory>" \
  --output "<target>/evidence/runtime/current-validation.json"
```

Profiles are ordered: `fast` runs project/TypeScript and golden checks; `mechanics` also
runs every `tests/*.test.mjs`; `presentation` additionally requires original-reference and
runtime-evidence paths plus an explicit `--visual-baseline-result pass`; `release` also
requires a build output. Set visual baseline to pass only when every required fidelity row
is confirmed. A manifest cannot claim presentation or release success from missing or
approximate evidence.

## Perform visual validation

Read [references/visual-validation.md](references/visual-validation.md). Compare the same
level, phase, round, resolution, and timestamp. Track:

- background/camera crop;
- objective positions and scale;
- UI hierarchy and spacing;
- unit scale, facing, sorting, and animation;
- spawn/movement timing;
- displayed and internal damage/HP values.

Maintain `RESTORE_PROGRESS.md` with `confirmed`, `approximate`, and `missing` fields.
Never describe an approximate recreation as identical.
Record the generated manifest in the orchestrator as `validationManifest`. Do not manually
copy changing test, asset, or build counts into several summaries when the manifest can be
the source of truth.

## Use bundled templates

Copy `assets/RESTORE_SPEC.template.json` only when no reverse handoff exists. Copy
`assets/VALIDATION_REPORT.template.md` into the project and populate it; never put
project-specific evidence back into the skill.
