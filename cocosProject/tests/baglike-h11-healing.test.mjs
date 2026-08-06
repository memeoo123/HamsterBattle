import assert from 'node:assert/strict';
import {
    applyH11Heal,
    H11_BEHAVIOR_RADIUS,
    H11_HOME_HEAL_BASIS_POINTS,
    H11_SEARCH_RANGE,
    H11_UNIT_HEAL_BASIS_POINTS,
    resolveH11HealAmount,
    resolveH11HealingAction,
    selectH11HealingTarget,
} from '../assets/scripts/BagLikeHealing.ts';
import { bagLikeProducerProfile } from '../assets/scripts/BagLikeUnitProgression.ts';

let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

check(H11_SEARCH_RANGE, 400, 'H11 keeps the hero search range');
check(H11_BEHAVIOR_RADIUS, 200, 'H11 keeps the target-centered behavior radius');
check(H11_UNIT_HEAL_BASIS_POINTS, 10000, 'H11 heals the friendly unit for 100% attack');
check(H11_HOME_HEAL_BASIS_POINTS, 5000, 'base H11 heals home for 50% attack');

const expected = [
    ['H1101', 1, 63, 31],
    ['H1102', 1.5, 94, 47],
    ['H1103', 2.25, 141, 70],
    ['H1104', 3.375, 212, 106],
];
for (const [gearId, multiple, unitHeal, homeHeal] of expected) {
    const profile = bagLikeProducerProfile(gearId);
    check(profile?.heroId, 'H11', `${gearId} keeps the H11 family`);
    check(profile?.kind, 'wheel', `${gearId} remains a one-shot WHEEL producer`);
    check(profile?.attributeMultiple, multiple, `${gearId} keeps its decoded level multiple`);
    check(profile?.primarySkillId, 'ZL_1101', `${gearId} uses the evidence-default skill`);
    check(resolveH11HealAmount(63 * multiple, 10000), unitHeal, `${gearId} floors unit healing after scaling`);
    check(resolveH11HealAmount(63 * multiple, 5000), homeHeal, `${gearId} floors home healing after scaling`);
}

check(applyH11Heal(80, 100, 63), 100, 'unit healing clamps to maximum HP');
check(applyH11Heal(20, 100, -5), 20, 'negative healing cannot reduce HP');

const units = [
    { uid: 1, hp: 90, maxHp: 100, x: 0, y: 0 },
    { uid: 2, hp: 20, maxHp: 100, x: 100, y: 0 },
    { uid: 3, hp: 10, maxHp: 100, x: 401, y: 0 },
    { uid: 4, hp: 5, maxHp: 100, x: 50, y: 0, dead: true },
];
check(selectH11HealingTarget(0, 0, units, () => 0)?.uid, 2, 'dead and out-of-range units are excluded before lowest-HP selection');
check(selectH11HealingTarget(0, 0, [{ uid: 1, hp: 1, maxHp: 10, x: 400, y: 0 }], () => 0)?.uid, 1, 'the 400 search boundary is inclusive');
check(selectH11HealingTarget(0, 0, [{ uid: 1, hp: 1, maxHp: 10, x: 400.01, y: 0 }], () => 0), null, 'units beyond the search boundary are excluded');

const action = resolveH11HealingAction({
    casterX: 0,
    casterY: 0,
    casterAttack: 94.5,
    friendlyUnits: [{ uid: 7, hp: 30, maxHp: 100, x: 50, y: 0 }],
    homeHp: 470,
    homeMaxHp: 500,
    random: () => 0,
});
check(action.cast, true, 'a live friendly target allows the one-shot skill to cast');
check(action.targetUid, 7, 'the resolved action carries the selected unit');
check(action.requestedUnitHeal, 94, 'the level-2 unit heal floors 94.5');
check(action.unitHpAfter, 100, 'the unit result clamps to max HP');
check(action.requestedHomeHeal, 47, 'the level-2 home heal floors 47.25');
check(action.homeHpAfter, 500, 'home healing clamps to max HP');
check(action.eventOrder, ['unit-heal', 'home-heal'], 'unit healing resolves before home healing');

const noTarget = resolveH11HealingAction({
    casterX: 0,
    casterY: 0,
    casterAttack: 63,
    friendlyUnits: [],
    homeHp: 100,
    homeMaxHp: 500,
});
check(noTarget.cast, false, 'without a friendly main target the skill does not cast');
check(noTarget.homeHpAfter, 100, 'without a cast the home is not healed independently');
check(noTarget.eventOrder, [], 'a rejected cast emits no healing events');

console.log(`baglike H11 healing: ${assertions} assertions passed`);
