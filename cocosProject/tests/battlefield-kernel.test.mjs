import assert from 'node:assert/strict';
import {
    BATTLE_DEFAULT_SEED,
    BATTLE_SEED_ADDEND,
    BATTLE_SEED_MODULUS,
    BATTLE_SEED_MULTIPLIER,
    createBattleSeedRandom,
    advanceH02BarrageCast,
    advanceH03LaserCast,
    advanceH03Transform,
    advanceH04ShieldWall,
    applyH03TransformHit,
    attackBehaviorDelaySeconds,
    attackKillFlyRollSucceeds,
    attackIntervalSeconds,
    battlefieldDistance,
    defeatCompensation,
    EMPTY_COMBAT_ATTRIBUTES,
    heroSeparationVector,
    h02BarrageEffectiveShotDelays,
    H04_SHIELD_WALL_DAMAGE_RESISTANCE,
    H04_SHIELD_WALL_INTERVAL_SECONDS,
    h04ShieldWallCounterattackDamage,
    isPointInForwardRectangle,
    movementVectorToward,
    nextBattleSeed,
    ORIGINAL_BATTLE_FRAME_STAGES,
    ORIGINAL_SCHEDULED_MONSTER_RNG_ORDER,
    resolveTargetingIntent,
    resolveBattleDamage,
    resolveBattleDamageWithRandom,
    resolveAttackAtImpact,
    resolveBounceAttack,
    resolveBounceMaxTimes,
    H13_BASE_SKILL_ID,
    replaceH13Skill,
    resolveH13BounceProfileForSkill,
    runtimeSelectsConfiguredLastBounceMissile,
    selectBounceBattlefieldTarget,
    selectH03LaserTargets,
    selectNearestBattlefieldTarget,
    selectSplitShotTarget,
    splitShotRollSucceeds,
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
assert.equal(splitShotRollSucceeds(3000, () => 3000 / 10001), true, 'H02 split shot includes the recovered 3000 roll boundary');
assert.equal(splitShotRollSucceeds(3000, () => 3001 / 10001), false, 'H02 split shot rejects the first roll above 3000');
assert.equal(splitShotRollSucceeds(10000, () => 0.999999), true, 'the star-10 split-shot row always succeeds');
assert.equal(attackKillFlyRollSucceeds(3000, true, true, () => 3000 / 10001), true, 'H04 kill-fly includes the recovered 3000 roll boundary');
assert.equal(attackKillFlyRollSucceeds(3000, true, true, () => 3001 / 10001), false, 'H04 kill-fly rejects the first roll above 3000');
assert.equal(attackKillFlyRollSucceeds(10000, true, true, () => 0.999999), true, 'a 10000 kill-fly feature always succeeds against an eligible monster');
let killFlyGateCalls = 0;
const gatedKillFlyRandom = () => {
    killFlyGateCalls += 1;
    return 0;
};
assert.deepEqual(
    { result: attackKillFlyRollSucceeds(3000, false, true, gatedKillFlyRandom), calls: killFlyGateCalls },
    { result: false, calls: 0 },
    'BossUnit canKillFly=false blocks the feature without consuming its RNG roll',
);
assert.deepEqual(
    { result: attackKillFlyRollSucceeds(3000, true, false, gatedKillFlyRandom), calls: killFlyGateCalls },
    { result: false, calls: 0 },
    'ACTIVE_SKILL hits do not consume the ATTACK_KILL_FLY roll',
);
assert.deepEqual(
    { result: attackKillFlyRollSucceeds(0, true, true, gatedKillFlyRandom), calls: killFlyGateCalls },
    { result: false, calls: 0 },
    'an unselected kill-fly feature does not consume RNG',
);
assert.equal(resolveAttackAtImpact(95, 100, true, true), 95, 'an in-flight projectile reads a living caster\'s current attack at impact');
assert.equal(resolveAttackAtImpact(95, 100, true, false), 100, 'a projectile falls back to its launch snapshot after the caster leaves StateMemory');
assert.equal(resolveAttackAtImpact(95, 100, false, true), 95, 'a non-projectile behavior uses the live caster attack');
assert.equal(defeatCompensation(0), 1, 'initial attempt has no compensation');
assert.equal(defeatCompensation(1), 0.95, 'first retry uses row 1');
assert.equal(defeatCompensation(2), 0.9025, 'second retry uses row 2');
assert.equal(defeatCompensation(99), 0.4633, 'retry compensation clamps at row 15');

const origin = { x: 0, y: 0 };
const splitMainTarget = { uid: 1, x: 100, y: 0 };
const splitOtherTarget = { uid: 2, x: 200, y: 0 };
assert.equal(
    selectSplitShotTarget(origin, [splitMainTarget], () => 0)?.uid,
    1,
    'SkillTargetType.Random keeps the current main target eligible for the extra missile',
);
assert.equal(
    selectSplitShotTarget(origin, [splitMainTarget, splitOtherTarget], () => 0.999999)?.uid,
    2,
    'the caster-centered split-shot circle chooses uniformly from all eligible enemies',
);
assert.equal(
    selectSplitShotTarget(origin, [splitMainTarget, { uid: 3, x: 251, y: 0 }], () => 0.999999)?.uid,
    1,
    'the recovered 250-radius split-shot behavior excludes enemies outside the caster circle',
);
assert.equal(
    selectSplitShotTarget(origin, [{ uid: 4, x: 250, y: 0 }], () => 0)?.uid,
    4,
    'the point abstraction includes an enemy on the configured split-shot circle boundary',
);
let singleSplitTargetRandomCalls = 0;
selectSplitShotTarget(origin, [splitMainTarget], () => {
    singleSplitTargetRandomCalls += 1;
    return 0;
});
assert.equal(singleSplitTargetRandomCalls, 0, 'a single eligible split-shot target needs no selection RNG read');
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
assert.equal(resolveBounceMaxTimes(2, 0), 2, 'the H13/H09 base missile keeps two follow-up bounces');
assert.equal(resolveBounceMaxTimes(2, 2), 4, 'the star-2 H13 feature adds two bounces for four follow-ups total');
assert.equal(resolveBounceMaxTimes(2, 4), 6, 'the star-3 H13 feature adds four bounces for six follow-ups total');
assert.deepEqual(
    resolveH13BounceProfileForSkill(H13_BASE_SKILL_ID),
    { skillId: 'TZ_1301', attackIncreasePerBounce: 0, lastMissileConfigured: false },
    'the base corn skill has no per-bounce attack increase',
);
assert.equal(replaceH13Skill('TZ_1301', 'RG_H13_abl02_eff01'), 'TZ_1302', 'the star-7 trait replaces corn with popcorn');
assert.equal(replaceH13Skill('TZ_1302', 'RG_H13_abl02_eff02'), 'TZ_1303', 'the star-10 trait replaces the shared skill group with TZ_1303');
assert.deepEqual(
    resolveH13BounceProfileForSkill('TZ_1302'),
    { skillId: 'TZ_1302', attackIncreasePerBounce: 1000, lastMissileConfigured: false },
    'TZ_1302 compounds attack by ten percent per follow-up bounce',
);
assert.deepEqual(
    resolveH13BounceProfileForSkill('TZ_1303'),
    { skillId: 'TZ_1303', attackIncreasePerBounce: 1000, lastMissileConfigured: true },
    'TZ_1303 carries the same growth plus a configured last-missile branch',
);
assert.equal(resolveBounceAttack(66, 0, 1000), 66, 'the initial popcorn hit keeps base attack');
assert.ok(Math.abs(resolveBounceAttack(66, 1, 1000) - 72.6) < 1e-12, 'the first follow-up uses 110 percent attack');
assert.ok(Math.abs(resolveBounceAttack(66, 2, 1000) - 79.86) < 1e-12, 'the second follow-up compounds to 121 percent attack');
assert.equal(runtimeSelectsConfiguredLastBounceMissile(2), false, 'the reset-before-copy bug misses the base final bounce');
assert.equal(runtimeSelectsConfiguredLastBounceMissile(4), false, 'the bug also misses the star-2 extended final bounce');
assert.equal(runtimeSelectsConfiguredLastBounceMissile(6), false, 'the bug also misses the star-3 extended final bounce');
assert.equal(runtimeSelectsConfiguredLastBounceMissile(1), true, 'the branch would only activate for an unused one-bounce configuration');

const disablingTransform = { durationSeconds: 2, disablesTarget: true, outgoingDamageIncrease: 0 };
const damageTransform = { durationSeconds: 2, disablesTarget: false, outgoingDamageIncrease: 3000 };
assert.deepEqual(
    applyH03TransformHit({ remaining: 0, frozen: 0, outgoingDamageIncrease: 0 }, disablingTransform, false),
    { remaining: 2, frozen: 2, outgoingDamageIncrease: 0 },
    'star-7 H03 transform applies the two-second changed-model and dizziness state',
);
assert.deepEqual(
    applyH03TransformHit({ remaining: 0, frozen: 0, outgoingDamageIncrease: 0 }, disablingTransform, true),
    { remaining: 2, frozen: 0, outgoingDamageIncrease: 0 },
    'control immunity rejects dizziness but does not remove the changed-model buff lifetime',
);
assert.deepEqual(
    applyH03TransformHit({ remaining: 0, frozen: 0, outgoingDamageIncrease: 0 }, damageTransform, false),
    { remaining: 2, frozen: 0, outgoingDamageIncrease: 3000 },
    'star-8 replacement carries DMG_INC without the lower variant abnormal component',
);
assert.deepEqual(
    applyH03TransformHit({ remaining: 1, frozen: 3, outgoingDamageIncrease: 0 }, disablingTransform, false),
    { remaining: 2, frozen: 3, outgoingDamageIncrease: 0 },
    'a repeated transform refreshes shorter state without shortening a longer dizziness',
);
assert.deepEqual(advanceH03Transform({ remaining: 2, outgoingDamageIncrease: 3000 }, 0.5), { remaining: 1.5, outgoingDamageIncrease: 3000 }, 'transform damage increase remains active before expiry');
assert.deepEqual(advanceH03Transform({ remaining: 1.5, outgoingDamageIncrease: 3000 }, 1.5), { remaining: 0, outgoingDamageIncrease: 0 }, 'transform damage increase clears exactly at two seconds');
assert.deepEqual(advanceH03Transform({ remaining: 1, outgoingDamageIncrease: 3000 }, -1), { remaining: 1, outgoingDamageIncrease: 3000 }, 'negative elapsed input cannot extend or expire transform');
assert.equal(damage({ source: attrs({ damageIncrease: 3000 }) }).value, 26, 'the transformed target deals thirty percent more damage while its buff is active');
assert.equal(damage({ target: attrs({ damageIncrease: 3000 }) }).value, 20, 'DMG_INC on the target is not incoming vulnerability in the recovered formula');

const lowerBarrageDelays = [0.2, 0.4, 0.6, 0.6, 0.8, 1, 1.2, 1.4, 1.6];
const upgradedBarrageDelays = [0.5, 1, 1.5, 2, 2.5, 3, 3.5];
assert.deepEqual(h02BarrageEffectiveShotDelays(lowerBarrageDelays, 2), lowerBarrageDelays, '2001_5 launches all nine configured behaviors before its two-second cast ends');
assert.deepEqual(h02BarrageEffectiveShotDelays(upgradedBarrageDelays, 3), [0.5, 1, 1.5, 2, 2.5, 3], '2001_6 removes its configured 3.5-second behavior when the three-second cast completes');
assert.deepEqual(advanceH02BarrageCast(0, 0.19, lowerBarrageDelays, 2), { elapsed: 0.19, complete: false, shotIndices: [] }, 'the lower barrage emits nothing before 200 ms');
assert.deepEqual(advanceH02BarrageCast(0.19, 0.01, lowerBarrageDelays, 2), { elapsed: 0.2, complete: false, shotIndices: [0] }, 'the first lower-barrage missile launches exactly at 200 ms');
assert.deepEqual(advanceH02BarrageCast(0.2, 0.45, lowerBarrageDelays, 2), { elapsed: 0.65, complete: false, shotIndices: [1, 2, 3] }, 'a coarse step preserves both duplicate 600-ms missile behaviors');
assert.deepEqual(advanceH02BarrageCast(0, 5, lowerBarrageDelays, 2), { elapsed: 2, complete: true, shotIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8] }, 'a large frame emits every effective lower-barrage shot before completing');
assert.deepEqual(advanceH02BarrageCast(2.75, 0.25, upgradedBarrageDelays, 3), { elapsed: 3, complete: true, shotIndices: [5] }, 'the upgraded barrage keeps its behavior exactly on the cast-completion boundary');
assert.deepEqual(advanceH02BarrageCast(3, 1, upgradedBarrageDelays, 3), { elapsed: 3, complete: true, shotIndices: [] }, 'the orphaned 3.5-second behavior cannot fire after skill completion');
assert.deepEqual(advanceH02BarrageCast(1, -1, lowerBarrageDelays, 2), { elapsed: 1, complete: false, shotIndices: [] }, 'negative elapsed input cannot rewind or duplicate barrage shots');

assert.deepEqual(advanceH03LaserCast(0, 0.299, 0.3, 1), { elapsed: 0.299, complete: false, behaviorTriggered: false }, '3001_5 does not resolve before its 300-ms behavior delay');
assert.deepEqual(advanceH03LaserCast(0.299, 0.001, 0.3, 1), { elapsed: 0.3, complete: false, behaviorTriggered: true }, '3001_5 resolves exactly at 300 ms and starts cooldown there');
assert.deepEqual(advanceH03LaserCast(0.3, 0.5, 0.3, 1), { elapsed: 0.8, complete: false, behaviorTriggered: false }, 'the laser behavior does not repeat later in the same cast');
assert.deepEqual(advanceH03LaserCast(0.8, 0.2, 0.3, 1), { elapsed: 1, complete: true, behaviorTriggered: false }, 'the laser cast completes at one second');
assert.deepEqual(advanceH03LaserCast(0, 1, 1.1, 1), { elapsed: 1, complete: true, behaviorTriggered: false }, 'cast completion removes a behavior configured beyond its cast boundary');
const laserOrigin = { x: 0, y: 0 };
const laserAim = { x: 10, y: 0 };
assert.equal(isPointInForwardRectangle(laserOrigin, laserAim, { x: 150, y: 0 }, 100, 300), true, 'the penetrating laser includes a center-line target in front of its caster');
assert.equal(isPointInForwardRectangle(laserOrigin, laserAim, { x: -0.001, y: 0 }, 100, 300), false, 'the penetrating laser excludes a target behind its caster');
assert.equal(isPointInForwardRectangle(laserOrigin, laserAim, { x: 100, y: 50 }, 100, 300), true, 'the rectangle includes its width boundary like isPointinPolygon');
assert.equal(isPointInForwardRectangle(laserOrigin, laserAim, { x: 100, y: 50.001 }, 100, 300), false, 'the rectangle excludes a target just outside its width');
assert.equal(isPointInForwardRectangle(laserOrigin, laserAim, { x: 300, y: 0 }, 100, 300), true, 'the rectangle includes its 300-unit front edge');
assert.equal(isPointInForwardRectangle(laserOrigin, laserAim, { x: 300.001, y: 0 }, 100, 300), false, 'the rectangle excludes targets beyond the configured height');
assert.deepEqual(
    selectH03LaserTargets(laserOrigin, laserAim, [
        { uid: 1, x: 20, y: 0 },
        { uid: 2, x: 60, y: 20, selectable: false },
        { uid: 3, x: 100, y: -25 },
        { uid: 4, x: 200, y: 0 },
    ], 100, 300, 2).map((target) => target.uid),
    [1, 3],
    'the direct behavior skips unselectable units and honors its configured target cap without retarget sorting',
);

const shieldWallInitial = { cooldown: H04_SHIELD_WALL_INTERVAL_SECONDS, remaining: 0 };
const shieldWallBefore = advanceH04ShieldWall(shieldWallInitial, 4.999);
assert.equal(shieldWallBefore.remaining, 0, 'H04 shield wall is inactive before its first five-second interval');
assert.ok(Math.abs(shieldWallBefore.cooldown - 0.001) < 1e-9, 'the pre-trigger interval retains its fractional remainder');
assert.deepEqual(
    advanceH04ShieldWall(shieldWallInitial, 5),
    { cooldown: 5, remaining: 2 },
    'the passive activates a two-second shield wall at the five-second boundary',
);
assert.deepEqual(
    advanceH04ShieldWall(shieldWallInitial, 7),
    { cooldown: 3, remaining: 0 },
    'the shield wall expires after two seconds while its five-second cycle continues',
);
assert.deepEqual(
    advanceH04ShieldWall(shieldWallInitial, 10),
    { cooldown: 5, remaining: 2 },
    'a large elapsed step preserves the second periodic activation',
);
const shieldWallDamage = damage({ target: attrs({ damageResistance: H04_SHIELD_WALL_DAMAGE_RESISTANCE }) });
assert.equal(shieldWallDamage.value, 14, 'active shield wall reduces incoming damage by 30 percent');
assert.equal(shieldWallDamage.rawValue, 14, 'counterattack uses the resistance-adjusted value before flooring and shields');
assert.equal(h04ShieldWallCounterattackDamage(shieldWallDamage.rawValue, 3000, true), 4, 'star-10 shield wall reflects 30 percent after resistance');
assert.equal(h04ShieldWallCounterattackDamage(shieldWallDamage.rawValue, 0, true), 0, 'star-7 shield wall has no counterattack component');
assert.equal(h04ShieldWallCounterattackDamage(shieldWallDamage.rawValue, 3000, false), 0, 'an expired shield wall cannot counterattack');
assert.equal(h04ShieldWallCounterattackDamage(3.2, 3000, true), 0, 'counterattack floors to zero without a minimum-damage promotion');
assert.equal(h04ShieldWallCounterattackDamage(100, 3000, true), 30, 'counterattack damage is an exact basis-point calculation');

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

assert.deepEqual(
    [BATTLE_DEFAULT_SEED, BATTLE_SEED_MULTIPLIER, BATTLE_SEED_ADDEND, BATTLE_SEED_MODULUS],
    [5, 9301, 49297, 233280],
    'the deobfuscated BattleManager LCG constants include every enabled modulus fragment',
);
const expectedSeeds = [95802, 207379, 122336, 189873, 128470];
const actualSeeds = [];
for (let seed = BATTLE_DEFAULT_SEED, index = 0; index < expectedSeeds.length; index += 1) {
    seed = nextBattleSeed(seed);
    actualSeeds.push(seed);
}
assert.deepEqual(actualSeeds, expectedSeeds, 'the recovered seeded combat stream is deterministic');
const seededRandom = createBattleSeedRandom();
assert.ok(Math.abs(seededRandom() - expectedSeeds[0] / BATTLE_SEED_MODULUS) < 1e-12, 'the random adapter exposes the normalized LCG value');
assert.deepEqual(
    ORIGINAL_BATTLE_FRAME_STAGES.slice(0, 3),
    ['scheduleMonsters', 'updateTeams', 'snapshotCollisions'],
    'due monsters are created before the same-frame team and collision snapshots',
);
assert.ok(
    ORIGINAL_BATTLE_FRAME_STAGES.indexOf('updateMonstersReverse')
        < ORIGINAL_BATTLE_FRAME_STAGES.indexOf('updateBulletsReverse'),
    'monster actions can create bullets before the same-frame reverse bullet pass',
);
assert.ok(
    ORIGINAL_BATTLE_FRAME_STAGES.indexOf('disposeQueuedUnits')
        < ORIGINAL_BATTLE_FRAME_STAGES.indexOf('updateBulletsReverse'),
    'queued unit disposal happens before bullet updates',
);
assert.deepEqual(
    ORIGINAL_SCHEDULED_MONSTER_RNG_ORDER,
    ['nativeSpawnY', 'nativePositionXJitter', 'nativePositionYJitter', 'seededRandomMoveTimer'],
    'monster creation preserves native-position draws before the independent combat-seed draw',
);

console.log('battlefield kernel: 116 assertions passed');
