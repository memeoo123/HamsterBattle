import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(projectRoot, 'assets/scripts/CangshuGame.ts'), 'utf8');
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const sha256NormalizedText = (path) => createHash('sha256')
    .update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n'))
    .digest('hex');
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
check(
    sha256(resolve(projectRoot, 'assets/resources/spine/H13Impact/baomihua_hill.skel')),
    '5332a7bc3e8f2e3306daf859b13c93dda6a9b30c4dd172a24a243b74cc076b3d',
    'H13_S1_LOWER uses the recovered original skeleton',
);
check(
    sha256NormalizedText(resolve(projectRoot, 'assets/resources/spine/H13Impact/baomihua_hill.atlas')),
    '5fb727f2a8ba4c5697c9c53a0dc3aa12408ec682763c438eeeae8d63463697e1',
    'H13_S1_LOWER uses the recovered original atlas',
);
check(
    sha256(resolve(projectRoot, 'assets/resources/spine/H13Impact/baomihua_hill.png')),
    'f8a3259565f55b2584ac52b3c96b03984ce11922302355bbbd9e5cc873cfaa5a',
    'H13_S1_LOWER uses the recovered original texture',
);
check(/resources\.load\('original\/baomihuali\/spriteFrame'/.test(source), true, 'projectile texture is preloaded');
check(/new Rect\(1, 1, 24, 27\)/.test(source), true, 'packed frame rect is preserved');
check(/originalSize: new Size\(24, 27\)/.test(source), true, 'packed original size is preserved');
check(/makeNode\('H25_S1',[\s\S]*?setAnchorPoint\(0\.5, 0\.5\)[\s\S]*?setScale\(1\.5, 1\.5, 1\)/.test(source), true, 'model id, anchor and scale match ModelConfig');
check(/unit\.cfg\.id === 'H1301'[\s\S]*?addH13Projectile\(unit\.x, unit\.y, impactX, impactY, travelTime, behaviorDelay\)/.test(source), true, 'initial H13 shot uses the recovered projectile');
check(/hit\.attacker\.cfg\.id === 'H1301'[\s\S]*?this\.addH13Projectile\(\s*fromX,\s*fromY,\s*impactX,\s*impactY,/s.test(source), true, 'each H13 bounce uses the recovered projectile');
check(/\['H09', 'H0201', 'H0301', 'H07', 'H08', 'H1201', 'H1301'\]/.test(source), true, 'placeholder trace is disabled for recovered tower effects');
check(/resources\.load\('spine\/H13Impact\/baomihua_hill', sp\.SkeletonData/.test(source), true, 'impact skeleton is preloaded');
check(/makeNode\('BackgroundEffects',[\s\S]*?makeNode\('Units'/.test(source), true, 'low impact layer is created below the role layer');
check(/makeNode\('H13_S1_LOWER',[\s\S]*?setAnimation\(0, 'pskill01', false\)/.test(source), true, 'impact uses the recovered model id and action');
check(/hit\.attacker\.cfg\.id === 'H1301'\) this\.addH13Impact\(centerX, centerY\)/.test(source), true, 'each H13 impact is emitted on the damage behavior frame');

console.log(`H13 recovered projectile and impact: ${assertions} assertions passed`);
