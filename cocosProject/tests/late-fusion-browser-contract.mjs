import assert from 'node:assert/strict';

const [
    debugBase = 'http://127.0.0.1:19224',
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
await call('Page.navigate', { url: `${appBase}/?fusionValidation=late-battle&contract=${Date.now()}` });
errors.length = 0;
await wait(20_000);

const result = await call('Runtime.evaluate', {
    expression: `(() => {
        const canvas = document.querySelector('canvas');
        return {
            url: location.href,
            title: document.title,
            canvasCount: document.querySelectorAll('canvas').length,
            state: canvas ? { ...canvas.dataset } : null,
        };
    })()`,
    returnByValue: true,
});
const page = result.result.value;
const state = page.state;

assert.ok(state, 'Cocos canvas exposes browser contract state');
if (!state.gearIds) throw new Error(`browser contract did not initialize: ${JSON.stringify({ page, errors })}`);
assert.deepEqual(state.gearIds.split(',').sort(), ['H1005', 'H1505', 'H1805', 'P01'].sort(), 'all late fusion gears are placed');
assert.equal(state.workerProgressBars.split(';').length, 3, 'all late fusion gears expose production progress');
assert.ok(state.workerProgressBars.split(';').every((entry) => entry.endsWith(':visible')), 'all late fusion progress bars render');
assert.ok(state.gearPortraits.split(';').every((entry) => entry.endsWith(':loaded')), 'all late fusion portraits load');
assert.ok(Number(state.selfSpawns) >= 2, 'H1005 and H1805 complete the real hamster production path');
assert.ok(Number(state.fusionActiveCasts) >= 1, 'a late fusion active skill casts in battle');
assert.ok(Number(state.fusionActiveHits) >= 1, 'a late fusion active skill damages an enemy');
assert.ok(Number(state.h10PrimaryBulletCasts) >= 1, 'H1005 launches its type-11 fallback bullet');
assert.ok(Number(state.h10PrimaryBulletHits) >= 1, 'H1005 bullet resolves its recovered rectangle hit');
assert.equal(state.powerMissingGear, '0', 'power contacts resolve every placed gear');
assert.equal(state.powerMissingConfig, '0', 'power contacts resolve every gear configuration');
assert.equal(state.unitFallbacks, '', 'all living late-fusion battle units replace fallback graphics with Spine');
assert.deepEqual(errors, [], 'late fusion battle has no runtime or console errors');

socket.close();
console.log(JSON.stringify({ passed: true, assertions: 14, state, errors }, null, 2));
