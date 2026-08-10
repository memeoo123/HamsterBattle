import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportNormalLevelRuntimeData } from '../../scripts/export-normal-level-runtime-data.mjs';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, '../..');
const decodedDirectory = path.join(projectRoot, 'reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), 'utf8'));
const rebuilt = exportNormalLevelRuntimeData(decodedDirectory);
const cocosCopy = readJson('cocosProject/assets/resources/data/normal-levels.json');
const webCopy = readJson('normal-level-game/public/data/normal-levels.json');

assert.deepEqual(cocosCopy, rebuilt, 'Cocos runtime data is reproducible from decoded tables');
assert.deepEqual(webCopy, rebuilt, 'web data copy is identical to the Cocos runtime data');
assert.equal(rebuilt.version, 2, 'schema version records preparation fields');
assert.equal(rebuilt.levelCount, 200, 'all normal levels are exported');
assert.equal(rebuilt.roundCount, 2978, 'all referenced normal rounds are exported');

for (const level of rebuilt.levels) {
    assert.ok(Object.hasOwn(level, 'initRewards'), `level ${level.id} exports initRewards`);
    assert.ok(Object.hasOwn(level, 'staticBricks'), `level ${level.id} exports staticBricks`);
    for (const roundId of level.roundIds) {
        assert.ok(Object.hasOwn(rebuilt.rounds[String(roundId)], 'coinRewards'), `round ${roundId} exports coinRewards`);
    }
}

console.log('normal level export: 3383 assertions passed');
