export type CandidateGearId =
    | 'H0101' | 'H0102' | 'H0103'
    | 'H0201' | 'H0202' | 'H0203'
    | 'H0301' | 'H0302' | 'H0303'
    | 'H0401' | 'H0402' | 'H0403'
    | 'H0501' | 'H0502' | 'H0503'
    | 'H0601' | 'H0602' | 'H0603'
    | 'H1101' | 'H1102' | 'H1103'
    | 'H1201' | 'H1202' | 'H1203'
    | 'H1301' | 'H1302' | 'H1303'
    | 'H1401' | 'H1402' | 'H1403'
    | 'H1601' | 'H1602' | 'H1603'
    | 'H1701' | 'H1702' | 'H1703'
    | 'C01' | 'C02' | 'C03'
    | 'G01' | 'G02' | 'G03' | 'G04' | 'G05' | 'G06' | 'G07' | 'G08' | 'G09';

export type CandidateRefreshType = 'prepare' | 'normal' | 'ad';

export type CandidateRewardWeightModifier = {
    rewardType: 'REWARD';
    rewardId: number;
    multiplier: number;
};

export type GearLevelRgb = readonly [number, number, number];

// Recovered from BagLikeGearColorUtils.lv. Index 0 is the power-core full color;
// producing gears use their configured merge level (1..5).
export const BAGLIKE_GEAR_LEVEL_COLORS: ReadonlyArray<GearLevelRgb> = [
    [255, 255, 255],
    [55, 138, 74],
    [62, 111, 212],
    [129, 64, 203],
    [203, 155, 64],
    [255, 99, 99],
];

export function bagLikeGearLevelColor(level: number): GearLevelRgb | null {
    return BAGLIKE_GEAR_LEVEL_COLORS[Math.floor(level)] ?? null;
}

export function bagLikeGearBodyColor(level: number | undefined, configuredFallback: GearLevelRgb): GearLevelRgb {
    if (level === undefined) return configuredFallback;
    return bagLikeGearLevelColor(level) ?? configuredFallback;
}

export type CandidateDrawContext = {
    unlockedHeroFamilies: ReadonlySet<string>;
    hasLockedGrid: boolean;
};

export type CandidateDynamicDrawContext = CandidateDrawContext & {
    placedGearIds: readonly string[];
    nonAdRefreshTimes: number;
    maxTrackedHeroFamilies?: number;
    untrackedHeroFamilies?: ReadonlySet<string>;
};

type WeightedEntry<T> = {
    value: T;
    weight: number;
};

const HERO_FAMILIES = [
    'H01', 'H02', 'H03', 'H04', 'H05', 'H06',
    'H11', 'H12', 'H13', 'H14', 'H16', 'H17',
] as const;
const COIN_REWARD_WEIGHT_MULTIPLIERS = [
    10000, 8000, 5000, 3000, 2500, 2000, 1500, 1000,
    850, 700, 500, 300, 250, 200, 150, 100,
] as const;
export const BAGLIKE_MAX_TRACKED_HERO_FAMILIES = 5;
export const BAGLIKE_FORCE_GRID_REFRESH_CADENCE = 7;
const REWARD_BRANCHES: Readonly<Record<number, ReadonlyArray<WeightedEntry<number>>>> = {
    3000: [
        { value: 3014, weight: 1000 },
        { value: 3015, weight: 0 },
        { value: 3016, weight: 0 },
    ],
    3001: [
        { value: 3014, weight: 1000 },
        { value: 3015, weight: 100 },
        { value: 3016, weight: 50 },
        { value: 3030, weight: 500 },
    ],
    3002: [
        { value: 3014, weight: 1000 },
        { value: 3015, weight: 100 },
        { value: 3016, weight: 50 },
        { value: 3034, weight: 1000 },
    ],
    3003: [
        { value: 3014, weight: 1000 },
        { value: 3015, weight: 100 },
        { value: 3016, weight: 50 },
    ],
    3004: [
        { value: 3015, weight: 100 },
        { value: 3016, weight: 50 },
    ],
};

const GRID_REWARDS: ReadonlyArray<WeightedEntry<CandidateGearId>> = [
    { value: 'G01', weight: 50 },
    { value: 'G02', weight: 150 },
    { value: 'G03', weight: 150 },
    { value: 'G04', weight: 90 },
    { value: 'G05', weight: 90 },
    { value: 'G06', weight: 30 },
    { value: 'G07', weight: 30 },
    { value: 'G08', weight: 30 },
    { value: 'G09', weight: 30 },
];

const COIN_REWARDS: ReadonlyArray<WeightedEntry<CandidateGearId>> = [
    { value: 'C01', weight: 1000 },
    { value: 'C02', weight: 100 },
    { value: 'C03', weight: 50 },
];

export function weightedCandidatePick<T>(entries: ReadonlyArray<WeightedEntry<T>>, random: () => number = Math.random): T | null {
    const eligible = entries.filter((entry) => entry.weight > 0);
    const total = eligible.reduce((sum, entry) => sum + entry.weight, 0);
    if (total <= 0) return null;
    let roll = Math.min(0.999999999999, Math.max(0, random())) * total;
    for (const entry of eligible) {
        roll -= entry.weight;
        if (roll < 0) return entry.value;
    }
    return eligible[eligible.length - 1]?.value ?? null;
}

export function candidateDrawIds(
    refreshType: CandidateRefreshType,
    nonAdRefreshTimes: number,
    hasLockedGrid: boolean,
): readonly number[] {
    if (refreshType === 'ad') return [3002, 3003, 3004];
    if (nonAdRefreshTimes === 1) return [3000, 3000, 3000];
    return hasLockedGrid ? [3001, 3002, 3003] : [3002, 3002, 3002];
}

export function shouldUseStaticCandidateBatch(
    levelId: number,
    challengeTimes: number,
    totalRefreshTimes: number,
    staticBatchCount: number,
): boolean {
    const foreverStatic = levelId === 1001 || levelId === 1002 || levelId === 1006 || levelId === 1007;
    return (foreverStatic || challengeTimes <= 1) && totalRefreshTimes < staticBatchCount;
}

// BagLilkeManager.addTempWeightRate installs SPECIAL_WORD reward modifiers only
// for the automatic Prepare refresh. A first-cost-free Normal refresh and an Ad
// refresh are different enum values and do not receive them.
export function candidateRewardModifiersForRefresh(
    refreshType: CandidateRefreshType,
    modifiers: readonly CandidateRewardWeightModifier[],
): readonly CandidateRewardWeightModifier[] {
    return refreshType === 'prepare' ? modifiers : [];
}

export function candidateHeroFamily(id: string): string | null {
    return id.startsWith('H') ? id.slice(0, 3) : null;
}

// BagLikeUsedHeroMap counts a level-N coin gear as 2^(N-1). The v18 table
// clamps counts above 100 and has no modifier at count zero.
export function placedCoinGearCount(ids: readonly string[]): number {
    return ids.reduce((total, id) => {
        if (!id.startsWith('C')) return total;
        const level = Number(id.slice(1));
        return total + (Number.isFinite(level) && level > 0 ? 2 ** (level - 1) : 0);
    }, 0);
}

export function coinRewardWeightMultiplier(coinGearCount: number): number | null {
    const count = Math.floor(coinGearCount);
    if (count < 1) return null;
    if (count >= COIN_REWARD_WEIGHT_MULTIPLIERS.length) {
        return COIN_REWARD_WEIGHT_MULTIPLIERS[COIN_REWARD_WEIGHT_MULTIPLIERS.length - 1];
    }
    return COIN_REWARD_WEIGHT_MULTIPLIERS[count - 1];
}

export function coinRewardWeightModifiers(ids: readonly string[]): CandidateRewardWeightModifier[] {
    const multiplier = coinRewardWeightMultiplier(placedCoinGearCount(ids));
    return multiplier === null ? [] : [{ rewardType: 'REWARD', rewardId: 3034, multiplier }];
}

export function shouldForceGridCandidate(
    nonAdRefreshTimes: number,
    hasLockedGrid: boolean,
    batch: readonly CandidateGearId[],
): boolean {
    return hasLockedGrid
        && nonAdRefreshTimes > 0
        && nonAdRefreshTimes % BAGLIKE_FORCE_GRID_REFRESH_CADENCE === 0
        && batch.length >= 3
        && !batch.some((id) => id.startsWith('G'));
}

function trackedHeroCounts(
    ids: readonly string[],
    untrackedHeroFamilies: ReadonlySet<string>,
): Map<string, number> {
    const counts = new Map<string, number>();
    for (const id of ids) {
        const family = candidateHeroFamily(id);
        if (!family || untrackedHeroFamilies.has(family)) continue;
        counts.set(family, (counts.get(family) || 0) + 1);
    }
    return counts;
}

function replaceDuplicateWithMissingFamily(
    batch: CandidateGearId[],
    unlockedHeroFamilies: ReadonlySet<string>,
    counts: Map<string, number>,
    maxFamilies: number,
    random: () => number,
): void {
    if (counts.size >= maxFamilies) return;
    // Creator's loose Babel transform lowers `[...set]` to `[].concat(set)`,
    // which produces one Set element and later the invalid id "[object Set]01".
    // Array.from preserves iterable semantics in both source tests and builds.
    const shuffledFamilies = Array.from(unlockedHeroFamilies);
    for (let index = shuffledFamilies.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.min(0.999999999999, Math.max(0, random())) * (index + 1));
        [shuffledFamilies[index], shuffledFamilies[swapIndex]] = [shuffledFamilies[swapIndex], shuffledFamilies[index]];
    }
    for (const family of shuffledFamilies) {
        if (counts.size >= maxFamilies) break;
        if (counts.has(family)) continue;
        const index = batch.findIndex((id) => {
            const existingFamily = candidateHeroFamily(id);
            return !!existingFamily && (counts.get(existingFamily) || 0) > 1;
        });
        if (index < 0) continue;
        const oldFamily = candidateHeroFamily(batch[index]);
        const level = Number(batch[index].slice(3));
        if (!oldFamily || !Number.isFinite(level) || level < 1 || level > 3) continue;
        const replacement = `${family}0${level}` as CandidateGearId;
        counts.set(oldFamily, (counts.get(oldFamily) || 1) - 1);
        if ((counts.get(oldFamily) || 0) <= 0) counts.delete(oldFamily);
        counts.set(family, (counts.get(family) || 0) + 1);
        batch[index] = replacement;
    }
}

function rewardBranchWithModifiers(
    branch: ReadonlyArray<WeightedEntry<number>>,
    modifiers: readonly CandidateRewardWeightModifier[],
): Array<WeightedEntry<number>> {
    return branch.map((entry) => ({
        ...entry,
        weight: modifiers.reduce(
            (weight, modifier) => modifier.rewardType === 'REWARD' && modifier.rewardId === entry.value
                ? weight * modifier.multiplier / 10000
                : weight,
            entry.weight,
        ),
    }));
}

function heroRewardPool(level: number, context: CandidateDrawContext): Array<WeightedEntry<CandidateGearId>> {
    const suffix = level < 10 ? `0${level}` : String(level);
    return HERO_FAMILIES
        .filter((family) => context.unlockedHeroFamilies.has(family))
        .map((family) => ({ value: `${family}${suffix}` as CandidateGearId, weight: 100 }));
}

export function drawCandidateReward(
    rewardId: number,
    context: CandidateDrawContext,
    random: () => number = Math.random,
    modifiers: readonly CandidateRewardWeightModifier[] = [],
): CandidateGearId | null {
    if (rewardId >= 3014 && rewardId <= 3016) {
        return weightedCandidatePick(heroRewardPool(rewardId - 3013, context), random);
    }
    if (rewardId === 3030) return context.hasLockedGrid ? weightedCandidatePick(GRID_REWARDS, random) : null;
    if (rewardId === 3034) return weightedCandidatePick(COIN_REWARDS, random);

    const branch = REWARD_BRANCHES[rewardId];
    if (!branch) return null;
    const eligibleBranches = rewardBranchWithModifiers(branch, modifiers)
        .filter((entry) => entry.value !== 3030 || context.hasLockedGrid);
    const child = weightedCandidatePick(eligibleBranches, random);
    return child === null ? null : drawCandidateReward(child, context, random, modifiers);
}

export function drawCandidateBatch(
    drawIds: readonly number[],
    context: CandidateDrawContext,
    random: () => number = Math.random,
    modifiers: readonly CandidateRewardWeightModifier[] = [],
): CandidateGearId[] {
    const result: CandidateGearId[] = [];
    for (const drawId of drawIds) {
        const item = drawCandidateReward(drawId, context, random, modifiers);
        if (item) result.push(item);
    }
    return result;
}

// Mirrors BagLilkeManager.refreshBrick's dynamic branch: account filtering and
// the five-family cap are applied while each slot is drawn, then coin-count
// weights, forced-grid cadence and missing-family replacement run in the same
// order as the original manager.
export function drawDynamicCandidateBatch(
    drawIds: readonly number[],
    context: CandidateDynamicDrawContext,
    random: () => number = Math.random,
    modifiers: readonly CandidateRewardWeightModifier[] = [],
): CandidateGearId[] {
    const untracked = context.untrackedHeroFamilies ?? new Set<string>(['H11']);
    const maxFamilies = context.maxTrackedHeroFamilies ?? BAGLIKE_MAX_TRACKED_HERO_FAMILIES;
    const counts = trackedHeroCounts(context.placedGearIds, untracked);
    const combinedModifiers = [...coinRewardWeightModifiers(context.placedGearIds), ...modifiers];
    const batch: CandidateGearId[] = [];

    for (const drawId of drawIds) {
        const allowedFamilies = counts.size >= maxFamilies
            ? new Set(Array.from(counts.keys()).concat(
                Array.from(context.unlockedHeroFamilies).filter((family) => untracked.has(family)),
            ))
            : context.unlockedHeroFamilies;
        const item = drawCandidateReward(
            drawId,
            { unlockedHeroFamilies: allowedFamilies, hasLockedGrid: context.hasLockedGrid },
            random,
            combinedModifiers,
        );
        if (!item) continue;
        batch.push(item);
        const family = candidateHeroFamily(item);
        if (family && !untracked.has(family)) counts.set(family, (counts.get(family) || 0) + 1);
    }

    if (shouldForceGridCandidate(context.nonAdRefreshTimes, context.hasLockedGrid, batch)) {
        const forcedGrid = drawCandidateReward(3030, context, random, combinedModifiers);
        if (forcedGrid) {
            const removedFamily = candidateHeroFamily(batch[2]);
            if (removedFamily && !untracked.has(removedFamily)) {
                counts.set(removedFamily, (counts.get(removedFamily) || 1) - 1);
                if ((counts.get(removedFamily) || 0) <= 0) counts.delete(removedFamily);
            }
            batch[2] = forcedGrid;
        }
    }
    replaceDuplicateWithMissingFamily(batch, context.unlockedHeroFamilies, counts, maxFamilies, random);
    return batch;
}

export type GridShape = ReadonlyArray<readonly [number, number]>;

export type PlacedFootprint = {
    uid: number;
    row: number;
    col: number;
    shape: GridShape;
};

export function placementCells(shape: GridShape, row: number, col: number): Array<[number, number]> {
    return shape.map(([rowOffset, colOffset]) => [row + rowOffset, col + colOffset]);
}

export function gearDropHitsTarget(
    shape: GridShape,
    targetX: number,
    targetY: number,
    targetScale: number,
    dropX: number,
    dropY: number,
    gridSize: number,
): boolean {
    const scale = Math.max(0, targetScale);
    const cellRadius = gridSize * 0.46 * scale;
    const hitsOccupiedCell = shape.some(([rowOffset, colOffset]) => {
        const cellX = targetX + colOffset * gridSize * scale;
        const cellY = targetY - rowOffset * gridSize * scale;
        return Math.abs(dropX - cellX) <= cellRadius && Math.abs(dropY - cellY) <= cellRadius;
    });
    if (hitsOccupiedCell || shape.length === 0) return hitsOccupiedCell;

    // Irregular pieces render their portrait at the footprint centre. For an L
    // shape that point can lie in the gap between occupied-cell hit boxes, so a
    // visually centred drop would otherwise fail (level 8's H1401 shark).
    const footprintRows = Math.max(...shape.map(([row]) => row)) + 1;
    const footprintColumns = Math.max(...shape.map(([, column]) => column)) + 1;
    const portraitX = targetX + (footprintColumns - 1) * gridSize * 0.5 * scale;
    const portraitY = targetY - (footprintRows - 1) * gridSize * 0.5 * scale;
    const portraitRadius = gridSize * 0.45 * scale;
    return Math.abs(dropX - portraitX) <= portraitRadius && Math.abs(dropY - portraitY) <= portraitRadius;
}

export function placementAreaValid(
    shape: GridShape,
    row: number,
    col: number,
    rows: number,
    columns: number,
    unlocked: ReadonlySet<number>,
    reserved: ReadonlySet<number>,
): boolean {
    return placementCells(shape, row, col).every(([cellRow, cellCol]) => {
        if (cellRow < 0 || cellRow >= rows || cellCol < 0 || cellCol >= columns) return false;
        const index = cellRow * columns + cellCol;
        return unlocked.has(index) && !reserved.has(index);
    });
}

export function displacedPlacementUids(
    placed: ReadonlyArray<PlacedFootprint>,
    movingUid: number,
    movingShape: GridShape,
    row: number,
    col: number,
): number[] {
    const targetCells = new Set(placementCells(movingShape, row, col).map(([cellRow, cellCol]) => `${cellRow}:${cellCol}`));
    return placed
        .filter((gear) => gear.uid !== movingUid)
        .filter((gear) => placementCells(gear.shape, gear.row, gear.col).some(([cellRow, cellCol]) => targetCells.has(`${cellRow}:${cellCol}`)))
        .map((gear) => gear.uid);
}

export type CandidateTrayFootprint = {
    rows: number;
    columns: number;
};

export type CandidateTrayPlacement = {
    x: number;
    y: number;
    row: number;
    scale: 1;
};

export function candidateTrayLayout(
    footprints: ReadonlyArray<CandidateTrayFootprint>,
    gridSize: number,
    gap: number,
    maxWidth: number,
): CandidateTrayPlacement[] {
    if (footprints.length === 0) return [];

    const rows: Array<{ indexes: number[]; width: number; height: number }> = [];
    for (let index = 0; index < footprints.length; index += 1) {
        const footprint = footprints[index];
        const width = Math.max(1, footprint.columns) * gridSize;
        const height = Math.max(1, footprint.rows) * gridSize;
        let row = rows[rows.length - 1];
        const nextWidth = row ? row.width + gap + width : width;
        if (!row || (row.indexes.length > 0 && nextWidth > maxWidth)) {
            row = { indexes: [], width: 0, height: 0 };
            rows.push(row);
        }
        row.width += (row.indexes.length > 0 ? gap : 0) + width;
        row.height = Math.max(row.height, height);
        row.indexes.push(index);
    }

    const totalHeight = rows.reduce((sum, row) => sum + row.height, 0)
        + Math.max(0, rows.length - 1) * gap;
    const placements = new Array<CandidateTrayPlacement>(footprints.length);
    let rowTop = totalHeight * 0.5;
    rows.forEach((row, rowIndex) => {
        const rowCenterY = rowTop - row.height * 0.5;
        let left = -row.width * 0.5;
        row.indexes.forEach((index) => {
            const footprint = footprints[index];
            placements[index] = {
                x: left + gridSize * 0.5,
                y: rowCenterY + (Math.max(1, footprint.rows) - 1) * gridSize * 0.5,
                row: rowIndex,
                scale: 1,
            };
            left += Math.max(1, footprint.columns) * gridSize + gap;
        });
        rowTop -= row.height + gap;
    });
    return placements;
}
