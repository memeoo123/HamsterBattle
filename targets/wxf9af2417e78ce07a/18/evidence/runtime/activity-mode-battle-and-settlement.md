# Activity mode battle and settlement closure

Date: 2026-08-11  
Target: `wxf9af2417e78ce07a/18`

## Recovered evidence used

- `DailyInstanceModel/Mgr/View/BattleView`, `BattleDailyChapterVo`
- `EndlessModeModel/Mgr/View/EnterTask`, `BattleEndlessChapterVo`
- `TrunkInstanceController`, `BattleInstanceController`, `BagLilkeManager`, `BagLikeBuffManager`
- decoded `DailyInstanceConfig`, `DailyInstanceRandomConfig`, `DailyInstanceRewardConfig`,
  `BagLikeAbilityEffectiveConfig` and `TrunkInstanceRoundConfig`

The generated runtime payload contains 10 daily chapters, 10 daily rotations,
200 progress-scaled reward rows and 31 special rounds. Both daily templates contain
212 scheduled spawns; endless round `400001` contains 560.

## Implemented closure

- Daily selection is derived from the recovered day-zero modulo rotation. A day change
  resets daily attempts, daily instance gold and claimed milestones.
- Daily challenge spends 5 energy at entry, increments its three-attempt counter only
  at settlement, awards 500 milestone gold per reached round, and supports all four
  2500/5000/7500/10000 claims from the reward row clamped to main progress.
- All 15 central cells are open in activity battles. Recovered refresh discount,
  level-3 prepare weight, hero/tower multi-output, shape attack buffs, monster speed,
  control immunity, HAMSTER/WHEEL resistance and extra-monster schedules are routed.
- Endless spends 5 energy, flags the third attempt as the advertisement attempt,
  runs the exact 300-second/560-spawn schedule, exposes an enemy base, counts kills and
  monster gold, and pays remaining monsters plus enemy-base gold if the base is destroyed.
- Endless attempts reset each day while the highest record persists. Record comparison
  follows the source: higher gold wins; equal gold uses higher kill count.
- Result retry consumes a new attempt and energy; result return routes back to the
  corresponding activity page. Platform ad playback remains an external integration;
  the local third-attempt button labels the requirement instead of fabricating an SDK.

## Verification

- `special-mode-runtime.test.mjs`: exact table cardinalities, daily reset, persistent
  endless record, energy/attempt/ad gates, effects, reward claim and tie-break pass.
- Full project suite: `42/42` test files pass.
- Creator 3.8.8 TypeScript `--noEmit --skipLibCheck true`: pass.
- Cocos assets: `183`, missing `.meta`: `0`.
- Fresh Creator Web Mobile build completed at 2026-08-11 12:46:55.
- 750×1334 browser smoke opened Activity, Endless and the date-selected Daily page;
  displayed group 6 for the test date, exact unlock gates, remaining counts and records;
  browser warning/error count was zero.

## Remaining evidence boundary

The fresh representative account is at main progress 1003, so the browser correctly
keeps Endless (1006) and Daily (1010) battle buttons locked. Their executable combat
path is covered by TypeScript, pure state/table tests and the successful Creator build;
an original same-account activity recording and platform advertisement callback remain
outside this closure.
