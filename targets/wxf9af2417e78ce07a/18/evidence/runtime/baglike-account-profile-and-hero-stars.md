# BagLike account profile and hero-star runtime

Date: 2026-08-10  
Target: `wxf9af2417e78ce07a/18`

## Confirmed original behavior

- `work/warrior-combo-critical-analysis/HeroModel.ts.deobfuscated.js` initializes every
  `HeroVo.star` to `0`, restores positive stars from `HeroLocalVo.stars[heroId]`, and treats
  `star > 0` as unlocked. Unlocking a hero writes both `unlockHeroIds` and `stars` to the
  local save.
- `work/warrior-combo-critical-analysis/ConditionHeroStarGe.ts.deobfuscated.js` reads
  `heroModel.getHeroVo(heroId).star`; `HERO_STAR_GE` is therefore an account-star gate,
  not a board-gear level.
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/hero.HeroStarConfig.json`
  contains 20 stars for both table types. Types 1 and 2 are identical in version 18.
  Attribute modifiers for stars 1–20 are
  `0,1000,2100,3300,4600,6100,7700,9400,11400,13500,15900,18500,21300,24500,27900,31700,35900,40500,45500,51100`
  basis points.
- `HeroModel.getHeroBaseAttr` applies `floor(base × (1 + attrModifier/10000))` before the
  BagLike gear-level multiplier. This affects both base attack and base HP. WHEEL HP also
  contributes to `allWheelHp` through this adjusted value.
- `hero.HeroConfig.json` gives H01/H02/H04/H12 initial unlock conditions of `null`, H03
  after chapter 1002, H11 after 1004, and H13 after 1001. All seven supported families use
  `initStar=1`.

## Implemented reconstruction behavior

- `BagLikeAccountProfile.ts` now uses schema v2 under the existing namespaced key
  `cangshu.restore.baglike.account.v1`, so earlier reconstruction saves migrate in place.
- The profile additionally persists gold, energy, diamonds, all 12 `BOX_RF` fragment
  families, and maximum passed level. Package-derived level rewards, pass-level unlocks,
  and exact fragment/gold star costs now form the formal progression path.
- The profile persists `stars` for H01/H02/H03/H04/H11/H12/H13 and per-level challenge
  counts. Star 0 is locked; positive stars are clamped to the recovered 1–20 range.
- Missing or corrupt saves recover to the scene's evidence-safe legacy defaults instead of
  preventing startup. The target-account values are not synthesized.
- The preparation screen exposes a formal account panel for resource display and paid
  upgrades. Direct star presets are restricted to the explicit `?accountDebug=1` mode.
- Unlock state feeds dynamic candidate filtering. Stars feed trait eligibility, level-5
  fusion requirements, HAMSTER attack/HP, WHEEL attack, and WHEEL home-HP contribution.
- Challenge count is snapshotted on level entry. A completed attempt increments and saves
  the next count before retry, preserving the original `challengeTimes <= 1` static-batch
  boundary without changing the current candidate stream mid-attempt.
- The isolated developed visual fixture continues to override H02/H13 to 3 stars only in
  that fixture and never writes those values to the account save.

## Validation

- `baglike-account-profile.test.mjs`: 90/90 assertions.
- Full rule/resource suite: 27 files, 1133/1133 assertions. Candidate coverage includes
  every reachable dynamic reward ID having a concrete `GEARS` renderer entry.
- Creator 3.8.8 project checker: 170 assets, 0 missing `.meta`, project TypeScript pass.
- Creator Web Mobile build log reached `build Task (web-mobile) Finished`; the built bundle
  contains the versioned storage key and account-panel strings.
- Fresh local runtime opened the account panel without warning/error logs; the current
  progression-loop report and capture are `account-progression-loop.md` and
  `account-progression-loop.png`.

## Evidence boundary

The package proves schema, unlock semantics, star table, attribute formula, and consumers.
It does not contain the competitor account's exact saved values. H13 star 3 remains the only
captured developed-state star independently evidenced by the 863 HP screenshot calculation;
other exact target-account stars remain external evidence.
