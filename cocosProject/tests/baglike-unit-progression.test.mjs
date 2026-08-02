import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { bagLikeProducerProfile } from '../assets/scripts/BagLikeUnitProgression.ts';

let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

const expectedMultiples = [1, 1.5, 2.25, 3.375];
const hamsterFamilies = {
    H01: 'js_zhanshi',
    H02: 'js_sheshou',
    H03: 'js_fashi',
    H04: 'js_qishi',
};

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

for (const [family, modelName] of Object.entries(hamsterFamilies)) {
    for (let level = 1; level <= 4; level += 1) {
        const gearId = `${family}0${level}`;
        const profile = bagLikeProducerProfile(gearId);
        check(profile?.heroId, family, `${gearId} keeps its hero family`);
        check(profile?.level, level, `${gearId} exposes its gear level`);
        check(profile?.kind, 'hamster', `${gearId} creates a persistent hamster unit`);
        check(profile?.attributeMultiple, expectedMultiples[level - 1], `${gearId} uses the recovered attribute multiple`);
        check(profile?.headId, gearId, `${gearId} uses the level-specific head`);
        check(profile?.modelId, gearId, `${gearId} uses the level-specific model id`);
        check(profile?.sourceModelPath, `spine/hero/${modelName}_${level}/${modelName}_${level}`, `${gearId} keeps the original logical model path`);
        check(profile?.spineResourcePath, `spine/${gearId}/${modelName}_${level}`, `${gearId} maps to the imported Cocos resource`);
        check(profile?.modelScale, level === 4 ? 0.88 : 0.8, `${gearId} uses the recovered model scale`);

        for (const extension of ['atlas', 'png', 'skel']) {
            check(
                existsSync(resolve(projectRoot, `assets/resources/spine/${gearId}/${modelName}_${level}.${extension}`)),
                true,
                `${gearId} imports its ${extension} asset`,
            );
        }
    }
}

check(bagLikeProducerProfile('H0204')?.primarySkillId, 2002, 'level-4 archer switches to original skill 2002');

const fusionModels = {
    H0705: ['H07', 'R1001', 'js_gangtiexia', 1.2, 8001],
    H0805: ['H08', 'R1002', 'js_aoteman', 1, 7001],
    H0905: ['H09', 'R1003', 'js_zhanche', 1, 9001],
};
for (const [gearId, [heroId, modelId, modelName, modelScale, primarySkillId]] of Object.entries(fusionModels)) {
    const profile = bagLikeProducerProfile(gearId);
    check(profile?.heroId, heroId, `${gearId} switches to its fusion hero family`);
    check(profile?.level, 5, `${gearId} remains a level-5 producer`);
    check(profile?.modelId, modelId, `${gearId} uses its recovered model id`);
    check(profile?.spineResourcePath, `spine/${gearId}/${modelName}`, `${gearId} maps to its imported fusion model`);
    check(profile?.modelScale, modelScale, `${gearId} keeps the recovered model scale`);
    check(profile?.primarySkillId, primarySkillId, `${gearId} uses its original primary skill`);
    for (const extension of ['atlas', 'png', 'skel']) {
        check(existsSync(resolve(projectRoot, `assets/resources/spine/${gearId}/${modelName}.${extension}`)), true, `${gearId} imports its ${extension} asset`);
    }
}

for (const family of ['H12', 'H13']) {
    for (let level = 1; level <= 4; level += 1) {
        const gearId = `${family}0${level}`;
        const profile = bagLikeProducerProfile(gearId);
        check(profile?.kind, 'wheel', `${gearId} remains a one-shot wheel producer`);
        check(profile?.attributeMultiple, expectedMultiples[level - 1], `${gearId} scales its tower skill by gear level`);
        check(profile?.modelId, null, `${gearId} does not create a persistent battlefield model`);
        check(profile?.headId, `${family}01`, `${gearId} keeps the original shared wheel head`);
    }
}

check(bagLikeProducerProfile('C0101'), null, 'coin gears do not create hero profiles');
check(bagLikeProducerProfile('H0105'), null, 'same-family level 5 does not invent a profile');

console.log(`baglike unit progression: ${assertions} assertions passed`);
