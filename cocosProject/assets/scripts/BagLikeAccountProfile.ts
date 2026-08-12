export const BAGLIKE_ACCOUNT_SCHEMA_VERSION = 4;
export const BAGLIKE_ACCOUNT_STORAGE_KEY = 'cangshu.restore.baglike.account.v1';
export const BAGLIKE_HERO_MIN_STAR = 1;
export const BAGLIKE_HERO_MAX_STAR = 20;
export const BAGLIKE_FRAGMENT_STACK_LIMIT = 999;

export const BAGLIKE_ACCOUNT_HERO_FAMILIES = [
    'H01',
    'H02',
    'H03',
    'H04',
    'H05',
    'H06',
    'H11',
    'H12',
    'H13',
    'H14',
    'H16',
    'H17',
] as const;

export type BagLikeAccountHeroFamily = typeof BAGLIKE_ACCOUNT_HERO_FAMILIES[number];

// RewardDropConfig 2020, referenced by the TrunkInstance BOX_RF reward, rolls
// one of these twelve hero fragments with identical weight.
export const BAGLIKE_RANDOM_FRAGMENT_FAMILIES = [
    'H01', 'H02', 'H03', 'H04', 'H05', 'H06',
    'H11', 'H12', 'H13', 'H14', 'H16', 'H17',
] as const;

export type BagLikeFragmentFamily = typeof BAGLIKE_RANDOM_FRAGMENT_FAMILIES[number];

export type BagLikeAccountProfile = {
    schemaVersion: number;
    stars: Record<BagLikeAccountHeroFamily, number>;
    challengeTimesByLevel: Record<string, number>;
    gold: number;
    energy: number;
    diamonds: number;
    fragments: Record<BagLikeFragmentFamily, number>;
    maxPassedLevelId: number;
};

export type BagLikeAccountStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type BagLikeLegacyAccountDefaults = {
    unlockedHeroFamilies: string;
    heroStars: Readonly<Partial<Record<BagLikeAccountHeroFamily, number>>>;
    levelId: number;
    challengeTimes: number;
    maxPassedLevelId?: number;
    gold?: number;
    energy?: number;
    diamonds?: number;
    fragments?: Readonly<Partial<Record<BagLikeFragmentFamily, number>>>;
};

export type BagLikeAccountLoadResult = {
    profile: BagLikeAccountProfile;
    source: 'saved' | 'default';
    recoveredFromInvalidSave: boolean;
};

export type BagLikeHeroUpgradeCost = {
    fromStar: number;
    toStar: number;
    fragments: number;
    gold: number;
};

export type BagLikeHeroUpgradeResult = {
    profile: BagLikeAccountProfile;
    upgraded: boolean;
    reason: 'upgraded' | 'locked' | 'maxStar' | 'fragments' | 'gold';
    cost: BagLikeHeroUpgradeCost | null;
};

export type BagLikeLevelAccountReward = {
    round: number;
    gold: number;
    energy: number;
    diamonds: number;
    fragmentBoxes: number;
    fragments: Partial<Record<BagLikeFragmentFamily, number>>;
};

export type BagLikeLevelRewardClaim = {
    profile: BagLikeAccountProfile;
    reward: BagLikeLevelAccountReward | null;
};

export type BagLikeLevelCompletion = {
    profile: BagLikeAccountProfile;
    unlocked: BagLikeAccountHeroFamily[];
};

const ACCOUNT_HERO_FAMILY_SET = new Set<string>(BAGLIKE_ACCOUNT_HERO_FAMILIES);
const BAGLIKE_HERO_UNLOCK_LEVEL: Readonly<Record<BagLikeAccountHeroFamily, number>> = {
    H01: 1000,
    H02: 1000,
    H03: 1002,
    H04: 1000,
    H05: 1005,
    H06: 1009,
    H11: 1004,
    H12: 1000,
    H13: 1001,
    H14: 1007,
    H16: 1012,
    H17: 1015,
};

function integerInRange(value: unknown, minimum: number, maximum: number, fallback: number): number {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(minimum, Math.min(maximum, Math.floor(numeric)));
}

function normalizedStars(value: unknown, fallback: BagLikeAccountProfile['stars']): BagLikeAccountProfile['stars'] {
    const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    const result = {} as BagLikeAccountProfile['stars'];
    for (const family of BAGLIKE_ACCOUNT_HERO_FAMILIES) {
        result[family] = integerInRange(source[family], 0, BAGLIKE_HERO_MAX_STAR, fallback[family]);
    }
    return result;
}

function normalizedChallengeTimes(value: unknown, fallback: Record<string, number>): Record<string, number> {
    const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    const result: Record<string, number> = { ...fallback };
    for (const levelId of Object.keys(source)) {
        if (!/^\d+$/.test(levelId)) continue;
        result[levelId] = integerInRange(source[levelId], 1, Number.MAX_SAFE_INTEGER, 1);
    }
    return result;
}

function normalizedFragments(
    value: unknown,
    fallback: BagLikeAccountProfile['fragments'],
): BagLikeAccountProfile['fragments'] {
    const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    const result = {} as BagLikeAccountProfile['fragments'];
    for (const family of BAGLIKE_RANDOM_FRAGMENT_FAMILIES) {
        result[family] = integerInRange(source[family], 0, BAGLIKE_FRAGMENT_STACK_LIMIT, fallback[family]);
    }
    return result;
}

function applyEvidenceBackedUnlocks(profile: BagLikeAccountProfile): BagLikeAccountProfile {
    const next = cloneBagLikeAccountProfile(profile);
    for (const family of BAGLIKE_ACCOUNT_HERO_FAMILIES) {
        if (next.maxPassedLevelId < BAGLIKE_HERO_UNLOCK_LEVEL[family]) {
            // Old reconstruction builds initialized every family at one star.
            // Re-lock future families so the candidate pool follows HeroUnlockConfig.
            next.stars[family] = 0;
        } else if (next.stars[family] <= 0) {
            next.stars[family] = BAGLIKE_HERO_MIN_STAR;
        }
    }
    return next;
}

export function createBagLikeAccountProfile(defaults: BagLikeLegacyAccountDefaults): BagLikeAccountProfile {
    const unlocked = new Set(
        defaults.unlockedHeroFamilies
            .split(';')
            .map((family) => family.trim())
            .filter((family) => ACCOUNT_HERO_FAMILY_SET.has(family)),
    );
    const stars = {} as BagLikeAccountProfile['stars'];
    for (const family of BAGLIKE_ACCOUNT_HERO_FAMILIES) {
        stars[family] = unlocked.has(family)
            ? integerInRange(defaults.heroStars[family], BAGLIKE_HERO_MIN_STAR, BAGLIKE_HERO_MAX_STAR, 1)
            : 0;
    }
    const fragments = {} as BagLikeAccountProfile['fragments'];
    for (const family of BAGLIKE_RANDOM_FRAGMENT_FAMILIES) {
        fragments[family] = integerInRange(defaults.fragments?.[family], 0, BAGLIKE_FRAGMENT_STACK_LIMIT, 0);
    }
    return applyEvidenceBackedUnlocks({
        schemaVersion: BAGLIKE_ACCOUNT_SCHEMA_VERSION,
        stars,
        challengeTimesByLevel: {
            [String(defaults.levelId)]: integerInRange(defaults.challengeTimes, 1, Number.MAX_SAFE_INTEGER, 1),
        },
        gold: integerInRange(defaults.gold, 0, Number.MAX_SAFE_INTEGER, 0),
        energy: integerInRange(defaults.energy, 0, Number.MAX_SAFE_INTEGER, 0),
        diamonds: integerInRange(defaults.diamonds, 0, Number.MAX_SAFE_INTEGER, 0),
        fragments,
        maxPassedLevelId: integerInRange(defaults.maxPassedLevelId, 1000, 1200, Math.max(1000, defaults.levelId - 1)),
    });
}

export function normalizeBagLikeAccountProfile(
    value: unknown,
    fallback: BagLikeAccountProfile,
): BagLikeAccountProfile {
    const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    return applyEvidenceBackedUnlocks({
        schemaVersion: BAGLIKE_ACCOUNT_SCHEMA_VERSION,
        stars: normalizedStars(source.stars, fallback.stars),
        challengeTimesByLevel: normalizedChallengeTimes(source.challengeTimesByLevel, fallback.challengeTimesByLevel),
        gold: integerInRange(source.gold, 0, Number.MAX_SAFE_INTEGER, fallback.gold),
        energy: integerInRange(source.energy, 0, Number.MAX_SAFE_INTEGER, fallback.energy),
        diamonds: integerInRange(source.diamonds, 0, Number.MAX_SAFE_INTEGER, fallback.diamonds),
        fragments: normalizedFragments(source.fragments, fallback.fragments),
        maxPassedLevelId: integerInRange(source.maxPassedLevelId, 1000, 1200, fallback.maxPassedLevelId),
    });
}

export function cloneBagLikeAccountProfile(profile: BagLikeAccountProfile): BagLikeAccountProfile {
    return {
        schemaVersion: BAGLIKE_ACCOUNT_SCHEMA_VERSION,
        stars: { ...profile.stars },
        challengeTimesByLevel: { ...profile.challengeTimesByLevel },
        gold: profile.gold,
        energy: profile.energy,
        diamonds: profile.diamonds,
        fragments: { ...profile.fragments },
        maxPassedLevelId: profile.maxPassedLevelId,
    };
}

export function loadBagLikeAccountProfile(
    storage: BagLikeAccountStorage | null | undefined,
    fallback: BagLikeAccountProfile,
): BagLikeAccountLoadResult {
    if (!storage) {
        return { profile: cloneBagLikeAccountProfile(fallback), source: 'default', recoveredFromInvalidSave: false };
    }
    let serialized: string | null = null;
    try {
        serialized = storage.getItem(BAGLIKE_ACCOUNT_STORAGE_KEY);
        if (!serialized) {
            return { profile: cloneBagLikeAccountProfile(fallback), source: 'default', recoveredFromInvalidSave: false };
        }
        return {
            profile: normalizeBagLikeAccountProfile(JSON.parse(serialized), fallback),
            source: 'saved',
            recoveredFromInvalidSave: false,
        };
    } catch {
        return {
            profile: cloneBagLikeAccountProfile(fallback),
            source: 'default',
            recoveredFromInvalidSave: serialized !== null,
        };
    }
}

export function saveBagLikeAccountProfile(
    storage: BagLikeAccountStorage | null | undefined,
    profile: BagLikeAccountProfile,
): boolean {
    if (!storage) return false;
    try {
        storage.setItem(BAGLIKE_ACCOUNT_STORAGE_KEY, JSON.stringify(profile));
        return true;
    } catch {
        return false;
    }
}

export function clearBagLikeAccountProfile(storage: BagLikeAccountStorage | null | undefined): boolean {
    if (!storage) return false;
    try {
        storage.removeItem(BAGLIKE_ACCOUNT_STORAGE_KEY);
        return true;
    } catch {
        return false;
    }
}

export function bagLikeAccountHeroStar(profile: BagLikeAccountProfile, family: BagLikeAccountHeroFamily): number {
    return profile.stars[family] || 0;
}

export function bagLikeAccountUnlockedHeroFamilies(profile: BagLikeAccountProfile): Set<BagLikeAccountHeroFamily> {
    return new Set(BAGLIKE_ACCOUNT_HERO_FAMILIES.filter((family) => bagLikeAccountHeroStar(profile, family) > 0));
}

export function setBagLikeAccountHeroStar(
    profile: BagLikeAccountProfile,
    family: BagLikeAccountHeroFamily,
    star: number,
): BagLikeAccountProfile {
    const next = cloneBagLikeAccountProfile(profile);
    next.stars[family] = integerInRange(star, 0, BAGLIKE_HERO_MAX_STAR, next.stars[family]);
    return next;
}

export function setAllBagLikeAccountHeroStars(profile: BagLikeAccountProfile, star: number): BagLikeAccountProfile {
    let next = cloneBagLikeAccountProfile(profile);
    for (const family of BAGLIKE_ACCOUNT_HERO_FAMILIES) next = setBagLikeAccountHeroStar(next, family, star);
    return next;
}

export function bagLikeAccountChallengeTimes(profile: BagLikeAccountProfile, levelId: number): number {
    return integerInRange(profile.challengeTimesByLevel[String(levelId)], 1, Number.MAX_SAFE_INTEGER, 1);
}

export function setBagLikeAccountChallengeTimes(
    profile: BagLikeAccountProfile,
    levelId: number,
    challengeTimes: number,
): BagLikeAccountProfile {
    const next = cloneBagLikeAccountProfile(profile);
    next.challengeTimesByLevel[String(levelId)] = integerInRange(challengeTimes, 1, Number.MAX_SAFE_INTEGER, 1);
    return next;
}

export function incrementBagLikeAccountChallengeTimes(
    profile: BagLikeAccountProfile,
    levelId: number,
): BagLikeAccountProfile {
    return setBagLikeAccountChallengeTimes(profile, levelId, bagLikeAccountChallengeTimes(profile, levelId) + 1);
}

// HeroStarConfig rows are the cost of reaching the indexed star. Types 1 and 2
// have the same values in package version 18.
export const BAGLIKE_HERO_STAR_FRAGMENT_COSTS = [
    0, 0, 2, 5, 10, 20, 30, 50, 70, 100, 150,
    200, 300, 500, 700, 1000, 1500, 2000, 3000, 5000, 7000,
] as const;

export const BAGLIKE_HERO_STAR_GOLD_COSTS = [
    0, 0, 200, 500, 1000, 1500, 2000, 3000, 4000, 6000, 8000,
    10000, 15000, 20000, 30000, 40000, 60000, 80000, 100000, 150000, 200000,
] as const;

export function bagLikeHeroUpgradeCost(fromStar: number, toStar = fromStar + 1): BagLikeHeroUpgradeCost | null {
    const from = integerInRange(fromStar, 0, BAGLIKE_HERO_MAX_STAR, 0);
    const to = integerInRange(toStar, 0, BAGLIKE_HERO_MAX_STAR, from);
    if (from < BAGLIKE_HERO_MIN_STAR || to <= from) return null;
    let fragments = 0;
    let gold = 0;
    for (let star = from + 1; star <= to; star += 1) {
        fragments += BAGLIKE_HERO_STAR_FRAGMENT_COSTS[star];
        gold += BAGLIKE_HERO_STAR_GOLD_COSTS[star];
    }
    return { fromStar: from, toStar: to, fragments, gold };
}

export function bagLikeAccountHeroFragments(
    profile: BagLikeAccountProfile,
    family: BagLikeFragmentFamily,
): number {
    return integerInRange(profile.fragments[family], 0, BAGLIKE_FRAGMENT_STACK_LIMIT, 0);
}

export function tryUpgradeBagLikeAccountHero(
    profile: BagLikeAccountProfile,
    family: BagLikeAccountHeroFamily,
): BagLikeHeroUpgradeResult {
    const star = bagLikeAccountHeroStar(profile, family);
    if (star <= 0) return { profile: cloneBagLikeAccountProfile(profile), upgraded: false, reason: 'locked', cost: null };
    if (star >= BAGLIKE_HERO_MAX_STAR) return { profile: cloneBagLikeAccountProfile(profile), upgraded: false, reason: 'maxStar', cost: null };
    const cost = bagLikeHeroUpgradeCost(star)!;
    if (bagLikeAccountHeroFragments(profile, family) < cost.fragments) {
        return { profile: cloneBagLikeAccountProfile(profile), upgraded: false, reason: 'fragments', cost };
    }
    if (profile.gold < cost.gold) {
        return { profile: cloneBagLikeAccountProfile(profile), upgraded: false, reason: 'gold', cost };
    }
    const next = cloneBagLikeAccountProfile(profile);
    next.fragments[family] -= cost.fragments;
    next.gold -= cost.gold;
    next.stars[family] = cost.toStar;
    return { profile: next, upgraded: true, reason: 'upgraded', cost };
}

export function bagLikeHeroUnlockLevel(family: BagLikeAccountHeroFamily): number | null {
    const level = BAGLIKE_HERO_UNLOCK_LEVEL[family];
    return level <= 1000 ? null : level;
}

export function completeBagLikeAccountLevel(
    profile: BagLikeAccountProfile,
    levelId: number,
): BagLikeLevelCompletion {
    const next = cloneBagLikeAccountProfile(profile);
    next.maxPassedLevelId = Math.max(next.maxPassedLevelId, integerInRange(levelId, 1001, 1200, 1001));
    const unlocked: BagLikeAccountHeroFamily[] = [];
    for (const family of BAGLIKE_ACCOUNT_HERO_FAMILIES) {
        if (next.stars[family] <= 0 && next.maxPassedLevelId >= BAGLIKE_HERO_UNLOCK_LEVEL[family]) {
            next.stars[family] = BAGLIKE_HERO_MIN_STAR;
            unlocked.push(family);
        }
    }
    return { profile: next, unlocked };
}

export function bagLikeLevelRewardRounds(levelId: number): readonly number[] {
    if (levelId === 1001) return [2, 3, 5];
    if (levelId === 1002) return [3, 5, 8];
    if (levelId === 1003) return [4, 7, 10];
    if (levelId >= 1004 && levelId <= 1200) return [5, 10, 15];
    return [];
}

export function drawBagLikeRandomFragmentBoxes(
    count: number,
    random: () => number = Math.random,
): Partial<Record<BagLikeFragmentFamily, number>> {
    const result: Partial<Record<BagLikeFragmentFamily, number>> = {};
    const boxes = integerInRange(count, 0, Number.MAX_SAFE_INTEGER, 0);
    for (let index = 0; index < boxes; index += 1) {
        const roll = Math.min(0.999999999999, Math.max(0, random()));
        const family = BAGLIKE_RANDOM_FRAGMENT_FAMILIES[Math.floor(roll * BAGLIKE_RANDOM_FRAGMENT_FAMILIES.length)];
        result[family] = (result[family] || 0) + 1;
    }
    return result;
}

export function claimBagLikeLevelRoundAccountReward(
    profile: BagLikeAccountProfile,
    levelId: number,
    round: number,
    random: () => number = Math.random,
): BagLikeLevelRewardClaim {
    if (levelId < 1001 || levelId > 1200) return { profile: cloneBagLikeAccountProfile(profile), reward: null };
    const rewardRounds = bagLikeLevelRewardRounds(levelId);
    const rewardIndex = rewardRounds.indexOf(Math.floor(round));
    if (rewardIndex < 0) return { profile: cloneBagLikeAccountProfile(profile), reward: null };
    const chapter = levelId - 1000;
    const reward: BagLikeLevelAccountReward = {
        round: Math.floor(round),
        gold: rewardIndex === 0 ? (chapter + 1) * 100 : rewardIndex === 1 ? (chapter + 1) * 200 : 0,
        energy: rewardIndex === 1 ? 10 : 0,
        diamonds: rewardIndex === 2 ? 100 : 0,
        fragmentBoxes: rewardIndex === 2 ? chapter * 2 + 14 : 0,
        fragments: {},
    };
    reward.fragments = drawBagLikeRandomFragmentBoxes(reward.fragmentBoxes, random);
    const next = cloneBagLikeAccountProfile(profile);
    next.gold += reward.gold;
    next.energy += reward.energy;
    next.diamonds += reward.diamonds;
    for (const family of BAGLIKE_RANDOM_FRAGMENT_FAMILIES) {
        next.fragments[family] = Math.min(
            BAGLIKE_FRAGMENT_STACK_LIMIT,
            next.fragments[family] + (reward.fragments[family] || 0),
        );
    }
    return { profile: next, reward };
}

// hero.HeroStarConfig type 1 and type 2 are identical in package version 18.
// HeroModel floors the base attribute after applying this basis-point modifier.
export const BAGLIKE_HERO_STAR_ATTRIBUTE_MODIFIERS = [
    0, 0, 1000, 2100, 3300, 4600, 6100, 7700, 9400, 11400, 13500,
    15900, 18500, 21300, 24500, 27900, 31700, 35900, 40500, 45500, 51100,
] as const;

export function bagLikeHeroStarAttributeModifier(star: number): number {
    const normalizedStar = integerInRange(star, BAGLIKE_HERO_MIN_STAR, BAGLIKE_HERO_MAX_STAR, 1);
    return BAGLIKE_HERO_STAR_ATTRIBUTE_MODIFIERS[normalizedStar];
}

export function bagLikeHeroBaseAttributeAtStar(baseAttribute: number, star: number): number {
    return Math.floor(baseAttribute * (1 + bagLikeHeroStarAttributeModifier(star) / 10000));
}
