import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(projectRoot, 'assets/scripts/CangshuGame.ts'), 'utf8');
const progression = readFileSync(resolve(projectRoot, 'assets/scripts/BagLikeUnitProgression.ts'), 'utf8');
const sha256 = (relativePath) => createHash('sha256')
    .update(readFileSync(resolve(projectRoot, relativePath)))
    .digest('hex');

const assets = new Map([
    ['assets/resources/spine/H1005/js_feidieshu.skel', '2209259c2c3999f986cb9f309c8d5fedefc1a4daf79c65175f2277b9aaf7e461'],
    ['assets/resources/spine/H1805/js_gesila.skel', '1e6c3912281bdd2b4a565229dc59ee11de78d1c01e02f471085ca2cf50ffce23'],
    ['assets/resources/spine/H1005Projectile/js_feidieshu_dandao.skel', '9adb7cc216b643436ca10759b866494db7bd309480a9a6ffa832651e68d367e9'],
    ['assets/resources/spine/H1005Nuke/hedang.skel', 'e1b2121dad8c16837dcc27cf0893614be91fd24e9bc97e93dfe8a9eef76d65e1'],
    ['assets/resources/original/bullet_hedan.mp3', 'e87fd1069e3fae27971300babbf95080fed78522727ec78d0c8090a7e7ca32e6'],
    ['assets/resources/original/chilun_chuangzhangsha.png', '2ecf00c026d20bf7ba7b30f63bbc63050d816572d736c86386720cc33ac36097'],
]);
for (const [path, hash] of assets) assert.equal(sha256(path), hash, `${path} preserves the recovered binary`);

assert.match(progression, /H1005:[\s\S]*?spineResourcePath: 'spine\/H1005\/js_feidieshu'/,
    'H1005 now spawns the recovered UFO hamster');
assert.match(progression, /H1805:[\s\S]*?spineResourcePath: 'spine\/H1805\/js_gesila'/,
    'H1805 now spawns the recovered Godzilla hamster');
assert.match(source, /resources\.load\('spine\/H1005Projectile\/js_feidieshu_dandao'/,
    'H1005 projectile Spine is preloaded');
assert.match(source, /makeNode\('H27_S1',[\s\S]*?setAnimation\(0, 'idle', true\)/,
    'H1005 primary attack uses its recovered projectile model');
assert.match(source, /makeNode\('H27_S2_LOWER',[\s\S]*?0, -160,[\s\S]*?5\.1/,
    'H1005 active uses the recovered lower-layer middle-path nuke');
assert.match(source, /profile\.skillId === '10001_2'\) this\.playH1005NukeHitAudio\(\)/,
    'each recovered global nuke pulse plays bullet_hedan');
assert.match(source, /const ORIGINAL_EFFECT_FRAME_SECONDS = 0\.0666/,
    'all recovered frame sheets use the original FrameAnim interval');
assert.match(source, /makeNode\('H15_S1',[\s\S]*?setAnchorPoint\(0\.5, 0\.2\)/,
    'H1505 impact uses the recovered model id and anchor');
assert.equal((source.match(/originalSize: new Size\(351, 213\)/g) || []).length, 1,
    'H1505 frame sheet keeps its recovered 351x213 source size');
assert.equal((source.match(/\{ rect: new Rect\([^\n]+\), offset: new Vec2\([^\n]+\) \}/g) || [])
    .filter((line) => source.indexOf(line) > source.indexOf('preloadLateFusionPresentation')).length >= 16, true,
    'H1505 reconstructs all sixteen packed frames');

console.log('late fusion presentation: 16 assertions passed');
