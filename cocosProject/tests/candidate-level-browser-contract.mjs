import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';

const [
    debugBase = 'http://127.0.0.1:19261',
    appBase = 'http://127.0.0.1:18150',
    outputDirectory = '/private/tmp/hamster-candidate-level-contract',
] = process.argv.slice(2);
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
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
        errors.push(message.params.entry.text);
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

async function tap(cocosX, cocosY) {
    const point = screenPoint(cocosX, cocosY);
    await touch('touchStart', [{ ...point, id: 1, radiusX: 1, radiusY: 1, force: 1 }]);
    await wait(80);
    await touch('touchEnd', []);
    await wait(900);
}

async function drag(fromCocosX, fromCocosY, toCocosX, toCocosY) {
    const from = screenPoint(fromCocosX, fromCocosY);
    const to = screenPoint(toCocosX, toCocosY);
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
    await wait(900);
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

async function capture(name) {
    const result = await call('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        clip: { ...bounds, scale: 1 },
    });
    const buffer = Buffer.from(result.data, 'base64');
    assert.ok(buffer.length > 10_000, `${name} screenshot contains rendered pixels`);
    const file = `${name}.png`;
    writeFileSync(`${outputDirectory}/${file}`, buffer);
    return { file, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex') };
}

const expectedLevels = [
    { id: 1002, name: '密林深处', roundCount: 8, staticBatchCount: 3 },
    { id: 1003, name: '荒漠边缘', roundCount: 10, staticBatchCount: 3 },
];
const evidence = [];
let assertionCount = 0;
for (const expected of expectedLevels) {
    errors.length = 0;
    await call('Page.navigate', {
        url: `${appBase}/?candidateBattle=1&level=${expected.id}&contract=${Date.now()}`,
    });
    await wait(5000);

    const preparation = await readState();
    assert.ok(preparation, `level ${expected.id} creates a Cocos canvas`); assertionCount += 1;
    bounds = preparation.bounds;
    assert.equal(preparation.state.levelId, String(expected.id)); assertionCount += 1;
    assert.equal(preparation.state.levelName, expected.name); assertionCount += 1;
    assert.equal(preparation.state.phase, 'deploy'); assertionCount += 1;
    assert.equal(preparation.state.round, '1'); assertionCount += 1;
    assert.equal(preparation.state.roundCount, String(expected.roundCount)); assertionCount += 1;
    assert.equal(preparation.state.staticBatchCount, String(expected.staticBatchCount)); assertionCount += 1;
    const preparationCapture = await capture(`level-${expected.id}-preparation`); assertionCount += 1;

    // The first recovered static batch always contains a hero in the left tray
    // slot. Place it in an open grid cell, then invoke the production action.
    await drag(-163, -385, -100, 152);
    await tap(230.5, -598.5);
    const battle = await readState();
    assert.equal(battle.state.levelId, String(expected.id)); assertionCount += 1;
    assert.equal(battle.state.phase, 'battle'); assertionCount += 1;
    assert.equal(battle.state.round, '1'); assertionCount += 1;
    const battleCapture = await capture(`level-${expected.id}-wave-1`); assertionCount += 1;
    assert.notEqual(preparationCapture.sha256, battleCapture.sha256, `level ${expected.id} changes after starting battle`); assertionCount += 1;
    assert.deepEqual(errors, [], `level ${expected.id} has no browser runtime errors`); assertionCount += 1;

    evidence.push({
        ...expected,
        preparation: preparation.state,
        battle: battle.state,
        captures: [preparationCapture, battleCapture],
    });
}

const report = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    assertionCount,
    scope: 'Candidate preparation and wave-1 production smoke; not full victory/defeat closure or original-game visual baseline.',
    evidence,
};
writeFileSync(`${outputDirectory}/manifest.json`, `${JSON.stringify(report, null, 2)}\n`);
socket.close();
console.log(JSON.stringify({ passed: true, ...report }, null, 2));
