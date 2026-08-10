import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
    bagLikeHeroBaseHpAtStar,
    bagLikeProducerProfile,
    bagLikeProducerShape,
    bagLikeWheelHomeHpContribution,
} from '../assets/scripts/BagLikeUnitProgression.ts';

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

const mechanicsOnlyHamsterFamilies = {
    H05: 'js_lieren',
    H06: 'js_feixingyuan',
    H16: 'js_konglong',
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

for (const [family, modelName] of Object.entries(mechanicsOnlyHamsterFamilies)) {
    for (let level = 1; level <= 4; level += 1) {
        const gearId = `${family}0${level}`;
        const profile = bagLikeProducerProfile(gearId);
        check(profile?.heroId, family, `${gearId} keeps its recovered hero family`);
        check(profile?.kind, 'hamster', `${gearId} creates a persistent hamster unit`);
        check(profile?.attributeMultiple, expectedMultiples[level - 1], `${gearId} uses the recovered attribute multiple`);
        check(profile?.sourceModelPath, `spine/hero/${modelName}_${level}/${modelName}_${level}`, `${gearId} keeps the decoded model path`);
        check(profile?.modelScale, family === 'H16' ? (level === 4 ? 1 : 0.88) : (level === 4 ? 0.88 : 0.8), `${gearId} keeps the decoded model scale`);
        check(profile?.primarySkillId, family === 'H05' ? 5001 : family === 'H06' ? 6001 : 11001, `${gearId} keeps its decoded primary skill`);
    }
}

check(bagLikeProducerProfile('H0204')?.primarySkillId, 2002, 'level-4 archer switches to original skill 2002');
check(bagLikeProducerShape('H0601'), [[0, 0], [0, 1], [1, 0], [1, 1]], 'H06 keeps its recovered 2x2 footprint');
check(bagLikeProducerShape('H1404'), [[0, 1], [1, 0], [1, 1]], 'every H14 level keeps its recovered lower-right L footprint');
check(bagLikeProducerShape('H1703'), [[0, 0], [0, 1], [0, 2]], 'H17 keeps its recovered horizontal-three footprint');

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

const mechanicsOnlyFusions = {
    H1005: ['H10', 'hamster', 'R1004', 'H1005', 1.1, 10001, [[0, 0], [0, 1], [1, 0], [1, 1]]],
    H1505: ['H15', 'wheel', null, 'H1505', null, 110001, [[0, 1], [1, 1]]],
    H1805: ['H18', 'hamster', 'R1005', 'H1805', 1, 12001, [[0, 0], [0, 1], [1, 1]]],
};
for (const [gearId, [heroId, kind, modelId, headId, modelScale, primarySkillId, shape]] of Object.entries(mechanicsOnlyFusions)) {
    const profile = bagLikeProducerProfile(gearId);
    check(profile?.heroId, heroId, `${gearId} switches to its recovered fusion hero family`);
    check(profile?.kind, kind, `${gearId} keeps its recovered producer kind`);
    check(profile?.level, 5, `${gearId} remains a level-5 producer`);
    check(profile?.attributeMultiple, 1, `${gearId} uses the recovered 10000 attribute multiple`);
    check(profile?.modelId, modelId, `${gearId} keeps its decoded model identity`);
    check(profile?.headId, headId, `${gearId} uses its exact configured head`);
    check(profile?.modelScale, modelScale, `${gearId} keeps its decoded model scale`);
    check(profile?.primarySkillId, primarySkillId, `${gearId} keeps its primary skill identity`);
    check(bagLikeProducerShape(gearId), shape, `${gearId} keeps its decoded fusion footprint`);
}

for (const family of ['H11', 'H12', 'H13', 'H14', 'H17']) {
    for (let level = 1; level <= 4; level += 1) {
        const gearId = `${family}0${level}`;
        const profile = bagLikeProducerProfile(gearId);
        check(profile?.kind, 'wheel', `${gearId} remains a one-shot wheel producer`);
        check(profile?.attributeMultiple, expectedMultiples[level - 1], `${gearId} scales its tower skill by gear level`);
        check(profile?.modelId, null, `${gearId} does not create a persistent battlefield model`);
        check(profile?.headId, `${family}01`, `${gearId} keeps the original shared wheel head`);
    }
}

check(bagLikeProducerProfile('H1101')?.primarySkillId, 'ZL_1101', 'H11 uses the recovered healing skill identity');
check(bagLikeProducerProfile('H1401')?.primarySkillId, 'SY_1401', 'H14 uses the recovered shark skill identity');
check(bagLikeProducerProfile('H1701')?.primarySkillId, 'LS_1501', 'H17 uses the recovered laser skill identity');

check(bagLikeHeroBaseHpAtStar(300, 1), 300, 'one-star H13 keeps its HeroConfig base HP');
check(bagLikeHeroBaseHpAtStar(300, 3), 363, 'three-star H13 applies the recovered 21% star modifier');
check(bagLikeHeroBaseHpAtStar(300, 15), 1137, 'the full recovered 15-star table remains available to wheel HP');
check(bagLikeHeroBaseHpAtStar(300, 20), 1833, 'the package 20-star maximum remains available to wheel HP');
check(
    bagLikeWheelHomeHpContribution(['P01', 'H1301', 'H0101'], { H13: 3 }),
    363,
    'only the placed WHEEL gear contributes its star-adjusted HP to the home',
);
check(
    bagLikeWheelHomeHpContribution(['H1102', 'H1201', 'H1302'], { H11: 1, H12: 2, H13: 3 }),
    330 + 220 + 544.5,
    'all restored wheel families apply their gear-level attribute multiplier',
);
check(
    bagLikeWheelHomeHpContribution(['H1401', 'H1702'], { H14: 1, H17: 1 }),
    280 + 480,
    'late-game wheel families contribute their decoded base HP and gear multiplier',
);
check(
    bagLikeWheelHomeHpContribution(['H1505'], { H15: 1 }),
    1134,
    'H1505 contributes its recovered WHEEL base HP to the home',
);

check(bagLikeProducerProfile('C0101'), null, 'coin gears do not create hero profiles');
check(bagLikeProducerShape('C01'), null, 'non-producer gears do not invent a producer footprint');
check(bagLikeProducerProfile('H0105'), null, 'same-family level 5 does not invent a profile');

console.log(`baglike unit progression: ${assertions} assertions passed`);
