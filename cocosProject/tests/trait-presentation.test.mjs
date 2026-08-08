import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');

assert.match(source, /const iconLevel = Math\.max\(1, Math\.min\(5, trait\.quality - 1\)\)/, 'trait quality selects a recovered gear tier');
assert.match(source, /attachRecoveredAtlasSprite\(iconGear, 'original\/bagLike_0\/spriteFrame'/, 'trait cards use the recovered gear atlas');
assert.match(source, /description\.overflow = Label\.Overflow\.CLAMP;[\s\S]*description\.enableWrapText = true;/, 'trait descriptions wrap inside their cards');
assert.match(source, /function wrapTraitDescription\([\s\S]*return lines\.join\('\\n'\);/, 'Chinese trait descriptions receive deterministic line breaks');
assert.match(source, /description\.verticalAlign = VerticalTextAlignment\.TOP;/, 'trait descriptions start at the top of the bounded panel');
assert.match(source, /restyleButton\(this\.traitRerollLabel,[\s\S]*restyleButton\(this\.traitTakeAllLabel/, 'trait actions use distinct recovered-reference colors');
assert.match(source, /traitValidation=1[\s\S]*this\.startRound\(\);[\s\S]*this\.openTraitSelection\(\);/, 'the browser-only trait fixture renders the production trait component');
assert.match(source, /developedValidation=\(preparation\|battle\|trait\)/, 'the developed visual fixture exposes all three reference phases');
assert.match(source, /this\.h13HeroStar = 3;[\s\S]*this\.addPlacedGear\('H1301', 1, 2\);[\s\S]*this\.addPlacedGear\('H0301', 1, 4\);[\s\S]*this\.addPlacedGear\('H0202', 3, 2\);/, 'the developed fixture preserves the evidenced account star and board layout');
assert.match(source, /this\.replaceCandidates\(\['C01'\]\);/, 'the developed preparation fixture shows the evidenced coin candidate');
assert.match(source, /this\.bagLikeLevel = 2;[\s\S]*RG_ALL_abl13_eff01[\s\S]*RG_H02_abl02_eff01[\s\S]*RG_H03_abl02_eff01/, 'the developed trait fixture preserves the evidenced level and three choices');

console.log('trait presentation: 11 assertions passed');
