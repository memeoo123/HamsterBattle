import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
    advancePowerCoreClock,
    applyWorkerPower,
    BATTLE_SPEED_UP_MULTIPLE,
    connectedGearUidsAtCoreSide,
    gearRotationAngleDegrees,
    gearRotationParity,
    HAMSTER_SPAWN_FLIGHT_SECONDS,
    isGearDirectlyAdjacentToCore,
    p01RoundStartProductivity,
    powerCoreBattleRotationAngleDegrees,
    POWER_CORE_VISUAL_LAP_SECONDS,
    POWER_CONTACT_DELAY_SECONDS,
    POWER_QUARTER_LAP_SECONDS,
    powerContactsByGear,
    productionRatePerSecond,
    resolveProducerAttributeScales,
    resolveWorkerPowerPerTrigger,
    WORKER_COMPLETE_ANIMATION_SECONDS,
    unitPresentationBackToFront,
} from '../assets/scripts/BattlefieldProduction.ts';

const gears = [
    { uid: 1, row: 2, col: 3, shape: [[0, 0]] },
    { uid: 2, row: 1, col: 4, shape: [[0, 0], [1, 0]] },
    { uid: 3, row: 1, col: 3, shape: [[0, 0]] },
    { uid: 4, row: 0, col: 0, shape: [[0, 0]] },
];

const contacts = powerContactsByGear(gears, 1);
assert.equal(contacts.get(2), 2, 'one connected component touching two core sides receives two triggers per lap');
assert.equal(contacts.get(3), 2, 'every gear in the connected component receives both triggers');
assert.equal(contacts.get(4) || 0, 0, 'a disconnected gear has no productivity');
assert.deepEqual(connectedGearUidsAtCoreSide(gears, 1, 0).sort(), [2, 3]);
assert.deepEqual(connectedGearUidsAtCoreSide(gears, 1, 3).sort(), [2, 3]);
assert.deepEqual(connectedGearUidsAtCoreSide(gears, 1, 1), []);

const adjacencyGears = [...gears, { uid: 5, row: 0, col: 3, shape: [[0, 0]] }];
assert.equal(isGearDirectlyAdjacentToCore(adjacencyGears, 1, 2), true, 'a multi-cell gear touching a core-neighbor cell qualifies as near power');
assert.equal(isGearDirectlyAdjacentToCore(adjacencyGears, 1, 3), true, 'a gear immediately above the core qualifies as near power');
assert.equal(isGearDirectlyAdjacentToCore(adjacencyGears, 1, 5), false, 'a connected gear two cells from the core does not qualify as near power');
const nearPowerScales = resolveProducerAttributeScales(1.5, true, 1.2);
assert.ok(Math.abs(nearPowerScales.attack - 1.8) < 1e-12 && nearPowerScales.hp === 1.5, 'near-power ability multiplies spawned attack but not HP');
assert.deepEqual(resolveProducerAttributeScales(1.5, false, 1.2), { attack: 1.5, hp: 1.5 }, 'a non-adjacent connected producer receives no near-power attack bonus');
assert.equal(resolveWorkerPowerPerTrigger(10, true, 1.2), 12, 'an adjacent H01 producer receives twelve worker points per trigger');
assert.equal(resolveWorkerPowerPerTrigger(10, false, 1.2), 10, 'a connected-only producer keeps its base worker points');
const fractionalWorkerCompletion = applyWorkerPower(96, resolveWorkerPowerPerTrigger(8, true, 1.2));
assert.ok(fractionalWorkerCompletion.completed && Math.abs(fractionalWorkerCompletion.value - 5.6) < 1e-12, 'boosted fractional worker progress completes and preserves the modulo remainder');
assert.ok(Math.abs(productionRatePerSecond(resolveWorkerPowerPerTrigger(10, true, 1.2), 1) - 0.1) < 1e-12, 'the displayed adjacent H01 production rate includes worker efficiency');

assert.ok(Math.abs(productionRatePerSecond(10, 2) - 1 / 7) < 1e-12, 'H01 two-contact productivity is 0.142857/s');
assert.ok(Math.abs(productionRatePerSecond(20, 1) - 1 / 6) < 1e-12, 'H12 one-contact skill rate is 0.166667/s');
assert.equal(productionRatePerSecond(10, 0), 0);
assert.deepEqual(applyWorkerPower(80, 10), { value: 90, completed: false });
assert.deepEqual(applyWorkerPower(90, 10), { value: 0, completed: true });
assert.deepEqual(applyWorkerPower(95, 20), { value: 15, completed: true });
assert.equal(WORKER_COMPLETE_ANIMATION_SECONDS, 0.25, 'worker completion animation lasts 250 ms');
assert.equal(HAMSTER_SPAWN_FLIGHT_SECONDS, 0.5, 'HAMSTER output flight lasts 500 ms');
assert.equal(BATTLE_SPEED_UP_MULTIPLE, 1.5, 'battle speed toggle uses the original 1.5x multiplier');
assert.equal(p01RoundStartProductivity(5), 1.1, 'P01 star-0 round-start skill raises productivity by 10%');
assert.equal(p01RoundStartProductivity(0), 1, 'P01 star-0 productivity returns to baseline after five seconds');

assert.equal(gearRotationParity(10, 17), 0, 'an even meshing cell uses the clockwise-negative branch');
assert.equal(gearRotationParity(11, 17), 1, 'an adjacent cell alternates to the counter-clockwise-positive branch');
assert.equal(gearRotationAngleDegrees(10, 17, 0.1, 0.2), -180, 'an even cell reaches a negative half turn halfway through the decoded delay');
assert.equal(gearRotationAngleDegrees(11, 17, 0.1, 0.2), 202.5, 'an adjacent cell reaches the opposite half turn from its 22.5-degree phase');
assert.equal(gearRotationAngleDegrees(11, 17, 0.2, 0.2), 22.5, 'a completed revolution lands on its visually equivalent base phase');
assert.equal(POWER_CORE_VISUAL_LAP_SECONDS, 4, 'the center rotor uses the observed calm four-second visual lap');
assert.equal(powerCoreBattleRotationAngleDegrees(0), 0, 'the P01 panel starts battle from the zero-angle pose');
assert.equal(powerCoreBattleRotationAngleDegrees(1), 90, 'the P01 panel reaches one quarter after one battle second');
assert.equal(powerCoreBattleRotationAngleDegrees(2), 180, 'the P01 panel reaches one half after two battle seconds');
assert.equal(powerCoreBattleRotationAngleDegrees(4), 0, 'the P01 panel wraps after the four-second battle lap');
assert.deepEqual(
    unitPresentationBackToFront([{ uid: 3, y: -30 }, { uid: 2, y: 24 }, { uid: 1, y: 24 }]),
    [1, 2, 3],
    'higher units render first while equal-depth units retain stable uid order',
);

const firstQuarter = advancePowerCoreClock(
    { nextDirection: 1, remainingSeconds: POWER_QUARTER_LAP_SECONDS },
    POWER_QUARTER_LAP_SECONDS,
    (direction) => direction === 1,
);
assert.deepEqual(firstQuarter.contacts, [{ direction: 1, occupied: true }], 'the first completed quarter-lap contacts direction 1, not the zero-angle pose');
assert.equal(firstQuarter.state.nextDirection, 2, 'the core continues toward the next side instead of resetting at battle start');
assert.ok(
    Math.abs(firstQuarter.state.remainingSeconds - (POWER_QUARTER_LAP_SECONDS + POWER_CONTACT_DELAY_SECONDS)) < 1e-12,
    'an occupied preparation-side contact still inserts the decoded 200 ms pause',
);
const continuedClock = advancePowerCoreClock(
    firstQuarter.state,
    POWER_QUARTER_LAP_SECONDS + POWER_CONTACT_DELAY_SECONDS,
    () => false,
);
assert.deepEqual(continuedClock.contacts, [{ direction: 2, occupied: false }], 'the battle production clock continues across consecutive contact segments');

const boostedQuarter = advancePowerCoreClock(
    { nextDirection: 1, remainingSeconds: POWER_QUARTER_LAP_SECONDS },
    POWER_QUARTER_LAP_SECONDS,
    () => true,
    p01RoundStartProductivity(5),
);
assert.ok(
    Math.abs(boostedQuarter.state.remainingSeconds - (POWER_QUARTER_LAP_SECONDS + POWER_CONTACT_DELAY_SECONDS) / 1.1) < 1e-12,
    'new P01 core rotation and occupied-side delay are both scheduled through the active productivity multiplier',
);

const gameSource = fs.readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
const productionStep = gameSource.indexOf('this.stepPowerProduction(simulationDt, true);');
const battleStep = gameSource.indexOf("if (this.phase === 'battle' && !this.paused) this.stepBattle(simulationDt);");
assert.ok(
    productionStep >= 0 && battleStep > productionStep,
    'the reconstructed engine tick runs the recovered GameTimer/core-production phase before BattleTimer/combat',
);
assert.match(gameSource, /powerCore:\s*\{[\s\S]{0,220}new Rect\(775, 341, 108, 102\)/, 'P01 uses the decoded bagLike\/power1.png atlas frame');
assert.match(gameSource, /node\.on\(Node\.EventType\.TOUCH_START[\s\S]{0,420}TOUCH_CANCEL/, 'P01 shares the original generic preparation drag controller');
assert.doesNotMatch(gameSource, /if \(id !== 'P01'\)\s*\{\s*node\.on/, 'P01 is no longer excluded from dragging');
assert.match(gameSource, /id === 'P01' \? new Set<number>\(\) : new Set\(\[this\.currentPowerIndex\(\)\]\)/, 'moving P01 can target any unlocked cell while other gears reserve its live cell');
assert.match(gameSource, /PowerCoreRotor[\s\S]{0,1000}PowerCoreHamster/, 'the rotating power panel and independently moving hamster are separate presentation nodes');
assert.match(gameSource, /if \(!this\.paused && this\.phase === 'battle'\)[\s\S]{0,180}stepPowerProduction/, 'the power clock starts only in battle');
assert.doesNotMatch(gameSource, /this\.phase === 'deploy' \|\| this\.phase === 'battle'/, 'preparation no longer advances the center rotor or production clock');
assert.match(gameSource, /this\.phase === 'battle'[\s\S]{0,120}powerCoreBattleRotationAngleDegrees/, 'the center rotor applies its slowed visual clock only in battle');

console.log('battlefield production: 51 assertions passed');
