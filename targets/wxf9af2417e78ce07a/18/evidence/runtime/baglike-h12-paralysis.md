# H12 paralysis skill replacement

Target: `wxf9af2417e78ce07a/18`
Recovered: 2026-08-06

## Confirmed table contract

- `baglike.BagLikeAbilityEffectConfig`
  - `RG_H12_abl01_eff01`: group `RG_H12_abl01`, `HERO_STAR_GE H12 1`, quality 2,
    weight 200, times 1, range `H12/H08`; description says one-second paralysis.
  - `RG_H12_abl01_eff02`: the same group/range/draw values with `HERO_STAR_GE H12 3`;
    description says two-second paralysis.
- `baglike.BagLikeAbilityEffectiveConfig`
  - version 1 uses `REPLACE_SKILL [LY_1202]`.
  - version 2 uses `REPLACE_SKILL [LY_1203]`.
- `battle.SkillConfig`
  - `LY_1201` runs shared missile behavior `M_LY_1201`.
  - `LY_1202` retains `M_LY_1201` and adds `LY_bh1202`.
  - `LY_1203` retains `M_LY_1201` and adds `LY_bh1203`.
- `battle.BehaviorConfig`
  - `LY_bh1202/LY_bh1203` target the one current enemy (`rangeType=2`, `num=1`) and
    add `LY_bf1202/LY_bf1203`.
  - `H_LY_1201` damages up to five enemies in target radius 50 at amount 5000.
- `battle.BuffGroupConfig` gives `LY_bf1202` a 1000 ms limit and `LY_bf1203` a
  2000 ms limit.
- `battle.BuffConfig` maps both child buffs to `effectType=abnormal`,
  `effectParam.type=3`.
- `battle.MissileConfig` maps `M_LY_1201` to `H_LY_1201` with delay 500 ms.

## Runtime interpretation

- `SkillEnum.AbnormalType` assigns numeric value 3 to `dizziness`.
- `SkillBuff.active` installs the abnormal status and removes it when the owning buff
  expires.
- `BattleAttr.canMove` and `BattleAttr.canAttack` both reject units with `dizziness`;
  control-immune units retain their immunity path.
- The skill replacement does not change the base area damage. It adds a one-target
  control behavior while the shared area damage remains delayed by 500 ms.

## Reconstruction mapping

- `BagLikeProgression.ts` models both rows as one star-versioned group. Only the highest
  row allowed by the saved H12 star enters one weighted draw.
- The conservative default `h12HeroStar=1` therefore enables the confirmed one-second
  version; star 3 selects the two-second replacement.
- `BattlefieldParalysis.ts` keeps the three skill identities, durations, shared 500 ms
  impact delay, 5000 ratio, radius 50 and five-target cap in a pure module.
- `CangshuGame.castTowerSkill` applies the selected paralysis to the primary random target,
  respects `controlImmune`, then uses the existing pending-hit queue for delayed area damage.
  Reapplication never shortens a longer remaining control duration.

## Validation

- `battlefield-paralysis.test.mjs`: 10/10 assertions.
- `baglike-traits.test.mjs`: 91/91 assertions including both H12 rows, star 0/1/2/3
  eligibility, highest-row replacement, cap and hero scope.
- Full rule/resource suite: 12 scripts, 576/576 assertions.
- Creator 3.8.8 project TypeScript: pass with `--noEmit --skipLibCheck`.
- Cocos project check: 101 assets, missing meta 0, warnings 0.

## Remaining boundary

The package proves the local saved-star input but not the competitor account's actual H12
star. The reconstruction retains the evidence-safe default of one until an account capture
or saved profile proves a higher value. Exact status visuals/audio remain presentation work.
