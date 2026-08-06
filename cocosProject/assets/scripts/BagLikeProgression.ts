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
    | 'RG_H02_abl01_eff01'
    | 'RG_H02_abl02_eff01'
    | 'RG_H03_abl01_eff01'
    | 'RG_H03_abl02_eff01'
    | 'RG_H04_abl01_eff01'
    | 'RG_H12_abl01_eff01'
    | 'RG_H12_abl01_eff02'
    | 'RG_H12_abl02_eff01'
    | 'RG_H12_abl03_eff01'
    | 'RG_H12_abl04_eff01';

export type TraitEffectKind = 'attackIncrease' | 'attackSpeed' | 'bossVulnerability' | 'criticalDamage' | 'criticalRate' | 'enemyAttackDecrease' | 'expGain' | 'gearUpgrade' | 'immediateHomeHeal' | 'paralysis' | 'powerNearAttack' | 'powerNearWorker' | 'prepareRewardWeight' | 'roundStartHomeHeal' | 'skillReplacement' | 'splitShot' | 'freeze' | 'hpIncrease' | 'warriorComboCritical';

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
        name: '分裂射击·1',
        description: '仓鼠射手有 30% 概率额外攻击 1 个敌人',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H02'],
        effect: { kind: 'splitShot', amount: 3000 },
    },
    {
        id: 'RG_H03_abl01_eff01',
        name: '精英法师',
        description: '仓鼠法师攻击增加 20%',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H03'],
        effect: { kind: 'attackIncrease', amount: 2000 },
    },
    {
        id: 'RG_H03_abl02_eff01',
        name: '可乐加冰',
        description: '仓鼠法师攻击有 30% 概率将敌人冰冻',
        quality: 3,
        weight: 100,
        maxTimes: 1,
        range: ['H03'],
        effect: { kind: 'freeze', amount: 3000 },
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
