import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    beginCandidatePreparationRound,
    candidateNormalRefreshCost,
    completeCandidateRefresh,
    resolveGridDrop,
} from '../assets/scripts/BagLikeCandidateDrops.ts';

const unlocked = new Set([9, 10, 11, 16, 17, 18, 23, 24, 25]);
const powerCoreUid = 1;
const placed = [
    { uid: powerCoreUid, row: 2, col: 3, shape: [[0, 0]] },
    { uid: 2, row: 1, col: 2, shape: [[0, 0], [1, 0]] },
    { uid: 3, row: 1, col: 4, shape: [[0, 0], [1, 0]] },
    { uid: 4, row: 3, col: 2, shape: [[0, 0], [0, 1]] },
];

const occupiedReplacement = resolveGridDrop({
    source: 'candidate',
    movingUid: 99,
    movingShape: [[0, 0], [0, 1], [0, 2]],
    target: { row: 1, col: 2 },
    rows: 5,
    columns: 7,
    unlocked,
    reserved: new Set([17]),
    placed,
    protectedPlacementUids: new Set([powerCoreUid]),
});
assert.deepEqual(occupiedReplacement, {
    kind: 'place',
    row: 1,
    col: 2,
    displacedUids: [2, 3],
}, 'a valid occupied drop replaces every overlapping whole gear');

assert.deepEqual(resolveGridDrop({
    source: 'grid',
    movingUid: 2,
    movingShape: [[0, 0], [1, 0]],
    target: null,
    rows: 5,
    columns: 7,
    unlocked,
    reserved: new Set([17]),
    placed,
}), { kind: 'return-to-candidate' }, 'an invalid placed-gear drop returns it to the candidate tray');

assert.deepEqual(resolveGridDrop({
    source: 'candidate',
    movingUid: 99,
    movingShape: [[0, 0]],
    target: { row: 0, col: 0 },
    rows: 5,
    columns: 7,
    unlocked,
    reserved: new Set([17]),
    placed,
}), { kind: 'restore-origin' }, 'an invalid candidate drop restores its tray origin');

assert.deepEqual(resolveGridDrop({
    source: 'grid',
    movingUid: powerCoreUid,
    movingShape: [[0, 0]],
    target: null,
    rows: 5,
    columns: 7,
    unlocked,
    reserved: new Set(),
    placed,
    invalidGridDrop: 'restore-origin',
}), { kind: 'restore-origin' }, 'the power core cannot be returned to the tray');

let counters = beginCandidatePreparationRound({
    normalRefreshTimes: 4,
    nonAdRefreshTimes: 8,
    hasRefreshFromAd: true,
});
assert.deepEqual(counters, {
    normalRefreshTimes: 0,
    nonAdRefreshTimes: 8,
    hasRefreshFromAd: false,
}, 'each preparation round resets only per-round normal/ad counters');
assert.equal(candidateNormalRefreshCost(counters.normalRefreshTimes, 15), 0, 'the first normal refresh in a preparation round is free');

counters = completeCandidateRefresh(counters, 'prepare');
assert.deepEqual(counters, {
    normalRefreshTimes: 0,
    nonAdRefreshTimes: 9,
    hasRefreshFromAd: false,
}, 'automatic preparation dealing advances the global non-ad sequence only');
counters = completeCandidateRefresh(counters, 'normal');
assert.equal(candidateNormalRefreshCost(counters.normalRefreshTimes, 15), 15, 'later normal refreshes in the same round cost 15');
assert.deepEqual(counters, {
    normalRefreshTimes: 1,
    nonAdRefreshTimes: 10,
    hasRefreshFromAd: false,
});
counters = completeCandidateRefresh(counters, 'ad');
assert.deepEqual(counters, {
    normalRefreshTimes: 1,
    nonAdRefreshTimes: 10,
    hasRefreshFromAd: true,
}, 'ad refresh is once-per-round and does not advance the non-ad sequence');

const gameSource = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
const layoutSource = readFileSync(new URL('../assets/scripts/BattlefieldLayout.ts', import.meta.url), 'utf8');
assert.match(gameSource, /private dealPreparationBatch\(\): void \{\s*const counters = beginCandidatePreparationRound/, 'every automatic preparation deal resets the per-round counters first');
assert.match(gameSource, /private startRound\(\): void[\s\S]*?this\.clearCandidates\(\);/, 'starting battle clears every unplaced candidate');
assert.match(gameSource, /this\.prepareLayer\.active = layout\.showBackpack;/, 'phase layout keeps backpack visibility under one production rule');
assert.match(layoutSource, /showBackpack: phase !== 'won' && phase !== 'lost'/, 'the backpack remains visible through battle, trait, and round-clear phases');
assert.match(gameSource, /const open = this\.unlocked\.has\(index\);\s*if \(!open\) continue;[\s\S]{0,320}BAGLIKE_ATLAS_FRAMES\.gridOpen/, 'only unlocked cells receive the recovered open-grid face');
assert.match(gameSource, /'OriginalGearConnector'[\s\S]{0,360}connector\.setSiblingIndex\(0\)/, 'the recovered connector is pinned below the gear bodies');
assert.doesNotMatch(gameSource, /const rotor = this\.makeNode\(`GearRotor_[\s\S]{0,180}rotor\.setSiblingIndex\(0\)/, 'gear bodies no longer move below the connector layer');

console.log('preparation interaction integration: 17 assertions passed');
