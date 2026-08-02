export const BATTLE_RAND_BASE = 10000;
export const BASE_MISS_FACTOR = 5000;
export const BASE_CRIT_FACTOR = 15000;
export const DEFEAT_MULTIPLIERS = [
    0.95, 0.9025, 0.8574, 0.8145, 0.7738,
    0.7351, 0.6983, 0.6634, 0.6302, 0.5987,
    0.5688, 0.5404, 0.5133, 0.4877, 0.4633,
] as const;

export type HeroAttackType = 'HAMSTER' | 'WHEEL' | null;
export type DamageStatus = 'normal' | 'miss' | 'critical';

export type CombatAttributes = {
    dodgeRate: number;
    critRate: number;
    critDamage: number;
    damageIncrease: number;
    damageResistance: number;
    heroResistance: number;
    towerResistance: number;
    bossIncrease: number;
    attackSpeed: number;
};

export type DamageRolls = {
    dodge: number;
    critical: number;
};

export type DamageInput = {
    attack: number;
    effectRatio: number;
    sourceType: HeroAttackType;
    source: CombatAttributes;
    target: CombatAttributes;
    targetIsBoss: boolean;
    rolls: DamageRolls;
    forcedCritical?: boolean;
};

export type DamageResult = {
    value: number;
    rawValue: number;
    status: DamageStatus;
    hitFactor: number;
    critFactor: number;
    coefficient: number;
};

export type BattlefieldPoint = {
    x: number;
    y: number;
};

export type BattlefieldTarget = BattlefieldPoint & {
    selectable?: boolean;
};

export type BounceBattlefieldTarget = BattlefieldTarget & {
    uid: number;
};

export type TargetingIntent<T extends BattlefieldTarget> = {
    target: T | null;
    attackTarget: boolean;
    attackHome: boolean;
    moveX: number;
    moveY: number;
};

export const BATTLEFIELD_HOME_X = 300;
export const BATTLEFIELD_HERO_COLLISION_SIZE = 60;
export const BATTLEFIELD_HERO_SEPARATION = 2;
export const BATTLEFIELD_HOME_HORIZONTAL_STOP = 40;
export const BATTLEFIELD_HOME_DIAGONAL_DISTANCE = 200;

const TARGET_TREE_LEFT = -500;
const TARGET_TREE_BOTTOM = -1000;
const TARGET_TREE_WIDTH = 1000;
const TARGET_TREE_HEIGHT = 2000;

export const EMPTY_COMBAT_ATTRIBUTES: CombatAttributes = {
    dodgeRate: 0,
    critRate: 0,
    critDamage: 0,
    damageIncrease: 0,
    damageResistance: 0,
    heroResistance: 0,
    towerResistance: 0,
    bossIncrease: 0,
    attackSpeed: 0,
};

export function randomBattleRoll(random: () => number = Math.random): number {
    return Math.floor(random() * (BATTLE_RAND_BASE + 1));
}

export function attackIntervalSeconds(baseSeconds: number, attackSpeed: number): number {
    return baseSeconds / (1 + attackSpeed / BATTLE_RAND_BASE);
}

export function attackBehaviorDelaySeconds(baseSeconds: number, attackSpeed: number): number {
    return Math.ceil(baseSeconds * 1000 / (1 + attackSpeed / BATTLE_RAND_BASE)) / 1000;
}

// FightFormula prefers the live caster's attack while StateMemory can still
// resolve it. A projectile's launch-time attack is only the fallback after its
// caster has left the battlefield; non-projectile effects use the live value.
export function resolveAttackAtImpact(
    liveAttack: number,
    launchAttack: number,
    projectile: boolean,
    casterAlive: boolean,
): number {
    return projectile && !casterAlive ? launchAttack : liveAttack;
}

export function defeatCompensation(failedAttempts: number): number {
    if (failedAttempts <= 0) return 1;
    return DEFEAT_MULTIPLIERS[Math.min(Math.floor(failedAttempts), DEFEAT_MULTIPLIERS.length) - 1];
}

export function battlefieldDistance(left: BattlefieldPoint, right: BattlefieldPoint): number {
    return Math.hypot(right.x - left.x, right.y - left.y);
}

function isInsideTargetTree(point: BattlefieldPoint): boolean {
    return point.x >= TARGET_TREE_LEFT
        && point.x <= TARGET_TREE_LEFT + TARGET_TREE_WIDTH
        && point.y >= TARGET_TREE_BOTTOM
        && point.y <= TARGET_TREE_BOTTOM + TARGET_TREE_HEIGHT;
}

// The original inserts units in reverse creation order into a two-level quadtree,
// queries quadrants 0..3, then scans the result backwards. Distance wins first;
// this key only reproduces the observable equal-distance tie order.
function targetTreeOrder(point: BattlefieldPoint): number {
    let left = TARGET_TREE_LEFT;
    let bottom = TARGET_TREE_BOTTOM;
    let width = TARGET_TREE_WIDTH;
    let height = TARGET_TREE_HEIGHT;
    let order = 0;
    for (let depth = 0; depth < 2; depth += 1) {
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;
        // Cocos Rect.contains includes the midpoint and insertion uses the first
        // matching child, so boundary points remain in the left/lower child.
        const right = point.x > left + halfWidth;
        const upper = point.y > bottom + halfHeight;
        const quadrant = (right ? 1 : 0) + (upper ? 2 : 0);
        order = order * 4 + quadrant;
        if (right) left += halfWidth;
        if (upper) bottom += halfHeight;
        width = halfWidth;
        height = halfHeight;
    }
    return order;
}

export function selectNearestBattlefieldTarget<T extends BattlefieldTarget>(
    origin: BattlefieldPoint,
    candidates: ReadonlyArray<T>,
    searchRange: number,
): T | null {
    let selected: T | null = null;
    let selectedDistance = searchRange;
    let selectedTreeOrder = -1;
    for (const candidate of candidates) {
        if (candidate.selectable === false || !isInsideTargetTree(candidate)) continue;
        const distance = battlefieldDistance(origin, candidate);
        if (distance >= searchRange) continue;
        const treeOrder = targetTreeOrder(candidate);
        if (distance < selectedDistance || (distance === selectedDistance && treeOrder > selectedTreeOrder)) {
            selected = candidate;
            selectedDistance = distance;
            selectedTreeOrder = treeOrder;
        }
    }
    return selected;
}

// BounceBullet searches from the current missile position, then skips every
// unit already present in the chain's shared hitUnitMap. MissileConfig.times is
// the number of follow-up bounces, so times=2 permits the initial hit plus two
// further distinct targets.
export function selectBounceBattlefieldTarget<T extends BounceBattlefieldTarget>(
    origin: BattlefieldPoint,
    candidates: ReadonlyArray<T>,
    hitUnitUids: ReadonlySet<number>,
    completedBounces: number,
    maxBounces: number,
    searchRange: number,
): T | null {
    if (completedBounces >= maxBounces) return null;
    return selectNearestBattlefieldTarget(
        origin,
        candidates.filter((candidate) => !hitUnitUids.has(candidate.uid)),
        searchRange,
    );
}

export function movementVectorToward(
    origin: BattlefieldPoint,
    target: BattlefieldPoint,
    distance: number,
): BattlefieldPoint {
    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    const length = Math.hypot(dx, dy);
    if (length === 0 || distance === 0) return { x: 0, y: 0 };
    return { x: dx / length * distance, y: dy / length * distance };
}

export function heroSeparationVector<T extends BattlefieldPoint>(
    hero: T,
    allies: ReadonlyArray<T>,
    size: number = BATTLEFIELD_HERO_COLLISION_SIZE,
    pushDistance: number = BATTLEFIELD_HERO_SEPARATION,
): BattlefieldPoint {
    const half = size * 0.5;
    let x = 0;
    let y = 0;
    for (const ally of allies) {
        if (ally === hero) continue;
        if (ally.x < hero.x - half || ally.x > hero.x + half
            || ally.y < hero.y - half || ally.y > hero.y + half) continue;
        const push = movementVectorToward(ally, hero, pushDistance);
        // Math.atan2(0, 0) in the source produces a +x push for exact overlap.
        x += push.x || (ally.x === hero.x && ally.y === hero.y ? pushDistance : 0);
        y += push.y;
    }
    return { x, y };
}

export function resolveTargetingIntent<T extends BattlefieldTarget>(
    actor: BattlefieldPoint,
    candidates: ReadonlyArray<T>,
    searchRange: number,
    castingRange: number,
    moveDistance: number,
    enemyHome: BattlefieldPoint,
    canAttackHome: boolean,
): TargetingIntent<T> {
    const target = selectNearestBattlefieldTarget(actor, candidates, searchRange);
    if (target) {
        if (battlefieldDistance(actor, target) < castingRange) {
            return { target, attackTarget: true, attackHome: false, moveX: 0, moveY: 0 };
        }
        const movement = movementVectorToward(actor, target, moveDistance);
        return {
            target,
            attackTarget: false,
            attackHome: false,
            moveX: movement.x,
            moveY: movement.y,
        };
    }

    const homeDistance = battlefieldDistance(actor, enemyHome);
    if (homeDistance < castingRange) {
        return { target: null, attackTarget: false, attackHome: canAttackHome, moveX: 0, moveY: 0 };
    }
    if (Math.abs(enemyHome.x - actor.x) <= BATTLEFIELD_HOME_HORIZONTAL_STOP) {
        return { target: null, attackTarget: false, attackHome: false, moveX: 0, moveY: 0 };
    }
    const movementTarget = homeDistance > BATTLEFIELD_HOME_DIAGONAL_DISTANCE
        ? { x: enemyHome.x, y: actor.y }
        : enemyHome;
    const movement = movementVectorToward(actor, movementTarget, moveDistance);
    return {
        target: null,
        attackTarget: false,
        attackHome: false,
        moveX: movement.x,
        moveY: movement.y,
    };
}

export function resolveBattleDamage(input: DamageInput): DamageResult {
    const missed = input.rolls.dodge <= input.target.dodgeRate;
    const critical = !missed && (input.forcedCritical || input.rolls.critical <= input.source.critRate);
    const hitFactor = missed ? BASE_MISS_FACTOR : BATTLE_RAND_BASE;
    const critFactor = critical
        ? BASE_CRIT_FACTOR + Math.max(0, input.source.critDamage)
        : BATTLE_RAND_BASE;

    let resistance = input.target.damageResistance;
    if (input.sourceType === 'HAMSTER') resistance += input.target.heroResistance;
    else if (input.sourceType === 'WHEEL') resistance += input.target.towerResistance;

    let increase = input.source.damageIncrease;
    if (input.targetIsBoss) increase += input.source.bossIncrease;
    const coefficient = Math.max(0, BATTLE_RAND_BASE + increase - resistance);
    const rawValue =
        input.attack
        * input.effectRatio / BATTLE_RAND_BASE
        * hitFactor / BATTLE_RAND_BASE
        * critFactor / BATTLE_RAND_BASE
        * coefficient / BATTLE_RAND_BASE;

    return {
        value: Math.max(1, Math.floor(rawValue)),
        rawValue,
        status: missed ? 'miss' : critical ? 'critical' : 'normal',
        hitFactor,
        critFactor,
        coefficient,
    };
}
