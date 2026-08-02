---
name: wechat-minigame-battlefield-restorer
description: Restore an authorized WeChat mini-game battlefield as an evidence-backed, testable system across preparation, grid occupancy and merging, deployment, unit production, targeting, movement, attack timing, damage, skills, buffs, waves, scaling, victory/defeat, and audiovisual feedback. Use when the reconstructed battle feels unlike the original, combat formulas or preparation behavior are incomplete, a representative level needs high-fidelity restoration, or Codex must plan, implement, audit, or validate battlefield fidelity without treating compilation or a few numeric cases as completion.
---

# WeChat Mini-Game Battlefield Restorer

Restore the battlefield as a connected deterministic system. Coordinate reverse analysis
and Cocos implementation; do not replace either owning skill.

## Resume the target first

If the project contains `ORCHESTRATION_STATE.json`, invoke
`$wechat-minigame-reconstruction-orchestrator` first and run its `status` command. Keep
the active AppID/version authoritative and never edit the orchestration phase to bypass a
gate.

Read, when present:

- the target's `REVERSE_PROGRESS.md`, `RESTORE_SPEC.json`, `golden-cases.json`, and raw
  battle evidence;
- the reconstruction's `RESTORE_PROGRESS.md`, validation report, simulation source, and
  tests;
- `BATTLEFIELD_RESTORE_STATE.json`, resuming its first incomplete subsystem.

Copy `assets/BATTLEFIELD_RESTORE_STATE.template.json` into the active target when the
state file is missing. Keep all paths and findings isolated by AppID/version.

## Keep evidence and implementation separate

Route package/runtime/schema recovery to `$wechat-minigame-reverse-expert`. Route Cocos
code, assets, preview, and integration checks to `$cocos-minigame-restorer`.

Accept a behavior as confirmed only from source code, decoded configuration joined to its
runtime consumer, or a controlled original-game observation. A configuration row proves
an input, not the final runtime behavior. Mark every unresolved branch explicitly; never
fill it with a genre default.

Read [references/battlefield-checklist.md](references/battlefield-checklist.md) before
scoping or auditing a battlefield. Read
[references/state-contract.md](references/state-contract.md) before creating or changing
the state file.

## Restore in dependency order

1. **Lock the baseline.** Name one representative level, resolution, loadout, random seed
   or controlled choices, phase, wave, speed, and capture timestamps. Obtain original
   screenshots/video plus observable HP, currency, spawn, and result values.
2. **Recover the phase and preparation model.** Confirm phase transitions, refresh/deal
   economy, candidate lifecycle, unlocks, footprint occupancy, drag/drop, swapping,
   merging, battle-start cleanup, and inter-round reset before tuning combat.
3. **Recover the simulation kernel.** Confirm clock units, speed/pause semantics, entity
   creation, coordinate space, target selection, movement, range tests, attack wind-up,
   hit/projectile delay, cooldown, retargeting, death, and event ordering.
4. **Recover numeric combat.** Trace base attributes through level/round/defeat scaling,
   attack type, hit/dodge, critical, effect ratio, typed resistance, increases, shields,
   healing, integer rounding, and minimum/maximum rules. Cover normal, critical, resisted,
   missed, home/objective, boss, and skill damage separately.
5. **Recover content behaviors.** Implement every representative-level hero, monster,
   boss, producer, active/passive skill, buff/debuff, status, summon, and special target
   rule. Prove that configured IDs actually reach the recovered runtime handlers.
6. **Recover rounds and outcomes.** Reproduce schedules, multipliers, compensation after
   loss, rewards, victory/defeat, preparation return, retry, and relevant persistence.
7. **Restore presentation last.** Map models, facing, scale, sorting, animations, hit/skill
   effects, damage text, audio, HUD, and result UI to already-correct simulation events.
8. **Replay the same battle.** Compare timestamped event traces and matched visual
   captures. Fix the earliest divergence before later cosmetic differences.

Work as vertical slices, but do not implement a slice until its connected evidence is
confirmed. Keep simulation logic independent from Cocos nodes and randomness injectable
so deterministic tests can run without the editor.

### Keep presentation from preempting mechanics

Use only enough scene, UI, animation state, and debug feedback to operate and observe the
current mechanism. While any required preparation, economy, simulation, numeric combat,
content behavior, wave, reward, persistence, or outcome subsystem is incomplete, do not
schedule fine animation matching, particles, hit/skill effects, camera polish, audio,
font polish, or decorative feedback as the next task. Record those differences, but leave
them in the presentation backlog.

Set the orchestrator's `mechanicsData` check to pass only after the representative level
clears the evidence, deterministic, and integration gates for all required non-presentation
subsystems. This milestone means the game rules and data are acceptance-ready; it does not
claim visual or audio fidelity. After it passes, presentation and matched visual/audio
replay become the active tier.

## Enforce four gates

1. **Evidence gate:** every required subsystem for the selected slice is confirmed, its
   runtime path is cited, and unresolved branches have verification actions.
2. **Deterministic gate:** tests cover event order and numeric results, including boundary
   and negative cases; tests exercise production simulation code, not a duplicate formula.
3. **Integration gate:** one representative battle runs through preparation, all rounds,
   victory and defeat/retry without manual state edits.
4. **Matched replay gate:** original and reconstruction use the same scenario and timeline;
   spawn, target, hit, HP, currency, phase, and result traces agree within explicitly
   evidenced tolerances, followed by visual/audio comparison.

Compilation, asset import, a playable screen, or isolated formula examples do not satisfy
these gates.

Validate state integrity with:

```shell
python3 "<skill-dir>/scripts/validate_battlefield_state.py" \
  "<target>/BATTLEFIELD_RESTORE_STATE.json"
```

Use `--require-evidence-gate` before implementing all remaining battlefield systems and
`--require-complete` before claiming battlefield fidelity.

## Report progress

Lead with the earliest divergence from the original. Then report:

- confirmed evidence added;
- implementation and deterministic tests changed;
- current gate and blocker;
- the next one to three smallest actions.

Claim `representative-level` only after all required subsystems reach integration or replay
validation. Claim `battlefield-faithful` only after all required subsystems reach matched
replay, no subsystem is deferred, and no blocker remains.
