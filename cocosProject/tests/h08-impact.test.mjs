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
    sha256(resolve(projectRoot, 'assets/resources/original/js_aoteman_hill.png')),
    '64370d93aa4d70ec5785bf2051bc627bb54781951b4a53f897c63aa095b7e600',
    'H21_S1_LOWER uses the recovered original impact sheet',
);
check(/resources\.load\('original\/js_aoteman_hill\/spriteFrame'/.test(source), true, 'impact texture is preloaded');
for (const rect of [
    '967, 1, 108, 151',
    '595, 1, 168, 175',
    '765, 1, 200, 173',
    '1, 1, 196, 193',
    '199, 1, 196, 181',
    '397, 1, 196, 175',
]) {
    check(source.includes(`new Rect(${rect})`), true, `packed frame ${rect} is preserved`);
}
check(/originalSize: new Size\(202, 201\)/.test(source), true, 'all frames keep the recovered source size');
check(/makeNode\('H21_S1_LOWER',[\s\S]*?setAnchorPoint\(0\.5, 0\.5\)[\s\S]*?setScale\(1\.5, 1\.5, 1\)/.test(source), true, 'model id, anchor and scale match ModelConfig');
check(/if \(hit\.attacker\.cfg\.id === 'H08'\) this\.addH08Impact\(centerX, centerY\)/.test(source), true, 'only H08 creates this impact effect');
check(/frameSeconds: INFERRED_EFFECT_FRAME_SECONDS/.test(source), true, 'the inferred playback rate is explicit per effect');
check(/Math\.floor\(visual\.elapsed \/ visual\.frameSeconds\)/.test(source), true, 'effect playback uses its recorded frame interval');
check(/visual\.frames\.length \* visual\.frameSeconds/.test(source), true, 'effect cleanup uses its own total duration');

console.log(`H08 recovered impact: ${assertions} assertions passed`);
