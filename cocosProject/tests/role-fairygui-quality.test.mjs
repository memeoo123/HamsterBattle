import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const project = new URL('../', import.meta.url);
const repo = new URL('../../', import.meta.url);
const layoutPath = new URL(
  'targets/wxf9af2417e78ce07a/18/evidence/assets/original/post-unlock-cache-2026-08-18/ui_hero.layout.json',
  repo,
);
const qualityPath = new URL('assets/resources/data/image-quality-frames.json', project);
const source = readFileSync(new URL('assets/scripts/CangshuGame.ts', project), 'utf8');
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

assert.equal(sha256(layoutPath), '6119df8c71191097729bb6e0567342833c9a73f86dc864836569f6b8988210b2');
const layout = JSON.parse(readFileSync(layoutPath, 'utf8'));
assert.equal(layout.packageName, 'hero');
assert.equal(layout.parsedComponentCount, 12);

const component = (name) => layout.components.find((entry) => entry.name === name);
const child = (owner, name) => component(owner).scannedChildren.find((entry) => entry.name === name);
assert.deepEqual([component('HeroMainView').width, component('HeroMainView').height], [750, 1334]);
assert.equal(component('HeroMainView').scannedChildren.length, 6);
assert.deepEqual(
  ['bg', 'top_bg', 'listHero', 'gMenu'].map((name) => {
    const item = child('HeroMainView', name);
    return [name, item.x, item.y, item.width, item.height];
  }),
  [
    ['bg', 0, -146, 750, 1626],
    ['top_bg', 0, -380, 750, 320],
    ['listHero', 31, 200, 698, 1000],
    ['gMenu', 534, 105, 190, 80],
  ],
);
assert.deepEqual([component('HeroItem').width, component('HeroItem').height], [226, 326]);
assert.equal(component('HeroItem').scannedChildren.length, 11);
assert.deepEqual(
  ['bgLoader', 'iconLoader', 'lvLoader', 'fragmentBar', 'lbLv', 'lbName'].map((name) => {
    const item = child('HeroItem', name);
    return [name, item.x, item.y, item.width, item.height];
  }),
  [
    ['bgLoader', 0, 4, 216, 322],
    ['iconLoader', 108, 129, 130, 130],
    ['lvLoader', 14, 231, 188, 40],
    ['fragmentBar', 14, 277, 188, 28],
    ['lbLv', 108, 251, 80, 34],
    ['lbName', 107, 42, 107, 36],
  ],
);
assert.equal(component('HeroInfoView').scannedChildren.length, 16);
assert.deepEqual(
  (({ x, y, width, height }) => [x, y, width, height])(child('HeroInfoView', 'aniComp')),
  [374, 341, 708, 380],
);

const quality = JSON.parse(readFileSync(qualityPath, 'utf8'));
assert.equal(quality.logicalPath, 'image/quality');
assert.equal(quality.atlasUuid, '95uJP+j/9NzKUIVSSxFJVN');
assert.equal(quality.frameCount, 42);
const frame = (name) => quality.frames.find((entry) => entry.name === name);
assert.deepEqual(frame('blue_hero_frame').rect, { x: 1, y: 1, width: 216, height: 284 });
assert.deepEqual(frame('purple_hero_frame').rect, { x: 873, y: 1, width: 216, height: 283 });
assert.deepEqual(frame('blue_hero_lv').rect, { x: 1509, y: 373, width: 38, height: 40 });
assert.deepEqual(frame('purple_hero_shape').rect, { x: 1337, y: 349, width: 58, height: 58 });

assert.match(source, /columns: 3, columnGap: 10, lineGap: 18/);
assert.match(source, /buildFairyGuiPowerRoleItem\(root, role, x, y, roleUnlocked\)/);
assert.match(source, /role\.quality === 3 \? 3 : 4/);
assert.match(source, /original\/post-unlock\/image_quality\/spriteFrame/);
assert.match(source, /RecoveredPowerRoleUpgradeGlow', parent, -1, 326, 708, 380/);

console.log('role FairyGUI geometry and image_quality atlas: exact evidence and runtime bindings passed');
