export const BAGLIKE_FIRST_LEVEL_ID = 1001;
export const BAGLIKE_LAST_LEVEL_ID = 1200;
export const BAGLIKE_LEVEL_COUNT = BAGLIKE_LAST_LEVEL_ID - BAGLIKE_FIRST_LEVEL_ID + 1;
export const BAGLIKE_LEVELS_PER_PAGE = 20;

function integerInRange(value: unknown, min: number, max: number, fallback: number): number {
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, Math.floor(parsed)));
}

export function bagLikeLevelNumber(levelId: number): number {
    return integerInRange(levelId, BAGLIKE_FIRST_LEVEL_ID, BAGLIKE_LAST_LEVEL_ID, BAGLIKE_FIRST_LEVEL_ID)
        - BAGLIKE_FIRST_LEVEL_ID + 1;
}

// Recovered TrunkInstanceModel.isUnlock rule:
// level <= maxPassId + 1, with the first level always unlocked.
export function bagLikeLevelUnlocked(maxPassedLevelId: number, levelId: number): boolean {
    if (levelId < BAGLIKE_FIRST_LEVEL_ID || levelId > BAGLIKE_LAST_LEVEL_ID) return false;
    const maxPassed = integerInRange(maxPassedLevelId, BAGLIKE_FIRST_LEVEL_ID - 1, BAGLIKE_LAST_LEVEL_ID,
        BAGLIKE_FIRST_LEVEL_ID - 1);
    return levelId === BAGLIKE_FIRST_LEVEL_ID || levelId <= maxPassed + 1;
}

export function bagLikeLevelPassed(maxPassedLevelId: number, levelId: number): boolean {
    if (levelId < BAGLIKE_FIRST_LEVEL_ID || levelId > BAGLIKE_LAST_LEVEL_ID) return false;
    const maxPassed = integerInRange(maxPassedLevelId, BAGLIKE_FIRST_LEVEL_ID - 1, BAGLIKE_LAST_LEVEL_ID,
        BAGLIKE_FIRST_LEVEL_ID - 1);
    return levelId <= maxPassed;
}

export function bagLikeLatestUnlockedLevel(maxPassedLevelId: number): number {
    const maxPassed = integerInRange(maxPassedLevelId, BAGLIKE_FIRST_LEVEL_ID - 1, BAGLIKE_LAST_LEVEL_ID,
        BAGLIKE_FIRST_LEVEL_ID - 1);
    return Math.min(BAGLIKE_LAST_LEVEL_ID, Math.max(BAGLIKE_FIRST_LEVEL_ID, maxPassed + 1));
}

export function bagLikeLevelPageCount(): number {
    return Math.ceil(BAGLIKE_LEVEL_COUNT / BAGLIKE_LEVELS_PER_PAGE);
}

export function bagLikeLevelPageForId(levelId: number): number {
    const clamped = integerInRange(levelId, BAGLIKE_FIRST_LEVEL_ID, BAGLIKE_LAST_LEVEL_ID, BAGLIKE_FIRST_LEVEL_ID);
    return Math.floor((clamped - BAGLIKE_FIRST_LEVEL_ID) / BAGLIKE_LEVELS_PER_PAGE);
}

export function bagLikeLevelIdsForPage(page: number): number[] {
    const pageIndex = integerInRange(page, 0, bagLikeLevelPageCount() - 1, 0);
    const first = BAGLIKE_FIRST_LEVEL_ID + pageIndex * BAGLIKE_LEVELS_PER_PAGE;
    const last = Math.min(BAGLIKE_LAST_LEVEL_ID, first + BAGLIKE_LEVELS_PER_PAGE - 1);
    return Array.from({ length: last - first + 1 }, (_, index) => first + index);
}

export function bagLikeLevelFromSearch(search: string): number | null {
    const match = /(?:^|[?&])level=(\d+)(?:&|$)/.exec(search || '');
    if (!match) return null;
    const levelId = Number(match[1]);
    return Number.isInteger(levelId) && levelId >= BAGLIKE_FIRST_LEVEL_ID && levelId <= BAGLIKE_LAST_LEVEL_ID
        ? levelId
        : null;
}
