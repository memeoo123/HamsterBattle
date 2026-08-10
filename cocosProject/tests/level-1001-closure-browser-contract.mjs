import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';

const [
    debugBase = 'http://127.0.0.1:19264',
    appBase = 'http://127.0.0.1:7456',
    outputDirectory = '/private/tmp/hamster-level-1001-closure',
    timeoutArg = '600000',
    resumeArg = '',
] = process.argv.slice(2);
const timeoutMs = Number(timeoutArg);
const resumeSession = resumeArg === 'resume';
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
        errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
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
    await call('Page.navigate', { url: `${appBase}/?directBattle=1&level=1001&closure=${Date.now()}` });
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
async function tap(cocosX, cocosY, delay = 800) {
    const point = screenPoint(cocosX, cocosY);
    await touch('touchStart', [{ ...point, id: 1, radiusX: 1, radiusY: 1, force: 1 }]);
    await wait(80);
    await touch('touchEnd', []);
    await wait(delay);
}
async function drag(fromX, fromY, toX, toY) {
    const from = screenPoint(fromX, fromY);
    const to = screenPoint(toX, toY);
    await touch('touchStart', [{ ...from, id: 1, radiusX: 1, radiusY: 1, force: 1 }]);
    await wait(120);
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
    await wait(800);
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
function candidatePositions(state) {
    return String(state.candidateRuntime || '').split(';').filter(Boolean).map((entry) => {
        const match = /^([^@]+)@(-?[\d.]+),(-?[\d.]+)$/.exec(entry);
        assert.ok(match, `candidate runtime entry is parseable: ${entry}`);
        return { id: match[1], x: Number(match[2]), y: Number(match[3]) };
    });
}
async function dragCandidate(id, targetX, targetY) {
    const snapshot = await readState();
    const candidate = candidatePositions(snapshot.state).find((entry) => entry.id === id);
    assert.ok(candidate, `candidate ${id} exists in ${snapshot.state.candidateIds}`);
    await drag(candidate.x, candidate.y, targetX, targetY);
}

const initial = await readState();
assert.ok(initial, 'level 1001 creates a Cocos canvas');
bounds = initial.bounds;
assert.equal(initial.state.levelId, '1001');
assert.equal(initial.state.roundCount, '5');

const trace = [];
let lastKey = '';
let highestRound = 0;
let losses = 0;
let won = false;
let speedEnabled = false;
let preparedAttempt = -1;
const startedAt = Date.now();
function record(state, event) {
    const row = { atMs: Date.now() - startedAt, event, ...state };
    trace.push(row);
    console.log(JSON.stringify(row));
}

while (Date.now() - startedAt < timeoutMs) {
    const snapshot = await readState();
    assert.ok(snapshot, 'canvas remains available during level-1001 closure');
    const state = snapshot.state;
    const round = Number(state.round);
    const failedAttempts = Number(state.failedAttempts || 0);
    highestRound = Math.max(highestRound, round);
    const key = `${state.phase}:${state.round}:${state.failedAttempts}:${state.candidateIds}:${state.gearIds}`;
    if (key !== lastKey) {
        record(state, 'state');
        lastKey = key;
    }

    if (state.phase === 'trait') {
        await tap(-212, 0);
        continue;
    }
    if (state.phase === 'lost') {
        losses += 1;
        await tap(-130, -95, 1000);
        preparedAttempt = -1;
        continue;
    }
    if (state.phase === 'won') {
        won = true;
        record(state, 'won');
        break;
    }
    if (state.phase !== 'deploy') {
        await wait(500);
        continue;
    }

    if (round === 1 && preparedAttempt !== failedAttempts) {
        await dragCandidate('H0101', 0, 152); // Top side: r1/c3.
        preparedAttempt = failedAttempts;
    } else if (round === 2 && state.candidateIds.includes('H0201')) {
        await dragCandidate('H0201', -100, -48); // Bottom side: r3/c2-r3/c3.
    } else if (round === 4) {
        if (state.candidateIds.includes('H0401')) await dragCandidate('H0401', -100, 152); // Left side.
        const afterH04 = (await readState()).state;
        if (afterH04.candidateIds.includes('H0101')) await dragCandidate('H0101', 100, 52); // Right side.
        const afterH01 = (await readState()).state;
        if (afterH01.candidateIds.includes('H0201')) await dragCandidate('H0201', -100, -48); // Merge bottom H02.
    } else if (round === 5) {
        if (state.candidateIds.includes('H0101')) await dragCandidate('H0101', 100, 52); // Merge right H01.
        const afterH01 = (await readState()).state;
        if (afterH01.candidateIds.includes('H0401')) await dragCandidate('H0401', -100, 152); // Merge left H04.
        const afterH04 = (await readState()).state;
        if (afterH04.candidateIds.includes('H1201')) await dragCandidate('H1201', 0, 152); // Replace top with tower.
    }

    await tap(230.5, -598.5, 600);
    const afterStart = await readState();
    assert.equal(afterStart.state.phase, 'battle', `round ${round} starts through the production action`);
    if (!speedEnabled) {
        await tap(-256.5, 476.5, 300);
        speedEnabled = true;
    }
}

const report = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    levelId: 1001,
    won,
    losses,
    highestRound,
    elapsedMs: Date.now() - startedAt,
    scope: `Full production interaction closure using recovered static batches, normal drag/merge, traits, speed control, defeat compensation and retry; no stat or phase overrides${resumeSession ? '; resumed the existing browser session without navigation' : ''}.`,
    errors,
    trace,
};
writeFileSync(`${outputDirectory}/manifest.json`, `${JSON.stringify(report, null, 2)}\n`);
socket.close();
assert.deepEqual(errors, [], 'level-1001 closure has no browser runtime or project-console errors');
assert.equal(won, true, `level 1001 did not reach victory within ${timeoutMs} ms (round ${highestRound}, losses ${losses})`);
assert.equal(highestRound, 5, 'level 1001 reaches its final recovered round');
console.log(JSON.stringify({ passed: true, ...report, trace: undefined }, null, 2));
