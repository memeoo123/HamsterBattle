# H11 star-2 heal-to-shield feature

Target: `wxf9af2417e78ce07a/18`  
Recovered: 2026-08-07

## Confirmed draw and feature contract

- `RG_H11_abl02_eff01` is a quality-3, weight-100, one-time ability row scoped
  to H11 and gated by account H11 star 2. Its name is `护盾生成`; its description
  states that excess healing from the healing gear becomes shield value.
- The effective row is `FEATURE/HEAL_TO_SHIELD/1`. `BagLikeBuffManager.addFeature`
  applies it only to the row's H11 range and stores the feature on the battle
  extra-attribute manager.
- `FightFormula.heal` keeps the normal attack-scaled, `HL_INC`-adjusted and
  floored heal amount. When the caster hero identity has `HEAL_TO_SHIELD`, it
  changes only the result status from `Heal` to `HealToShield`.
- `BattleUnit.heal` fills missing unit HP first. If the target is already full,
  the entire heal is added to its shield; otherwise only the amount beyond max
  HP becomes shield. `BattleAttr.healShield` adds without a recovered cap.
- `BattleAttr.hurt` consumes shield before HP. Smaller damage subtracts only
  shield; exact exhaustion leaves HP unchanged; larger damage removes the
  shield and applies only the remainder to HP.
- This does not give the base a shield. `HomeUnit` overrides the general heal
  consumer and calls `BattleAttr.heal` directly, ignoring the `HealToShield`
  status. `healHome` also skips a full base before producing a heal result.

## Evidence locations

- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json:1344`
  contains the exact draw row; its H11-star-2 verify, weight, cap, quality, name
  and description continue through line 1367.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectiveConfig.json:459`
  defines `FEATURE/HEAL_TO_SHIELD/1` through line 465.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js:208`
  applies features by hero range; lines 235-246 construct and store the
  `HEAL_TO_SHIELD` feature value.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/FightFormula.ts.deobfuscated.js:107`
  calculates healing; line 114 changes the result status when the caster's hero
  feature is present.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BattleUnit.ts.deobfuscated.js:101`
  converts full or overflow unit healing into shield before applying remaining
  healing through line 108.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BattleAttr.ts.deobfuscated.js:187`
  consumes shield before HP; lines 194-198 show uncapped additive shield and
  normal max-HP-clamped healing.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/HomeUnit.ts.deobfuscated.js:48`
  proves the base-specific heal override ignores result status.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/FightSkillInfo.ts.deobfuscated.js:100`
  shows that `healHome` skips a full base and otherwise uses the base override.

## Reconstruction and validation

- The exact star-2 row now participates in the production weighted pool and is
  excluded by the conservative default `h11HeroStar=1`.
- H11 unit-heal plans expose applied healing and overflow shield separately.
  Production units carry an additive shield value, and incoming damage consumes
  it before HP through the same pure simulation helper used by tests.
- Home repair remains the recovered normal clamped healing path.
- `battlefield-healing.test.mjs`: 33/33 assertions.
- `baglike-traits.test.mjs`: 138/138 assertions.
- Full rule/resource suite: 13 scripts, 704/704 assertions.
- Creator 3.8.8 bundled TypeScript: pass with `--noEmit --skipLibCheck true`.

## Remaining boundary

The target account's actual H11 star remains absent from package artifacts and
captures. The next H11 slice is the independent star-7
`HEAL_MORE_TARGER`/`群体治疗` consumer; it must not be inferred from this feature.
