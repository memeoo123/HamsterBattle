import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(projectRoot, 'assets/scripts/CangshuGame.ts'), 'utf8');

assert.match(source, /fusionValidation=\(merge\|tray\|placed\|battle\|late-tray\|late-placed\|late-battle\)/, 'fixture requires an explicit URL value');
assert.match(source, /if \(fusionValidationMode\) this\.applyFusionValidationFixture/, 'normal URLs skip the fixture');
assert.match(source, /this\.validationHeroStarOverrides = \{ H01: 2, H02: 2 \};\s+this\.replaceCandidates\(\['H0104', 'H0204'\]\)/, 'merge fixture exposes one eligible cross-family pair');
assert.match(source, /: \['H0705', 'H0805', 'H0905'\]\)/, 'tray fixture includes the first fusion set');
assert.match(source, /this\.addPlacedGear\('H0705', 1, 3\)/);
assert.match(source, /this\.addPlacedGear\('H0805', 2, 2\)/);
assert.match(source, /this\.addPlacedGear\('H0905', 2, 4\)/);
assert.match(source, /\['H1005', 'H1505', 'H1805'\]/, 'late tray fixture includes the remaining fusion gears');
assert.match(source, /this\.addPlacedGear\('H1005', 0, 2\)/);
assert.match(source, /this\.addPlacedGear\('H1505', 2, 1\)/);
assert.match(source, /this\.addPlacedGear\('H1805', 2, 4\)/);
assert.match(source, /if \(gear\.id === 'P01'\) continue/, 'battle fixture never queues the power core');
assert.match(source, /gear\.workerPower = 99;\s+this\.queueProduction\(gear\)/, 'battle fixture enters the real production queue');
assert.match(source, /this\.backpackPanel\.setPosition\(0, 51\.5 \+ this\.gridOffsetY \+ layout\.backpackPanelOffsetY\)/, 'battle layout moves the panel with its grid and recovered source-pivot offset');
assert.match(source, /H0705: -95,[\s\S]*H0805: 0,[\s\S]*H0905: 95,[\s\S]*H1005: -95,[\s\S]*H1805: 95/, 'fixture separates each hamster fusion set for visual inspection');
assert.match(source, /canvas\.dataset\.fusionActiveCasts/, 'browser fixture exposes active-skill casts');
assert.match(source, /canvas\.dataset\.fusionActiveHits/, 'browser fixture exposes active-skill hits');
assert.match(source, /canvas\.dataset\.h15KillCoins/, 'browser fixture exposes H15 kill coins');

console.log('fusion validation fixture: 18 assertions passed');
