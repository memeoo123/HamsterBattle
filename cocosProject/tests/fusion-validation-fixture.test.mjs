import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(projectRoot, 'assets/scripts/CangshuGame.ts'), 'utf8');

assert.match(source, /fusionValidation=\(tray\|placed\|battle\)/, 'fixture requires an explicit URL value');
assert.match(source, /if \(fusionValidationMode\) this\.applyFusionValidationFixture/, 'normal URLs skip the fixture');
assert.match(source, /this\.replaceCandidates\(\['H0705', 'H0805', 'H0905'\]\)/, 'tray fixture includes all reachable fusion gears');
assert.match(source, /this\.addPlacedGear\('H0705', 1, 3\)/);
assert.match(source, /this\.addPlacedGear\('H0805', 2, 2\)/);
assert.match(source, /this\.addPlacedGear\('H0905', 2, 4\)/);
assert.match(source, /if \(gear\.id === 'P01'\) continue/, 'battle fixture never queues the power core');
assert.match(source, /gear\.workerPower = 99;\s+this\.queueProduction\(gear\)/, 'battle fixture enters the real production queue');
assert.match(source, /this\.backpackPanel\.setPosition\(0, 51\.5 \+ this\.gridOffsetY\)/, 'battle layout moves the panel with its grid');
assert.match(source, /H0705: -95, H0805: 0, H0905: 95/, 'fixture separates the three fusion models for visual inspection');

console.log('fusion validation fixture: 10 assertions passed');
