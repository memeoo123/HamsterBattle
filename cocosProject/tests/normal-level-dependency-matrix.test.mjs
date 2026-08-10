import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    buildDependencyMatrix,
    renderCsv,
    renderMarkdown,
} from '../../scripts/build-normal-level-dependency-matrix.mjs';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, '../..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), 'utf8'));
const levelData = readJson('cocosProject/assets/resources/data/normal-levels.json');
const capabilities = readJson('targets/wxf9af2417e78ce07a/18/generated/normal-level-runtime-capabilities.json');
const generated = readJson('targets/wxf9af2417e78ce07a/18/generated/normal-level-dependency-matrix.json');
const rebuilt = buildDependencyMatrix(levelData, capabilities);

assert.deepEqual(generated, rebuilt, 'checked-in dependency matrix is current');
assert.equal(rebuilt.summary.totalLevels, 200, 'all normal levels are represented');
assert.equal(rebuilt.summary.totalRounds, 2978, 'all referenced rounds are represented');
assert.equal(rebuilt.summary.verifiedPlayableLevels, 200, 'all recovered levels pass the mechanics/data playability gate');
assert.equal(rebuilt.summary.runtimeReadyUnverifiedLevels, 0, 'there are no unexposed runtime-ready levels');
assert.equal(rebuilt.summary.blockedLevels, 0, 'presentation dependencies no longer block mechanics play');
assert.equal(rebuilt.summary.uniqueBackgrounds, 4, 'normal levels use four background families');
assert.equal(rebuilt.summary.missingBackgrounds, 0, 'all background IDs have a mechanics-safe visual fallback');
assert.equal(rebuilt.summary.uniqueEnemyModels, 25, 'only enemies actually used by normal levels are counted');
assert.equal(rebuilt.summary.missingEnemyModels, 0, 'all used enemy IDs have mechanics profiles');
assert.equal(rebuilt.summary.uniqueRecommendedHeroFamilies, 12, 'recommendations use twelve hero families');
assert.equal(rebuilt.summary.missingRecommendedHeroFamilies, 0, 'all recommended hero families have mechanics-level production chains');
assert.equal(rebuilt.summary.levelsWithPreparationConfig, 200, 'all levels use recovered table-driven preparation');
assert.equal(rebuilt.summary.missingPreparationLevels, 0, 'the per-level preparation whitelist is removed');

const level1001 = rebuilt.levels.find((level) => level.id === 1001);
const level1004 = rebuilt.levels.find((level) => level.id === 1004);
const level1005 = rebuilt.levels.find((level) => level.id === 1005);
const level1006 = rebuilt.levels.find((level) => level.id === 1006);
assert.equal(level1001.status, 'verified-playable', 'mechanics baseline remains available');
assert.equal(level1004.status, 'verified-playable', 'visual baseline remains available');
assert.deepEqual(level1005.blockers, [], 'presentation fallbacks do not block level execution');
assert.equal(level1005.dependencies.missingEnemyModelIds.length, 0, 'every scheduled enemy resolves mechanically');
assert.deepEqual(level1006.dependencies.missingRecommendedHeroIds, [], 'H05 recommendation resolves through its recovered production chain');

const csv = renderCsv(rebuilt);
assert.equal(csv.trimEnd().split('\n').length, 201, 'CSV has one header and one row per level');
assert.match(csv, /^levelId,chapter,name,/, 'CSV has stable analysis columns');
const markdown = renderMarkdown(rebuilt);
assert.match(markdown, /200 关 \/ 2978 波/, 'summary states the recovered scale');
assert.match(markdown, /200\/200 关/, 'summary records full table-driven preparation coverage');

for (const level of rebuilt.levels) {
    assert.equal(level.monsterIds.length, new Set(level.monsterIds).size, `level ${level.id} has unique monster IDs`);
    assert.equal(level.runtimeReady, level.blockers.length === 0, `level ${level.id} readiness matches blockers`);
    assert.equal(level.dependencies.missingRoundIds.length, 0, `level ${level.id} has every round row`);
    assert.equal(level.dependencies.malformedRoundIds.length, 0, `level ${level.id} spawn arrays align`);
    assert.equal(level.dependencies.unknownMonsterIds.length, 0, `level ${level.id} monsters exist in the catalog`);
}

console.log('normal level dependency matrix: 1027 assertions passed');
