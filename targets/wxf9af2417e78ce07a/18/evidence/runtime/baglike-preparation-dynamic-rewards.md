# BagLike preparation dynamic rewards — v18

## Confirmed runtime chain

- `BagLilkeManager.refreshBrick` rebuilds `BagLikeUsedHeroMap` from placed items, applies
  account-lock exclusions, draws each candidate sequentially, then runs forced-grid and
  missing-family replacements. Evidence:
  `work/battlefield-runtime-analysis/formatted/BagLilkeManager.ts.deobfuscated.js:375-448`.
- `BagLikeUsedHeroMap` counts distinct hero families and counts coin gears as
  `2^(level-1)`. `H11` is excluded from the tracked-family count by
  `BAGLIKE:NOT_EXCLUDE_HEROS=H11`. Evidence:
  `work/preparation-dynamic-analysis/BagLikeUsedHeroMap.ts.deobfuscated.js:3` and
  `baglike.BagLikeConstantConfig` decoded rows.
- The tracked hero-family maximum is `5`. Once reached, later slot draws exclude hero
  families not already represented; after drawing, duplicated candidates may be replaced
  by unlocked missing families of the same gear level. Evidence:
  `BAGLIKE:MAX_BATTLE_BRICK_TYPE=5` and
  `work/battlefield-runtime-analysis/formatted/BagLilkeManager.ts.deobfuscated.js:382-448`.
- Coin count selects `BagLikeCoinWeightConfig`; counts above the last row clamp to the
  final row, while zero has no modifier. In v18, reward `3034` falls from multiplier
  `10000` at count 1 through `8000, 5000, ...` to `100` from count 16 onward. Its
  `C01/C02/C03` item multipliers remain `10000`. Evidence:
  `work/preparation-dynamic-analysis/BagLikeCoinWeightDatas.ts.deobfuscated.js:3` and the
  decoded `baglike.BagLikeCoinWeightConfig` table.
- If locked cells remain, every seventh non-ad refresh with at least three results and no
  grid item replaces candidate index 2 with reward `3030`. Evidence:
  `BAGLIKE:MUST_GRID_REFRESH_TIMES=7`, `BAGLIKE:MUST_GRID_REWARD_ID=3030`, and
  `work/battlefield-runtime-analysis/formatted/BagLilkeManager.ts.deobfuscated.js:407-414`.

## Reconstruction boundary

The candidate engine and production call site now implement account-family filtering,
coin-count weights, the five-family cap/fill behavior, and the seventh-refresh forced-grid
rule with injectable RNG. The target account's exact unlocked set is not present in the
package, so the scene property defaults to the six families already supported and observed
in the representative reconstruction. `H11` is intentionally not enabled yet: its package
exception is confirmed, but exposing it before its healing production/targeting behavior is
implemented would create a non-functional candidate.

