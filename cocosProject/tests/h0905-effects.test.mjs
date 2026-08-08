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
    sha256(resolve(projectRoot, 'assets/resources/original/js_zhanche_dandao.png')),
    'f8c31ba4f5ac55df9c5f184a5f9546a8a86e9c9b53429b853324ad18fc655f29',
    'H24_S1 uses the recovered projectile sheet',
);
check(
    sha256(resolve(projectRoot, 'assets/resources/original/js_zhanche_hill.png')),
    'bbd883f28f6545012c1215fc62ad053c8bcdb0705ce7590fbf9d9ff05d57f534',
    'H24_S1_LOWER uses the recovered hit sheet',
);
check(
    sha256(resolve(projectRoot, 'assets/resources/original/bullet_zhanche.mp3')),
    'daecb612e72bcaf0914832d0a1220aa8f1e67a8e0f2c301eff4fb9f09227e631',
    'H0905 uses the recovered bullet_zhanche clip',
);
check(/rect: new Rect\(1, 1, 109, 20\)/.test(source), true, 'projectile crop matches packed import');
check(/node\.setScale\(0\.7, 0\.7, 1\)/.test(source), true, 'projectile scale matches ModelConfig');
check(/setAnchorPoint\(0\.5, 0\.2\)/.test(source), true, 'projectile anchor matches ModelConfig');
check(/new Rect\(1, 1, 106, 76\)/.test(source), true, 'impact frame 0 matches packed import');
check(/new Rect\(1, 195, 92, 110\)/.test(source), true, 'impact frame 1 matches packed import');
check(/new Rect\(1, 79, 92, 114\)/.test(source), true, 'impact frame 2 matches packed import');
check(/setAnchorPoint\(0\.4, 0\.3\)/.test(source), true, 'impact anchor matches ModelConfig');
check(/this\.addH0905Projectile\(unit\.x, unit\.y, impactX, impactY, travelTime, behaviorDelay\)/.test(source), true, 'initial hit launches the recovered projectile at its behavior frame');
check(/this\.addH0905Projectile\(\s*fromX,\s*fromY,\s*impactX,\s*impactY,/s.test(source), true, 'bounce hits launch a new recovered projectile segment');
check(/this\.addH0905Impact\(centerX, centerY\)/.test(source), true, 'each H0905 impact creates its recovered effect');
check(/playOneShot\(this\.h0905HitAudio, 1\)/.test(source), true, 'each impact plays bullet_zhanche');
check(/\['H09', 'H0201', 'H0301', 'H07', 'H08', 'H1201', 'H1301'\]\.indexOf\(hit\.attacker\.cfg\.id\) < 0/.test(source), true, 'the placeholder line trace is disabled for recovered effect families');

console.log(`H0905 recovered effects: ${assertions} assertions passed`);
