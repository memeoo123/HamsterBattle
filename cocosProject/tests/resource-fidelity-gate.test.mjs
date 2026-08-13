import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const game = readFileSync(resolve(root, 'assets/scripts/CangshuGame.ts'), 'utf8');
assert.doesNotMatch(
  game,
  /\bsatisfies\b/,
  'Creator 3.8.8 project scripts avoid unsupported TypeScript satisfies syntax',
);
assert.match(game, /canvas\.dataset\.visualCatalogLoaded/, 'enemy catalog exposes completed Spine loads to browser validation');
assert.match(game, /canvas\.dataset\.visualCatalogFailed/, 'enemy catalog exposes failed Spine loads to browser validation');
assert.match(game, /canvas\.dataset\.unitFallbacks/, 'live battles expose units still displaying fallback graphics');
assert.match(game, /syncVisualCatalogContractState/, 'enemy catalog synchronizes resource evidence without requiring account initialization');
const roster = readFileSync(resolve(root, 'assets/scripts/VisualRoster.ts'), 'utf8');

const backgrounds = {
    fightscene_02: 'b74b0e0e9ecc57c5aaa0002c797236fc79c216aa50d4a6be727406f04d66c679',
    fightscene_04: '74b929f83873b8627fef00495c13bdcce1173d36c642231d2a44f6824b7e429d',
};
for (const [name, expectedHash] of Object.entries(backgrounds)) {
    const path = resolve(root, `assets/resources/original/${name}.jpg`);
    assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash,
        `${name} keeps the exact resources3 binary`);
    assert.ok(existsSync(`${path}.meta`), `${name} has import metadata`);
}
assert.match(game, /resources\.load\(`original\/\$\{this\.levelBackground\}\/spriteFrame`/,
    'battle scenes load their configured exact background');
assert.match(game, /resources\.load\(`original\/\$\{resourceName\}\/spriteFrame`/,
    'out-of-battle scenes load their configured exact background');
assert.doesNotMatch(game, /const resolvedBackground|const resolvedResource/,
    'the former forest fallback is removed');

const rosterBlock = roster.slice(roster.indexOf('export const VISUAL_ENEMY_ROSTER'), roster.indexOf('const gear ='));
const entries = [...rosterBlock.matchAll(/id: '([^']+)'[\s\S]*?spinePath: '([^']+)'/g)]
    .map((match) => ({ id: match[1], spinePath: match[2] }));
assert.equal(entries.length, 25, 'the visual gate covers every enemy identity used by 200 levels');
for (const entry of entries) {
    const base = resolve(root, `assets/resources/${entry.spinePath}`);
    for (const extension of ['.skel', '.atlas', '.png']) {
        assert.ok(existsSync(`${base}${extension}`), `${entry.id} has ${extension}`);
        assert.ok(existsSync(`${base}${extension}.meta`), `${entry.id} ${extension} has import metadata`);
    }
}
assert.match(game, /const visualEntry = VISUAL_ENEMY_ROSTER\.find\(\(entry\) => entry\.id === id\)/,
    'runtime enemy registration consumes the audited visual roster');
assert.match(game, /spinePath: visualEntry\?\.spinePath \|\| ''/,
    'runtime no longer discards recovered Spine paths for late enemies');

const heroManifest = JSON.parse(readFileSync(resolve(root,
    '../targets/wxf9af2417e78ce07a/18/evidence/assets/original/hero-spines/manifest.json'), 'utf8'));
assert.equal(heroManifest.modelCount, 12, 'the gate covers H05/H06/H16 levels 1-4');
assert.equal(heroManifest.fileCount, 36, 'every recovered hero model has a Spine triplet');
for (const record of heroManifest.files) {
    const implementationFile = resolve(root, `assets/resources/spine/${record.file}`);
    assert.equal(createHash('sha256').update(readFileSync(implementationFile)).digest('hex'), record.sha256,
        `${record.file} matches its evidence hash`);
    assert.ok(existsSync(`${implementationFile}.meta`), `${record.file} has Creator import metadata`);
}

for (const binding of ['community', 'settings', 'dailyTask', 'sevenDay', 'invitation']) {
    assert.match(game, new RegExp(`MAIN_SIDE_ICON_FRAMES\\.${binding}`), `${binding} uses an original main-atlas icon`);
}

const powerRoleLoad = game.indexOf('this.powerRoleState = loadPowerRoleState(sys.localStorage);');
const accountLoad = game.indexOf('if (!this.loadAccountProfile()) return;');
assert.ok(powerRoleLoad >= 0 && accountLoad > powerRoleLoad,
    'power-role state is initialized before account routing can render P01');
const accountProfileBlock = game.slice(game.indexOf('private loadAccountProfile()'), game.indexOf('private syncAccountProfileToRuntime'));
assert.match(accountProfileBlock, /!directBattleBypassesProgression\(search\)/,
    'explicit direct battle routes bypass the same account lock as launchLevel');

console.log(`resource fidelity gate: ${entries.length} enemy visuals / ${heroManifest.modelCount} late hero models / 2 backgrounds / 5 side icons / direct-boot initialization passed`);
