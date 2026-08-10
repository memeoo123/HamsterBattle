export const BATTLE_RAND_BASE = 10000;
export const BASE_MISS_FACTOR = 5000;
export const BASE_CRIT_FACTOR = 15000;
export const SPLIT_SHOT_RADIUS = 250;
export const SPLIT_SHOT_PROJECTILE_SPEED = 700;
export const SPLIT_SHOT_EFFECT_RATIO = 10000;
export const ATTACK_KILL_FLY_DAMAGE = 999999;
export const H04_SHIELD_WALL_INTERVAL_SECONDS = 5;
export const H04_SHIELD_WALL_DURATION_SECONDS = 2;
export const H04_SHIELD_WALL_DAMAGE_RESISTANCE = 3000;
export const BATTLE_SEED_MULTIPLIER = 9301;
export const BATTLE_SEED_ADDEND = 49297;
export const BATTLE_SEED_MODULUS = 233280;
export const BATTLE_DEFAULT_SEED = 5;

// BattleInstanceController.onUpdate and BattleProcessor.onUpdate establish this
// order. Keeping it executable makes same-frame spawn/projectile behavior a
// regression-tested contract instead of a prose-only reconstruction note.
export const ORIGINAL_BATTLE_FRAME_STAGES = [
    'scheduleMonsters',
    'updateTeams',
    'snapshotCollisions',
    'calculateHeroSeparationReverse',
    'updateBuffs',
    'advanceBattleTimers',
    'updateHeroesReverse',
    'updateMonstersReverse',
    'updateLeaderSkillsReverse',
    'disposeQueuedUnits',
    'sortDepth',
    'updateBulletsReverse',
    'updateAutoHandler',
    'checkBattleEnd',
] as const;

export const ORIGINAL_SCHEDULED_MONSTER_RNG_ORDER = [
    'nativeSpawnY',
    'nativePositionXJitter',
    'nativePositionYJitter',
    'seededRandomMoveTimer',
] as const;
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

export type H04ShieldWallState = {
    cooldown: number;
    remaining: number;
};

export type H03TransformEffect = {
    durationSeconds: number;
    disablesTarget: boolean;
    outgoingDamageIncrease: number;
};

export type H03TransformState = {
    remaining: number;
    frozen: number;
    outgoingDamageIncrease: number;
};

export type H03LaserCastState = {
    elapsed: number;
    complete: boolean;
    behaviorTriggered: boolean;
};

export type H02BarrageCastState = {
    elapsed: number;
    complete: boolean;
    shotIndices: number[];
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

export function nextBattleSeed(seed: number): number {
    const normalized = ((Math.trunc(seed) % BATTLE_SEED_MODULUS) + BATTLE_SEED_MODULUS) % BATTLE_SEED_MODULUS;
    return (BATTLE_SEED_MULTIPLIER * normalized + BATTLE_SEED_ADDEND) % BATTLE_SEED_MODULUS;
}

export function createBattleSeedRandom(initialSeed = BATTLE_DEFAULT_SEED): () => number {
    let seed = initialSeed;
    return () => {
        seed = nextBattleSeed(seed);
        return seed / BATTLE_SEED_MODULUS;
    };
}

export function randomBattleRoll(random: () => number = Math.random): number {
    return Math.floor(random() * (BATTLE_RAND_BASE + 1));
}

export function splitShotRollSucceeds(
    probability: number,
    random: () => number = Math.random,
): boolean {
    return randomBattleRoll(random) <= Math.min(BATTLE_RAND_BASE, Math.max(0, probability));
}

// FightFormula.checkIsKillFly runs before dodge, critical and regular damage.
// Only ATTACK skills against MonsterUnit targets whose canKillFly getter is true
// consume this probability roll; BossUnit overrides that getter to false.
export function attackKillFlyRollSucceeds(
    probability: number,
    targetCanKillFly: boolean,
    basicAttack: boolean,
    random: () => number = Math.random,
): boolean {
    if (!targetCanKillFly || !basicAttack || probability <= 0) return false;
    return randomBattleRoll(random) <= Math.min(BATTLE_RAND_BASE, probability);
}

// Both 3001_bf3 and 3001_bf4 use a two-second changed-model buff group. The
// first carries abnormal type 3 (dizziness); the replacement carries only
// DMG_INC=3000, which FightFormula reads from that target when it later attacks.
export function applyH03TransformHit(
    current: H03TransformState,
    effect: H03TransformEffect,
    controlImmune: boolean,
): H03TransformState {
    return {
        remaining: Math.max(current.remaining, effect.durationSeconds),
        frozen: effect.disablesTarget && !controlImmune
            ? Math.max(current.frozen, effect.durationSeconds)
            : current.frozen,
        outgoingDamageIncrease: effect.outgoingDamageIncrease,
    };
}

export function advanceH03Transform(
    state: Pick<H03TransformState, 'remaining' | 'outgoingDamageIncrease'>,
    elapsed: number,
): Pick<H03TransformState, 'remaining' | 'outgoingDamageIncrease'> {
    const remaining = Math.max(0, state.remaining - Math.max(0, elapsed));
    return {
        remaining,
        outgoingDamageIncrease: remaining > 0 ? state.outgoingDamageIncrease : 0,
    };
}

// 3001_5 has one behavior at 300 ms inside a one-second cast. The generic
// SkillBehavior path starts its four-second cooldown when that behavior fires;
// cast completion removes any behavior that is still waiting.
export function advanceH03LaserCast(
    previousElapsed: number,
    elapsed: number,
    behaviorDelaySeconds: number,
    castTimeSeconds: number,
): H03LaserCastState {
    const castTime = Math.max(0, castTimeSeconds);
    const delay = Math.max(0, behaviorDelaySeconds);
    const start = Math.min(castTime, Math.max(0, previousElapsed));
    const end = Math.min(castTime, start + Math.max(0, elapsed));
    return {
        elapsed: end,
        complete: end >= castTime,
        behaviorTriggered: delay > start && delay <= end && delay <= castTime,
    };
}

// UnitCollisionsManager.getRectUnits builds an inclusive rectangle whose rear
// edge is centered on the caster and whose long axis points at the locked
// target. It tests unit centers rather than collision radii.
export function isPointInForwardRectangle(
    origin: BattlefieldPoint,
    aim: BattlefieldPoint,
    point: BattlefieldPoint,
    width: number,
    height: number,
): boolean {
    const dx = aim.x - origin.x;
    const dy = aim.y - origin.y;
    const distance = Math.hypot(dx, dy);
    const forwardX = distance > 0 ? dx / distance : 1;
    const forwardY = distance > 0 ? dy / distance : 0;
    const relativeX = point.x - origin.x;
    const relativeY = point.y - origin.y;
    const forward = relativeX * forwardX + relativeY * forwardY;
    const sideways = relativeX * -forwardY + relativeY * forwardX;
    return forward >= 0
        && forward <= Math.max(0, height)
        && Math.abs(sideways) <= Math.max(0, width) / 2;
}

export function selectH03LaserTargets<T extends BattlefieldTarget>(
    origin: BattlefieldPoint,
    aim: BattlefieldPoint,
    targets: readonly T[],
    width: number,
    height: number,
    maxTargets: number,
): T[] {
    return targets
        .filter((target) => target.selectable !== false && isPointInForwardRectangle(origin, aim, target, width, height))
        .slice(0, Math.max(0, Math.floor(maxTargets)));
}

// SkillData removes all still-waiting behaviors when castTime expires. This is
// observable for 2001_6: its configured 3500-ms seventh shot is later than the
// 3000-ms cast and therefore never launches in version 18.
export function h02BarrageEffectiveShotDelays(
    configuredShotDelays: readonly number[],
    castTimeSeconds: number,
): number[] {
    const castTime = Math.max(0, castTimeSeconds);
    return configuredShotDelays.filter((delay) => delay >= 0 && delay <= castTime);
}

export function advanceH02BarrageCast(
    previousElapsed: number,
    elapsed: number,
    configuredShotDelays: readonly number[],
    castTimeSeconds: number,
): H02BarrageCastState {
    const castTime = Math.max(0, castTimeSeconds);
    const start = Math.min(castTime, Math.max(0, previousElapsed));
    const end = Math.min(castTime, start + Math.max(0, elapsed));
    const shotIndices: number[] = [];
    for (let index = 0; index < configuredShotDelays.length; index += 1) {
        const delay = configuredShotDelays[index];
        if (delay > start && delay <= end && delay <= castTime) shotIndices.push(index);
    }
    return { elapsed: end, complete: end >= castTime, shotIndices };
}

// PassivitySkillData counts down 4001_p3/4001_p4 every five seconds. Each
// trigger adds a two-second buff group; large elapsed steps may cross several
// activation/expiry boundaries, so advance them in event order.
export function advanceH04ShieldWall(
    state: H04ShieldWallState,
    elapsed: number,
): H04ShieldWallState {
    let cooldown = Math.max(0, state.cooldown);
    let remaining = Math.max(0, state.remaining);
    let time = Math.max(0, elapsed);
    while (time > 0) {
        if (cooldown <= 0) {
            cooldown = H04_SHIELD_WALL_INTERVAL_SECONDS;
            remaining = H04_SHIELD_WALL_DURATION_SECONDS;
        }
        const untilExpiry = remaining > 0 ? remaining : Number.POSITIVE_INFINITY;
        const step = Math.min(time, cooldown, untilExpiry);
        cooldown -= step;
        remaining = Math.max(0, remaining - step);
        time -= step;
    }
    if (cooldown <= 0) {
        cooldown = H04_SHIELD_WALL_INTERVAL_SECONDS;
        remaining = H04_SHIELD_WALL_DURATION_SECONDS;
    }
    return { cooldown, remaining };
}

// BuffManager.checkCounterAttack uses DamageVo.notDefValue, which is the
// resistance-adjusted floating damage before the minimum/floor and before
// shield absorption. Zero stays zero instead of receiving the normal minimum.
export function h04ShieldWallCounterattackDamage(
    resolvedRawDamage: number,
    counterattackRatio: number,
    active: boolean,
): number {
    if (!active || counterattackRatio <= 0 || resolvedRawDamage <= 0) return 0;
    return Math.max(0, Math.floor(resolvedRawDamage * counterattackRatio / BATTLE_RAND_BASE));
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

/**
 * Mechanics-first reconstruction assist. The first three retries retain the
 * recovered table exactly. Afterwards an additional decay prevents a fresh,
 * zero-progression reconstruction profile from becoming permanently stuck;
 * the original table remains available through defeatCompensation().
 */
export function mechanicsFirstDefeatCompensation(failedAttempts: number): number {
    const attempts = Math.max(0, Math.floor(Number.isFinite(failedAttempts) ? failedAttempts : 0));
    const recovered = defeatCompensation(attempts);
    if (attempts <= 3) return recovered;
    return Math.max(0.01, recovered * Math.pow(0.75, attempts - 3));
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
export function resolveBounceMaxTimes(baseBounces: number, bonusBounces: number): number {
    return Math.max(0, baseBounces + bonusBounces);
}

// The passive behavior uses SELF_CIRCLE plus SkillTargetType.Random. The
// original random-array helper therefore chooses uniformly from every enemy in
// the caster-centered circle; the current main target remains a valid choice.
export function selectSplitShotTarget<T extends BattlefieldTarget>(
    caster: BattlefieldPoint,
    candidates: ReadonlyArray<T>,
    random: () => number = Math.random,
    radius: number = SPLIT_SHOT_RADIUS,
): T | null {
    const eligible = candidates.filter((candidate) =>
        candidate.selectable !== false
        && isInsideTargetTree(candidate)
        && battlefieldDistance(caster, candidate) <= radius,
    );
    if (eligible.length === 0) return null;
    if (eligible.length === 1) return eligible[0];
    const roll = Math.min(0.999999999999, Math.max(0, random()));
    return eligible[Math.floor(roll * eligible.length)];
}

export const H13_BASE_SKILL_ID = 'TZ_1301' as const;
export type H13SkillId = 'TZ_1301' | 'TZ_1302' | 'TZ_1303';
export type H13ReplacementTraitId = 'RG_H13_abl02_eff01' | 'RG_H13_abl02_eff02';

export type H13BounceProfile = {
    skillId: H13SkillId;
    attackIncreasePerBounce: number;
    lastMissileConfigured: boolean;
};

export function replaceH13Skill(_current: H13SkillId, traitId: H13ReplacementTraitId): H13SkillId {
    return traitId === 'RG_H13_abl02_eff02' ? 'TZ_1303' : 'TZ_1302';
}

export function resolveH13BounceProfileForSkill(skillId: H13SkillId): H13BounceProfile {
    return {
        skillId,
        attackIncreasePerBounce: skillId === H13_BASE_SKILL_ID ? 0 : 1000,
        lastMissileConfigured: skillId === 'TZ_1303',
    };
}

// BounceBullet multiplies each child missile's attack after it is initialized,
// so the 1000-basis-point atk_ins compounds once for every follow-up segment.
export function resolveBounceAttack(
    baseAttack: number,
    completedBounces: number,
    attackIncreasePerBounce: number,
): number {
    let attack = baseAttack;
    const multiplier = 1 + attackIncreasePerBounce / 10000;
    for (let bounce = 0; bounce < Math.max(0, completedBounces); bounce += 1) attack *= multiplier;
    return attack;
}

// Version 18 resets a child BounceBullet's bouncelTimes to zero, evaluates
// last_missile, and only afterwards copies the parent's counter. H13 always has
// at least two follow-up bounces, so TZ_1303's configured explosion is unreachable.
export function runtimeSelectsConfiguredLastBounceMissile(bounceMaxTimes: number): boolean {
    const resetChildBounceTimes = 0;
    return resetChildBounceTimes === bounceMaxTimes - 1;
}

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

// FightFormula evaluates dodge first. A successful dodge skips checkCrit, and
// its one-use forced-critical buff short-circuits checkCrit before the critical
// random roll. Keeping those reads lazy preserves the original RNG call order.
export function resolveBattleDamageWithRandom(
    input: Omit<DamageInput, 'rolls'>,
    random: () => number = Math.random,
): DamageResult {
    const dodge = randomBattleRoll(random);
    const missed = dodge <= input.target.dodgeRate;
    const critical = missed || input.forcedCritical
        ? BATTLE_RAND_BASE
        : randomBattleRoll(random);
    return resolveBattleDamage({ ...input, rolls: { dodge, critical } });
}
