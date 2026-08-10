import assert from 'node:assert/strict';
import fs from 'node:fs';
import { candidateTrayLayout, placementAreaValid } from '../assets/scripts/BagLikeCandidateDrops.ts';
import { bagLikeProducerShape } from '../assets/scripts/BagLikeUnitProgression.ts';

const [
    debugBase = 'http://127.0.0.1:19264',
    appBase = 'http://127.0.0.1:18154',
    outputFile = '/private/tmp/hamster-all-level-browser-contract.json',
    levelList = '1001,1100,1200',
    screenshotDirectory = '',
    runMode = 'battle',
] = process.argv.slice(2);
assert.ok(runMode === 'battle' || runMode === 'preparation', 'run mode is battle or preparation');
if (screenshotDirectory) fs.mkdirSync(screenshotDirectory, { recursive: true });
const table = JSON.parse(fs.readFileSync(new URL('../assets/resources/data/normal-levels.json', import.meta.url), 'utf8'));
const expectedIds = levelList.split(',').map(Number);
assert.ok(expectedIds.length > 0 && expectedIds.every(Number.isInteger), 'level list contains numeric IDs');

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

async function tap(bounds, cocosX, cocosY) {
    const point = {
        x: bounds.x + ((cocosX + 375) / 750) * bounds.width,
        y: bounds.y + ((667 - cocosY) / 1334) * bounds.height,
    };
    await call('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ ...point, id: 1, radiusX: 1, radiusY: 1, force: 1 }],
    });
    await wait(80);
    await call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await wait(700);
}

async function drag(bounds, fromCocosX, fromCocosY, toCocosX, toCocosY) {
    const screenPoint = (cocosX, cocosY) => ({
        x: bounds.x + ((cocosX + 375) / 750) * bounds.width,
        y: bounds.y + ((667 - cocosY) / 1334) * bounds.height,
    });
    const from = screenPoint(fromCocosX, fromCocosY);
    const to = screenPoint(toCocosX, toCocosY);
    await call('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ ...from, id: 1, radiusX: 1, radiusY: 1, force: 1 }],
    });
    await wait(120);
    for (let step = 1; step <= 8; step += 1) {
        const ratio = step / 8;
        await call('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{
                x: from.x + (to.x - from.x) * ratio,
                y: from.y + (to.y - from.y) * ratio,
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

const initiallyUnlocked = new Set([9, 10, 11, 16, 17, 18, 23, 24, 25]);
const reservedCore = new Set([17]);
function deploymentPlan(state) {
    const candidateIds = String(state.candidateIds || '').split(',').filter(Boolean);
    const shapes = candidateIds.map((gearId) => bagLikeProducerShape(gearId));
    assert.ok(shapes.every(Boolean), `opening batch contains only producer shapes: ${candidateIds.join(',')}`);
    const tray = candidateTrayLayout(shapes.map((shape) => ({
        rows: Math.max(...shape.map(([row]) => row)) + 1,
        columns: Math.max(...shape.map(([, column]) => column)) + 1,
    })), 100, 12, 730);
    for (let candidateIndex = 0; candidateIndex < candidateIds.length; candidateIndex += 1) {
        const gearId = candidateIds[candidateIndex];
        const from = { x: tray[candidateIndex].x, y: -385 + tray[candidateIndex].y };
        const shape = bagLikeProducerShape(gearId);
        if (!shape) continue;
        for (let row = 0; row < 5; row += 1) {
            for (let column = 0; column < 7; column += 1) {
                if (!placementAreaValid(shape, row, column, 5, 7, initiallyUnlocked, reservedCore)) continue;
                const touchesCore = shape.some(([rowOffset, columnOffset]) =>
                    Math.abs(row + rowOffset - 2) + Math.abs(column + columnOffset - 3) === 1,
                );
                if (touchesCore) return { gearId, from, to: { x: -300 + column * 100, y: 252 - row * 100 } };
            }
        }
    }
    return null;
}

const evidence = [];
for (const levelId of expectedIds) {
    errors.length = 0;
    const row = table.levels.find((level) => level.id === levelId);
    assert.ok(row, `level ${levelId} exists in recovered data`);
    await call('Page.navigate', { url: `${appBase}/?directBattle=1&level=${levelId}&smoke=${Date.now()}` });
    await wait(5000);
    const preparation = await readCanvas();
    assert.ok(preparation, `level ${levelId} renders a Cocos canvas`);
    assert.equal(preparation.state.levelId, String(levelId));
    assert.equal(preparation.state.levelName, row.name);
    assert.equal(preparation.state.roundCount, String(row.roundIds.length));
    assert.equal(preparation.state.phase, 'deploy');
    assert.doesNotMatch(preparation.state.gearPortraits, /:(?:missing|pending)(?:;|$)/, `level ${levelId} opening producer portraits finish loading`);
    let preparationScreenshot = null;
    if (screenshotDirectory) {
        const capture = await call('Page.captureScreenshot', {
            format: 'png',
            fromSurface: true,
            clip: { ...preparation.bounds, scale: 1 },
        });
        preparationScreenshot = `level-${levelId}-preparation.png`;
        fs.writeFileSync(`${screenshotDirectory}/${preparationScreenshot}`, Buffer.from(capture.data, 'base64'));
    }
    if (runMode === 'preparation') {
        assert.deepEqual(errors, [], `level ${levelId} has no runtime errors`);
        evidence.push({ levelId, preparation: preparation.state, preparationScreenshot });
        continue;
    }
    const plan = deploymentPlan(preparation.state);
    assert.ok(plan, `level ${levelId} opening candidates contain a core-connectable producer: ${JSON.stringify(preparation.state)}`);
    await drag(preparation.bounds, plan.from.x, plan.from.y, plan.to.x, plan.to.y);
    const deployed = await readCanvas();
    assert.ok(deployed.state.gearIds.split(',').includes(plan.gearId), `level ${levelId} places ${plan.gearId} on the production grid`);
    await tap(preparation.bounds, 230.5, -598.5);
    await wait(6000);
    const battle = await readCanvas();
    assert.equal(battle.state.levelId, String(levelId));
    assert.equal(battle.state.phase, 'battle');
    assert.ok(Number(battle.state.powerGearTriggers) > 0, `level ${levelId} core triggers the placed producer`);
    assert.ok(Number(battle.state.workerApplies) > 0, `level ${levelId} applies production work`);
    assert.equal(battle.state.powerMissingGear, '0', `level ${levelId} has no missing production gear`);
    assert.equal(battle.state.powerMissingConfig, '0', `level ${levelId} has no missing production config`);
    assert.match(battle.state.workerProgressBars, /:visible(?:;|$)/, `level ${levelId} renders an independent worker progress bar`);
    assert.doesNotMatch(battle.state.gearPortraits, /:(?:missing|pending)(?:;|$)/, `level ${levelId} deployed producer portraits finish loading`);
    assert.deepEqual(errors, [], `level ${levelId} has no runtime errors`);
    let screenshot = null;
    if (screenshotDirectory) {
        const capture = await call('Page.captureScreenshot', {
            format: 'png',
            fromSurface: true,
            clip: { ...battle.bounds, scale: 1 },
        });
        screenshot = `level-${levelId}-battle.png`;
        fs.writeFileSync(`${screenshotDirectory}/${screenshot}`, Buffer.from(capture.data, 'base64'));
    }
    evidence.push({ levelId, preparation: preparation.state, battle: battle.state, preparationScreenshot, screenshot });
}

const report = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    levels: expectedIds,
    scope: runMode === 'preparation'
        ? 'Preparation-only Web smoke for recovered producer portrait loading.'
        : 'Early/middle/late production Web smoke for data loading, shape-aware drag, direct core contact, wave-1 entry and live production work.',
    evidence,
};
fs.writeFileSync(outputFile, `${JSON.stringify(report, null, 2)}\n`);
socket.close();
console.log(JSON.stringify({ passed: true, ...report }, null, 2));
