import assert from 'node:assert/strict';

const [
    debugBase = 'http://127.0.0.1:19226',
    appBase = 'http://127.0.0.1:18100',
] = process.argv.slice(2);

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
const runtimeErrors = [];
socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
        const operation = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) operation.reject(new Error(message.error.message));
        else operation.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') {
        runtimeErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
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
await call('Network.enable');
await call('Network.setCacheDisabled', { cacheDisabled: true });
await call('Emulation.setDeviceMetricsOverride', { width: 750, height: 1334, deviceScaleFactor: 1, mobile: false });
await call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
await call('Runtime.evaluate', {
    expression: `(() => {
        const key = 'cangshu.restore.baglike.account.v1';
        const profile = JSON.parse(localStorage.getItem(key) || 'null') || {
            schemaVersion: 2,
            stars: { H01: 1, H02: 1, H03: 1, H04: 1, H11: 1, H12: 1, H13: 1 },
            challengeTimesByLevel: {},
            gold: 0,
            energy: 5,
            diamonds: 0,
            fragments: {},
            maxPassedLevelId: 1007,
        };
        profile.maxPassedLevelId = 1007;
        localStorage.setItem(key, JSON.stringify(profile));
    })()`,
});
await call('Page.navigate', { url: `${appBase}/?directBattle=1&level=1008&merge=${Date.now()}` });
await wait(5000);

async function readCanvas() {
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
function screenPoint(bounds, cocosX, cocosY) {
    return {
        x: bounds.x + ((cocosX + 375) / 750) * bounds.width,
        y: bounds.y + ((667 - cocosY) / 1334) * bounds.height,
    };
}
async function drag(bounds, from, to) {
    const start = screenPoint(bounds, from.x, from.y);
    const end = screenPoint(bounds, to.x, to.y);
    await call('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ ...start, id: 1, radiusX: 1, radiusY: 1, force: 1 }],
    });
    await wait(120);
    for (let step = 1; step <= 8; step += 1) {
        const ratio = step / 8;
        await call('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{
                x: start.x + (end.x - start.x) * ratio,
                y: start.y + (end.y - start.y) * ratio,
                id: 1,
                radiusX: 1,
                radiusY: 1,
                force: 1,
            }],
        });
        await wait(35);
    }
    await call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await wait(900);
}

const before = await readCanvas();
assert.ok(before, 'level 1008 creates a Cocos canvas');
assert.equal(before.state.levelId, '1008');
const sharks = candidatePositions(before.state).filter((candidate) => candidate.id === 'H1401');
assert.equal(sharks.length, 2, `level 1008 opens with two H1401 sharks: ${before.state.candidateRuntime}`);
await drag(
    before.bounds,
    { x: sharks[0].x + 50, y: sharks[0].y - 47 },
    { x: sharks[1].x + 50, y: sharks[1].y - 47 },
);
const after = await readCanvas();
assert.match(after.state.candidateIds, /(?:^|,)H1402(?:,|$)/, `two H1401 sharks merge into H1402: ${after.state.candidateRuntime}`);
assert.doesNotMatch(after.state.candidateIds, /H1401/, 'both level-1 shark inputs are consumed');
assert.deepEqual(runtimeErrors, [], `level 1008 merge emits no runtime errors: ${runtimeErrors.join('\n')}`);
socket.close();

console.log(`level 1008 shark merge browser contract passed: ${before.state.candidateRuntime} -> ${after.state.candidateRuntime}`);
