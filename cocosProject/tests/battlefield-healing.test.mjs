import assert from 'node:assert/strict';
import {
    advancePeriodicAttackHeal,
    H04_PERIODIC_HEAL_INTERVAL_SECONDS,
    H11_BASE_ATTACK,
    H11_BASE_SKILL_ID,
    H11_GEAR_SHAPE,
    H11_HOME_HEAL_RATIO,
    H11_POWER_PER_TRIGGER,
    H11_TARGET_RADIUS,
    H11_UNIT_HEAL_RATIO,
    applyShieldedDamage,
    h11HealAmount,
    periodicAttackHealAmount,
    replaceH11Skill,
    resolveH11HealingProfileForSkill,
    resolveH11Healing,
} from '../assets/scripts/BattlefieldHealing.ts';

let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

check(H04_PERIODIC_HEAL_INTERVAL_SECONDS, 1, 'H04 periodic passivity uses the decoded one-second interval');
check(periodicAttackHealAmount(51, 200), 1, '4001_bh1 heals floor(51 attack * 2%) rather than max HP');
check(periodicAttackHealAmount(51, 500), 2, '4001_bh2 heals floor(51 attack * 5%)');
check(periodicAttackHealAmount(0, 500), 0, 'zero attack produces zero periodic healing');
check(periodicAttackHealAmount(99, 500, 1000), 5, 'HL_INC is applied before the periodic-heal floor');
check(
    advancePeriodicAttackHeal({ hp: 50, maxHp: 100, attack: 51, ratio: 200, timer: 1, elapsed: 1 }),
    { hp: 51, timer: 1, ticks: 1, rawAmount: 1, appliedAmount: 1 },
    'the first H04 passive heal fires after one complete interval',
);
check(
    advancePeriodicAttackHeal({ hp: 50, maxHp: 100, attack: 51, ratio: 500, timer: 1, elapsed: 0 }),
    { hp: 50, timer: 1, ticks: 0, rawAmount: 2, appliedAmount: 0 },
    'H04 does not heal immediately when its passive is initialized',
);
check(
    advancePeriodicAttackHeal({ hp: 99, maxHp: 100, attack: 51, ratio: 500, timer: 1, elapsed: 1 }),
    { hp: 100, timer: 1, ticks: 1, rawAmount: 2, appliedAmount: 1 },
    'periodic attack healing clamps at current max HP',
);
check(
    advancePeriodicAttackHeal({ hp: 50, maxHp: 100, attack: 51, ratio: 500, timer: 1, elapsed: 2.5 }),
    { hp: 54, timer: 0.5, ticks: 2, rawAmount: 2, appliedAmount: 4 },
    'a delayed simulation step catches up each elapsed one-second passive tick',
);

check(H11_BASE_ATTACK, 63, 'H11 keeps the recovered level-1 attack');
check(H11_BASE_SKILL_ID, 'ZL_1101', 'H11 starts with the recovered base healing skill');
check(H11_POWER_PER_TRIGGER, 9, 'H11 adds nine worker points per power contact');
check(H11_GEAR_SHAPE, [[0, 0], [1, 0]], 'shape 3 is the recovered vertical two-cell footprint');
check(H11_TARGET_RADIUS, 200, 'B_ZL_1101 uses a 200-unit target circle');
check(H11_UNIT_HEAL_RATIO, 10000, 'B_ZL_1101 heals at 100% attack');
check(H11_HOME_HEAL_RATIO, 5000, 'B_ZL_1102 repairs the home at 50% attack');
check(h11HealAmount(63, 10000), 63, 'level-1 unit healing floors the attack-scaled formula');
check(h11HealAmount(63, 5000), 31, 'level-1 home healing floors 31.5 to 31');
check(h11HealAmount(63 * 1.5, 10000), 94, 'level-2 gear multiplier is applied before flooring');
check(h11HealAmount(63, 10000, 1500), 72, 'HL_INC adds 15% before the final floor');
check(
    resolveH11HealingProfileForSkill(H11_BASE_SKILL_ID),
    { skillId: 'ZL_1101', unitHealRatio: 10000, homeHealRatio: 5000 },
    'ZL_1101 pairs full unit healing with half-attack home repair',
);
check(replaceH11Skill('ZL_1101', 'RG_H11_abl01_eff02'), 'ZL_1103', 'the star-5 trait replaces the shared ZL_1101 group');
check(
    resolveH11HealingProfileForSkill('ZL_1103'),
    { skillId: 'ZL_1103', unitHealRatio: 10000, homeHealRatio: 10000 },
    'ZL_1103 preserves unit healing and raises only home repair to full attack',
);

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
check(basePlan?.unitHeals, [{ id: 'low-percent', rawAmount: 63, appliedAmount: 63, shieldAmount: 0 }], 'base behavior heals one friendly unit without inventing a shield');
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

const upgradedPlan = resolveH11Healing({
    attack: 63,
    allies: [{ id: 'valid-cast-target', hp: 50, maxHp: 100, x: 0, y: 0 }],
    homeHp: 400,
    homeMaxHp: 500,
    ...resolveH11HealingProfileForSkill('ZL_1103'),
    random: () => 0,
});
check(upgradedPlan?.unitHeals[0].rawAmount, 63, 'the replacement leaves friendly-unit healing at full attack');
check(upgradedPlan?.homeRawAmount, 63, 'the replacement raises raw home repair from 31 to 63');
check(upgradedPlan?.homeAppliedAmount, 63, 'the upgraded repair still applies through the normal home-HP clamp');

const shieldPlan = resolveH11Healing({
    attack: 63,
    allies: [{ id: 'damaged', hp: 80, maxHp: 100, x: 0, y: 0 }],
    homeHp: 480,
    homeMaxHp: 500,
    healToShield: true,
    random: () => 0,
});
check(
    shieldPlan?.unitHeals[0],
    { id: 'damaged', rawAmount: 63, appliedAmount: 20, shieldAmount: 43 },
    'HEAL_TO_SHIELD converts only the unit-heal overflow after filling missing HP',
);
check(shieldPlan?.homeAppliedAmount, 20, 'HomeUnit keeps its override and only applies normal clamped home repair');

const fullShieldPlan = resolveH11Healing({
    attack: 63,
    allies: [{ id: 'full', hp: 100, maxHp: 100, x: 0, y: 0 }],
    homeHp: 500,
    homeMaxHp: 500,
    healToShield: true,
    random: () => 0,
});
check(fullShieldPlan?.unitHeals[0].shieldAmount, 63, 'a full-health allied unit converts the complete H11 heal into shield');
check(fullAllyPlan?.unitHeals[0].shieldAmount, 0, 'without the feature, full-health unit healing remains discarded');

check(
    applyShieldedDamage(100, 40, 25),
    { hp: 100, shield: 15, hpDamage: 0, shieldDamage: 25 },
    'shield absorbs smaller damage before HP',
);
check(
    applyShieldedDamage(100, 40, 40),
    { hp: 100, shield: 0, hpDamage: 0, shieldDamage: 40 },
    'exact shield exhaustion leaves HP unchanged',
);
check(
    applyShieldedDamage(100, 40, 60),
    { hp: 80, shield: 0, hpDamage: 20, shieldDamage: 40 },
    'damage beyond shield spills into HP',
);

console.log(`battlefield healing: ${assertions} assertions passed`);
