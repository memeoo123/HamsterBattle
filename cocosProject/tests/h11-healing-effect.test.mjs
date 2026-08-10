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

const assetRoot = resolve(projectRoot, 'assets/resources/spine/H11Healing');
const sha256Atlas = (path) => createHash('sha256').update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n')).digest('hex');
check(sha256Atlas(resolve(assetRoot, 'skill01_hit_upper.atlas')), 'c124db32e7bc67ac0cae32bb4914d0b2a24b42c9e05fd9e9887f77dd5e6a0c72', 'recovered atlas is exact');
check(sha256(resolve(assetRoot, 'skill01_hit_upper.png')), '941e69fea0ec22c20564f031cf0752254c6484ae6413a78b8ff32e690a01dee4', 'recovered texture is exact');
check(sha256(resolve(assetRoot, 'skill01_hit_upper.skel')), 'dd9667ee402a66d15e08a35c5695e5eff41d097c0d327785c34c4cc13ae16933', 'recovered skeleton is exact');
check(source.includes("resources.load('spine/H11Healing/skill01_hit_upper', sp.SkeletonData"), true, 'H11 healing Spine is preloaded');
check(/makeNode\('H11_S1',[\s\S]*?setAnimation\(0, 'skill01_hit_upper', false\)/.test(source), true, 'ModelConfig id and non-loop action are bound');
check(/setCompleteListener\(\(\) => \{[\s\S]*?node\.destroy\(\)/.test(source), true, 'effect node is removed on animation completion');
check(/this\.addH11HealingEffect\(unit\.x, unit\.y\)/.test(source), true, 'selected healed unit receives the recovered effect');

console.log(`H11 recovered healing effect: ${assertions} assertions passed`);
