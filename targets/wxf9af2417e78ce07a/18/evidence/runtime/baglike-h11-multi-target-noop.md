# H11 star-7 group-healing runtime disconnect

Updated: 2026-08-07

## Conclusion

`RG_H11_abl03_eff01` is a real, selectable, one-time H11 ability row gated at H11
star 7. Its title and description advertise group healing, and its effective row uses the
shipped spelling `HEAL_MORE_TARGER`. In version 18, however, selecting it does not change
the number of healed targets.

This is a runtime disconnect, not an inferred target-count implementation. `addBuff`
records the selected row in `_buffTimesMap` and then calls `addEffective`, but the latter's
complete effect-type switch has no `HEAL_MORE_TARGER` branch. Repository-wide runtime
search also finds no consumer that reads this row id or its recorded count. The underlying
`B_ZL_1101` behavior therefore keeps `num=1` and the radius-200 unit heal remains
single-target.

The reconstruction preserves the row's draw eligibility, weight, quality, one-time cap and
star gate as an explicit `runtimeNoOp`. It deliberately does not derive an unknown target
count from the marketing text.

## Evidence map

- `baglike.BagLikeAbilityEffectConfig.json`: `RG_H11_abl03_eff01`, group
  `RG_H11_abl03`, H11 range, `HERO_STAR_GE/H11/7`, weight 100, times 1, quality 3,
  name `群体治疗`, and the description that healing affects multiple targets.
- `baglike.BagLikeAbilityEffectiveConfig.json`: the corresponding effect type is
  `HEAL_MORE_TARGER`; `param` and `attr` are null.
- `baglike.BagLikeAbilityConfig.json`: H11 level-7 progression points to this effect row.
- `battle.BehaviorConfig.json`: `B_ZL_1101` retains radius 200 and `num=1`.
- `work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js`:
  `addBuff` records the row and calls `addEffective`; the complete switch handles `ATTR`,
  `EXP_GAIN`, `REPLACE_SKILL`, `ADD_SKILL`, `ADD_PASSIVITY_SKILL`, `GEAR_UPGRAGE`,
  `SPECIAL_WORD`, and `FEATURE`, but not `HEAL_MORE_TARGER`.
- Runtime-source search: there is no external `getTimes`/row-id consumer for
  `RG_H11_abl03_eff01`; `_buffTimesMap` is exposed for persistence only.

## Validation

- `baglike-traits.test.mjs`: 143/143 assertions, including the exact row shape, star-6
  exclusion, star-7 inclusion, zero combat amount and one-time removal.
- `battlefield-healing.test.mjs`: 33/33 assertions; the baseline single-target H11 healing
  path remains unchanged.
- Full rule/resource suite: 13 scripts, 709/709 assertions.
- Golden cases: 47/47; RESTORE_SPEC and battlefield-state validators pass.
- Creator 3.8.8 TypeScript and Cocos project check pass with 102 assets, zero missing
  metadata files and zero warnings.

## Boundary

The target account's H11 star value is still absent from package artifacts and current
captures. Even if star 7 is later proven, this version-18 row remains selectable-but-inert
unless a different runtime version or direct matched trace proves another consumer.
