type PowerRoleId = 'P01' | 'P02' | 'P03' | 'P04';
type PowerRoleState = {
    equippedRoleId: PowerRoleId;
    roles: Record<PowerRoleId, { level: number; star: number }>;
};

export const POWER_ROLE_ACTIVE_ENERGY_COST = 300;
export const POWER_ROLE_ACTIVE_ENERGY_MAX = 500;
export const POWER_ROLE_ACTIVE_SECONDS = 5;
export const P04_MAX_HITS = 10;
export const P04_HIT_DAMAGE_DECAY_BASIS_POINTS = 1000;
export const P04_KILL_PRODUCTIVITY_BASIS_POINTS = 100;

function starTierValue(star: number, base: number, starThree: number, starSeven: number): number {
    return star >= 7 ? starSeven : star >= 3 ? starThree : base;
}

export function equippedPowerRole(state: PowerRoleState): { id: PowerRoleId; star: number; level: number } {
    const id = state.equippedRoleId;
    const role = state.roles[id];
    return { id, star: role.star, level: role.level };
}

export function powerRoleRoundStartProductivityBasisPoints(state: PowerRoleState, roundNumber: number): number {
    const role = equippedPowerRole(state);
    if (role.id === 'P01') return starTierValue(role.star, 1000, 1500, 2000);
    if (role.id === 'P02' && role.star >= 1) {
        const cap = role.star >= 5 ? 10 : 5;
        return Math.min(cap, Math.max(1, Math.floor(roundNumber))) * 100;
    }
    return 0;
}

export function p01StartRewardGearLevel(state: PowerRoleState): 0 | 1 | 2 {
    const role = equippedPowerRole(state);
    if (role.id !== 'P01' || role.star < 1) return 0;
    return role.star >= 5 ? 2 : 1;
}

export function powerRoleActiveBasisPoints(state: PowerRoleState): number {
    const role = equippedPowerRole(state);
    if (role.id === 'P02') return starTierValue(role.star, 3000, 4000, 5000);
    if (role.id === 'P03') return starTierValue(role.star, 1500, 2000, 2500);
    if (role.id === 'P04') return starTierValue(role.star, 6000, 9000, 12000);
    return 0;
}

export function powerRoleGlobalAttackBasisPoints(state: PowerRoleState): number {
    let result = 0;
    for (const id of Object.keys(state.roles) as PowerRoleId[]) {
        const role = state.roles[id];
        const star = role.star;
        if (star < 0) continue;
        // PowerLevelConfig.attrs2 alternates global attack/HP at each ten-level
        // milestone. Attack is awarded at levels 10, 30, 50 ... 170.
        result += Math.max(0, Math.min(9, Math.floor((role.level + 10) / 20))) * 1000;
        if (star >= 2) result += 1000;
        if (star >= 4) result += 1000;
        if (star >= 6) result += 1000;
        if (star >= 8) result += 2000;
    }
    // HeroMgr.getHeroAttrByBase reads the equipped role's own level and star
    // attributes after RoleModel has copied the global attributes into it.
    const equipped = equippedPowerRole(state);
    result += Math.max(0, equipped.level) * 100;
    result += Math.max(0, equipped.star) * 1000;
    return result;
}

export function p04DamageBasisPointsAtHit(state: PowerRoleState, zeroBasedHitIndex: number): number {
    if (state.equippedRoleId !== 'P04') return 0;
    const base = powerRoleActiveBasisPoints(state);
    const index = Math.max(0, Math.min(P04_MAX_HITS - 1, Math.floor(zeroBasedHitIndex)));
    return Math.max(0, Math.round(base * (1 - index * P04_HIT_DAMAGE_DECAY_BASIS_POINTS / 10000)));
}

export function p04KillProductivityCap(state: PowerRoleState): number {
    const role = equippedPowerRole(state);
    if (role.id !== 'P04' || role.star < 1) return 0;
    return role.star >= 5 ? 20 : 10;
}

export function p04KillProductivityBasisPoints(state: PowerRoleState, kills: number): number {
    return Math.min(p04KillProductivityCap(state), Math.max(0, Math.floor(kills)))
        * P04_KILL_PRODUCTIVITY_BASIS_POINTS;
}

export function p03ActiveHealBasisPoints(state: PowerRoleState): number {
    const role = equippedPowerRole(state);
    if (role.id !== 'P03' || role.star < 1) return 0;
    return role.star >= 5 ? 5000 : 3000;
}

export function powerRoleActiveAvailable(state: PowerRoleState, energy: number): boolean {
    return state.equippedRoleId !== 'P01' && energy >= POWER_ROLE_ACTIVE_ENERGY_COST;
}

export function addPowerRoleEnergy(current: number, monsterExp: number): number {
    return Math.min(POWER_ROLE_ACTIVE_ENERGY_MAX, Math.max(0, current) + Math.max(0, monsterExp));
}
