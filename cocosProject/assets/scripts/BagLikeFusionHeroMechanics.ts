export type BagLikeFusionActiveSkillId = '10001_2' | '12001_2';

export type BagLikeFusionPrimaryBulletProfile = {
    skillId: '10001';
    missileId: 'M_FD_10001';
    behaviorDelaySeconds: number;
    launchOffsetX: number;
    launchOffsetY: number;
    speed: number;
    stopShortDistance: number;
    effectRatio: number;
    width: number;
    height: number;
    ignoredMissileFields: Readonly<{
        distance: number;
        timeLimit: number;
        visualWidth: number;
        interval: number;
        autoLock: number;
    }>;
};

export type BagLikeFusionActiveStep = {
    delaySeconds: number;
    effectRatio: number;
};

export type BagLikeFusionActiveProfile = {
    skillId: BagLikeFusionActiveSkillId;
    initialCooldownSeconds: number;
    cooldownSeconds: number;
    castTimeSeconds: number;
    castingRange: number;
    targeting: 'global' | 'forward-rectangle';
    width: number;
    height: number;
    steps: readonly BagLikeFusionActiveStep[];
};

// MissileConfig M_FD_10001 is type 11. Version 18's BulletType enum has no
// value 11 (Ray is 18), so UnitFactory falls through to the default BulletUnit.
// That class flies in the launch direction at cfg.speed and ends roughly 20
// units before the locked target's launch position. It never reads distance,
// timeLimit, or the parameter width/interval/autoLock fields.
export const H10_PRIMARY_BULLET_PROFILE: BagLikeFusionPrimaryBulletProfile = {
    skillId: '10001',
    missileId: 'M_FD_10001',
    behaviorDelaySeconds: 0.3,
    launchOffsetX: 0,
    launchOffsetY: 50,
    speed: 1000,
    stopShortDistance: 20,
    effectRatio: 5000,
    width: 100,
    height: 300,
    ignoredMissileFields: {
        distance: 500,
        timeLimit: 4000,
        visualWidth: 600,
        interval: 1000,
        autoLock: 600,
    },
};

export function bagLikeFusionPrimaryBulletProfile(heroId: string): BagLikeFusionPrimaryBulletProfile | null {
    return heroId === 'H10' ? H10_PRIMARY_BULLET_PROFILE : null;
}

// SkillConfig 10001_2 + M_FD_10004: the missile applies the same global
// 1000-ratio behavior at 1/2/3/4/5 seconds. Skill precd/cd are 6/10 seconds.
export const H10_NUKE_PROFILE: BagLikeFusionActiveProfile = {
    skillId: '10001_2',
    initialCooldownSeconds: 6,
    cooldownSeconds: 10,
    castTimeSeconds: 1,
    castingRange: 250,
    targeting: 'global',
    width: 0,
    height: 0,
    steps: [1, 2, 3, 4, 5].map((delaySeconds) => ({ delaySeconds, effectRatio: 1000 })),
};

// SkillConfig 12001_2 + bh12001_2..6: six delayed hits in the same forward
// 100x300 rectangle. The duplicated bh12001_3 is intentional in the package.
export const H18_BREATH_PROFILE: BagLikeFusionActiveProfile = {
    skillId: '12001_2',
    initialCooldownSeconds: 0,
    cooldownSeconds: 5,
    castTimeSeconds: 1.5,
    castingRange: 200,
    targeting: 'forward-rectangle',
    width: 100,
    height: 300,
    steps: [
        { delaySeconds: 0.2, effectRatio: 10000 },
        { delaySeconds: 0.4, effectRatio: 12000 },
        { delaySeconds: 0.6, effectRatio: 12000 },
        { delaySeconds: 0.8, effectRatio: 14000 },
        { delaySeconds: 1, effectRatio: 16000 },
        { delaySeconds: 1.2, effectRatio: 18000 },
    ],
};

export function bagLikeFusionActiveProfile(heroId: string): BagLikeFusionActiveProfile | null {
    if (heroId === 'H10') return H10_NUKE_PROFILE;
    if (heroId === 'H18') return H18_BREATH_PROFILE;
    return null;
}

export function crossedBagLikeFusionActiveSteps(
    profile: BagLikeFusionActiveProfile,
    previousElapsed: number,
    elapsed: number,
): readonly BagLikeFusionActiveStep[] {
    return profile.steps.filter((step) => previousElapsed < step.delaySeconds && elapsed >= step.delaySeconds);
}

// H15's two formation effects are inherent to the fusion hero: every H15 kill
// awards one coin and every surviving placed H1505 awards 16 at round end.
export const H15_KILL_COIN_AMOUNT = 1;
export const H15_ROUND_END_COIN_AMOUNT = 16;

export function bagLikeH15KillCoins(attackerHeroId: string, killedEnemy: boolean): number {
    return attackerHeroId === 'H15' && killedEnemy ? H15_KILL_COIN_AMOUNT : 0;
}

export function bagLikeH15RoundEndCoins(placedGearIds: readonly string[]): number {
    return placedGearIds.filter((gearId) => gearId === 'H1505').length * H15_ROUND_END_COIN_AMOUNT;
}
