export const WORKER_POWER_MAX = 100;
export const POWER_LAP_SECONDS = 1;
export const POWER_CONTACT_DELAY_SECONDS = 0.2;
export const POWER_QUARTER_LAP_SECONDS = POWER_LAP_SECONDS / 4;
export const WORKER_COMPLETE_ANIMATION_SECONDS = 0.25;
export const HAMSTER_SPAWN_FLIGHT_SECONDS = 0.5;
export const BATTLE_SPEED_UP_MULTIPLE = 1.5;

export type GearCellSource = {
    uid: number;
    row: number;
    col: number;
    shape: ReadonlyArray<readonly [number, number]>;
};

type OccupiedCell = {
    row: number;
    col: number;
    uid: number;
};

const cellKey = (row: number, col: number): string => `${row}:${col}`;

function occupiedCells(gears: readonly GearCellSource[], excludedUid: number): Map<string, OccupiedCell> {
    const result = new Map<string, OccupiedCell>();
    for (const gear of gears) {
        if (gear.uid === excludedUid) continue;
        for (const [rowOffset, colOffset] of gear.shape) {
            const row = gear.row + rowOffset;
            const col = gear.col + colOffset;
            result.set(cellKey(row, col), { row, col, uid: gear.uid });
        }
    }
    return result;
}

/**
 * Mirrors BagLilkePowerUtils.calPowerLink: each occupied side of the power core
 * triggers the whole orthogonally connected component. A component touching
 * two core sides is therefore powered twice per lap.
 */
export function powerContactsByGear(gears: readonly GearCellSource[], coreUid: number): Map<number, number> {
    const core = gears.find((gear) => gear.uid === coreUid);
    const contacts = new Map<number, number>();
    if (!core) return contacts;

    const cells = occupiedCells(gears, coreUid);
    const coreCell = { row: core.row + core.shape[0][0], col: core.col + core.shape[0][1] };
    const neighbors = [
        [coreCell.row, coreCell.col + 1],
        [coreCell.row + 1, coreCell.col],
        [coreCell.row, coreCell.col - 1],
        [coreCell.row - 1, coreCell.col],
    ] as const;
    const visited = new Set<string>();

    for (const [startRow, startCol] of neighbors) {
        const startKey = cellKey(startRow, startCol);
        if (visited.has(startKey) || !cells.has(startKey)) continue;
        const queue = [cells.get(startKey)!];
        const componentUids = new Set<number>();
        const componentKeys = new Set<string>();
        visited.add(startKey);
        while (queue.length > 0) {
            const cell = queue.shift()!;
            const key = cellKey(cell.row, cell.col);
            componentKeys.add(key);
            componentUids.add(cell.uid);
            for (const [row, col] of [
                [cell.row, cell.col + 1],
                [cell.row + 1, cell.col],
                [cell.row, cell.col - 1],
                [cell.row - 1, cell.col],
            ]) {
                const neighborKey = cellKey(row, col);
                const neighbor = cells.get(neighborKey);
                if (neighbor && !visited.has(neighborKey)) {
                    visited.add(neighborKey);
                    queue.push(neighbor);
                }
            }
        }
        const coreContactCount = neighbors.reduce(
            (count, [row, col]) => count + (componentKeys.has(cellKey(row, col)) ? 1 : 0),
            0,
        );
        for (const uid of componentUids) contacts.set(uid, coreContactCount);
    }
    return contacts;
}

// BagLilkePowerUtils.nearPowerSidMap records only the SIDs found in the four
// cells immediately beside the one-cell power core. A farther gear can share
// the same powered component without qualifying for POWER_NEAR_* effects.
export function isGearDirectlyAdjacentToCore(
    gears: readonly GearCellSource[],
    coreUid: number,
    gearUid: number,
): boolean {
    const core = gears.find((gear) => gear.uid === coreUid);
    const gear = gears.find((entry) => entry.uid === gearUid);
    if (!core || !gear || coreUid === gearUid) return false;
    const coreRow = core.row + core.shape[0][0];
    const coreCol = core.col + core.shape[0][1];
    return gear.shape.some(([rowOffset, colOffset]) => {
        const row = gear.row + rowOffset;
        const col = gear.col + colOffset;
        return Math.abs(row - coreRow) + Math.abs(col - coreCol) === 1;
    });
}

// The original multiplies only ATK when creating a hamster or one-shot WHEEL
// skill. HP keeps the producer level's unmodified attribute multiple.
export function resolveProducerAttributeScales(
    attributeMultiple: number,
    directlyAdjacentToCore: boolean,
    nearPowerAttackMultiplier: number,
): { attack: number; hp: number } {
    return {
        attack: attributeMultiple * (directlyAdjacentToCore ? nearPowerAttackMultiplier : 1),
        hp: attributeMultiple,
    };
}

// WorkerBar.addBar applies POWER_NEAR_WORKER_UP to each incoming progress
// amount only when that producer is in the core's direct-neighbor SID map.
export function resolveWorkerPowerPerTrigger(
    powerPerTrigger: number,
    directlyAdjacentToCore: boolean,
    nearPowerWorkerMultiplier: number,
): number {
    return powerPerTrigger * (directlyAdjacentToCore ? nearPowerWorkerMultiplier : 1);
}

export function productionRatePerSecond(powerPerTrigger: number, coreContacts: number, productivity = 1): number {
    if (powerPerTrigger <= 0 || coreContacts <= 0 || productivity <= 0) return 0;
    const lapSeconds = (POWER_LAP_SECONDS + POWER_CONTACT_DELAY_SECONDS * coreContacts) / productivity;
    return powerPerTrigger * coreContacts / lapSeconds / WORKER_POWER_MAX;
}

export function applyWorkerPower(current: number, powerPerTrigger: number): { value: number; completed: boolean } {
    const total = current + powerPerTrigger;
    return {
        value: total % WORKER_POWER_MAX,
        completed: total >= WORKER_POWER_MAX,
    };
}

export function connectedGearUidsAtCoreSide(
    gears: readonly GearCellSource[],
    coreUid: number,
    direction: 0 | 1 | 2 | 3,
): number[] {
    const core = gears.find((gear) => gear.uid === coreUid);
    if (!core) return [];
    const cells = occupiedCells(gears, coreUid);
    const coreRow = core.row + core.shape[0][0];
    const coreCol = core.col + core.shape[0][1];
    const offsets = [[0, 1], [1, 0], [0, -1], [-1, 0]] as const;
    const [rowOffset, colOffset] = offsets[direction];
    const start = cells.get(cellKey(coreRow + rowOffset, coreCol + colOffset));
    if (!start) return [];

    const queue = [start];
    const visited = new Set<string>([cellKey(start.row, start.col)]);
    const result = new Set<number>();
    while (queue.length > 0) {
        const cell = queue.shift()!;
        result.add(cell.uid);
        for (const [row, col] of [
            [cell.row, cell.col + 1],
            [cell.row + 1, cell.col],
            [cell.row, cell.col - 1],
            [cell.row - 1, cell.col],
        ]) {
            const key = cellKey(row, col);
            const neighbor = cells.get(key);
            if (neighbor && !visited.has(key)) {
                visited.add(key);
                queue.push(neighbor);
            }
        }
    }
    return [...result];
}
