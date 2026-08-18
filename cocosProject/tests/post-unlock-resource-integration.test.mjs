import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const map = JSON.parse(readFileSync(resolve(project, 'assets/resources/data/post-unlock-resource-map.json'), 'utf8'));
const game = readFileSync(resolve(project, 'assets/scripts/CangshuGame.ts'), 'utf8');
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

assert.equal(map.target.appId, 'wxf9af2417e78ce07a');
assert.equal(map.target.version, '18');
assert.equal(map.copied.length, 24, 'the post-unlock set, exact quality frame map, and P01/P04 Spine variants are integrated');
assert.equal(map.reusedByteIdentical.length, 2, 'shape and effect reuse existing byte-identical project assets');

for (const record of map.copied) {
  const path = resolve(project, record.destination);
  assert.ok(existsSync(path), `${record.destination} exists`);
  if (record.sha256) assert.equal(sha256(path), record.sha256, `${record.destination} keeps its evidence hash`);
}
for (const record of map.reusedByteIdentical) {
  assert.equal(sha256(resolve(project, record.projectPath)), record.sha256, `${record.logicalPath} reuses the exact binary`);
}
for (const folder of ['PowerRoleP01Full', 'PowerRoleP01Card', 'PowerRoleP04', 'PowerRoleP04Full', 'DailySnowScene', 'PowerRoleUpgradeGlow']) {
  const baseName = folder === 'PowerRoleP01Full' || folder === 'PowerRoleP01Card'
    ? 'pao_paopaoshu'
    : folder === 'PowerRoleP04' || folder === 'PowerRoleP04Full'
      ? 'pao_kakaxi'
    : folder === 'DailySnowScene'
      ? 'cj_xuedi'
      : 'chilunpy_shengjishanguang';
  const base = resolve(project, `assets/resources/spine/${folder}/${baseName}`);
  for (const extension of ['.skel', '.atlas', '.png']) {
    assert.ok(existsSync(`${base}${extension}`), `${folder} has ${extension}`);
    assert.ok(existsSync(`${base}${extension}.meta`), `${folder} ${extension} has Creator metadata`);
  }
  assert.match(readFileSync(`${base}.atlas`, 'utf8'), new RegExp(`${baseName}\\.png`), `${folder} atlas references its copied texture`);
}

assert.match(game, /addMenuBackground\(root, 'post-unlock\/bg1'\)/,
  'the role scene consumes the recovered 750x1626 background');
assert.match(game, /spine\/PowerRoleP04\/pao_kakaxi/,
  'the P04 role card consumes the recovered configured power-role model');
assert.match(game, /spine\/PowerRoleP01Card\/pao_paopaoshu/,
  'the P01 role card consumes its recovered configured 0.75 model');
assert.match(game, /model\.setScale\(0\.7, 0\.7, 1\)/,
  'the P01/P04 card models keep ModelConfig.P01L/P04L scale 0.7');
assert.match(game, /spine\/PowerRoleP01Full\/pao_paopaoshu/,
  'the P01 power core consumes its recovered full battle model');
assert.match(game, /spine\/PowerRoleP04Full\/pao_kakaxi/,
  'the P04 power core consumes its recovered full battle model');
assert.match(game, /preloadP04Projectile[\s\S]*?original\/feibiao\/feibiao\/spriteFrame/,
  'the P04 battle skill consumes the recovered shuriken through its imported nested resource path');
assert.match(game, /RecoveredPowerCoreRoleModel_\$\{roleId\}`?, parent, 1, -10, 80, 80/,
  'the full models keep the recovered ModelConfig.P01/P04 offset and height');
assert.match(game, /model\.setScale\(1, 1, 1\)/,
  'the full battlefield models keep ModelConfig.P01/P04 scale 1');
assert.match(game, /this\.attachPowerCoreRoleModel\(hamster, this\.powerRoleState\.equippedRoleId\)/,
  'the central power core routes the equipped role through the recovered battle-model loader');
assert.match(game, /spine\/PowerRoleUpgradeGlow\/chilunpy_shengjishanguang/,
  'successful role upgrades consume the recovered HeroUpAniComp Spine');
assert.match(game, /message\.startsWith\('升星成功'\)[\s\S]*?message\.startsWith\('免费升级成功'\)/,
  'the upgrade glow is restricted to successful star or level upgrades');

console.log('post-unlock resource integration: exact assets, deduplication, and card/core/effect consumers passed');
