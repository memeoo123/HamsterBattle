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
    sha256(resolve(projectRoot, 'assets/resources/original/skill_jiguang.mp3')),
    '6107b145df040a5c53cd4558f491183425a9246469362c06e8db6d6b91280d82',
    '3001_5 uses the recovered skill_jiguang clip',
);
check(/resources\.load\('original\/skill_jiguang', AudioClip/.test(source), true, 'skill_jiguang is preloaded');
check(/private beginH03LaserCast[\s\S]*this\.playAnimation\(unit, 'laser', false\);\s*this\.playH03LaserAudio\(\);/.test(source), true, 'soundDelay zero plays at laser cast start');
check(/this\.h03LaserAudioSource\.playOneShot\(this\.h03LaserAudio, 1\)/.test(source), true, 'laser audio uses one-shot playback');
check(/private stepH03LaserCast[\s\S]*if \(advance\.behaviorTriggered\)/.test(source), true, 'the 300 ms behavior trigger remains separate from cast-start audio');

console.log(`H03 recovered laser audio: ${assertions} assertions passed`);
