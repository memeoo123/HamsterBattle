# GameTimer / BattleTimer cross-scheduler boundary

## Confirmed order

The original version-18 engine tick runs `GameTimer` before `BattleTimer`.

- `Timer` assigns Cocos `System.Priority.M` and immediately registers itself through
  `director.getScheduler().scheduleUpdate(...)` in its superclass constructor
  (`work/scheduler-order-analysis/main-asset-modules/Timer.ts.deobfuscated.js`).
- `GameTimer` keeps that inherited registration unchanged
  (`work/scheduler-order-analysis/main-asset-modules/GameTimer.ts.deobfuscated.js`).
- `BattleTimer` assigns `Priority.HIGH` only *after* the `Timer` superclass constructor
  has already registered it. It never reschedules, so its effective scheduler entry is
  also `M`, not `HIGH`
  (`work/scheduler-order-analysis/main-asset-modules/BattleTimer.ts.deobfuscated.js`).
- `BaseLauncher.in()` creates `GameTimer.ins()` first and `BattleTimer.ins()` second
  (`work/scheduler-order-analysis/main-asset-modules/BaseLauncher.ts.deobfuscated.js`).
- The bundled Cocos scheduler in preserved `reverse-work/unpacked/.../main/game.js`
  routes equal-priority entries through `_priorityIn`; that function appends when no
  strictly greater entry is found. Its update pass then walks the list from index zero
  upward. Registration order is therefore stable for this equal-`M` pair.

Together these source paths prove the cross-scheduler tie: a due core contact and a due
combat frame on the same engine tick resolve core/production first, combat second. The
reconstruction already calls `stepPowerProduction(...)` before `stepBattle(...)`; the
production contract test now locks that order explicitly.

## Other confirmed scope

- `FightTimeCheck.nextFrame()` advances its counter by the current
  `BattleTimer.speed`, invokes the trigger, and completes/removes itself at the
  recovered boundary
  (`work/scheduler-order-analysis/FightTimeCheck.ts.deobfuscated.js:3`).
- `FightTimeLoop.triggerHandler()` also accumulates `BattleTimer.speed`, invokes its
  callback when the loop threshold is reached, and resets the loop counter
  (`work/scheduler-order-analysis/FightTimeLoop.ts.deobfuscated.js:3`).
- The battle controller's internal frame stages and the power core's internal
  quarter-turn stages are separately recovered and tested.
