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
await call('Network.enable');
await call('Network.setCacheDisabled', { cacheDisabled: true });
await call('Page.navigate', { url: `${appBase}/?visualCatalog=enemies&contract=${Date.now()}` });
errors.length = 0;

let state = null;
for (let attempt = 0; attempt < 30; attempt += 1) {
    await wait(500);
    const result = await call('Runtime.evaluate', {
        expression: `(() => {
            const canvas = document.querySelector('canvas');
            return canvas ? { ...canvas.dataset } : null;
        })()`,
        returnByValue: true,
    });
    state = result.result.value;
    if (Number(state?.visualCatalogLoaded) + Number(state?.visualCatalogFailed) === 25) break;
}

assert.ok(state, 'Cocos canvas exposes browser contract state');
assert.equal(state.visualCatalogLoaded, '25', 'all 25 recovered enemy Spine assets load');
assert.equal(state.visualCatalogFailed, '0', 'no enemy Spine asset falls back due to a load failure');
assert.deepEqual(errors, [], 'enemy visual catalog has no runtime or console errors');

socket.close();
console.log(JSON.stringify({ passed: true, assertions: 4, state, errors }, null, 2));
