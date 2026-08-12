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
    sha256(resolve(projectRoot, 'assets/resources/original/js_gangtiexia_hill_baozha.png')),
    '0bc5a812846bd217993e2cb46977a52ae63ccc999981edd534e46999b1d5f485',
    'H22_S1_LOWER uses the recovered original impact sheet',
);
check(/resources\.load\('original\/js_gangtiexia_hill_baozha\/spriteFrame'/.test(source), true, 'impact texture is preloaded');
for (const rect of [
    '6, 1, 58, 50',
    '1, 65, 106, 84',
    '1, 239, 110, 110',
    '1, 151, 112, 86',
    '66, 1, 32, 62',
    '1, 1, 3, 3',
]) {
    check(source.includes(`new Rect(${rect})`), true, `packed frame ${rect} is preserved`);
}
check(/originalSize: new Size\(186, 186\)/.test(source), true, 'all frames keep the recovered source size');
check(/makeNode\('H22_S1_LOWER',[\s\S]*?setAnchorPoint\(0\.3, 0\.2\)[\s\S]*?setScale\(0\.8, 0\.8, 1\)/.test(source), true, 'model id, anchor and scale match ModelConfig');
check(/if \(hit\.attacker\.cfg\.id === 'H07'\) this\.addH0705Impact\(centerX, centerY\)/.test(source), true, 'only H0705 creates this impact effect');
check(/\['H09', 'H0201', 'H0301', 'H07', 'H08', 'H1201', 'H1301'\]/.test(source), true, 'the placeholder trace is disabled for the recovered effect families');
check(/const ORIGINAL_EFFECT_FRAME_SECONDS = 0\.0666/.test(source), true, 'FrameAnim exact 66.6ms interval is preserved');
check(/frameSeconds: ORIGINAL_EFFECT_FRAME_SECONDS/.test(source), true, 'the recovered playback rate remains explicit');

console.log(`H0705 recovered impact: ${assertions} assertions passed`);
