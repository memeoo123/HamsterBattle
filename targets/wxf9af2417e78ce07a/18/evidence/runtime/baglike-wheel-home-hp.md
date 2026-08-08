# Bag-like wheel home-HP evidence

Target: `wxf9af2417e78ce07a`, version `18`

## Recovered rule

The original `BattleInstanceController.onUpdateHomeHp` computes the player's
maximum home HP as the chapter's base `homeHp` plus
`BagLilkeManager.allWheelHp`:

- `work/battlefield-runtime-analysis/formatted/BattleInstanceController.ts.deobfuscated.js:493-496`
- `work/battlefield-runtime-analysis/formatted/BagLilkeManager.ts.deobfuscated.js:714-725`

`allWheelHp` iterates placed HERO items, keeps heroes whose `HeroConfig.type`
is `WHEEL`, and sums `heroVo.hp * gear attrMultiple`. `HomeUnit.maxHp` preserves
the current health percentage when that bonus changes:

- `work/battlefield-runtime-analysis/formatted/HomeUnit.ts.deobfuscated.js:91-96`

`HeroModel.getHeroBaseAttr` floors the configured base HP after applying the
saved star's `HeroStarConfig.attrModifier`:

- `work/warrior-combo-critical-analysis/HeroModel.ts.deobfuscated.js:3`

## Developed-reference deduction

The original developed preparation capture displays full home HP `863` on
level 1004 and contains one placed green level-1 H13 cannon gear. Its other
placed producers are the vertical green H03 mage and horizontal blue H02
shooter; their `7` and `8` power values plus the four-sided connected component
produce the captured `0.16/s` and `0.18/s`, while H13 produces `0.33/s`. The decoded
tables establish:

- level 1004 base home HP: `500`
- H13 type: `WHEEL`
- H13 base HP: `300`
- H13 level-1 gear `attrMultiple`: `10000` (1x)
- hero star 3 `attrModifier`: `2100` (21%)
- `floor(300 * 1.21) = 363`
- `500 + 363 = 863`

This closes both the missing mechanic and the reference-account state: the
H13 visible in the developed screenshots uses saved hero star 3.

## Evidence integrity

- `hero.HeroConfig.json`: `8d51351552d005ff46d7d5479c2baabf0f7dc954da27469e119d5a25e6405643`
- `hero.HeroStarConfig.json`: `ea5f1fa1292b4f5672a57bac3aa8d554e81cbe59f42811481ac318ef765d35b6`
- `baglike.BagLikeItemConfig.json`: `9093a90034a7bcfb29ca1e3f3ffefc9d152ab1494a1f3c0422f06d6ff7238b90`
- `preparation-developed.png`: `4938d0a49301bb359ebfb1e40763a5835c295b29ab79c4eae2db93288731360b`
