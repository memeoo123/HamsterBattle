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
assert.match(automation, /this\.claimNextBatch\(false\)/,
    'late special-mode preparation spends recovered currency through the normal refresh reducer');
assert.doesNotMatch(automation, /this\.(?:selfHp|enemyHomeHp|levelAtkMultiple|levelHpMultiple)\s*=/,
    'input automation never overrides combat health or attribute multipliers');
assert.doesNotMatch(automation, /this\.(?:roundIndex|phase)\s*=(?!=)/,
    'input automation never skips phases or waves');
assert.match(source, /Math\.ceil\(totalScaled \/ 0\.05\)/,
    'background catch-up preserves fixed 50 ms simulation substeps');
assert.ok(source.includes('longRunProgression=late')
    && source.includes('setAllBagLikeAccountHeroStars(this.accountProfile, 20)'),
    'late special-mode evidence uses the account progression formula behind an explicit query flag');
assert.match(source, /lateProgressionPowerRoleState\(this\.powerRoleState\)/,
    'late special-mode evidence also applies the recovered power-role progression fixture');
assert.match(source, /next\.roles\[id\]\.star = POWER_ROLE_MAX_STAR[\s\S]*next\.roles\[id\]\.level = POWER_ROLE_MAX_LEVEL/,
    'the power-role fixture uses exported progression caps instead of direct combat-stat overrides');
assert.match(source, /this\.powerRoleState = this\.clonePowerRoleState\(this\.longRunOriginalPowerRoleState\)/,
    'special-mode settlement restores the original power-role state without persisting the fixture');
assert.match(source, /validationOriginalProfile = bypassProgression && this\.longRunValidationEnabled\(\)/,
    'direct normal-level long runs snapshot the player account before validation');
assert.match(source, /if \(!validationOriginalProfile\) this\.persistAccountProfile\(false\)/,
    'direct normal-level long runs never persist validation completion');
assert.match(source, /cloneBagLikeAccountProfile\(this\.longRunOriginalAccountProfile \|\| this\.accountProfile\)/,
    'endless settlement restores the non-fixture account before persisting rewards');

console.log('long-run input automation: 17 assertions passed');
