import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
const methodStart = source.indexOf('private syncBrowserContractState(): void');
const firstDatasetWrite = source.indexOf('canvas.dataset.levelId', methodStart);
const datasetGuard = source.indexOf('if (!canvas || !canvas.dataset) return;', methodStart);

assert.notEqual(methodStart, -1, 'browser observability method exists');
assert.notEqual(firstDatasetWrite, -1, 'browser build still exposes its level contract');
assert.ok(datasetGuard > methodStart && datasetGuard < firstDatasetWrite,
    'native canvas shims without dataset return before any browser-only write');

assert.match(source,
    /typeof document === 'undefined' \|\| typeof document\.querySelector !== 'function'/,
    'native runtimes without a complete document shim are also ignored');

console.log('android native browser-contract guard: 4 assertions passed');
