import assert from 'node:assert/strict';
import {
    bagLikeHomeHpPercent,
    chooseBagLikeGearUpgrade,
    completeWarriorComboAttack,
    completeWarriorKillAttackStack,
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
    traitH02BarrageProfile,
    traitH03LaserProfile,
    traitH03TransformProfile,
    traitH04ShieldWallProfile,
    traitWarriorComboProfile,
    traitWarriorKillAttackProfile,
    warriorKillAttackMultiplier,
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

const h02SplitShotVariants = IMPLEMENTED_TRAIT_POOL.filter((trait) => trait.group === 'RG_H02_abl02');
assert.equal(h02SplitShotVariants.length, 3, 'all three decoded H02 split-shot star variants are modeled');
assert.deepEqual(
    h02SplitShotVariants.map((trait) => ({
        id: trait.id,
        star: trait.minHeroStar.star,
        quality: trait.quality,
        weight: trait.weight,
        maxTimes: trait.maxTimes,
        range: trait.range,
        effect: trait.effect,
    })),
    [
        { id: 'RG_H02_abl02_eff01', star: 3, quality: 3, weight: 100, maxTimes: 1, range: ['H02', 'H07'], effect: { kind: 'splitShot', amount: 3000 } },
        { id: 'RG_H02_abl02_eff02', star: 5, quality: 3, weight: 100, maxTimes: 1, range: ['H02', 'H07'], effect: { kind: 'splitShot', amount: 5000 } },
        { id: 'RG_H02_abl02_eff03', star: 10, quality: 3, weight: 100, maxTimes: 1, range: ['H02', 'H07'], effect: { kind: 'splitShot', amount: 10000 } },
    ],
    'H02 split-shot variants preserve the ADD_PASSIVITY_SKILL probabilities and H02/H07 scope',
);
const drawH02SplitShot = (star, times = emptyTimes) => drawWeightedTraits(
    h02SplitShotVariants,
    new Set(['H02']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H02', star]]),
);
assert.equal(drawH02SplitShot(2).length, 0, 'H02 below star 3 cannot draw split shot');
assert.equal(drawH02SplitShot(3)[0].id, 'RG_H02_abl02_eff01', 'H02 star 3 unlocks the 30-percent split shot');
assert.equal(drawH02SplitShot(5)[0].id, 'RG_H02_abl02_eff02', 'H02 star 5 replaces the lower row with 50 percent');
assert.equal(drawH02SplitShot(10)[0].id, 'RG_H02_abl02_eff03', 'H02 star 10 replaces the group with the guaranteed split shot');
assert.equal(drawH02SplitShot(10).length, 1, 'only the highest qualified H02 split-shot row enters one draw');
const h02SplitShotTaken = new Map([['RG_H02_abl02_eff03', 1]]);
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h02SplitShotTaken, 'splitShot', 'H02'), 10000, 'the selected star-10 row guarantees H02 split shot');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h02SplitShotTaken, 'splitShot', 'H07'), 10000, 'the decoded H07 companion scope receives the same passive');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h02SplitShotTaken, 'splitShot', 'H01'), 0, 'split shot does not leak to unrelated heroes');
assert.equal(drawH02SplitShot(10, h02SplitShotTaken).length, 0, 'the selected H02 split-shot group leaves the pool at its one-time cap');

const h02BarrageVariants = IMPLEMENTED_TRAIT_POOL.filter((trait) => trait.group === 'RG_H02_abl03');
assert.equal(h02BarrageVariants.length, 2, 'both decoded H02 barrage-time variants are modeled');
assert.deepEqual(
    h02BarrageVariants.map((trait) => ({
        id: trait.id,
        star: trait.minHeroStar.star,
        quality: trait.quality,
        weight: trait.weight,
        maxTimes: trait.maxTimes,
        range: trait.range,
        effect: trait.effect,
    })),
    [
        { id: 'RG_H02_abl03_eff01', star: 7, quality: 4, weight: 50, maxTimes: 1, range: ['H02', 'H07'], effect: { kind: 'barrage', amount: 5000 } },
        { id: 'RG_H02_abl03_eff02', star: 8, quality: 4, weight: 50, maxTimes: 1, range: ['H02', 'H07'], effect: { kind: 'barrage', amount: 5000 } },
    ],
    'H02 barrage rows preserve their quality, weight, family scope and 50-percent missile ratio',
);
const drawH02Barrage = (star, times = emptyTimes) => drawWeightedTraits(
    h02BarrageVariants,
    new Set(['H02']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H02', star]]),
);
assert.equal(drawH02Barrage(6).length, 0, 'H02 below star 7 cannot draw barrage time');
assert.equal(drawH02Barrage(7)[0].id, 'RG_H02_abl03_eff01', 'H02 star 7 unlocks 2001_5');
assert.equal(drawH02Barrage(7).length, 1, 'star 7 exposes exactly one barrage row');
assert.equal(drawH02Barrage(8)[0].id, 'RG_H02_abl03_eff02', 'H02 star 8 replaces the lower barrage row with 2001_6');
assert.equal(drawH02Barrage(8).length, 1, 'only the highest qualified barrage row enters one draw');
const h02BarrageTaken = new Map([['RG_H02_abl03_eff02', 1]]);
assert.equal(drawH02Barrage(8, h02BarrageTaken).length, 0, 'the selected barrage group leaves the pool at its one-time cap');
assert.deepEqual(
    traitH02BarrageProfile(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H02_abl03_eff01', 1]]), 'H02'),
    {
        traitId: 'RG_H02_abl03_eff01',
        skillId: '2001_5',
        initialCooldownSeconds: 6,
        cooldownSeconds: 6,
        castTimeSeconds: 2,
        configuredShotDelays: [0.2, 0.4, 0.6, 0.6, 0.8, 1, 1.2, 1.4, 1.6],
        effectRatio: 5000,
        projectileSpeed: 700,
    },
    'star-7 barrage exposes the recovered 2001_5 timing and projectile profile',
);
assert.equal(traitH02BarrageProfile(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H02_abl03_eff01', 1]]), 'H07').skillId, '2001_5', 'the decoded H07 companion receives the lower barrage skill');
assert.deepEqual(
    traitH02BarrageProfile(IMPLEMENTED_TRAIT_POOL, h02BarrageTaken, 'H02'),
    {
        traitId: 'RG_H02_abl03_eff02',
        skillId: '2001_6',
        initialCooldownSeconds: 6,
        cooldownSeconds: 6,
        castTimeSeconds: 3,
        configuredShotDelays: [0.5, 1, 1.5, 2, 2.5, 3, 3.5],
        effectRatio: 5000,
        projectileSpeed: 700,
    },
    'star-8 replacement exposes the longer 2001_6 cast and its configured late shot',
);
assert.equal(traitH02BarrageProfile(IMPLEMENTED_TRAIT_POOL, h02BarrageTaken, 'H07').skillId, '2001_6', 'the decoded H07 companion receives the replacement barrage skill');
assert.equal(traitH02BarrageProfile(IMPLEMENTED_TRAIT_POOL, h02BarrageTaken, 'H03'), null, 'barrage does not leak to unrelated heroes');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h02BarrageTaken, 'barrage', 'H02'), 5000, 'selected barrage exposes its missile ratio for H02');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h02BarrageTaken, 'barrage', 'H07'), 5000, 'selected barrage exposes its missile ratio for H07');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h02BarrageTaken, 'barrage', 'H01'), 0, 'barrage ratio does not leak to H01');

const h04PeriodicHealVariants = IMPLEMENTED_TRAIT_POOL.filter((trait) => trait.group === 'RG_H04_abl02');
assert.equal(h04PeriodicHealVariants.length, 2, 'both decoded H04 periodic-heal star variants are modeled');
assert.deepEqual(
    h04PeriodicHealVariants.map((trait) => ({
        id: trait.id,
        star: trait.minHeroStar.star,
        quality: trait.quality,
        weight: trait.weight,
        maxTimes: trait.maxTimes,
        range: trait.range,
        effect: trait.effect,
    })),
    [
        { id: 'RG_H04_abl02_eff01', star: 2, quality: 3, weight: 100, maxTimes: 1, range: ['H04', 'H09'], effect: { kind: 'periodicSelfHeal', amount: 200 } },
        { id: 'RG_H04_abl02_eff02', star: 3, quality: 3, weight: 100, maxTimes: 1, range: ['H04', 'H09'], effect: { kind: 'periodicSelfHeal', amount: 500 } },
    ],
    'H04 vitality preserves its star gates, draw rows, H04/H09 scope and runtime heal ratios',
);
const drawH04PeriodicHeal = (star, times = emptyTimes) => drawWeightedTraits(
    h04PeriodicHealVariants,
    new Set(['H04']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H04', star]]),
);
assert.equal(drawH04PeriodicHeal(1).length, 0, 'the evidence-safe H04 star-1 baseline cannot draw knight vitality');
assert.equal(drawH04PeriodicHeal(2)[0].id, 'RG_H04_abl02_eff01', 'H04 star 2 unlocks the 200-ratio passive heal');
assert.equal(drawH04PeriodicHeal(3)[0].id, 'RG_H04_abl02_eff02', 'H04 star 3 replaces the lower row with the 500-ratio passive heal');
assert.equal(drawH04PeriodicHeal(3).length, 1, 'only the highest qualified H04 vitality row enters one draw');
const h04PeriodicHealTaken = new Map([['RG_H04_abl02_eff02', 1]]);
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h04PeriodicHealTaken, 'periodicSelfHeal', 'H04'), 500, 'the selected star-3 row applies to future H04 units');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h04PeriodicHealTaken, 'periodicSelfHeal', 'H09'), 500, 'the decoded H09 companion scope receives the same passive');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h04PeriodicHealTaken, 'periodicSelfHeal', 'H01'), 0, 'knight vitality does not leak to unrelated heroes');
assert.equal(drawH04PeriodicHeal(3, h04PeriodicHealTaken).length, 0, 'the selected H04 vitality group leaves the pool at its one-time cap');

const h11BaseRepair = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H11_abl01_eff02');
assert.deepEqual(
    {
        group: h11BaseRepair.group,
        quality: h11BaseRepair.quality,
        weight: h11BaseRepair.weight,
        maxTimes: h11BaseRepair.maxTimes,
        range: h11BaseRepair.range,
        minHeroStar: h11BaseRepair.minHeroStar,
        effect: h11BaseRepair.effect,
    },
    {
        group: 'RG_H11_abl01',
        quality: 2,
        weight: 200,
        maxTimes: 1,
        range: ['H11'],
        minHeroStar: { heroId: 'H11', star: 5 },
        effect: { kind: 'skillReplacement', amount: 0 },
    },
    'H11 base repair preserves the decoded star gate, draw row and ZL_1103 replacement identity',
);
const drawH11BaseRepair = (star, times = emptyTimes) => drawWeightedTraits(
    [h11BaseRepair],
    new Set(['H11']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H11', star]]),
);
assert.equal(drawH11BaseRepair(4).length, 0, 'H11 below star 5 cannot draw base repair');
assert.equal(drawH11BaseRepair(5)[0].id, h11BaseRepair.id, 'H11 star 5 unlocks the ZL_1103 replacement');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, new Map([[h11BaseRepair.id, 1]]), 'skillReplacement', 'H11'), 0, 'base repair changes skill identity rather than adding an attribute amount');
assert.equal(drawH11BaseRepair(5, new Map([[h11BaseRepair.id, 1]])).length, 0, 'the one-time base-repair card leaves the pool after selection');

const h11HealToShield = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H11_abl02_eff01');
assert.deepEqual(
    {
        group: h11HealToShield.group,
        quality: h11HealToShield.quality,
        weight: h11HealToShield.weight,
        maxTimes: h11HealToShield.maxTimes,
        range: h11HealToShield.range,
        minHeroStar: h11HealToShield.minHeroStar,
        effect: h11HealToShield.effect,
    },
    {
        group: 'RG_H11_abl02',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H11'],
        minHeroStar: { heroId: 'H11', star: 2 },
        effect: { kind: 'healToShield', amount: 1 },
    },
    'H11 shield generation preserves the decoded draw row and FEATURE/HEAL_TO_SHIELD value',
);
const drawH11HealToShield = (star, times = emptyTimes) => drawWeightedTraits(
    [h11HealToShield],
    new Set(['H11']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H11', star]]),
);
assert.equal(drawH11HealToShield(1).length, 0, 'H11 star 1 cannot draw shield generation');
assert.equal(drawH11HealToShield(2)[0].id, h11HealToShield.id, 'H11 star 2 unlocks shield generation');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, new Map([[h11HealToShield.id, 1]]), 'healToShield', 'H11'), 1, 'the selected feature is visible to H11 healing');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, new Map([[h11HealToShield.id, 1]]), 'healToShield', 'H01'), 0, 'H11 shield generation does not leak to unrelated heroes');
assert.equal(drawH11HealToShield(2, new Map([[h11HealToShield.id, 1]])).length, 0, 'the one-time shield card leaves the pool after selection');

const h11MultiTargetNoOp = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H11_abl03_eff01');
assert.deepEqual(
    {
        group: h11MultiTargetNoOp.group,
        quality: h11MultiTargetNoOp.quality,
        weight: h11MultiTargetNoOp.weight,
        maxTimes: h11MultiTargetNoOp.maxTimes,
        range: h11MultiTargetNoOp.range,
        minHeroStar: h11MultiTargetNoOp.minHeroStar,
        effect: h11MultiTargetNoOp.effect,
    },
    {
        group: 'RG_H11_abl03',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H11'],
        minHeroStar: { heroId: 'H11', star: 7 },
        effect: { kind: 'runtimeNoOp', amount: 0 },
    },
    'H11 group healing preserves the decoded draw row while recording the absent v18 consumer',
);
const drawH11MultiTargetNoOp = (star, times = emptyTimes) => drawWeightedTraits(
    [h11MultiTargetNoOp],
    new Set(['H11']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H11', star]]),
);
assert.equal(drawH11MultiTargetNoOp(6).length, 0, 'H11 below star 7 cannot draw group healing');
assert.equal(drawH11MultiTargetNoOp(7)[0].id, h11MultiTargetNoOp.id, 'H11 star 7 can draw the shipped group-healing row');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, new Map([[h11MultiTargetNoOp.id, 1]]), 'runtimeNoOp', 'H11'), 0, 'the unhandled effect does not change H11 combat values');
assert.equal(drawH11MultiTargetNoOp(7, new Map([[h11MultiTargetNoOp.id, 1]])).length, 0, 'the one-time unhandled row leaves the pool after selection');

const h12ParalysisVariants = IMPLEMENTED_TRAIT_POOL.filter((trait) => trait.group === 'RG_H12_abl01');
assert.deepEqual(
    h12ParalysisVariants.map((trait) => ({
        id: trait.id,
        star: trait.minHeroStar.star,
        quality: trait.quality,
        weight: trait.weight,
        maxTimes: trait.maxTimes,
        range: trait.range,
        effect: trait.effect,
    })),
    [
        { id: 'RG_H12_abl01_eff01', star: 1, quality: 2, weight: 200, maxTimes: 1, range: ['H12', 'H08'], effect: { kind: 'paralysis', amount: 1000 } },
        { id: 'RG_H12_abl01_eff02', star: 3, quality: 2, weight: 200, maxTimes: 1, range: ['H12', 'H08'], effect: { kind: 'paralysis', amount: 2000 } },
    ],
    'H12 paralysis variants preserve both decoded star gates, draw values, ranges and BuffGroup durations',
);
const drawH12Paralysis = (star, times = emptyTimes) => drawWeightedTraits(
    h12ParalysisVariants,
    new Set(['H12']),
    times,
    2,
    0,
    () => 0,
    1,
    100,
    new Map([['H12', star]]),
);
assert.equal(drawH12Paralysis(0).length, 0, 'an unavailable H12 cannot draw the paralysis group');
assert.equal(drawH12Paralysis(1)[0].id, 'RG_H12_abl01_eff01', 'the default star-1 account draws the one-second replacement');
assert.equal(drawH12Paralysis(2)[0].id, 'RG_H12_abl01_eff01', 'star 2 keeps the one-second replacement');
assert.equal(drawH12Paralysis(3)[0].id, 'RG_H12_abl01_eff02', 'star 3 replaces the lower group row with the two-second version');
assert.equal(drawH12Paralysis(3).length, 1, 'only the highest verified H12 row enters the weighted pool');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H12_abl01_eff01', 1]]), 'paralysis', 'H12'), 1000, 'selected version 1 exposes its one-second skill replacement');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H12_abl01_eff02', 1]]), 'paralysis', 'H12'), 2000, 'selected version 2 exposes its two-second skill replacement');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H12_abl01_eff01', 1]]), 'paralysis', 'H01'), 0, 'the H12/H08 ability does not affect unrelated heroes');
assert.equal(drawH12Paralysis(1, new Map([['RG_H12_abl01_eff01', 1]])).length, 0, 'the selected star-1 row leaves the pool at its one-time cap');

const h12GuaranteedCritical = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H12_abl02_eff01');
assert.deepEqual(
    {
        quality: h12GuaranteedCritical.quality,
        weight: h12GuaranteedCritical.weight,
        maxTimes: h12GuaranteedCritical.maxTimes,
        range: h12GuaranteedCritical.range,
        minHeroStar: h12GuaranteedCritical.minHeroStar,
        effect: h12GuaranteedCritical.effect,
    },
    {
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H12', 'H08'],
        minHeroStar: { heroId: 'H12', star: 2 },
        effect: { kind: 'criticalRate', amount: 10000 },
    },
    'H12 guaranteed critical preserves the decoded draw row and ATTR/CRI_RATE 10000 consumer',
);
const drawH12GuaranteedCritical = (star, times = emptyTimes) => drawWeightedTraits(
    [h12GuaranteedCritical],
    new Set(['H12']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H12', star]]),
);
assert.equal(drawH12GuaranteedCritical(1).length, 0, 'the safe star-1 H12 baseline cannot draw the star-2 guaranteed critical');
assert.equal(drawH12GuaranteedCritical(2)[0].id, h12GuaranteedCritical.id, 'H12 star 2 unlocks guaranteed critical');
const guaranteedCriticalTaken = new Map([['RG_H12_abl02_eff01', 1]]);
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, guaranteedCriticalTaken, 'criticalRate', 'H12'), 10000, 'the selected card contributes full H12 critical rate');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, guaranteedCriticalTaken, 'criticalRate', 'H08'), 10000, 'the decoded H08 companion range receives the same hero attribute');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, guaranteedCriticalTaken, 'criticalRate', 'H01'), 0, 'the critical-rate attribute does not leak to unrelated heroes');
assert.equal(drawH12GuaranteedCritical(2, guaranteedCriticalTaken).length, 0, 'the one-time guaranteed-critical card leaves the pool after selection');

const h12CriticalDamage = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H12_abl03_eff01');
assert.deepEqual(
    {
        quality: h12CriticalDamage.quality,
        weight: h12CriticalDamage.weight,
        maxTimes: h12CriticalDamage.maxTimes,
        range: h12CriticalDamage.range,
        minHeroStar: h12CriticalDamage.minHeroStar,
        effect: h12CriticalDamage.effect,
    },
    {
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H12', 'H08'],
        minHeroStar: { heroId: 'H12', star: 7 },
        effect: { kind: 'criticalDamage', amount: 5000 },
    },
    'H12 critical damage preserves the decoded draw row and ATTR/CRI_DMG 5000 consumer',
);
const drawH12CriticalDamage = (star, times = emptyTimes) => drawWeightedTraits(
    [h12CriticalDamage],
    new Set(['H12']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H12', star]]),
);
assert.equal(drawH12CriticalDamage(6).length, 0, 'H12 below star 7 cannot draw the critical-damage card');
assert.equal(drawH12CriticalDamage(7)[0].id, h12CriticalDamage.id, 'H12 star 7 unlocks the critical-damage card');
const criticalDamageTaken = new Map([['RG_H12_abl03_eff01', 1]]);
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, criticalDamageTaken, 'criticalDamage', 'H12'), 5000, 'the selected card contributes 5000 H12 critical damage');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, criticalDamageTaken, 'criticalDamage', 'H08'), 5000, 'the decoded H08 companion range receives the same critical damage');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, criticalDamageTaken, 'criticalDamage', 'H01'), 0, 'critical damage does not leak to unrelated heroes');
assert.equal(drawH12CriticalDamage(7, criticalDamageTaken).length, 0, 'the one-time critical-damage card leaves the pool after selection');

const h12Electrified = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H12_abl04_eff01');
assert.deepEqual(
    {
        quality: h12Electrified.quality,
        weight: h12Electrified.weight,
        maxTimes: h12Electrified.maxTimes,
        range: h12Electrified.range,
        minHeroStar: h12Electrified.minHeroStar,
        effect: h12Electrified.effect,
    },
    {
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H12', 'H08'],
        minHeroStar: { heroId: 'H12', star: 10 },
        effect: { kind: 'skillReplacement', amount: 0 },
    },
    'H12 electrified preserves the decoded star gate, draw row and same-group skill replacement',
);
const drawH12Electrified = (star, times = emptyTimes) => drawWeightedTraits(
    [h12Electrified],
    new Set(['H12']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H12', star]]),
);
assert.equal(drawH12Electrified(9).length, 0, 'H12 below star 10 cannot draw electrified');
assert.equal(drawH12Electrified(10)[0].id, h12Electrified.id, 'H12 star 10 unlocks electrified');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, new Map([[h12Electrified.id, 1]]), 'skillReplacement', 'H12'), 0, 'LY_1204 changes skill identity instead of adding an attribute amount');
assert.equal(drawH12Electrified(10, new Map([[h12Electrified.id, 1]])).length, 0, 'the one-time electrified card leaves the pool after selection');

const h13BounceVariants = IMPLEMENTED_TRAIT_POOL.filter((trait) => trait.group === 'RG_H13_abl01');
assert.equal(h13BounceVariants.length, 2, 'both decoded H13 bounce-count star variants are modeled');
assert.deepEqual(
    h13BounceVariants.map((trait) => ({
        id: trait.id,
        star: trait.minHeroStar.star,
        quality: trait.quality,
        weight: trait.weight,
        maxTimes: trait.maxTimes,
        range: trait.range,
        effect: trait.effect,
    })),
    [
        { id: 'RG_H13_abl01_eff01', star: 2, quality: 3, weight: 100, maxTimes: 1, range: ['H13', 'H09'], effect: { kind: 'bounceTimes', amount: 2 } },
        { id: 'RG_H13_abl01_eff02', star: 3, quality: 3, weight: 100, maxTimes: 1, range: ['H13', 'H09'], effect: { kind: 'bounceTimes', amount: 4 } },
    ],
    'H13 bounce variants preserve the FEATURE/BOUNCE_TIMES values and H13/H09 scope',
);
const drawH13Bounce = (star, times = emptyTimes) => drawWeightedTraits(
    h13BounceVariants,
    new Set(['H13']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H13', star]]),
);
assert.equal(drawH13Bounce(1).length, 0, 'the evidence-safe H13 star-1 baseline cannot draw bounce-count upgrades');
assert.equal(drawH13Bounce(2)[0].id, 'RG_H13_abl01_eff01', 'H13 star 2 unlocks the plus-two bounce row');
assert.equal(drawH13Bounce(3)[0].id, 'RG_H13_abl01_eff02', 'H13 star 3 replaces the lower row with plus four bounces');
assert.equal(drawH13Bounce(3).length, 1, 'only the highest qualified H13 bounce row enters one draw');
const h13BounceTaken = new Map([['RG_H13_abl01_eff02', 1]]);
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h13BounceTaken, 'bounceTimes', 'H13'), 4, 'the selected row extends H13 bounce missiles by four');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h13BounceTaken, 'bounceTimes', 'H09'), 4, 'the decoded H09 companion scope receives the same feature');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h13BounceTaken, 'bounceTimes', 'H01'), 0, 'bounce-count upgrades do not leak to unrelated heroes');
assert.equal(drawH13Bounce(3, h13BounceTaken).length, 0, 'the selected H13 bounce group leaves the pool at its one-time cap');

const h13PopcornVariants = IMPLEMENTED_TRAIT_POOL.filter((trait) => trait.group === 'RG_H13_abl02');
assert.equal(h13PopcornVariants.length, 2, 'both decoded H13 popcorn replacement variants are modeled');
assert.deepEqual(
    h13PopcornVariants.map((trait) => ({
        id: trait.id,
        star: trait.minHeroStar.star,
        quality: trait.quality,
        weight: trait.weight,
        maxTimes: trait.maxTimes,
        range: trait.range,
        effect: trait.effect,
    })),
    [
        { id: 'RG_H13_abl02_eff01', star: 7, quality: 4, weight: 50, maxTimes: 1, range: ['H13', 'H09'], effect: { kind: 'skillReplacement', amount: 0 } },
        { id: 'RG_H13_abl02_eff02', star: 10, quality: 4, weight: 50, maxTimes: 1, range: ['H13', 'H09'], effect: { kind: 'skillReplacement', amount: 0 } },
    ],
    'H13 popcorn variants preserve the decoded draw rows and REPLACE_SKILL scope',
);
const drawH13Popcorn = (star, times = emptyTimes) => drawWeightedTraits(
    h13PopcornVariants,
    new Set(['H13']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H13', star]]),
);
assert.equal(drawH13Popcorn(6).length, 0, 'H13 below star 7 cannot draw a popcorn replacement');
assert.equal(drawH13Popcorn(7)[0].id, 'RG_H13_abl02_eff01', 'H13 star 7 unlocks TZ_1302');
assert.equal(drawH13Popcorn(10)[0].id, 'RG_H13_abl02_eff02', 'H13 star 10 exposes only the TZ_1303 replacement');
assert.equal(drawH13Popcorn(10).length, 1, 'only the highest qualified popcorn row enters one draw');
assert.equal(drawH13Popcorn(10, new Map([['RG_H13_abl02_eff02', 1]])).length, 0, 'the selected popcorn row leaves the pool at its one-time cap');

const h01KillAttack = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H01_abl03_eff01');
assert.deepEqual(
    {
        group: h01KillAttack.group,
        quality: h01KillAttack.quality,
        weight: h01KillAttack.weight,
        maxTimes: h01KillAttack.maxTimes,
        range: h01KillAttack.range,
        minHeroStar: h01KillAttack.minHeroStar,
        effect: h01KillAttack.effect,
    },
    {
        group: 'RG_H01_abl03',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H01', 'H07'],
        minHeroStar: { heroId: 'H01', star: 7 },
        effect: { kind: 'warriorKillAttackIncrease', amount: 200, maxStacks: 30 },
    },
    'H01 kill stacking preserves the decoded SPECIAL_WORD/DIE_ZHONG_DIE row',
);
const drawH01KillAttack = (star, times = emptyTimes) => drawWeightedTraits(
    [h01KillAttack],
    new Set(['H01']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H01', star]]),
);
assert.equal(drawH01KillAttack(6).length, 0, 'H01 below star 7 cannot draw the kill-stacking card');
assert.equal(drawH01KillAttack(7)[0].id, h01KillAttack.id, 'H01 star 7 unlocks the kill-stacking card');
const h01KillTaken = new Map([[h01KillAttack.id, 1]]);
assert.equal(drawH01KillAttack(7, h01KillTaken).length, 0, 'the one-time kill-stacking card leaves the pool after selection');
const killAttackProfile = traitWarriorKillAttackProfile(IMPLEMENTED_TRAIT_POOL, h01KillTaken);
assert.deepEqual(
    killAttackProfile,
    { range: ['H01', 'H07'], attackIncreasePerStack: 200, maxStacks: 30 },
    'the runtime profile joins both warrior-family ids to 200 ATK_INC and a 30-stack cap',
);
assert.equal(traitWarriorKillAttackProfile(IMPLEMENTED_TRAIT_POOL, emptyTimes), null, 'no stack profile exists before the card is selected');
assert.deepEqual(completeWarriorKillAttackStack(0, killAttackProfile, 'H02'), { stacks: 0, triggered: false }, 'an unrelated final killer does not advance the stack');
assert.deepEqual(completeWarriorKillAttackStack(0, killAttackProfile, 'H01'), { stacks: 1, triggered: true }, 'an H01 final kill advances the shared stack');
assert.deepEqual(completeWarriorKillAttackStack(1, killAttackProfile, 'H07'), { stacks: 2, triggered: true }, 'the decoded H07 companion can also advance the stack');
assert.equal(warriorKillAttackMultiplier(killAttackProfile, 2, 'H01'), 1.04, 'two kills apply four percent live H01 attack');
assert.equal(warriorKillAttackMultiplier(killAttackProfile, 30, 'H07'), 1.6, 'thirty kills apply the capped sixty percent H07 attack');
assert.equal(warriorKillAttackMultiplier(killAttackProfile, 30, 'H02'), 1, 'the accumulated warrior stack does not affect unrelated heroes');
assert.deepEqual(completeWarriorKillAttackStack(30, killAttackProfile, 'H01'), { stacks: 30, triggered: false }, 'a qualifying kill cannot exceed the 30-stack cap');
assert.equal(warriorKillAttackMultiplier(killAttackProfile, -2, 'H01'), 1, 'negative reconstructed stack input clamps to zero');

const h03TransformVariants = IMPLEMENTED_TRAIT_POOL.filter((trait) => trait.group === 'RG_H03_abl03');
assert.equal(h03TransformVariants.length, 2, 'both decoded H03 transform variants are modeled');
assert.deepEqual(
    h03TransformVariants.map((trait) => ({
        id: trait.id,
        star: trait.minHeroStar.star,
        quality: trait.quality,
        weight: trait.weight,
        maxTimes: trait.maxTimes,
        range: trait.range,
        effect: trait.effect,
    })),
    [
        { id: 'RG_H03_abl03_eff01', star: 7, quality: 3, weight: 100, maxTimes: 1, range: ['H03', 'H08'], effect: { kind: 'transform', amount: 0 } },
        { id: 'RG_H03_abl03_eff02', star: 8, quality: 3, weight: 100, maxTimes: 1, range: ['H03', 'H08'], effect: { kind: 'transform', amount: 3000 } },
    ],
    'H03 transform preserves both decoded draw rows and their shared family scope',
);
const drawH03Transform = (star, times = emptyTimes) => drawWeightedTraits(
    h03TransformVariants,
    new Set(['H03']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H03', star]]),
);
assert.equal(drawH03Transform(6).length, 0, 'H03 below star 7 cannot draw transform');
assert.equal(drawH03Transform(7)[0].id, 'RG_H03_abl03_eff01', 'H03 star 7 unlocks the disabling transform');
assert.equal(drawH03Transform(7).length, 1, 'star 7 exposes exactly one transform row');
assert.equal(drawH03Transform(8)[0].id, 'RG_H03_abl03_eff02', 'H03 star 8 replaces the lower transform row');
assert.equal(drawH03Transform(8).length, 1, 'only the highest qualified transform row enters one draw');
const h03TransformTaken = new Map([['RG_H03_abl03_eff02', 1]]);
assert.equal(drawH03Transform(8, h03TransformTaken).length, 0, 'the selected transform group leaves the pool at its one-time cap');
assert.deepEqual(
    traitH03TransformProfile(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H03_abl03_eff01', 1]]), 'H03'),
    { traitId: 'RG_H03_abl03_eff01', durationSeconds: 2, disablesTarget: true, outgoingDamageIncrease: 0 },
    'star-7 transform applies the recovered two-second disabling profile',
);
assert.deepEqual(
    traitH03TransformProfile(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H03_abl03_eff01', 1]]), 'H08'),
    { traitId: 'RG_H03_abl03_eff01', durationSeconds: 2, disablesTarget: true, outgoingDamageIncrease: 0 },
    'the decoded H08 companion receives the same disabling transform',
);
assert.deepEqual(
    traitH03TransformProfile(IMPLEMENTED_TRAIT_POOL, h03TransformTaken, 'H03'),
    { traitId: 'RG_H03_abl03_eff02', durationSeconds: 2, disablesTarget: false, outgoingDamageIncrease: 3000 },
    'star-8 preserves the runtime DMG_INC profile instead of inventing incoming vulnerability',
);
assert.deepEqual(
    traitH03TransformProfile(IMPLEMENTED_TRAIT_POOL, h03TransformTaken, 'H08'),
    { traitId: 'RG_H03_abl03_eff02', durationSeconds: 2, disablesTarget: false, outgoingDamageIncrease: 3000 },
    'the H08 companion also receives the runtime star-8 profile',
);
assert.equal(traitH03TransformProfile(IMPLEMENTED_TRAIT_POOL, h03TransformTaken, 'H04'), null, 'transform does not leak to unrelated heroes');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h03TransformTaken, 'transform', 'H03'), 3000, 'star-8 exposes the configured DMG_INC amount for H03');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h03TransformTaken, 'transform', 'H08'), 3000, 'star-8 exposes the configured DMG_INC amount for H08');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H03_abl03_eff01', 1]]), 'transform', 'H03'), 0, 'star-7 transform has no attribute component');

const h03EliteMage = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H03_abl01_eff01');
assert.deepEqual(
    { group: h03EliteMage.group, star: h03EliteMage.minHeroStar.star, range: h03EliteMage.range, effect: h03EliteMage.effect },
    { group: 'RG_H03_abl01', star: 2, range: ['H03', 'H08'], effect: { kind: 'attackIncrease', amount: 2000 } },
    'H03 elite mage preserves the decoded star-2 gate and H03/H08 family scope',
);
const h03Freeze = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H03_abl02_eff01');
assert.deepEqual(
    { group: h03Freeze.group, star: h03Freeze.minHeroStar.star, range: h03Freeze.range, effect: h03Freeze.effect },
    { group: 'RG_H03_abl02', star: 1, range: ['H03', 'H08'], effect: { kind: 'freeze', amount: 3000 } },
    'H03 freeze preserves the decoded star-1 gate and reaches the H08 fusion companion',
);
const h03Laser = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H03_abl04_eff01');
assert.deepEqual(
    {
        group: h03Laser.group,
        quality: h03Laser.quality,
        weight: h03Laser.weight,
        maxTimes: h03Laser.maxTimes,
        range: h03Laser.range,
        minHeroStar: h03Laser.minHeroStar,
        effect: h03Laser.effect,
    },
    {
        group: 'RG_H03_abl04',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H03', 'H08'],
        minHeroStar: { heroId: 'H03', star: 10 },
        effect: { kind: 'penetratingLaser', amount: 5000 },
    },
    'H03 laser preserves the decoded quality-4 ADD_SKILL row',
);
const drawH03Laser = (star, times = emptyTimes) => drawWeightedTraits(
    [h03Laser],
    new Set(['H03']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H03', star]]),
);
assert.equal(drawH03Laser(9).length, 0, 'H03 below star 10 cannot draw the laser card');
assert.equal(drawH03Laser(10)[0].id, h03Laser.id, 'H03 star 10 unlocks the laser card');
const h03LaserTaken = new Map([[h03Laser.id, 1]]);
assert.equal(drawH03Laser(10, h03LaserTaken).length, 0, 'the one-time laser card leaves the pool after selection');
const expectedH03LaserProfile = {
    traitId: 'RG_H03_abl04_eff01',
    skillId: '3001_5',
    initialCooldownSeconds: 0,
    cooldownSeconds: 4,
    castTimeSeconds: 1,
    behaviorDelaySeconds: 0.3,
    castingRange: 50,
    width: 100,
    height: 300,
    maxTargets: 999,
    effectRatio: 5000,
};
assert.deepEqual(traitH03LaserProfile(IMPLEMENTED_TRAIT_POOL, h03LaserTaken, 'H03'), expectedH03LaserProfile, 'H03 snapshots the decoded 3001_5 cast profile');
assert.deepEqual(traitH03LaserProfile(IMPLEMENTED_TRAIT_POOL, h03LaserTaken, 'H08'), expectedH03LaserProfile, 'the decoded H08 fusion companion receives the laser skill');
assert.equal(traitH03LaserProfile(IMPLEMENTED_TRAIT_POOL, h03LaserTaken, 'H04'), null, 'the laser does not leak to unrelated heroes');
assert.equal(traitH03LaserProfile(IMPLEMENTED_TRAIT_POOL, emptyTimes, 'H03'), null, 'no laser profile exists before the card is selected');

const h04KillFly = IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H04_abl04_eff01');
assert.deepEqual(
    {
        group: h04KillFly.group,
        quality: h04KillFly.quality,
        weight: h04KillFly.weight,
        maxTimes: h04KillFly.maxTimes,
        range: h04KillFly.range,
        minHeroStar: h04KillFly.minHeroStar,
        effect: h04KillFly.effect,
    },
    {
        group: 'RG_H04_abl04',
        quality: 2,
        weight: 100,
        maxTimes: 1,
        range: ['H04', 'H09'],
        minHeroStar: { heroId: 'H04', star: 8 },
        effect: { kind: 'attackKillFly', amount: 3000 },
    },
    'H04 kill-fly preserves the decoded FEATURE/ATTACK_KILL_FLY row',
);
const drawH04KillFly = (star, times = emptyTimes) => drawWeightedTraits(
    [h04KillFly],
    new Set(['H04']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H04', star]]),
);
assert.equal(drawH04KillFly(7).length, 0, 'H04 below star 8 cannot draw kill-fly');
assert.equal(drawH04KillFly(8)[0].id, h04KillFly.id, 'H04 star 8 unlocks kill-fly');
const h04KillFlyTaken = new Map([[h04KillFly.id, 1]]);
assert.equal(drawH04KillFly(8, h04KillFlyTaken).length, 0, 'the one-time kill-fly row leaves the pool after selection');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h04KillFlyTaken, 'attackKillFly', 'H04'), 3000, 'selected kill-fly gives H04 the recovered 3000 probability');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h04KillFlyTaken, 'attackKillFly', 'H09'), 3000, 'selected kill-fly shares the feature with H09');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h04KillFlyTaken, 'attackKillFly', 'H03'), 0, 'kill-fly does not leak to unrelated heroes');

const h04ShieldWallVariants = IMPLEMENTED_TRAIT_POOL.filter((trait) => trait.group === 'RG_H04_abl03');
assert.equal(h04ShieldWallVariants.length, 2, 'both decoded H04 shield-wall variants are modeled');
assert.deepEqual(
    h04ShieldWallVariants.map((trait) => ({
        id: trait.id,
        star: trait.minHeroStar.star,
        quality: trait.quality,
        weight: trait.weight,
        maxTimes: trait.maxTimes,
        range: trait.range,
        effect: trait.effect,
    })),
    [
        { id: 'RG_H04_abl03_eff01', star: 7, quality: 4, weight: 50, maxTimes: 1, range: ['H04', 'H09'], effect: { kind: 'shieldWall', amount: 3000 } },
        { id: 'RG_H04_abl03_eff02', star: 10, quality: 4, weight: 50, maxTimes: 1, range: ['H04', 'H09'], effect: { kind: 'shieldWall', amount: 3000 } },
    ],
    'H04 shield wall preserves both decoded draw rows and their shared passive scope',
);
const drawH04ShieldWall = (star, times = emptyTimes) => drawWeightedTraits(
    h04ShieldWallVariants,
    new Set(['H04']),
    times,
    1,
    0,
    () => 0,
    1,
    100,
    new Map([['H04', star]]),
);
assert.equal(drawH04ShieldWall(6).length, 0, 'H04 below star 7 cannot draw shield wall');
assert.equal(drawH04ShieldWall(7)[0].id, 'RG_H04_abl03_eff01', 'H04 star 7 unlocks the damage-reduction shield wall');
assert.equal(drawH04ShieldWall(9)[0].id, 'RG_H04_abl03_eff01', 'the star-7 row remains selected below star 10');
assert.equal(drawH04ShieldWall(10)[0].id, 'RG_H04_abl03_eff02', 'H04 star 10 replaces the lower row with counterattack shield wall');
assert.equal(drawH04ShieldWall(10).length, 1, 'only the highest qualified shield-wall row enters one draw');
const h04ShieldWallTaken = new Map([['RG_H04_abl03_eff02', 1]]);
assert.equal(drawH04ShieldWall(10, h04ShieldWallTaken).length, 0, 'the selected shield-wall group leaves the pool at its one-time cap');
assert.deepEqual(
    traitH04ShieldWallProfile(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H04_abl03_eff01', 1]]), 'H04'),
    { traitId: 'RG_H04_abl03_eff01', damageResistance: 3000, counterattackRatio: 0 },
    'star-7 shield wall exposes resistance without counterattack',
);
assert.deepEqual(
    traitH04ShieldWallProfile(IMPLEMENTED_TRAIT_POOL, new Map([['RG_H04_abl03_eff01', 1]]), 'H09'),
    { traitId: 'RG_H04_abl03_eff01', damageResistance: 3000, counterattackRatio: 0 },
    'the decoded H09 companion scope receives the same shield wall',
);
assert.deepEqual(
    traitH04ShieldWallProfile(IMPLEMENTED_TRAIT_POOL, h04ShieldWallTaken, 'H04'),
    { traitId: 'RG_H04_abl03_eff02', damageResistance: 3000, counterattackRatio: 3000 },
    'star-10 shield wall adds the recovered 3000 counterattack ratio',
);
assert.equal(traitH04ShieldWallProfile(IMPLEMENTED_TRAIT_POOL, h04ShieldWallTaken, 'H03'), null, 'shield wall does not leak to unrelated heroes');
assert.equal(traitEffectAmount(IMPLEMENTED_TRAIT_POOL, h04ShieldWallTaken, 'shieldWall', 'H04'), 3000, 'selected shield wall exposes its recovered DMG_RES amount');

console.log('baglike traits: 240 assertions passed');
