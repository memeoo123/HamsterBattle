import assert from 'node:assert/strict';
import {
    applyH12Paralysis,
    H12_BASE_SKILL_ID,
    H12_ELECTRIFIED_SKILL_ID,
    H12_ONE_SECOND_SKILL_ID,
    H12_TWO_SECOND_SKILL_ID,
    replaceH12Skill,
    resolveH12CastProfile,
    resolveH12CastProfileForSkill,
    resolveH12ElectrifiedResistance,
} from '../assets/scripts/BattlefieldParalysis.ts';

const baseline = resolveH12CastProfile(0);
assert.equal(baseline.skillId, H12_BASE_SKILL_ID, 'without the ability, lightning cloud keeps LY_1201');
assert.equal(baseline.paralysisSeconds, 0, 'the base skill applies no paralysis');

const oneSecond = resolveH12CastProfile(1000);
assert.deepEqual(
    oneSecond,
    {
        skillId: H12_ONE_SECOND_SKILL_ID,
        paralysisSeconds: 1,
        impactDelaySeconds: 0.5,
        effectRatio: 5000,
        radius: 50,
        maxTargets: 5,
    },
    'the star-1 replacement keeps the shared delayed area damage and adds one second of paralysis',
);
const twoSeconds = resolveH12CastProfile(2000);
assert.equal(twoSeconds.skillId, H12_TWO_SECOND_SKILL_ID, 'the star-3 replacement selects LY_1203');
assert.equal(twoSeconds.paralysisSeconds, 2, 'LY_1203 applies the two-second BuffGroup duration');

const electrifiedAfterParalysis = replaceH12Skill(
    replaceH12Skill(H12_BASE_SKILL_ID, 'RG_H12_abl01_eff02'),
    'RG_H12_abl04_eff01',
);
assert.equal(electrifiedAfterParalysis, H12_ELECTRIFIED_SKILL_ID, 'the latest same-group replacement overwrites paralysis');
const paralysisAfterElectrified = replaceH12Skill(
    replaceH12Skill(H12_BASE_SKILL_ID, 'RG_H12_abl04_eff01'),
    'RG_H12_abl01_eff02',
);
assert.equal(paralysisAfterElectrified, H12_TWO_SECOND_SKILL_ID, 'a later paralysis selection overwrites electrified');
assert.equal(resolveH12CastProfileForSkill(H12_ELECTRIFIED_SKILL_ID).paralysisSeconds, 0, 'LY_1204 carries no paralysis BuffGroup');
assert.equal(resolveH12ElectrifiedResistance(0), 0, 'the -1000 DMG_RES buff is clamped at zero on restored representative targets');
assert.equal(resolveH12ElectrifiedResistance(1500), 500, 'positive generic resistance is reduced by exactly 1000');

assert.equal(applyH12Paralysis(0, 1), 1, 'paralysis starts on a free target');
assert.equal(applyH12Paralysis(0.4, 1), 1, 'reapplication extends a shorter remaining status');
assert.equal(applyH12Paralysis(1.5, 1), 1.5, 'reapplication never shortens a longer remaining status');
assert.equal(applyH12Paralysis(0, 1, true), 0, 'control-immune targets reject paralysis');
assert.equal(applyH12Paralysis(-1, 0), 0, 'non-positive input is clamped to a valid status duration');

console.log('battlefield paralysis: 15 assertions passed');
