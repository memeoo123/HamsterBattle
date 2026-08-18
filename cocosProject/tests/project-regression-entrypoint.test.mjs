import assert from 'node:assert/strict';
import fs from 'node:fs';

const contract = fs.readFileSync(new URL('./all-level-runtime-smoke-browser-contract.mjs', import.meta.url), 'utf8');
const runner = fs.readFileSync(new URL('../../scripts/run-project-regression.ps1', import.meta.url), 'utf8');

let assertions = 0;
for (const token of [
    'sawDeal',
    'sawPlacement',
    'sawBattle',
    'sawSpawn',
    'sawSettlement',
    'powerMissingGear',
    'powerMissingConfig',
    'longRunValidation=1',
    'process.exitCode = 1',
]) {
    assert.ok(contract.includes(token), `all-level runtime contract contains ${token}`);
    assertions += 1;
}

for (const token of [
    "[ValidateSet('Quick', 'Full')]",
    'generate_validation_manifest.py',
    'full-resource-audit-browser-contract.mjs',
    'all-level-runtime-smoke-browser-contract.mjs',
    'level-1001-closure-browser-contract.mjs',
    'candidate-level-closure-browser-contract.mjs',
    'level-15-closure-browser-contract.mjs',
    'finally',
    'Stop-StartedProcess',
    'regression-summary.json',
]) {
    assert.ok(runner.includes(token), `regression entrypoint contains ${token}`);
    assertions += 1;
}

assert.ok(runner.includes("Invoke-AllLevelSmoke -AppPort $appPort -DebugPortBase 19320 -AllLevels ($Profile -eq 'Full')"), 'full profile selects the all-level smoke');
assert.ok(runner.includes("if ($Profile -eq 'Full' -and -not $SkipLongRuns)"), 'full profile selects representative long runs');
assert.match(runner, /Profile -eq 'Full' -and -not \$SkipLongRuns/, 'long-run skip is explicit and full-only');
assertions += 3;

console.log(`project regression entrypoint: ${assertions} assertions passed`);
