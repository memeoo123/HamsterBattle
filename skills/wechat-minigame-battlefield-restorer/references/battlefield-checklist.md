# Battlefield restoration checklist

Use this list to define scope and find the earliest behavioral divergence. A row is not
complete until its runtime consumer, implementation, and validation are all accounted for.

## 1. Baseline and observability

- AppID/version, representative level, mode, loadout, difficulty, loss count, and RNG.
- Design resolution, frame rate, battle speed, pause state, phase, round, and timestamp.
- Original video/screenshots with visible HP, currency, wave, units, damage, and result.
- A structured event trace vocabulary: phase, spawn, target, move/range entry, cast,
  hit/miss/crit, damage/heal, buff add/remove, death, reward, and outcome.

## 2. Phase, preparation, and economy

- Entry, deal/refresh, drag, invalid drop, return, swap, rotate if supported, and cleanup.
- Grid dimensions, origin, indexing direction, unlock state, core/reserved cells, shape
  matrices, anchor cell, boundary and overlap rules, and rendered footprint.
- Merge recipes, candidate-vs-grid merge, result position/shape, maximum level, cross-family
  recipes, and rejection behavior.
- Free/paid/ad refresh counters, costs, weighted drops after fixed batches, currency
  production, timing, carry-over, and per-round reset.
- Battle-start conversion from placed gear to producers/units and unused-candidate cleanup.

## 3. Entities, deployment, and production

- Complete base and secondary attributes for every representative entity and level.
- Gear-level multipliers, production interval, immediate spawn, max alive, spawn anchor,
  lane/offset, summons, and producer disable/death rules.
- Camp/objective HP, targetability, collision/range radius, reward, boss flag, and attack type.

## 4. Simulation clock and event order

- Source time unit, fixed/variable step, pause, speed multiplier, and timer ownership.
- Same-frame order among spawn, movement, target acquisition, cast, hit, death, reward,
  wave clear, and phase transition.
- Pending hit/projectile behavior when attacker or target dies, disappears, or moves.
- Deterministic RNG source and call order for hit, crit, target tie-break, and spawn offset.

## 5. Targeting and movement

- Target filters, team/type priority, nearest/first/lowest-HP rules, tie-breaks, search
  interval, search range, attack range, target lock, and retarget conditions.
- Coordinate axes, direction, speed formula, stopping distance, collision/overlap, lane
  changes, knockback, teleport, and home/objective fallback.
- Melee, ranged, projectile, area, chain, summon, and objective attacks as separate paths.

## 6. Attack and damage pipeline

- Base attack and all multiplier stages, units (for example 10000 = 100%), and exact
  integer conversion point after every stage.
- Cooldown/attack-speed formula, cast time, animation event, hit delay, projectile speed,
  multi-hit interval, and interruption.
- Hit/dodge, crit probability and factor, skill effect ratio, damage increase, boss bonus,
  typed hero/tower/spell/physical resistance, penetration, vulnerability, shield, minimum
  damage, healing, overkill, and home/objective damage.
- Attribute snapshot vs live lookup and buff ordering. Test zero, negative, capped, and
  fractional intermediate values.

## 7. Skills, buffs, and statuses

- Skill trigger, target, cooldown, cast count, effect list, ratio, radius, duration, stack,
  refresh, dispel, immunity, periodic tick, aura, passive, and death trigger.
- Runtime handlers for every referenced skill/effect/status ID; unused config is not proof.
- Visual/audio hooks must subscribe to simulation events and never drive gameplay timing.

## 8. Waves, scaling, outcomes, and persistence

- Spawn schedule, entity order, round multipliers, difficulty, loss compensation, endless
  scaling, special rounds, and boss transitions.
- Schedule-complete vs enemies-alive semantics, base death, simultaneous death, timeout,
  round clear, victory, defeat, rewards, retry, and return to preparation.
- Values reset or persisted across round, retry, level, and session.

## 9. Presentation and matched replay

- Background/camera crop, anchors, unit scale/facing/sorting, animation names and speed.
- Health bars, HUD, damage/crit/miss text, projectile, hit/skill/status effects, audio, and
  result UI.
- Compare the same timestamp checkpoints and event trace. Correct the first divergence;
  later differences may be downstream symptoms.

## Minimum deterministic suite

- Preparation: valid/invalid multi-cell placement, core overlap, boundary, merge success
  and rejection, refresh economy, weighted-deal boundary, and battle-start cleanup.
- Timing: immediate and interval spawn, pause/speed, cooldown, cast-to-hit delay, pending hit
  after death, and simultaneous events.
- Combat: normal, miss, critical, typed resistance, boss, skill, objective, shield/heal,
  rounding boundary, and minimum damage.
- Flow: every representative wave, non-final clear, final victory, defeat, retry, and loss
  compensation.
- Replay: timestamped spawn/target/hit/HP/currency/phase trace for one full original battle.
