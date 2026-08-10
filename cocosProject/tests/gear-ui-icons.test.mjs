import assert from 'node:assert/strict';
import fs from 'node:fs';
import { bagLikeProducerProfile } from '../assets/scripts/BagLikeUnitProgression.ts';

const source = fs.readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
const itemConfig = JSON.parse(fs.readFileSync(
    new URL('../../reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeItemConfig.json', import.meta.url),
    'utf8',
).replace(/^\uFEFF/, ''));
const frameBlock = /const HERO_SMALL_HEAD_FRAMES[^=]*= \{([\s\S]*?)\n\};/.exec(source)?.[1];
assert.ok(frameBlock, 'heroSmallHead frame catalog is readable');
const frameIds = new Set([...frameBlock.matchAll(/^\s+(\w+): \{/gm)].map((match) => match[1]));

const ordinaryFamilies = [
    'H01', 'H02', 'H03', 'H04', 'H05', 'H06',
    'H11', 'H12', 'H13', 'H14', 'H16', 'H17',
];
const producerIds = ordinaryFamilies.flatMap((family) => [1, 2, 3, 4].map((level) => `${family}0${level}`));
producerIds.push('H0705', 'H0805', 'H0905', 'H1005', 'H1505', 'H1805');

for (const gearId of producerIds) {
    const profile = bagLikeProducerProfile(gearId);
    assert.ok(profile, `${gearId} has a producer profile`);
    assert.ok(frameIds.has(profile.headId), `${gearId} resolves configured head ${profile.headId} to a recovered frame`);
}

assert.match(source, /const profile = bagLikeProducerProfile\(id\);/, 'gear rendering consumes the producer profile source of truth');
assert.match(source, /HERO_SMALL_HEAD_FRAMES\[profile\.headId\]/, 'gear rendering validates the configured head frame');
assert.ok(frameIds.has('coin'), 'coin gear portrait is recovered');
assert.ok(frameIds.has('P01'), 'power core portrait is recovered');
assert.match(source, /gear\.id\.startsWith\('G'\) \? '格' : '★'/, 'grid expansion pieces use their explicit non-portrait marker');
assert.match(source, /sprite\?\.spriteFrame\?\.texture \? 'loaded' : portrait \? 'pending' : 'missing'/, 'browser observability distinguishes loaded portraits from empty nodes');

const configuredHeroIds = itemConfig.rows.filter((row) => row.type === 'HERO').map((row) => row.id);
const unresolvedConfiguredIds = configuredHeroIds.filter((gearId) => !producerIds.includes(gearId));
assert.deepEqual(
    unresolvedConfiguredIds,
    [],
    'every configured hero gear resolves through the restored portrait/runtime catalog',
);

console.log(`gear UI icons: ${producerIds.length}/${configuredHeroIds.length} hero gear configurations resolve`);
