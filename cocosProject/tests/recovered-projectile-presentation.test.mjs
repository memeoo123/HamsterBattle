import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(projectRoot, '..');
const source = readFileSync(resolve(projectRoot, 'assets/scripts/CangshuGame.ts'), 'utf8');
const mainFlowSource = readFileSync(resolve(projectRoot, 'assets/scripts/MainLevelFlow.ts'), 'utf8');
const evidenceRoot = resolve(repositoryRoot,
    'targets/wxf9af2417e78ce07a/18/evidence/assets/original/projectile-presentation');
const manifest = JSON.parse(readFileSync(resolve(evidenceRoot, 'manifest.json'), 'utf8'));
const missileTable = JSON.parse(readFileSync(resolve(repositoryRoot,
    'reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/battle.MissileConfig.json'),
    'utf8').replace(/^\uFEFF/, ''));

let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

check(manifest.appId, 'wxf9af2417e78ce07a', 'manifest stays isolated to the authorized target');
check(manifest.packageVersion, '18', 'manifest stays isolated to package version 18');
check(manifest.fileCount, 11, 'all recoverable projectile presentation files are inventoried');
check(manifest.unresolved, [{
    modelId: 'H18_S1',
    logicalPath: 'spriteFrame/skill/js_fashi_dandao',
    reason: 'The model table references this path, but resources3.config contains no matching native asset record.',
}], 'the absent H18 asset remains explicit instead of being invented');

for (const record of manifest.files) {
    const evidenceFile = resolve(evidenceRoot, record.evidenceFile);
    const implementationFile = resolve(projectRoot, 'assets/resources', record.implementationFile);
    check(existsSync(evidenceFile), true, `${record.evidenceFile} is preserved as evidence`);
    check(existsSync(implementationFile), true, `${record.implementationFile} is present in the Cocos project`);
    check(sha256(evidenceFile), record.sha256, `${record.evidenceFile} matches the recorded source hash`);
    check(sha256(implementationFile), record.sha256, `${record.implementationFile} is byte-identical to evidence`);
}

const expectedMissiles = {
    M_FXY_6001: { speed: 800, distance: 200, type: 6, modelId: 'H19_S1' },
    M_SY_1401: { speed: 0, distance: 1000, type: 4, modelId: 'H14_S1' },
    M_LS_1501: { speed: 0, distance: 2000, type: 18, modelId: 'H32_S1' },
    M_YGT_50002: { speed: 800, distance: 200, type: 6, modelId: 'H31_S1' },
    M_HS_50001: { speed: 300, distance: 1000, type: 1, modelId: 'H30_S1' },
    M10_attack_M: { speed: 800, distance: 500, type: 6, modelId: 'M10_S1' },
};
for (const [id, expected] of Object.entries(expectedMissiles)) {
    const row = missileTable.rows.find((candidate) => candidate.id === id);
    check(
        { speed: row.speed, distance: row.distance, type: row.type, modelId: row.modelId },
        expected,
        `${id} keeps its recovered missile type, speed, arc height/distance, and model`,
    );
}

check(/resources\.load\(\s*'original\/projectile-matrix\/js_feixingyuan_dandao2\/spriteFrame'/.test(source), true,
    'H06 animation sheet is preloaded');
check(/new Rect\(1, 119, 43, 28\)[\s\S]*?new Rect\(1, 149, 43, 28\)/.test(source), true,
    'H06 uses all recovered packed-frame bounds in animation order');
const h14Preload = source.slice(source.indexOf("'original/projectile-matrix/chilun_haidaosha/spriteFrame'"),
    source.indexOf("'original/projectile-matrix/yugutou_dandao/spriteFrame'"));
check((h14Preload.match(/new Rect\(/g) || []).length, 16, 'H14 restores all sixteen bomb frames');
check(/makeNode\('H14_S1'[\s\S]*?frames: this\.h14BombFrames[\s\S]*?ORIGINAL_EFFECT_FRAME_SECONDS/.test(source), true,
    'H14 plays the recovered target animation at the original frame cadence');
check(/playH14HitAudio[\s\S]*?playOneShot\(this\.h14HitAudio, 1\)/.test(source), true,
    'H14 plays bullet_shayu on the delayed behavior hit');
check(/makeNode\('H32_S1'[\s\S]*?distance \/ 370 \* 1\.5[\s\S]*?duration: 2/.test(source), true,
    'H17 ray uses originalW=370, model scaleY=1.5, and the 2 second time limit');
check(/multiHitDelays: \[0, 0\.33, 0\.66, 1, 1\.3, 1\.4\]/.test(source), true,
    'H17 keeps all six recovered ray behavior timings');
check(/inverseProgress \* inverseProgress \* visual\.fromY[\s\S]*?2 \* inverseProgress \* progress \* controlY/.test(source), true,
    'type-6 projectiles use the recovered quadratic throw path instead of a straight trace');

for (const [unitId, method] of [
    ['H0601', 'addH06Projectile'],
    ['H1401', 'addH14Bomb'],
    ['H1701', 'addH17Ray'],
    ['M03', 'addEnemyBoneProjectile'],
    ['M09', 'addEnemyOrbProjectile'],
    ['M10', 'addM10Projectile'],
]) {
    check(new RegExp(`unit\\.cfg\\.id === '${unitId}'[\\s\\S]*?this\\.${method}\\(`).test(source), true,
        `${unitId} is routed to ${method}`);
}
check(/RECOVERED_PROJECTILE_PRESENTATION_IDS\.has\(hit\.attacker\.cfg\.id\)/.test(source), true,
    'recovered projectiles no longer receive the generic 0.11 second trace on hit');
check(/projectileValidation=1[\s\S]*?applyProjectileValidationFixture/.test(source), true,
    'the browser-only validation route is isolated behind an explicit query flag');
check(/developedValidation\|projectileValidation/.test(mainFlowSource), true,
    'the explicit projectile fixture boots a level without spending account progression');
check(/applyProjectileValidationFixture[\s\S]*?addH06Projectile[\s\S]*?addH14Bomb[\s\S]*?addH17Ray[\s\S]*?addEnemyBoneProjectile[\s\S]*?addEnemyOrbProjectile[\s\S]*?addM10Projectile/.test(source), true,
    'the visual fixture exercises every recovered projectile class through production methods');
check(/canvas\.dataset\.projectileValidationReady = '1'/.test(source), true,
    'the browser fixture exposes an authoritative resource-ready signal');

console.log(`recovered projectile presentation: ${assertions} assertions passed`);
