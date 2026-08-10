import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    ACTIVE_BACKPACK_BACKGROUND_OFFSET_Y,
    ACTIVE_BACKPACK_HP_OFFSET_Y,
    ACTIVE_BACKPACK_PANEL_OFFSET_Y,
    battlefieldLayoutForPhase,
    DEPLOY_CANDIDATE_Y,
    DEPLOY_GRID_OFFSET_Y,
} from '../assets/scripts/BattlefieldLayout.ts';
import {
    addBagLikeExp,
    CAPTURED_LEVEL_2_TRAITS,
    expTargetForLevel,
    TRAIT_REROLL_MAX,
    TRAIT_TAKE_ALL_MAX,
} from '../assets/scripts/BagLikeProgression.ts';

const data = JSON.parse(readFileSync(new URL('../assets/resources/data/normal-levels.json', import.meta.url), 'utf8'));
const level = data.levels.find((row) => row.id === 1004);

assert.ok(level, 'level 1004 exists in the recovered normal-level table');
assert.equal(level.name, '荒漠沙地');
assert.equal(level.fightscene, 'image/unpack/fightscene/fightscene_03');
assert.equal(level.homeHp, 500);
assert.equal(level.roundIds.length, 15);

const rounds = level.roundIds.map((id) => data.rounds[String(id)]);
assert.ok(rounds.every(Boolean), 'all 15 configured rounds resolve');
assert.deepEqual(rounds[0].monsterIds.slice(0, 5), ['M02', 'M02', 'M07', 'M02', 'M03']);
assert.equal(rounds[4].monsterIds.at(-1), 'Boss03');
assert.equal(rounds[9].monsterIds.at(-1), 'Boss02');
assert.equal(rounds[14].monsterIds.at(-1), 'Boss07');

const deploy = battlefieldLayoutForPhase('deploy');
const battle = battlefieldLayoutForPhase('battle');
const trait = battlefieldLayoutForPhase('trait');
assert.equal(DEPLOY_GRID_OFFSET_Y, 0, 'the preparation backpack uses the matched original y=300 top and y=616 core anchors');
assert.equal(DEPLOY_CANDIDATE_Y, -385, 'full-size candidates sit below the preparation panel');
assert.equal(deploy.showBackpack, true);
assert.equal(deploy.showPreparationControls, true);
assert.equal(battle.showBackpack, true, 'the original backpack remains visible during battle');
assert.equal(battle.showPreparationControls, false);
assert.ok(battle.battleHeight > deploy.battleHeight, 'the battlefield expands when battle starts');
assert.ok(battle.gridOffsetY < deploy.gridOffsetY, 'the backpack moves below the expanded battlefield');
assert.equal(battle.backpackBackgroundOffsetY, ACTIVE_BACKPACK_BACKGROUND_OFFSET_Y);
assert.equal(battle.backpackPanelOffsetY, ACTIVE_BACKPACK_PANEL_OFFSET_Y);
assert.equal(battle.backpackHpOffsetY, ACTIVE_BACKPACK_HP_OFFSET_Y);
assert.deepEqual(
    [battle.backpackBackgroundOffsetY, battle.backpackPanelOffsetY, battle.backpackHpOffsetY],
    [34, 7, 17],
    'battle-only source pivots align the background, panel, and HP bar without moving the matched gear grid',
);
assert.deepEqual(trait, battle, 'trait selection pauses over the active battlefield without collapsing the backpack');

assert.equal(expTargetForLevel(1), 20);
assert.equal(expTargetForLevel(2), 50);
assert.equal(expTargetForLevel(12), 100);
let progress = { level: 1, exp: 0 };
for (let kill = 0; kill < 3; kill += 1) progress = addBagLikeExp(progress, 5);
assert.deepEqual(progress, { level: 1, exp: 15, leveledUp: false });
progress = addBagLikeExp(progress, 5);
assert.deepEqual(progress, { level: 2, exp: 0, leveledUp: true });
assert.deepEqual(
    addBagLikeExp({ level: 1, exp: 15 }, 5, 1.5),
    { level: 2, exp: 2.5, leveledUp: true },
    'EXP_GAIN multiplies the incoming notification before the original one-level transition and old-threshold remainder',
);
assert.deepEqual(CAPTURED_LEVEL_2_TRAITS, [
    'RG_ALL_abl13_eff01',
    'RG_H02_abl02_eff01',
    'RG_H03_abl02_eff01',
]);
assert.equal(TRAIT_REROLL_MAX, 10);
assert.equal(TRAIT_TAKE_ALL_MAX, 3);

console.log('battlefield scenario: 32 assertions passed');
