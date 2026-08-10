import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildNormalLevelRuntimeConfig } from '../assets/scripts/NormalLevelRuntime.ts';

const table = JSON.parse(fs.readFileSync(new URL('../assets/resources/data/normal-levels.json', import.meta.url), 'utf8'));
const supportedModels = new Set(['M02', 'M03', 'M07', 'Boss02', 'Boss03', 'Boss07']);
const runtimeFor = (levelId) => buildNormalLevelRuntimeConfig(table, levelId, supportedModels);

const level1002 = runtimeFor(1002);
assert.equal(level1002.level.name, '密林深处');
assert.equal(level1002.backgroundId, 'fightscene_01');
assert.equal(level1002.rounds.length, 8);
assert.deepEqual(level1002.preparation.staticBatches, [
    ['H1301', 'H1201', 'H0101'],
    ['H1301', 'H0201', 'C01'],
    ['H1302', 'H0401', 'G02'],
]);
assert.deepEqual(level1002.preparation.roundCoinRewards, Array(8).fill(10));
assert.deepEqual(level1002.rounds.at(-1).monsters.at(-1), 'Boss02');

const level1003 = runtimeFor(1003);
assert.equal(level1003.level.name, '荒漠边缘');
assert.equal(level1003.backgroundId, 'fightscene_03');
assert.equal(level1003.rounds.length, 10);
assert.deepEqual(level1003.preparation.staticBatches, [
    ['H0301', 'H1201', 'C01'],
    ['H0301', 'H0401', 'C01'],
    ['H0302', 'H1301', 'G02'],
]);
assert.deepEqual(level1003.preparation.roundCoinRewards, Array(10).fill(10));
assert.deepEqual(level1003.rounds[4].monsters.at(-1), 'Boss02');
assert.deepEqual(level1003.rounds.at(-1).monsters.at(-1), 'Boss07');

for (const runtime of [level1002, level1003]) {
    for (const round of runtime.rounds) {
        assert.equal(round.times.length, round.monsters.length, `round ${round.id} schedule aligns`);
        assert.ok(round.times.every((time, index) => index === 0 || time >= round.times[index - 1]), `round ${round.id} schedule is ordered`);
        assert.ok(round.monsters.every((id) => supportedModels.has(id)), `round ${round.id} uses implemented enemies`);
    }
}

assert.throws(() => runtimeFor(9999), /不存在/, 'unknown levels fail closed');
assert.throws(
    () => buildNormalLevelRuntimeConfig(table, 1003, new Set(['M02', 'M03', 'Boss02', 'Boss07'])),
    /未恢复单位 M07/,
    'a missing enemy implementation blocks the whole candidate level',
);

const malformedTable = structuredClone(table);
malformedTable.rounds['100201'].monsterTimes.pop();
assert.throws(
    () => buildNormalLevelRuntimeConfig(malformedTable, 1002, supportedModels),
    /刷怪时间与单位数量不一致/,
    'malformed schedules fail before the Cocos battle starts',
);

console.log('candidate level runtime: 71 assertions passed');
