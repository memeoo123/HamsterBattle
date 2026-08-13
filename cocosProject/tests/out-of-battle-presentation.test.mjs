import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
assert.equal(
    createHash('sha256').update(readFileSync(new URL('../assets/resources/original/main.png', import.meta.url))).digest('hex'),
    'a7a2d3a6eeb432673fd2537aa1c617762437c8301157049b2d8240d1ec5adcbc',
    'main navigation uses the recovered original atlas binary',
);

const navigation = source.slice(
    source.indexOf('private buildMainBottomNavigation'),
    source.indexOf('private createOutOfBattleScene'),
);
assert.match(navigation, /unlocked[\s\S]*?showOutOfBattleLockedNotice/,
    'locked tabs route to an explicit player-facing unlock notice');
assert.match(navigation, /unlocked \? tab\.name : `锁 · \$\{tab\.name\}`/,
    'locked tabs expose a visible lock marker');
assert.match(navigation, /original\/main\/spriteFrame[\s\S]*?MAIN_TAB_ICON_FRAMES\[tab\.name\]/,
    'bottom navigation uses the recovered original main atlas instead of text glyph placeholders');
assert.match(source, /new Color\(255, 254, 254, 255\)/,
    'header value color matches MainPageKv normalFontColor #FFFEFE');
assert.match(source, /new Color\(255, 227, 41, 255\)/,
    'header add-button color matches MainPageKv progressColor #FFE329');
assert.match(navigation, /interactable = !selected;/,
    'locked tabs stay clickable so they cannot feel broken');
assert.match(navigation, /通关第 \$\{chapter\} 关后开放/,
    'the notice tells the player the exact unlock chapter');

const visibleCopy = source
    .slice(source.indexOf('private showSettingsScene'), source.indexOf('private showLevelSelection'))
    .replace(/`[^`]*`/g, (text) => text);
for (const developerCopy of [
    'ShopConfig',
    'ShopGoodsConfig',
    'GameplayConfig',
    'HeroStarConfig',
    'PowerAbilityConfig',
    'EndlessModeConfig',
    'TrunkInstanceRoundConfig',
    '状态待同步',
    '奖励池待恢复',
    '当前为配置预览',
]) {
    assert.doesNotMatch(visibleCopy, new RegExp(developerCopy), `player UI must not expose ${developerCopy}`);
}
assert.doesNotMatch(visibleCopy, /ShopGoodId_/, 'shop cards do not create a visible internal-ID label');
assert.doesNotMatch(visibleCopy, /\$\{role\.fragmentId\}/, 'role cards do not print internal fragment IDs');
assert.match(source, /MockAdvertisementTitle'[\s\S]*?'激励视频'/,
    'the local advertisement adapter presents itself as the in-game rewarded-video surface');
assert.doesNotMatch(source, /'本地模拟广告'|'MOCK · 不请求网络|'正在播放测试广告/,
    'mock implementation details stay out of player-visible copy');
assert.doesNotMatch(source, /head atlas failed.*invalid node/,
    'an intentionally destroyed asynchronous portrait target is not logged as an asset failure');
assert.doesNotMatch(source, /enemy asset failed.*invalid node/,
    'an intentionally destroyed asynchronous gallery target is not logged as an asset failure');
assert.match(source, /newlyUnlockedBagLikeFusions\(previousStars, this\.accountProfile\.stars\)/,
    'cultivation reports when a hero-star upgrade unlocks a recovered fusion recipe');
assert.match(source, /已解锁融合：/, 'the fusion unlock message is player-facing');

console.log('out-of-battle presentation: 27 assertions passed');
