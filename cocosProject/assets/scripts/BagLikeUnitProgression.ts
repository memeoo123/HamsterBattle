export type BagLikeHeroFamilyId = 'H01' | 'H02' | 'H03' | 'H04' | 'H07' | 'H08' | 'H09' | 'H11' | 'H12' | 'H13';
export type BagLikeProducerKind = 'hamster' | 'wheel';
export type BagLikePrimarySkillId = number | string;

export type BagLikeProducerProfile = {
    gearId: string;
    heroId: BagLikeHeroFamilyId;
    level: number;
    kind: BagLikeProducerKind;
    attributeMultiple: number;
    headId: string;
    modelId: string | null;
    sourceModelPath: string | null;
    spineResourcePath: string | null;
    modelScale: number | null;
    primarySkillId: BagLikePrimarySkillId;
};

const LEVEL_ATTRIBUTE_MULTIPLES = [0, 1, 1.5, 2.25, 3.375] as const;

const HAMSTER_MODEL_NAMES: Readonly<Record<'H01' | 'H02' | 'H03' | 'H04', string>> = {
    H01: 'js_zhanshi',
    H02: 'js_sheshou',
    H03: 'js_fashi',
    H04: 'js_qishi',
};

const PRIMARY_SKILLS: Readonly<Record<BagLikeHeroFamilyId, BagLikePrimarySkillId>> = {
    H01: 1001,
    H02: 2001,
    H03: 3001,
    H04: 4001,
    H07: 8001,
    H08: 7001,
    H09: 9001,
    H11: 'ZL_1101',
    H12: 'LY_1201',
    H13: 'TZ_1301',
};

export function bagLikeProducerProfile(gearId: string): BagLikeProducerProfile | null {
    const fusionProfiles: Readonly<Record<string, BagLikeProducerProfile>> = {
        H0705: {
            gearId: 'H0705', heroId: 'H07', level: 5, kind: 'hamster', attributeMultiple: 1,
            headId: 'H0705', modelId: 'R1001', sourceModelPath: 'spine/hero/js_tietiexia/js_gangtiexia',
            spineResourcePath: 'spine/H0705/js_gangtiexia', modelScale: 1.2, primarySkillId: PRIMARY_SKILLS.H07,
        },
        H0805: {
            gearId: 'H0805', heroId: 'H08', level: 5, kind: 'hamster', attributeMultiple: 1,
            headId: 'H0805', modelId: 'R1002', sourceModelPath: 'spine/hero/js_aoteman/js_aoteman',
            spineResourcePath: 'spine/H0805/js_aoteman', modelScale: 1, primarySkillId: PRIMARY_SKILLS.H08,
        },
        H0905: {
            gearId: 'H0905', heroId: 'H09', level: 5, kind: 'hamster', attributeMultiple: 1,
            headId: 'H0905', modelId: 'R1003', sourceModelPath: 'spine/hero/js_zhanche/js_zhanche',
            spineResourcePath: 'spine/H0905/js_zhanche', modelScale: 1, primarySkillId: PRIMARY_SKILLS.H09,
        },
    };
    if (fusionProfiles[gearId]) return fusionProfiles[gearId];

    const match = /^(H01|H02|H03|H04|H11|H12|H13)0([1-4])$/.exec(gearId);
    if (!match) return null;

    const heroId = match[1] as BagLikeHeroFamilyId;
    const level = Number(match[2]);
    const attributeMultiple = LEVEL_ATTRIBUTE_MULTIPLES[level];
    if (!attributeMultiple) return null;

    const hamsterModelName = HAMSTER_MODEL_NAMES[heroId as keyof typeof HAMSTER_MODEL_NAMES];
    const kind: BagLikeProducerKind = hamsterModelName ? 'hamster' : 'wheel';
    const modelId = hamsterModelName ? gearId : null;
    const modelFile = hamsterModelName ? `${hamsterModelName}_${level}` : null;

    return {
        gearId,
        heroId,
        level,
        kind,
        attributeMultiple,
        headId: kind === 'hamster' ? gearId : `${heroId}01`,
        modelId,
        sourceModelPath: modelFile ? `spine/hero/${modelFile}/${modelFile}` : null,
        spineResourcePath: modelFile ? `spine/${gearId}/${modelFile}` : null,
        modelScale: modelFile ? (level === 4 ? 0.88 : 0.8) : null,
        primarySkillId: heroId === 'H02' && level === 4 ? 2002 : PRIMARY_SKILLS[heroId],
    };
}
