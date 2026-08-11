import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as account from '../assets/scripts/BagLikeAccountProfile.ts';
import * as runtime from '../assets/scripts/SpecialModeRuntime.ts';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(testDirectory, '..');
const table = JSON.parse(fs.readFileSync(path.join(projectDirectory, 'assets', 'resources', 'data', 'special-modes.json'), 'utf8'));
const today = new Date(2026, 7, 11, 12, 0, 0);
const yesterday = new Date(2026, 7, 10, 12, 0, 0);

assert.equal(table.daily.instances.length, 10);
assert.equal(table.daily.rotation.length, 10);
assert.equal(table.daily.rewards.length, 200);
assert.equal(Object.keys(table.rounds).length, 31);
assert.equal(table.rounds['400001'].monsterIds.length, 560);
assert.equal(table.daily.instances[0].roundIds.reduce((sum, id) => sum + table.rounds[id].monsterIds.length, 0), 212);

const fresh = runtime.createSpecialModeState(today);
assert.equal(fresh.daily.challengeTimes, 0);
assert.equal(fresh.endless.maxGold, 0);
const reset = runtime.normalizeSpecialModeState({
    dayKey: runtime.specialModeDayKey(yesterday),
    daily: { challengeTimes: 3, dailyGold: 7500, claimed: { 0: true } },
    endless: { challengeTimes: 3, maxKillCount: 42, maxGold: 900, skinKeys: 2 },
}, today);
assert.deepEqual(JSON.parse(JSON.stringify(reset.daily)), { challengeTimes: 0, dailyGold: 0, claimed: {} });
assert.equal(reset.endless.challengeTimes, 0);
assert.equal(reset.endless.maxKillCount, 42);
assert.equal(reset.endless.maxGold, 900);

const profile = account.createBagLikeAccountProfile({
    unlockedHeroFamilies: 'H01;H02', heroStars: { H01: 1, H02: 1 }, levelId: 1004,
    challengeTimes: 1, maxPassedLevelId: 1010, energy: 5, gold: 0, diamonds: 0,
});
assert.deepEqual(JSON.parse(JSON.stringify(runtime.canStartSpecialMode(fresh, profile, 'daily'))), { allowed: true, reason: 'ready', needsAd: false });
const thirdEndless = runtime.normalizeSpecialModeState({ ...fresh, endless: { ...fresh.endless, challengeTimes: 2 } }, today);
assert.equal(runtime.canStartSpecialMode(thirdEndless, profile, 'endless').needsAd, true);
assert.equal(runtime.spendSpecialModeEnergy(profile).energy, 0);

assert.equal(runtime.dailyRefreshCost(15, ['DI_BUFF_eff01']), 12);
assert.equal(runtime.dailyRefreshCost(15, []), 15);
assert.equal(runtime.dailyProductionCount(['DI_BUFF_eff05'], false, () => 0.90), 2);
assert.equal(runtime.dailyProductionCount(['DI_BUFF_eff06'], true, () => 0.99), 3);
assert.equal(runtime.dailyHeroAttackMultiplier(['DI_BUFF_eff03'], 2), 1.2);
assert.equal(runtime.dailyHeroAttackMultiplier(['DI_BUFF_eff04'], 3), 1.2);
assert.equal(runtime.dailyEnemyMoveMultiplier(['DI_DEBUFF_eff01']), 1.2);
assert.equal(runtime.dailyEnemyDamageResistance(['DI_DEBUFF_eff03'], 'HAMSTER'), 8000);
assert.equal(runtime.dailyEnemyDamageResistance(['DI_DEBUFF_eff04'], 'WHEEL'), 8000);
assert.equal(runtime.dailyEnemyDamageResistance(['DI_DEBUFF_eff04'], 'WHEEL', false), 0);
assert.equal(runtime.dailyExtraRoundId(['DI_DEBUFF_eff05'], 9), 300010);

const dailySettlement = runtime.settleDailyChallenge(fresh, 4);
assert.equal(dailySettlement.daily.challengeTimes, 1);
assert.equal(dailySettlement.daily.dailyGold, 2500);
let endlessSettlement = runtime.settleEndlessChallenge(fresh, 20, 500);
endlessSettlement = runtime.settleEndlessChallenge(endlessSettlement, 30, 500);
assert.equal(endlessSettlement.endless.maxKillCount, 30);
assert.equal(endlessSettlement.endless.maxGold, 500);

const rewardRow = runtime.dailyRewardForProgress(table, 1000);
assert.equal(rewardRow.id, 1001);
const claimed = runtime.claimDailyMilestone(dailySettlement, profile, rewardRow, 0, () => 0);
assert.equal(claimed.claimed, true);
assert.equal(claimed.state.daily.claimed['0'], true);
assert.equal(claimed.profile.gold, profile.gold + 500);
assert.equal(runtime.claimDailyMilestone(claimed.state, claimed.profile, rewardRow, 0).claimed, false);

const rotation = runtime.currentDailyRotation(table, today);
assert.ok(rotation.dailyInstanceId >= 2001 && rotation.dailyInstanceId <= 2010);
assert.equal(runtime.currentDailyInstance(table, today).id, rotation.dailyInstanceId);

console.log('special-mode-runtime.test.mjs: all assertions passed');
