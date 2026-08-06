import assert from 'node:assert/strict';
import {
    candidateDrawIds,
    candidateHeroFamily,
    candidateRewardModifiersForRefresh,
    coinRewardWeightMultiplier,
    coinRewardWeightModifiers,
    drawCandidateBatch,
    drawCandidateReward,
    drawDynamicCandidateBatch,
    placedCoinGearCount,
    shouldForceGridCandidate,
    shouldUseStaticCandidateBatch,
    weightedCandidatePick,
} from '../assets/scripts/BagLikeCandidateDrops.ts';

const heroes = new Set(['H01', 'H02', 'H03', 'H04', 'H11', 'H12', 'H13']);
const context = { unlockedHeroFamilies: heroes, hasLockedGrid: true };

assert.equal(weightedCandidatePick([{ value: 'a', weight: 1 }, { value: 'b', weight: 3 }], () => 0), 'a');
assert.equal(weightedCandidatePick([{ value: 'a', weight: 1 }, { value: 'b', weight: 3 }], () => 0.999), 'b');

assert.deepEqual(candidateDrawIds('prepare', 1, true), [3000, 3000, 3000]);
assert.deepEqual(candidateDrawIds('normal', 2, true), [3001, 3002, 3003]);
assert.deepEqual(candidateDrawIds('normal', 2, false), [3002, 3002, 3002]);
assert.deepEqual(candidateDrawIds('ad', 0, true), [3002, 3003, 3004]);

assert.equal(shouldUseStaticCandidateBatch(1004, 1, 0, 3), true);
assert.equal(shouldUseStaticCandidateBatch(1004, 2, 0, 3), false);
assert.equal(shouldUseStaticCandidateBatch(1004, 1, 3, 3), false);
assert.equal(shouldUseStaticCandidateBatch(1001, 20, 0, 8), true);

const onlyH04 = { unlockedHeroFamilies: new Set(['H04']), hasLockedGrid: true };
assert.equal(drawCandidateReward(3014, onlyH04, () => 0.5), 'H0401');
assert.equal(drawCandidateReward(3015, onlyH04, () => 0.5), 'H0402');
assert.equal(drawCandidateReward(3016, onlyH04, () => 0.5), 'H0403');
assert.equal(drawCandidateReward(3014, { unlockedHeroFamilies: new Set(['H11']), hasLockedGrid: true }, () => 0.5), 'H1101');

let seed = 123456789;
const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 0x100000000;
};
const batches = Array.from({ length: 12 }, () => drawCandidateBatch([3001, 3002, 3003], context, random));
assert.ok(batches.every((batch) => batch.length === 3));
assert.ok(new Set(batches.map((batch) => batch.join(','))).size > 1, 'weighted refreshes must draw anew instead of replaying one stored batch');

const repeated = drawCandidateBatch([3000, 3000, 3000], onlyH04, () => 0);
assert.deepEqual(repeated, ['H0401', 'H0401', 'H0401'], 'the original independently samples each slot and does not invent anti-repeat');

const shippedLevel2Modifier = [{ rewardType: 'REWARD', rewardId: 3012, multiplier: 20000 }];
assert.deepEqual(candidateRewardModifiersForRefresh('prepare', shippedLevel2Modifier), shippedLevel2Modifier, 'automatic Prepare refresh receives SPECIAL_WORD reward modifiers');
assert.deepEqual(candidateRewardModifiersForRefresh('normal', shippedLevel2Modifier), [], 'a first-cost-free Normal refresh is not the Prepare enum and receives no modifier');
assert.deepEqual(candidateRewardModifiersForRefresh('ad', shippedLevel2Modifier), [], 'an Ad refresh receives no Prepare modifier');
assert.equal(drawCandidateReward(3001, onlyH04, () => 0.59), 'H0401', 'the unmodified boundary selects the level-1 reward branch');
assert.equal(
    drawCandidateReward(3001, onlyH04, () => 0.59, shippedLevel2Modifier),
    'H0401',
    'the shipped REWARD/3012 modifier is a no-op because branch 3001 contains 3014, 3015, 3016 and 3030',
);
assert.equal(
    drawCandidateReward(3001, onlyH04, () => 0.59, [{ rewardType: 'REWARD', rewardId: 3015, multiplier: 20000 }]),
    'H0402',
    'the generic exact-id multiplier path changes the boundary when it targets the real level-2 pool, proving 3012 was not silently aliased',
);

assert.equal(candidateHeroFamily('H0403'), 'H04');
assert.equal(candidateHeroFamily('C02'), null);
assert.equal(placedCoinGearCount(['C01', 'C02', 'C03', 'H0101']), 7, 'coin gear levels count as 1 + 2 + 4');
assert.equal(coinRewardWeightMultiplier(0), null);
assert.equal(coinRewardWeightMultiplier(1), 10000);
assert.equal(coinRewardWeightMultiplier(2), 8000);
assert.equal(coinRewardWeightMultiplier(16), 100);
assert.equal(coinRewardWeightMultiplier(1000), 100, 'coin weight table clamps above row 100');
assert.deepEqual(coinRewardWeightModifiers(['C02']), [{ rewardType: 'REWARD', rewardId: 3034, multiplier: 8000 }]);

assert.equal(shouldForceGridCandidate(6, true, ['H0101', 'H0201', 'H0301']), false);
assert.equal(shouldForceGridCandidate(7, true, ['H0101', 'H0201', 'H0301']), true);
assert.equal(shouldForceGridCandidate(7, false, ['H0101', 'H0201', 'H0301']), false);
assert.equal(shouldForceGridCandidate(7, true, ['H0101', 'G01', 'H0301']), false);

const forcedGridBatch = drawDynamicCandidateBatch(
    [3014, 3014, 3014],
    {
        unlockedHeroFamilies: new Set(['H01']),
        hasLockedGrid: true,
        placedGearIds: [],
        nonAdRefreshTimes: 7,
    },
    () => 0,
);
assert.deepEqual(forcedGridBatch, ['H0101', 'H0101', 'G01'], 'the seventh non-ad draw replaces slot three with a grid reward');

const cappedFamilies = drawDynamicCandidateBatch(
    [3014, 3014, 3014],
    {
        unlockedHeroFamilies: new Set(['H01', 'H02', 'H03', 'H04', 'H12', 'H13']),
        hasLockedGrid: false,
        placedGearIds: ['H0101', 'H0201', 'H0301', 'H0401', 'H1201'],
        nonAdRefreshTimes: 2,
    },
    () => 0.999,
);
assert.ok(cappedFamilies.every((id) => candidateHeroFamily(id) !== 'H13'), 'a sixth tracked hero family is excluded after the cap is reached');

const untrackedH11 = drawDynamicCandidateBatch(
    [3014],
    {
        unlockedHeroFamilies: new Set(['H01', 'H02', 'H03', 'H04', 'H11', 'H12']),
        hasLockedGrid: false,
        placedGearIds: ['H0101', 'H0201', 'H0301', 'H0401', 'H1201'],
        nonAdRefreshTimes: 2,
    },
    () => 0.7,
);
assert.deepEqual(untrackedH11, ['H1101'], 'H11 remains eligible outside the five tracked-family cap');

const fillMissingFamily = drawDynamicCandidateBatch(
    [3014, 3014, 3014],
    {
        unlockedHeroFamilies: new Set(['H01', 'H02', 'H03', 'H04', 'H12']),
        hasLockedGrid: false,
        placedGearIds: ['H0101', 'H0201', 'H0301', 'H0401'],
        nonAdRefreshTimes: 2,
    },
    () => 0,
);
assert.ok(fillMissingFamily.includes('H1201'), 'a duplicate candidate is replaced with an unlocked missing family until five are represented');

console.log('baglike candidate drops: 40 assertions passed');
