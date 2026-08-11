export const MOCK_AD_STORAGE_KEY = 'hamsterBattle.mockAdvertisement.v1';

export type MockAdPlacement =
    | 'endless-third'
    | 'battle-refresh'
    | 'trait-reroll'
    | 'trait-take-all'
    | 'shop-energy';

export type MockAdOutcome = 'completed' | 'cancelled' | 'failed';

export interface MockAdvertisementState {
    schemaVersion: 1;
    dayKey: string;
    totalCompleted: number;
    todayCompleted: number;
    placementToday: Partial<Record<MockAdPlacement, number>>;
}

interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}

export function mockAdvertisementDayKey(now = new Date()): string {
    const year = now.getFullYear();
    const monthNumber = now.getMonth() + 1;
    const dayNumber = now.getDate();
    const month = monthNumber < 10 ? `0${monthNumber}` : String(monthNumber);
    const day = dayNumber < 10 ? `0${dayNumber}` : String(dayNumber);
    return `${year}-${month}-${day}`;
}

export function createMockAdvertisementState(now = new Date()): MockAdvertisementState {
    return {
        schemaVersion: 1,
        dayKey: mockAdvertisementDayKey(now),
        totalCompleted: 0,
        todayCompleted: 0,
        placementToday: {},
    };
}

function safeCount(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

export function normalizeMockAdvertisementState(value: unknown, now = new Date()): MockAdvertisementState {
    const source = value && typeof value === 'object' ? value as Partial<MockAdvertisementState> : {};
    const today = mockAdvertisementDayKey(now);
    const sameDay = source.dayKey === today;
    const placementToday: Partial<Record<MockAdPlacement, number>> = {};
    if (sameDay && source.placementToday && typeof source.placementToday === 'object') {
        for (const placement of ['endless-third', 'battle-refresh', 'trait-reroll', 'trait-take-all', 'shop-energy'] as MockAdPlacement[]) {
            const count = safeCount(source.placementToday[placement]);
            if (count > 0) placementToday[placement] = count;
        }
    }
    return {
        schemaVersion: 1,
        dayKey: today,
        totalCompleted: safeCount(source.totalCompleted),
        todayCompleted: sameDay ? safeCount(source.todayCompleted) : 0,
        placementToday,
    };
}

export function loadMockAdvertisementState(storage: StorageLike, now = new Date()): MockAdvertisementState {
    try {
        const raw = storage.getItem(MOCK_AD_STORAGE_KEY);
        return normalizeMockAdvertisementState(raw ? JSON.parse(raw) : null, now);
    } catch {
        return createMockAdvertisementState(now);
    }
}

export function saveMockAdvertisementState(storage: StorageLike, state: MockAdvertisementState): boolean {
    try {
        storage.setItem(MOCK_AD_STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch {
        return false;
    }
}

export function mockAdvertisementOutcomeFromSearch(search: string): MockAdOutcome {
    const match = /(?:^|[?&])mockAd=([^&]*)/i.exec(search || '');
    const value = match ? decodeURIComponent(match[1]).toLowerCase() : '';
    if (value === 'cancel' || value === 'cancelled') return 'cancelled';
    if (value === 'fail' || value === 'failed' || value === 'error') return 'failed';
    return 'completed';
}

export function completeMockAdvertisement(
    state: MockAdvertisementState,
    placement: MockAdPlacement,
    now = new Date(),
): MockAdvertisementState {
    const current = normalizeMockAdvertisementState(state, now);
    return {
        ...current,
        totalCompleted: current.totalCompleted + 1,
        todayCompleted: current.todayCompleted + 1,
        placementToday: {
            ...current.placementToday,
            [placement]: (current.placementToday[placement] || 0) + 1,
        },
    };
}

export function mockAdvertisementPlacementCount(
    state: MockAdvertisementState,
    placement: MockAdPlacement,
    now = new Date(),
): number {
    return normalizeMockAdvertisementState(state, now).placementToday[placement] || 0;
}

export function canClaimMockShopEnergy(state: MockAdvertisementState, now = new Date()): boolean {
    return mockAdvertisementPlacementCount(state, 'shop-energy', now) < 3;
}

export function mockAdvertisementPlacementLabel(placement: MockAdPlacement): string {
    return {
        'endless-third': '无尽试炼第 3 次挑战',
        'battle-refresh': '准备区候选刷新',
        'trait-reroll': '局内词条重抽',
        'trait-take-all': '局内词条全选',
        'shop-energy': '商店体力奖励',
    }[placement];
}
