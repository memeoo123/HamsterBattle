import assert from 'node:assert/strict';
import {
    H11_BASE_ATTACK,
    H11_GEAR_SHAPE,
    H11_HOME_HEAL_RATIO,
    H11_POWER_PER_TRIGGER,
    H11_TARGET_RADIUS,
    H11_UNIT_HEAL_RATIO,
    h11HealAmount,
    resolveH11Healing,
} from '../assets/scripts/BattlefieldHealing.ts';

let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

check(H11_BASE_ATTACK, 63, 'H11 keeps the recovered level-1 attack');
check(H11_POWER_PER_TRIGGER, 9, 'H11 adds nine worker points per power contact');
check(H11_GEAR_SHAPE, [[0, 0], [1, 0]], 'shape 3 is the recovered vertical two-cell footprint');
check(H11_TARGET_RADIUS, 200, 'B_ZL_1101 uses a 200-unit target circle');
check(H11_UNIT_HEAL_RATIO, 10000, 'B_ZL_1101 heals at 100% attack');
check(H11_HOME_HEAL_RATIO, 5000, 'B_ZL_1102 repairs the home at 50% attack');
check(h11HealAmount(63, 10000), 63, 'level-1 unit healing floors the attack-scaled formula');
check(h11HealAmount(63, 5000), 31, 'level-1 home healing floors 31.5 to 31');
check(h11HealAmount(63 * 1.5, 10000), 94, 'level-2 gear multiplier is applied before flooring');
check(h11HealAmount(63, 10000, 1500), 72, 'HL_INC adds 15% before the final floor');

const allies = [
    { id: 'low-raw', hp: 20, maxHp: 50, x: 150, y: 0 },
    { id: 'low-percent', hp: 30, maxHp: 100, x: 0, y: 0 },
    { id: 'nearby', hp: 80, maxHp: 100, x: 200, y: 0 },
    { id: 'outside', hp: 90, maxHp: 100, x: 201, y: 0 },
];
const basePlan = resolveH11Healing({
    attack: 63,
    allies,
    homeHp: 480,
    homeMaxHp: 500,
    random: () => 0,
});
check(basePlan?.primaryTargetId, 'low-percent', 'cast target uses lowest HP percentage rather than lowest raw HP');
check(basePlan?.unitHeals, [{ id: 'low-percent', rawAmount: 63, appliedAmount: 63 }], 'base behavior heals one friendly unit');
check(basePlan?.homeRawAmount, 31, 'the same successful cast emits the recovered home repair');
check(basePlan?.homeAppliedAmount, 20, 'home repair clamps to maximum HP');

const multiPlan = resolveH11Healing({
    attack: 63,
    allies,
    homeHp: 500,
    homeMaxHp: 500,
    maxUnitTargets: 3,
    random: () => 0,
});
check(multiPlan?.unitHeals.map((entry) => entry.id), ['low-percent', 'low-raw', 'nearby'], 'target-circle boundary is inclusive and excludes the unit at 201');
check(multiPlan?.homeAppliedAmount, 0, 'a full home receives no effective repair');

check(resolveH11Healing({
    attack: 63,
    allies: [{ id: 'dead', hp: 0, maxHp: 100, x: 0, y: 0 }],
    homeHp: 100,
    homeMaxHp: 500,
}), null, 'without a living friendly cast target H11 does not repair the home');

const fullAllyPlan = resolveH11Healing({
    attack: 63,
    allies: [{ id: 'full', hp: 100, maxHp: 100, x: 0, y: 0 }],
    homeHp: 100,
    homeMaxHp: 500,
    random: () => 0,
});
check(fullAllyPlan?.unitHeals[0].appliedAmount, 0, 'a full-health ally remains a valid skill target');
check(fullAllyPlan?.homeAppliedAmount, 31, 'a full-health ally still permits the paired home repair behavior');

console.log(`battlefield healing: ${assertions} assertions passed`);
