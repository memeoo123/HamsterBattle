import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
    heroSeparationVector,
    movementVectorToward,
} from '../assets/scripts/BattlefieldKernel.ts';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');

const rear = { x: 0, y: 0 };
const front = { x: 10, y: 0 };
const forward = movementVectorToward(rear, { x: 200, y: 0 }, 1);
const rearSeparation = heroSeparationVector(rear, [rear, front]);
const frontSeparation = heroSeparationVector(front, [rear, front]);

assert.deepEqual(rearSeparation, { x: -2, y: 0 }, 'the moving rear hero keeps the recovered soft-separation push');
assert.deepEqual(frontSeparation, { x: 2, y: 0 }, 'the stationary front hero receives the matching space-making push');
assert.equal(forward.x + rearSeparation.x, -1, 'at 60 FPS the rear unit can briefly be pushed backward while the line spreads');
assert.equal(frontSeparation.x, 2, 'a stationary front unit must still move so the rear unit is not permanently pinned');

assert.equal(
    (source.match(/this\.applyStationaryHeroSeparation\(unit, separation\)/g) || []).length,
    8,
    'all attacking and casting early-return branches preserve the recovered environment displacement',
);
assert.match(source, /if \(intent\.attackTarget \|\| intent\.attackHome\)[\s\S]*?applyStationaryHeroSeparation\(unit, separation\);[\s\S]*?return;/);
assert.match(source, /private applyStationaryHeroSeparation\([\s\S]*?unit\.team !== 'self'[\s\S]*?unit\.node\.setPosition\(unit\.x, unit\.y\);/);

const frozenBranch = source.slice(
    source.indexOf('if (unit.frozen > 0)'),
    source.indexOf('if (unit.enemySpecialCasting)'),
);
assert.doesNotMatch(frozenBranch, /applyStationaryHeroSeparation/, 'frozen heroes remain unable to move');
assert.match(source, /canvas\.dataset\.selfRuntime = this\.units/, 'live builds expose self-unit coordinates for stuck-unit sampling');

console.log('battlefield movement integration: 10 assertions passed');
