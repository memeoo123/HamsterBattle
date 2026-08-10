import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bagLikeProducerShape } from '../assets/scripts/BagLikeUnitProgression.ts';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');

assert.match(source, /1: new Rect\(1024, 1, 110, 110\)/, 'cl1 uses the exact recovered atlas rectangle');
assert.match(source, /connectorTwo:[\s\S]{0,100}new Rect\(409, 451, 158, 60\)/, 'panel1 two-cell connector uses the recovered rectangle');
assert.match(source, /connectorL:[\s\S]{0,100}new Rect\(461, 102, 158, 158\)/, 'panel2 L connector uses the recovered rectangle');
assert.match(source, /connectorThree:[\s\S]{0,100}new Rect\(999, 117, 60, 257\)/, 'panel3 three-cell connector uses the recovered rectangle');
assert.match(source, /connectorSquare:[\s\S]{0,100}new Rect\(621, 102, 152, 152\)/, 'panel4 square connector uses the recovered rectangle');

assert.deepEqual(bagLikeProducerShape('H0201'), [[0, 0], [0, 1]], 'shape 2 is horizontal panel1 at 0 degrees');
assert.deepEqual(bagLikeProducerShape('H0301'), [[0, 0], [1, 0]], 'shape 3 is vertical panel1 at 90 degrees');
assert.deepEqual(bagLikeProducerShape('H0401'), [[0, 0], [1, 0], [2, 0]], 'shape 5 is vertical panel3 at 0 degrees');
assert.deepEqual(bagLikeProducerShape('H1701'), [[0, 0], [0, 1], [0, 2]], 'shape 4 is horizontal panel3 at 90 degrees');
assert.deepEqual(bagLikeProducerShape('H0501'), [[0, 0], [1, 0], [1, 1]], 'shape 6 is panel2 at -90 degrees');
assert.deepEqual(bagLikeProducerShape('H1301'), [[0, 0], [0, 1], [1, 0]], 'shape 7 is panel2 at 0 degrees');
assert.deepEqual(bagLikeProducerShape('H1401'), [[0, 1], [1, 0], [1, 1]], 'shape 8 is panel2 at 180 degrees');
assert.deepEqual(bagLikeProducerShape('H1601'), [[0, 0], [0, 1], [1, 1]], 'shape 9 is panel2 at 90 degrees');
assert.deepEqual(bagLikeProducerShape('H0601'), [[0, 0], [0, 1], [1, 0], [1, 1]], 'shape 10 is panel4 at 0 degrees');

assert.match(source, /if \(!occupied\.has\('0,1'\)\) angle = -90;[\s\S]{0,180}else angle = 90;/, 'L connector rotations reproduce shape rows 6 through 9');
assert.match(source, /this\.attachRecoveredAtlasSprite\(connector, 'original\/bagLike_0\/spriteFrame', spec, tint\)/, 'connector uses recovered source art with level tint');

console.log('gear connector presentation: 16 assertions passed');
