---
name: cocos-minigame-restorer
description: Reconstruct authorized Cocos Creator mini-games from evidence-backed reverse-analysis artifacts. Use when Codex needs to turn RESTORE_SPEC.json, golden cases, recovered Cocos assets, FairyGUI packages, Spine models, level tables, or combat formulas into a playable Cocos project; validate imports and TypeScript; and compare a representative level against original screenshots or recordings without inventing missing gameplay.
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

## Use bundled templates

Copy `assets/RESTORE_SPEC.template.json` only when no reverse handoff exists. Copy
`assets/VALIDATION_REPORT.template.md` into the project and populate it; never put
project-specific evidence back into the skill.
