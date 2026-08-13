# Battlefield frame, core-clock, and RNG order

Target: `wxf9af2417e78ce07a/18`

Status: confirmed for the battle-controller frame order, the power-core phase lifetime, and the two RNG domains described below. The separately recovered common Timer/launcher and bundled Scheduler source also confirms that the independent `GameTimer` power-core tween runs before the `BattleTimer` combat frame; see `battlefield-cross-scheduler-boundary.md`.

## Battle frame order

The recovered call chain is:

1. `BattleInstanceController.onUpdate` schedules every due monster.
2. `BattleInstance.onUpdate` calls the battle processor and then the automatic handler.
3. `BattleProcessor.onUpdate` updates teams, snapshots collisions, calculates hero separation in reverse hero order, updates buffs and battle timers, updates heroes in reverse creation order, updates monsters in reverse creation order, updates leader skills in reverse order, disposes queued units, sorts depth, and finally updates bullets in reverse creation order.
4. `BattleInstanceController.onUpdate` checks timeout/home death first and victory second.

Consequences:

- A monster created by the schedule is visible to collision and unit action in that same frame.
- A bullet created by a hero or monster action is already in the bullet list when the later bullet pass begins and can advance in that same frame.
- Queued unit disposal happens before the bullet pass.
- For the no-enemy-home trunk mode, victory requires both an exhausted schedule and an empty enemy-unit list. Loss is checked first.

Primary recovered sources:

- `work/battlefield-runtime-analysis/formatted/BattleInstanceController.ts.deobfuscated.js`, lines 139-142 and 450-492.
- `work/battlefield-runtime-analysis/formatted/BattleInstance.ts.deobfuscated.js`, lines 46-50.
- `work/battlefield-runtime-analysis/formatted/BattleProcessor.ts.deobfuscated.js`, lines 22-40.
- `work/battlefield-runtime-analysis/formatted/UnitProcessor.ts.deobfuscated.js`, lines 50-58.
- `work/battlefield-runtime-analysis/formatted/BattleManager.ts.deobfuscated.js`, lines 100-104.

## Power-core clock

`BrickShowBaseCom.onTime` is a continuously chained `GameTimer` quarter-lap tween. Completing a quarter advances the direction index and maps it to right/down/left/up. If that side is occupied, it emits `BAGLIKE_POWER_TRIGGER`, waits the recovered contact delay, and resumes. `WorkerBar` resets its progress on `BAGLIKE_BATTLE_ROUND_START`, but the core tween itself is not reset by that notification. `ShowNodeCom` accepts the trigger as worker progress only while `battleState == BATTLE`.

Therefore:

- the zero-angle pose is not itself a contact; the first completed quarter targets direction index 1;
- core phase remains parked during preparation and starts from zero at battle entry (2026-08-13 competitor-observation correction);
- an occupied contact during preparation still incurs the 200 ms pause, but adds no worker progress;
- the first in-battle contact depends on when the player starts the round and cannot be hard-reset to a fixed side.

Primary recovered source: `work/production-runtime-analysis/BrickShowBaseCom.ts.deobfuscated.js` and the recovered `WorkerBar`/`ShowNodeCom` notification branches.

## RNG domains and call order

The shipped runtime keeps at least two independent random domains:

1. `BattleManager.seedRand` uses a seeded linear congruential generator for combat decisions:
   - multiplier `9301`
   - addend `49297`
   - modulus `233280`
   - recurrence `(9301 * seed + 49297) % 233280`
2. Native `Math.random()` is used for schedule spawn Y and factory X/Y positional jitter.

The modulus is reconstructed without guessing. Its primitive is `57787`; the package initializes `NWn=FWn=PWn=1`, `RVn=LVn=true`, and `EVn=bVn=false`, enabling additions `77921`, `21239`, and `76333`: `57787 + 77921 + 21239 + 76333 = 233280`.

For a scheduled monster the recovered draw order is:

1. native schedule spawn-Y draw;
2. native factory X jitter;
3. native factory Y jitter;
4. seeded monster random-move-timer draw during `MonsterUnit.init`;
5. any later same-frame seeded action/skill/dodge/critical draws.

Seeded consumers include random movement timing, random skill targets, skill `randomFix`, dodge, critical, and attack kill-fly. Preparation reward/ability draws use their own `RandomUtils` or native random path and must not be merged into the battle seed stream.

Primary recovered sources:

- `work/battlefield-runtime-analysis/formatted/BattleManager.ts.deobfuscated.js`, lines 129-142.
- `work/battlefield-runtime-analysis/formatted/UnitFactory.ts.deobfuscated.js`, monster factory branches.
- `work/battlefield-runtime-analysis/formatted/MonsterUnit.ts.deobfuscated.js`, random-move initialization.
- `work/battlefield-runtime-analysis/formatted/FightFormula.ts.deobfuscated.js`, dodge/critical/kill-fly branches.
- `work/battlefield-runtime-analysis/formatted/SkillUtils.ts.deobfuscated.js` and `FightSkillInfo.ts.deobfuscated.js`, seeded target/offset branches.

## Reconstruction mapping and validation

- `BattlefieldKernel.ts` now exposes the confirmed frame-stage contract, scheduled-monster RNG-domain order, and seeded LCG.
- `CangshuGame.ts` schedules monsters before unit snapshots/actions, routes combat decisions through the seeded stream, keeps native position draws separate, and resets the parked power-core phase when each battle round starts.
- `BattlefieldProduction.ts` advances one continuous quarter-lap clock in preparation and battle and preserves occupied-side delay outside battle without awarding progress.
- `battlefield-kernel.test.mjs`: `116/116` assertions.
- `battlefield-production.test.mjs`: `28/28` assertions.
- Full rule/resource suite: `882/882` assertions across 13 scripts.

## Remaining trace requirement

The recovered modules do not establish whether a due `GameTimer` power-core contact callback runs before or after a due `BattleTimer` combat-frame callback in the same engine tick. The reconstruction currently advances the power clock before the battle frame, preserving its pre-existing local order, but this is an implementation choice rather than a claimed original fact. Close this final cross-scheduler question only with scheduler-source evidence or a matched original runtime trace.
