import assert from 'node:assert/strict';
import {
    CANDIDATE_VALIDATION_LEVEL_IDS,
    PLAYABLE_LEVEL_IDS,
    directBootLevelId,
    directBattleBypassesProgression,
    enterNormalLevel,
    isCandidateValidationLevelId,
    isPlayableLevelId,
    latestMainLevelId,
    NORMAL_LEVEL_ENERGY_COST,
    playableLevelCards,
} from '../assets/scripts/MainLevelFlow.ts';

const fixtureLevels = [
    {
        id: 1004,
        chapter: 4,
        name: '荒漠沙地',
        fightscene: 'image/unpack/fightscene/fightscene_03',
        roundIds: Array.from({ length: 15 }, (_, index) => 100401 + index),
        recommendHeroIds: ['H03', 'H12'],
    },
    {
        id: 1001,
        chapter: 1,
        name: '宁静森林',
        fightscene: 'image/unpack/fightscene/fightscene_01',
        roundIds: [100101, 100102, 100103, 100104, 100105],
        recommendHeroIds: ['H01', 'H02'],
    },
    {
        id: 1002,
        chapter: 2,
        name: '密林深处',
        fightscene: 'image/unpack/fightscene/fightscene_01',
        roundIds: [100201],
    },
];
const levels = Array.from({ length: 200 }, (_, index) => {
    const id = 1001 + index;
    return fixtureLevels.find((level) => level.id === id) || {
        id,
        chapter: index + 1,
        name: `关卡 ${id}`,
        fightscene: 'image/unpack/fightscene/fightscene_01',
        roundIds: [id * 100 + 1],
    };
});

assert.equal(PLAYABLE_LEVEL_IDS.length, 200, 'all recovered levels are exposed for mechanics-first play');
assert.deepEqual(PLAYABLE_LEVEL_IDS.slice(0, 4), [1001, 1002, 1003, 1004], 'playable IDs follow progression order');
assert.deepEqual(CANDIDATE_VALIDATION_LEVEL_IDS, [1002, 1003], 'candidate validation stays separate from playable levels');
assert.equal(isPlayableLevelId(1001), true, '1001 is playable');
assert.equal(isPlayableLevelId(1004), true, '1004 is playable');
assert.equal(isPlayableLevelId(1002), true, 'a recovered data-driven level is available');
assert.equal(isCandidateValidationLevelId(1002), true, '1002 remains addressable by the legacy validation route');
assert.equal(isCandidateValidationLevelId(1003), true, '1003 is available only to the validation route');
assert.equal(isCandidateValidationLevelId(1004), false, 'a playable level is not duplicated as a candidate');

const cards = playableLevelCards(levels);
assert.equal(cards.length, 200, 'two hundred playable cards are built');
assert.deepEqual(cards.slice(0, 4).map((card) => card.id), [1001, 1002, 1003, 1004], 'cards keep recovered progression order');
assert.equal(cards[0].name, '宁静森林', '1001 name comes from recovered data');
assert.equal(cards[0].chapter, 1, '1001 chapter comes from recovered data');
assert.equal(cards[0].background, 'fightscene_01', '1001 background resource is normalized');
assert.equal(cards[0].roundCount, 5, '1001 exposes five recovered waves');
assert.deepEqual(cards[0].recommendedHeroes, ['H01', 'H02'], '1001 recommendations are preserved');
assert.equal(cards[0].badge, '机制基准', '1001 is marked as the mechanic baseline');
assert.equal(cards[3].background, 'fightscene_03', '1004 background resource is normalized');
assert.equal(cards[3].roundCount, 15, '1004 exposes fifteen recovered waves');
assert.equal(cards[3].badge, '视觉基准', '1004 is marked as the visual baseline');

assert.equal(directBootLevelId('', 1004), null, 'normal launch opens the main scene');
assert.equal(directBootLevelId('?directBattle=1', 1004), 1004, 'direct launch uses the fallback level');
assert.equal(directBootLevelId('?directBattle=1&level=1001', 1004), 1001, 'direct launch accepts a playable level');
assert.equal(directBootLevelId('?directBattle=1&level=1002', 1004), 1002, 'direct launch accepts any recovered level');
assert.equal(directBootLevelId('?candidateBattle=1&level=1002', 1004), 1002, 'candidate route admits 1002');
assert.equal(directBootLevelId('?candidateBattle=1&level=1003', 1004), 1003, 'candidate route admits 1003');
assert.equal(directBootLevelId('?candidateBattle=1&level=1034', 1004), 1034, 'candidate route also accepts a now-playable level');
assert.equal(directBootLevelId('?developedValidation=trait', 1004), 1004, 'developed validation bypasses the menu');
assert.equal(directBootLevelId('?traitValidation=1&level=1001', 1004), 1001, 'trait validation can target a playable level');
assert.equal(directBootLevelId('?fusionValidation=battle', 9999), 1001, 'invalid fallback resolves to the first playable level');

const profile = {
    schemaVersion: 4,
    stars: { H01: 1, H02: 1, H03: 0, H04: 1, H05: 0, H06: 0, H11: 0, H12: 1, H13: 0, H14: 0, H16: 0, H17: 0 },
    challengeTimesByLevel: {}, gold: 0, energy: 9, diamonds: 0,
    fragments: { H01: 0, H02: 0, H03: 0, H04: 0, H05: 0, H06: 0, H11: 0, H12: 0, H13: 0, H14: 0, H16: 0, H17: 0 },
    maxPassedLevelId: 1001,
};
assert.equal(NORMAL_LEVEL_ENERGY_COST, 5, 'TrunkInstanceConfig charges five energy');
assert.equal(latestMainLevelId(profile.maxPassedLevelId), 1002, 'main scene follows the latest unlocked level');
assert.equal(enterNormalLevel(profile, 1003).reason, 'locked', 'future levels cannot bypass progression');
const entered = enterNormalLevel(profile, 1002);
assert.equal(entered.entered, true, 'the next level can be entered');
assert.equal(entered.profile.energy, 4, 'normal entry deducts five energy');
assert.equal(profile.energy, 9, 'entry does not mutate the input profile');
assert.equal(enterNormalLevel({ ...profile, energy: 4 }, 1002).reason, 'energy', 'insufficient energy blocks entry');
assert.equal(enterNormalLevel(profile, 1200, true).entered, true, 'explicit validation may bypass progression');
assert.equal(directBattleBypassesProgression('?directBattle=1&level=1200'), true, 'direct evidence route bypasses account cost');
assert.equal(directBattleBypassesProgression('?level=1200'), false, 'plain level query is not a bypass');

assert.throws(
    () => playableLevelCards(levels.filter((level) => level.id !== 1200)),
    /已恢复关卡 1200 不存在于关卡表/,
    'missing recovered rows fail instead of creating guessed cards',
);

console.log('main level flow assertions passed');
