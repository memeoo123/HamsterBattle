import fs from 'node:fs';
import path from 'node:path';

const [
    debugBase = 'http://127.0.0.1:19320',
    appBase = 'http://127.0.0.1:18190',
    outputFile = '/private/tmp/hamster-all-level-runtime-smoke.json',
    levelList = 'all',
    timeoutValue = '20000',
    failureScreenshotDirectory = '',
] = process.argv.slice(2);

const perLevelTimeoutMs = Number(timeoutValue);
if (!Number.isFinite(perLevelTimeoutMs) || perLevelTimeoutMs < 3000) {
    throw new Error(`invalid per-level timeout: ${timeoutValue}`);
}

const table = JSON.parse(fs.readFileSync(new URL('../assets/resources/data/normal-levels.json', import.meta.url), 'utf8'));
const levels = levelList === 'all'
    ? table.levels
    : levelList.split(',').filter(Boolean).map((value) => {
        const id = Number(value);
        const level = table.levels.find((entry) => entry.id === id);
        if (!level) throw new Error(`level ${value} is absent from normal-levels.json`);
        return level;
    });
if (levels.length === 0) throw new Error('no levels selected');
if (failureScreenshotDirectory) fs.mkdirSync(failureScreenshotDirectory, { recursive: true });
fs.mkdirSync(path.dirname(path.resolve(outputFile)), { recursive: true });

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
let currentErrors = [];
socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
        const operation = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) operation.reject(new Error(message.error.message));
        else operation.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') {
        currentErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
        currentErrors.push(message.params.args.map((argument) => argument.value ?? argument.description ?? '').join(' '));
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

async function readCanvas() {
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

async function enableLongRun(levelId) {
    await call('Runtime.evaluate', {
        expression: `history.replaceState(null, '', location.pathname + '?directBattle=1&level=${levelId}&longRunValidation=1&allLevelRuntimeSmoke=1')`,
    });
}

async function captureFailure(levelId, bounds) {
    if (!failureScreenshotDirectory || !bounds) return null;
    const result = await call('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        clip: { ...bounds, scale: 1 },
    });
    const file = `level-${levelId}-failure.png`;
    fs.writeFileSync(path.join(failureScreenshotDirectory, file), Buffer.from(result.data, 'base64'));
    return file;
}

function numeric(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

const evidence = [];
for (const level of levels) {
    currentErrors = [];
    const startedAt = Date.now();
    const deadline = startedAt + perLevelTimeoutMs;
    const observation = {
        phases: new Set(),
        highestRound: 0,
        maxEnemyUnits: 0,
        maxPowerGearTriggers: 0,
        maxWorkerApplies: 0,
        maxFailedAttempts: 0,
        sawDeal: false,
        sawPlacement: false,
        sawBattle: false,
        sawSpawn: false,
        sawSettlement: false,
        portraitFailure: false,
        missingGear: 0,
        missingConfig: 0,
        samples: 0,
    };
    let preparation = null;
    let last = null;
    let bounds = null;
    let navigationError = null;

    try {
        await call('Page.navigate', { url: `${appBase}/?directBattle=1&level=${level.id}&allLevelRuntimeSmoke=${Date.now()}` });
        currentErrors = [];
        while (Date.now() < deadline) {
            const canvas = await readCanvas();
            if (canvas?.state?.levelId === String(level.id) && canvas.state.phase === 'deploy') {
                preparation = { ...canvas.state };
                bounds = canvas.bounds;
                observation.sawDeal = Boolean(canvas.state.candidateIds);
                observation.portraitFailure ||= /:(?:missing)(?:;|$)/.test(canvas.state.gearPortraits || '');
                break;
            }
            await wait(80);
        }
        if (preparation) await enableLongRun(level.id);

        while (preparation && Date.now() < deadline) {
            const canvas = await readCanvas();
            if (!canvas?.state || canvas.state.levelId !== String(level.id)) {
                await wait(80);
                continue;
            }
            const state = canvas.state;
            bounds = canvas.bounds;
            last = { ...state };
            observation.samples += 1;
            observation.phases.add(state.phase);
            observation.highestRound = Math.max(observation.highestRound, numeric(state.round));
            observation.maxEnemyUnits = Math.max(observation.maxEnemyUnits, numeric(state.enemyUnits));
            observation.maxPowerGearTriggers = Math.max(observation.maxPowerGearTriggers, numeric(state.powerGearTriggers));
            observation.maxWorkerApplies = Math.max(observation.maxWorkerApplies, numeric(state.workerApplies));
            observation.maxFailedAttempts = Math.max(observation.maxFailedAttempts, numeric(state.failedAttempts));
            observation.sawPlacement ||= String(state.gearIds || '').split(',').filter(Boolean).length > 1;
            observation.sawBattle ||= ['battle', 'trait', 'roundClear', 'won', 'lost'].includes(state.phase);
            observation.sawSpawn ||= numeric(state.enemyUnits) > 0;
            observation.sawSettlement ||= ['trait', 'roundClear', 'won', 'lost'].includes(state.phase)
                || observation.highestRound > 1;
            observation.portraitFailure ||= /:(?:missing)(?:;|$)/.test(state.gearPortraits || '');
            observation.missingGear = Math.max(observation.missingGear, numeric(state.powerMissingGear));
            observation.missingConfig = Math.max(observation.missingConfig, numeric(state.powerMissingConfig));

            const progressed = level.roundIds.length <= 1 || observation.highestRound > 1
                || observation.phases.has('roundClear') || state.phase === 'won';
            const complete = observation.sawDeal
                && observation.sawPlacement
                && observation.sawBattle
                && observation.sawSpawn
                && observation.sawSettlement
                && progressed
                && observation.maxPowerGearTriggers > 0
                && observation.maxWorkerApplies > 0;
            if (complete) break;
            await wait(80);
        }
    } catch (error) {
        navigationError = error instanceof Error ? error.stack || error.message : String(error);
    }

    const issues = [];
    if (!preparation) issues.push('preparation-not-observed');
    else {
        if (preparation.levelName !== level.name) issues.push(`level-name:${preparation.levelName}`);
        if (numeric(preparation.roundCount) !== level.roundIds.length) issues.push(`round-count:${preparation.roundCount}`);
    }
    if (!observation.sawDeal) issues.push('deal-not-observed');
    if (!observation.sawPlacement) issues.push('placement-not-observed');
    if (!observation.sawBattle) issues.push('battle-not-observed');
    if (!observation.sawSpawn) issues.push('enemy-spawn-not-observed');
    if (!observation.sawSettlement) issues.push('round-settlement-not-observed');
    if (level.roundIds.length > 1 && observation.highestRound < 2
        && !observation.phases.has('roundClear') && last?.phase !== 'won') issues.push('round-progression-not-observed');
    if (observation.maxPowerGearTriggers <= 0) issues.push('producer-trigger-not-observed');
    if (observation.maxWorkerApplies <= 0) issues.push('worker-application-not-observed');
    if (observation.missingGear > 0) issues.push(`missing-gear:${observation.missingGear}`);
    if (observation.missingConfig > 0) issues.push(`missing-config:${observation.missingConfig}`);
    if (observation.portraitFailure) issues.push('portrait-file-missing');
    if (currentErrors.length > 0) issues.push(`runtime-errors:${currentErrors.length}`);
    if (navigationError) issues.push('navigation-error');
    const passed = issues.length === 0;
    const screenshot = passed ? null : await captureFailure(level.id, bounds);
    evidence.push({
        levelId: level.id,
        levelName: level.name,
        roundCount: level.roundIds.length,
        passed,
        issues,
        elapsedMs: Date.now() - startedAt,
        phases: [...observation.phases],
        highestRound: observation.highestRound,
        maxEnemyUnits: observation.maxEnemyUnits,
        maxPowerGearTriggers: observation.maxPowerGearTriggers,
        maxWorkerApplies: observation.maxWorkerApplies,
        maxFailedAttempts: observation.maxFailedAttempts,
        preparation,
        finalState: last,
        runtimeErrors: [...currentErrors],
        navigationError,
        screenshot,
    });
    console.log(JSON.stringify({
        levelId: level.id,
        passed,
        highestRound: observation.highestRound,
        phase: last?.phase || preparation?.phase || 'missing',
        elapsedMs: Date.now() - startedAt,
        issues,
    }));
}

const failed = evidence.filter((entry) => !entry.passed);
const report = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    passed: failed.length === 0,
    appId: 'wxf9af2417e78ce07a',
    version: '18',
        scope: 'Every selected normal level loads in Cocos, exposes its recovered opening deal, enters the production state machine, places a producer through the long-run automation reducer, starts battle, spawns an enemy, applies production work, and reaches round-clear, a later wave, or a terminal outcome. Final-victory closure is covered separately by representative long runs.',
    perLevelTimeoutMs,
    totals: {
        expected: levels.length,
        passed: evidence.length - failed.length,
        failed: failed.length,
    },
    coverage: {
        deal: evidence.filter((entry) => entry.preparation?.candidateIds).length,
        placement: evidence.filter((entry) => String(entry.finalState?.gearIds || '').split(',').filter(Boolean).length > 1).length,
        battle: evidence.filter((entry) => entry.phases.includes('battle')).length,
        enemySpawn: evidence.filter((entry) => entry.maxEnemyUnits > 0).length,
        production: evidence.filter((entry) => entry.maxPowerGearTriggers > 0 && entry.maxWorkerApplies > 0).length,
        progressionOrTerminal: evidence.filter((entry) => entry.highestRound > 1 || entry.phases.includes('roundClear') || entry.finalState?.phase === 'won').length,
    },
    failures: failed.map(({ levelId, issues, screenshot }) => ({ levelId, issues, screenshot })),
    evidence,
};
fs.writeFileSync(outputFile, `${JSON.stringify(report, null, 2)}\n`);
socket.close();
console.log(JSON.stringify({ passed: report.passed, totals: report.totals, coverage: report.coverage }, null, 2));
if (!report.passed) process.exitCode = 1;
