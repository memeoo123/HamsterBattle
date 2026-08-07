# H03 penetrating-laser runtime chain

## Ability selection and added skill

- `RG_H03_abl04_eff01` is a one-time quality-4, weight-50 row in group
  `RG_H03_abl04`. It requires H03 star 10 and covers H03/H08
  (`reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json:895`).
- Its effective row is `ADD_SKILL ["3001_5"]`
  (`reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectiveConfig.json:314`).
- `BagLikeBuffManager.addSkill` records the skill in `BattleExSkillManager` for
  every hero ID in the decoded range, and `BattleExSkillManager.getSkills`
  appends those IDs when later units are created
  (`targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js:194-199`,
  `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BattleExSkillManager.ts.deobfuscated.js:29-35`).
  Existing H03/H08 units are not retrofitted.

## Cast, cooldown, priority, and interruption

- `3001_5` is active skill type 2 with `precd=0`, `cd=4000`,
  `castTime=1000`, main-target search, and one `bh3001_5` behavior at 300 ms
  (`reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.SkillConfig.json:2778-2803`).
- Its configured `castingRange=0` takes the generic `SkillData` fallback of 50.
  `primitive-variables.json` resolves the fallback symbol `af` to 50, while
  `SkillData.castingRange` returns `cfg.castingRange || af`
  (`targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/primitive-variables.json`,
  `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/SkillData.ts.deobfuscated.js:142-148`).
- Active skills are evaluated from the end of the sorted active-skill list, so
  the added index-1 active skill wins over ordinary index-0 attacks whenever
  ready. The unit therefore approaches its nearest main target until the
  strict distance is below 50 before casting
  (`targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BattleAttr.ts.deobfuscated.js:214-232`,
  `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BattleUnit.ts.deobfuscated.js:256-264`).
- Cooldown starts in `SkillBehavior.actionEffect`, not at cast start. A control
  interruption removes all still-waiting behaviors: interruption before 300 ms
  leaves the laser immediately ready; interruption after 300 ms preserves the
  already-started four-second cooldown
  (`targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/SkillBehavior.ts.deobfuscated.js:60-63`,
  `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BattleUnit.ts.deobfuscated.js:220-225,285-299`).

## Penetrating rectangle and damage

- `bh3001_5` uses behavior range type 5 (`SELF_RECTANGLE`) with width 100,
  height 300, enemy faction, `SEARCH_TARGET`, `num=0`, and direct `hurt` amount
  5000
  (`reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.BehaviorConfig.json:1313-1338`).
- The runtime substitutes 999 when `num` is zero. `SELF_RECTANGLE` starts at
  the caster, points at the locked target's current position, and queries the
  rectangle at the 300-ms behavior instant
  (`targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BehaviorUtils.ts.deobfuscated.js:29-35`,
  `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/SkillUtils.ts.deobfuscated.js:147-174`).
- `UnitCollisionsManager.getRectUnits` builds the rear edge around the caster,
  extends both forward corners by exactly 300, and applies the polygon test to
  unit centers. The polygon test includes points on an edge
  (`targets/wxf9af2417e78ce07a/18/work/h03-laser-analysis/UnitCollisionsManager.ts.deobfuscated.js:3`,
  `targets/wxf9af2417e78ce07a/18/work/h03-laser-analysis/MathUtils2.ts.deobfuscated.js:3`).
- This is a direct non-projectile skill hit at 5000/10000 attack ratio. It uses
  the common dodge/critical/resistance/damage pipeline but does not satisfy the
  ordinary-attack-index-0 conditions used by H03 freeze or transform passives.

## Presentation evidence and remaining gap

- `3001_5` selects skill effect `3001_4`, whose animation is `skill01` and has
  no separate effect model. Both recovered H0301 and H0805 Spine 3.8.99 files
  expose `skill01`, so the reconstruction binds the exact model animation.
- The skill config requests audio key `skill_jiguang`
  (`reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.SkillConfig.json:2830`),
  but no matching audio asset exists in the recovered/current asset trees.
  Audio fidelity therefore remains pending rather than using an invented clip.

## Reconstruction contract and deterministic coverage

- Future H03/H08 units snapshot a selected laser profile: initial cooldown 0,
  cooldown 4 seconds, cast 1 second, behavior delay 0.3 seconds, strict casting
  range 50, rectangle 100 x 300, max targets 999, and effect ratio 5000.
- `baglike-traits.test.mjs` covers exact metadata, star-10 gating, one-time cap,
  H03/H08 scope, and profile values. `battlefield-kernel.test.mjs` covers the
  300-ms and one-second boundaries, orphaned post-cast behavior, inclusive
  rectangle edges, rear/front exclusion, selection filtering, and target cap.
