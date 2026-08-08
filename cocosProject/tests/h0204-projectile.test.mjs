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
    sha256(resolve(projectRoot, 'assets/resources/original/js_sheshou_lanqiu.png')),
    '7bacf2cbf4fef931996b604691015369d0677469ce3b82637bf48a358631d942',
    'H29_S2 uses the recovered original basketball texture',
);
check(/resources\.load\('original\/js_sheshou_lanqiu\/spriteFrame'/.test(source), true, 'the recovered texture is preloaded as a SpriteFrame');
check(/rect: new Rect\(1, 1, 41, 41\)/.test(source), true, 'projectile crop matches the packed import');
check(/originalSize: new Size\(43, 43\)/.test(source), true, 'projectile keeps the recovered source size');
check(/makeNode\('H29_S2',[\s\S]*?43, 43\)/.test(source), true, 'projectile uses its original model id and size');
check(
    /private addH0204Projectile[\s\S]*?setAnchorPoint\(0\.5, 0\.2\)[\s\S]*?private preloadH0905Effects/.test(source),
    true,
    'H0204 projectile anchor matches ModelConfig',
);
check(/unit\.cfg\.productionSkillId === 2002/.test(source), true, 'only H0204 skill 2002 selects the distinct projectile');
check(/this\.addH0204Projectile\(unit\.x, unit\.y, impactX, impactY, travelTime, behaviorDelay\)/.test(source), true, 'H0204 launches the recovered projectile at its behavior frame');

console.log(`H0204 recovered projectile: ${assertions} assertions passed`);
