# H04 attack kill-fly runtime evidence

Target: `wxf9af2417e78ce07a/18`

## Confirmed configuration

- `baglike.BagLikeAbilityEffectConfig.json:1045-1068` defines the one-time
  `RG_H04_abl04_eff01` row in group `RG_H04_abl04`: H04 star 8, weight 100,
  quality 2, H04/H09 scope, and card text describing a chance to knock a target
  out of the barrier while excluding Boss units.
- `baglike.BagLikeAbilityEffectiveConfig.json:362-367` joins that row to
  `FEATURE [ATTACK_KILL_FLY, 3000]`.
- `baglike.BagLikeAbilityConfig.json:320-324` is the matching hero-star unlock
  row named `进击的鼠鼠`.

## Confirmed runtime consumer

- `formatted/BagLikeBuffManager.ts.deobfuscated.js:210-219` sends FEATURE rows
  through `addFeatureByHero`; `ATTACK_KILL_FLY` becomes a per-hero feature object
  whose `random` field is the configured `3000`.
- `formatted/FightFormula.ts.deobfuscated.js:71-88` checks kill-fly before normal
  damage. It requires a `MonsterUnit` with `canKillFly`, resolves the original
  hero ID from `attrHeroId` or the live caster, and reads `ATTACK_KILL_FLY` only
  when the triggering skill type is `ATTACK`. `ACTIVE_SKILL` uses a different
  feature and therefore cannot consume this row.
- `formatted/MonsterUnit.ts.deobfuscated.js:113-120`, joined with
  `primitive-variables.json:4603`, defines `canKillFly` as monster type not equal
  to Boss. `formatted/BossUnit.ts.deobfuscated.js:26-30` additionally overrides
  the corresponding getter to false.
- `formatted/BattleManager.ts.deobfuscated.js:135-142` implements the probability
  as an inclusive integer roll: `randomInt(0, 10000) <= 3000`.
- `formatted/FightFormula.ts.deobfuscated.js:89-101` returns status `Kill` and
  value `999999` on success. Because this branch precedes dodge, critical and the
  regular damage pipeline, a successful kill-fly consumes none of those later RNG
  reads. A failed eligible roll continues through ordinary damage.

## Reconstruction contract

- The row enters the weighted pool only when the used-family check includes H04
  or H09 and the saved H04 star is at least 8; it is selectable once.
- Selected H04/H09 ordinary attacks roll the recovered inclusive 3000/10000
  feature at impact for each eligible non-Boss monster.
- Boss targets and non-basic skill hits do not consume the kill-fly RNG roll.
- Success applies the shipped `999999` damage before the normal dodge/critical
  calculation. Existing shield/damage delivery remains downstream, matching the
  common BattleManager hurt route.
- The target account's actual H04 star remains external evidence; reconstruction
  therefore retains the conservative star-1 default and exposes the behavior only
  through the verified star gate.
