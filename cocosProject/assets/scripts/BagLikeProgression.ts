export type BagLikeProgress = {
    level: number;
    exp: number;
};

export type BagLikeProgressResult = BagLikeProgress & {
    leveledUp: boolean;
};

export type TraitId =
    | 'RG_ALL_abl01_eff01'
    | 'RG_ALL_abl02_eff01'
    | 'RG_ALL_abl03_eff01'
    | 'RG_ALL_abl04_eff01'
    | 'RG_ALL_abl05_eff01'
    | 'RG_ALL_abl06_eff01'
    | 'RG_ALL_abl07_eff01'
    | 'RG_ALL_abl08_eff01'
    | 'RG_ALL_abl09_eff01'
    | 'RG_ALL_abl10_eff01'
    | 'RG_ALL_abl11_eff01'
    | 'RG_ALL_abl12_eff01'
    | 'RG_ALL_abl13_eff01'
    | 'RG_ALL_abl14_eff01'
    | 'RG_ALL_abl15_eff01'
    | 'RG_ALL_abl16_eff01'
    | 'RG_ALL_abl17_eff01'
    | 'RG_ALL_abl18_eff01'
    | 'RG_H01_abl01_eff01'
    | 'RG_H01_abl02_eff01'
    | 'RG_H01_abl02_eff02'
    | 'RG_H01_abl02_eff03'
    | 'RG_H01_abl02_eff04'
    | 'RG_H01_abl03_eff01'
    | 'RG_H02_abl01_eff01'
    | 'RG_H02_abl02_eff01'
    | 'RG_H02_abl02_eff02'
    | 'RG_H02_abl02_eff03'
    | 'RG_H02_abl03_eff01'
    | 'RG_H02_abl03_eff02'
    | 'RG_H03_abl01_eff01'
    | 'RG_H03_abl02_eff01'
    | 'RG_H03_abl03_eff01'
    | 'RG_H03_abl03_eff02'
    | 'RG_H03_abl04_eff01'
    | 'RG_H04_abl01_eff01'
    | 'RG_H04_abl02_eff01'
    | 'RG_H04_abl02_eff02'
    | 'RG_H04_abl03_eff01'
    | 'RG_H04_abl03_eff02'
    | 'RG_H04_abl04_eff01'
    | 'RG_H11_abl02_eff01'
    | 'RG_H11_abl01_eff02'
    | 'RG_H11_abl03_eff01'
    | 'RG_H12_abl01_eff01'
    | 'RG_H12_abl01_eff02'
    | 'RG_H12_abl02_eff01'
    | 'RG_H12_abl03_eff01'
    | 'RG_H12_abl04_eff01'
    | 'RG_H13_abl01_eff01'
    | 'RG_H13_abl01_eff02'
    | 'RG_H13_abl02_eff01'
    | 'RG_H13_abl02_eff02';

export type TraitEffectKind = 'attackIncrease' | 'attackKillFly' | 'attackSpeed' | 'barrage' | 'bossVulnerability' | 'bounceTimes' | 'criticalDamage' | 'criticalRate' | 'enemyAttackDecrease' | 'expGain' | 'gearUpgrade' | 'healToShield' | 'immediateHomeHeal' | 'paralysis' | 'penetratingLaser' | 'periodicSelfHeal' | 'powerNearAttack' | 'powerNearWorker' | 'prepareRewardWeight' | 'roundStartHomeHeal' | 'runtimeNoOp' | 'shieldWall' | 'skillReplacement' | 'splitShot' | 'freeze' | 'transform' | 'hpIncrease' | 'warriorComboCritical' | 'warriorKillAttackIncrease';

export type HeroStarRequirement = {
    heroId: string;
    star: number;
};

export type WarriorComboProfile = {
    traitId: TraitId;
    attacksRequired: number;
    bonusCritDamage: number;
    healMaxHpBasisPoints: number;
};

export type WarriorComboState = {
    completedAttacks: number;
    criticalReady: boolean;
};

export type WarriorComboCompletion = WarriorComboState & {
    triggered: boolean;
};

export type WarriorKillAttackProfile = {
    range: readonly string[];
    attackIncreasePerStack: number;
    maxStacks: number;
};

export type WarriorKillAttackCompletion = {
    stacks: number;
    triggered: boolean;
};

export type H04ShieldWallProfile = {
    traitId: 'RG_H04_abl03_eff01' | 'RG_H04_abl03_eff02';
    damageResistance: number;
    counterattackRatio: number;
};

export type H03TransformProfile = {
    traitId: 'RG_H03_abl03_eff01' | 'RG_H03_abl03_eff02';
    durationSeconds: number;
    disablesTarget: boolean;
    outgoingDamageIncrease: number;
};

export type H03LaserProfile = {
    traitId: 'RG_H03_abl04_eff01';
    skillId: '3001_5';
    initialCooldownSeconds: number;
    cooldownSeconds: number;
    castTimeSeconds: number;
    behaviorDelaySeconds: number;
    castingRange: number;
    width: number;
    height: number;
    maxTargets: number;
    effectRatio: number;
};

export type H02BarrageProfile = {
    traitId: 'RG_H02_abl03_eff01' | 'RG_H02_abl03_eff02';
    skillId: '2001_5' | '2001_6';
    initialCooldownSeconds: number;
    cooldownSeconds: number;
    castTimeSeconds: number;
    configuredShotDelays: readonly number[];
    effectRatio: number;
    projectileSpeed: number;
};

export type TraitDefinition = {
    id: TraitId;
    name: string;
    description: string;
    quality: 2 | 3 | 4;
    weight: number;
    maxTimes: number;
    range: readonly string[] | null;
    group?: string;
    minHeroStar?: HeroStarRequirement;
    excludedWaveRange?: readonly [number, number];
    homeHpPercentRange?: readonly [number, number];
    noRestore?: boolean;
    effect: {
        kind: TraitEffectKind;
        amount: number;
        rewardId?: number;
        attacksRequired?: number;
        healMaxHpBasisPoints?: number;
        maxStacks?: number;
    };
};

export type PrepareRewardWeightModifier = {
    rewardType: 'REWARD';
    rewardId: number;
    multiplier: number;
};

export type BagLikeGearUpgradeItem<TId extends string> = {
    sid: number;
    id: TId;
    location: 'grid' | 'candidate';
    isPower: boolean;
};

export type BagLikeGearUpgradeResult<TItem, TId extends string> = {
    item: TItem;
    previousId: TId;
    nextId: TId;
};

// baglike.BagLikeLevelConfig: the row for level + 1 is the current EXP target.
export function expTargetForLevel(level: number): number {
    if (level <= 1) return 20;
    if (level === 2) return 50;
    return 100;
}

// BagLikeTopItem.onAddExp performs one level transition per EXP notification.
export function addBagLikeExp(
    progress: BagLikeProgress,
    amount: number,
    multiplier = 1,
): BagLikeProgressResult {
    const target = expTargetForLevel(progress.level);
    const gained = Math.max(0, amount * multiplier);
    const total = progress.exp + gained;
    if (total < target) return { ...progress, exp: total, leveledUp: false };
    return {
        level: progress.level + 1,
        exp: total % target,
        leveledUp: true,
    };
}

// These are the exact three choices observed in one captured level-1004 roll.
// They are evidence for pool membership, not a static choice list.
export const CAPTURED_LEVEL_2_TRAITS: readonly TraitId[] = [
    'RG_ALL_abl13_eff01',
    'RG_H02_abl02_eff01',
    'RG_H03_abl02_eff01',
] as const;

// Exact weights/qualities/times from BagLikeAbilityEffectConfig. This pool is
// intentionally limited to effects currently implemented by the reconstruction.
export const IMPLEMENTED_TRAIT_POOL: readonly TraitDefinition[] = [
    { id: 'RG_ALL_abl01_eff01', name: '攻击强化·1', description: '所有仓鼠攻击增加 5%', quality: 2, weight: 20, maxTimes: 99, range: ['H01', 'H02', 'H03', 'H04'], effect: { kind: 'attackIncrease', amount: 500 } },
    { id: 'RG_ALL_abl02_eff01', name: '攻击强化·2', description: '所有仓鼠攻击增加 10%', quality: 3, weight: 10, maxTimes: 99, range: ['H01', 'H02', 'H03', 'H04'], effect: { kind: 'attackIncrease', amount: 1000 } },
    { id: 'RG_ALL_abl03_eff01', name: '攻击强化·3', description: '所有仓鼠攻击增加 15%', quality: 4, weight: 5, maxTimes: 99, range: ['H01', 'H02', 'H03', 'H04'], effect: { kind: 'attackIncrease', amount: 1500 } },
    { id: 'RG_ALL_abl04_eff01', name: '攻速强化·1', description: '所有仓鼠攻速增加 5%', quality: 2, weight: 20, maxTimes: 99, range: ['H01', 'H02', 'H03', 'H04'], effect: { kind: 'attackSpeed', amount: 500 } },
    { id: 'RG_ALL_abl05_eff01', name: '攻速强化·2', description: '所有仓鼠攻速增加 10%', quality: 3, weight: 10, maxTimes: 99, range: ['H01', 'H02', 'H03', 'H04'], effect: { kind: 'attackSpeed', amount: 1000 } },
    { id: 'RG_ALL_abl06_eff01', name: '攻速强化·3', description: '所有仓鼠攻速增加 15%', quality: 4, weight: 5, maxTimes: 99, range: ['H01', 'H02', 'H03', 'H04'], effect: { kind: 'attackSpeed', amount: 1500 } },
    {
        id: 'RG_ALL_abl07_eff01',
        name: '经验强化',
        description: '获得经验提升 50%',
        quality: 4,
        weight: 5,
        maxTimes: 1,
        range: null,
        // WAVE_TIMES/11/15 is the runtime's exclusion interval. Level 1004
        // ends at wave 15, so this card only participates through wave 10.
        excludedWaveRange: [11, 15],
        effect: { kind: 'expGain', amount: 5000 },
    },
    {
        id: 'RG_ALL_abl08_eff01',
        name: '攻击弱化',
        description: '敌方全体攻击降低5%',
        quality: 2,
        weight: 20,
        maxTimes: 10,
        range: null,
        effect: { kind: 'enemyAttackDecrease', amount: 500 },
    },
    { id: 'RG_ALL_abl09_eff01', name: '精英克星', description: '对 Boss 伤害增加 30%', quality: 3, weight: 10, maxTimes: 99, range: null, effect: { kind: 'bossVulnerability', amount: 3000 } },
    {
        id: 'RG_ALL_abl10_eff01',
        name: '齿轮升级',
        description: '随机 1 个齿轮升级',
        quality: 3,
        weight: 10,
        maxTimes: 99,
        range: null,
        // ConditionWaveTimes.check returns false inside the configured range,
        // so table condition WAVE_TIMES/0/10 makes this a wave-11+ card.
        excludedWaveRange: [0, 10],
        effect: { kind: 'gearUpgrade', amount: 1 },
    },
    {
        id: 'RG_ALL_abl11_eff01',
        name: '二级齿轮概率',
        description: '备战阶段免费刷新时，提升2级齿轮出现概率',
        quality: 3,
        weight: 10,
        maxTimes: 1,
        range: null,
        // WAVE_TIMES/11/15 is inverted by ConditionWaveTimes.check, so this
        // ability is available through wave 10 and excluded in waves 11..15.
        excludedWaveRange: [11, 15],
        // The shipped v18 configuration targets REWARD/3012. RewardDropConfig
        // contains level pools 3014/3015/3016 but no 3012, making this an
        // evidence-confirmed no-op rather than an alias for the level-2 pool.
        effect: { kind: 'prepareRewardWeight', amount: 20000, rewardId: 3012 },
    },
    {
        id: 'RG_ALL_abl12_eff01',
        name: '',
        description: '动力仓鼠周围的齿轮攻击提升20%',
        quality: 4,
        weight: 5,
        maxTimes: 1,
        range: null,
        effect: { kind: 'powerNearAttack', amount: 2000 },
    },
    { id: 'RG_ALL_abl13_eff01', name: '法术强化·1', description: '所有法术齿轮攻击增加 5%', quality: 2, weight: 20, maxTimes: 99, range: ['H12', 'H13'], effect: { kind: 'attackIncrease', amount: 500 } },
    { id: 'RG_ALL_abl14_eff01', name: '法术强化·2', description: '所有法术齿轮攻击增加 10%', quality: 3, weight: 10, maxTimes: 99, range: ['H12', 'H13'], effect: { kind: 'attackIncrease', amount: 1000 } },
    { id: 'RG_ALL_abl15_eff01', name: '法术强化·3', description: '所有法术齿轮攻击增加 15%', quality: 4, weight: 5, maxTimes: 99, range: ['H12', 'H13'], effect: { kind: 'attackIncrease', amount: 1500 } },
    {
        id: 'RG_ALL_abl16_eff01',
        name: '',
        description: '动力仓鼠周围的齿轮效率提升20%',
        quality: 4,
        weight: 5,
        maxTimes: 1,
        range: null,
        effect: { kind: 'powerNearWorker', amount: 2000 },
    },
    {
        id: 'RG_ALL_abl17_eff01',
        name: '',
        description: '立即恢复50%主基地生命',
        quality: 4,
        weight: 999,
        maxTimes: 99,
        range: null,
        homeHpPercentRange: [0, 50],
        // addBuff skips _buffTimesMap when noRestore=1, so this immediate
        // consumable never becomes a persistent stack and can appear again.
        noRestore: true,
        effect: { kind: 'immediateHomeHeal', amount: 5000 },
    },
    {
        id: 'RG_ALL_abl18_eff01',
        name: '',
        description: '每次战斗开始前恢复10%主基地生命',
        quality: 4,
        weight: 999,
        maxTimes: 1,
        range: null,
        homeHpPercentRange: [0, 75],
        effect: { kind: 'roundStartHomeHeal', amount: 1000 },
    },
    {
        id: 'RG_H01_abl01_eff01',
        name: '精英战士',
        description: '仓鼠战士攻击增加 10%',
        quality: 2,
        weight: 200,
        maxTimes: 1,
        range: ['H01'],
        effect: { kind: 'attackIncrease', amount: 1000 },
    },
    {
        id: 'RG_H01_abl02_eff01',
        group: 'RG_H01_abl02',
        minHeroStar: { heroId: 'H01', star: 3 },
        name: '鼠鼠重击·1',
        description: '仓鼠战士每攻击2次后，下次攻击必定暴击',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H01', 'H07'],
        effect: { kind: 'warriorComboCritical', amount: 0, attacksRequired: 3 },
    },
    {
        id: 'RG_H01_abl02_eff02',
        group: 'RG_H01_abl02',
        minHeroStar: { heroId: 'H01', star: 5 },
        name: '鼠鼠重击·2',
        description: '仓鼠战士每攻击2次后，下次攻击必定暴击',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H01', 'H07'],
        effect: { kind: 'warriorComboCritical', amount: 5000, attacksRequired: 3 },
    },
    {
        id: 'RG_H01_abl02_eff03',
        group: 'RG_H01_abl02',
        minHeroStar: { heroId: 'H01', star: 8 },
        name: '鼠鼠重击·3',
        description: '仓鼠战士每攻击1次后，下次攻击必定暴击',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H01', 'H07'],
        effect: { kind: 'warriorComboCritical', amount: 5000, attacksRequired: 2 },
    },
    {
        id: 'RG_H01_abl02_eff04',
        group: 'RG_H01_abl02',
        minHeroStar: { heroId: 'H01', star: 10 },
        name: '鼠鼠重击·4',
        description: '仓鼠战士每攻击1次后，下次攻击必定暴击，并回复生命值',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H01', 'H07'],
        // 1002_bf5 reuses the +5000 CRI_DMG one-shot and adds
        // healMax/hpRate=20000 when the combo reaches its threshold.
        effect: {
            kind: 'warriorComboCritical',
            amount: 5000,
            attacksRequired: 2,
            healMaxHpBasisPoints: 20000,
        },
    },
    {
        id: 'RG_H01_abl03_eff01',
        group: 'RG_H01_abl03',
        minHeroStar: { heroId: 'H01', star: 7 },
        name: '叠中叠',
        description: 'H01/H07 完成最后一击时，双方家族攻击增加 2%，最多 30 层',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H01', 'H07'],
        effect: { kind: 'warriorKillAttackIncrease', amount: 200, maxStacks: 30 },
    },
    {
        id: 'RG_H02_abl01_eff01',
        name: '精英射手',
        description: '仓鼠射手攻速增加 30%',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H02'],
        effect: { kind: 'attackSpeed', amount: 3000 },
    },
    {
        id: 'RG_H02_abl02_eff01',
        group: 'RG_H02_abl02',
        minHeroStar: { heroId: 'H02', star: 3 },
        name: '分裂射击·1',
        description: '仓鼠射手有 30% 概率额外攻击 1 个敌人',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H02', 'H07'],
        effect: { kind: 'splitShot', amount: 3000 },
    },
    {
        id: 'RG_H02_abl02_eff02',
        group: 'RG_H02_abl02',
        minHeroStar: { heroId: 'H02', star: 5 },
        name: '分裂射击·2',
        description: '仓鼠射手有 50% 概率额外攻击 1 个敌人',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H02', 'H07'],
        effect: { kind: 'splitShot', amount: 5000 },
    },
    {
        id: 'RG_H02_abl02_eff03',
        group: 'RG_H02_abl02',
        minHeroStar: { heroId: 'H02', star: 10 },
        name: '分裂射击·3',
        description: '仓鼠射手 100% 概率额外攻击 1 个敌人',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H02', 'H07'],
        effect: { kind: 'splitShot', amount: 10000 },
    },
    {
        id: 'RG_H02_abl03_eff01',
        group: 'RG_H02_abl03',
        minHeroStar: { heroId: 'H02', star: 7 },
        name: '弹幕时间',
        description: '6 秒后施放 2001_5：2 秒施法内按配置发射 9 枚 50% 攻击弹丸',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H02', 'H07'],
        effect: { kind: 'barrage', amount: 5000 },
    },
    {
        id: 'RG_H02_abl03_eff02',
        group: 'RG_H02_abl03',
        minHeroStar: { heroId: 'H02', star: 8 },
        name: '弹幕时间·延长',
        description: '6 秒后施放 2001_6：3 秒施法内实际发射 6 枚 50% 攻击弹丸',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H02', 'H07'],
        effect: { kind: 'barrage', amount: 5000 },
    },
    {
        id: 'RG_H03_abl01_eff01',
        group: 'RG_H03_abl01',
        minHeroStar: { heroId: 'H03', star: 2 },
        name: '精英法师',
        description: '仓鼠法师攻击增加 20%',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H03', 'H08'],
        effect: { kind: 'attackIncrease', amount: 2000 },
    },
    {
        id: 'RG_H03_abl02_eff01',
        group: 'RG_H03_abl02',
        minHeroStar: { heroId: 'H03', star: 1 },
        name: '可乐加冰',
        description: '仓鼠法师攻击有 30% 概率将敌人冰冻',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H03', 'H08'],
        effect: { kind: 'freeze', amount: 3000 },
    },
    {
        id: 'RG_H03_abl03_eff01',
        group: 'RG_H03_abl03',
        minHeroStar: { heroId: 'H03', star: 7 },
        name: '花生变形术',
        description: '仓鼠法师命中后将目标变形并眩晕 2 秒',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H03', 'H08'],
        effect: { kind: 'transform', amount: 0 },
    },
    {
        id: 'RG_H03_abl03_eff02',
        group: 'RG_H03_abl03',
        minHeroStar: { heroId: 'H03', star: 8 },
        name: '花生变形术·2',
        description: '版本 18 实际使变形目标自身造成伤害提高 30%，持续 2 秒',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H03', 'H08'],
        effect: { kind: 'transform', amount: 3000 },
    },
    {
        id: 'RG_H03_abl04_eff01',
        group: 'RG_H03_abl04',
        minHeroStar: { heroId: 'H03', star: 10 },
        name: '鼠鼠激光',
        description: '仓鼠法师施放 3001_5，以 50% 攻击伤害贯穿前方 100×300 区域',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H03', 'H08'],
        effect: { kind: 'penetratingLaser', amount: 5000 },
    },
    {
        id: 'RG_H04_abl01_eff01',
        name: '精英骑士',
        description: '仓鼠骑士生命增加 10%',
        quality: 2,
        weight: 200,
        maxTimes: 1,
        range: ['H04'],
        effect: { kind: 'hpIncrease', amount: 1000 },
    },
    {
        id: 'RG_H04_abl02_eff01',
        group: 'RG_H04_abl02',
        minHeroStar: { heroId: 'H04', star: 2 },
        name: '骑士活力·1',
        description: '仓鼠骑士每秒恢复生命值（版本18实际按攻击力2%结算）',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H04', 'H09'],
        effect: { kind: 'periodicSelfHeal', amount: 200 },
    },
    {
        id: 'RG_H04_abl02_eff02',
        group: 'RG_H04_abl02',
        minHeroStar: { heroId: 'H04', star: 3 },
        name: '骑士活力·2',
        description: '仓鼠骑士每秒恢复生命值（版本18实际按攻击力5%结算）',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H04', 'H09'],
        effect: { kind: 'periodicSelfHeal', amount: 500 },
    },
    {
        id: 'RG_H04_abl03_eff01',
        group: 'RG_H04_abl03',
        minHeroStar: { heroId: 'H04', star: 7 },
        name: '鼠鼠盾墙·1',
        description: 'H04/H09 每 5 秒获得持续 2 秒的 30% 伤害减免',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H04', 'H09'],
        effect: { kind: 'shieldWall', amount: 3000 },
    },
    {
        id: 'RG_H04_abl03_eff02',
        group: 'RG_H04_abl03',
        minHeroStar: { heroId: 'H04', star: 10 },
        name: '鼠鼠盾墙·2',
        description: 'H04/H09 每 5 秒获得持续 2 秒的 30% 伤害减免，并反弹减伤后伤害的 30%',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H04', 'H09'],
        effect: { kind: 'shieldWall', amount: 3000 },
    },
    {
        id: 'RG_H04_abl04_eff01',
        group: 'RG_H04_abl04',
        minHeroStar: { heroId: 'H04', star: 8 },
        name: '进击的鼠鼠',
        description: 'H04/H09 的普通攻击有 30% 概率直接击飞非 Boss 怪物',
        quality: 2,
        weight: 100,
        maxTimes: 1,
        range: ['H04', 'H09'],
        effect: { kind: 'attackKillFly', amount: 3000 },
    },
    {
        id: 'RG_H11_abl02_eff01',
        group: 'RG_H11_abl02',
        minHeroStar: { heroId: 'H11', star: 2 },
        name: '护盾生成',
        description: '治疗齿轮溢出的治疗量会转化为护盾值',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H11'],
        effect: { kind: 'healToShield', amount: 1 },
    },
    {
        id: 'RG_H11_abl01_eff02',
        group: 'RG_H11_abl01',
        minHeroStar: { heroId: 'H11', star: 5 },
        name: '基地修复',
        description: '治疗齿轮为基地恢复的生命值提升至攻击力100%',
        quality: 2,
        weight: 200,
        maxTimes: 1,
        range: ['H11'],
        effect: { kind: 'skillReplacement', amount: 0 },
    },
    {
        id: 'RG_H11_abl03_eff01',
        group: 'RG_H11_abl03',
        minHeroStar: { heroId: 'H11', star: 7 },
        name: '群体治疗',
        description: '治疗齿轮每次治疗会作用多个目标',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H11'],
        // The shipped v18 addEffective switch has no HEAL_MORE_TARGER case,
        // and no code path reads this effect id/times as a target-count flag.
        // Keep the selectable one-time row without inventing a target count.
        effect: { kind: 'runtimeNoOp', amount: 0 },
    },
    {
        id: 'RG_H12_abl01_eff01',
        name: '高压电击·1',
        description: '雷云造成伤害时会造成麻痹效果，持续1秒',
        quality: 2,
        weight: 200,
        maxTimes: 1,
        range: ['H12', 'H08'],
        group: 'RG_H12_abl01',
        minHeroStar: { heroId: 'H12', star: 1 },
        effect: { kind: 'paralysis', amount: 1000 },
    },
    {
        id: 'RG_H12_abl01_eff02',
        name: '高压电击·2',
        description: '雷云造成伤害时会造成麻痹效果，持续2秒',
        quality: 2,
        weight: 200,
        maxTimes: 1,
        range: ['H12', 'H08'],
        group: 'RG_H12_abl01',
        minHeroStar: { heroId: 'H12', star: 3 },
        effect: { kind: 'paralysis', amount: 2000 },
    },
    {
        id: 'RG_H12_abl02_eff01',
        name: '十万伏特',
        description: '雷云造成的伤害必定暴击',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H12', 'H08'],
        minHeroStar: { heroId: 'H12', star: 2 },
        effect: { kind: 'criticalRate', amount: 10000 },
    },
    {
        id: 'RG_H12_abl03_eff01',
        name: '百万伏特',
        description: '雷云造成的暴击伤害增加50%',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H12', 'H08'],
        minHeroStar: { heroId: 'H12', star: 7 },
        effect: { kind: 'criticalDamage', amount: 5000 },
    },
    {
        id: 'RG_H12_abl04_eff01',
        name: '感电效应',
        description: '目标后续受到的伤害增加10%',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H12', 'H08'],
        minHeroStar: { heroId: 'H12', star: 10 },
        effect: { kind: 'skillReplacement', amount: 0 },
    },
    {
        id: 'RG_H13_abl01_eff01',
        name: '玉米弹射·1',
        description: '火炮齿轮发射的玉米粒可以弹射增加至4次',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H13', 'H09'],
        group: 'RG_H13_abl01',
        minHeroStar: { heroId: 'H13', star: 2 },
        effect: { kind: 'bounceTimes', amount: 2 },
    },
    {
        id: 'RG_H13_abl01_eff02',
        name: '玉米弹射·2',
        description: '火炮齿轮发射的玉米粒可以弹射增加至6次',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H13', 'H09'],
        group: 'RG_H13_abl01',
        minHeroStar: { heroId: 'H13', star: 3 },
        effect: { kind: 'bounceTimes', amount: 4 },
    },
    {
        id: 'RG_H13_abl02_eff01',
        name: '爆米花弹射·1',
        description: '火炮齿轮发射的玉米粒会变成爆米花，每次弹射伤害增加10%',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H13', 'H09'],
        group: 'RG_H13_abl02',
        minHeroStar: { heroId: 'H13', star: 7 },
        effect: { kind: 'skillReplacement', amount: 0 },
    },
    {
        id: 'RG_H13_abl02_eff02',
        name: '爆米花弹射·2',
        description: '火炮齿轮发射的玉米粒会变成爆米花，每次弹射伤害增加10%，最后一次弹射会发生爆炸造成范围伤害',
        quality: 4,
        weight: 50,
        maxTimes: 1,
        range: ['H13', 'H09'],
        group: 'RG_H13_abl02',
        minHeroStar: { heroId: 'H13', star: 10 },
        effect: { kind: 'skillReplacement', amount: 0 },
    },
] as const;

export function weightedSampleWithoutReplacement<T extends { weight: number }>(
    values: readonly T[],
    count: number,
    random: () => number = Math.random,
): T[] {
    const remaining = values.filter((value) => value.weight > 0).map((value) => ({ value, weight: value.weight }));
    const result: T[] = [];
    while (result.length < count && remaining.length > 0) {
        const total = remaining.reduce((sum, entry) => sum + entry.weight, 0);
        let roll = Math.min(0.999999999999, Math.max(0, random())) * total;
        let index = remaining.length - 1;
        for (let cursor = 0; cursor < remaining.length; cursor += 1) {
            roll -= remaining[cursor].weight;
            if (roll < 0) {
                index = cursor;
                break;
            }
        }
        result.push(remaining[index].value);
        remaining.splice(index, 1);
    }
    return result;
}

export function drawWeightedTraits(
    pool: readonly TraitDefinition[],
    usedHeroIds: ReadonlySet<string>,
    times: ReadonlyMap<TraitId, number>,
    count = 3,
    minimumQuality = 0,
    random: () => number = Math.random,
    waveNumber = 1,
    homeHpPercent = 100,
    heroStars: ReadonlyMap<string, number> = new Map(),
): TraitDefinition[] {
    // BagLikeBuffManager scans the table from the end and keeps the first
    // verified row for each group. For star-versioned rows this means the
    // highest requirement satisfied by the saved hero star is the only row
    // that can enter the weighted pool.
    const verifiedGroupRows = new Map<string, TraitDefinition>();
    for (const trait of pool) {
        if (!trait.group) continue;
        const requirement = trait.minHeroStar;
        if (requirement && (heroStars.get(requirement.heroId) || 0) < requirement.star) continue;
        const previous = verifiedGroupRows.get(trait.group);
        if (!previous || (requirement?.star || 0) >= (previous.minHeroStar?.star || 0)) {
            verifiedGroupRows.set(trait.group, trait);
        }
    }
    const eligible = pool.filter((trait) =>
        (trait.noRestore || (times.get(trait.id) || 0) < trait.maxTimes)
        && (!trait.minHeroStar || (heroStars.get(trait.minHeroStar.heroId) || 0) >= trait.minHeroStar.star)
        && (!trait.group || verifiedGroupRows.get(trait.group) === trait)
        && (!trait.range || trait.range.some((heroId) => usedHeroIds.has(heroId)))
        && (!trait.excludedWaveRange
            || waveNumber < trait.excludedWaveRange[0]
            || waveNumber > trait.excludedWaveRange[1])
        && (!trait.homeHpPercentRange
            || (homeHpPercent >= trait.homeHpPercentRange[0]
                && homeHpPercent <= trait.homeHpPercentRange[1])),
    );
    const result = weightedSampleWithoutReplacement(eligible, count, random);
    if (result.length === 0 || result.some((trait) => trait.quality >= minimumQuality)) return result;

    for (let quality = minimumQuality; quality >= 2; quality -= 1) {
        const highQuality = eligible.filter((trait) => trait.quality >= quality);
        const replacement = weightedSampleWithoutReplacement(highQuality, 1, random)[0];
        if (replacement) {
            result[Math.floor(random() * result.length)] = replacement;
            break;
        }
    }
    return result;
}

export function traitWarriorComboProfile(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
    heroId: string,
): WarriorComboProfile | null {
    for (const trait of pool) {
        if (trait.effect.kind !== 'warriorComboCritical'
            || (times.get(trait.id) || 0) <= 0
            || (trait.range && trait.range.indexOf(heroId) < 0)) continue;
        return {
            traitId: trait.id,
            attacksRequired: trait.effect.attacksRequired || 0,
            bonusCritDamage: trait.effect.amount,
            healMaxHpBasisPoints: trait.effect.healMaxHpBasisPoints || 0,
        };
    }
    return null;
}

// PassivitySkillData counts completed skill-index-0 attacks. Reaching the
// configured count adds a one-use critical buff. When that buff is consumed,
// its attack is deliberately not counted toward the next cycle.
export function completeWarriorComboAttack(
    state: WarriorComboState,
    profile: WarriorComboProfile,
    criticalBuffConsumed: boolean,
): WarriorComboCompletion {
    if (criticalBuffConsumed) {
        return { completedAttacks: 0, criticalReady: false, triggered: false };
    }
    if (state.criticalReady) return { ...state, triggered: false };
    const completedAttacks = state.completedAttacks + 1;
    if (completedAttacks < profile.attacksRequired) {
        return { completedAttacks, criticalReady: false, triggered: false };
    }
    return { completedAttacks: 0, criticalReady: true, triggered: true };
}

export function traitWarriorKillAttackProfile(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
): WarriorKillAttackProfile | null {
    for (const trait of pool) {
        if (trait.effect.kind !== 'warriorKillAttackIncrease' || (times.get(trait.id) || 0) <= 0) continue;
        return {
            range: trait.range || [],
            attackIncreasePerStack: trait.effect.amount,
            maxStacks: trait.effect.maxStacks || 0,
        };
    }
    return null;
}

// Version 18 dispatches BATTLE_MONSTER_DIE with one killerId. Despite the card
// saying "participated", only an H01/H07 final blow advances the shared stack.
export function completeWarriorKillAttackStack(
    stacks: number,
    profile: WarriorKillAttackProfile,
    killerHeroId: string,
): WarriorKillAttackCompletion {
    const current = Math.max(0, Math.min(profile.maxStacks, Math.floor(stacks)));
    if (profile.range.indexOf(killerHeroId) < 0 || current >= profile.maxStacks) {
        return { stacks: current, triggered: false };
    }
    return { stacks: current + 1, triggered: true };
}

export function warriorKillAttackMultiplier(
    profile: WarriorKillAttackProfile | null,
    stacks: number,
    heroId: string,
): number {
    if (!profile || profile.range.indexOf(heroId) < 0) return 1;
    const appliedStacks = Math.max(0, Math.min(profile.maxStacks, Math.floor(stacks)));
    return 1 + appliedStacks * profile.attackIncreasePerStack / 10000;
}

// BagLikeView stores floor(10000 * current / max); ConditionBaseHp divides it
// by 100 before applying its inclusive minimum/maximum comparison.
export function bagLikeHomeHpPercent(currentHp: number, maxHp: number): number {
    if (maxHp <= 0) return 0;
    return Math.floor(10000 * currentHp / maxHp) / 100;
}

// BattleManager.healHome floors a max-HP ratio and BattleUnit.heal clamps the
// resulting current HP to max HP.
export function resolveHomeHeal(
    currentHp: number,
    maxHp: number,
    healBasisPoints: number,
): number {
    return Math.min(maxHp, currentHp + Math.floor(maxHp * healBasisPoints / 10000));
}

// BagLikeBuffManager stores HEAL_HOME/ROUND as one persistent `round` value.
// BagLikeBuffModel reads that value on BAGLIKE_BATTLE_ROUND_START, so the
// latest active table entry replaces rather than stacks with an older value.
export function traitRoundStartHomeHealBasisPoints(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
): number {
    let amount = 0;
    for (const trait of pool) {
        if (trait.effect.kind === 'roundStartHomeHeal' && (times.get(trait.id) || 0) > 0) {
            amount = trait.effect.amount;
        }
    }
    return amount;
}

// BagLilkeManager.upgradeOneGear scans the numeric-SID keyed placed-item map in
// ascending SID order, excludes POWER and entries without nextId, then performs one
// Math.floor(Math.random() * count) choice. Returning the chosen item keeps the
// Cocos-independent rule deterministic while the caller owns rendering/events.
export function chooseBagLikeGearUpgrade<TId extends string, TItem extends BagLikeGearUpgradeItem<TId>>(
    items: readonly TItem[],
    nextIdFor: (id: TId) => TId | null,
    random: () => number = Math.random,
): BagLikeGearUpgradeResult<TItem, TId> | null {
    const eligible = items
        .filter((item) => item.location === 'grid' && !item.isPower)
        .map((item) => ({ item, nextId: nextIdFor(item.id) }))
        .filter((entry): entry is { item: TItem; nextId: TId } => entry.nextId !== null)
        .sort((left, right) => left.item.sid - right.item.sid);
    if (eligible.length === 0) return null;
    const index = Math.floor(Math.min(0.999999999999, Math.max(0, random())) * eligible.length);
    const selected = eligible[index];
    return {
        item: selected.item,
        previousId: selected.item.id,
        nextId: selected.nextId,
    };
}

export function isRecommendedTrait(trait: TraitDefinition, choices: readonly TraitDefinition[]): boolean {
    const ranked = choices
        .filter((choice) => choice.quality >= 3)
        .sort((left, right) => right.quality - left.quality || Number(Boolean(right.range && right.range.length <= 2)) - Number(Boolean(left.range && left.range.length <= 2)));
    const best = ranked[0];
    return Boolean(best && trait.quality === best.quality && Boolean(trait.range && trait.range.length <= 2) === Boolean(best.range && best.range.length <= 2));
}

export function traitEffectAmount(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
    kind: TraitEffectKind,
    heroId: string,
): number {
    return pool.reduce((total, trait) => {
        if (trait.effect.kind !== kind || (trait.range && trait.range.indexOf(heroId) < 0)) return total;
        return total + trait.effect.amount * (times.get(trait.id) || 0);
    }, 0);
}

export function traitH04ShieldWallProfile(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
    heroId: string,
): H04ShieldWallProfile | null {
    const candidates: ReadonlyArray<H04ShieldWallProfile['traitId']> = [
        'RG_H04_abl03_eff02',
        'RG_H04_abl03_eff01',
    ];
    for (const traitId of candidates) {
        const trait = pool.find((entry) => entry.id === traitId);
        if (!trait || (times.get(traitId) || 0) <= 0 || !trait.range || trait.range.indexOf(heroId) < 0) continue;
        return {
            traitId,
            damageResistance: trait.effect.amount,
            counterattackRatio: traitId === 'RG_H04_abl03_eff02' ? 3000 : 0,
        };
    }
    return null;
}

export function traitH03TransformProfile(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
    heroId: string,
): H03TransformProfile | null {
    const candidates: ReadonlyArray<H03TransformProfile['traitId']> = [
        'RG_H03_abl03_eff02',
        'RG_H03_abl03_eff01',
    ];
    for (const traitId of candidates) {
        const trait = pool.find((entry) => entry.id === traitId);
        if (!trait || (times.get(traitId) || 0) <= 0 || !trait.range || trait.range.indexOf(heroId) < 0) continue;
        return {
            traitId,
            durationSeconds: 2,
            disablesTarget: traitId === 'RG_H03_abl03_eff01',
            outgoingDamageIncrease: trait.effect.amount,
        };
    }
    return null;
}

export function traitH03LaserProfile(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
    heroId: string,
): H03LaserProfile | null {
    const traitId: H03LaserProfile['traitId'] = 'RG_H03_abl04_eff01';
    const trait = pool.find((entry) => entry.id === traitId);
    if (!trait || (times.get(traitId) || 0) <= 0 || !trait.range || trait.range.indexOf(heroId) < 0) return null;
    return {
        traitId,
        skillId: '3001_5',
        initialCooldownSeconds: 0,
        cooldownSeconds: 4,
        castTimeSeconds: 1,
        behaviorDelaySeconds: 0.3,
        castingRange: 50,
        width: 100,
        height: 300,
        maxTargets: 999,
        effectRatio: trait.effect.amount,
    };
}

export function traitH02BarrageProfile(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
    heroId: string,
): H02BarrageProfile | null {
    const candidates: ReadonlyArray<H02BarrageProfile['traitId']> = [
        'RG_H02_abl03_eff02',
        'RG_H02_abl03_eff01',
    ];
    for (const traitId of candidates) {
        const trait = pool.find((entry) => entry.id === traitId);
        if (!trait || (times.get(traitId) || 0) <= 0 || !trait.range || trait.range.indexOf(heroId) < 0) continue;
        const upgraded = traitId === 'RG_H02_abl03_eff02';
        return {
            traitId,
            skillId: upgraded ? '2001_6' : '2001_5',
            initialCooldownSeconds: 6,
            cooldownSeconds: 6,
            castTimeSeconds: upgraded ? 3 : 2,
            configuredShotDelays: upgraded
                ? [0.5, 1, 1.5, 2, 2.5, 3, 3.5]
                : [0.2, 0.4, 0.6, 0.6, 0.8, 1, 1.2, 1.4, 1.6],
            effectRatio: trait.effect.amount,
            projectileSpeed: 700,
        };
    }
    return null;
}

export function traitPrepareRewardWeightModifiers(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
): PrepareRewardWeightModifier[] {
    const modifiers: PrepareRewardWeightModifier[] = [];
    for (const trait of pool) {
        if (trait.effect.kind !== 'prepareRewardWeight' || trait.effect.rewardId === undefined) continue;
        if ((times.get(trait.id) || 0) <= 0) continue;
        modifiers.push({
            rewardType: 'REWARD' as const,
            rewardId: trait.effect.rewardId,
            multiplier: trait.effect.amount,
        });
    }
    return modifiers;
}

// BagLikeBuffManager.getExpMultiple returns 1 + accumulated EXP_GAIN / 10000.
// The shipped card is capped at one selection, but summing the active effects
// preserves the original manager semantics for any future EXP_GAIN entries.
export function traitExpMultiplier(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
): number {
    const gain = pool.reduce((total, trait) => {
        if (trait.effect.kind !== 'expGain') return total;
        return total + trait.effect.amount * (times.get(trait.id) || 0);
    }, 0);
    return 1 + gain / 10000;
}

// BagLikeBuffManager routes rangeType MONSTER into the shared monster attribute
// bucket. BattleAttr reads that bucket for ordinary monsters, elites and bosses,
// and BattleUnit applies ATK_DEC as max(0, 1 + (ATK_INC - ATK_DEC) / 10000).
export function traitMonsterAttackMultiplier(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
): number {
    const decrease = pool.reduce((total, trait) => {
        if (trait.effect.kind !== 'enemyAttackDecrease') return total;
        return total + trait.effect.amount * (times.get(trait.id) || 0);
    }, 0);
    return Math.max(0, 1 - decrease / 10000);
}

// POWER_NEAR_ATK_UP stores the decoded 2000 basis points as atkInc=0.2.
// The placement predicate is deliberately separate because only gears occupying
// one of the power core's four direct neighbor cells receive this multiplier.
export function traitPowerNearAttackMultiplier(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
): number {
    const increase = pool.reduce((total, trait) => {
        if (trait.effect.kind !== 'powerNearAttack') return total;
        return total + trait.effect.amount * (times.get(trait.id) || 0);
    }, 0);
    return 1 + increase / 10000;
}

// POWER_NEAR_WORKER_UP uses the same direct-neighbor predicate as
// POWER_NEAR_ATK_UP, but multiplies each later worker-progress notification.
// WorkerBar keeps fractional progress and also multiplies the displayed rate.
export function traitPowerNearWorkerMultiplier(
    pool: readonly TraitDefinition[],
    times: ReadonlyMap<TraitId, number>,
): number {
    const increase = pool.reduce((total, trait) => {
        if (trait.effect.kind !== 'powerNearWorker') return total;
        return total + trait.effect.amount * (times.get(trait.id) || 0);
    }, 0);
    return 1 + increase / 10000;
}

export const TRAIT_REROLL_MAX = 10;
export const TRAIT_REROLL_MIN_QUALITY = 4;
export const TRAIT_TAKE_ALL_MAX = 3;
