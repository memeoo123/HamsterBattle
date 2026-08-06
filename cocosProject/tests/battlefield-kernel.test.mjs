import assert from 'node:assert/strict';
import {
    attackBehaviorDelaySeconds,
    attackIntervalSeconds,
    battlefieldDistance,
    defeatCompensation,
    EMPTY_COMBAT_ATTRIBUTES,
    heroSeparationVector,
    movementVectorToward,
    resolveTargetingIntent,
    resolveBattleDamage,
    resolveBattleDamageWithRandom,
    resolveAttackAtImpact,
    selectBounceBattlefieldTarget,
    selectNearestBattlefieldTarget,
} from '../assets/scripts/BattlefieldKernel.ts';

const attrs = (values = {}) => ({ ...EMPTY_COMBAT_ATTRIBUTES, ...values });
const damage = (values = {}) => resolveBattleDamage({
    attack: 20,
    effectRatio: 10000,
    sourceType: 'HAMSTER',
    source: attrs(),
    target: attrs(),
    targetIsBoss: false,
    rolls: { dodge: 10000, critical: 10000 },
    ...values,
});

assert.equal(damage().value, 20, 'regular H01 hit');
assert.deepEqual(
    { value: damage({ target: attrs({ dodgeRate: 7000 }), rolls: { dodge: 0, critical: 10000 } }).value,
        status: damage({ target: attrs({ dodgeRate: 7000 }), rolls: { dodge: 0, critical: 10000 } }).status },
    { value: 10, status: 'miss' },
    'a dodge result uses the original 50 percent miss factor',
);
assert.equal(damage({ attack: 27, source: attrs({ critRate: 10000 }) }).value, 40, 'critical floors 40.5');
assert.deepEqual(
    { value: damage({ forcedCritical: true, source: attrs({ critDamage: 5000 }) }).value, status: damage({ forcedCritical: true, source: attrs({ critDamage: 5000 }) }).status },
    { value: 40, status: 'critical' },
    'the warrior one-use critical forces a hit to crit and adds 5000 to the base 15000 critical factor',
);
assert.equal(
    damage({ forcedCritical: true, target: attrs({ dodgeRate: 10000 }), rolls: { dodge: 0, critical: 10000 } }).status,
    'miss',
    'the original miss branch runs before a forced critical and therefore does not consume it',
);
let dodgeRandomCalls = 0;
resolveBattleDamageWithRandom({
    attack: 20,
    effectRatio: 10000,
    sourceType: 'WHEEL',
    source: attrs({ critRate: 10000 }),
    target: attrs({ dodgeRate: 10000 }),
    targetIsBoss: false,
}, () => {
    dodgeRandomCalls += 1;
    return 0;
});
assert.equal(dodgeRandomCalls, 1, 'a successful dodge skips the critical RNG read');
let forcedRandomCalls = 0;
const forcedLazy = resolveBattleDamageWithRandom({
    attack: 20,
    effectRatio: 10000,
    sourceType: 'HAMSTER',
    source: attrs(),
    target: attrs(),
    targetIsBoss: false,
    forcedCritical: true,
}, () => {
    forcedRandomCalls += 1;
    return 0.5;
});
assert.deepEqual(
    { calls: forcedRandomCalls, status: forcedLazy.status },
    { calls: 1, status: 'critical' },
    'a one-use forced critical consumes the dodge roll but short-circuits the critical roll',
);
let attributeRandomCalls = 0;
const attributeCritical = resolveBattleDamageWithRandom({
    attack: 49,
    effectRatio: 5000,
    sourceType: 'WHEEL',
    source: attrs({ critRate: 10000 }),
    target: attrs(),
    targetIsBoss: false,
}, () => {
    attributeRandomCalls += 1;
    return 0.5;
});
assert.deepEqual(
    { calls: attributeRandomCalls, status: attributeCritical.status, value: attributeCritical.value },
    { calls: 2, status: 'critical', value: 36 },
    'H12 CRI_RATE 10000 still consumes its critical roll after a non-dodge and applies the base 15000 critical factor',
);
assert.deepEqual(
    {
        status: damage({
            attack: 49,
            effectRatio: 5000,
            sourceType: 'WHEEL',
            source: attrs({ critRate: 10000, critDamage: 5000 }),
            rolls: { dodge: 10000, critical: 10000 },
        }).status,
        value: damage({
            attack: 49,
            effectRatio: 5000,
            sourceType: 'WHEEL',
            source: attrs({ critRate: 10000, critDamage: 5000 }),
            rolls: { dodge: 10000, critical: 10000 },
        }).value,
    },
    { status: 'critical', value: 49 },
    'H12 CRI_DMG 5000 raises the base 15000 critical factor to 20000 after the 5000 effect ratio',
);
assert.equal(
    damage({ target: attrs({ towerResistance: -5000 }) }).value,
    20,
    'HAMSTER damage ignores tower-only resistance',
);
assert.equal(
    damage({ attack: 49, effectRatio: 5000, sourceType: 'WHEEL', target: attrs({ towerResistance: -5000 }) }).value,
    36,
    'H12 WHEEL damage uses 50 percent ratio and tower resistance',
);
assert.equal(
    damage({ source: attrs({ bossIncrease: 2500 }), targetIsBoss: true }).value,
    25,
    'boss damage increase is added against BossUnit targets',
);
assert.equal(
    damage({ attack: 16, effectRatio: 5000, sourceType: null }).value,
    8,
    'M03 and Boss03 projectile behavior uses a 50 percent effect ratio',
);
assert.ok(Math.abs(attackIntervalSeconds(1, 1500) - 0.8695652173913043) < 1e-12, 'H02 attack speed');
assert.ok(Math.abs(attackIntervalSeconds(1, 5000) - 2 / 3) < 1e-12, 'Boss03 attack speed');
assert.equal(attackBehaviorDelaySeconds(0.3, 1500), 0.261, 'H02 behavior delay is ceil(300/1.15) ms');
assert.equal(attackBehaviorDelaySeconds(0.3, 5000), 0.2, 'Boss03 behavior delay is ceil(300/1.5) ms');
assert.equal(resolveAttackAtImpact(95, 100, true, true), 95, 'an in-flight projectile reads a living caster\'s current attack at impact');
assert.equal(resolveAttackAtImpact(95, 100, true, false), 100, 'a projectile falls back to its launch snapshot after the caster leaves StateMemory');
assert.equal(resolveAttackAtImpact(95, 100, false, true), 95, 'a non-projectile behavior uses the live caster attack');
assert.equal(defeatCompensation(0), 1, 'initial attempt has no compensation');
assert.equal(defeatCompensation(1), 0.95, 'first retry uses row 1');
assert.equal(defeatCompensation(2), 0.9025, 'second retry uses row 2');
assert.equal(defeatCompensation(99), 0.4633, 'retry compensation clamps at row 15');

const origin = { x: 0, y: 0 };
const lowerLeft = { id: 'lower-left', x: -30, y: -40 };
const upperRight = { id: 'upper-right', x: 30, y: 40 };
assert.equal(
    selectNearestBattlefieldTarget(origin, [lowerLeft, upperRight], 51),
    upperRight,
    'equal-distance ties follow the original reverse quadtree query order',
);
assert.equal(
    selectNearestBattlefieldTarget(origin, [{ x: 30, y: 40 }], 50),
    null,
    'search range is strict and excludes a target exactly on the radius',
);
assert.equal(
    selectNearestBattlefieldTarget(origin, [{ x: 1, y: 0, selectable: false }, { x: 2, y: 0 }], 10)?.x,
    2,
    'unselectable targets are absent from the collision tree',
);
assert.equal(selectNearestBattlefieldTarget(origin, [{ x: 501, y: 0 }], 9999), null, 'off-tree targets are not selectable');

const bounceTargets = [
    { uid: 1, x: 10, y: 0 },
    { uid: 2, x: 20, y: 0 },
    { uid: 3, x: 299, y: 0 },
    { uid: 4, x: 300, y: 0 },
];
assert.equal(
    selectBounceBattlefieldTarget(origin, bounceTargets, new Set([1]), 0, 2, 300)?.uid,
    2,
    'a bounce skips the shared hit map and selects the nearest unvisited enemy',
);
assert.equal(
    selectBounceBattlefieldTarget(origin, bounceTargets, new Set([1, 2, 3]), 0, 2, 300),
    null,
    'the bounce radius is strict, so an unvisited enemy exactly 300 pixels away is excluded',
);
assert.equal(
    selectBounceBattlefieldTarget(origin, bounceTargets, new Set(), 2, 2, 300),
    null,
    'MissileConfig times=2 stops after two follow-up bounces (three total hits)',
);

const diagonal = movementVectorToward(origin, { x: 3, y: 4 }, 6);
assert.ok(Math.abs(diagonal.x - 3.6) < 1e-12 && Math.abs(diagonal.y - 4.8) < 1e-12);
assert.equal(battlefieldDistance(origin, diagonal), 6, 'diagonal movement keeps the configured total speed');

const farHome = resolveTargetingIntent(origin, [], 400, 50, 6, { x: 300, y: 100 }, false);
assert.deepEqual({ x: farHome.moveX, y: farHome.moveY }, { x: 6, y: 0 }, 'far-away home movement stays horizontal');
const nearHome = resolveTargetingIntent({ x: 150, y: 100 }, [], 400, 50, 5, { x: 300, y: 0 }, false);
assert.ok(nearHome.moveX > 0 && nearHome.moveY < 0, 'within 200 pixels, units move diagonally toward the home point');
assert.equal(
    resolveTargetingIntent({ x: 250, y: 0 }, [], 400, 50, 5, { x: 300, y: 0 }, true).attackHome,
    false,
    'a home exactly at casting range is not attacked',
);
assert.equal(
    resolveTargetingIntent({ x: 251, y: 0 }, [], 400, 50, 5, { x: 300, y: 0 }, true).attackHome,
    true,
    'enemy units attack home only inside casting range',
);
assert.deepEqual(
    heroSeparationVector(origin, [origin, { x: 10, y: 0 }, { x: 100, y: 0 }]),
    { x: -2, y: 0 },
    'only heroes inside the original 60 by 60 neighborhood add a two-pixel separation vector',
);

console.log('battlefield kernel: 38 assertions passed');
