import assert from 'node:assert/strict';
import {
    activatePowerRole,
    claimPowerRoleFreeFragments,
    claimPowerRoleFreeLevel,
    createPowerRoleState,
    equipPowerRole,
    loadPowerRoleState,
    POWER_ROLE_DAILY_FREE_FRAGMENT_TIMES,
    POWER_ROLE_DAILY_FREE_LEVEL_TIMES,
    POWER_ROLE_FREE_FRAGMENT_COUNT,
    POWER_ROLE_STAR_COSTS,
    POWER_ROLE_STORAGE_KEY,
    savePowerRoleState,
    powerRoleLevelCost,
    powerRoleLevelLimit,
    upgradePowerRoleStar,
} from '../assets/scripts/PowerRoleProgression.ts';

let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

const day = new Date(2026, 7, 12, 12, 0, 0);
let state = createPowerRoleState(day);
check(state.roles.P01.star, 0, 'POWER:INIT_DATA gives P01 at star zero');
check(state.equippedRoleId, 'P01', 'POWER:INIT_DATA equips P01');
check(state.roles.P02.star, -1, 'roles absent from init data stay locked');
check(POWER_ROLE_STAR_COSTS[0], 10, 'PowerStarConfig requires ten fragments to recruit');
check(POWER_ROLE_FREE_FRAGMENT_COUNT, 2, 'PowerConstantConfig grants two fragments per completed ad');
check(POWER_ROLE_DAILY_FREE_FRAGMENT_TIMES, 3, 'PowerConstantConfig allows three role-specific claims each day');
check(POWER_ROLE_DAILY_FREE_LEVEL_TIMES, 3, 'PowerConstantConfig allows three free level-ups each day');
check(powerRoleLevelLimit(0), 20, 'star zero caps at level twenty');
check(powerRoleLevelLimit(8), 180, 'star eight caps at level one hundred eighty');
check(powerRoleLevelCost(0), 100, 'first paid level uses one hundred role experience');
check(powerRoleLevelCost(10), 120, 'role experience cost increases every ten levels');

for (let index = 0; index < 3; index += 1) state = claimPowerRoleFreeLevel(state, 'P01').state;
check(state.roles.P01.level, 3, 'three free upgrades advance the initialized role');
check(claimPowerRoleFreeLevel(state, 'P01').reason, 'limit', 'a fourth free level-up is rejected');

for (let index = 0; index < 3; index += 1) state = claimPowerRoleFreeFragments(state, 'P02').state;
check(state.roles.P02.fragments, 6, 'three free claims grant six fragments');
check(claimPowerRoleFreeFragments(state, 'P02').claimed, false, 'a fourth same-day claim is rejected');
check(activatePowerRole(state, 'P02').activated, false, 'a locked role cannot activate before ten fragments');

const nextDay = new Date(2026, 7, 13, 12, 0, 0);
state = loadPowerRoleState({
    getItem: () => JSON.stringify(state),
    setItem: () => undefined,
}, nextDay);
check(state.roles.P02.freeFragmentTimes, 0, 'daily free-fragment counters reset on the next day');
state = claimPowerRoleFreeFragments(state, 'P02').state;
state = claimPowerRoleFreeFragments(state, 'P02').state;
const recruited = activatePowerRole(state, 'P02');
check(recruited.activated, true, 'ten fragments recruit a locked role');
check(recruited.state.roles.P02.star, 0, 'recruited roles enter at star zero');
check(recruited.state.roles.P02.fragments, 0, 'recruitment spends the exact ten-fragment cost');
check(equipPowerRole(recruited.state, 'P03').equipped, false, 'locked roles cannot be equipped');
const equipped = equipPowerRole(recruited.state, 'P02');
check(equipped.equipped, true, 'recruited roles can be equipped');
check(equipped.state.equippedRoleId, 'P02', 'the equipped role persists in state');

const starReady = structuredClone(equipped.state);
starReady.roles.P02.fragments = 10;
const upgraded = upgradePowerRoleStar(starReady, 'P02');
check(upgraded.upgraded, true, 'owned roles spend the next PowerStarConfig cost to advance');
check(upgraded.state.roles.P02.star, 1, 'star zero advances to star one');

const values = new Map();
const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
};
check(savePowerRoleState(storage, upgraded.state), true, 'role progress persists locally');
check(values.has(POWER_ROLE_STORAGE_KEY), true, 'role progress uses a namespaced key');
check(loadPowerRoleState(storage, nextDay).equippedRoleId, 'P02', 'equipped role reloads from local storage');

console.log(`power role progression: ${assertions} assertions passed`);
