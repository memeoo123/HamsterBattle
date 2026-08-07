# H02 split-shot runtime evidence

## Scope

- Target: `wxf9af2417e78ce07a/18`
- Ability group: `RG_H02_abl02`
- Reconstruction consumers: H02 and H07
- Evidence date: 2026-08-07

## Decoded configuration chain

`BagLikeAbilityEffectConfig` contains three quality-3, weight-100, one-time rows in the
same group:

| effect row | H02 star gate | effective | probability |
|---|---:|---|---:|
| `RG_H02_abl02_eff01` | 3 | `ADD_PASSIVITY_SKILL / 2001_2` | 3000 |
| `RG_H02_abl02_eff02` | 5 | `ADD_PASSIVITY_SKILL / 2001_3` | 5000 |
| `RG_H02_abl02_eff03` | 10 | `ADD_PASSIVITY_SKILL / 2001_4` | 10000 |

The decoded range is `H02/H07`. `battle.SkillConfig` maps `2001_2..4` to passive
skills `2001_p2..4`. Their `statusGroup` values are respectively `[3,3000]`,
`[3,5000]`, and `[3,10000]`; all use condition 2 with `conditionValue=[0]`.

The three passive behaviors `2001_bh2..4` are otherwise identical:

- `rangeType=3` (`BehaviorRangeType.SELF_CIRCLE`)
- `rangeParam.radius=250`
- enemy faction, `num=1`
- `targetType=7` (`SkillTargetType.Random`)
- missile `M_SS_2001`

`M_SS_2001` is a type-1 projectile with speed 700 and behavior `M_SS_2001_1`.
The impact behavior is one-target `hurt` with `amount=10000`.

Primary table sources:

- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityConfig.json`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.SkillConfig.json`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.PassivitySkillConfig.json`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.BehaviorConfig.json`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.MissileConfig.json`

## Runtime ordering and target semantics

The authorized game subpackage was isolated with:

```text
node reverse-work/extract-cocos-module-source.js \
  reverse-work/unpacked/wxf9af2417e78ce07a/18/subpackages-game/subpackages/game/game.js \
  <temporary-output> \
  '(BattleUnit|BehaviorUtils|PassivitySkillUtils|SkillEnum|SkillUtils)\\.ts$'
```

Recovered `BattleUnit.attack` invokes
`PassivitySkillUtils.checkPassSkillCon(ConType_2, caster, mainTarget, skillInfo)`
immediately before `_attr.actionSkill(...)`. The probability check and extra missile
therefore happen at attack start, not when the primary projectile lands.

Recovered `PassivitySkillUtils.checkPassivitySkill` evaluates status type 3 through
`RandomUtils.isRandTrue(probability)` before checking the skill-index-0 condition. On a
success, `actionSkill()` executes the passive behavior.

Recovered `SkillEnum` and `SkillUtils` disprove the earlier nearest/non-main
interpretation: range type 3 is a circle centered on the caster, while target type 7 is
`Random`. `behaviorFilterTargertsByTargetType` randomizes all enemies returned by that
circle and takes one. The primary target is not excluded and can receive both the main
hit and the additional 10000-ratio projectile.

## Reconstruction contract

- Only the highest star-qualified row from `RG_H02_abl02` enters the draw pool.
- The evidence-safe default H02 star remains 1, so none of the three rows enter the
  baseline until account evidence or an explicit validation fixture raises the star.
- On an H02/H07 skill-index-0 attack, read the passive probability before queuing the
  main action.
- On success, choose one enemy uniformly from the caster-centered radius-250 set,
  including the primary target, and launch an independent speed-700 projectile at
  10000 effect ratio.
- The extra projectile does not advance the H01 completed-basic-attack counter when H07
  carries both passives. It may still consume an already armed one-use critical if its
  damage resolves first.

## Validation coverage

- Trait tests lock the 3/5/10 star gates, 30%/50%/100% values, shared-group replacement,
  one-time cap, and H02/H07 range.
- Battlefield-kernel tests lock the probability boundary, guaranteed version,
  caster-centered radius, inclusion of the primary target, and deterministic random
  selection.
- The full rule/resource suite and Creator TypeScript gate must pass before this slice is
  recorded as restored.
