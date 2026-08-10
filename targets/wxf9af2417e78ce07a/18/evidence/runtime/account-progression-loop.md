# BagLike account progression loop

Date: 2026-08-10  
Target: `wxf9af2417e78ce07a/18`

## Evidence-backed rules

- `HeroStarConfig` supplies the exact fragment and gold costs for stars 1–20.
- `HeroConfig` supplies `initStar=1` and the pass-level unlocks used by the restored runtime:
  H13 after 1001, H03 after 1002, and H11 after 1004.
- Every decoded `TrunkInstanceConfig` row from 1001 through 1200 was checked against the
  implemented three-round reward formula. There were zero mismatches.
- Final-round `BOX_RF` rewards use the original equal-weight 12-family fragment pool:
  H01, H02, H03, H04, H05, H06, H11, H12, H13, H14, H16, and H17.

## Implemented loop

- Schema v2 persists gold, energy, diamonds, all 12 fragment inventories, maximum passed
  level, hero stars, and challenge counts. It migrates in place from the earlier profile
  stored under `cangshu.restore.baglike.account.v1`.
- Milestone waves claim and save the configured account rewards once per attempt. Victory
  updates the maximum passed level and automatically applies pass-level hero unlocks.
- Hero upgrades require the exact same-family fragments and gold, then persist immediately.
  Locked, max-star, insufficient-fragment, and insufficient-gold outcomes are explicit and
  do not consume resources.
- The preparation account panel displays resources, unlock state, star, fragments, and the
  next upgrade cost. Debug presets are only created when `?accountDebug=1` is present.
- Fragment outcomes for currently unsupported battle families remain in inventory; their
  original reward probability is not reassigned to the seven rendered families.

## Validation

- Full rule/resource suite: 27 files, `1133/1133` assertions.
- Account profile/progression: `90/90` assertions.
- Candidate drawing and Cocos Set-iteration regression guards: `44/44` assertions.
- Creator 3.8.8 TypeScript: pass.
- Creator 3.8.8 Web Mobile: `build Task (web-mobile) Finished`, success exit code `36`.
- Main scene is present in the main bundle. A fresh local origin opened the panel with
  browser warning/error count `0`.
- Final capture: `account-progression-loop.png`.

## Evidence boundary

This proves the package-derived progression rules and the reconstruction's local playable
loop. The package does not contain the competitor account's exact saved gold, fragments,
stars, or unlock state, so those values are not claimed or synthesized.
