# H02 barrage-time runtime contract

## Scope

- Target: `wxf9af2417e78ce07a/18`
- Ability group: `RG_H02_abl03`
- Reconstruction consumers: H02 and H07 units created after the trait is selected
- Evidence date: 2026-08-07

## Decoded configuration chain

`baglike.BagLikeAbilityEffectConfig` contains two quality-4, weight-50, one-time
rows in the same group and with the same `H02/H07` range:

| row | H02 star | effective action | card text |
|---|---:|---|---|
| `RG_H02_abl03_eff01` | 7 | `ADD_SKILL / 2001_5` | after 6 seconds, barrage time lasts 3 seconds |
| `RG_H02_abl03_eff02` | 8 | `ADD_SKILL / 2001_6` | barrage duration increases to 4 seconds |

`BattleExSkillManager.getSkills()` appends these skills only while a unit skill list
is being built. Existing H02/H07 units are not retrofitted; later-created units
snapshot the selected highest qualified row.

The active-skill rows in `battle.SkillConfig` are the authoritative runtime:

| skill | `precd` | `cd` | `castTime` | configured behavior delays |
|---|---:|---:|---:|---|
| `2001_5` | 6000 ms | 6000 ms | 2000 ms | 200, 400, 600, 600, 800, 1000, 1200, 1400, 1600 ms |
| `2001_6` | 6000 ms | 6000 ms | 3000 ms | 500, 1000, 1500, 2000, 2500, 3000, 3500 ms |

Every entry runs `2001_bh5`, which inherits the skill target and launches
`M_SS_2005`. The missile is type 1, speed 700, has a 1000-ms lifetime and 2000
distance limit, uses model `H29_S1`, and resolves `M_SS_2005_1` at an effect ratio
of 5000 (50% attack).

## Runtime ordering and version-18 disconnects

- `BattleAttr.getActiveSkill()` gives the ready type-2 active skill priority over
  the index-0 basic attack. Its initial pre-cooldown is six seconds.
- `SkillBehavior.actionEffect()` refreshes the six-second cooldown on the first
  behavior effect, not at cast start. All later behaviors in the same cast share
  that cooldown refresh guard.
- `BattleUnit.update()` advances waiting behaviors before it decrements the cast
  end timer. The `2001_6` behavior exactly at 3000 ms therefore fires.
- When cast time ends, `attackActionComplete()` calls `removeSkillBehavoirs()`.
  Consequently the configured `2001_6` behavior at 3500 ms is removed and never
  launches. The effective shot counts are therefore nine for star 7 and six for
  star 8.
- `2001_bf5` and `2001_bf6` do exist as 3/4-second Buff groups containing
  `ATK_SPD +30000`, but no decoded behavior or BagLike effective row references
  either group. Applying those Buffs would invent an absent runtime edge, so the
  reconstruction does not add a 300% attack-speed state.
- The card's 3/4-second duration and the skill rows' 2/3-second casts conflict.
  The reconstruction follows the reachable active-skill chain and records the
  card/Buff data as disconnected presentation/configuration.

## Reconstruction contract

- Only the highest H02-star-qualified row enters the weighted pool; the safe
  account default remains H02 star 1.
- Later-created H02/H07 units wait six seconds, lock the active skill's initial
  target, stop moving and using basic attacks for the recovered cast time, and
  launch the effective delayed missiles at 50% attack and speed 700.
- Attack is snapshotted when the active skill begins. A delayed behavior does not
  retarget after the locked unit dies; already launched projectiles keep their
  launch snapshot.
- The special skill does not advance H07's H01 index-0 basic-attack counter, but
  its damage may consume an already armed one-use forced critical.
- Exact `H29_S1` projectile presentation is still pending because that resource is
  not present in the current Cocos asset tree.

## Validation coverage

- `baglike-traits.test.mjs` locks row metadata, star 7/8 replacement, one-time cap,
  H02/H07 scope, skill IDs, cast timings, delays, ratio and speed.
- `battlefield-kernel.test.mjs` locks coarse-frame delay crossing, the duplicate
  600-ms behaviors, exact cast-boundary firing and removal of the 3500-ms orphan.
- Creator TypeScript and the full rule/resource suite remain required before the
  slice is recorded as restored.
