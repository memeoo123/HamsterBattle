import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');

const navigation = source.slice(
    source.indexOf('private buildMainBottomNavigation'),
    source.indexOf('private createOutOfBattleScene'),
);
assert.match(navigation, /unlocked[\s\S]*?showOutOfBattleLockedNotice/,
    'locked tabs route to an explicit player-facing unlock notice');
assert.match(navigation, /\$\{unlocked \? tabGlyphs\[tab\.name\] : '锁'\}/,
    'locked tabs expose a visible lock marker');
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

console.log('out-of-battle presentation: 21 assertions passed');
