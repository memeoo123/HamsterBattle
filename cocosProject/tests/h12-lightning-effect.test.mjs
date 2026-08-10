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

const spineRoot = resolve(projectRoot, 'assets/resources/spine/H12Lightning');
const sha256Atlas = (path) => createHash('sha256').update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n')).digest('hex');
check(sha256Atlas(resolve(spineRoot, 'chilun_leiyun.atlas')), '1b6b82570f0084d9a7a6b80cc8483a16daaa6e82c0caaad6b22e77f16fd8e1b8', 'recovered atlas is exact');
check(sha256(resolve(spineRoot, 'chilun_leiyun.png')), 'b52c131e84a869f54b5dce6531519758a8425ca46a99a29346cc444261e3427e', 'recovered texture is exact');
check(sha256(resolve(spineRoot, 'chilun_leiyun.skel')), '77341de1dabdb28b4e7020015935a5a2230061ca11d302e2c2c10161f74e9ac2', 'recovered skeleton is exact');
check(sha256(resolve(projectRoot, 'assets/resources/original/bullet_leiyun.mp3')), '477f5ea5d6bdec5afb1e238923f8bc320c1fc88b62b92367ef879fa65253da9a', 'recovered hit audio is exact');
check(source.includes("resources.load('spine/H12Lightning/chilun_leiyun', sp.SkeletonData"), true, 'H12 Spine is preloaded');
check(source.includes("resources.load('original/bullet_leiyun', AudioClip"), true, 'H12 hit audio is preloaded');
check(/makeNode\('H12_S1',[\s\S]*?setScale\(0\.8, 0\.8, 1\)[\s\S]*?setAnimation\(0, 'attack', false\)/.test(source), true, 'model id, scale and non-loop action match ModelConfig');
check(/setCompleteListener\(\(\) => \{[\s\S]*?node\.destroy\(\)/.test(source), true, 'non-loop effect is removed on completion');
check(/model === 'H1201'[\s\S]*?addH12SkillEffect\(target\.x, target\.y\)[\s\S]*?beginAttack\(caster, target, null\)/.test(source), true, 'effect starts at the selected target before the existing delayed hit');
check(/hit\.attacker\.cfg\.id === 'H1201'\) this\.playH12HitAudio\(\)/.test(source), true, 'hit audio plays at delayed impact');
check(/playOneShot\(this\.h12HitAudio, 1\)/.test(source), true, 'the recovered clip is played once');
check(/\['H09', 'H0201', 'H0301', 'H07', 'H08', 'H1201', 'H1301'\]/.test(source), true, 'placeholder trace is disabled for H12');

console.log(`H12 recovered lightning effect: ${assertions} assertions passed`);
