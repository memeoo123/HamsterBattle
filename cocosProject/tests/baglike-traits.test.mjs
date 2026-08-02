import assert from 'node:assert/strict';
import {
    bagLikeHomeHpPercent,
    chooseBagLikeGearUpgrade,
    completeWarriorComboAttack,
    drawWeightedTraits,
    IMPLEMENTED_TRAIT_POOL,
    isRecommendedTrait,
    resolveHomeHeal,
    traitEffectAmount,
    traitExpMultiplier,
    traitMonsterAttackMultiplier,
    traitPowerNearAttackMultiplier,
    traitPowerNearWorkerMultiplier,
    traitPrepareRewardWeightModifiers,
    traitRoundStartHomeHealBasisPoints,
    traitWarriorComboProfile,
    weightedSampleWithoutReplacement,
} from '../assets/scripts/BagLikeProgression.ts';

const emptyTimes = new Map();
const h02Choices = drawWeightedTraits(IMPLEMENTED_TRAIT_POOL, new Set(['H02']), emptyTimes, 3, 4, () => 0);
assert.deepEqual(
    h02Choices.map((trait) => trait.id),
    ['RG_ALL_abl01_eff01', 'RG_ALL_abl02_eff01', 'RG_ALL_abl03_eff01'],
    'weighted extraction uses table order at the zero boundary without replacement',
);
assert.equal(new Set(h02Choices.map((trait) => trait.id)).size, 3, 'one draw contains no duplicate traits');
assert.ok(h02Choices.some((trait) => trait.quality >= 4), 'a draw satisfies the original minimum quality of 4');

const h04Only = drawWeightedTraits(IMPLEMENTED_TRAIT_POOL, new Set(['H04']), emptyTimes, 16, 2, () => 0.5);
assert.ok(h04Only.some((trait) => trait.id === 'RG_H04_abl01_eff01'), 'used H04 unlocks its implemented exclusive trait');
assert.ok(!h04Only.some((trait) => trait.id.startsWith('RG_H02_')), 'unused H02-exclusive traits are filtered');

const capped = new Map([['RG_H04_abl01_eff01', 1]]);
const cappedChoices = drawWeightedTraits(IMPLEMENTED_TRAIT_POOL, new Set(['H04']), capped, 16, 2, () => 0.5);
assert.ok(!cappedChoices.some((trait) => trait.id === 'RG_H04_abl01_eff01'), 'traits at their times limit are filtered');

const low = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl01_eff01');
const high = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl03_eff01');
const initialDrawWithoutGuarantee = drawWeightedTraits([low, high], new Set(['H01']), emptyTimes, 1, undefined, () => 0);
assert.equal(initialDrawWithoutGuarantee[0].id, low.id, 'an initial level-up draw does not force a purple-quality trait');
const qualityGuaranteed = drawWeightedTraits([low, high], new Set(['H01']), emptyTimes, 1, 4, () => 0);
assert.equal(qualityGuaranteed[0].id, high.id, 'reroll minimum-quality fallback replaces an all-low-quality draw');

const sampled = weightedSampleWithoutReplacement([{ id: 'a', weight: 1 }, { id: 'b', weight: 3 }], 2, () => 0.99);
assert.deepEqual(sampled.map((entry) => entry.id), ['b', 'a'], 'weighted extraction removes each selected entry');
assert.equal(isRecommendedTrait(high, [low, high]), true, 'highest-quality choice is recommended');
const effects = new Map([['RG_ALL_abl01_eff01', 2], ['RG_H01_abl01_eff01', 1]]);
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, effects, 'attackIncrease', 'H01'), 2000, 'general and H01 attack effects stack');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, effects, 'attackIncrease', 'H02'), 1000, 'H01-exclusive attack does not affect H02');

const gearUpgrade = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl10_eff01');
assert.deepEqual(
    {
        quality: gearUpgrade.quality,
        weight: gearUpgrade.weight,
        maxTimes: gearUpgrade.maxTimes,
        excludedWaveRange: gearUpgrade.excludedWaveRange,
        effect: gearUpgrade.effect,
    },
    {
        quality: 3,
        weight: 10,
        maxTimes: 99,
        excludedWaveRange: [0, 10],
        effect: { kind: 'gearUpgrade', amount: 1 },
    },
    'gear-upgrade ability keeps the decoded quality, weight, times, inverted wave condition and effective type',
);
const earlyWavePool = drawWeightedTraits([gearUpgrade], new Set(), emptyTimes, 1, 0, () => 0, 10);
const lateWavePool = drawWeightedTraits([gearUpgrade], new Set(), emptyTimes, 1, 0, () => 0, 11);
assert.equal(earlyWavePool.length, 0, 'WAVE_TIMES 0..10 excludes the gear-upgrade card through wave 10');
assert.equal(lateWavePool[0].id, gearUpgrade.id, 'gear-upgrade card enters the pool at wave 11');

const upgradeItems = [
    { uid: 1, sid: 1, id: 'P01', location: 'grid', isPower: true },
    { uid: 5, sid: 5, id: 'H0202', location: 'grid', isPower: false },
    { uid: 2, sid: 2, id: 'H0104', location: 'grid', isPower: false },
    { uid: 3, sid: 3, id: 'H0101', location: 'candidate', isPower: false },
    { uid: 4, sid: 4, id: 'C01', location: 'grid', isPower: false },
];
const nextIds = new Map([['H0101', 'H0102'], ['C01', 'C02'], ['H0202', 'H0203']]);
const firstUpgrade = chooseBagLikeGearUpgrade(upgradeItems, (id) => nextIds.get(id) || null, () => 0);
const lastUpgrade = chooseBagLikeGearUpgrade(upgradeItems, (id) => nextIds.get(id) || null, () => 0.999999);
assert.deepEqual(
    { uid: firstUpgrade.item.uid, previousId: firstUpgrade.previousId, nextId: firstUpgrade.nextId },
    { uid: 4, previousId: 'C01', nextId: 'C02' },
    'random zero chooses the first placed non-power item that has nextId',
);
assert.deepEqual(
    { uid: lastUpgrade.item.uid, previousId: lastUpgrade.previousId, nextId: lastUpgrade.nextId },
    { uid: 5, previousId: 'H0202', nextId: 'H0203' },
    'random upper boundary chooses the last eligible placed gear',
);
assert.equal(upgradeItems[4].id, 'C01', 'pure selection does not mutate the production item before the Cocos caller applies it');
let emptyUpgradeRandomCalls = 0;
assert.equal(
    chooseBagLikeGearUpgrade(upgradeItems.filter((item) => item.uid <= 3), (id) => nextIds.get(id) || null, () => {
        emptyUpgradeRandomCalls += 1;
        return 0;
    }),
    null,
    'power, max-level, and candidate-only items produce the original no-op result',
);
assert.equal(emptyUpgradeRandomCalls, 0, 'an empty eligible set does not consume a random value');

const level2PrepareWeight = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl11_eff01');
assert.deepEqual(
    {
        quality: level2PrepareWeight.quality,
        weight: level2PrepareWeight.weight,
        maxTimes: level2PrepareWeight.maxTimes,
        excludedWaveRange: level2PrepareWeight.excludedWaveRange,
        effect: level2PrepareWeight.effect,
    },
    {
        quality: 3,
        weight: 10,
        maxTimes: 1,
        excludedWaveRange: [11, 15],
        effect: { kind: 'prepareRewardWeight', amount: 20000, rewardId: 3012 },
    },
    'prepare-weight ability keeps the shipped SPECIAL_WORD target instead of remapping stale 3012 to level-2 pool 3015',
);
assert.equal(drawWeightedTraits([level2PrepareWeight], new Set(), emptyTimes, 1, 0, () => 0, 10)[0].id, level2PrepareWeight.id, 'WAVE_TIMES 11..15 leaves the card eligible through wave 10');
assert.equal(drawWeightedTraits([level2PrepareWeight], new Set(), emptyTimes, 1, 0, () => 0, 11).length, 0, 'WAVE_TIMES 11..15 excludes the card at wave 11');
assert.equal(drawWeightedTraits([level2PrepareWeight], new Set(), emptyTimes, 1, 0, () => 0, 15).length, 0, 'WAVE_TIMES 11..15 still excludes the card at wave 15');
const level2WeightTaken = new Map([['RG_ALL_abl11_eff01', 1]]);
assert.equal(drawWeightedTraits([level2PrepareWeight], new Set(), level2WeightTaken, 1, 0, () => 0, 10).length, 0, 'the one-time prepare-weight card leaves the choice pool after selection');
assert.deepEqual(traitPrepareRewardWeightModifiers(IMPLEMENTED_TRAIT_POOL, emptyTimes), [], 'an unselected prepare-weight trait installs no temporary reward modifier');
assert.deepEqual(
    traitPrepareRewardWeightModifiers(IMPLEMENTED_TRAIT_POOL, level2WeightTaken),
    [{ rewardType: 'REWARD', rewardId: 3012, multiplier: 20000 }],
    'selection reproduces ADD_LEVEL2_GEAR as the exact temporary REWARD/3012 multiplier',
);

const expGain = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl07_eff01');
assert.deepEqual(
    {
        quality: expGain.quality,
        weight: expGain.weight,
        maxTimes: expGain.maxTimes,
        excludedWaveRange: expGain.excludedWaveRange,
        effect: expGain.effect,
    },
    {
        quality: 4,
        weight: 5,
        maxTimes: 1,
        excludedWaveRange: [11, 15],
        effect: { kind: 'expGain', amount: 5000 },
    },
    'EXP_GAIN ability keeps the decoded quality, weight, one-time cap, inverted wave condition and 5000 basis-point parameter',
);
assert.equal(drawWeightedTraits([expGain], new Set(), emptyTimes, 1, 0, () => 0, 10)[0].id, expGain.id, 'experience card remains eligible through wave 10');
assert.equal(drawWeightedTraits([expGain], new Set(), emptyTimes, 1, 0, () => 0, 11).length, 0, 'experience card is excluded when wave 11 begins');
const expGainTaken = new Map([['RG_ALL_abl07_eff01', 1]]);
assert.equal(drawWeightedTraits([expGain], new Set(), expGainTaken, 1, 0, () => 0, 10).length, 0, 'one selection removes the experience card from later choices');
assert.equal(traitExpMultiplier(IMPLEMENTED_TRAIT_POOL, emptyTimes), 1, 'without EXP_GAIN the original manager multiplier is one');
assert.equal(traitExpMultiplier(IMPLEMENTED_TRAIT_POOL, expGainTaken), 1.5, 'EXP_GAIN/5000 raises every later experience notification by 50%');

const enemyAttackDecrease = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl08_eff01');
assert.deepEqual(
    {
        quality: enemyAttackDecrease.quality,
        weight: enemyAttackDecrease.weight,
        maxTimes: enemyAttackDecrease.maxTimes,
        range: enemyAttackDecrease.range,
        effect: enemyAttackDecrease.effect,
    },
    {
        quality: 2,
        weight: 20,
        maxTimes: 10,
        range: null,
        effect: { kind: 'enemyAttackDecrease', amount: 500 },
    },
    'enemy attack weakening keeps the decoded MONSTER scope, quality, weight, ten-selection cap and ATK_DEC/500 parameter',
);
assert.equal(drawWeightedTraits([enemyAttackDecrease], new Set(), emptyTimes, 1, 0, () => 0, 15)[0].id, enemyAttackDecrease.id, 'enemy weakening has no hero or wave condition');
assert.equal(traitMonsterAttackMultiplier(IMPLEMENTED_TRAIT_POOL, emptyTimes), 1, 'without ATK_DEC all enemy classes keep their base attack');
assert.equal(
    traitMonsterAttackMultiplier(IMPLEMENTED_TRAIT_POOL, new Map([['RG_ALL_abl08_eff01', 1]])),
    0.95,
    'one selection reduces ordinary, elite and boss attack by five percent',
);
const enemyAttackDecreaseCapped = new Map([['RG_ALL_abl08_eff01', 10]]);
assert.equal(traitMonsterAttackMultiplier(IMPLEMENTED_TRAIT_POOL, enemyAttackDecreaseCapped), 0.5, 'ten selections stack to the configured fifty-percent reduction');
assert.equal(drawWeightedTraits([enemyAttackDecrease], new Set(), enemyAttackDecreaseCapped, 1, 0, () => 0).length, 0, 'the card leaves the choice pool at ten selections');
assert.equal(traitMonsterAttackMultiplier(IMPLEMENTED_TRAIT_POOL, new Map([['RG_ALL_abl08_eff01', 30]])), 0, 'the original attack formula clamps an over-reduced multiplier at zero');

const powerNearAttack = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl12_eff01');
assert.deepEqual(
    {
        quality: powerNearAttack.quality,
        weight: powerNearAttack.weight,
        maxTimes: powerNearAttack.maxTimes,
        range: powerNearAttack.range,
        effect: powerNearAttack.effect,
    },
    {
        quality: 4,
        weight: 5,
        maxTimes: 1,
        range: null,
        effect: { kind: 'powerNearAttack', amount: 2000 },
    },
    'power-neighbor attack ability keeps the decoded quality, weight, one-time cap and POWER_NEAR_ATK_UP/2000 parameter',
);
assert.equal(drawWeightedTraits([powerNearAttack], new Set(), emptyTimes, 1, 0, () => 0, 15)[0].id, powerNearAttack.id, 'power-neighbor attack has no hero or wave condition');
assert.equal(traitPowerNearAttackMultiplier(IMPLEMENTED_TRAIT_POOL, emptyTimes), 1, 'without POWER_NEAR_ATK_UP an adjacent producer keeps its level multiplier');
const powerNearAttackTaken = new Map([['RG_ALL_abl12_eff01', 1]]);
assert.equal(traitPowerNearAttackMultiplier(IMPLEMENTED_TRAIT_POOL, powerNearAttackTaken), 1.2, 'POWER_NEAR_ATK_UP/2000 becomes a twenty-percent attack multiplier');
assert.equal(drawWeightedTraits([powerNearAttack], new Set(), powerNearAttackTaken, 1, 0, () => 0).length, 0, 'the one-time card leaves the choice pool after selection');

const powerNearWorker = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl16_eff01');
assert.deepEqual(
    {
        quality: powerNearWorker.quality,
        weight: powerNearWorker.weight,
        maxTimes: powerNearWorker.maxTimes,
        range: powerNearWorker.range,
        effect: powerNearWorker.effect,
    },
    {
        quality: 4,
        weight: 5,
        maxTimes: 1,
        range: null,
        effect: { kind: 'powerNearWorker', amount: 2000 },
    },
    'power-neighbor worker ability keeps the decoded quality, weight, one-time cap and POWER_NEAR_WORKER_UP/2000 parameter',
);
assert.equal(drawWeightedTraits([powerNearWorker], new Set(), emptyTimes, 1, 0, () => 0, 15)[0].id, powerNearWorker.id, 'power-neighbor worker efficiency has no hero or wave condition');
assert.equal(traitPowerNearWorkerMultiplier(IMPLEMENTED_TRAIT_POOL, emptyTimes), 1, 'without POWER_NEAR_WORKER_UP an adjacent producer keeps its base worker progress');
const powerNearWorkerTaken = new Map([['RG_ALL_abl16_eff01', 1]]);
assert.equal(traitPowerNearWorkerMultiplier(IMPLEMENTED_TRAIT_POOL, powerNearWorkerTaken), 1.2, 'POWER_NEAR_WORKER_UP/2000 becomes a twenty-percent progress multiplier');
assert.equal(drawWeightedTraits([powerNearWorker], new Set(), powerNearWorkerTaken, 1, 0, () => 0).length, 0, 'the one-time worker card leaves the choice pool after selection');

const immediateHomeHeal = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl17_eff01');
assert.deepEqual(
    {
        quality: immediateHomeHeal.quality,
        weight: immediateHomeHeal.weight,
        maxTimes: immediateHomeHeal.maxTimes,
        range: immediateHomeHeal.range,
        homeHpPercentRange: immediateHomeHeal.homeHpPercentRange,
        noRestore: immediateHomeHeal.noRestore,
        effect: immediateHomeHeal.effect,
    },
    {
        quality: 4,
        weight: 999,
        maxTimes: 99,
        range: null,
        homeHpPercentRange: [0, 50],
        noRestore: true,
        effect: { kind: 'immediateHomeHeal', amount: 5000 },
    },
    'immediate home heal keeps the decoded table values, inclusive BASE_HP condition, noRestore flag and HEAL_HOME/IMMED/5000 effect',
);
assert.equal(drawWeightedTraits([immediateHomeHeal], new Set(), emptyTimes, 1, 0, () => 0, 15, 0)[0].id, immediateHomeHeal.id, 'immediate home heal is eligible at zero-percent base HP');
assert.equal(drawWeightedTraits([immediateHomeHeal], new Set(), emptyTimes, 1, 0, () => 0, 15, 50)[0].id, immediateHomeHeal.id, 'the BASE_HP upper boundary is inclusive at fifty percent');
assert.equal(drawWeightedTraits([immediateHomeHeal], new Set(), emptyTimes, 1, 0, () => 0, 15, 50.01).length, 0, 'immediate home heal is excluded above fifty percent');
assert.equal(drawWeightedTraits([immediateHomeHeal], new Set(), new Map([['RG_ALL_abl17_eff01', 99]]), 1, 0, () => 0, 15, 40)[0].id, immediateHomeHeal.id, 'noRestore prevents the immediate consumable from being capped by persistent times');
assert.equal(bagLikeHomeHpPercent(250, 500), 50, 'stored home HP basis points become the condition percentage');
assert.equal(resolveHomeHeal(200, 500, 5000), 450, 'HEAL_HOME/5000 restores half of maximum base HP immediately');
assert.equal(resolveHomeHeal(300, 500, 5000), 500, 'base healing clamps at maximum HP');
assert.equal(resolveHomeHeal(100, 501, 5000), 350, 'the heal amount floors a fractional half-max value before adding it');

const roundStartHomeHeal = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl18_eff01');
assert.deepEqual(
    {
        quality: roundStartHomeHeal.quality,
        weight: roundStartHomeHeal.weight,
        maxTimes: roundStartHomeHeal.maxTimes,
        range: roundStartHomeHeal.range,
        homeHpPercentRange: roundStartHomeHeal.homeHpPercentRange,
        noRestore: roundStartHomeHeal.noRestore,
        effect: roundStartHomeHeal.effect,
    },
    {
        quality: 4,
        weight: 999,
        maxTimes: 1,
        range: null,
        homeHpPercentRange: [0, 75],
        noRestore: undefined,
        effect: { kind: 'roundStartHomeHeal', amount: 1000 },
    },
    'round-start home heal keeps the decoded values, persistent flag and HEAL_HOME/ROUND/1000 parameter',
);
assert.equal(drawWeightedTraits([roundStartHomeHeal], new Set(), emptyTimes, 1, 0, () => 0, 15, 0)[0].id, roundStartHomeHeal.id, 'round-start home heal is eligible at zero-percent base HP');
assert.equal(drawWeightedTraits([roundStartHomeHeal], new Set(), emptyTimes, 1, 0, () => 0, 15, 75)[0].id, roundStartHomeHeal.id, 'the persistent heal BASE_HP upper boundary is inclusive at seventy-five percent');
assert.equal(drawWeightedTraits([roundStartHomeHeal], new Set(), emptyTimes, 1, 0, () => 0, 15, 75.01).length, 0, 'round-start home heal is excluded above seventy-five percent');
const roundStartHomeHealTaken = new Map([['RG_ALL_abl18_eff01', 1]]);
assert.equal(drawWeightedTraits([roundStartHomeHeal], new Set(), roundStartHomeHealTaken, 1, 0, () => 0, 15, 40).length, 0, 'the persistent round-start heal leaves the pool after one selection');
assert.equal(traitRoundStartHomeHealBasisPoints(IMPLEMENTED_TRAIT_POOL, emptyTimes), 0, 'without the persistent card, round start does not heal the base');
assert.equal(traitRoundStartHomeHealBasisPoints(IMPLEMENTED_TRAIT_POOL, roundStartHomeHealTaken), 1000, 'the selected card exposes its ten-percent round-start heal');
assert.equal(resolveHomeHeal(200, 500, 1000), 250, 'BAGLIKE_BATTLE_ROUND_START heals ten percent of maximum base HP');
assert.equal(resolveHomeHeal(480, 500, 1000), 500, 'the recurring round-start heal clamps at maximum base HP');

const warriorComboVariants = IMPLEMENTED_TRAIT_POOL.filter((trait) => trait.group === 'RG_H01_abl02');
assert.deepEqual(
    warriorComboVariants.map((trait) => ({
        id: trait.id,
        star: trait.minHeroStar.star,
        quality: trait.quality,
        weight: trait.weight,
        maxTimes: trait.maxTimes,
        effect: trait.effect,
    })),
    [
        { id: 'RG_H01_abl02_eff01', star: 3, quality: 4, weight: 50, maxTimes: 1, effect: { kind: 'warriorComboCritical', amount: 0, attacksRequired: 3 } },
        { id: 'RG_H01_abl02_eff02', star: 5, quality: 4, weight: 50, maxTimes: 1, effect: { kind: 'warriorComboCritical', amount: 5000, attacksRequired: 3 } },
        { id: 'RG_H01_abl02_eff03', star: 8, quality: 4, weight: 50, maxTimes: 1, effect: { kind: 'warriorComboCritical', amount: 5000, attacksRequired: 2 } },
        { id: 'RG_H01_abl02_eff04', star: 10, quality: 4, weight: 50, maxTimes: 1, effect: { kind: 'warriorComboCritical', amount: 5000, attacksRequired: 2, healMaxHpBasisPoints: 20000 } },
    ],
    'warrior combo variants keep the four decoded star gates, shared draw values and passive-skill parameters',
);
const drawWarriorCombo = (star, times = emptyTimes) => drawWeightedTraits(
    warriorComboVariants,
    new Set(['H01']),
    times,
    4,
    0,
    () => 0,
    1,
    100,
    new Map([['H01', star]]),
);
assert.equal(drawWarriorCombo(2).length, 0, 'H01 below star 3 cannot draw the warrior combo group');
assert.equal(drawWarriorCombo(3)[0].id, 'RG_H01_abl02_eff01', 'star 3 selects the first warrior combo version');
assert.equal(drawWarriorCombo(5)[0].id, 'RG_H01_abl02_eff02', 'star 5 replaces the lower group row with version 2');
assert.equal(drawWarriorCombo(8)[0].id, 'RG_H01_abl02_eff03', 'star 8 selects the two-completion version');
assert.equal(drawWarriorCombo(10)[0].id, 'RG_H01_abl02_eff04', 'star 10 selects the healing version');
assert.equal(drawWarriorCombo(10).length, 1, 'only the highest verified row in a shared group enters one weighted pool');
const warriorComboTaken = new Map([['RG_H01_abl02_eff01', 1]]);
assert.equal(drawWarriorCombo(3, warriorComboTaken).length, 0, 'the selected star-specific row leaves the pool at its one-time cap');
const warriorComboProfile = traitWarriorComboProfile(IMPLEMENTED_TRAIT_POOL, warriorComboTaken, 'H01');
assert.deepEqual(
    warriorComboProfile,
    { traitId: 'RG_H01_abl02_eff01', attacksRequired: 3, bonusCritDamage: 0, healMaxHpBasisPoints: 0 },
    'a selected ADD_PASSIVITY_SKILL row becomes the exact per-unit combo profile',
);
const comboAfterOne = completeWarriorComboAttack({ completedAttacks: 0, criticalReady: false }, warriorComboProfile, false);
const comboAfterTwo = completeWarriorComboAttack(comboAfterOne, warriorComboProfile, false);
const comboAfterThree = completeWarriorComboAttack(comboAfterTwo, warriorComboProfile, false);
assert.deepEqual(comboAfterOne, { completedAttacks: 1, criticalReady: false, triggered: false }, 'the first completed basic attack advances the passive counter');
assert.deepEqual(comboAfterTwo, { completedAttacks: 2, criticalReady: false, triggered: false }, 'the second completed basic attack does not trigger the three-count version');
assert.deepEqual(comboAfterThree, { completedAttacks: 0, criticalReady: true, triggered: true }, 'the third completed basic attack arms the next one-use critical');
assert.deepEqual(completeWarriorComboAttack(comboAfterThree, warriorComboProfile, true), { completedAttacks: 0, criticalReady: false, triggered: false }, 'the forced-critical attack consumes the buff without counting toward the next cycle');
const healingComboProfile = traitWarriorComboProfile(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H01_abl02_eff04', 1]]), 'H01');
assert.equal(resolveHomeHeal(10, 70, healingComboProfile.healMaxHpBasisPoints), 70, 'the star-10 hpRate 20000 trigger heals a damaged warrior to its max-HP clamp');

console.log('baglike traits: 82 assertions passed');
