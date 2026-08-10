import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');

assert.match(source, /this\.normalRefreshTimes = 1;\s*this\.addDevelopedGridReward\(\);/, 'developed fixture exposes the evidenced paid-refresh and grid-reward state');
assert.match(source, /DevelopedGridReward', this\.prepareLayer, -298, -283, 104, 132/, 'grid reward uses the normalized reference anchor');
assert.match(source, /GridRewardTicket/, 'grid reward includes the recovered ad-ticket art');
assert.match(source, /GridRewardCount[\s\S]{0,100}'×3'/, 'grid reward shows the evidenced three-grid quantity');
assert.match(source, /GridRewardTitle[\s\S]{0,100}'获取格子'/, 'grid reward uses the source label');
assert.match(source, /AdRefreshTicket/, 'ad refresh uses recovered ticket art');
assert.match(source, /AdRefreshHint[\s\S]{0,140}'必出高级齿轮'/, 'ad refresh shows the original quality hint');
assert.match(source, /RefreshCostCoin/, 'paid refresh uses recovered coin art');
assert.match(source, /this\.refreshCostNode\.active = this\.normalRefreshTimes > 0;/, 'refresh cost is hidden for the first free refresh');
assert.match(source, /this\.refreshLabel\.string = '刷新';/, 'normal refresh keeps the original main label');
assert.match(source, /this\.adRefreshLabel\.string = '刷新';/, 'ad refresh keeps the original main label');
assert.match(source, /\? '开战'/, 'deploy action uses the original short label');
assert.match(source, /headKey === 'coin'[\s\S]{0,80}setScale\(0\.68, 0\.68, 1\)/, 'coin portrait is scaled to the evidenced inset size');
assert.doesNotMatch(source, /makeButton\('BattleHome'/, 'reconstruction-only home button no longer covers the recovered currency HUD');
assert.match(source, /this\.phase === 'battle' && gear\.location === 'grid'/, 'worker progress bars stay hidden in preparation and candidates');

console.log('preparation presentation: 15 assertions passed');
