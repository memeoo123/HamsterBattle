import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { bagLikeProducerShape } from '../assets/scripts/BagLikeUnitProgression.ts';

const [
    debugBase = 'http://127.0.0.1:19225',
    appBase = 'http://127.0.0.1:18100',
    outputDirectory = '/private/tmp/hamster-level-15-closure',
    levelArg = '1100',
    timeoutArg = '900000',
    resumeArg = 'navigate',
] = process.argv.slice(2);
const levelId = Number(levelArg);
const timeoutMs = Number(timeoutArg);
const resumeSession = resumeArg === 'resume';
const table = JSON.parse(readFileSync(new URL('../assets/resources/data/normal-levels.json', import.meta.url), 'utf8'));
const level = table.levels.find((entry) => entry.id === levelId);
assert.ok(level, `level ${levelId} exists in recovered runtime data`);
assert.equal(level.roundIds.length, 15, `level ${levelId} is a 15-wave closure target`);
mkdirSync(outputDirectory, { recursive: true });

const targets = await fetch(`${debugBase}/json/list`).then((response) => response.json());
const target = targets.find((entry) => entry.type === 'page');
if (!target?.webSocketDebuggerUrl) throw new Error('no debuggable Chrome page found');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
});

let serial = 0;
const pending = new Map();
const errors = [];
socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
        const operation = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) operation.reject(new Error(message.error.message));
        else operation.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') {
        const details = message.params.exceptionDetails;
        errors.push(details.exception?.description || details.text || 'runtime exception');
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
        errors.push(message.params.args.map((argument) => argument.value ?? argument.description ?? '').join(' '));
    }
});

function call(method, params = {}) {
    const id = ++serial;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await call('Page.enable');
await call('Runtime.enable');
await call('Log.enable');
await call('Network.enable');
await call('Network.setCacheDisabled', { cacheDisabled: true });
await call('Emulation.setDeviceMetricsOverride', { width: 750, height: 1334, deviceScaleFactor: 1, mobile: false });
await call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
if (!resumeSession) {
    await call('Page.navigate', { url: `${appBase}/?directBattle=1&level=${levelId}&closure15=${Date.now()}` });
    await wait(5000);
}

let bounds;
function screenPoint(cocosX, cocosY) {
    return {
        x: bounds.x + ((cocosX + 375) / 750) * bounds.width,
        y: bounds.y + ((667 - cocosY) / 1334) * bounds.height,
    };
}
async function touch(type, points) {
    await call('Input.dispatchTouchEvent', { type, touchPoints: points });
}
async function tap(cocosX, cocosY, settleMs = 600) {
    const point = screenPoint(cocosX, cocosY);
    await touch('touchStart', [{ ...point, id: 1, radiusX: 1, radiusY: 1, force: 1 }]);
    await wait(80);
    await touch('touchEnd', []);
    await wait(settleMs);
}
async function drag(fromCocosX, fromCocosY, toCocosX, toCocosY) {
    const from = screenPoint(fromCocosX, fromCocosY);
    const to = screenPoint(toCocosX, toCocosY);
    await touch('touchStart', [{ ...from, id: 1, radiusX: 1, radiusY: 1, force: 1 }]);
    await wait(100);
    for (let step = 1; step <= 8; step += 1) {
        const ratio = step / 8;
        await touch('touchMove', [{
            x: from.x + (to.x - from.x) * ratio,
            y: from.y + (to.y - from.y) * ratio,
            id: 1,
            radiusX: 1,
            radiusY: 1,
            force: 1,
        }]);
        await wait(35);
    }
    await touch('touchEnd', []);
    await wait(650);
}
async function readState() {
    const result = await call('Runtime.evaluate', {
        expression: `(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();
            return { bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, state: { ...canvas.dataset } };
        })()`,
        returnByValue: true,
    });
    return result.result.value;
}
async function capture(file) {
    const result = await call('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        clip: { ...bounds, scale: 1 },
    });
    writeFileSync(`${outputDirectory}/${file}`, Buffer.from(result.data, 'base64'));
}

function candidatePositions(state) {
    return String(state.candidateRuntime || '').split(';').filter(Boolean).map((entry) => {
        const match = /^([^@]+)@(-?[\d.]+),(-?[\d.]+)$/.exec(entry);
        assert.ok(match, `candidate runtime entry is parseable: ${entry}`);
        return { id: match[1], x: Number(match[2]), y: Number(match[3]) };
    });
}
function placedGears(state) {
    return String(state.gearRuntime || '').split(';').filter(Boolean).map((entry) => {
        const match = /^([^#]+)#\d+@(\d+),(\d+):/.exec(entry);
        assert.ok(match, `gear runtime entry is parseable: ${entry}`);
        return { id: match[1], row: Number(match[2]), column: Number(match[3]) };
    });
}
function gridPoint(row, column) {
    return { x: -300 + column * 100, y: 252 - row * 100 };
}
const unlockedCells = new Set([9, 10, 11, 16, 17, 18, 23, 24, 25]);
const coreCell = 17;
function occupiedCells(gears) {
    const occupied = new Set([coreCell]);
    for (const gear of gears) {
        if (gear.id === 'P01') continue;
        const shape = bagLikeProducerShape(gear.id);
        if (!shape) continue;
        for (const [rowOffset, columnOffset] of shape) {
            occupied.add((gear.row + rowOffset) * 7 + gear.column + columnOffset);
        }
    }
    return occupied;
}
function placementFor(gearId, gears) {
    const shape = bagLikeProducerShape(gearId);
    if (!shape) return null;
    const occupied = occupiedCells(gears);
    for (let row = 0; row < 5; row += 1) {
        for (let column = 0; column < 7; column += 1) {
            const cells = shape.map(([rowOffset, columnOffset]) => [row + rowOffset, column + columnOffset]);
            if (cells.some(([cellRow, cellColumn]) => cellRow < 0 || cellRow >= 5 || cellColumn < 0 || cellColumn >= 7)) continue;
            const indices = cells.map(([cellRow, cellColumn]) => cellRow * 7 + cellColumn);
            if (indices.some((index) => !unlockedCells.has(index) || occupied.has(index))) continue;
            // The production runtime traverses the whole connected gear block,
            // so later pieces may join an already core-connected producer rather
            // than each consuming one of the four cells beside P01 directly.
            const touchesConnectedBlock = cells.some(([cellRow, cellColumn]) =>
                [...occupied].some((index) => {
                    const occupiedRow = Math.floor(index / 7);
                    const occupiedColumn = index % 7;
                    return Math.abs(cellRow - occupiedRow) + Math.abs(cellColumn - occupiedColumn) === 1;
                }),
            );
            if (touchesConnectedBlock) return { row, column, ...gridPoint(row, column) };
        }
    }
    return null;
}

async function improveBoard() {
    // Re-read after every operation because candidate tray positions relayout and
    // successful merges can change both shape and occupied cells.
    for (let operation = 0; operation < 8; operation += 1) {
        const snapshot = await readState();
        const state = snapshot.state;
        const candidates = candidatePositions(state);
        const gears = placedGears(state);
        let action = null;

        for (const candidate of candidates) {
            const mergeTarget = gears.find((gear) => gear.id === candidate.id && gear.id !== 'P01');
            if (mergeTarget) {
                action = { candidate, target: gridPoint(mergeTarget.row, mergeTarget.column), kind: 'merge' };
                break;
            }
        }
        if (!action) {
            for (const candidate of candidates) {
                const placement = placementFor(candidate.id, gears);
                if (placement) {
                    action = { candidate, target: placement, kind: 'place' };
                    break;
                }
            }
        }
        if (!action) return;
        const beforeRuntime = `${state.candidateRuntime}|${state.gearRuntime}`;
        await drag(action.candidate.x, action.candidate.y, action.target.x, action.target.y);
        const after = (await readState()).state;
        const afterRuntime = `${after.candidateRuntime}|${after.gearRuntime}`;
        if (afterRuntime === beforeRuntime) return;
    }
}

const initial = await readState();
assert.ok(initial, `level ${levelId} creates a Cocos canvas`);
bounds = initial.bounds;
assert.equal(initial.state.levelId, String(levelId));
assert.equal(initial.state.roundCount, '15');
assert.ok(['deploy', 'battle', 'trait', 'lost', 'won'].includes(initial.state.phase));
const initialFailedAttempts = Number(initial.state.failedAttempts || 0);

const trace = [];
let lastKey = '';
let highestRound = Number(initial.state.round || 0);
let losses = 0;
let won = false;
let speedEnabled = resumeSession;
let peakSelfUnits = Number(initial.state.selfUnits || 0);
let peakEnemyUnits = Number(initial.state.enemyUnits || 0);
let lowestSelfHp = Number(initial.state.selfHp || 0);
let lastSampleAt = -5000;
const startedAt = Date.now();
function record(state, event) {
    const row = { atMs: Date.now() - startedAt, event, ...state };
    trace.push(row);
    console.log(JSON.stringify(row));
}

while (Date.now() - startedAt < timeoutMs) {
    const snapshot = await readState();
    assert.ok(snapshot, 'canvas remains available during 15-wave closure');
    const state = snapshot.state;
    highestRound = Math.max(highestRound, Number(state.round || 0));
    peakSelfUnits = Math.max(peakSelfUnits, Number(state.selfUnits || 0));
    peakEnemyUnits = Math.max(peakEnemyUnits, Number(state.enemyUnits || 0));
    lowestSelfHp = Math.min(lowestSelfHp, Number(state.selfHp || 0));
    const key = `${state.phase}:${state.round}:${state.failedAttempts}:${state.candidateIds}:${state.gearIds}`;
    if (key !== lastKey) {
        record(state, 'state');
        lastKey = key;
    }
    if (Date.now() - startedAt - lastSampleAt >= 5000) {
        record(state, 'sample');
        lastSampleAt = Date.now() - startedAt;
    }

    if (state.phase === 'trait') {
        await tap(-230, 20);
        record((await readState()).state, 'trait-selected');
        continue;
    }
    if (state.phase === 'lost') {
        losses += 1;
        await capture(`attempt-${state.failedAttempts}-lost.png`);
        await tap(-130, -95, 900);
        record((await readState()).state, 'retry');
        continue;
    }
    if (state.phase === 'won') {
        won = true;
        await capture(`level-${levelId}-won.png`);
        record(state, 'won');
        break;
    }
    if (state.phase !== 'deploy') {
        await wait(500);
        continue;
    }

    await improveBoard();
    await tap(230.5, -598.5, 700);
    const afterStart = await readState();
    assert.equal(afterStart.state.phase, 'battle', `round ${state.round} starts through the production action`);
    record(afterStart.state, 'round-started');
    if (!speedEnabled) {
        await tap(-256.5, 476.5, 300);
        speedEnabled = true;
    }
}

const final = (await readState()).state;
const report = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    levelId,
    levelName: level.name,
    won,
    losses,
    initialFailedAttempts,
    finalFailedAttempts: Number(final.failedAttempts || 0),
    cumulativeLossesObserved: initialFailedAttempts + losses,
    highestRound,
    peakSelfUnits,
    peakEnemyUnits,
    lowestSelfHp,
    elapsedMs: Date.now() - startedAt,
    scope: `Full 15-wave production interaction closure with dynamic shape-aware placement, normal merge, traits, speed control, defeat compensation and retry; no combat-stat or phase overrides${resumeSession ? '; resumed the existing browser session without navigation' : ''}.`,
    errors,
    trace,
};
writeFileSync(`${outputDirectory}/manifest.json`, `${JSON.stringify(report, null, 2)}\n`);
socket.close();
assert.deepEqual(errors, [], '15-wave closure has no browser runtime or project-console errors');
assert.equal(won, true, `level ${levelId} did not reach victory within ${timeoutMs} ms (round ${highestRound}, segment losses ${losses})`);
assert.equal(highestRound, 15, `level ${levelId} reaches its final recovered round`);
console.log(JSON.stringify({ passed: true, ...report, trace: undefined }, null, 2));
