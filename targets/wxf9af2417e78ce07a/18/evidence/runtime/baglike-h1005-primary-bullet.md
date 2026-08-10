# H1005 primary type-11 bullet evidence

Target: `wxf9af2417e78ce07a/18`

## Recovered configuration

`SkillConfig 10001` is a 1000 ms basic attack with a 300 ms behavior delay,
250 casting range, and `atkPoint={x:0,y:50}`. `bh10001_1` creates
`M_FD_10001`. The decoded missile row is:

```json
{
  "id": "M_FD_10001",
  "type": 11,
  "speed": 1000,
  "timeLimit": 4000,
  "distance": 500,
  "parameter": { "width": 600, "interval": 1000, "autoLock": 600 },
  "behaviors": ["10001_bh02_1"],
  "modelId": "H27_S1"
}
```

`BehaviorConfig 10001_bh02_1` is one `hurt` effect at ratio 5000 with
`SELF_RECTANGLE`, width 100 and height 300, against the enemy faction.

## Runtime trace

- `BattleEnum.ts.deobfuscated.js:19-23` defines the bullet enum. The matching
  primitive map gives Smart through Rocket as values 2-10, Ray as 18 and Dart
  as 19 (`primitive-variables.json:6,9-16,2879,2881`). There is no enum member
  for value 11; in particular type 11 is not Ray.
- `UnitFactory.ts.deobfuscated.js:113-159` has explicit cases for Smart,
  Physical, Bomb, Throw, Bounce, StretchBounce, Rocket, Ray and Dart. An
  unmatched value reaches the default `BulletUnit` pool at lines 153-155.
- `FightSkillInfo.ts.deobfuscated.js:124-130` passes the caster's computed
  `atkPoint` into bullet initialization. `BattleUnit.ts.deobfuscated.js:415-420`
  resolves the current skill's configured attack point, proving H1005 launches
  50 units above its actor origin.
- `BulletUnit.ts.deobfuscated.js:56-62` snapshots the attack value, start point,
  initial target point, angle and fixed move vector. Its maximum time is
  `(launchDistance - 20) / moveSpeed`.
- `BulletUnit.ts.deobfuscated.js:70-91` advances that fixed vector, triggers
  early only on collision with the still-resolvable locked target, otherwise
  acts at maximum time, consumes its behavior once and ends. The generic class
  never reads `distance`, `timeLimit`, `parameter.width`, `interval` or
  `autoLock`.
- `SkillUtils.ts.deobfuscated.js:160-174` resolves `SELF_RECTANGLE` from the
  missile caster position toward the living skill target with the behavior's
  width and height.

## Restored semantics

The reconstruction therefore launches H1005's basic projectile from offset
`(0,50)` in the target's initial direction at speed 1000, stops approximately
20 units before that initial target point (unless collision triggers first),
then applies a single 5000-ratio 100-by-300 rectangle from the bullet endpoint
toward the locked target's current position. If the locked target has already
died, no replacement target is acquired and no damage is emitted.

The missile row's `distance=500`, `timeLimit=4000`, visual `width=600`,
`interval=1000`, and `autoLock=600` are confirmed disconnected fields for this
version-18 factory path, not unfinished mechanics.

## Validation

- `baglike-fusion-heroes.test.mjs`: 15 assertions.
- `h10-primary-bullet-runtime.test.mjs`: 9 assertions.
- Full `tests/*.test.mjs` static suite: pass.
- TypeScript `--noEmit`: pass.
- Cocos Creator 3.8.8 Web Mobile build: `build Task (web-mobile) Finished`.
- `late-fusion-browser-contract.mjs`: 13/13; live sample recorded 5 H1005
  primary casts and 2 resolved primary hits with zero runtime errors.
