import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');

assert.match(source, /DEVELOPED_BATTLE_ELAPSED_SECONDS = 4\.01/);
assert.match(source, /DEVELOPED_BATTLE_SPAWN_Y = \[0, -125, 125, -45\]/);
assert.match(source, /developedValidationMode\(\) === 'battle' && this\.phase === 'battle'/);
assert.match(source, /DEVELOPED_BATTLE_ELAPSED_SECONDS - this\.roundClock/);
assert.match(source, /this\.roundClock >= DEVELOPED_BATTLE_ELAPSED_SECONDS\) this\.paused = true/);
assert.match(source, /const developedBattle = this\.developedValidationMode\(\) === 'battle'/);
assert.match(source, /const fixtureY = DEVELOPED_BATTLE_SPAWN_Y\[this\.spawnIndex\]/);
assert.match(source, /const xJitter = developedBattle \? 0 :/);
assert.match(source, /canvas\.dataset\.roundClock = this\.roundClock\.toFixed\(3\)/);
assert.match(source, /canvas\.dataset\.enemyRuntime = this\.units/);
assert.match(source, /layout\.backpackBackgroundOffsetY/);
assert.match(source, /layout\.backpackPanelOffsetY/);
assert.match(source, /layout\.backpackHpOffsetY/);
assert.match(source, /hpHeart:[\s\S]*new Rect\(439, 374, 32, 27\)/);
assert.match(source, /makeNode\('BackpackHpHeart', this\.backpackHpBar, -25, 0, 32, 27\)/);
assert.match(source, /makeLabel\('BackpackHpText', this\.backpackHpBar, 21, 0, 90, 30/);
assert.doesNotMatch(source, /backpackHpLabel\.string = `♥/);
assert.match(source, /resources\.load\('original\/battleNum_0\/spriteFrame'/);
assert.match(source, /this\.addBattleNumberText\(`\$\{damage\}`, x, y, 'white'\)/);
assert.doesNotMatch(source, /`-\$\{damage\}`/);
assert.match(source, /node\.setScale\(1\.3, 1\.3, 1\)/);
assert.match(source, /floating\.elapsed \/ \(2 \/ 3\)/);
assert.match(source, /floating\.startY \+ 46 \* moveEase/);
assert.match(source, /\(floating\.elapsed - 0\.3\) \/ 0\.7/);
assert.match(source, /BATTLE_NUMBER_GLYPHS[\s\S]*new Rect\(25, 226, 22, 28\)/);

console.log('battle visual baseline: 25 assertions passed');
