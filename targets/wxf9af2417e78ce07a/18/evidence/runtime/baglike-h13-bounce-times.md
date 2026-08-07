# H13 corn bounce-count feature

Target: `wxf9af2417e78ce07a/18`
Recovered: 2026-08-07

## Confirmed table contract

- `hero.HeroConfig` identifies H13 as the WHEEL hero `火炮齿轮`, with attack 66,
  HP 300 and initial star 1.
- `baglike.BagLikeAbilityEffectConfig`:
  - `RG_H13_abl01_eff01`: H13 star 2, quality 3, weight 100, times 1,
    range `H13/H09`; its description raises corn bounces to four.
  - `RG_H13_abl01_eff02`: the same group/draw/range values at H13 star 3;
    its description raises corn bounces to six.
- `baglike.BagLikeAbilityEffectiveConfig` routes the two rows through
  `FEATURE/BOUNCE_TIMES` with values 2 and 4 respectively.
- `battle.SkillConfig` maps base skill `TZ_1301` to missile behavior
  `B_TZ_1301_1`; the behavior launches `M_TZ_1301_1`.
- `battle.MissileConfig` gives `M_TZ_1301_1` speed 1000, type 8
  (`BounceBullet`), base `times=2`, and reuses the same missile for later segments.
- `B_TZ_1301_2` resolves each impact as one-target hurt with amount 3500.

## Runtime interpretation

- `BagLikeBuffManager.addFeatureByHero` stores `param[1]` as the hero feature's
  `times` field for every hero in the H13/H09 range.
- `BounceBullet.initParam` begins with `MissileConfig.parameter.times`, then adds the
  current hero's `BOUNCE_TIMES` feature. Therefore the exact follow-up bounce limits are
  2 at baseline, 4 with the star-2 row and 6 with the star-3 row.
- The initial hit is separate from the bounce counter: these limits yield at most 3, 5
  and 7 total distinct hits when enough targets exist.
- Every hit shares `hitUnitMap`; later segments skip already-hit units and select the
  nearest enemy strictly inside the recovered 300-pixel bounce search radius.
- Only the highest H13-star-qualified row from the shared ability group enters a draw.

## Evidence locations

- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/hero.HeroConfig.json:479`
  identifies H13; its skill slots begin at line 493.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json:1517`
  and `:1542` contain the two draw rows.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeAbilityEffectiveConfig.json:514`
  and `:523` contain the two `BOUNCE_TIMES` effects.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.SkillConfig.json:1554`
  defines `TZ_1301`; its launch behavior reference is at line 1577.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.BehaviorConfig.json:726`
  launches the missile at line 743; impact behavior `B_TZ_1301_2` begins at line 747.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.MissileConfig.json:134`
  defines `M_TZ_1301_1`; base `times=2` and the self-missile link are at lines 140-141.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js:225`
  handles `BOUNCE_TIMES` and stores its value as `times` at line 231.
- `targets/wxf9af2417e78ce07a/18/work/battlefield-runtime-analysis/formatted/BounceBullet.ts.deobfuscated.js:35`
  initializes the base bounce count; line 42 adds the recovered hero feature count.

## Reconstruction mapping

- `BagLikeProgression.ts` models both exact draw rows as one star-versioned group and
  exposes `bounceTimes=2/4` to H13/H09 only.
- `BattlefieldKernel.ts` resolves base plus feature bounce limits in the same production
  path used by pending projectiles.
- `CangshuGame.ts` restores H13's missing base two-bounce/radius-300 profile and applies
  the selected feature when each H13 or H09 projectile chain is launched.
- The conservative `h13HeroStar=1` baseline retains the confirmed base chain while
  keeping both unproven account-star upgrades out of the draw pool.

## Validation

- `baglike-traits.test.mjs`: 120/120 assertions, including both rows, star 1/2/3
  eligibility, highest-version selection, one-time cap and H13/H09 scope.
- `battlefield-kernel.test.mjs`: 41/41 assertions, including exact 2/4/6 follow-up
  bounce limits and the existing nearest-unvisited/radius/cap rules.
- Full rule/resource suite: 13 scripts, 660/660 assertions.
- Creator 3.8.8 project TypeScript: pass with `--noEmit --skipLibCheck`.

## Remaining boundary

The competitor account's actual H13 star remains absent from package artifacts and
captures. H13/H09 corn/popcorn projectile art and exact impact presentation remain
separate visual-validation work; H13's star-7/star-10 replacement-skill group is the next
mechanics slice.
