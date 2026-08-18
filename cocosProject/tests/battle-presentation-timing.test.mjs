import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const project = new URL('../', import.meta.url);
const repo = new URL('../../', import.meta.url);
const source = readFileSync(new URL('assets/scripts/CangshuGame.ts', project), 'utf8');
const manifest = JSON.parse(readFileSync(
  new URL('targets/wxf9af2417e78ce07a/18/evidence/assets/original/presentation-cache-2026-08-18/manifest.json', repo),
  'utf8',
));
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

assert.equal(manifest.entries.length, 2);
assert.equal(manifest.entries[0].id, 'UI10025');
assert.equal(manifest.entries[1].id, 'UI10026');
assert.equal(manifest.entries[0].mappingConfidence, 'inferred-by-cache-request-order');
assert.equal(manifest.entries[1].mappingConfidence, 'inferred-by-cache-request-order');
assert.equal(
  sha256(new URL('assets/resources/spine/PreparationGlowSg1/zhandou_sg1.skel', project)),
  manifest.entries[0].skeletonHash,
);
assert.equal(
  sha256(new URL('assets/resources/spine/PreparationGlowSg2/zhandou_sg2.skel', project)),
  manifest.entries[1].skeletonHash,
);
assert.equal(
  sha256(new URL('assets/resources/spine/PreparationGlowSg1/zhandou_sg1.png', project)),
  manifest.textureHash,
);
assert.equal(
  sha256(new URL('assets/resources/spine/PreparationGlowSg2/zhandou_sg2.png', project)),
  manifest.textureHash,
);
assert.match(source, /spine\/PreparationGlowSg1\/zhandou_sg1[\s\S]*?GridRewardGlow_UI10025/);
assert.match(source, /spine\/PreparationGlowSg2\/zhandou_sg2[\s\S]*?AdRefreshGlow_UI10026/);
assert.match(source, /spine\/PreparationGlowSg2\/zhandou_sg2[\s\S]*?RefreshGlow_UI10026/);
assert.match(source, /setAnimation\(0, 'idle', true\)/);

const resultTiming = source.slice(
  source.indexOf('private revealResultActionsAfterSourceDelay'),
  source.indexOf('private clearUnits'),
);
assert.match(resultTiming, /this\.resultActionsLayer\.active = false/);
assert.match(resultTiming, /this\.scheduleOnce\([\s\S]*?0\.3\)/);
assert.match(resultTiming, /this\.resultActionsLayer\.active = true/);
assert.match(resultTiming, /revealResultActionsAfterSourceDelay\(won && this\.levelId < BAGLIKE_LAST_LEVEL_ID\)/);
assert.match(resultTiming, /revealResultActionsAfterSourceDelay\(false\)/);

const loadRows = (path) => {
  const text = readFileSync(new URL(path, repo), 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(text).rows;
};
const buffGroups = loadRows('reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.BuffGroupConfig.json');
for (const id of ['4001_bf3', '4001_bf4', 'LY_bf1202', 'LY_bf1203']) {
  const row = buffGroups.find((entry) => entry.id === id);
  assert.ok(row, `${id} exists`);
  assert.equal(row.modelId, null, `${id} has no source-configured status model`);
  assert.equal(row.modelId2, null, `${id} has no secondary source-configured status model`);
}

console.log('battle presentation: recovered gear glows, exact result reveal delay, and no invented status models passed');
