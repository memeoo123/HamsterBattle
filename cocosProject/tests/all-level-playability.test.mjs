import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
    advanceEnemySpecialCast,
    assassinateDestination,
    buildNormalEnemyMechanicsProfiles,
    selectFarthestEnemySkillTarget,
} from '../assets/scripts/NormalLevelRuntime.ts';
import { buildNormalLevelRuntimeConfig } from '../assets/scripts/NormalLevelRuntime.ts';
import {
    normalLevelFailedAttempts,
    normalLevelRetryState,
    resolveNormalBattleOutcome,
    resolveNormalRoundCompletion,
} from '../assets/scripts/NormalLevelRuntime.ts';
import { PLAYABLE_LEVEL_IDS, playableLevelCards } from '../assets/scripts/MainLevelFlow.ts';
import { bagLikeProducerProfile } from '../assets/scripts/BagLikeUnitProgression.ts';
import { bagLikeProducerShape } from '../assets/scripts/BagLikeUnitProgression.ts';
import { drawDynamicCandidateBatch, placementAreaValid } from '../assets/scripts/BagLikeCandidateDrops.ts';

const table = JSON.parse(fs.readFileSync(new URL('../assets/resources/data/normal-levels.json', import.meta.url), 'utf8'));
const battleSource = fs.readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
const enemies = buildNormalEnemyMechanicsProfiles(table.monsters);
const supportedModels = new Set(Object.keys(enemies));

assert.equal(PLAYABLE_LEVEL_IDS.length, 200, 'the main selector exposes all 200 recovered levels');
assert.deepEqual(PLAYABLE_LEVEL_IDS, table.levels.map((level) => level.id), 'selector order follows the recovered table');
assert.equal(playableLevelCards(table.levels).length, 200, 'all recovered rows build a selection card');
assert.equal(Object.keys(enemies).length, 29, 'every recovered monster catalog row has a mechanics profile');
assert.match(battleSource, /challengeTimes = 1;/, 'a fresh reconstructed session uses recovered first-challenge candidate batches');

const tutorialRuntime = buildNormalLevelRuntimeConfig(table, 1001, supportedModels);
assert.deepEqual(
    tutorialRuntime.preparation.staticBuffsByLevel.get(2),
    ['RG_H02_abl03_eff02'],
    'level 1001 forces the recovered H02 tutorial buff when bag-like level 2 opens',
);
assert.match(battleSource, /this\.staticBuffsByLevel\.get\(this\.bagLikeLevel\)/, 'production trait selection consumes recovered level-keyed static buffs');

const gridRows = 5;
const gridColumns = 7;
const initiallyUnlocked = new Set([9, 10, 11, 16, 17, 18, 23, 24, 25]);
const reservedCore = new Set([17]);
const canInitiallyProduce = (gearId) => {
    const shape = bagLikeProducerShape(gearId);
    if (!shape) return false;
    for (let row = 0; row < gridRows; row += 1) {
        for (let column = 0; column < gridColumns; column += 1) {
            if (!placementAreaValid(shape, row, column, gridRows, gridColumns, initiallyUnlocked, reservedCore)) continue;
            if (shape.some(([rowOffset, columnOffset]) =>
                Math.abs(row + rowOffset - 2) + Math.abs(column + columnOffset - 3) === 1,
            )) return true;
        }
    }
    return false;
};

for (const level of table.levels) {
    const firstStaticBatch = level.staticBricks?.[0] || null;
    if (!firstStaticBatch) continue;
    assert.ok(firstStaticBatch.some(canInitiallyProduce), `level ${level.id} first recovered batch contains a producer that can contact the core`);
}

const dynamicFamilies = ['H01', 'H02', 'H03', 'H04', 'H05', 'H06', 'H11', 'H12', 'H13', 'H14', 'H16', 'H17'];
for (let first = 0; first < dynamicFamilies.length; first += 1) {
    for (let second = 0; second < dynamicFamilies.length; second += 1) {
        for (let third = 0; third < dynamicFamilies.length; third += 1) {
            const rolls = [
                0, (first + 0.5) / dynamicFamilies.length,
                0, (second + 0.5) / dynamicFamilies.length,
                0, (third + 0.5) / dynamicFamilies.length,
                ...Array(24).fill(0.5),
            ];
            let rollIndex = 0;
            const batch = drawDynamicCandidateBatch(
                [3000, 3000, 3000],
                {
                    unlockedHeroFamilies: new Set(dynamicFamilies),
                    hasLockedGrid: true,
                    placedGearIds: [],
                    nonAdRefreshTimes: 1,
                },
                () => rolls[rollIndex++] ?? 0.5,
            );
            assert.ok(batch.some(canInitiallyProduce), `dynamic opening ${first}/${second}/${third} contains a core-connectable producer after family fill`);
        }
    }
}

let roundCount = 0;
let spawnCount = 0;
const staticGearIds = new Set();
for (const levelId of PLAYABLE_LEVEL_IDS) {
    const runtime = buildNormalLevelRuntimeConfig(table, levelId, supportedModels);
    assert.ok(runtime.rounds.length > 0, `level ${levelId} has a playable wave sequence`);
    assert.ok(Array.isArray(runtime.preparation.staticBatches), `level ${levelId} has a recovered preparation contract`);
    for (const batch of runtime.preparation.staticBatches) {
        for (const gearId of batch) staticGearIds.add(gearId);
    }
    let sessionRoundIndex = 0;
    let failedAttempts = 0;
    for (const [roundIndex, round] of runtime.rounds.entries()) {
        roundCount += 1;
        spawnCount += round.monsters.length;
        assert.equal(round.times.length, round.monsters.length, `round ${round.id} spawn schedule aligns`);
        assert.ok(round.monsters.every((id) => enemies[id]), `round ${round.id} resolves every enemy profile`);
        const active = resolveNormalBattleOutcome({
            homeHp: runtime.level.homeHp,
            scheduleComplete: false,
            enemiesAlive: true,
            clearTimer: 0.75,
            dt: 0.25,
        });
        assert.deepEqual(active, { state: 'battle', clearTimer: 0 }, `round ${round.id} cannot clear before its schedule and enemies finish`);
        const cleared = resolveNormalBattleOutcome({
            homeHp: runtime.level.homeHp,
            scheduleComplete: true,
            enemiesAlive: false,
            clearTimer: 0,
            dt: 0,
        });
        assert.deepEqual(cleared, { state: 'round-clear', clearTimer: 0 }, `round ${round.id} clears immediately after its final bullet/unit pass`);

        failedAttempts = normalLevelFailedAttempts(failedAttempts, false);
        assert.equal(failedAttempts, 1, `level ${levelId} records a failed attempt`);
        const retry = normalLevelRetryState(failedAttempts);
        assert.deepEqual(retry, { roundIndex: 0, failedAttempts: 1 }, `level ${levelId} retry returns to wave 1 and preserves compensation`);
        failedAttempts = 0;

        const completion = resolveNormalRoundCompletion(sessionRoundIndex, runtime.rounds.length);
        if (roundIndex === runtime.rounds.length - 1) {
            assert.deepEqual(completion, { state: 'won', roundIndex }, `level ${levelId} final round reaches victory`);
            failedAttempts = normalLevelFailedAttempts(2, true);
            assert.equal(failedAttempts, 0, `level ${levelId} victory clears prior failed attempts`);
        } else {
            assert.deepEqual(completion, { state: 'next-round', roundIndex: roundIndex + 1 }, `level ${levelId} advances to its next recovered round`);
            sessionRoundIndex = completion.roundIndex;
        }
    }
}
assert.equal(roundCount, 2978, 'all recovered normal rounds are executable');
assert.equal(spawnCount, 54816, 'all recovered scheduled spawns are executable');
for (const gearId of staticGearIds) {
    assert.match(battleSource, new RegExp(`\\b${gearId}: \\{ id: '${gearId}'`), `static gear ${gearId} has a production config`);
    if (gearId.startsWith('H')) {
        assert.ok(bagLikeProducerProfile(gearId), `static hero gear ${gearId} has a producer profile`);
    }
}
for (const family of ['H05', 'H06', 'H14', 'H16', 'H17']) {
    for (let level = 1; level <= 4; level += 1) {
        const gearId = `${family}0${level}`;
        assert.ok(bagLikeProducerProfile(gearId), `late-game dynamic gear ${gearId} has a producer profile`);
        assert.match(battleSource, new RegExp(`\\b${gearId}: \\{ id: '${gearId}'`), `late-game dynamic gear ${gearId} has a production config`);
    }
}
assert.match(battleSource, /H0501:[\s\S]{0,500}range: 150[\s\S]{0,500}effectRatio: 10000/, 'H05 keeps its decoded medium-range full-attack basic hit');
assert.match(battleSource, /H0601:[\s\S]{0,500}projectileSpeed: 800[\s\S]{0,200}areaRadius: 50/, 'H06 keeps its decoded missile speed and blast radius');
assert.match(battleSource, /H1401:[\s\S]{0,500}effectRatio: 3000[\s\S]{0,200}areaRadius: 75[\s\S]{0,200}maxTargets: 3/, 'H14 keeps its decoded three-target shark impact');
assert.match(battleSource, /H1401:[\s\S]{0,700}knockbackDistance: 50/, 'H14 keeps its decoded 50-unit knockback');
assert.match(battleSource, /H1601:[\s\S]{0,500}range: 75[\s\S]{0,500}effectRatio: 10000/, 'H16 keeps its decoded melee attack');
assert.match(battleSource, /H1701:[\s\S]{0,700}multiHitDelays: \[0, 0\.33, 0\.66, 1, 1\.3, 1\.4\]/, 'H17 keeps all six decoded laser pulse timings');
assert.match(battleSource, /model === 'H1701'[\s\S]{0,700}selectH03LaserTargets\(caster, target, targets, 150, 500, 999\)/, 'H17 production uses its decoded 150 x 500 line geometry');

assert.equal(enemies.M12.focusHome, true, 'M12 preserves focus-on-base targeting');
assert.equal(enemies.M13.selfDestructRadius, 100, 'M13 preserves the recovered self-destruct radius');
assert.equal(enemies.M11.knockbackDistance, 100, 'M11 preserves the recovered knockback distance');
assert.equal(enemies.M14.assassinateCooldown, 20, 'M14 preserves the recovered assassination cooldown');
assert.equal(enemies.B01.specialEffectRatio, 15000, 'B01 preserves its recovered boss skill ratio');
assert.equal(enemies.B03.specialRadius, 150, 'B03 preserves its recovered boss area radius');
assert.equal(enemies.B01.effectRatio, 5000, 'B01 basic missiles use the recovered half-attack ratio');
assert.deepEqual(enemies.B01.multiHitDelays, [0.3, 0.6, 0.9], 'B01 preserves all three basic missile timings');
assert.equal(enemies.B01.specialPreCooldown, 5, 'large boss active skills preserve their five-second pre-cooldown');
assert.equal(enemies.B01.specialCastTime, 1.5, 'large boss active skills preserve their 1.5-second cast');
assert.equal(enemies.M01.heroResistance, 5000, 'M01 preserves hamster damage resistance');
assert.equal(enemies.M06.towerResistance, 5000, 'M06 preserves wheel damage resistance');
assert.deepEqual(resolveNormalBattleOutcome({
    homeHp: 0,
    scheduleComplete: true,
    enemiesAlive: false,
    clearTimer: 1,
    dt: 0,
}), { state: 'lost', clearTimer: 0 }, 'base destruction takes priority over simultaneous wave clear');
assert.deepEqual(resolveNormalBattleOutcome({
    homeHp: 1,
    scheduleComplete: true,
    enemiesAlive: false,
    clearTimer: 0.99,
    dt: 0,
}), { state: 'round-clear', clearTimer: 0 }, 'final enemy death closes combat immediately instead of exposing a pending-hit damage window');

const assassin = { x: 300, y: 10 };
const nearTarget = { id: 'near', x: 220, y: 10 };
const farTarget = { id: 'far', x: -100, y: -20 };
assert.equal(selectFarthestEnemySkillTarget(assassin, [nearTarget, farTarget], 1000), farTarget, 'assassination targets the recovered farthest target type');
assert.equal(selectFarthestEnemySkillTarget(assassin, [farTarget], 300), null, 'assassination respects search range');
assert.deepEqual(assassinateDestination(assassin, farTarget, 45), { x: -55, y: -20 }, 'assassin flashes to the caster-facing side at recovered distance 45');

let cast = advanceEnemySpecialCast({ elapsed: 0, behaviorTriggered: false }, 0.29, 0.3, 1.5);
assert.equal(cast.triggerBehavior, false, 'boss behavior does not fire before 300 ms');
cast = advanceEnemySpecialCast(cast, 0.01, 0.3, 1.5);
assert.equal(cast.triggerBehavior, true, 'boss behavior fires at 300 ms');
cast = advanceEnemySpecialCast(cast, 0.8, 0.3, 1.5);
assert.equal(cast.triggerBehavior, false, 'boss behavior fires only once');
assert.equal(cast.complete, false, 'boss remains casting before 1.5 seconds');
cast = advanceEnemySpecialCast(cast, 0.4, 0.3, 1.5);
assert.equal(cast.complete, true, 'boss cast completes at 1.5 seconds');
assert.match(battleSource, /tryBeginEnemySpecial\(unit, opponents\)/, 'production unit loop starts recovered enemy specials');
assert.match(battleSource, /selectFarthestEnemySkillTarget/, 'production assassination uses farthest-target selection');
assert.match(battleSource, /selectH03LaserTargets\([\s\S]*enemySpecialWidth[\s\S]*enemySpecialHeight/, 'production large-boss line attack uses recovered rectangle geometry');
assert.match(battleSource, /enemySpecialRadius/, 'production B03 active skill uses recovered self-area radius');
assert.match(battleSource, /unit\.cfg\.multiHitDelays/, 'production B01 basic attack queues all recovered missile hits');
assert.doesNotMatch(battleSource, /selfDestructRadius[\s\S]{0,500}const victims/, 'M13 self-destruction does not invent a second nearby-hero hit');
assert.match(battleSource, /selfDestructRadius[\s\S]{0,500}killUnit\(hit\.attacker\)/, 'M13 kills itself after its single recovered home hit');
assert.match(battleSource, /resolveNormalBattleOutcome/, 'production battle loop consumes the tested outcome state machine');
assert.match(battleSource, /stepFusionSkillHits\(dt\);[\s\S]{0,100}stepPendingHits\(dt\);[\s\S]{0,500}resolveNormalBattleOutcome/, 'production resolves every due hit before checking the terminal state');
assert.match(battleSource, /private completeRound\(\): void \{[\s\S]{0,500}this\.clearUnits\(\);[\s\S]{0,500}scheduleOnce/, 'round clear cancels future projectiles before the delayed round-end callback');
assert.match(battleSource, /scheduleOnce\(\(\) => \{[\s\S]{0,300}roundCoinRewards[\s\S]{0,800}\}, 1\);/, 'round coin rewards are applied by the recovered one-second round-end callback');
assert.match(battleSource, /bagLikeProducerShape\(id\) \|\| GEARS\[id\]\.shape/, 'production rendering, placement and core-contact calculations consume the tested recovered producer shapes');
assert.match(battleSource, /resolveNormalRoundCompletion\(this\.roundIndex, this\.rounds\.length\)/, 'production round loop consumes the tested 200-level completion state machine');
assert.match(battleSource, /normalLevelRetryState\(this\.failedAttempts\)/, 'production retry consumes the tested reset state');
assert.match(battleSource, /normalLevelFailedAttempts\(this\.failedAttempts, won\)/, 'production result overlay consumes the tested attempt state');
assert.match(battleSource, /mechanicsFirstDefeatCompensation\(this\.failedAttempts\)/, 'production retries add the mechanics-first accessibility decay after recovered rows');

console.log('all-level playability: 200 levels / 2978 rounds / 54816 spawns passed');
