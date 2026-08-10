# Trait visual comparison — 2026-08-10

## Matched state

- Original: `evidence/visual/original/2026-08-01/trait-selection.png`
- Reconstruction: `developed-trait.png`
- Polished reconstruction: `developed-trait-polished.png`
- Level/state: 1004, wave 1/15, 863 home HP, BagLike level 2.
- Choices: spell gear attack +5%, H02 split shot 30%, H03 freeze 30%.
- Canonical reconstruction canvas: 750×1334.

## Confirmed improvements

- Creator 3.8.8 formally imported the recovered resources3 `effect.png`; the image and generated `.meta` pass the project checker with missing meta 0.
- The three fixture cards render the exact recovered `buff_0027`, `buff_0036`, and `buff_0006` images instead of text glyph placeholders.
- Title, card and action geometry now follows the original gameplay crop's width-normalized coordinates. Card tops, bottoms and horizontal centers align closely with the reference.
- Fresh Web Mobile runtime capture has no browser warnings or errors. TypeScript, the 19/19 trait presentation test, and the 1025/1025 full suite pass.
- The polished capture uses the exact recovered `comm_0.png` patterned title ribbon, blue/purple glossy button skins, and video icon.
- Description hero names and percentage values use green/white RichText runs; recommendation tags now have the reference diagonal rotation, black outline, and tail.
- Remaining counts are separated from the action labels and display the reference green `10/10` and `3/3` values.

## Remaining difference

- None for the required representative baseline. `developed-battle-fixed.png` closes the battle comparison with a controlled level-1004 wave-1 state, the complete recovered HUD, persistent backpack, 863 HP, and the evidenced M07 + three M02 enemy mix.
- The overall `visualBaseline` gate now passes. The fixed battle fixture is browser-only and does not alter normal 200-level gameplay.
