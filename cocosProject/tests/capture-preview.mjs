import { writeFileSync } from 'node:fs';

const [
    debugBase = 'http://127.0.0.1:19251',
    output = '/private/tmp/cocos-preview.png',
    targetUrl = 'http://localhost:7456/',
    mode = 'initial',
    bootstrapWaitValue = '4000',
    sceneWaitValue = '6000',
] = process.argv.slice(2);
const bootstrapWaitMs = Number(bootstrapWaitValue);
const sceneWaitMs = Number(sceneWaitValue);
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
const consoleMessages = [];
socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
    }
    if (message.method === 'Runtime.consoleAPICalled') {
        consoleMessages.push(message.params.args.map((arg) => arg.value ?? arg.description ?? '').join(' '));
    }
});

function call(method, params = {}) {
    const id = ++serial;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await call('Page.enable');
await call('Runtime.enable');
await call('Emulation.setDeviceMetricsOverride', {
    width: 750,
    height: 1334,
    deviceScaleFactor: 1,
    mobile: false,
});
await call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
const resumeExistingPage = mode === 'resume-battle' || mode === 'resume-trait';
if (!resumeExistingPage) {
    await call('Page.navigate', { url: targetUrl });
    await new Promise((resolve) => setTimeout(resolve, bootstrapWaitMs));
    await call('Runtime.evaluate', {
        expression: `(() => {
            const fps = document.querySelector('#btn-show-fps.checked');
            if (fps) fps.click();
            document.querySelector('li[data-device="WebpageFullScreen"]')?.click();
        })()`,
    });
    await new Promise((resolve) => setTimeout(resolve, sceneWaitMs));
}

async function touch(type, x, y) {
    const touchPoints = type === 'touchEnd' ? [] : [{ x, y, id: 1, radiusX: 1, radiusY: 1, force: 1 }];
    await call('Input.dispatchTouchEvent', { type, touchPoints });
}

async function tap(x, y) {
    await touch('touchStart', x, y);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await touch('touchEnd', x, y);
    await new Promise((resolve) => setTimeout(resolve, 250));
}

async function drag(fromX, fromY, toX, toY) {
    await touch('touchStart', fromX, fromY);
    for (let step = 1; step <= 12; step += 1) {
        const ratio = step / 12;
        await touch('touchMove', fromX + (toX - fromX) * ratio, fromY + (toY - fromY) * ratio);
    }
    await touch('touchEnd', toX, toY);
    await new Promise((resolve) => setTimeout(resolve, 350));
}

if (mode === 'battle' || mode === 'trait' || resumeExistingPage) {
    if (mode === 'resume-trait') {
        // Coordinates are supplied by the unchanged preparation capture on the
        // same page. This batch is H12 (2x1), H04 (1x3), H02 (2x1); after each
        // placement the remaining candidates are re-centred by the game.
        await drag(212, 1050, 275, 515);
        await drag(269, 952, 475, 515);
        await drag(325, 1050, 275, 715);
    } else {
        // The first random tray candidate is centred around (212, 1050).
        // Dropping onto the left column keeps every recovered hero shape inside
        // the currently unlocked 3x3 preparation area.
        await drag(212, 1050, 275, 515);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await tap(600, 1265);
    await new Promise((resolve) => setTimeout(resolve, mode === 'trait' || mode === 'resume-trait' ? 30000 : 4000));
}
const boundsResult = await call('Runtime.evaluate', {
    expression: `(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    })()`,
    returnByValue: true,
});
const clip = boundsResult.result.value;
if (!clip) throw new Error('Cocos preview canvas was not found');
const screenshot = await call('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    clip: { ...clip, scale: 1 },
});
writeFileSync(output, Buffer.from(screenshot.data, 'base64'));
socket.close();
console.log(JSON.stringify({ output, clip, consoleMessages }, null, 2));
