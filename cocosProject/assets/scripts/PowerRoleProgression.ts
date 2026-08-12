export const POWER_ROLE_STORAGE_KEY = 'cangshu.restore.power.roles.v1';
export const POWER_ROLE_SCHEMA_VERSION = 2;
export const POWER_ROLE_FREE_FRAGMENT_COUNT = 2;
export const POWER_ROLE_DAILY_FREE_FRAGMENT_TIMES = 3;
export const POWER_ROLE_DAILY_FREE_LEVEL_TIMES = 3;
export const POWER_ROLE_MAX_STAR = 8;
export const POWER_ROLE_MAX_LEVEL = 180;

export const POWER_ROLE_IDS = ['P01', 'P02', 'P03', 'P04'] as const;
export type PowerRoleId = typeof POWER_ROLE_IDS[number];

export type PowerRoleEntry = {
    level: number;
    star: number;
    fragments: number;
    freeFragmentTimes: number;
    freeLevelTimes: number;
};

export type PowerRoleState = {
    schemaVersion: 2;
    dayKey: string;
    equippedRoleId: PowerRoleId;
    roles: Record<PowerRoleId, PowerRoleEntry>;
};

export type PowerRoleStorage = Pick<Storage, 'getItem' | 'setItem'>;

// PowerStarConfig cost for activating star -1 -> 0, then each 0 -> 8 step.
export const POWER_ROLE_STAR_COSTS = [10, 10, 20, 30, 40, 50, 60, 70, 80] as const;

export function powerRoleDayKey(now = new Date()): string {
    const monthNumber = now.getMonth() + 1;
    const dayNumber = now.getDate();
    const month = monthNumber < 10 ? `0${monthNumber}` : String(monthNumber);
    const day = dayNumber < 10 ? `0${dayNumber}` : String(dayNumber);
    return `${now.getFullYear()}-${month}-${day}`;
}

function integer(value: unknown, minimum: number, maximum: number, fallback: number): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(minimum, Math.min(maximum, Math.floor(numeric))) : fallback;
}

export function createPowerRoleState(now = new Date()): PowerRoleState {
    return {
        schemaVersion: POWER_ROLE_SCHEMA_VERSION,
        dayKey: powerRoleDayKey(now),
        equippedRoleId: 'P01',
        roles: {
            // Exact POWER:INIT_DATA: P01 starts at lv 0 / star 0 and is equipped.
            P01: { level: 0, star: 0, fragments: 0, freeFragmentTimes: 0, freeLevelTimes: 0 },
            P02: { level: 0, star: -1, fragments: 0, freeFragmentTimes: 0, freeLevelTimes: 0 },
            P03: { level: 0, star: -1, fragments: 0, freeFragmentTimes: 0, freeLevelTimes: 0 },
            P04: { level: 0, star: -1, fragments: 0, freeFragmentTimes: 0, freeLevelTimes: 0 },
        },
    };
}

export function normalizePowerRoleState(value: unknown, now = new Date()): PowerRoleState {
    const fallback = createPowerRoleState(now);
    const source = value && typeof value === 'object' ? value as Partial<PowerRoleState> : {};
    const sourceRoles = source.roles && typeof source.roles === 'object'
        ? source.roles as Partial<Record<PowerRoleId, Partial<PowerRoleEntry>>>
        : {};
    const sameDay = source.dayKey === fallback.dayKey;
    for (const id of POWER_ROLE_IDS) {
        const role = sourceRoles[id] || {};
        fallback.roles[id] = {
            level: integer(role.level, 0, 180, 0),
            star: integer(role.star, -1, POWER_ROLE_MAX_STAR, id === 'P01' ? 0 : -1),
            fragments: integer(role.fragments, 0, 9999, 0),
            freeFragmentTimes: sameDay
                ? integer(role.freeFragmentTimes, 0, POWER_ROLE_DAILY_FREE_FRAGMENT_TIMES, 0)
                : 0,
            freeLevelTimes: sameDay
                ? integer(role.freeLevelTimes, 0, POWER_ROLE_DAILY_FREE_LEVEL_TIMES, 0)
                : 0,
        };
    }
    // P01 is the original initialized role and cannot disappear through a bad save.
    fallback.roles.P01.star = Math.max(0, fallback.roles.P01.star);
    const equipped = POWER_ROLE_IDS.indexOf(source.equippedRoleId as PowerRoleId) >= 0
        ? source.equippedRoleId as PowerRoleId
        : 'P01';
    fallback.equippedRoleId = fallback.roles[equipped].star >= 0 ? equipped : 'P01';
    return fallback;
}

export function powerRoleLevelLimit(star: number): number {
    return star < 0 ? 0 : Math.min(POWER_ROLE_MAX_LEVEL, (star + 1) * 20);
}

export function powerRoleLevelCost(level: number): number {
    const safeLevel = integer(level, 0, POWER_ROLE_MAX_LEVEL - 1, 0);
    return 100 + Math.floor(safeLevel / 10) * 20;
}

export function claimPowerRoleFreeLevel(
    state: PowerRoleState,
    id: PowerRoleId,
): { state: PowerRoleState; upgraded: boolean; reason: 'upgraded' | 'locked' | 'limit' | 'starCap' | 'maxLevel' } {
    const next = normalizePowerRoleState(state);
    const role = next.roles[id];
    if (role.star < 0) return { state: next, upgraded: false, reason: 'locked' };
    if (role.level >= POWER_ROLE_MAX_LEVEL) return { state: next, upgraded: false, reason: 'maxLevel' };
    if (role.level >= powerRoleLevelLimit(role.star)) return { state: next, upgraded: false, reason: 'starCap' };
    if (role.freeLevelTimes >= POWER_ROLE_DAILY_FREE_LEVEL_TIMES) return { state: next, upgraded: false, reason: 'limit' };
    role.level += 1;
    role.freeLevelTimes += 1;
    return { state: next, upgraded: true, reason: 'upgraded' };
}

export function loadPowerRoleState(storage: PowerRoleStorage | null | undefined, now = new Date()): PowerRoleState {
    if (!storage) return createPowerRoleState(now);
    try {
        const raw = storage.getItem(POWER_ROLE_STORAGE_KEY);
        return normalizePowerRoleState(raw ? JSON.parse(raw) : null, now);
    } catch {
        return createPowerRoleState(now);
    }
}

export function savePowerRoleState(storage: PowerRoleStorage | null | undefined, state: PowerRoleState): boolean {
    if (!storage) return false;
    try {
        storage.setItem(POWER_ROLE_STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch {
        return false;
    }
}

export function claimPowerRoleFreeFragments(
    state: PowerRoleState,
    id: PowerRoleId,
): { state: PowerRoleState; claimed: boolean } {
    const next = normalizePowerRoleState(state);
    const role = next.roles[id];
    if (role.freeFragmentTimes >= POWER_ROLE_DAILY_FREE_FRAGMENT_TIMES) return { state: next, claimed: false };
    role.fragments += POWER_ROLE_FREE_FRAGMENT_COUNT;
    role.freeFragmentTimes += 1;
    return { state: next, claimed: true };
}

export function activatePowerRole(
    state: PowerRoleState,
    id: PowerRoleId,
): { state: PowerRoleState; activated: boolean } {
    const next = normalizePowerRoleState(state);
    const role = next.roles[id];
    const cost = POWER_ROLE_STAR_COSTS[0];
    if (role.star >= 0 || role.fragments < cost) return { state: next, activated: false };
    role.fragments -= cost;
    role.star = 0;
    return { state: next, activated: true };
}

export function upgradePowerRoleStar(
    state: PowerRoleState,
    id: PowerRoleId,
): { state: PowerRoleState; upgraded: boolean } {
    const next = normalizePowerRoleState(state);
    const role = next.roles[id];
    if (role.star < 0 || role.star >= POWER_ROLE_MAX_STAR) return { state: next, upgraded: false };
    const targetStar = role.star + 1;
    const cost = POWER_ROLE_STAR_COSTS[targetStar];
    if (role.fragments < cost) return { state: next, upgraded: false };
    role.fragments -= cost;
    role.star = targetStar;
    return { state: next, upgraded: true };
}

export function equipPowerRole(
    state: PowerRoleState,
    id: PowerRoleId,
): { state: PowerRoleState; equipped: boolean } {
    const next = normalizePowerRoleState(state);
    if (next.roles[id].star < 0) return { state: next, equipped: false };
    next.equippedRoleId = id;
    return { state: next, equipped: true };
}
