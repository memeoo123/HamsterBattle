import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    BAGLIKE_ACCOUNT_HERO_FAMILIES,
    BAGLIKE_HERO_STAR_FRAGMENT_COSTS,
    BAGLIKE_HERO_STAR_GOLD_COSTS,
    BAGLIKE_RANDOM_FRAGMENT_FAMILIES,
    BAGLIKE_ACCOUNT_SCHEMA_VERSION,
    BAGLIKE_ACCOUNT_STORAGE_KEY,
    bagLikeAccountChallengeTimes,
    bagLikeAccountHeroFragments,
    bagLikeAccountHeroStar,
    bagLikeAccountUnlockedHeroFamilies,
    bagLikeHeroUnlockLevel,
    bagLikeHeroUpgradeCost,
    bagLikeHeroBaseAttributeAtStar,
    bagLikeHeroStarAttributeModifier,
    bagLikeLevelRewardRounds,
    claimBagLikeLevelRoundAccountReward,
    clearBagLikeAccountProfile,
    completeBagLikeAccountLevel,
    createBagLikeAccountProfile,
    drawBagLikeRandomFragmentBoxes,
    incrementBagLikeAccountChallengeTimes,
    loadBagLikeAccountProfile,
    normalizeBagLikeAccountProfile,
    saveBagLikeAccountProfile,
    setAllBagLikeAccountHeroStars,
    setBagLikeAccountChallengeTimes,
    setBagLikeAccountHeroStar,
    tryUpgradeBagLikeAccountHero,
} from '../assets/scripts/BagLikeAccountProfile.ts';

let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

const defaults = createBagLikeAccountProfile({
    unlockedHeroFamilies: 'H01;H02;H03;H04;H05;H06;H11;H12;H13;H14;H16;H17;UNKNOWN',
    heroStars: { H01: 1, H02: 3, H03: 1, H04: 1, H05: 1, H06: 1, H11: 1, H12: 1, H13: 3, H14: 1, H16: 1, H17: 1 },
    levelId: 1004,
    challengeTimes: 2,
    maxPassedLevelId: 1003,
});

check(defaults.schemaVersion, BAGLIKE_ACCOUNT_SCHEMA_VERSION, 'new saves carry an explicit schema version');
check(defaults.stars.H02, 3, 'legacy inspector values migrate into the local account');
check(defaults.stars.H13, 3, 'evidenced H13 star can migrate without altering other heroes');
check(defaults.stars.H11, 0, 'future level-gated heroes are re-locked despite legacy all-unlocked defaults');
check(bagLikeAccountChallengeTimes(defaults, 1004), 2, 'the current level challenge count migrates');
check([...bagLikeAccountUnlockedHeroFamilies(defaults)], ['H01', 'H02', 'H03', 'H04', 'H12', 'H13'], 'candidate families follow the recovered unlock gates at level 1003');
check(defaults.gold, 0, 'fresh local account currency starts at zero');
check(defaults.maxPassedLevelId, 1003, 'fresh representative state records only earlier levels as passed');

const partlyLocked = createBagLikeAccountProfile({
    unlockedHeroFamilies: 'H01;H12',
    heroStars: { H01: 4, H02: 9, H12: 2 },
    levelId: 1001,
    challengeTimes: 0,
});
check(partlyLocked.stars.H01, 4, 'unlocked heroes retain their configured star');
check(partlyLocked.stars.H02, 1, 'heroes without an unlock condition start at initStar 1');
check(partlyLocked.stars.H12, 2, 'wheel heroes use the same account-star schema');
check(partlyLocked.stars.H13, 0, 'level-gated heroes remain locked before their required clear');
check(bagLikeAccountChallengeTimes(partlyLocked, 1001), 1, 'challenge count is clamped to the first challenge');

const normalized = normalizeBagLikeAccountProfile({
    schemaVersion: 99,
    stars: { H01: 99, H02: -4, H03: '8', H99: 20 },
    challengeTimesByLevel: { 1004: '7', invalid: 12 },
    gold: '1200',
    energy: -8,
    diamonds: 40,
    fragments: { H01: 1004, H13: '7', H99: 100 },
    maxPassedLevelId: 9999,
}, defaults);
check(normalized.schemaVersion, BAGLIKE_ACCOUNT_SCHEMA_VERSION, 'unknown schema versions normalize to the supported version');
check(normalized.stars.H01, 20, 'stars clamp to the recovered 20-star maximum');
check(normalized.stars.H02, 1, 'evidence-backed unconditional unlocks repair an invalid zero-star save');
check(normalized.stars.H03, 8, 'numeric save values are migrated');
check(normalized.stars.H04, defaults.stars.H04, 'missing hero fields use evidence-safe defaults');
check(normalized.challengeTimesByLevel, { 1004: 7 }, 'challenge saves retain only numeric level identifiers');
check(normalized.gold, 1200, 'account gold migrates from numeric serialized values');
check(normalized.energy, 0, 'negative account currency clamps to zero');
check(normalized.fragments.H01, 999, 'fragment inventory obeys the recovered stack limit');
check(normalized.fragments.H13, 7, 'fragment inventory migrates per hero');
check(normalized.maxPassedLevelId, 1200, 'passed level progression clamps to the recovered 200-level range');

const changed = setBagLikeAccountHeroStar(defaults, 'H01', 10);
check(changed.stars.H01, 10, 'individual hero stars can be changed');
check(defaults.stars.H01, 1, 'account updates do not mutate the previous snapshot');
check(bagLikeAccountHeroStar(setBagLikeAccountHeroStar(changed, 'H01', 0), 'H01'), 0, 'zero star locks a hero');
check(setBagLikeAccountHeroStar(changed, 'H01', 50).stars.H01, 20, 'manual changes also clamp to 20 stars');
check(setAllBagLikeAccountHeroStars(defaults, 20).stars.H13, 20, 'the explicit max-star test preset reaches every family');

check(BAGLIKE_HERO_STAR_FRAGMENT_COSTS[2], 2, 'HeroStarConfig 1-to-2 fragment cost is exact');
check(BAGLIKE_HERO_STAR_GOLD_COSTS[20], 200000, 'HeroStarConfig 19-to-20 gold cost is exact');
check(bagLikeHeroUpgradeCost(1), { fromStar: 1, toStar: 2, fragments: 2, gold: 200 }, 'single-star upgrade cost uses the target row');
check(bagLikeHeroUpgradeCost(1, 3), { fromStar: 1, toStar: 3, fragments: 7, gold: 700 }, 'multi-star cost matches HeroModel cumulative subtraction');
check(bagLikeHeroUpgradeCost(0), null, 'locked heroes cannot buy their unlock');
check(bagLikeHeroUpgradeCost(20), null, 'max-star heroes have no next cost');

const upgradeReady = createBagLikeAccountProfile({
    unlockedHeroFamilies: 'H01;H02;H04;H12',
    heroStars: { H01: 1 },
    levelId: 1001,
    challengeTimes: 1,
    maxPassedLevelId: 1000,
    gold: 200,
    fragments: { H01: 2 },
});
const upgraded = tryUpgradeBagLikeAccountHero(upgradeReady, 'H01');
check(upgraded.upgraded, true, 'an unlocked hero upgrades when both resources are sufficient');
check(upgraded.profile.stars.H01, 2, 'formal upgrade advances exactly one star');
check(upgraded.profile.gold, 0, 'formal upgrade spends recovered gold cost');
check(upgraded.profile.fragments.H01, 0, 'formal upgrade spends recovered fragment cost');
check(tryUpgradeBagLikeAccountHero({ ...upgradeReady, gold: 199 }, 'H01').reason, 'gold', 'gold shortage is distinguished');
check(tryUpgradeBagLikeAccountHero({ ...upgradeReady, fragments: { ...upgradeReady.fragments, H01: 1 } }, 'H01').reason, 'fragments', 'fragment shortage is distinguished');

check(bagLikeHeroUnlockLevel('H13'), 1001, 'H13 unlocks after level 1001');
check(bagLikeHeroUnlockLevel('H03'), 1002, 'H03 unlocks after level 1002');
check(bagLikeHeroUnlockLevel('H11'), 1004, 'H11 unlocks after level 1004');
check(bagLikeHeroUnlockLevel('H14'), 1007, 'H14 shark unlocks after level 1007');
check(bagLikeHeroUnlockLevel('H17'), 1015, 'H17 laser gear unlocks after level 1015');
check(bagLikeHeroUnlockLevel('H01'), null, 'H01 has no level gate');
const completed1001 = completeBagLikeAccountLevel(upgradeReady, 1001);
check(completed1001.unlocked, ['H13'], 'clearing 1001 automatically unlocks H13 at initStar');
check(completed1001.profile.stars.H13, 1, 'automatic unlock sets the recovered initStar');
const completed1004 = completeBagLikeAccountLevel(completed1001.profile, 1004);
check(completed1004.unlocked, ['H03', 'H11'], 'advancing through 1004 resolves all crossed unlock conditions');
check(completed1004.profile.maxPassedLevelId, 1004, 'highest completed level persists');

check(bagLikeLevelRewardRounds(1001), [2, 3, 5], 'level 1001 uses its recovered short reward schedule');
check(bagLikeLevelRewardRounds(1002), [3, 5, 8], 'level 1002 uses its recovered reward schedule');
check(bagLikeLevelRewardRounds(1003), [4, 7, 10], 'level 1003 uses its recovered reward schedule');
check(bagLikeLevelRewardRounds(1200), [5, 10, 15], 'late levels use the recovered fifteen-wave milestones');
check(drawBagLikeRandomFragmentBoxes(2, () => 0), { H01: 2 }, 'BOX_RF lower boundary selects the first equal-weight fragment');
check(drawBagLikeRandomFragmentBoxes(1, () => 0.999999), { H17: 1 }, 'BOX_RF upper boundary selects the twelfth fragment');
check(BAGLIKE_RANDOM_FRAGMENT_FAMILIES.length, 12, 'BOX_RF retains all twelve original hero fragment outcomes');

const reward1 = claimBagLikeLevelRoundAccountReward(upgradeReady, 1004, 5, () => 0);
check(reward1.reward?.gold, 500, 'level 1004 first milestone grants recovered account gold');
check(reward1.profile.gold, 700, 'account reward is added to persistent gold');
const reward2 = claimBagLikeLevelRoundAccountReward(reward1.profile, 1004, 10, () => 0);
check(reward2.reward?.gold, 1000, 'level 1004 second milestone grants recovered account gold');
check(reward2.profile.energy, 10, 'second milestone preserves the recovered energy reward');
const reward3 = claimBagLikeLevelRoundAccountReward(reward2.profile, 1004, 15, () => 0);
check(reward3.reward?.diamonds, 100, 'final milestone preserves the recovered diamond reward');
check(reward3.reward?.fragmentBoxes, 22, 'level 1004 final milestone opens the recovered BOX_RF count');
check(bagLikeAccountHeroFragments(reward3.profile, 'H01'), 24, 'deterministic BOX_RF grants stack with owned hero fragments');
check(claimBagLikeLevelRoundAccountReward(upgradeReady, 1004, 6).reward, null, 'non-milestone rounds do not grant account rewards');

const challenged = setBagLikeAccountChallengeTimes(defaults, 1004, 5);
check(bagLikeAccountChallengeTimes(challenged, 1004), 5, 'challenge count is editable per level');
check(bagLikeAccountChallengeTimes(incrementBagLikeAccountChallengeTimes(challenged, 1004), 1004), 6, 'retry advances the persisted challenge count');
check(bagLikeAccountChallengeTimes(challenged, 1999), 1, 'unseen levels start at the first challenge');

check(bagLikeHeroStarAttributeModifier(1), 0, 'one star keeps base attributes');
check(bagLikeHeroStarAttributeModifier(3), 2100, 'three stars use the recovered +21% modifier');
check(bagLikeHeroStarAttributeModifier(15), 27900, 'the previous 15-star boundary remains exact');
check(bagLikeHeroStarAttributeModifier(20), 51100, 'the package 20-star maximum uses +511%');
check(bagLikeHeroBaseAttributeAtStar(27, 3), 32, 'HeroModel floors the star-adjusted base attack');
check(bagLikeHeroBaseAttributeAtStar(300, 20), 1833, '20-star wheel HP uses the original floor order');

const values = new Map();
const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
};
check(loadBagLikeAccountProfile(storage, defaults).source, 'default', 'missing storage starts from defaults');
check(saveBagLikeAccountProfile(storage, challenged), true, 'account snapshots persist through the storage adapter');
check(values.has(BAGLIKE_ACCOUNT_STORAGE_KEY), true, 'the save uses a namespaced versioned key');
check(loadBagLikeAccountProfile(storage, defaults).profile.challengeTimesByLevel['1004'], 5, 'saved challenge state reloads');
values.set(BAGLIKE_ACCOUNT_STORAGE_KEY, '{not-json');
const recovered = loadBagLikeAccountProfile(storage, defaults);
check(recovered.recoveredFromInvalidSave, true, 'corrupt JSON is reported without crashing initialization');
check(recovered.profile.stars, defaults.stars, 'corrupt saves recover evidence-safe hero values');
check(clearBagLikeAccountProfile(storage), true, 'account storage can be cleared safely');
check(values.has(BAGLIKE_ACCOUNT_STORAGE_KEY), false, 'clear removes only the account key');

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
assert.match(source, /if \(!this\.loadAccountProfile\(\)\) return;[\s\S]*buildScene\(\);/, 'account state and level access load before candidates and units are built');
assert.match(source, /bagLikeAccountUnlockedHeroFamilies\(this\.accountProfile\)/, 'dynamic candidates use persisted unlocks');
assert.match(source, /this\.currentHeroStars\(\)[\s\S]{0,200}bagLikeHeroBaseAttributeAtStar/, 'production uses persisted stars for base attributes');
assert.match(source, /incrementBagLikeAccountChallengeTimes\(this\.accountProfile, this\.levelId\)/, 'retry advances per-level challenge state');
assert.match(source, /claimBagLikeLevelRoundAccountReward\(this\.accountProfile, this\.levelId, roundNumber/, 'round milestones flow into the persistent account');
assert.match(source, /completeBagLikeAccountLevel\(this\.accountProfile, this\.levelId\)/, 'victory applies evidence-backed automatic unlocks');
assert.match(source, /tryUpgradeBagLikeAccountHero\(this\.accountProfile, family\)/, 'the account UI uses formal resource-spending upgrades');
assert.match(source, /accountDebug=1[\s\S]*测试：全 20 星/, 'manual star presets are isolated behind an explicit debug query');
assert.match(source, /账号 \/ 星级[\s\S]*buildAccountPanel\(\)/, 'the normal preparation flow exposes the account panel');
assert.match(source, /商店[\s\S]*角色[\s\S]*战斗[\s\S]*培养[\s\S]*活动/, 'the recovered five-tab main navigation is present in source order');
assert.match(source, /showRoleScene\(\)[\s\S]*showCultivationScene\(/, 'role and cultivation are directly reachable from the main navigation');
assert.match(source, /BAGLIKE_ACCOUNT_HERO_FAMILIES[\s\S]*slice\(this\.cultivationPage \* pageSize/, 'cultivation paginates the complete account hero roster');
assertions += 12;

console.log(`baglike account profile: ${assertions} assertions passed`);
