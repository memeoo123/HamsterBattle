import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(projectRoot, 'assets/scripts/CangshuGame.ts'), 'utf8');
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const sha256Atlas = (path) => createHash('sha256').update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n')).digest('hex');
let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

check(sha256Atlas(resolve(projectRoot, 'assets/resources/spine/H03Transform/hit_lizi.atlas')), '236815476d2afef8f02527ebe72e79b218412084ca9a4aecc81d95b1df50b06d', 'H28_S2 uses the recovered atlas');
check(sha256(resolve(projectRoot, 'assets/resources/spine/H03Transform/hit_lizi.png')), 'f5598ef68f7e9922aa15d962b023297a852bb84e7ad1ea977aeae31d9bc130be', 'H28_S2 uses the recovered texture');
check(sha256(resolve(projectRoot, 'assets/resources/spine/H03Transform/hit_lizi.skel')), '57b74e276d3773955856e7257c57b8f6a5856bd049f3a3ff4423cd6a73dcdee1', 'H28_S2 uses the recovered Spine binary');
check(sha256Atlas(resolve(projectRoot, 'assets/resources/spine/H03Freeze/hit_binkuai.atlas')), '45eee94fcaaba790cbee2dd11d9f054e8a596d442ea71bfaf26cfe4aff5f5c86', 'H28_S1 uses the recovered atlas');
check(sha256(resolve(projectRoot, 'assets/resources/spine/H03Freeze/hit_binkuai.png')), '01ad82d67ae2351374044ece3875b109447b67fe3952e2958e4f96f2ff15d52a', 'H28_S1 uses the recovered texture');
check(sha256(resolve(projectRoot, 'assets/resources/spine/H03Freeze/hit_binkuai.skel')), '774e46faf91891ff6e878fe2d7be0ce488f77df9f210f2ab8a5f941b106f11f5', 'H28_S1 uses the recovered Spine binary');
check(sha256(resolve(projectRoot, 'assets/resources/original/skill_bianxing.mp3')), '4c4e83e34c9c60107ea1ca1d7f325853ca7927f4e58b8efdf41fe370067c91df', 'star-7 transform uses skill_bianxing');
check(sha256(resolve(projectRoot, 'assets/resources/original/skill_bingfeng.mp3')), 'cb233dc405d26ae73cfecddc7f8a77d57d0aa9e80314a848c4fd89ea0f6823c9', '30-percent freeze uses skill_bingfeng');
check(/resources\.load\('spine\/H03Transform\/hit_lizi', sp\.SkeletonData/.test(source), true, 'H28_S2 Spine is preloaded');
check(/resources\.load\('spine\/H03Freeze\/hit_binkuai', sp\.SkeletonData/.test(source), true, 'H28_S1 Spine is preloaded');
check(/node\.setScale\(0\.5, 0\.5, 1\)/.test(source), true, 'H28_S2 uses ModelConfig scale');
check(/skeleton\.setAnimation\(0, 'hit', false\)/.test(source), true, 'H28_S2 plays its configured hit action');
check(/skeleton\.setAnimation\(0, 'idle', true\)/.test(source), true, 'H28_S1 loops its configured idle action');
check(/getChildByName\('H28_S1'\)[\s\S]*previous\.destroy\(\)/.test(source), true, 'refreshed freeze replaces the previous H28_S1 instance');
check(/this\.scheduleOnce\([\s\S]*if \(node\.isValid\) node\.destroy\(\);[\s\S]*}, 3\)/.test(source), true, 'H28_S1 follows the three-second buff lifetime');
check(/this\.addH03TransformEffect\(target\)/.test(source), true, 'successful transform application creates H28_S2');
check(/traitId === 'RG_H03_abl03_eff01'[\s\S]*this\.playH03StatusAudio\(this\.h03TransformAudio\)/.test(source), true, 'only the sound-bearing star-7 transform plays skill_bianxing');
check(/target\.frozen = Math\.max\(target\.frozen, 3\);\s*this\.addH03FreezeEffect\(target\);\s*this\.playH03StatusAudio\(this\.h03FreezeAudio\)/.test(source), true, 'successful 30-percent freeze creates H28_S1 and plays skill_bingfeng');
check(/this\.h03StatusAudioSource\.playOneShot\(clip, 1\)/.test(source), true, 'H03 status clips use one-shot playback');

console.log(`H03 recovered status effects: ${assertions} assertions passed`);
