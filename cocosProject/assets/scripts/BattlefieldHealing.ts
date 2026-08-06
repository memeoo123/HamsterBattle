export const H11_BASE_ATTACK = 63;
export const H11_UNIT_HEAL_RATIO = 10000;
export const H11_HOME_HEAL_RATIO = 5000;
export const H11_TARGET_RADIUS = 200;
export const H11_POWER_PER_TRIGGER = 9;
export const H11_GEAR_SHAPE = [[0, 0], [1, 0]] as const;

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
    random?: () => number;
};

export function h11HealAmount(attack: number, ratio: number, healingIncreaseBasisPoints = 0): number {
    const bonus = 1 + healingIncreaseBasisPoints / 10000;
    return Math.floor(Math.max(0, attack * ratio / 10000 * bonus));
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
        unitHeals: selected.map((unit) => ({
            id: unit.id,
            rawAmount: unitRawAmount,
            appliedAmount: Math.max(0, Math.min(unitRawAmount, unit.maxHp - unit.hp)),
        })),
        homeRawAmount,
        homeAppliedAmount: Math.max(0, Math.min(homeRawAmount, input.homeMaxHp - input.homeHp)),
    };
}
