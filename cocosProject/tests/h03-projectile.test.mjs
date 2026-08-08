import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(projectRoot, 'assets/scripts/CangshuGame.ts'), 'utf8');
const assetRoot = resolve(projectRoot, 'assets/resources/spine/H03Projectile');
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

for (const extension of ['atlas', 'png', 'skel']) {
    check(existsSync(resolve(assetRoot, `zidan.${extension}`)), true, `H13_S1 imports its ${extension}`);
}
check(sha256(resolve(assetRoot, 'zidan.atlas')), '3621c20ac17845a0ddbd42946b2b546fbdb2b9a2fdaa17573f16e4a0f0d68503', 'atlas hash matches resources3');
check(sha256(resolve(assetRoot, 'zidan.png')), '14f5b490b5bb03eb44aae13c5ea8979b8684738acceeb9f68f7ae0233dbeef3b', 'texture hash matches resources3');
check(sha256(resolve(assetRoot, 'zidan.skel')), '4a31ade08679aed281a3e2290dabc16373c1137608b456f5016d88d79438c772', 'Spine binary hash matches resources3');
check(/H0301:[\s\S]*?projectileSpeed: 300,[\s\S]*?spinePath: 'spine\/H0301/.test(source), true, 'H03 uses M_FS_3001 speed 300');
check(/H08:[\s\S]*?projectileSpeed: 500,[\s\S]*?spinePath: 'spine\/H0805/.test(source), true, 'H08 keeps M_ATM_7001 speed 500');
check(/resources\.load\('spine\/H03Projectile\/zidan', sp\.SkeletonData/.test(source), true, 'the recovered Spine projectile is preloaded');
check(/makeNode\('H13_S1',[\s\S]*?skeleton\.setAnimation\(0, 'idle', true\)/.test(source), true, 'projectile uses the recovered model and idle animation');
check(/\(unit\.cfg\.id === 'H0301' \|\| unit\.cfg\.id === 'H08'\)[\s\S]*?addH03Projectile\(unit\.x, unit\.y, impactX, impactY, travelTime, behaviorDelay\)/.test(source), true, 'H03 and H08 launch at their behavior frame');
check(/\['H09', 'H0201', 'H0301', 'H07', 'H08', 'H1201', 'H1301'\]\.indexOf\(hit\.attacker\.cfg\.id\) < 0/.test(source), true, 'the placeholder trace is disabled for recovered effect families');
check(/node\.active = delay <= 0[\s\S]*?visual\.delay -= dt[\s\S]*?visual\.node\.active = true/.test(source), true, 'the projectile remains hidden until its behavior delay');

console.log(`H03/H08 recovered projectile: ${assertions} assertions passed`);
