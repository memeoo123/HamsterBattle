# H12 electrified same-group skill replacement

Target: `wxf9af2417e78ce07a/18`
Recovered: 2026-08-06

## Confirmed table contract

- `baglike.BagLikeAbilityEffectConfig` row `RG_H12_abl04_eff01` belongs to
  `RG_H12_abl04`, has quality 4, weight 50, times 1, range `H12/H08`, and requires
  `HERO_STAR_GE H12 10`.
- `baglike.BagLikeAbilityEffectiveConfig` uses `REPLACE_SKILL [LY_1204]`.
- `battle.SkillConfig` assigns `LY_1204` to group `LY_1201`, the same group as
  `LY_1201/LY_1202/LY_1203`. It retains shared missile behavior `M_LY_1201` and adds
  `LY_bh1204`.
- `battle.BehaviorConfig` applies `LY_bf1204` to the current primary target.
- `battle.BuffConfig` child `LY_bf1204_1` is a one-layer persistent `ATTR` modifier with
  `DMG_RES=-1000`; its BuffGroup has `timeLimit=0`.
- `battle.AttributeConfig` clamps `DMG_RES` to `[0,7000]`.

## Runtime interpretation

- `BattleExSkillManager.setExchangeSkill` stores one replacement per `SkillConfig.group`.
  Selecting any of the three H12 replacement cards overwrites the previously stored
  `LY_1201`-group replacement. Therefore selection order is observable: electrified after
  paralysis selects `LY_1204`, while paralysis after electrified selects `LY_1202/LY_1203`.
- `BuffManager` reuses the same layer-1 buff and a zero time limit does not schedule expiry,
  so the modifier is persistent and non-stacking while the target remains alive.
- `FightFormula.getValue` applies the attribute minimum after buff values. The restored representative-level target
  profiles have generic `DMG_RES=0`, so `0 + (-1000)` is read as 0 and does not increase
  their damage taken. A target with positive generic resistance would have up to 1000 of
  that resistance removed, but the buff can never make `DMG_RES` negative.
- `LY_1204` has no dizziness behavior; when it is the active replacement, a previously
  selected paralysis card no longer affects the H12 cast.

## Reconstruction mapping

- `BagLikeProgression.ts` adds the exact star-10 draw row as a skill-replacement effect.
- `BattlefieldParalysis.ts` models `LY_1204`, last-selected replacement ordering, its lack
  of paralysis, and the recovered `DMG_RES` clamp.
- `CangshuGame.ts` keeps the active H12 replacement identity for the run and updates it in
  card-selection order. The shared 500 ms delayed, ratio-5000, radius-50, five-target
  lightning damage remains unchanged.
- The reconstructed representative-level targets intentionally receive no invented vulnerability
  multiplier because their generic resistance is zero and the original clamp removes it.

## Validation

- `battlefield-paralysis.test.mjs`: 15/15 assertions, including both replacement orders,
  the `LY_1204` no-paralysis profile and resistance clamp.
- `baglike-traits.test.mjs`: 110/110 assertions, including quality, weight, cap, range and
  star 9/10 eligibility.
- Full rule/resource suite: 12 scripts, 604/604 assertions.
- Creator 3.8.8 project TypeScript: pass with `--noEmit --skipLibCheck`.

## Remaining boundary

The competitor account's actual H12 star remains absent from packages and captures, so the
star-10 card is correctly outside the conservative star-1 baseline. Exact electrified status
visuals/audio remain presentation work.
