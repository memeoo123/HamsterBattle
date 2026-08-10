export type BagLikeHeroFamilyId =
    | 'H01' | 'H02' | 'H03' | 'H04' | 'H05' | 'H06'
    | 'H07' | 'H08' | 'H09'
    | 'H10' | 'H11' | 'H12' | 'H13' | 'H14' | 'H15' | 'H16' | 'H17' | 'H18';
export type BagLikeProducerKind = 'hamster' | 'wheel';
export type BagLikePrimarySkillId = number | string;
export type BagLikeGridShape = ReadonlyArray<readonly [number, number]>;

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

// BagLikeShapeConfig IDs recovered for each producer family. Keeping these in
// the pure runtime catalog lets both the Cocos interaction path and the 200-level
// accessibility checks consume exactly the same footprints.
const PRODUCER_SHAPES: Readonly<Record<BagLikeHeroFamilyId, BagLikeGridShape>> = {
    H01: [[0, 0]],
    H02: [[0, 0], [0, 1]],
    H03: [[0, 0], [1, 0]],
    H04: [[0, 0], [1, 0], [2, 0]],
    H05: [[0, 0], [1, 0], [1, 1]],
    H06: [[0, 0], [0, 1], [1, 0], [1, 1]],
    H07: [[0, 0], [0, 1]],
    H08: [[0, 0], [1, 0]],
    H09: [[0, 0], [0, 1], [1, 0]],
    H10: [[0, 0], [0, 1], [1, 0], [1, 1]],
    H11: [[0, 0], [1, 0]],
    H12: [[0, 0], [0, 1]],
    H13: [[0, 0], [0, 1], [1, 0]],
    H14: [[0, 1], [1, 0], [1, 1]],
    H15: [[0, 1], [1, 1]],
    H16: [[0, 0], [0, 1], [1, 1]],
    H17: [[0, 0], [0, 1], [0, 2]],
    H18: [[0, 0], [0, 1], [1, 1]],
};

export function bagLikeProducerShape(gearId: string): BagLikeGridShape | null {
    const fusionFamily = gearId === 'H0705' ? 'H07'
        : gearId === 'H0805' ? 'H08'
        : gearId === 'H0905' ? 'H09'
        : gearId === 'H1005' ? 'H10'
        : gearId === 'H1505' ? 'H15'
        : gearId === 'H1805' ? 'H18'
        : null;
    if (fusionFamily) return PRODUCER_SHAPES[fusionFamily];
    const match = /^(H01|H02|H03|H04|H05|H06|H11|H12|H13|H14|H16|H17)0[1-4]$/.exec(gearId);
    return match ? PRODUCER_SHAPES[match[1] as BagLikeHeroFamilyId] : null;
}

// hero.HeroConfig + hero.HeroStarConfig. The original HeroModel floors the
// star-adjusted base attribute before BagLilkeManager applies the gear-level
// multiplier. Only WHEEL heroes contribute to the player's home max HP.
const WHEEL_BASE_HP: Readonly<Record<'H11' | 'H12' | 'H13' | 'H14' | 'H15' | 'H17', number>> = {
    H11: 220,
    H12: 200,
    H13: 300,
    H14: 280,
    H15: 1134,
    H17: 320,
};

const HERO_STAR_ATTRIBUTE_MODIFIERS = [
    0, 0, 1000, 2100, 3300, 4600, 6100, 7700, 9400, 11400, 13500,
    15900, 18500, 21300, 24500, 27900, 31700, 35900, 40500, 45500, 51100,
] as const;

export function bagLikeHeroBaseHpAtStar(baseHp: number, star: number): number {
    const normalizedStar = Math.max(1, Math.min(HERO_STAR_ATTRIBUTE_MODIFIERS.length - 1, Math.floor(star)));
    return Math.floor(baseHp * (1 + HERO_STAR_ATTRIBUTE_MODIFIERS[normalizedStar] / 10000));
}

export function bagLikeWheelHomeHpContribution(
    gearIds: ReadonlyArray<string>,
    heroStars: Readonly<Partial<Record<BagLikeHeroFamilyId, number>>>,
): number {
    let total = 0;
    for (const gearId of gearIds) {
        const profile = bagLikeProducerProfile(gearId);
        if (!profile || profile.kind !== 'wheel') continue;
        const baseHp = WHEEL_BASE_HP[profile.heroId as keyof typeof WHEEL_BASE_HP];
        if (!baseHp) continue;
        total += bagLikeHeroBaseHpAtStar(baseHp, heroStars[profile.heroId] || 1) * profile.attributeMultiple;
    }
    return total;
}

const HAMSTER_MODEL_NAMES: Readonly<Record<'H01' | 'H02' | 'H03' | 'H04' | 'H05' | 'H06' | 'H16', string>> = {
    H01: 'js_zhanshi',
    H02: 'js_sheshou',
    H03: 'js_fashi',
    H04: 'js_qishi',
    H05: 'js_lieren',
    H06: 'js_feixingyuan',
    H16: 'js_konglong',
};

const PRIMARY_SKILLS: Readonly<Record<BagLikeHeroFamilyId, BagLikePrimarySkillId>> = {
    H01: 1001,
    H02: 2001,
    H03: 3001,
    H04: 4001,
    H05: 5001,
    H06: 6001,
    H07: 8001,
    H08: 7001,
    H09: 9001,
    H10: 10001,
    H11: 'ZL_1101',
    H12: 'LY_1201',
    H13: 'TZ_1301',
    H14: 'SY_1401',
    H15: 110001,
    H16: 11001,
    H17: 'LS_1501',
    H18: 12001,
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
        H1005: {
            gearId: 'H1005', heroId: 'H10', level: 5, kind: 'hamster', attributeMultiple: 1,
            headId: 'H1005', modelId: 'R1004', sourceModelPath: 'spine/hero/js_feidieshu/js_feidieshu',
            spineResourcePath: null, modelScale: 1.1, primarySkillId: PRIMARY_SKILLS.H10,
        },
        H1505: {
            gearId: 'H1505', heroId: 'H15', level: 5, kind: 'wheel', attributeMultiple: 1,
            headId: 'H1505', modelId: null, sourceModelPath: null,
            spineResourcePath: null, modelScale: null, primarySkillId: PRIMARY_SKILLS.H15,
        },
        H1805: {
            gearId: 'H1805', heroId: 'H18', level: 5, kind: 'hamster', attributeMultiple: 1,
            headId: 'H1805', modelId: 'R1005', sourceModelPath: 'spine/hero/js_gesila/js_gesila',
            spineResourcePath: null, modelScale: 1, primarySkillId: PRIMARY_SKILLS.H18,
        },
    };
    if (fusionProfiles[gearId]) return fusionProfiles[gearId];

    const match = /^(H01|H02|H03|H04|H05|H06|H11|H12|H13|H14|H16|H17)0([1-4])$/.exec(gearId);
    if (!match) return null;

    const heroId = match[1] as BagLikeHeroFamilyId;
    const level = Number(match[2]);
    const attributeMultiple = LEVEL_ATTRIBUTE_MULTIPLES[level];
    if (!attributeMultiple) return null;

    const hamsterModelName = HAMSTER_MODEL_NAMES[heroId as keyof typeof HAMSTER_MODEL_NAMES];
    const kind: BagLikeProducerKind = hamsterModelName ? 'hamster' : 'wheel';
    const modelId = hamsterModelName ? gearId : null;
    const modelFile = hamsterModelName ? `${hamsterModelName}_${level}` : null;
    const modelScale = modelFile
        ? heroId === 'H16'
            ? (level === 4 ? 1 : 0.88)
            : (level === 4 ? 0.88 : 0.8)
        : null;

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
        modelScale,
        primarySkillId: heroId === 'H02' && level === 4 ? 2002 : PRIMARY_SKILLS[heroId],
    };
}
