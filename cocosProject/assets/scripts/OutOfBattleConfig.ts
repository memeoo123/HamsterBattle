export type OutOfBattleTabName = '商店' | '角色' | '战斗' | '培养' | '活动';
export type OutOfBattleSystemId = 'SHOP' | 'ROLE' | 'TRUNK_INSTANCE' | 'HERO' | 'GAMEPLAY' | 'DAILY_TASK';

export const OUT_OF_BATTLE_TABS: ReadonlyArray<{
    name: OutOfBattleTabName;
    systemId: OutOfBattleSystemId;
}> = [
    { name: '商店', systemId: 'SHOP' },
    { name: '角色', systemId: 'ROLE' },
    { name: '战斗', systemId: 'TRUNK_INSTANCE' },
    { name: '培养', systemId: 'HERO' },
    { name: '活动', systemId: 'GAMEPLAY' },
];

const OUT_OF_BATTLE_UNLOCK_LEVELS: Readonly<Partial<Record<OutOfBattleSystemId, number>>> = {
    SHOP: 1003,
    ROLE: 1005,
    GAMEPLAY: 1006,
    DAILY_TASK: 1002,
};

export function outOfBattleSystemUnlockLevel(systemId: OutOfBattleSystemId): number | null {
    return OUT_OF_BATTLE_UNLOCK_LEVELS[systemId] ?? null;
}

export function outOfBattleSystemUnlocked(maxPassedLevelId: number, systemId: OutOfBattleSystemId): boolean {
    const unlockLevel = outOfBattleSystemUnlockLevel(systemId);
    return unlockLevel === null || maxPassedLevelId >= unlockLevel;
}

export type OutOfBattlePowerRole = {
    id: 'P01' | 'P02' | 'P03' | 'P04';
    name: string;
    quality: 3 | 4;
    fragmentId: 'FP01' | 'FP02' | 'FP03' | 'FP04';
    baseAbility: string;
    activeSkill: string;
};

export const OUT_OF_BATTLE_POWER_ROLES: readonly OutOfBattlePowerRole[] = [
    {
        id: 'P01', name: '跑跑鼠', quality: 3, fragmentId: 'FP01',
        baseAbility: '每场战斗前5秒提升跑步效率10%', activeSkill: '自动触发：生产效率提升',
    },
    {
        id: 'P02', name: '红闪电鼠', quality: 4, fragmentId: 'FP02',
        baseAbility: '主动强化场上所有仓鼠', activeSkill: '攻击提升30%，持续5秒',
    },
    {
        id: 'P03', name: '蓝刺猬鼠', quality: 4, fragmentId: 'FP03',
        baseAbility: '使用刺猬之力快速冲刺', activeSkill: '跑步效率提升15%，持续5秒',
    },
    {
        id: 'P04', name: '卡西西鼠', quality: 4, fragmentId: 'FP04',
        baseAbility: '投掷巨大飞镖，造成高额伤害', activeSkill: '主动释放：飞镖技能',
    },
];

export const OUT_OF_BATTLE_POWER_LEVEL_ONE_COST = 100;
export const OUT_OF_BATTLE_POWER_STAR_ZERO_COST = 10;
export const OUT_OF_BATTLE_POWER_STAR_MAX = 8;

export type OutOfBattlePowerAbility = {
    id: string;
    powerId: OutOfBattlePowerRole['id'];
    star: number;
    description: string;
};

export const OUT_OF_BATTLE_POWER_ABILITIES: readonly OutOfBattlePowerAbility[] = [
    { id: 'P01_S01', powerId: 'P01', star: 0, description: '每场战斗的前5秒，跑跑鼠会努力奔跑，提升效率10%' },
    { id: 'P01_PS01', powerId: 'P01', star: 1, description: '每场战斗开始时，额外获得1个1级随机齿轮' },
    { id: 'P01_PS02', powerId: 'P01', star: 2, description: '所有齿轮攻击+10%' },
    { id: 'P01_PS03', powerId: 'P01', star: 3, description: '每场战斗的前5秒，跑跑鼠会努力奔跑，提升效率15%' },
    { id: 'P01_PS04', powerId: 'P01', star: 4, description: '所有齿轮攻击+10%' },
    { id: 'P01_PS05', powerId: 'P01', star: 5, description: '每场战斗开始时额外获得1个2级随机齿轮' },
    { id: 'P01_PS06', powerId: 'P01', star: 6, description: '所有齿轮攻击+10%' },
    { id: 'P01_PS07', powerId: 'P01', star: 7, description: '每场战斗的前5秒，跑跑鼠会努力奔跑，提升效率20%' },
    { id: 'P01_PS08', powerId: 'P01', star: 8, description: '所有齿轮攻击+20%' },
    { id: 'P02_S01', powerId: 'P02', star: 0, description: '主动释放：使用闪电之力强化场上所有仓鼠，短暂提升攻击力30%' },
    { id: 'P02_PS01', powerId: 'P02', star: 1, description: '每场战斗开始时，跑步效率提升1%，最多叠加5层' },
    { id: 'P02_PS02', powerId: 'P02', star: 2, description: '所有齿轮攻击+10%' },
    { id: 'P02_PS03', powerId: 'P02', star: 3, description: '使用主动技能的效果提升至40%' },
    { id: 'P02_PS04', powerId: 'P02', star: 4, description: '所有齿轮攻击+10%' },
    { id: 'P02_PS05', powerId: 'P02', star: 5, description: '每场战斗开始时，跑步效率提升1%，最多叠加10层' },
    { id: 'P02_PS06', powerId: 'P02', star: 6, description: '所有齿轮攻击+10%' },
    { id: 'P02_PS07', powerId: 'P02', star: 7, description: '使用主动技能的效果提升至50%' },
    { id: 'P02_PS08', powerId: 'P02', star: 8, description: '所有齿轮攻击+20%' },
    { id: 'P03_S01', powerId: 'P03', star: 0, description: '主动释放：使用刺猬之力快速冲刺，短暂提升跑步效率15%' },
    { id: 'P03_PS01', powerId: 'P03', star: 1, description: '蓝刺猬鼠使用主动技能时，额外为我方基地恢复30%最大生命值' },
    { id: 'P03_PS02', powerId: 'P03', star: 2, description: '所有齿轮攻击+10%' },
    { id: 'P03_PS03', powerId: 'P03', star: 3, description: '使用主动技能的效果提升至20%' },
    { id: 'P03_PS04', powerId: 'P03', star: 4, description: '所有齿轮攻击+10%' },
    { id: 'P03_PS05', powerId: 'P03', star: 5, description: '蓝刺猬鼠使用主动技能时，额外为我方基地恢复50%最大生命值' },
    { id: 'P03_PS06', powerId: 'P03', star: 6, description: '所有齿轮攻击+10%' },
    { id: 'P03_PS07', powerId: 'P03', star: 7, description: '使用主动技能的效果提升至25%' },
    { id: 'P03_PS08', powerId: 'P03', star: 8, description: '所有齿轮攻击+20%' },
    { id: 'P04_S01', powerId: 'P04', star: 0, description: '主动释放：投掷巨大的飞镖攻击敌人' },
    { id: 'P04_PS01', powerId: 'P04', star: 1, description: '当局战斗内，主动技能每击杀一个敌人则提升1%跑步效率，最多叠加10次' },
    { id: 'P04_PS02', powerId: 'P04', star: 2, description: '所有齿轮攻击+10%' },
    { id: 'P04_PS03', powerId: 'P04', star: 3, description: '使用主动技能的伤害效果提升至30%' },
    { id: 'P04_PS04', powerId: 'P04', star: 4, description: '所有齿轮攻击+10%' },
    { id: 'P04_PS05', powerId: 'P04', star: 5, description: '当局战斗内，主动技能每击杀一个敌人则提升1%跑步效率，最多叠加20次' },
    { id: 'P04_PS06', powerId: 'P04', star: 6, description: '所有齿轮攻击+10%' },
    { id: 'P04_PS07', powerId: 'P04', star: 7, description: '使用主动技能的伤害效果提升至40%' },
    { id: 'P04_PS08', powerId: 'P04', star: 8, description: '所有齿轮攻击+20%' },
];

export function outOfBattlePowerAbilities(powerId: OutOfBattlePowerRole['id']): readonly OutOfBattlePowerAbility[] {
    return OUT_OF_BATTLE_POWER_ABILITIES.filter((ability) => ability.powerId === powerId);
}

export type OutOfBattleShopGood = {
    id: number;
    shopId: 101 | 102 | 103 | 104;
    name: string;
    rewardText: string;
    costText: string;
    costDiamonds: number | null;
    rewardGold?: number;
    rewardEnergy?: number;
    rewardDiamonds?: number;
    action: 'fixed' | 'free-server' | 'advertisement' | 'random' | 'chest';
};

export const OUT_OF_BATTLE_SHOP_NAMES: Readonly<Record<101 | 102 | 103 | 104, string>> = {
    101: '每日商店',
    102: '宝箱',
    103: '金币商店',
    104: '体力商店',
};

export const OUT_OF_BATTLE_DAILY_SHOP_AD_REFRESH_MAX = 20;
export const OUT_OF_BATTLE_BOX_ONE_DRAW_DIAMONDS = 50;
export const OUT_OF_BATTLE_BOX_TEN_DRAW_DIAMONDS = 400;
export const OUT_OF_BATTLE_BOX_EXP_PER_DRAW = 10;
export const OUT_OF_BATTLE_BOX_LEVEL_MAX = 20;

export const OUT_OF_BATTLE_SHOP_GOODS: readonly OutOfBattleShopGood[] = [
    { id: 101001, shopId: 101, name: '每日钻石', rewardText: '钻石 ×100', costText: '每日免费 / 广告', costDiamonds: null, rewardDiamonds: 100, action: 'free-server' },
    { id: 101002, shopId: 101, name: '广告宝箱', rewardText: '随机宝箱', costText: '观看广告', costDiamonds: null, action: 'advertisement' },
    { id: 101003, shopId: 101, name: '随机碎片', rewardText: '随机英雄碎片', costText: '随机钻石价', costDiamonds: null, action: 'random' },
    { id: 102001, shopId: 102, name: '开启1次', rewardText: '宝箱经验 ×10', costText: '钻石 ×50', costDiamonds: 50, action: 'chest' },
    { id: 102010, shopId: 102, name: '开启10次', rewardText: '宝箱经验 ×100', costText: '钻石 ×400', costDiamonds: 400, action: 'chest' },
    { id: 103001, shopId: 103, name: '一点金币', rewardText: '金币 ×500', costText: '每日免费 / 广告', costDiamonds: null, rewardGold: 500, action: 'free-server' },
    { id: 103002, shopId: 103, name: '一袋金币', rewardText: '金币 ×2500', costText: '钻石 ×500', costDiamonds: 500, rewardGold: 2500, action: 'fixed' },
    { id: 103003, shopId: 103, name: '一箱金币', rewardText: '金币 ×10000', costText: '钻石 ×1500', costDiamonds: 1500, rewardGold: 10000, action: 'fixed' },
    { id: 104001, shopId: 104, name: '大量体力', rewardText: '体力 ×15', costText: '钻石 ×150（每日3次）', costDiamonds: 150, rewardEnergy: 15, action: 'fixed' },
    { id: 104002, shopId: 104, name: '少量体力', rewardText: '体力 ×10', costText: '观看广告（每日3次）', costDiamonds: null, rewardEnergy: 10, action: 'advertisement' },
];

export type OutOfBattleWallet = { gold: number; energy: number; diamonds: number };
export type OutOfBattlePurchaseResult = {
    wallet: OutOfBattleWallet;
    purchased: boolean;
    reason: 'purchased' | 'unsupported' | 'diamonds';
    good: OutOfBattleShopGood | null;
};

export function purchaseOutOfBattleShopGood(
    wallet: OutOfBattleWallet,
    goodId: number,
): OutOfBattlePurchaseResult {
    const good = OUT_OF_BATTLE_SHOP_GOODS.find((entry) => entry.id === goodId) ?? null;
    if (!good || good.action !== 'fixed' || good.costDiamonds === null) {
        return { wallet: { ...wallet }, purchased: false, reason: 'unsupported', good };
    }
    if (wallet.diamonds < good.costDiamonds) {
        return { wallet: { ...wallet }, purchased: false, reason: 'diamonds', good };
    }
    return {
        wallet: {
            gold: wallet.gold + (good.rewardGold ?? 0),
            energy: wallet.energy + (good.rewardEnergy ?? 0),
            diamonds: wallet.diamonds - good.costDiamonds + (good.rewardDiamonds ?? 0),
        },
        purchased: true,
        reason: 'purchased',
        good,
    };
}

export const OUT_OF_BATTLE_GAMEPLAYS = [
    { id: 1, systemId: 'ENDLESS_MODE', name: '无尽试炼', unlockLevel: 1006, rewards: '金币' },
    { id: 2, systemId: 'DAILY_INSTANCE', name: '每日挑战', unlockLevel: 1010, rewards: '钻石 / 随机碎片 / 宝箱' },
    { id: 3, systemId: 'OTHER_GAMES', name: '玩法合集', unlockLevel: 1006, rewards: '趣味小游戏，快来挑战吧' },
] as const;

export const OUT_OF_BATTLE_DAILY_CHALLENGE_TIMES = 3;
export const OUT_OF_BATTLE_DAILY_CHALLENGE_COST_ENERGY = 5;
export const OUT_OF_BATTLE_DAILY_REWARD_ROUNDS = [2500, 5000, 7500, 10000] as const;

export type OutOfBattleDailyInstance = {
    id: number;
    name: string;
    fightScene: 'fightscene_01' | 'fightscene_02' | 'fightscene_03' | 'fightscene_04';
    roundCount: 10;
    initialDailyGold: 30;
    effectIds: readonly [string, string, string];
};

export const OUT_OF_BATTLE_DAILY_INSTANCES: readonly OutOfBattleDailyInstance[] = [
    { id: 2001, name: '宁静森林', fightScene: 'fightscene_01', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff01', 'DI_BUFF_eff04', 'DI_DEBUFF_eff04'] },
    { id: 2002, name: '密林深处', fightScene: 'fightscene_01', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff02', 'DI_BUFF_eff03', 'DI_DEBUFF_eff03'] },
    { id: 2003, name: '荒漠边缘', fightScene: 'fightscene_03', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff05', 'DI_DEBUFF_eff01', 'DI_DEBUFF_eff02'] },
    { id: 2004, name: '荒漠沙地', fightScene: 'fightscene_03', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff06', 'DI_DEBUFF_eff01', 'DI_DEBUFF_eff05'] },
    { id: 2005, name: '雪山脚下', fightScene: 'fightscene_02', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff07', 'DI_DEBUFF_eff02', 'DI_DEBUFF_eff05'] },
    { id: 2006, name: '无尽雪山', fightScene: 'fightscene_02', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff01', 'DI_BUFF_eff03', 'DI_DEBUFF_eff04'] },
    { id: 2007, name: '青绿草原', fightScene: 'fightscene_01', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff02', 'DI_BUFF_eff04', 'DI_DEBUFF_eff03'] },
    { id: 2008, name: '草原咆哮', fightScene: 'fightscene_01', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff05', 'DI_DEBUFF_eff01', 'DI_DEBUFF_eff05'] },
    { id: 2009, name: '初见火山', fightScene: 'fightscene_04', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff06', 'DI_DEBUFF_eff02', 'DI_DEBUFF_eff05'] },
    { id: 2010, name: '火山熔岩', fightScene: 'fightscene_04', roundCount: 10, initialDailyGold: 30, effectIds: ['DI_BUFF_eff07', 'DI_DEBUFF_eff01', 'DI_DEBUFF_eff02'] },
];

export const OUT_OF_BATTLE_DAILY_EFFECTS: Readonly<Record<string, { name: string; description: string; buff: boolean }>> = {
    DI_BUFF_eff01: { name: '省钱能手', description: '刷新消耗降低20%', buff: true },
    DI_BUFF_eff02: { name: '好运刷刷刷', description: '免费刷新时，提升3级齿轮出现概率', buff: true },
    DI_BUFF_eff03: { name: '小小英雄·1', description: '所有一格二格齿轮攻击+20%', buff: true },
    DI_BUFF_eff04: { name: '小小英雄·2', description: '所有三格四格齿轮攻击+20%', buff: true },
    DI_BUFF_eff05: { name: '多重召唤', description: '召唤齿轮每次以1–3次效能召唤', buff: true },
    DI_BUFF_eff06: { name: '多重施法', description: '法术齿轮每次以1–3次效能释放', buff: true },
    DI_BUFF_eff07: { name: '红色闪光', description: '刷新时有概率直接出现红色齿轮', buff: true },
    DI_DEBUFF_eff01: { name: '怪物·迅捷', description: '所有怪物移动速度提升20%', buff: false },
    DI_DEBUFF_eff02: { name: '怪物·暴躁', description: '所有怪物免疫控制', buff: false },
    DI_DEBUFF_eff03: { name: '精英·壁垒', description: '精英怪物受到仓鼠伤害减免80%', buff: false },
    DI_DEBUFF_eff04: { name: '精英·禁魔', description: '精英怪物受到法术齿轮伤害减免80%', buff: false },
    DI_DEBUFF_eff05: { name: '怪物·专注', description: '增加只会攻击我方大本营的特殊怪物', buff: false },
};

export const OUT_OF_BATTLE_DAILY_RULES = [
    { title: '丰厚奖励', description: '主线章节决定每日挑战章节难度，章节越高，奖励越丰富' },
    { title: '挑战次数', description: '每天最多挑战3次，跨天不累积' },
    { title: '花式战斗', description: '每天有三种不同的随机增益和减益效果' },
] as const;

export const OUT_OF_BATTLE_ENDLESS = {
    dailyChallengeTimes: 3,
    roundIds: [400001] as const,
    costEnergy: 5,
    initialDailyGold: 300,
    advertisementAttempt: 3,
    fightScene: 'fightscene_03',
    recoveredSpawnCount: 560,
} as const;

export const OUT_OF_BATTLE_SEVEN_DAY_REWARDS = [
    { day: 1, rewardText: '钻石 ×150' },
    { day: 2, rewardText: '钻石 ×150' },
    { day: 3, rewardText: '钻石 ×150' },
    { day: 4, rewardText: '钻石 ×150' },
    { day: 5, rewardText: '钻石 ×150' },
    { day: 6, rewardText: '钻石 ×150' },
    { day: 7, rewardText: '豪华齿轮碎片 ×100' },
] as const;

export const OUT_OF_BATTLE_DAILY_TASKS = [
    { id: 1001, text: '击杀100只怪物', target: 100, activeScore: 20 },
    { id: 1002, text: '合成4级齿轮5次', target: 5, activeScore: 20 },
    { id: 1003, text: '挑战主线关卡5次', target: 5, activeScore: 15 },
    { id: 1004, text: '消耗30点体力', target: 30, activeScore: 20 },
    { id: 1005, text: '观看广告10次', target: 10, activeScore: 20 },
    { id: 1006, text: '扫荡4次', target: 4, activeScore: 15 },
    { id: 1007, text: '商店购买1次道具', target: 1, activeScore: 15 },
] as const;

export const OUT_OF_BATTLE_DAILY_ACTIVE_REWARDS = [
    { active: 20, rewardText: '金币 ×500' },
    { active: 40, rewardText: '随机碎片 ×25' },
    { active: 60, rewardText: '体力 ×10' },
    { active: 80, rewardText: '观影券 ×1 / 宝箱 ×1' },
    { active: 100, rewardText: '钻石 ×200 / 主角经验 ×300' },
] as const;
