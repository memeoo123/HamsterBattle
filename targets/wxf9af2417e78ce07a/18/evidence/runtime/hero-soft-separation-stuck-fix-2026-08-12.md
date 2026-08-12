# Hero soft-separation stuck fix (2026-08-12)

Target: `wxf9af2417e78ce07a/18`

## Earliest divergence

The reconstructed kernel calculated the recovered hero environment vector, but
`CangshuGame.stepUnit` returned before applying it whenever a hero was already
attacking or casting. A stationary front-line hero therefore could not make
space, while a moving rear hero still received the opposite push and could look
permanently pinned.

## Recovered source contract

- `UnitCollisionsManager.calCollisionVec` adds a normalized magnitude-2 vector
  away from every same-team unit inside the hero's 60-by-60 collision rectangle.
- `BattleProcessor.updateAction` calculates those environment vectors before
  updating the heroes.
- `ActorUnit.updatePos` applies `envVec` whenever it is dirty, even if updateAI
  did not set a main movement vector because the unit is attacking or casting.
- `HeroUnit.onBeforUpdatePos` enables the environment path. Frozen/control-locked
  units still fail `canMove()` and do not move.

Preserved derivatives:

- `work/targeting-movement-analysis/UnitCollisionsManager.ts.deobfuscated.js`
- `work/targeting-movement-analysis/BattleProcessor.ts.deobfuscated.js`
- `work/targeting-movement-analysis/ActorUnit.ts.deobfuscated.js`
- `work/battlefield-runtime-analysis/formatted/HeroUnit.ts.deobfuscated.js`

## Reconstruction correction

`CangshuGame.stepUnit` now applies the already-snapshotted hero separation vector
in every stationary attack/cast early-return path, including ordinary attacks,
random-target attacks, H02 barrage, H03 laser and fusion active casts. Frozen
units remain unchanged. The normal moving path still adds main movement and
environment movement exactly once.

`canvas.dataset.selfRuntime` now exposes living friendly-unit coordinates for
future matched stuck-unit sampling without changing gameplay.

## Validation

- Battlefield kernel: 116 assertions pass.
- New battlefield movement integration: 10 assertions pass.
- Full Node suite: 47/47 test files pass.
- TypeScript: pass.
- All-level reducer: 200 levels / 2,978 rounds / 54,816 scheduled spawns.
- Web Mobile build: `2026-08-12 14:24:23`; build log ends with
  `build Task (web-mobile) Finished`.
- Fresh static-build smoke loaded and completed an automated battle without new
  project errors. That account produced at most one friendly unit in the sampled
  run, so it is not claimed as a dense-line live replay.

