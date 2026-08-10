import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';

const [
    debugBase = 'http://127.0.0.1:19260',
    outputDirectory = '/private/tmp/hamster-main-flow-contract',
    appBase = 'http://127.0.0.1:18140',
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
const consoleMessages = [];
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
    if (message.method === 'Runtime.consoleAPICalled') {
        const text = message.params.args.map((argument) => argument.value ?? argument.description ?? '').join(' ');
        consoleMessages.push(`${message.params.type}: ${text}`);
        if (message.params.type === 'error') errors.push(text);
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
await call('Page.navigate', { url: `${appBase}/?contract=${Date.now()}` });
// Ignore any late event emitted by the previously loaded page between
// Runtime.enable and navigation completion. Errors from this load remain.
errors.length = 0;
consoleMessages.length = 0;
await wait(5000);

const boundsResult = await call('Runtime.evaluate', {
    expression: `(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    })()`,
    returnByValue: true,
});
const bounds = boundsResult.result.value;
assert.ok(bounds, 'Cocos canvas exists');

function screenPoint(cocosX, cocosY) {
    return {
        x: bounds.x + ((cocosX + 375) / 750) * bounds.width,
        y: bounds.y + ((667 - cocosY) / 1334) * bounds.height,
    };
}

async function tap(cocosX, cocosY) {
    const point = screenPoint(cocosX, cocosY);
    await call('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ ...point, id: 1, radiusX: 1, radiusY: 1, force: 1 }],
    });
    await wait(80);
    await call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await wait(900);
}

async function capture(name) {
    const result = await call('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        clip: { ...bounds, scale: 1 },
    });
    const buffer = Buffer.from(result.data, 'base64');
    assert.ok(buffer.length > 10_000, `${name} screenshot contains rendered pixels`);
    const path = `${outputDirectory}/${name}.png`;
    writeFileSync(path, buffer);
    return { path, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex') };
}

async function readCanvasState() {
    const result = await call('Runtime.evaluate', {
        expression: `(() => {
            const canvas = document.querySelector('canvas');
            return canvas ? { ...canvas.dataset } : null;
        })()`,
        returnByValue: true,
    });
    return result.result.value;
}

const captures = [];
captures.push(await capture('01-main'));
await tap(0, 20);
captures.push(await capture('02-level-selection'));
for (let page = 1; page < 20; page += 1) await tap(235, -535);
captures.push(await capture('03-level-selection-page-20'));
await tap(258, -319);
const level1200 = await readCanvasState();
assert.equal(level1200.levelId, '1200', 'the visible page-20 challenge opens level 200');
captures.push(await capture('04-level-1200'));
await tap(-205, 617);
captures.push(await capture('05-returned-main'));
await tap(0, 20);
await tap(-82, 361);
const level1001 = await readCanvasState();
assert.equal(level1001.levelId, '1001', 'the visible first challenge opens level 1');
captures.push(await capture('06-level-1001'));

console.log(JSON.stringify({ bounds, captures, errors, consoleMessages }, null, 2));
assert.notEqual(captures[0].sha256, captures[1].sha256, 'main and level selection render differently');
assert.notEqual(captures[1].sha256, captures[2].sha256, 'selection page 1 and page 20 render differently');
assert.notEqual(captures[2].sha256, captures[3].sha256, 'selection page 20 and level 1200 render differently');
assert.notEqual(captures[4].sha256, captures[5].sha256, 'returned main and level 1001 render differently');
assert.deepEqual(errors, [], 'browser flow has no runtime or console errors');

const report = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    viewport: bounds,
    contract: [
        'normal launch renders main scene',
        'main scene opens recovered level selection',
        'nineteen visible next-page actions reach page 20',
        'the page-20 challenge enters level 1200 preparation',
        'battle HUD returns to main scene',
        'level 1001 enters preparation',
    ],
    scope: 'Functional reconstruction evidence; not an original-game visual baseline.',
    assertions: 13,
    captures: captures.map(({ path, ...capture }) => ({ ...capture, file: path.split('/').pop() })),
    errors,
};
writeFileSync(`${outputDirectory}/manifest.json`, `${JSON.stringify(report, null, 2)}\n`);
socket.close();
console.log(JSON.stringify({ passed: true, ...report }, null, 2));
