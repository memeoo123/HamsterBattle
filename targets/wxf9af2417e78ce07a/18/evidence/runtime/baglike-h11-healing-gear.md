# BagLike H11 healing gear — v18

Target: `wxf9af2417e78ce07a/18`.

## Confirmed data chain

- [已确认] `H11` is a `WHEEL` hero with base attack `63`, search range `400`,
  shape `3`, and base skill group `ZL_1101`. Its account unlock condition is
  completion of level `1004`. Evidence:
  `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/hero.HeroConfig.json:423-450`.
- [已确认] `H1101` through `H1104` all use `ZL_1101`, add `9` worker points
  per power trigger, and apply attack/HP multiples `10000`, `15000`, `22500`,
  and `33750`. Their shape is the vertical two-cell shape `3`. Evidence:
  `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeItemConfig.json:1093-1198`
  and
  `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeShapeConfig.json` row `3`.
- [已确认] `ZL_1101` has zero cast time, `1000` cooldown, casting range
  `9999`, friendly faction `2`, and lowest-HP search type `4`. It executes
  `B_ZL_1101` followed by `B_ZL_1102`. Evidence:
  `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.SkillConfig.json:1214-1241`.
- [已确认] `B_ZL_1101` searches a target-centered circle of radius `200`,
  selects one friendly lowest-HP-percentage unit, and heals it at attack ratio
  `10000`. `B_ZL_1102` targets the friendly home and heals it at attack ratio
  `5000`. Evidence:
  `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.BehaviorConfig.json:550-595`.
- [已确认] Runtime target type `4` is lowest HP and faction `2` is the
  caster's side. Behavior target type `4` sorts by HP percentage; behavior
  range type `16` returns the caster's home. Evidence:
  `work/battlefield-runtime-analysis/formatted/SkillEnum.ts.deobfuscated.js:49-68`
  and `work/battlefield-runtime-analysis/formatted/SkillUtils.ts.deobfuscated.js:41-67,94-152`.
- [已确认] Healing is `floor(max(0, casterAttack * ratio * healIncrease))`;
  the target HP is clamped to max HP. Evidence:
  `work/battlefield-runtime-analysis/formatted/FightFormula.ts.deobfuscated.js:107-115`
  and `work/battlefield-runtime-analysis/formatted/BattleAttr.ts.deobfuscated.js:194-199`.
- [已确认] H11 follows the common WHEEL producer path: worker progress is
  reset at round start, one completion preserves modulo remainder, the worker
  completion animation lasts `0.25` seconds, and completion emits one
  `CREATE_TOWER_SKILL` action from the placed gear. There is no persistent H11
  battlefield unit. Evidence:
  `evidence/runtime/battlefield-production-runtime.md:20-39` and
  `work/production-runtime-analysis/WorkerBar.ts.deobfuscated.js:3`.
- [已确认] The package constant `BAGLIKE:NOT_EXCLUDE_HEROS=H11` exempts H11
  from account-lock exclusion and from the five-family tracked count. Evidence:
  `evidence/runtime/baglike-preparation-dynamic-rewards.md:5-18` and
  `work/battlefield-runtime-analysis/formatted/BagLilkeManager.ts.deobfuscated.js:375-448`.

## Deterministic baseline

At the evidence-default account star `1`, the H11 one-shot uses `ZL_1101`.
Before other attack/heal traits, levels 1–4 therefore produce these values:

| Gear | Scaled attack | Friendly-unit heal | Home heal |
|---|---:|---:|---:|
| H1101 | 63 | 63 | 31 |
| H1102 | 94.5 | 94 | 47 |
| H1103 | 141.75 | 141 | 70 |
| H1104 | 212.625 | 212 | 106 |

The action requires a live friendly unit selected by the skill search; the unit
heal is resolved first and the home heal second, matching behavior order.

## Explicitly unresolved extensions

- [待确认] The target account's saved H11 star is absent. Star 5 can replace
  the home behavior with `ZL_1103` (100% attack), star 2 can convert overheal
  to shield, and star 7 can add healing targets. Keep these optional consumers
  disabled until their account eligibility and complete runtime paths are
  restored.
- [待确认] Exact same-frame ordering relative to other simultaneous tower
  skills still requires a matched original event trace. Preserve the confirmed
  production-completion-before-one-shot order and cover it deterministically.
