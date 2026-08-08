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
    sha256(resolve(projectRoot, 'assets/resources/original/baomihuali.png')),
    'd07bed52be641cb51affadb75f67ed302598c1b8a3f62e9c6ce046622bc504ed',
    'H25_S1 uses the recovered original projectile image',
);
check(/resources\.load\('original\/baomihuali\/spriteFrame'/.test(source), true, 'projectile texture is preloaded');
check(/new Rect\(1, 1, 24, 27\)/.test(source), true, 'packed frame rect is preserved');
check(/originalSize: new Size\(24, 27\)/.test(source), true, 'packed original size is preserved');
check(/makeNode\('H25_S1',[\s\S]*?setAnchorPoint\(0\.5, 0\.5\)[\s\S]*?setScale\(1\.5, 1\.5, 1\)/.test(source), true, 'model id, anchor and scale match ModelConfig');
check(/unit\.cfg\.id === 'H1301'[\s\S]*?addH13Projectile\(unit\.x, unit\.y, impactX, impactY, travelTime, behaviorDelay\)/.test(source), true, 'initial H13 shot uses the recovered projectile');
check(/hit\.attacker\.cfg\.id === 'H1301'[\s\S]*?this\.addH13Projectile\(\s*fromX,\s*fromY,\s*impactX,\s*impactY,/s.test(source), true, 'each H13 bounce uses the recovered projectile');
check(/\['H09', 'H0201', 'H0301', 'H07', 'H08', 'H1201', 'H1301'\]/.test(source), true, 'placeholder trace is disabled for recovered tower effects');

console.log(`H13 recovered projectile: ${assertions} assertions passed`);
