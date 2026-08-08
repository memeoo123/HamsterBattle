import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(projectRoot, 'assets/scripts/CangshuGame.ts'), 'utf8');
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

check(
    sha256(resolve(projectRoot, 'assets/resources/original/js_sheshou_zidan.png')),
    'c6d99066f49548c87b38bc664753c994e45bcb36845ac95b3303343675541371',
    'H29_S1 uses the recovered original projectile texture',
);
check(/resources\.load\('original\/js_sheshou_zidan\/spriteFrame'/.test(source), true, 'the recovered texture is preloaded');
check(/rect: new Rect\(1, 1, 72, 48\)/.test(source), true, 'projectile crop matches the packed import');
check(/makeNode\('H29_S1',[\s\S]*?72, 48\)/.test(source), true, 'projectile uses its original model id and dimensions');
check(
    /private addH02Projectile[\s\S]*?setAnchorPoint\(0\.5, 0\.2\)[\s\S]*?node\.setScale\(-1, 1, 1\)[\s\S]*?private preloadH0204Projectile/.test(source),
    true,
    'anchor and horizontal flip match ModelConfig',
);
check(/this\.addH02Projectile\(unit\.x, unit\.y, splitTarget\.x, splitTarget\.y, splitTravelTime\)/.test(source), true, 'split shot launches H29_S1');
check(/this\.addH02Projectile\(fromX, fromY, impactX, impactY, travelTime\)/.test(source), true, 'each barrage shot launches H29_S1');
check(/if \(unit\.cfg\.id === 'H0201' && travelTime > 0\)/.test(source), true, 'H02 primary attacks select a recovered projectile');
check(/if \(unit\.cfg\.productionSkillId === 2002\)[\s\S]*?addH0204Projectile[\s\S]*?else[\s\S]*?addH02Projectile/.test(source), true, 'skill 2002 keeps the basketball while lower levels use H29_S1');
check(/\['H09', 'H0201', 'H0301', 'H07', 'H08', 'H1201', 'H1301'\]\.indexOf\(hit\.attacker\.cfg\.id\) < 0/.test(source), true, 'the placeholder line is disabled for recovered projectile families');
check(/addH02Projectile\(unit\.x, unit\.y, impactX, impactY, travelTime, behaviorDelay\)/.test(source), true, 'primary projectile visibility starts at the recovered behavior delay');
check(/node\.active = delay <= 0[\s\S]*?visual\.delay -= dt[\s\S]*?visual\.node\.active = true/.test(source), true, 'delayed projectile nodes stay hidden until launch');

console.log(`H02 recovered projectile: ${assertions} assertions passed`);
