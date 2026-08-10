# Battlefield terminal, projectile, reward, and EXP order

Target: `wxf9af2417e78ce07a/18`

Status: confirmed from recovered production modules for the normal trunk battle terminal path. The independent `GameTimer` versus `BattleTimer` callback tie remains separate and unresolved.

## Recovered order

1. `BattleInstanceController.onUpdate` schedules due monsters, runs the complete instance/unit/bullet update, and only then calls `onCheckEnd` (`work/battlefield-runtime-analysis/formatted/BattleInstanceController.ts.deobfuscated.js:139-142`).
2. `onCheckEnd` tests timeout or self-home death before either victory branch. Consequently, a dead self home loses even when the same frame also exhausts the schedule and enemy list (`.../BattleInstanceController.ts.deobfuscated.js:454-457`).
3. A monster emits `BATTLE_MONSTER_DIE` synchronously with its EXP and gold payload when death is accepted, before its later death-animation disposal (`.../MonsterUnit.ts.deobfuscated.js:68-80`). `BagLikeBattlePage` consumes that notification immediately for EXP, so final-kill EXP is accounted before the terminal check.
4. When the schedule is exhausted and the enemy list is empty, `handleBattleWin` immediately removes all bullets, stops the battle timer, and enters the victory animation (`.../BattleInstanceController.ts.deobfuscated.js:476-486`). A projectile whose hit is due in the current frame has already been updated; a future projectile cannot damage the home after victory detection.
5. The recovered constant `qi` is `1000`. Victory schedules `roundEnd` after exactly 1000 ms. Only that callback increments the round and emits `BAGLIKE_BATTLE_ROUND_END` or `BAGLIKE_BATTLE_END` (`.../BattleInstanceController.ts.deobfuscated.js:485-492`; `work/battlefield-runtime-analysis/primitive-variables.json:212`).
6. `BagLikeView` handles `BAGLIKE_BATTLE_ROUND_END` by issuing the recovered `coinRewards` drop. Therefore round coins are post-victory round-end rewards, not combat-frame rewards (`work/ui-module-analysis/modules/BagLikeView.ts.deobfuscated.js:3`, notification handler and `r(false, ...)` branch).

## Reconstruction correction

The previous reconstruction waited for an extra one-second enemy-free combat window and continued resolving future pending hits during it, then used another 0.7-second callback. That could incorrectly turn an already-cleared wave into a loss.

The production path now:

- resolves due fusion/projectile hits before the outcome reducer;
- preserves self-home death priority;
- enters `roundClear` immediately when the schedule and enemy list are empty;
- clears units, future pending hits, and projectile visuals immediately;
- preserves final-kill EXP already emitted by `killUnit`;
- awards recovered round coins and H15 round-end coins in the one-second round-end callback.

Validation: `tests/all-level-playability.test.mjs` executes all `200` levels / `2,978` rounds / `54,816` scheduled spawns and includes explicit simultaneous-clear, pending-hit cancellation, callback-delay, and production-source ordering assertions.

## Remaining scheduler question

The battle subpackage imports `GameTimer` and `BattleTimer` from the common main chunk rather than defining them. A later dedicated main-asset extractor safely recovered both Timer classes and `BaseLauncher`; combined with the bundled Cocos Scheduler it proves `GameTimer` runs before `BattleTimer`. See `battlefield-cross-scheduler-boundary.md` for that independent boundary.
