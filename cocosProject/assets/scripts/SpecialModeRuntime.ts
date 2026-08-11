const SPECIAL_FRAGMENT_STACK_LIMIT = 999;
const SPECIAL_FRAGMENT_FAMILIES = ['H01', 'H02', 'H03', 'H04', 'H05', 'H06', 'H11', 'H12', 'H13', 'H14', 'H16', 'H17'] as const;

export type SpecialAccountProfile = {
    stars: Record<string, number>;
    challengeTimesByLevel: Record<string, number>;
    gold: number;
    energy: number;
    diamonds: number;
    fragments: Record<string, number>;
    maxPassedLevelId: number;
    [key: string]: unknown;
};

function cloneSpecialAccountProfile<T extends SpecialAccountProfile>(profile: T): T {
    return { ...profile, stars: { ...profile.stars }, challengeTimesByLevel: { ...profile.challengeTimesByLevel }, fragments: { ...profile.fragments } };
}

function drawSpecialRandomFragments(count: number, random: () => number): Record<string, number> {
    const result: Record<string, number> = {};
    for (let index = 0; index < count; index += 1) {
        const roll = Math.min(0.999999999999, Math.max(0, random()));
        const family = SPECIAL_FRAGMENT_FAMILIES[Math.floor(roll * SPECIAL_FRAGMENT_FAMILIES.length)];
        result[family] = (result[family] || 0) + 1;
    }
    return result;
}

export const SPECIAL_MODE_STORAGE_KEY = 'cangshu.restore.special-mode.v1';
export const SPECIAL_MODE_SCHEMA_VERSION = 1;
export const SPECIAL_MODE_CHALLENGE_LIMIT = 3;
export const SPECIAL_MODE_ENERGY_COST = 5;
export const DAILY_INSTANCE_ROUND_GOLD = 500;

export type SpecialMode = 'normal' | 'daily' | 'endless';
export type SpecialItemReward = { k: number | string; v: number };
export type SpecialRoundRow = {
    id: number;
    round: number;
    monsterTimes: number[];
    monsterIds: string[];
    atkMultiple: number;
    hpMultiple: number;
    rewards: SpecialItemReward[] | null;
    coinRewards: SpecialItemReward[] | null;
};
export type DailyInstanceRow = {
    id: number;
    name: string;
    fightscene: string;
    roundIds: number[];
    initRewards: SpecialItemReward[];
};
export type DailyRotationRow = { id: number; dailyInstanceId: number; buffIds: string[] };
export type DailyRewardRow = {
    id: number;
    cost: SpecialItemReward[];
    rewardRounds: number[];
    rewards: SpecialItemReward[][];
};
export type SpecialModeTable = {
    version: number;
    source: string;
    daily: {
        challengeTimes: number;
        initCoin: number;
        roundGold: number;
        instances: DailyInstanceRow[];
        rotation: DailyRotationRow[];
        rewards: DailyRewardRow[];
        effects: Record<string, { id: string; effectType: string; param: unknown; attr: Record<string, number> | null }>;
    };
    endless: {
        challengeTimes: number;
        adTimes: number[];
        cost: SpecialItemReward[];
        initRewards: SpecialItemReward[];
        roundIds: number[];
        fightscene: string;
        timeoutSeconds: number;
    };
    rounds: Record<string, SpecialRoundRow>;
};

export type SpecialModeState = {
    schemaVersion: number;
    dayKey: number;
    daily: { challengeTimes: number; dailyGold: number; claimed: Record<string, boolean> };
    endless: { challengeTimes: number; maxKillCount: number; maxGold: number; skinKeys: number };
};

export type SpecialModeStorage = Pick<Storage, 'getItem' | 'setItem'>;

function nonNegativeInteger(value: unknown, fallback = 0): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : fallback;
}

export function specialModeDayKey(now: Date | number = Date.now()): number {
    const date = now instanceof Date ? now : new Date(now);
    const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return Math.floor(midnight / 86400000);
}

export function createSpecialModeState(now: Date | number = Date.now()): SpecialModeState {
    return {
        schemaVersion: SPECIAL_MODE_SCHEMA_VERSION,
        dayKey: specialModeDayKey(now),
        daily: { challengeTimes: 0, dailyGold: 0, claimed: {} },
        endless: { challengeTimes: 0, maxKillCount: 0, maxGold: 0, skinKeys: 0 },
    };
}

export function normalizeSpecialModeState(value: unknown, now: Date | number = Date.now()): SpecialModeState {
    const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    const daily = source.daily && typeof source.daily === 'object' ? source.daily as Record<string, unknown> : {};
    const endless = source.endless && typeof source.endless === 'object' ? source.endless as Record<string, unknown> : {};
    const savedDay = nonNegativeInteger(source.dayKey, specialModeDayKey(now));
    const currentDay = specialModeDayKey(now);
    const sameDay = savedDay === currentDay;
    const claimedSource = daily.claimed && typeof daily.claimed === 'object' ? daily.claimed as Record<string, unknown> : {};
    const claimed: Record<string, boolean> = {};
    if (sameDay) {
        for (const key of Object.keys(claimedSource)) if (/^\d+$/.test(key) && claimedSource[key] === true) claimed[key] = true;
    }
    return {
        schemaVersion: SPECIAL_MODE_SCHEMA_VERSION,
        dayKey: currentDay,
        daily: {
            challengeTimes: sameDay ? Math.min(SPECIAL_MODE_CHALLENGE_LIMIT, nonNegativeInteger(daily.challengeTimes)) : 0,
            dailyGold: sameDay ? nonNegativeInteger(daily.dailyGold) : 0,
            claimed,
        },
        endless: {
            challengeTimes: sameDay ? Math.min(SPECIAL_MODE_CHALLENGE_LIMIT, nonNegativeInteger(endless.challengeTimes)) : 0,
            maxKillCount: nonNegativeInteger(endless.maxKillCount),
            maxGold: nonNegativeInteger(endless.maxGold),
            skinKeys: nonNegativeInteger(endless.skinKeys),
        },
    };
}

export function loadSpecialModeState(storage: SpecialModeStorage | null | undefined, now: Date | number = Date.now()): SpecialModeState {
    if (!storage) return createSpecialModeState(now);
    try {
        const saved = storage.getItem(SPECIAL_MODE_STORAGE_KEY);
        return saved ? normalizeSpecialModeState(JSON.parse(saved), now) : createSpecialModeState(now);
    } catch {
        return createSpecialModeState(now);
    }
}

export function saveSpecialModeState(storage: SpecialModeStorage | null | undefined, state: SpecialModeState): boolean {
    if (!storage) return false;
    try {
        storage.setItem(SPECIAL_MODE_STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch {
        return false;
    }
}

export function dailyRotationIndex(dayKey: number, rotationCount: number): number {
    if (rotationCount <= 0) return 0;
    return ((Math.floor(dayKey) % rotationCount) + rotationCount) % rotationCount;
}

export function currentDailyRotation(table: SpecialModeTable, now: Date | number = Date.now()): DailyRotationRow {
    if (table.daily.rotation.length === 0) throw new Error('DailyInstanceRandomConfig is empty');
    return table.daily.rotation[dailyRotationIndex(specialModeDayKey(now), table.daily.rotation.length)];
}

export function currentDailyInstance(table: SpecialModeTable, now: Date | number = Date.now()): DailyInstanceRow {
    const rotation = currentDailyRotation(table, now);
    const instance = table.daily.instances.find((row) => row.id === rotation.dailyInstanceId);
    if (!instance) throw new Error(`Daily instance ${rotation.dailyInstanceId} is missing`);
    return instance;
}

export function dailyRewardForProgress(table: SpecialModeTable, maxPassedLevelId: number): DailyRewardRow {
    const id = Math.max(1001, Math.min(1200, Math.floor(maxPassedLevelId)));
    const row = table.daily.rewards.find((candidate) => candidate.id === id);
    if (!row) throw new Error(`Daily reward row ${id} is missing`);
    return row;
}

export function canStartSpecialMode(state: SpecialModeState, profile: SpecialAccountProfile, mode: Exclude<SpecialMode, 'normal'>): {
    allowed: boolean;
    reason: 'ready' | 'attempts' | 'energy';
    needsAd: boolean;
} {
    const challengeTimes = mode === 'daily' ? state.daily.challengeTimes : state.endless.challengeTimes;
    if (challengeTimes >= SPECIAL_MODE_CHALLENGE_LIMIT) return { allowed: false, reason: 'attempts', needsAd: false };
    if (profile.energy < SPECIAL_MODE_ENERGY_COST) return { allowed: false, reason: 'energy', needsAd: false };
    return { allowed: true, reason: 'ready', needsAd: mode === 'endless' && challengeTimes + 1 === 3 };
}

export function spendSpecialModeEnergy<T extends SpecialAccountProfile>(profile: T): T {
    const next = cloneSpecialAccountProfile(profile);
    next.energy = Math.max(0, next.energy - SPECIAL_MODE_ENERGY_COST);
    return next;
}

export function settleDailyChallenge(state: SpecialModeState, currentRoundIndex: number): SpecialModeState {
    const next = normalizeSpecialModeState(state, Date.now());
    next.daily.challengeTimes = Math.min(SPECIAL_MODE_CHALLENGE_LIMIT, next.daily.challengeTimes + 1);
    next.daily.dailyGold += Math.max(0, Math.min(9, Math.floor(currentRoundIndex)) + 1) * DAILY_INSTANCE_ROUND_GOLD;
    return next;
}

export function settleEndlessChallenge(state: SpecialModeState, killCount: number, gold: number): SpecialModeState {
    const next = normalizeSpecialModeState(state, Date.now());
    const normalizedKills = nonNegativeInteger(killCount);
    const normalizedGold = nonNegativeInteger(gold);
    next.endless.challengeTimes = Math.min(SPECIAL_MODE_CHALLENGE_LIMIT, next.endless.challengeTimes + 1);
    if (normalizedGold > next.endless.maxGold || (normalizedGold === next.endless.maxGold && normalizedKills > next.endless.maxKillCount)) {
        next.endless.maxGold = normalizedGold;
        next.endless.maxKillCount = normalizedKills;
    }
    return next;
}

export function dailyRefreshCost(baseCost: number, buffIds: readonly string[]): number {
    return buffIds.indexOf('DI_BUFF_eff01') >= 0 ? Math.floor(baseCost * 8000 / 10000) : baseCost;
}

export function dailyProductionCount(buffIds: readonly string[], tower: boolean, random: () => number = Math.random): number {
    const effectId = tower ? 'DI_BUFF_eff06' : 'DI_BUFF_eff05';
    if (buffIds.indexOf(effectId) < 0) return 1;
    const roll = Math.min(999, Math.max(0, Math.floor(random() * 1000)));
    return roll < 850 ? 1 : roll < 950 ? 2 : 3;
}

export function dailyHeroAttackMultiplier(buffIds: readonly string[], shapeCellCount: number): number {
    if (shapeCellCount <= 2 && buffIds.indexOf('DI_BUFF_eff03') >= 0) return 1.2;
    if (shapeCellCount >= 3 && buffIds.indexOf('DI_BUFF_eff04') >= 0) return 1.2;
    return 1;
}

export function dailyEnemyMoveMultiplier(buffIds: readonly string[]): number {
    return buffIds.indexOf('DI_DEBUFF_eff01') >= 0 ? 1.2 : 1;
}

export function dailyEnemyDamageResistance(buffIds: readonly string[], attackType: 'HAMSTER' | 'WHEEL', elite = true): number {
    if (!elite) return 0;
    if (attackType === 'HAMSTER' && buffIds.indexOf('DI_DEBUFF_eff03') >= 0) return 8000;
    if (attackType === 'WHEEL' && buffIds.indexOf('DI_DEBUFF_eff04') >= 0) return 8000;
    return 0;
}

export function dailyExtraRoundId(buffIds: readonly string[], roundIndex: number): number | null {
    return buffIds.indexOf('DI_DEBUFF_eff05') >= 0 ? 300001 + Math.max(0, Math.min(9, Math.floor(roundIndex))) : null;
}

export function mergeDailyRound(base: SpecialRoundRow, extra: SpecialRoundRow | null): SpecialRoundRow {
    if (!extra || base.monsterTimes.length === 0) return { ...base, monsterTimes: [...base.monsterTimes], monsterIds: [...base.monsterIds] };
    const lastBaseTime = base.monsterTimes[base.monsterTimes.length - 1];
    const schedule = base.monsterTimes.map((time, index) => ({ time, monster: base.monsterIds[index], order: index }));
    extra.monsterTimes.forEach((time, index) => {
        if (time <= lastBaseTime) schedule.push({ time, monster: extra.monsterIds[index], order: base.monsterTimes.length + index });
    });
    schedule.sort((left, right) => left.time - right.time || left.order - right.order);
    return { ...base, monsterTimes: schedule.map((entry) => entry.time), monsterIds: schedule.map((entry) => entry.monster) };
}

export function claimDailyMilestone<T extends SpecialAccountProfile>(
    state: SpecialModeState,
    profile: T,
    row: DailyRewardRow,
    rewardIndex: number,
    random: () => number = Math.random,
): { state: SpecialModeState; profile: T; claimed: boolean; text: string } {
    const index = Math.floor(rewardIndex);
    const threshold = row.rewardRounds[index];
    if (threshold === undefined || state.daily.dailyGold < threshold || state.daily.claimed[String(index)]) {
        return { state, profile, claimed: false, text: '奖励尚未达到领取条件' };
    }
    const nextState = normalizeSpecialModeState(state, Date.now());
    const nextProfile = cloneSpecialAccountProfile(profile);
    const text: string[] = [];
    for (const reward of row.rewards[index] || []) {
        const amount = nonNegativeInteger(reward.v);
        if (reward.k === 1) { nextProfile.energy += amount; text.push(`体力+${amount}`); }
        else if (reward.k === 2) { nextProfile.gold += amount; text.push(`金币+${amount}`); }
        else if (reward.k === 3) { nextProfile.diamonds += amount; text.push(`钻石+${amount}`); }
        else if (reward.k === 7) { nextState.endless.skinKeys += amount; text.push(`皮肤宝箱钥匙+${amount}`); }
        else if (reward.k === 'BOX_RF' && amount > 0) {
            const fragments = drawSpecialRandomFragments(amount, random);
            for (const family of SPECIAL_FRAGMENT_FAMILIES) {
                nextProfile.fragments[family] = Math.min(SPECIAL_FRAGMENT_STACK_LIMIT, (nextProfile.fragments[family] || 0) + (fragments[family] || 0));
            }
            text.push(`随机英雄碎片+${amount}`);
        }
    }
    nextState.daily.claimed[String(index)] = true;
    return { state: nextState, profile: nextProfile, claimed: true, text: text.join('，') || '奖励已领取' };
}
