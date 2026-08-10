export type ItemReward = {
    k: string | number;
    v: number;
};

export type NormalLevelPreparationConfig = {
    initialCoin: number;
    staticBuffsByLevel: ReadonlyMap<number, readonly string[]>;
    staticBatches: string[][];
    roundCoinRewards: number[];
};

export const BAGLIKE_COIN_ITEM_ID = 5;

export function itemRewardAmount(
    rewards: readonly ItemReward[] | null | undefined,
    itemId: string | number,
): number {
    const expected = String(itemId);
    return (rewards || []).reduce((total, reward) =>
        String(reward.k) === expected ? total + Number(reward.v || 0) : total, 0);
}

export function normalLevelPreparationConfig(
    level: Pick<NormalLevelRow, 'initRewards' | 'staticBuffs' | 'staticBricks'>,
    rounds: ReadonlyArray<Pick<NormalRoundRow, 'coinRewards'>>,
): NormalLevelPreparationConfig {
    return {
        initialCoin: itemRewardAmount(level.initRewards, BAGLIKE_COIN_ITEM_ID),
        staticBuffsByLevel: normalLevelStaticBuffsByLevel(level.staticBuffs),
        staticBatches: (level.staticBricks || []).map((batch) => [...batch]),
        roundCoinRewards: rounds.map((round) => itemRewardAmount(round.coinRewards, BAGLIKE_COIN_ITEM_ID)),
    };
}

/**
 * TrunkInstanceConfig.staticBuffs is keyed by the bag-like level that opens
 * the selection. Its value is a comma-separated list of fixed choices; the
 * original fills any remaining card slots from the normal weighted pool.
 */
export function normalLevelStaticBuffsByLevel(
    entries: ReadonlyArray<{ k: number; v: string }> | null | undefined,
): ReadonlyMap<number, readonly string[]> {
    const result = new Map<number, readonly string[]>();
    for (const entry of entries || []) {
        const level = Math.max(0, Math.floor(Number(entry.k)));
        const ids = String(entry.v || '').split(',').map((id) => id.trim()).filter(Boolean);
        if (level > 0 && ids.length > 0) result.set(level, ids);
    }
    return result;
}

export type NormalLevelRow = {
    id: number;
    chapter?: number;
    name: string;
    fightscene: string;
    homeHp: number;
    atkMultiple: number;
    hpMultiple: number;
    roundIds: number[];
    recommendHeroIds?: string[];
    initRewards?: ItemReward[] | null;
    staticBuffs?: Array<{ k: number; v: string }> | null;
    staticBricks?: string[][] | null;
};

export type NormalRoundRow = {
    id: number;
    monsterTimes: number[];
    monsterIds: string[];
    atkMultiple: number;
    hpMultiple: number;
    coinRewards?: ItemReward[] | null;
};

export type NormalLevelRuntimeTable = {
    source: string;
    levels: NormalLevelRow[];
    rounds: Record<string, NormalRoundRow>;
};

export type NormalLevelRuntimeRound = {
    id: number;
    times: number[];
    monsters: string[];
    atkMultiple: number;
    hpMultiple: number;
};

export type NormalLevelRuntimeConfig = {
    level: NormalLevelRow;
    backgroundId: string;
    rounds: NormalLevelRuntimeRound[];
    preparation: NormalLevelPreparationConfig;
};

export function buildNormalLevelRuntimeConfig(
    table: NormalLevelRuntimeTable,
    levelId: number,
    supportedModelIds: ReadonlySet<string>,
): NormalLevelRuntimeConfig {
    const level = table.levels.find((row) => row.id === levelId);
    if (!level) throw new Error(`恢复关卡 ${levelId} 不存在于 ${table.source || 'normal-levels'}`);

    const roundRows = level.roundIds.map((roundId) => {
        const row = table.rounds[String(roundId)];
        if (!row) throw new Error(`恢复关卡 ${level.id} 缺少波次 ${roundId}`);
        if (row.monsterTimes.length !== row.monsterIds.length) {
            throw new Error(`波次 ${roundId} 的刷怪时间与单位数量不一致`);
        }
        for (const modelId of row.monsterIds) {
            if (!supportedModelIds.has(modelId)) throw new Error(`波次 ${roundId} 使用了未恢复单位 ${modelId}`);
        }
        return row;
    });

    return {
        level,
        backgroundId: level.fightscene.split('/').pop() || 'fightscene_01',
        rounds: roundRows.map((row) => ({
            id: row.id,
            times: [...row.monsterTimes],
            monsters: [...row.monsterIds],
            atkMultiple: row.atkMultiple,
            hpMultiple: row.hpMultiple,
        })),
        preparation: normalLevelPreparationConfig(level, roundRows),
    };
}

export type NormalBattleOutcome = {
    state: 'battle' | 'lost' | 'round-clear';
    clearTimer: number;
};

export function resolveNormalBattleOutcome(input: {
    homeHp: number;
    scheduleComplete: boolean;
    enemiesAlive: boolean;
    clearTimer: number;
    dt: number;
}): NormalBattleOutcome {
    if (input.homeHp <= 0) return { state: 'lost', clearTimer: 0 };
    if (!input.scheduleComplete || input.enemiesAlive) return { state: 'battle', clearTimer: 0 };
    // BattleInstanceController checks the home first and then wins immediately
    // after the frame's unit/bullet pass when the schedule and enemy list are
    // empty. Its one-second timer belongs to the post-win roundEnd callback,
    // not to an additional combat window in which future bullets may land.
    return { state: 'round-clear', clearTimer: 0 };
}

export type NormalRoundCompletion = {
    state: 'next-round' | 'won';
    roundIndex: number;
};

export function resolveNormalRoundCompletion(roundIndex: number, roundCount: number): NormalRoundCompletion {
    if (!Number.isInteger(roundIndex) || !Number.isInteger(roundCount) || roundCount <= 0
        || roundIndex < 0 || roundIndex >= roundCount) {
        throw new Error(`无效的普通关卡波次进度：${roundIndex + 1}/${roundCount}`);
    }
    if (roundIndex === roundCount - 1) return { state: 'won', roundIndex };
    return { state: 'next-round', roundIndex: roundIndex + 1 };
}

export function normalLevelFailedAttempts(previousAttempts: number, won: boolean): number {
    const normalized = Math.max(0, Math.floor(Number.isFinite(previousAttempts) ? previousAttempts : 0));
    return won ? 0 : normalized + 1;
}

export function normalLevelRetryState(failedAttempts: number): { roundIndex: 0; failedAttempts: number } {
    return {
        roundIndex: 0,
        failedAttempts: Math.max(0, Math.floor(Number.isFinite(failedAttempts) ? failedAttempts : 0)),
    };
}

export type NormalMonsterRow = {
    id: string;
    name: string;
    monsterType: 'NORMAL' | 'ELITE' | 'BOSS' | string;
    atk: number;
    hp: number;
    gold: number;
    desc: string;
};

export type NormalEnemyMechanicsProfile = NormalMonsterRow & {
    range: number;
    searchRange: number;
    moveSpeed: number;
    attackInterval: number;
    effectRatio: number;
    attackDelay: number;
    projectileSpeed: number;
    areaRadius: number;
    maxTargets: number;
    exp: number;
    boss: boolean;
    controlImmune: boolean;
    heroResistance: number;
    towerResistance: number;
    attackSpeed: number;
    focusHome: boolean;
    selfDestructRadius: number;
    knockbackDistance: number;
    assassinate: boolean;
    assassinatePreCooldown: number;
    assassinateCooldown: number;
    assassinateDistance: number;
    specialAttack: 'line' | 'self-area' | null;
    specialCooldown: number;
    specialPreCooldown: number;
    specialCastTime: number;
    specialBehaviorDelay: number;
    specialEffectRatio: number;
    specialRadius: number;
    specialWidth: number;
    specialHeight: number;
    multiHitDelays: number[];
};

const RANGED_250 = new Set(['M03', 'M09', 'Boss03', 'Boss09', 'B01']);
const SPLASH_150 = new Set(['M05', 'M08']);
const SPLASH_225 = new Set(['Boss05', 'Boss08']);
const CLEAVE = new Set(['M07', 'Boss07', 'B02', 'B03']);
const FAST_MOVE = new Set([
    'M12', 'M13', 'Boss01', 'Boss02', 'Boss04', 'Boss06', 'Boss07',
    'Boss11', 'Boss14', 'B02', 'B03',
]);
const BOSS_SPECIAL_LINE = new Set(['B01', 'B02']);

/**
 * Converts recovered MonsterAttribute/Skill/Behavior semantics into the
 * compact fields consumed by the battlefield. Visual resources are not part
 * of this mechanics contract.
 */
export function buildNormalEnemyMechanicsProfiles(
    monsters: Readonly<Record<string, NormalMonsterRow>>,
): Record<string, NormalEnemyMechanicsProfile> {
    const result: Record<string, NormalEnemyMechanicsProfile> = {};
    for (const id of Object.keys(monsters)) {
        const row = monsters[id];
        const boss = row.monsterType === 'BOSS';
        const ranged250 = RANGED_250.has(row.id);
        const splash150 = SPLASH_150.has(row.id);
        const splash225 = SPLASH_225.has(row.id);
        const cleave = CLEAVE.has(row.id);
        const ultraRange = row.id === 'M10' || row.id === 'Boss10';
        const ranged = ranged250 || splash150 || splash225 || ultraRange || row.id === 'B01';
        const areaRadius = cleave ? 75 : splash225 ? 75 : (splash150 || ultraRange ? 50 : 0);
        result[row.id] = {
            ...row,
            range: ultraRange ? 500 : splash225 ? 225 : splash150 ? 150 : ranged250 ? 250 : 50,
            searchRange: 1000,
            moveSpeed: FAST_MOVE.has(row.id) ? 90 : 60,
            attackInterval: 1,
            effectRatio: splash225 ? 3000 : (cleave || splash150 || ultraRange || row.id === 'M03' || row.id === 'Boss03' || row.id === 'B01') ? 5000 : 10000,
            attackDelay: 0.3,
            projectileSpeed: ultraRange ? 800 : (row.id === 'M03' || row.id === 'Boss03' ? 800 : ranged ? 300 : 0),
            areaRadius,
            maxTargets: areaRadius > 0 ? 99 : 1,
            exp: boss ? 100 : row.monsterType === 'ELITE' ? 20 : 5,
            boss,
            controlImmune: boss,
            heroResistance: row.id === 'M01' ? 5000 : 0,
            towerResistance: row.id === 'M03' || row.id === 'Boss03'
                ? -5000
                : row.id === 'M06' ? 5000 : 0,
            attackSpeed: boss ? 5000 : 0,
            focusHome: row.id === 'M12' || row.id === 'M13',
            selfDestructRadius: row.id === 'M13' ? 100 : 0,
            knockbackDistance: row.id === 'M11' || row.id === 'Boss11' ? 100 : 0,
            assassinate: row.id === 'M14' || row.id === 'Boss14',
            assassinatePreCooldown: row.id === 'M14' || row.id === 'Boss14' ? 1 : 0,
            assassinateCooldown: row.id === 'M14' || row.id === 'Boss14' ? 20 : 0,
            assassinateDistance: row.id === 'M14' || row.id === 'Boss14' ? 45 : 0,
            specialAttack: BOSS_SPECIAL_LINE.has(row.id) ? 'line' : row.id === 'B03' ? 'self-area' : null,
            specialCooldown: row.id === 'B01' || row.id === 'B02' || row.id === 'B03' ? 5 : 0,
            specialPreCooldown: row.id === 'B01' || row.id === 'B02' || row.id === 'B03' ? 5 : 0,
            specialCastTime: row.id === 'B01' || row.id === 'B02' || row.id === 'B03' ? 1.5 : 0,
            specialBehaviorDelay: row.id === 'B01' || row.id === 'B02' || row.id === 'B03' ? 0.3 : 0,
            specialEffectRatio: row.id === 'B01' || row.id === 'B02' || row.id === 'B03' ? 15000 : 0,
            specialRadius: row.id === 'B03' ? 150 : 0,
            specialWidth: BOSS_SPECIAL_LINE.has(row.id) ? 150 : 0,
            specialHeight: BOSS_SPECIAL_LINE.has(row.id) ? 500 : 0,
            multiHitDelays: row.id === 'B01' ? [0.3, 0.6, 0.9] : [],
        };
    }
    return result;
}

export type EnemySkillPoint = { x: number; y: number };

export function selectFarthestEnemySkillTarget<T extends EnemySkillPoint>(
    caster: EnemySkillPoint,
    candidates: readonly T[],
    searchRange: number,
): T | null {
    let selected: T | null = null;
    let selectedDistance = -1;
    for (const candidate of candidates) {
        const distance = Math.hypot(candidate.x - caster.x, candidate.y - caster.y);
        if (distance > searchRange || distance <= selectedDistance) continue;
        selected = candidate;
        selectedDistance = distance;
    }
    return selected;
}

export function assassinateDestination(
    caster: EnemySkillPoint,
    target: EnemySkillPoint,
    distance: number,
): EnemySkillPoint {
    return {
        x: caster.x - target.x > 0 ? target.x + distance : target.x - distance,
        y: target.y,
    };
}

export type EnemySpecialCastState = {
    elapsed: number;
    behaviorTriggered: boolean;
};

export function advanceEnemySpecialCast(
    state: EnemySpecialCastState,
    dt: number,
    behaviorDelay: number,
    castTime: number,
): EnemySpecialCastState & { triggerBehavior: boolean; complete: boolean } {
    const elapsed = state.elapsed + Math.max(0, dt);
    const triggerBehavior = !state.behaviorTriggered && elapsed >= behaviorDelay;
    return {
        elapsed,
        behaviorTriggered: state.behaviorTriggered || triggerBehavior,
        triggerBehavior,
        complete: elapsed >= castTime,
    };
}
