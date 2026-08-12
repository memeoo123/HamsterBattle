import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');

const killUnit = source.slice(
    source.indexOf('private killUnit(unit: BattleUnit)'),
    source.indexOf('private addExperience'),
);
assert.match(killUnit, /unit\.dead = true;[\s\S]*?this\.hideUnitHp\(unit\);/,
    'logical death immediately hides the combat HP bar');
assert.match(killUnit, /unit\.shadow\.active = false;/,
    'death immediately hides the unit shadow, matching the recovered client');
assert.match(killUnit, /this\.dyingUnitNodes\.add\(dyingNode\);/,
    'death-animation roots stay tracked after the unit leaves the combat array');

const clearUnits = source.slice(
    source.indexOf('private clearUnits()'),
    source.indexOf('private stepEffects'),
);
assert.match(clearUnits, /for \(const node of this\.dyingUnitNodes\) unitNodes\.add\(node\);/,
    'round cleanup also collects nodes that are finishing a death animation');
assert.match(clearUnits, /node\.active = false;\s*node\.destroy\(\);/,
    'round cleanup deactivates unit roots before deferred Cocos destruction');
assert.match(clearUnits, /this\.dyingUnitNodes\.clear\(\);/,
    'terminal cleanup cannot leak stale tracked nodes into the next round');

const drawUnitHp = source.slice(
    source.indexOf('private drawUnitHp(unit: BattleUnit)'),
    source.indexOf('private drawHomes'),
);
assert.match(drawUnitHp, /if \(unit\.dead \|\| unit\.hp <= 0\)[\s\S]*?this\.hideUnitHp\(unit\);/,
    'the renderer cannot redraw a zero-HP or dead-unit bar');
assert.match(drawUnitHp, /private hideUnitHp[\s\S]*?clear\(\);[\s\S]*?node\.active = false;/,
    'HP cleanup clears both geometry and node visibility');

console.log('battlefield terminal presentation: 8 assertions passed');
