import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [
    debugBase = 'http://127.0.0.1:19304',
    appBase = 'http://127.0.0.1:18181',
    outputDirectory = '',
] = process.argv.slice(2);

const targets = await fetch(`${debugBase}/json/list`).then((response) => response.json());
const target = targets.find((entry) => entry.type === 'page');
if (!target?.webSocketDebuggerUrl) throw new Error('no debuggable Chrome page found');

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolveOpen, reject) => {
    socket.addEventListener('open', resolveOpen, { once: true });
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
    return new Promise((resolveCall, reject) => pending.set(id, { resolve: resolveCall, reject }));
}

const wait = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));
await call('Page.enable');
await call('Runtime.enable');
await call('Network.enable');
await call('Network.setCacheDisabled', { cacheDisabled: true });
await call('Page.navigate', { url: `${appBase}/?resourceAudit=1&contract=${Date.now()}` });
errors.length = 0;

let state = null;
for (let attempt = 0; attempt < 120; attempt += 1) {
    await wait(500);
    const result = await call('Runtime.evaluate', {
        expression: `(() => {
            const canvas = document.querySelector('canvas');
            return canvas ? { ...canvas.dataset } : null;
        })()`,
        returnByValue: true,
    });
    state = result.result.value;
    if (state?.resourceAuditReady === '1') break;
}

assert.ok(state, 'Cocos canvas exposes resource audit state');
assert.equal(state.resourceAuditReady, '1', 'resource audit completes');
const manifest = JSON.parse(state.resourceAuditManifest);
assert.equal(manifest.length, Number(state.resourceAuditExpected), 'manifest covers every queued resource');
const statusCounts = Object.fromEntries(['loaded', 'static-fallback', 'file-missing'].map((status) => [
    status,
    manifest.filter((entry) => entry.status === status).length,
]));
assert.equal(statusCounts.loaded, Number(state.resourceAuditLoaded), 'loaded count matches manifest');
assert.equal(statusCounts['static-fallback'], Number(state.resourceAuditFallback), 'fallback count matches manifest');
assert.equal(statusCounts['file-missing'], Number(state.resourceAuditMissing), 'missing count matches manifest');
assert.deepEqual(
    manifest.filter((entry) => entry.status === 'file-missing').map((entry) => entry.id),
    ['H18_S1'],
    'only the evidence-backed absent H18 projectile remains file-missing',
);
assert.deepEqual(errors, [], 'audit route has no runtime or console errors');

const categories = Object.fromEntries(['hero', 'power-role', 'monster', 'projectile', 'effect'].map((category) => {
    const rows = manifest.filter((entry) => entry.category === category);
    return [category, {
        total: rows.length,
        loaded: rows.filter((entry) => entry.status === 'loaded').length,
        staticFallback: rows.filter((entry) => entry.status === 'static-fallback').length,
        fileMissing: rows.filter((entry) => entry.status === 'file-missing').length,
    }];
}));
const report = {
    schemaVersion: '1.0',
    target: { appId: 'wxf9af2417e78ce07a', version: '18' },
    generatedAt: new Date().toISOString(),
    build: appBase,
    passed: true,
    assertions: 8,
    totals: {
        total: manifest.length,
        loaded: statusCounts.loaded,
        staticFallback: statusCounts['static-fallback'],
        fileMissing: statusCounts['file-missing'],
    },
    categories,
    records: manifest,
    runtimeErrors: errors,
};

if (outputDirectory) {
    mkdirSync(outputDirectory, { recursive: true });
    writeFileSync(resolve(outputDirectory, 'full-resource-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
}
socket.close();
console.log(JSON.stringify(report, null, 2));
