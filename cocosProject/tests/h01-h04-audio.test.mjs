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
    sha256(resolve(projectRoot, 'assets/resources/original/skill_jijian.mp3')),
    '2d7f6a4b5c5f8ac88095b5a7ffa5c5f604b19d93e53dd83bcbe7cfc300d42cb0',
    'H01 uses the recovered skill_jijian clip',
);
check(
    sha256(resolve(projectRoot, 'assets/resources/original/skill_zhuangji.mp3')),
    '2d0ed4c50a1425561978baeed798a93947ad4e70cae33ecdc9e609af814728a0',
    'H04 uses the recovered skill_zhuangji clip',
);
check(/resources\.load\('original\/skill_jijian', AudioClip/.test(source), true, 'H01 clip is preloaded');
check(/resources\.load\('original\/skill_zhuangji', AudioClip/.test(source), true, 'H04 clip is preloaded');
check(/unit\.cfg\.id === 'H0101'\s*\? this\.h01AttackAudio/.test(source), true, 'H0101 selects skill_jijian');
check(/unit\.cfg\.id === 'H0401'\s*\? this\.h04AttackAudio/.test(source), true, 'H0401 selects skill_zhuangji');
check(/this\.playAnimation\(unit, 'attack', false\);\s*this\.playMeleeAttackAudio\(unit\);/.test(source), true, 'soundDelay zero plays at attack start');
check(/this\.meleeAttackAudioSource\.playOneShot\(clip, 1\)/.test(source), true, 'melee clips use one-shot playback');

console.log(`H01/H04 recovered attack audio: ${assertions} assertions passed`);
