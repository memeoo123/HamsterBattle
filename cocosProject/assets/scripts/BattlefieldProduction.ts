export const WORKER_POWER_MAX = 100;
export const POWER_LAP_SECONDS = 1;
export const POWER_CONTACT_DELAY_SECONDS = 0.2;
export const POWER_QUARTER_LAP_SECONDS = POWER_LAP_SECONDS / 4;
export const WORKER_COMPLETE_ANIMATION_SECONDS = 0.25;
export const HAMSTER_SPAWN_FLIGHT_SECONDS = 0.5;
export const BATTLE_SPEED_UP_MULTIPLE = 1.5;
// POWER:INIT_DATA equips P01 at star 0. P01_SKILL_S0 is a ROUND_START
// PRODUCTIVITY effect with param 1000 for 5000 ms.
export const P01_ROUND_START_PRODUCTIVITY_BASIS_POINTS = 1000;
export const P01_ROUND_START_PRODUCTIVITY_SECONDS = 5;
export const GEAR_ROTATION_DEGREES = 360;
export const GEAR_ODD_PHASE_DEGREES = 22.5;

export function p01RoundStartProductivity(remainingSeconds: number): number {
    return remainingSeconds > 0 ? 1 + P01_ROUND_START_PRODUCTIVITY_BASIS_POINTS / 10000 : 1;
}

// BagLikeView.onRo uses the occupied grid index and the power-core index to
// phase neighbouring gear teeth by 22.5 degrees and rotate them in opposite
// directions. The animation lasts for the power contact delay, then lands on
// the visually equivalent base angle after exactly one revolution.
export function gearRotationParity(gridIndex: number, powerIndex: number): 0 | 1 {
    return Math.abs(Math.trunc(gridIndex + powerIndex + 1)) % 2 as 0 | 1;
}

export function gearRotationAngleDegrees(
    gridIndex: number,
    powerIndex: number,
    elapsedSeconds: number,
    durationSeconds: number,
): number {
    const parity = gearRotationParity(gridIndex, powerIndex);
    const baseAngle = GEAR_ODD_PHASE_DEGREES * parity;
    if (durationSeconds <= 0 || elapsedSeconds >= durationSeconds) return baseAngle;
    const progress = Math.max(0, elapsedSeconds) / durationSeconds;
    return baseAngle + (parity ? 1 : -1) * GEAR_ROTATION_DEGREES * progress;
}

// BrickShowBaseCom rotates the power-core panel in quarter laps and pauses on
// an occupied side before starting the next quarter. nextDirection points at
// the side the panel is currently travelling towards; any time beyond the
// scheduled quarter is therefore the decoded occupied-side pause.
export function powerCoreRotationAngleDegrees(
    nextDirection: 0 | 1 | 2 | 3,
    remainingSeconds: number,
    quarterSeconds = POWER_QUARTER_LAP_SECONDS,
): number {
    const safeQuarter = quarterSeconds > 0 ? quarterSeconds : POWER_QUARTER_LAP_SECONDS;
    const completedDirection = (nextDirection + 3) % 4;
    const rotationRemaining = Math.min(safeQuarter, Math.max(0, remainingSeconds));
    const progress = 1 - rotationRemaining / safeQuarter;
    return (completedDirection * 90 + progress * 90) % 360;
}

export type PresentationDepthSource = { uid: number; y: number };

// Cocos renders later siblings in front. Units lower on screen therefore need
// a higher sibling index; uid keeps equal-y ordering stable across frames.
export function unitPresentationBackToFront(units: readonly PresentationDepthSource[]): number[] {
    return [...units]
        .sort((left, right) => right.y - left.y || left.uid - right.uid)
        .map((unit) => unit.uid);
}

export type PowerCoreClockState = {
    nextDirection: 0 | 1 | 2 | 3;
    remainingSeconds: number;
};

export type PowerCoreContact = {
    direction: 0 | 1 | 2 | 3;
    occupied: boolean;
};

// BrickShowBaseCom starts at its zero-angle pose, then contacts the side at the
// completed quarter-lap index. Its GameTimer tween continues across preparation
// and battle; only ShowNodeCom suppresses worker progress outside BATTLE.
export function advancePowerCoreClock(
    state: PowerCoreClockState,
    elapsedSeconds: number,
    occupiedAtDirection: (direction: 0 | 1 | 2 | 3) => boolean,
    productivity = 1,
): { state: PowerCoreClockState; contacts: PowerCoreContact[] } {
    let nextDirection = state.nextDirection;
    let remainingSeconds = state.remainingSeconds - Math.max(0, elapsedSeconds);
    const contacts: PowerCoreContact[] = [];
    while (remainingSeconds <= 0) {
        const occupied = occupiedAtDirection(nextDirection);
        contacts.push({ direction: nextDirection, occupied });
        nextDirection = ((nextDirection + 1) % 4) as 0 | 1 | 2 | 3;
        const safeProductivity = productivity > 0 ? productivity : 1;
        remainingSeconds += (POWER_QUARTER_LAP_SECONDS
            + (occupied ? POWER_CONTACT_DELAY_SECONDS : 0)) / safeProductivity;
    }
    return { state: { nextDirection, remainingSeconds }, contacts };
}

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
    // Creator 3.8.8's release Babel target lowers `[...set]` to
    // `[].concat(set)`, producing `[Set]` instead of numeric UIDs. Array.from
    // preserves the iterable semantics in both Node tests and Web builds.
    return Array.from(result);
}
