import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
    BAGLIKE_COIN_ITEM_ID,
    itemRewardAmount,
    normalLevelPreparationConfig,
} from '../assets/scripts/NormalLevelRuntime.ts';

const table = JSON.parse(fs.readFileSync(new URL('../assets/resources/data/normal-levels.json', import.meta.url), 'utf8'));
const configFor = (levelId) => {
    const level = table.levels.find((row) => row.id === levelId);
    return normalLevelPreparationConfig(level, level.roundIds.map((id) => table.rounds[String(id)]));
};

assert.equal(BAGLIKE_COIN_ITEM_ID, 5, 'battle coin is item 5');
assert.equal(itemRewardAmount(null, 5), 0, 'missing rewards produce zero');
assert.equal(itemRewardAmount([{ k: 5, v: 10 }, { k: '5', v: 15 }, { k: 2, v: 99 }], 5), 25, 'numeric and string keys join exactly');

const level1001 = configFor(1001);
assert.equal(level1001.initialCoin, 0, '1001 starts with its recovered zero battle coin');
assert.equal(level1001.staticBatches.length, 8, '1001 keeps all eight recovered static batches');
assert.deepEqual(level1001.staticBatches[0], ['H0101'], '1001 first tutorial batch comes from the level table');
assert.deepEqual(level1001.roundCoinRewards, [0, 0, 15, 15, 15], '1001 round coin rewards come from round rows');

const level1002 = configFor(1002);
assert.deepEqual(level1002.staticBatches, [
    ['H1301', 'H1201', 'H0101'],
    ['H1301', 'H0201', 'C01'],
    ['H1302', 'H0401', 'G02'],
], '1002 forever-static batches are now available without a code whitelist');

const level1004 = configFor(1004);
assert.equal(level1004.staticBatches.length, 3, '1004 keeps its recovered first-challenge batches');
assert.deepEqual(level1004.roundCoinRewards, [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15, 15, 15], '1004 coin rewards match the recovered table');

const level1018 = configFor(1018);
assert.deepEqual(level1018.staticBatches, [], 'levels without staticBricks use the shared dynamic draw path');
assert.equal(level1018.roundCoinRewards.length, 15, 'dynamic levels still receive every per-round coin reward');

for (const level of table.levels) {
    const config = configFor(level.id);
    assert.equal(config.roundCoinRewards.length, level.roundIds.length, `level ${level.id} has one coin reward entry per round`);
    assert.ok(config.roundCoinRewards.every((value) => Number.isFinite(value) && value >= 0), `level ${level.id} coin rewards are valid`);
}

console.log('normal level preparation: 411 assertions passed');
