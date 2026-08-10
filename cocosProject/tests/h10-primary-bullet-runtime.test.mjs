import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(projectRoot, 'assets/scripts/CangshuGame.ts'), 'utf8');

assert.match(source, /fusionPrimaryBullet: bagLikeFusionPrimaryBulletProfile\('H10'\)/, 'H10 consumes the evidence-backed fallback bullet profile');
assert.match(source, /const launchY = unit\.y \+ \(primaryBullet\?\.launchOffsetY \|\| 0\)/, 'the bullet launches from SkillConfig atkPoint y=50');
assert.match(source, /Math\.max\(0, travelDistance - primaryBullet\.stopShortDistance\) \/ primaryBullet\.speed/, 'type 11 uses the default BulletUnit travel path');
assert.match(source, /if \(primaryBullet && target\) this\.h10PrimaryBulletCastCount \+= 1/, 'bullet launch is observable');
assert.doesNotMatch(source, /hit\.areaRadius > 0 \|\| hit\.attacker\.cfg\.id === 'H10'/, 'a dead locked target no longer leaves an H10 line hit behind');
assert.match(source, /const primaryBullet = hit\.attacker\.cfg\.fusionPrimaryBullet/, 'pending-hit resolution consumes the fallback bullet profile');
assert.match(source, /\{ x: hit\.impactX, y: hit\.impactY \}/, 'rectangle geometry originates at the bullet endpoint');
assert.match(source, /primaryBullet\.width,\s*primaryBullet\.height/, 'impact geometry consumes the recovered 100 x 300 dimensions');
assert.match(source, /if \(primaryBullet\) this\.h10PrimaryBulletHitCount \+= 1/, 'bullet hits are observable in the browser contract');

console.log('H10 primary fallback bullet runtime: 9 assertions passed');
