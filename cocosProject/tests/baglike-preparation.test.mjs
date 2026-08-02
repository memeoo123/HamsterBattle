import assert from 'node:assert/strict';
import {
    bagLikeGearBodyColor,
    bagLikeGearLevelColor,
    candidateTrayLayout,
    displacedPlacementUids,
    placementAreaValid,
    placementCells,
} from '../assets/scripts/BagLikeCandidateDrops.ts';

const unlocked = new Set([9, 10, 11, 16, 17, 18, 23, 24, 25]);
const reserved = new Set([17]);

assert.deepEqual(placementCells([[0, 0], [1, 0]], 1, 2), [[1, 2], [2, 2]]);
assert.equal(placementAreaValid([[0, 0]], 1, 2, 5, 7, unlocked, reserved), true);
assert.equal(placementAreaValid([[0, 0]], 2, 3, 5, 7, unlocked, reserved), false, 'the power core remains reserved');
assert.equal(placementAreaValid([[0, 0], [0, 1]], 1, 4, 5, 7, unlocked, reserved), false, 'locked cells reject the whole shape');
assert.equal(placementAreaValid([[0, 0], [1, 0]], 4, 2, 5, 7, unlocked, reserved), false, 'out-of-bounds shapes are rejected');

const placed = [
    { uid: 1, row: 2, col: 3, shape: [[0, 0]] },
    { uid: 2, row: 1, col: 2, shape: [[0, 0], [1, 0]] },
    { uid: 3, row: 1, col: 4, shape: [[0, 0], [1, 0]] },
    { uid: 4, row: 3, col: 2, shape: [[0, 0], [0, 1]] },
];

assert.deepEqual(displacedPlacementUids(placed, 99, [[0, 0]], 1, 2), [2], 'an occupied target evicts the old gear');
assert.deepEqual(displacedPlacementUids(placed, 99, [[0, 0], [0, 1], [0, 2]], 1, 2), [2, 3], 'one placement can evict multiple whole gears');
assert.deepEqual(displacedPlacementUids(placed, 2, [[0, 0], [1, 0]], 2, 2), [4], 'moving gear ignores its old footprint and evicts the new overlap');
assert.deepEqual(displacedPlacementUids(placed, 99, [[0, 0]], 3, 4), [], 'empty targets do not evict anything');

const singleRow = candidateTrayLayout([
    { rows: 1, columns: 3 },
    { rows: 1, columns: 2 },
    { rows: 1, columns: 2 },
], 100, 12, 730);
assert.deepEqual(singleRow.map((item) => item.scale), [1, 1, 1], 'candidate and grid pieces keep the same visual scale');
assert.deepEqual(singleRow.map((item) => item.row), [0, 0, 0], 'the widest normal three-piece batch fits one row');
assert.ok(singleRow[0].x - 50 >= -365 && singleRow[2].x + 150 <= 365, 'the full-size row remains inside the 730-pixel tray');

const wrapped = candidateTrayLayout([
    { rows: 3, columns: 1 },
    { rows: 1, columns: 3 },
    { rows: 2, columns: 2 },
    { rows: 1, columns: 2 },
], 100, 12, 730);
assert.deepEqual(wrapped.map((item) => item.scale), [1, 1, 1, 1], 'overflow wraps instead of shrinking returned pieces');
assert.deepEqual(wrapped.map((item) => item.row), [0, 0, 0, 1]);
assert.ok(wrapped[0].y > wrapped[3].y, 'wrapped rows have separate vertical centers');

assert.deepEqual(bagLikeGearLevelColor(1), [55, 138, 74], 'level 1 uses the original green gear color');
assert.deepEqual(bagLikeGearLevelColor(2), [62, 111, 212], 'level 2 uses the original blue gear color');
assert.deepEqual(bagLikeGearLevelColor(3), [129, 64, 203], 'level 3 uses the original purple gear color');
assert.deepEqual(bagLikeGearLevelColor(4), [203, 155, 64], 'level 4 uses the original gold gear color');
assert.deepEqual(bagLikeGearLevelColor(5), [255, 99, 99], 'level 5 uses the original red gear color');
assert.equal(bagLikeGearLevelColor(6), null, 'unknown levels do not invent a tint');
assert.deepEqual(bagLikeGearBodyColor(1, [225, 84, 64]), [55, 138, 74], 'level 1 overrides a warrior-family red tint');
assert.deepEqual(bagLikeGearBodyColor(2, [214, 110, 66]), [62, 111, 212], 'level 2 overrides a cannon-family orange tint');
assert.deepEqual(bagLikeGearBodyColor(undefined, [255, 193, 52]), [255, 193, 52], 'the unlevelled power core keeps its own tint');

console.log('baglike preparation placement: 24 assertions passed');
