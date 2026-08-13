import assert from 'node:assert/strict';
import {
    BAGLIKE_LEVEL5_FUSIONS,
    bagLikeFusionMissingRequirements,
    bagLikeFusionRecipe,
    newlyUnlockedBagLikeFusions,
    resolveBagLikeFusion,
} from '../assets/scripts/BagLikeFusion.ts';

assert.equal(BAGLIKE_LEVEL5_FUSIONS.length, 6, 'all recovered level-5 recipes are represented');
assert.equal(resolveBagLikeFusion('H0104', 'H0204', { H01: 2, H02: 2 }), 'H0705');
assert.equal(resolveBagLikeFusion('H0204', 'H0104', { H01: 2, H02: 2 }), 'H0705', 'material order is bidirectional');
assert.equal(resolveBagLikeFusion('H0104', 'H0204', { H01: 2, H02: 1 }), null, 'every star gate is required');
assert.equal(resolveBagLikeFusion('H0304', 'H1204', { H03: 3, H12: 3 }), 'H0805');
assert.equal(resolveBagLikeFusion('H0404', 'H1304', { H04: 5, H13: 5 }), 'H0905');
assert.equal(resolveBagLikeFusion('H0504', 'H0604', { H05: 5, H06: 5 }), 'H1005');
assert.equal(resolveBagLikeFusion('H1404', 'C04', { H14: 5 }), 'H1505');
assert.equal(resolveBagLikeFusion('H1604', 'H1704', { H16: 5, H17: 5 }), 'H1805');
assert.equal(bagLikeFusionRecipe('H0104', 'H0304'), null, 'unconfigured pairs never invent a fusion');
assert.deepEqual(
    bagLikeFusionMissingRequirements(BAGLIKE_LEVEL5_FUSIONS[0], { H01: 2, H02: 1 }),
    { H02: 2 },
    'the UI can explain exactly which hero star still blocks a fusion',
);
assert.deepEqual(
    newlyUnlockedBagLikeFusions(
        { H01: 1, H02: 2, H03: 1, H12: 1 },
        { H01: 2, H02: 2, H03: 1, H12: 1 },
    ).map((recipe) => recipe.resultId),
    ['H0705'],
    'raising the final required hero star reports the newly unlocked fusion',
);

console.log('baglike level-5 fusion: 12 assertions passed');
