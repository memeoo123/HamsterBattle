import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createPowerRoleState } from '../assets/scripts/PowerRoleProgression.ts';
import {
    addPowerRoleEnergy,
    p01StartRewardGearLevel,
    p03ActiveHealBasisPoints,
    p04DamageBasisPointsAtHit,
    p04KillProductivityBasisPoints,
    p04KillProductivityCap,
    powerRoleActiveBasisPoints,
    powerRoleGlobalAttackBasisPoints,
    powerRoleRoundStartProductivityBasisPoints,
} from '../assets/scripts/PowerRoleBattle.ts';

const state = createPowerRoleState(new Date(2026, 7, 12));
assert.equal(powerRoleRoundStartProductivityBasisPoints(state, 1), 1000);
assert.equal(p01StartRewardGearLevel(state), 0);
state.roles.P01.star = 7;
assert.equal(powerRoleRoundStartProductivityBasisPoints(state, 1), 2000);
assert.equal(p01StartRewardGearLevel(state), 2);
state.roles.P02.star = 5;
state.equippedRoleId = 'P02';
assert.equal(powerRoleRoundStartProductivityBasisPoints(state, 12), 1000);
assert.equal(powerRoleActiveBasisPoints(state), 4000);
state.roles.P02.star = 8;
assert.equal(powerRoleGlobalAttackBasisPoints(state), 16000);
state.roles.P03.star = 5;
state.equippedRoleId = 'P03';
assert.equal(powerRoleActiveBasisPoints(state), 2000);
assert.equal(p03ActiveHealBasisPoints(state), 5000);
assert.equal(addPowerRoleEnergy(490, 30), 500);
state.roles.P04.star = 5;
state.roles.P04.level = 35;
state.equippedRoleId = 'P04';
assert.equal(powerRoleGlobalAttackBasisPoints(state), 22500);
assert.equal(p04DamageBasisPointsAtHit(state, 0), 9000);
assert.equal(p04DamageBasisPointsAtHit(state, 9), 900);
assert.equal(p04KillProductivityCap(state), 20);
assert.equal(p04KillProductivityBasisPoints(state, 26), 2000);
const gameSource = fs.readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
assert.match(gameSource, /private powerRoleSkillTotalAttack\(\)/);
assert.match(gameSource, /\.sort\(\(left, right\) => left\.x - right\.x\)\s*\.slice\(0, P04_MAX_HITS\)/);
assert.match(gameSource, /resources\.load\('original\/feibiao\/feibiao\/spriteFrame'/);
assert.match(gameSource, /rect: new Rect\(1, 1, 288, 290\)/);
assert.match(gameSource, /const travelSeconds = \(toX - fromX\) \/ 1000/);
assert.match(gameSource, /angularSpeedDegrees: 3 \* 180 \/ Math\.PI/);
assert.match(gameSource, /P02: \{ x: 175, y: 1035, width: 76, height: 76/);
assert.match(gameSource, /P03: \{ x: 87, y: 1269, width: 84, height: 70/);
assert.match(gameSource, /P04: \{ x: 85, y: 409, width: 84, height: 78/);
assert.match(gameSource, /const portraitX = layout\.portrait\.x - layout\.item\.width \/ 2/);
assert.match(gameSource, /const portraitY = layout\.item\.height \/ 2 - layout\.portrait\.y/);
assert.match(gameSource, /this\.attachPowerRolePortrait\(card, role\.id, portraitX, portraitY\)/);
assert.match(gameSource, /this\.attachPowerCoreRoleModel\(hamster, this\.powerRoleState\.equippedRoleId\)/);
assert.match(gameSource, /RecoveredPowerCoreRoleModel_\$\{roleId\}`?, parent, 1, -10, 80, 80/);
assert.doesNotMatch(gameSource, /strongest live friendly|reduce\(\(maximum, unit\) => Math\.max\(maximum, this\.effectiveAttack/);
assert.match(gameSource, /p01StartRewardGearLevel\(this\.powerRoleState\)/);
console.log('power role battle: 32 assertions passed');
