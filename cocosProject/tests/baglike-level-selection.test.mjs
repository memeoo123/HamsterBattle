import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    BAGLIKE_FIRST_LEVEL_ID,
    BAGLIKE_LAST_LEVEL_ID,
    BAGLIKE_LEVEL_COUNT,
    BAGLIKE_LEVELS_PER_PAGE,
    bagLikeLatestUnlockedLevel,
    bagLikeLevelFromSearch,
    bagLikeLevelIdsForPage,
    bagLikeLevelNumber,
    bagLikeLevelPageCount,
    bagLikeLevelPageForId,
    bagLikeLevelPassed,
    bagLikeLevelUnlocked,
} from '../assets/scripts/BagLikeLevelSelection.ts';

let assertions = 0;
const check = (actual, expected, message) => {
    assert.deepEqual(actual, expected, message);
    assertions += 1;
};

check(BAGLIKE_FIRST_LEVEL_ID, 1001, 'the recovered trunk-instance range starts at 1001');
check(BAGLIKE_LAST_LEVEL_ID, 1200, 'the recovered trunk-instance range ends at 1200');
check(BAGLIKE_LEVEL_COUNT, 200, 'the selector covers all two hundred recovered levels');
check(BAGLIKE_LEVELS_PER_PAGE, 20, 'the runtime selector uses twenty levels per page');
check(bagLikeLevelUnlocked(1000, 1001), true, 'the first level is always unlocked');
check(bagLikeLevelUnlocked(1000, 1002), false, 'a fresh account cannot skip the second level');
check(bagLikeLevelUnlocked(1001, 1002), true, 'clearing a level unlocks exactly the next level');
check(bagLikeLevelUnlocked(1001, 1003), false, 'levels beyond maxPass plus one remain locked');
check(bagLikeLevelUnlocked(1199, 1200), true, 'the final level unlocks after 1199');
check(bagLikeLevelUnlocked(1200, 1201), false, 'ids outside the recovered range remain unavailable');
check(bagLikeLevelPassed(1004, 1004), true, 'the max passed level is marked complete');
check(bagLikeLevelPassed(1004, 1005), false, 'the next unlocked level is not yet passed');
check(bagLikeLatestUnlockedLevel(1000), 1001, 'fresh progression points at level one');
check(bagLikeLatestUnlockedLevel(1004), 1005, 'latest unlocked follows maxPass');
check(bagLikeLatestUnlockedLevel(1200), 1200, 'latest unlocked clamps at the final level');
check(bagLikeLevelNumber(1001), 1, 'display numbering starts at one');
check(bagLikeLevelNumber(1200), 200, 'display numbering ends at two hundred');
check(bagLikeLevelPageCount(), 10, 'two hundred levels occupy ten pages');
check(bagLikeLevelPageForId(1001), 0, 'level 1001 is on the first page');
check(bagLikeLevelPageForId(1020), 0, 'page boundaries include their twentieth level');
check(bagLikeLevelPageForId(1021), 1, 'the twenty-first level begins page two');
check(bagLikeLevelPageForId(1200), 9, 'level 1200 is on the tenth page');
check(bagLikeLevelIdsForPage(0)[0], 1001, 'first page begins at 1001');
check(bagLikeLevelIdsForPage(0).at(-1), 1020, 'first page ends at 1020');
check(bagLikeLevelIdsForPage(9)[0], 1181, 'final page begins at 1181');
check(bagLikeLevelIdsForPage(9).at(-1), 1200, 'final page ends at 1200');
const allPages = Array.from({ length: bagLikeLevelPageCount() }, (_, page) => bagLikeLevelIdsForPage(page)).flat();
check(allPages.length, 200, 'all selector pages expose exactly two hundred ids');
check(new Set(allPages).size, 200, 'selector pages never duplicate a level');
check(allPages.every((levelId, index) => levelId === 1001 + index), true, 'selector ids remain contiguous');
check(bagLikeLevelFromSearch('?level=1001'), 1001, 'URL selection accepts the first level');
check(bagLikeLevelFromSearch('?accountDebug=1&level=1200&build=x'), 1200, 'URL selection works among other flags');
check(bagLikeLevelFromSearch('?level=1000'), null, 'URL selection rejects ids below the recovered range');
check(bagLikeLevelFromSearch('?level=1201'), null, 'URL selection rejects ids above the recovered range');
check(bagLikeLevelFromSearch('?level=abc'), null, 'URL selection rejects non-numeric ids');

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
assert.match(source, /bagLikeLevelFromSearch[\s\S]*this\.levelId = requestedLevel/, 'the web query selects the recovered level before data loading');
assert.match(source, /bagLikeLevelUnlocked\(this\.accountProfile\.maxPassedLevelId, this\.levelId\)/, 'runtime entry rejects locked levels');
assert.match(source, /buildLevelSelectionPanel\(\)/, 'the preparation scene builds a level-selection panel');
assert.match(source, /completeBagLikeAccountLevel[\s\S]*resultNextButtonLabel/, 'victory progression exposes the next-level action');
assertions += 4;

console.log(`baglike level selection: ${assertions} assertions passed`);
