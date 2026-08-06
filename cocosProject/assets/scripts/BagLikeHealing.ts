export const H11_SEARCH_RANGE = 400;
export const H11_BEHAVIOR_RADIUS = 200;
export const H11_UNIT_HEAL_BASIS_POINTS = 10000;
export const H11_HOME_HEAL_BASIS_POINTS = 5000;

export type H11HealingTarget = {
    uid: number;
    hp: number;
    maxHp: number;
    x: number;
    y: number;
    dead?: boolean;
};

export type H11HealingResult = {
    cast: boolean;
    targetUid: number | null;
    requestedUnitHeal: number;
    unitHpAfter: number | null;
    requestedHomeHeal: number;
    homeHpAfter: number;
    eventOrder: readonly ('unit-heal' | 'home-heal')[];
};

const distanceSquared = (leftX: number, leftY: number, rightX: number, rightY: number): number => {
    const x = leftX - rightX;
    const y = leftY - rightY;
    return x * x + y * y;
};

const hpPercentage = (target: H11HealingTarget): number => target.maxHp > 0
    ? target.hp / target.maxHp
    : 0;

function shuffled<T>(values: readonly T[], random: () => number): T[] {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const roll = Math.min(0.999999999999, Math.max(0, random()));
        const swapIndex = Math.floor(roll * (index + 1));
        [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
}

export function resolveH11HealAmount(casterAttack: number, ratioBasisPoints: number): number {
    return Math.floor(Math.max(0, casterAttack * ratioBasisPoints / 10000));
}

export function applyH11Heal(currentHp: number, maxHp: number, requestedHeal: number): number {
    return Math.min(maxHp, currentHp + Math.max(0, requestedHeal));
}

export function selectH11HealingTarget(
    casterX: number,
    casterY: number,
    friendlyUnits: readonly H11HealingTarget[],
    random: () => number = Math.random,
): H11HealingTarget | null {
    const liveInSearchRange = friendlyUnits.filter((unit) => !unit.dead && distanceSquared(
        casterX,
        casterY,
        unit.x,
        unit.y,
    ) <= H11_SEARCH_RANGE * H11_SEARCH_RANGE);
    if (liveInSearchRange.length === 0) return null;

    // ZL_1101 first resolves the lowest-HP main target. B_ZL_1101 then
    // confounds the units in a 200-radius circle around it before applying the
    // stable lowest-HP-percentage sort and taking one target.
    const mainTarget = [...liveInSearchRange].sort(
        (left, right) => hpPercentage(left) - hpPercentage(right),
    )[0];
    const behaviorTargets = shuffled(
        liveInSearchRange.filter((unit) => distanceSquared(
            mainTarget.x,
            mainTarget.y,
            unit.x,
            unit.y,
        ) <= H11_BEHAVIOR_RADIUS * H11_BEHAVIOR_RADIUS),
        random,
    );
    behaviorTargets.sort((left, right) => hpPercentage(left) - hpPercentage(right));
    return behaviorTargets[0] ?? null;
}

export function resolveH11HealingAction(args: {
    casterX: number;
    casterY: number;
    casterAttack: number;
    friendlyUnits: readonly H11HealingTarget[];
    homeHp: number;
    homeMaxHp: number;
    random?: () => number;
}): H11HealingResult {
    const target = selectH11HealingTarget(
        args.casterX,
        args.casterY,
        args.friendlyUnits,
        args.random,
    );
    if (!target) {
        return {
            cast: false,
            targetUid: null,
            requestedUnitHeal: 0,
            unitHpAfter: null,
            requestedHomeHeal: 0,
            homeHpAfter: args.homeHp,
            eventOrder: [],
        };
    }

    const requestedUnitHeal = resolveH11HealAmount(args.casterAttack, H11_UNIT_HEAL_BASIS_POINTS);
    const requestedHomeHeal = resolveH11HealAmount(args.casterAttack, H11_HOME_HEAL_BASIS_POINTS);
    return {
        cast: true,
        targetUid: target.uid,
        requestedUnitHeal,
        unitHpAfter: applyH11Heal(target.hp, target.maxHp, requestedUnitHeal),
        requestedHomeHeal,
        homeHpAfter: applyH11Heal(args.homeHp, args.homeMaxHp, requestedHomeHeal),
        eventOrder: ['unit-heal', 'home-heal'],
    };
}
