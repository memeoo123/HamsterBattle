import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
const start = source.indexOf('private stepLongRunAutomation(');
const end = source.indexOf('private upgradeAccountHero(', start);
assert.ok(start >= 0 && end > start, 'long-run validation automation is present');
const automation = source.slice(start, end);

assert.match(source, /longRunValidation=1/, 'automation requires an explicit validation-only query flag');
assert.match(automation, /this\.startRound\(\)/, 'automation starts rounds through the production action');
assert.match(automation, /this\.chooseTrait\(choice\)/, 'automation selects traits through the normal choice reducer');
assert.match(automation, /this\.restartLevel\(\)/, 'normal losses retry through the existing failure-persistence path');
assert.match(automation, /this\.mergeGears\(candidate, target\)/, 'matching candidates use the normal merge reducer');
assert.doesNotMatch(automation, /this\.(?:selfHp|enemyHomeHp|levelAtkMultiple|levelHpMultiple)\s*=/,
    'input automation never overrides combat health or attribute multipliers');
assert.doesNotMatch(automation, /this\.(?:roundIndex|phase)\s*=(?!=)/,
    'input automation never skips phases or waves');
assert.match(source, /Math\.ceil\(totalScaled \/ 0\.05\)/,
    'background catch-up preserves fixed 50 ms simulation substeps');
assert.ok(source.includes('longRunProgression=late')
    && source.includes('setAllBagLikeAccountHeroStars(this.accountProfile, 20)'),
    'late special-mode evidence uses the account progression formula behind an explicit query flag');
assert.match(source, /cloneBagLikeAccountProfile\(this\.longRunOriginalAccountProfile \|\| this\.accountProfile\)/,
    'endless settlement restores the non-fixture account before persisting rewards');

console.log('long-run input automation: 11 assertions passed');
