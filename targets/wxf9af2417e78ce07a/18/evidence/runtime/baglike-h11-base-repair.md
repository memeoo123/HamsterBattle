# H11 star-5 base-repair replacement

Target: `wxf9af2417e78ce07a/18`  
Recovered: 2026-08-07

## Confirmed draw and replacement contract

- `RG_H11_abl01_eff02` is a quality-2, weight-200, one-time ability row scoped
  to H11 and gated by account H11 star 5. Its name is `基地修复`; its description
  raises the paired home repair to 100% of attack.
- The effective row is `REPLACE_SKILL/ZL_1103`. `BagLikeBuffManager` routes that
  effect through `exchangeSkill`, and `BattleExSkillManager` replaces the active
  skill by the shared `SkillConfig.group` value `ZL_1101`.
- Base `ZL_1101` runs `B_ZL_1101` for one lowest-HP-percentage allied unit in a
  radius of 200 at ratio 10000, then `B_ZL_1102` for the allied home at ratio
  5000.
- Replacement `ZL_1103` keeps the same group and the same unit-heal behavior
  `B_ZL_1101`; only the home behavior changes to `B_ZL_1103`, ratio 10000.
- Both heal behaviors use the normal attack-scaled formula. At H11 level 1 and
  attack 63, the base skill repairs the home for `floor(63 * 0.5) = 31`; the
  replacement repairs it for `floor(63 * 1.0) = 63`. Unit healing remains 63.
- The replacement does not relax the cast condition: H11 still needs a living
  friendly unit target. A full-health friendly remains a valid target, so the
  paired base repair can still execute.

## Evidence locations

- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json:1320`
  contains the exact draw row, star gate, quality, weight and one-time cap.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectiveConfig.json:451`
  routes the row to `REPLACE_SKILL`; line 454 names `ZL_1103`.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.SkillConfig.json:1214`
  defines `ZL_1101`; its two behaviors are at lines 1237 and 1240.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.SkillConfig.json:1271`
  defines `ZL_1103`; its two behaviors are at lines 1294 and 1297.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.BehaviorConfig.json:550`,
  `:577` and `:598` define `B_ZL_1101`, `B_ZL_1102` and `B_ZL_1103`.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js:124`
  routes `REPLACE_SKILL`; lines 191-193 perform the exchange.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BattleExSkillManager.ts.deobfuscated.js:27`
  replaces skills by group.
- `targets/wxf9af2417e78ce07a/18/work/production-runtime-analysis/FightSkillInfo.ts.deobfuscated.js:94`
  routes unit/home healing to the shared formula; `FightFormula.ts.deobfuscated.js:107`
  confirms attack scaling, `HL_INC`, flooring and clamping.

## Reconstruction and validation

- The exact star-5 row now participates in the production weighted pool and is
  still excluded by the conservative default `h11HeroStar=1`.
- Selecting it replaces subsequent H11 casts with `ZL_1103`; unit healing stays
  at 100% attack and home repair changes from 50% to 100% attack.
- `battlefield-healing.test.mjs`: 26/26 assertions.
- `baglike-traits.test.mjs`: 132/132 assertions.
- Full rule/resource suite: 13 scripts, 691/691 assertions.
- Creator 3.8.8 bundled TypeScript: pass with `--noEmit --skipLibCheck true`.

## Remaining boundary

The target account's actual H11 star is absent from package artifacts and current
captures, so the reconstruction keeps `h11HeroStar=1` by default. Other H11
star-gated consumers, including heal-to-shield and multi-target healing, remain
separate evidence-backed implementation slices.
