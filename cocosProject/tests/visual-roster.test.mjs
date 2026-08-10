import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const game = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
const roster = readFileSync(new URL('../assets/scripts/VisualRoster.ts', import.meta.url), 'utf8');

const enemyEntries = [...roster.matchAll(/\{ id: '([^']+)', name: '[^']+', kind: '[^']+', spinePath: '([^']+)'/g)];
const gearEntries = [...roster.matchAll(/gear\('([^']+)', '[^']+', \d+, \d+(?:, '[^']+')?\)/g)];
assert.equal(enemyEntries.length, 25, 'all 25 enemy/Boss identities used by the 200 levels are catalogued');
assert.equal(new Set(enemyEntries.map((entry) => entry[2])).size, 16, 'the 25 identities bind the exact 16 recovered Spine families');
assert.equal(gearEntries.length, 58, 'all 58 HERO/COIN BagLike gear items are catalogued');
assert.match(roster, /10: \[\[0, 0\], \[0, 1\], \[1, 0\], \[1, 1\]\]/, 'shape 10 preserves the recovered 2x2 footprint');
assert.match(game, /visualCatalog=\(enemies\|gears\)/, 'the browser exposes separate enemy and gear catalog routes');
assert.match(game, /if \(this\.visualCatalogMode\(\)\) \{[\s\S]*this\.buildVisualCatalog\(\);[\s\S]*return;/, 'catalog mode bypasses normal level boot without reopening level mechanics');
assert.match(game, /H0501: \{ x: 85, y: 1419[\s\S]*H1805: \{ x: 93, y: 957/, 'all previously missing original portrait crops are registered');
assert.match(game, /if \(id\.startsWith\('H11'\)\) return 'H1101';/, 'the healing gear no longer falls back to a star placeholder');
assert.match(game, /attachEnemyVisual\(card, entry\)[\s\S]*resources\.load\(entry\.spinePath, sp\.SkeletonData/, 'enemy cards render recovered Spine data');
assert.match(game, /attachGearConnectorSprite\(gearNode, shape, WHITE\)[\s\S]*attachGearBodySprite\(gearNode, entry\.level[\s\S]*attachStaticGearPortrait/, 'gear cards render recovered connector, tier body, and portrait assets');

console.log('visual roster: 10 assertions passed');
