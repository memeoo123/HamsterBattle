import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ads from '../assets/scripts/MockAdvertisement.ts';

const today = new Date(2026, 7, 11, 12, 0, 0);
const tomorrow = new Date(2026, 7, 12, 12, 0, 0);

assert.equal(ads.mockAdvertisementOutcomeFromSearch(''), 'completed');
assert.equal(ads.mockAdvertisementOutcomeFromSearch('?mockAd=success'), 'completed');
assert.equal(ads.mockAdvertisementOutcomeFromSearch('?level=1004&mockAd=cancel'), 'cancelled');
assert.equal(ads.mockAdvertisementOutcomeFromSearch('?mockAd=fail'), 'failed');

let state = ads.createMockAdvertisementState(today);
state = ads.completeMockAdvertisement(state, 'battle-refresh', today);
assert.equal(state.totalCompleted, 1);
assert.equal(state.todayCompleted, 1);
assert.equal(ads.mockAdvertisementPlacementCount(state, 'battle-refresh', today), 1);

for (let index = 0; index < 3; index += 1) {
    state = ads.completeMockAdvertisement(state, 'shop-energy', today);
}
assert.equal(ads.canClaimMockShopEnergy(state, today), false);

const nextDay = ads.normalizeMockAdvertisementState(state, tomorrow);
assert.equal(nextDay.totalCompleted, 4);
assert.equal(nextDay.todayCompleted, 0);
assert.equal(ads.mockAdvertisementPlacementCount(nextDay, 'shop-energy', tomorrow), 0);
assert.equal(ads.canClaimMockShopEnergy(nextDay, tomorrow), true);

const memory = new Map();
const storage = {
    getItem(key) { return memory.get(key) ?? null; },
    setItem(key, value) { memory.set(key, value); },
};
assert.equal(ads.saveMockAdvertisementState(storage, state), true);
assert.deepEqual(ads.loadMockAdvertisementState(storage, today), state);

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gameSource = fs.readFileSync(path.join(projectDirectory, 'assets', 'scripts', 'CangshuGame.ts'), 'utf8');
for (const placement of ['endless-third', 'battle-refresh', 'trait-reroll', 'trait-take-all', 'shop-energy']) {
    assert.match(gameSource, new RegExp(`playMockAdvertisement\\('${placement}'`));
}
assert.ok(gameSource.indexOf("playMockAdvertisement('endless-third'") < gameSource.indexOf('spendSpecialModeEnergy(this.accountProfile)'));
assert.match(gameSource, /setTimeout\(finish, outcome === 'completed' \? 800 : 550\)/);

console.log('mock-advertisement.test.mjs: all assertions passed');
