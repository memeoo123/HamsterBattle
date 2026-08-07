export const H11_BASE_ATTACK = 63;
export const H04_PERIODIC_HEAL_INTERVAL_SECONDS = 1;
export const H11_BASE_SKILL_ID = 'ZL_1101' as const;
export const H11_UNIT_HEAL_RATIO = 10000;
export const H11_HOME_HEAL_RATIO = 5000;
export const H11_TARGET_RADIUS = 200;
export const H11_POWER_PER_TRIGGER = 9;
export const H11_GEAR_SHAPE = [[0, 0], [1, 0]] as const;

export type H11SkillId = 'ZL_1101' | 'ZL_1103';
export type H11ReplacementTraitId = 'RG_H11_abl01_eff02';

export type H11HealingProfile = {
    skillId: H11SkillId;
    unitHealRatio: number;
    homeHealRatio: number;
};

export function replaceH11Skill(_current: H11SkillId, _traitId: H11ReplacementTraitId): H11SkillId {
    return 'ZL_1103';
}

export function resolveH11HealingProfileForSkill(skillId: H11SkillId): H11HealingProfile {
    return {
        skillId,
        unitHealRatio: H11_UNIT_HEAL_RATIO,
        homeHealRatio: skillId === 'ZL_1103' ? 10000 : H11_HOME_HEAL_RATIO,
    };
}

export type H11HealingUnit = {
    id: number | string;
    hp: number;
    maxHp: number;
    x: number;
    y: number;
    alive?: boolean;
};

export type H11HealEntry = {
    id: number | string;
    rawAmount: number;
    appliedAmount: number;
    shieldAmount: number;
};

export type H11HealingPlan = {
    primaryTargetId: number | string;
    unitHeals: H11HealEntry[];
    homeRawAmount: number;
    homeAppliedAmount: number;
};

export type H11HealingInput = {
    attack: number;
    allies: readonly H11HealingUnit[];
    homeHp: number;
    homeMaxHp: number;
    healingIncreaseBasisPoints?: number;
    unitHealRatio?: number;
    homeHealRatio?: number;
    radius?: number;
    maxUnitTargets?: number;
    healToShield?: boolean;
    random?: () => number;
};

export type ShieldedDamageResult = {
    hp: number;
    shield: number;
    hpDamage: number;
    shieldDamage: number;
};

export function h11HealAmount(attack: number, ratio: number, healingIncreaseBasisPoints = 0): number {
    const bonus = 1 + healingIncreaseBasisPoints / 10000;
    return Math.floor(Math.max(0, attack * ratio / 10000 * bonus));
}

export type PeriodicAttackHealInput = {
    hp: number;
    maxHp: number;
    attack: number;
    ratio: number;
    timer: number;
    elapsed: number;
    interval?: number;
    healingIncreaseBasisPoints?: number;
};

export type PeriodicAttackHealResult = {
    hp: number;
    timer: number;
    ticks: number;
    rawAmount: number;
    appliedAmount: number;
};

/**
 * Version 18 routes H04's 4001_bh1/4001_bh2 through the generic `heal`
 * behavior. Despite the card copy saying max HP, that handler multiplies the
 * caster's attack by amount/10000 and floors the result once per tick.
 */
export function periodicAttackHealAmount(
    attack: number,
    ratio: number,
    healingIncreaseBasisPoints = 0,
): number {
    const bonus = 1 + healingIncreaseBasisPoints / 10000;
    return Math.floor(Math.max(0, attack * ratio / 10000 * bonus));
}

export function advancePeriodicAttackHeal(input: PeriodicAttackHealInput): PeriodicAttackHealResult {
    const interval = Math.max(Number.EPSILON, input.interval ?? H04_PERIODIC_HEAL_INTERVAL_SECONDS);
    let timer = Math.max(0, input.timer) - Math.max(0, input.elapsed);
    let ticks = 0;
    while (timer <= 0) {
        ticks += 1;
        timer += interval;
    }
    const rawAmount = periodicAttackHealAmount(
        input.attack,
        input.ratio,
        input.healingIncreaseBasisPoints,
    );
    const startHp = Math.max(0, Math.min(input.hp, input.maxHp));
    const hp = Math.min(input.maxHp, startHp + rawAmount * ticks);
    return {
        hp,
        timer,
        ticks,
        rawAmount,
        appliedAmount: hp - startHp,
    };
}

/**
 * BattleAttr.hurt consumes the additive heal shield before HP. Exact shield
 * exhaustion leaves HP unchanged; only the remaining damage spills into HP.
 */
export function applyShieldedDamage(hp: number, shield: number, damage: number): ShieldedDamageResult {
    const safeHp = Math.max(0, hp);
    const safeShield = Math.max(0, shield);
    const safeDamage = Math.max(0, damage);
    const shieldDamage = Math.min(safeShield, safeDamage);
    const hpDamage = Math.min(safeHp, safeDamage - shieldDamage);
    return {
        hp: safeHp - hpDamage,
        shield: safeShield - shieldDamage,
        hpDamage,
        shieldDamage,
    };
}

function shuffled<T>(values: readonly T[], random: () => number): T[] {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const roll = Math.min(0.999999999999, Math.max(0, random()));
        const swapIndex = Math.floor(roll * (index + 1));
        [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
}

const hpPercentage = (unit: H11HealingUnit): number => unit.maxHp > 0 ? unit.hp / unit.maxHp : 1;

function lowestHpFirst(units: readonly H11HealingUnit[], random: () => number): H11HealingUnit[] {
    return shuffled(units, random).sort((left, right) => hpPercentage(left) - hpPercentage(right));
}

/**
 * Reproduces ZL_1101 -> B_ZL_1101/B_ZL_1102. The skill first needs a living
 * friendly unit as its global lowest-HP% cast target. Unit healing is then
 * selected in the recovered 200-radius target circle; home repair is emitted
 * by the same successful cast.
 */
export function resolveH11Healing(input: H11HealingInput): H11HealingPlan | null {
    const random = input.random ?? Math.random;
    const living = input.allies.filter((unit) => unit.alive !== false && unit.hp > 0 && unit.maxHp > 0);
    if (living.length === 0) return null;

    const primary = lowestHpFirst(living, random)[0];
    const radius = input.radius ?? H11_TARGET_RADIUS;
    const maxUnitTargets = Math.max(1, Math.floor(input.maxUnitTargets ?? 1));
    const nearby = living.filter((unit) => Math.hypot(unit.x - primary.x, unit.y - primary.y) <= radius);
    const selected = lowestHpFirst(nearby, random).slice(0, maxUnitTargets);
    const unitRawAmount = h11HealAmount(
        input.attack,
        input.unitHealRatio ?? H11_UNIT_HEAL_RATIO,
        input.healingIncreaseBasisPoints,
    );
    const homeRawAmount = h11HealAmount(
        input.attack,
        input.homeHealRatio ?? H11_HOME_HEAL_RATIO,
        input.healingIncreaseBasisPoints,
    );

    return {
        primaryTargetId: primary.id,
        unitHeals: selected.map((unit) => {
            const appliedAmount = Math.max(0, Math.min(unitRawAmount, unit.maxHp - unit.hp));
            return {
                id: unit.id,
                rawAmount: unitRawAmount,
                appliedAmount,
                shieldAmount: input.healToShield ? unitRawAmount - appliedAmount : 0,
            };
        }),
        homeRawAmount,
        homeAppliedAmount: Math.max(0, Math.min(homeRawAmount, input.homeMaxHp - input.homeHp)),
    };
}
