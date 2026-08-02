# Battlefield restoration plan

Target: `wxf9af2417e78ce07a/18`, representative level `1004 / 荒漠沙地`.

`BATTLEFIELD_RESTORE_STATE.json` is the machine-readable authority. The current execution
priority is mechanics and data; presentation work resumes only after the mechanics content
and integration slices below.

## Milestone 1: complete representative content behaviors

- Restore H11 as a complete preparation → production → healing vertical slice.
- Route and implement the remaining level-1004-relevant BagLike ability effects.
- Join account unlock/star inputs and remaining condition/verify consumers when evidence is
  available.

Gate: every enabled candidate and trait has a real runtime consumer and deterministic tests;
unsupported content is excluded rather than inert.

## Milestone 2: lock event and random order

- Recover first core-contact timing and same-frame entity/event ordering.
- Lock RNG call order for combat and spawn decisions.
- Cover simultaneous death, pending projectile and phase-transition boundaries.

Gate: a fixed seed and fixed preparation state reproduce the same timestamped trace.

## Milestone 3: complete the level-1004 integration flow

- Run preparation through all 15 waves and victory without state edits.
- Run defeat, retry and loss compensation without state edits.
- Verify relevant persistence across the required lifecycle.

Gate: all required non-presentation subsystems reach at least `integration-pass`.

## Milestone 4: matched replay and presentation

- Reproduce the competitor's developed 1004 account/loadout state.
- Compare spawn, target, hit, HP, currency, phase and outcome traces first.
- Only after trace agreement, finish models, projectiles, effects, audio, HUD and exact
  layout/timing.

Gate: every required subsystem reaches `replay-pass`; no deferred item or blocker remains.

## Milestone 5: expand beyond the representative level

- Restore remaining hero/gear/fusion families and monster/Boss behaviors.
- Apply verified runtime consumers across the approximately 200 decoded levels and special
  modes.

Gate: do not extrapolate level-1004 fidelity to the full game without per-content runtime
coverage and representative tests.

Resume details and validation commands are in `MECHANICS_DATA_HANDOFF.md`.

