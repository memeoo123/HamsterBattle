import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    OUT_OF_BATTLE_BOX_EXP_PER_DRAW,
    OUT_OF_BATTLE_BOX_LEVEL_MAX,
    OUT_OF_BATTLE_DAILY_CHALLENGE_COST_ENERGY,
    OUT_OF_BATTLE_DAILY_CHALLENGE_TIMES,
    OUT_OF_BATTLE_DAILY_EFFECTS,
    OUT_OF_BATTLE_DAILY_INSTANCES,
    OUT_OF_BATTLE_DAILY_REWARD_ROUNDS,
    OUT_OF_BATTLE_DAILY_RULES,
    OUT_OF_BATTLE_DAILY_ACTIVE_REWARDS,
    OUT_OF_BATTLE_DAILY_SHOP_AD_REFRESH_MAX,
    OUT_OF_BATTLE_DAILY_TASKS,
    OUT_OF_BATTLE_ENDLESS,
    OUT_OF_BATTLE_GAMEPLAYS,
    OUT_OF_BATTLE_POWER_ABILITIES,
    OUT_OF_BATTLE_POWER_LEVEL_ONE_COST,
    OUT_OF_BATTLE_POWER_ROLES,
    OUT_OF_BATTLE_POWER_STAR_MAX,
    OUT_OF_BATTLE_POWER_STAR_ZERO_COST,
    OUT_OF_BATTLE_SEVEN_DAY_REWARDS,
    OUT_OF_BATTLE_SHOP_GOODS,
    OUT_OF_BATTLE_SHOP_NAMES,
    OUT_OF_BATTLE_TABS,
    outOfBattlePowerAbilities,
    outOfBattleSystemUnlockLevel,
    outOfBattleSystemUnlocked,
    purchaseOutOfBattleShopGood,
} from '../assets/scripts/OutOfBattleConfig.ts';

assert.deepEqual(OUT_OF_BATTLE_TABS.map((tab) => tab.name), ['商店', '角色', '战斗', '培养', '活动']);
assert.equal(outOfBattleSystemUnlockLevel('SHOP'), 1003);
assert.equal(outOfBattleSystemUnlockLevel('ROLE'), 1005);
assert.equal(outOfBattleSystemUnlockLevel('GAMEPLAY'), 1006);
assert.equal(outOfBattleSystemUnlockLevel('DAILY_TASK'), 1002);
assert.equal(outOfBattleSystemUnlocked(1002, 'SHOP'), false);
assert.equal(outOfBattleSystemUnlocked(1003, 'SHOP'), true);
assert.equal(outOfBattleSystemUnlocked(1004, 'ROLE'), false);
assert.equal(outOfBattleSystemUnlocked(1005, 'ROLE'), true);

assert.deepEqual(OUT_OF_BATTLE_POWER_ROLES.map((role) => role.name), ['跑跑鼠', '红闪电鼠', '蓝刺猬鼠', '卡西西鼠']);
assert.deepEqual(OUT_OF_BATTLE_POWER_ROLES.map((role) => role.quality), [3, 4, 4, 4]);
assert.match(OUT_OF_BATTLE_POWER_ROLES[1].activeSkill, /30%/);
assert.match(OUT_OF_BATTLE_POWER_ROLES[2].activeSkill, /15%/);
assert.equal(OUT_OF_BATTLE_POWER_LEVEL_ONE_COST, 100);
assert.equal(OUT_OF_BATTLE_POWER_STAR_ZERO_COST, 10);
assert.equal(OUT_OF_BATTLE_POWER_STAR_MAX, 8);
assert.equal(OUT_OF_BATTLE_POWER_ABILITIES.length, 36);
assert.deepEqual(outOfBattlePowerAbilities('P01').map((ability) => ability.star), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
assert.match(outOfBattlePowerAbilities('P01')[5].description, /2级随机齿轮/);
assert.match(outOfBattlePowerAbilities('P03')[5].description, /50%最大生命值/);
assert.match(outOfBattlePowerAbilities('P04')[7].description, /40%/);

assert.deepEqual(Object.values(OUT_OF_BATTLE_SHOP_NAMES), ['每日商店', '宝箱', '金币商店', '体力商店']);
assert.equal(OUT_OF_BATTLE_SHOP_GOODS.length, 10);
assert.equal(OUT_OF_BATTLE_DAILY_SHOP_AD_REFRESH_MAX, 20);
assert.equal(OUT_OF_BATTLE_BOX_EXP_PER_DRAW, 10);
assert.equal(OUT_OF_BATTLE_BOX_LEVEL_MAX, 20);
const goldGood = OUT_OF_BATTLE_SHOP_GOODS.find((good) => good.id === 103002);
const energyGood = OUT_OF_BATTLE_SHOP_GOODS.find((good) => good.id === 104001);
assert.deepEqual(purchaseOutOfBattleShopGood({ gold: 0, energy: 5, diamonds: 700 }, goldGood.id), {
    wallet: { gold: 2500, energy: 5, diamonds: 200 },
    purchased: true,
    reason: 'purchased',
    good: goldGood,
});
assert.equal(purchaseOutOfBattleShopGood({ gold: 0, energy: 5, diamonds: 100 }, energyGood.id).reason, 'diamonds');
assert.equal(purchaseOutOfBattleShopGood({ gold: 0, energy: 5, diamonds: 1000 }, 101001).reason, 'unsupported');

assert.deepEqual(OUT_OF_BATTLE_GAMEPLAYS.map((gameplay) => gameplay.name), ['无尽试炼', '每日挑战', '玩法合集']);
assert.equal(OUT_OF_BATTLE_GAMEPLAYS[1].unlockLevel, 1010);
assert.equal(OUT_OF_BATTLE_DAILY_CHALLENGE_TIMES, 3);
assert.equal(OUT_OF_BATTLE_DAILY_CHALLENGE_COST_ENERGY, 5);
assert.deepEqual(OUT_OF_BATTLE_DAILY_REWARD_ROUNDS, [2500, 5000, 7500, 10000]);
assert.equal(OUT_OF_BATTLE_DAILY_INSTANCES.length, 10);
assert.deepEqual(OUT_OF_BATTLE_DAILY_INSTANCES.map((instance) => instance.name),
    ['宁静森林', '密林深处', '荒漠边缘', '荒漠沙地', '雪山脚下', '无尽雪山', '青绿草原', '草原咆哮', '初见火山', '火山熔岩']);
assert.deepEqual(OUT_OF_BATTLE_DAILY_INSTANCES[9].effectIds, ['DI_BUFF_eff07', 'DI_DEBUFF_eff01', 'DI_DEBUFF_eff02']);
assert.equal(Object.keys(OUT_OF_BATTLE_DAILY_EFFECTS).length, 12);
assert.equal(OUT_OF_BATTLE_DAILY_EFFECTS.DI_DEBUFF_eff04.buff, false);
assert.equal(OUT_OF_BATTLE_DAILY_RULES.length, 3);
assert.equal(OUT_OF_BATTLE_ENDLESS.roundIds[0], 400001);
assert.equal(OUT_OF_BATTLE_ENDLESS.recoveredSpawnCount, 560);
assert.equal(OUT_OF_BATTLE_SEVEN_DAY_REWARDS.length, 7);
assert.equal(OUT_OF_BATTLE_SEVEN_DAY_REWARDS[0].rewardText, '钻石 ×150');
assert.equal(OUT_OF_BATTLE_SEVEN_DAY_REWARDS[6].rewardText, '豪华齿轮碎片 ×100');
assert.deepEqual(OUT_OF_BATTLE_DAILY_TASKS.map((task) => task.activeScore), [20, 20, 15, 20, 20, 15, 15]);
assert.deepEqual(OUT_OF_BATTLE_DAILY_ACTIVE_REWARDS.map((reward) => reward.active), [20, 40, 60, 80, 100]);

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
assert.match(source, /商店: \(\) => this\.showShopScene\(\)/);
assert.match(source, /活动: \(\) => this\.showActivityScene\(\)/);
assert.match(source, /showDailyTaskScene\(\)/);
assert.match(source, /showSevenDayScene\(\)/);
assert.match(source, /showSettingsScene\(\)/);
assert.match(source, /showRoleDetailScene\(role\.id\)/);
assert.match(source, /showDailyInstanceScene\(\)/);
assert.match(source, /showEndlessModeScene\(\)/);
assert.match(source, /DailyInstanceBack/);
assert.match(source, /hamsterBattle\.soundVolume/);
assert.match(source, /purchaseOutOfBattleShopGood\(this\.accountProfile, good\.id\)/);
assert.doesNotMatch(source, /ACCOUNT_POWER_ROLES/);

console.log('out-of-battle config tests passed');
