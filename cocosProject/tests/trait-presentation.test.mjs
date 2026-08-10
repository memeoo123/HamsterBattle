import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/scripts/CangshuGame.ts', import.meta.url), 'utf8');
const exactTraitAtlas = readFileSync(new URL('../assets/resources/original/trait-icons/effect.png', import.meta.url));

assert.match(source, /const iconLevel = Math\.max\(1, Math\.min\(5, trait\.quality - 1\)\)/, 'trait quality selects a recovered gear tier');
assert.match(source, /attachRecoveredAtlasSprite\(iconGear, 'original\/bagLike_0\/spriteFrame'/, 'trait cards use the recovered gear atlas');
assert.match(source, /descriptionNode\.addComponent\(RichText\);[\s\S]*description\.maxWidth = TRAIT_VISUAL_LAYOUT\.descriptionWidth - 18;/, 'trait descriptions wrap inside their cards with RichText');
assert.match(source, /function wrapTraitDescription\([\s\S]*return lines\.join\('\\n'\);/, 'Chinese trait descriptions receive deterministic line breaks');
assert.match(source, /function traitDescriptionMarkup\([\s\S]*<color=#6dff70>/, 'trait descriptions color hero names and percentages like the original RichText');
assert.match(source, /applyCommButtonSkin\(this\.traitRerollLabel, COMM_ATLAS_FRAMES\.blueButton\);[\s\S]*applyCommButtonSkin\(this\.traitTakeAllLabel, COMM_ATLAS_FRAMES\.purpleButton\);/, 'trait actions use exact recovered button skins');
assert.match(source, /traitValidation=1[\s\S]*this\.startRound\(\);[\s\S]*this\.openTraitSelection\(\);/, 'the browser-only trait fixture renders the production trait component');
assert.match(source, /developedValidation=\(preparation\|battle\|trait\)/, 'the developed visual fixture exposes all three reference phases');
assert.match(source, /visualFixtureRandom:[\s\S]{0,80}createBattleSeedRandom\(1004\)/, 'the battle visual fixture uses a dedicated fixed seed');
assert.match(source, /developedValidationMode === 'battle'[\s\S]{0,120}this\.startRound\(\);[\s\S]{0,120}this\.applyDevelopedBattleCaptureFixture\(\);/, 'the battle visual URL switches immediately to its fixed capture state');
assert.match(source, /referenceUnits:[\s\S]*\['M07', 310, 120\][\s\S]*\['M02', 145, 35\][\s\S]*\['M02', 285, -35\][\s\S]*\['M02', 220, -120\][\s\S]*addDamageText\(27, x, y \+ 48\);[\s\S]*this\.paused = true;/, 'the fixed battle snapshot reproduces the evidenced enemy mix, lanes and damage value');
assert.match(source, /this\.h13HeroStar = 3;[\s\S]*this\.addPlacedGear\('H1301', 1, 2\);[\s\S]*this\.addPlacedGear\('H0301', 1, 4\);[\s\S]*this\.addPlacedGear\('H0202', 3, 2\);/, 'the developed fixture preserves the evidenced account star and board layout');
assert.match(source, /this\.replaceCandidates\(\['C01'\]\);/, 'the developed preparation fixture shows the evidenced coin candidate');
assert.match(source, /this\.bagLikeLevel = 2;[\s\S]*RG_ALL_abl13_eff01[\s\S]*RG_H02_abl02_eff01[\s\S]*RG_H03_abl02_eff01/, 'the developed trait fixture preserves the evidenced level and three choices');
assert.match(source, /const TRAIT_VISUAL_LAYOUT = \{[\s\S]*titleY: 420,[\s\S]*cardsY: 85,[\s\S]*cardStepX: 212,[\s\S]*cardHeight: 470,/, 'trait modal geometry is normalized from the original gameplay crop');
assert.match(source, /traitTitleRibbon:[\s\S]*new Rect\(416, 1, 524, 83\)[\s\S]*attachRecoveredAtlasSprite\(titleRibbon, 'original\/comm_0\/spriteFrame'/, 'trait title uses the exact recovered patterned ribbon');
assert.match(source, /graphics\.circle\(-58, 224, 13\);[\s\S]*graphics\.circle\(58, 224, 13\);[\s\S]*graphics\.roundRect\(-84, -230, 168, 460, 27\);/, 'trait cards restore the narrow tall shell and top ears');
assert.match(source, /badge\.angle = -15;[\s\S]*badgeGraphics\.roundRect\(-50, -26, 100, 52, 11\);[\s\S]*badgeGraphics\.lineTo\(-13, -39\);/, 'recommended traits use the original diagonal black-outlined tag silhouette');
assert.equal(createHash('sha256').update(exactTraitAtlas).digest('hex'), 'da0f386f4f2202cb0eef59dc7517716e6d5a580a9ce6b6be859b6b4cb599a3d6', 'the recovered resources3 effect atlas remains exact');
assert.match(source, /RG_ALL_abl13_eff01:[\s\S]*new Rect\(315, 301, 76, 82\)[\s\S]*RG_H02_abl02_eff01:[\s\S]*new Rect\(467, 71, 92, 72\)[\s\S]*RG_H03_abl02_eff01:[\s\S]*new Rect\(315, 71, 76, 72\)/, 'the three evidenced traits bind their exact SpriteFrame rectangles');
assert.match(source, /const exactIconFrame = TRAIT_ICON_FRAMES\[trait\.id\];[\s\S]*original\/trait-icons\/effect\/spriteFrame/, 'evidenced traits render from the recovered effect atlas');
assert.match(source, /else \{[\s\S]*const icon = icons\[trait\.effect\.kind\];[\s\S]*TraitIconFallback/, 'unmapped traits keep an explicit evidence-safe fallback');

console.log('trait presentation: 22 assertions passed');
