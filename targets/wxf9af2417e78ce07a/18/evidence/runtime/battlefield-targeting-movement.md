# Battlefield targeting and movement evidence

Target: `wxf9af2417e78ce07a/18`  
Representative level: `1004 / 荒漠沙地`

## Preserved source derivatives

- `work/targeting-movement-analysis/` contains isolated deobfuscated derivatives of
  `BattleUnit.ts`, `UnitSearchUtils.ts`, `SkillUtils.ts`, `UnitCollisionsManager.ts`,
  `ActorUnit.ts`, `MoveVec.ts`, and their primitive-variable map.
- `work/targeting-movement-support/` contains the supporting `V2Quadtree.ts`,
  `CollisionUtils.ts`, `MathUtils2.ts`, `BattleAttr.ts`, `SkillData.ts`, and enum/config
  derivatives.
- The earlier line-formatted copies remain under
  `work/battlefield-runtime-analysis/formatted/`. Source package inputs and recovered
  assets were not modified.

## Confirmed target rules

- Representative normal attacks use `TargetFaction.EnemySide` and
  `SearchType.Nearset`. `SkillUtils.searchTarget` delegates the nearest branch to
  `UnitSearchUtils.getNearestBattleUnit` (`SkillUtils.ts`, formatted lines 41-58).
- Every AI update checks the selected target and then performs target search again for
  the current skill (`BattleUnit.ts`, formatted lines 141-156 and 256-264). A target is
  cleared when dead, not selectable, or at/over `searchRange`.
- Collision trees contain only alive/selectable units. Search uses a square broad phase
  followed by Euclidean distance with strict `< searchRange`
  (`UnitCollisionsManager.ts`; `V2Quadtree.queryNearest`).
- The tree inserts each team in reverse unit-array order, queries quadrants `0..3`, and
  scans results backwards. The implementation reproduces that observable equal-distance
  priority, retaining earlier-created order inside the same leaf.
- Units outside the original tree rectangle `(-500,-1000,1000,2000)` cannot be selected.
- Attack activation uses strict `< castingRange` in the AI branch. The later defensive
  check permits equality, but it is not reached from normal AI at equality
  (`BattleUnit.ts`, formatted lines 214-217 and 256-264).

## Confirmed movement rules

- Pursuit calls `CollisionUtils.calVecTemp(origin,target,moveDistance)`: the frame move is
  a normalized vector whose total length is the configured movement distance. There is
  no separate horizontal speed plus capped vertical correction.
- Logical homes are created at `x=-300/+300` (`UnitFactory.ts`, formatted lines 70-73).
  With no unit target, distances over 200 use the actor's current y (horizontal movement);
  inside 200 the exact home point is used. Movement is suppressed when the absolute home
  x difference is at most 40 (`BattleUnit.ts`, formatted lines 261-264).
- In normal trunk mode, enemies may attack the self home; heroes do not attack the enemy
  home. Heroes still approach and stop according to casting range
  (`BattleUnit.ts`, formatted lines 265-266).
- `BattleUnit` sets collision width/height to 60 (formatted line 76). Before action update,
  each hero receives a magnitude-2 push away from every same-team hero inside its centered
  60x60 rectangle. Monsters do not receive this environment separation
  (`UnitCollisionsManager.calUnitEnvVec/calCollisionVec`).
- Frame order is: rebuild both collision trees, calculate hero separation, update heroes
  newest-to-oldest, then monsters newest-to-oldest, then bullets
  (`BattleProcessor.ts`, formatted lines 22-37).
- `updateBlockUnits` is empty in this runtime. `ActorUnit.tryMove` therefore applies the
  combined environment and movement vectors directly for the representative battlefield;
  no unproven static-obstacle path was added.

## Production mapping and verification

- Pure rules live in `cocosProject/assets/scripts/BattlefieldKernel.ts`; scene integration
  is in `CangshuGame.stepBattle/stepUnit`.
- H01-H04 and level-1004 monsters use the nearest-target path. H12/H13 remain on their
  separately recovered random-target tower-skill path.
- `cocosProject/tests/battlefield-kernel.test.mjs` covers strict search/home-attack
  boundaries, selectable and tree filters, equal-distance priority, normalized diagonal
  movement, far/near home movement, and hero separation. Result: `26/26` assertions.
- All six repository test files pass. The Cocos Creator 3.8.8 bundled TypeScript compiler
  passes the project with `--noEmit --skipLibCheck true`. The project checker reports
  `valid: true`, no missing `.meta`, errors, or warnings.

The global matched-replay gate remains open: an in-Creator, same-timestamp trace against
the original is still required for the whole level, especially same-frame event/RNG order.
That gate does not leave a known targeting or movement rule unresolved.
