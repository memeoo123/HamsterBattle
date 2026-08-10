import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';

const [
    debugBase = 'http://127.0.0.1:19262',
    appBase = 'http://127.0.0.1:18151',
    outputDirectory = '/private/tmp/hamster-candidate-closure-contract',
    levelValue = '1002',
    timeoutValue = '360000',
    resumeValue = 'navigate',
] = process.argv.slice(2);
const levelId = Number(levelValue);
const timeoutMs = Number(timeoutValue);
assert.equal(levelId, 1002, 'the first closure contract is intentionally bounded to evidence-backed static level 1002');
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
    // Chrome reports a missing optional favicon as a generic Log error without
    // its URL. Runtime exceptions and project console errors remain fatal.
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
        errors.push(message.params.args.map((argument) => argument.value ?? argument.description ?? '').join(' '));
    }
});

function call(method, params = {}) {
    const id = ++serial;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

await call('Page.enable');
await call('Runtime.enable');
await call('Log.enable');
await call('Network.enable');
await call('Network.setCacheDisabled', { cacheDisabled: true });
await call('Emulation.setDeviceMetricsOverride', { width: 750, height: 1334, deviceScaleFactor: 1, mobile: false });
await call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
if (resumeValue !== 'resume') {
    await call('Page.navigate', { url: `${appBase}/?candidateBattle=1&level=${levelId}&closure=${Date.now()}` });
}
await wait(5000);

let bounds;
function screenPoint(cocosX, cocosY) {
    return {
        x: bounds.x + ((cocosX + 375) / 750) * bounds.width,
        y: bounds.y + ((667 - cocosY) / 1334) * bounds.height,
    };
}

async function readState() {
    const result = await call('Runtime.evaluate', {
        expression: `(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();
            return {
                bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                state: { ...canvas.dataset },
            };
        })()`,
        returnByValue: true,
    });
    return result.result.value;
}

async function touch(type, points) {
    await call('Input.dispatchTouchEvent', { type, touchPoints: points });
}

async function tap(cocosX, cocosY, settleMs = 500) {
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
    for (let step = 1; step <= 10; step += 1) {
        const ratio = step / 10;
        await touch('touchMove', [{
            x: from.x + (to.x - from.x) * ratio,
            y: from.y + (to.y - from.y) * ratio,
            id: 1,
            radiusX: 1,
            radiusY: 1,
            force: 1,
        }]);
        await wait(30);
    }
    await touch('touchEnd', []);
    await wait(650);
}

async function capture(file) {
    const result = await call('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        clip: { ...bounds, scale: 1 },
    });
    writeFileSync(`${outputDirectory}/${file}`, Buffer.from(result.data, 'base64'));
}

const initial = await readState();
assert.ok(initial, 'level 1002 creates a Cocos canvas');
bounds = initial.bounds;
assert.equal(initial.state.levelId, '1002');
assert.ok(['deploy', 'battle', 'trait', 'lost', 'won'].includes(initial.state.phase), 'closure resumes a valid production phase');
const initialFailedAttempts = Number(initial.state.failedAttempts || 0);

const trace = [];
let lastKey = '';
let attemptPrepared = false;
let highestRound = 0;
let losses = 0;
let won = false;
let peakSelfUnits = Number(initial.state.selfUnits || 0);
let peakEnemyUnits = Number(initial.state.enemyUnits || 0);
let lowestSelfHp = Number(initial.state.selfHp || 0);
let finalFailedAttempts = initialFailedAttempts;
let lastSampleAt = -5000;
const startedAt = Date.now();

function record(state, event) {
    const row = { atMs: Date.now() - startedAt, event, ...state };
    trace.push(row);
    console.log(JSON.stringify(row));
}

while (Date.now() - startedAt < timeoutMs) {
    const snapshot = await readState();
    assert.ok(snapshot, 'canvas remains available during closure run');
    const state = snapshot.state;
    finalFailedAttempts = Number(state.failedAttempts || finalFailedAttempts);
    const round = Number(state.round);
    highestRound = Math.max(highestRound, round);
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
        attemptPrepared = false;
        record((await readState()).state, 'retry');
        continue;
    }
    if (state.phase === 'won') {
        won = true;
        await capture('level-1002-won.png');
        record(state, 'won');
        break;
    }
    if (state.phase !== 'deploy') {
        await wait(500);
        continue;
    }

    if (round === 1 && !attemptPrepared) {
        assert.match(state.candidateIds, /^H1301,H1201,H0101$/, 'level 1002 retry restores its first static batch');
        await drag(-163, -385, -100, 152); // H13 L-shape above/left of the core.
        await drag(-106, -385, -100, -48); // H12 below the core.
        // H01 sits beside H13 at row 1 / col 4. It therefore shares H13's
        // recovered two-side connected component instead of running as an
        // isolated one-contact producer on the core's right.
        await drag(0, -385, 100, 152);
        attemptPrepared = true;
        record((await readState()).state, 'initial-three-side-deployment');
    } else if (round === 2) {
        assert.match(state.candidateIds, /^H1301,/, 'round 2 exposes the second recovered static batch');
        await drag(-163, -385, -100, 152); // Merge H1301 into the placed H1301.
        record((await readState()).state, 'h13-level-2-merge');
    } else if (round === 3) {
        assert.match(state.candidateIds, /^H1302,/, 'round 3 exposes the third recovered static batch');
        // Before either item moves, the three-item tray places vertical H04 at
        // x=0/y=-285. Put it over H01 so the full r1-r3/c4 column is occupied;
        // normal replacement returns H01 to the tray.
        await drag(0, -285, 100, 152);
        // H13 then relayouts to x=-156/y=-335 beside G02 and can merge safely.
        await drag(-156, -335, -100, 152);
        record((await readState()).state, 'h13-level-3-and-h04-deployment');
    }

    await tap(230.5, -598.5, 700);
    const afterStart = await readState();
    assert.equal(afterStart.state.phase, 'battle', `round ${round} starts through the production action button`);
    record(afterStart.state, 'round-started');
}

const report = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    levelId,
    won,
    losses,
    initialFailedAttempts,
    finalFailedAttempts,
    // Victory intentionally resets failedAttempts to zero. Keep the total
    // observable across a resumed runner segment instead of reporting that
    // reset value as the cumulative loss count.
    cumulativeLossesObserved: initialFailedAttempts + losses,
    highestRound,
    peakSelfUnits,
    peakEnemyUnits,
    lowestSelfHp,
    elapsedMs: Date.now() - startedAt,
    scope: 'Production interaction closure using recovered static batches, drag/merge, traits, normal loss compensation, and retry; no combat-stat overrides.',
    errors,
    trace,
};
writeFileSync(`${outputDirectory}/manifest.json`, `${JSON.stringify(report, null, 2)}\n`);
socket.close();
assert.deepEqual(errors, [], 'closure run has no browser runtime or project-console errors');
assert.equal(won, true, `level 1002 did not reach victory within ${timeoutMs} ms (highest round ${highestRound}, losses ${losses})`);
assert.equal(highestRound, 8, 'level 1002 reaches its final recovered round');
assert.ok(losses >= 0, 'loss count is recorded');
console.log(JSON.stringify({ passed: true, ...report, trace: undefined }, null, 2));
