# Level 1004 visual comparison — 2026-08-02

## Decision

`visualBaseline` remains **not passed**. This run closes the earliest preparation-layout divergence and produces a valid interactive wave-1 capture, but it does not yet provide four same-state matched pairs.

## Normalization

The original screenshots include the WeChat title bar. Their game viewport begins below that bar and has the same aspect ratio as the recovered `750 × 1334` design. Position comparisons below use the cropped game viewport scaled to `750 × 1334`, not the outer screenshot size.

## What now matches structurally

| Area | Original reference | Reconstruction result |
|---|---|---|
| Top HUD hierarchy | Pause, two compact counters, EXP bar, level badge, `1/15波`, statistics and handbook | Same hierarchy and recovered BagLikeTopItem anchors; exact original pause, ItemConfig-bound silver coin/ad ticket, statistics/handbook art and counter 9-slice backgrounds; reconstruction-only title/objective/phase block and visible speed control removed |
| Preparation vertical split | Desert/HUD ends and backpack begins at normalized design `y ≈ 300` | Backpack begins at `y = 300` after changing deploy grid offset from `-40` to `0` |
| Backpack | Dark panel, centered unlocked 3×3 around core | Dark panel and centered 3×3/core occupy the corresponding region |
| Backpack artwork | Blue operation background, dark rounded backpack panel, gray-blue open cells | Uses exact `zd1_frame.png`, `zd_frame.png` and `gezi2.png` atlas records with recovered 9-slice borders and target sizes |
| Candidate/control region | Three full-size irregular candidates below backpack; three bottom actions | Full-size 100-pixel logical candidates no longer overlap the grid; three actions remain below them |
| Gear level art | `cl1..cl5` cog art communicates green/blue/purple/gold/red merge level | Uses the exact five 110×110 FairyGUI atlas rectangles recovered from `bagLike.a597d.bin` in both candidate and backpack rendering |
| Multi-cell gear body | Original panel plate connects 2-cell, 3-cell, L and 2×2 footprints below the cogs | Uses `panel1`, `panel3`, rotated `panel2`, and `panel4` exactly as mapped by `BagLikeShapeConfig`, tinted by merge level and layered below `cl1..cl5` |
| Bottom actions | Original blue/green/yellow refresh and start controls | Uses the exact three scale9 button records recovered from the `comm` package; labels use the recovered `TsangerYunHei W08` font and black 3-pixel outline |
| Visible typography | Rounded Chinese UI font with dark outlines on HUD, wave and action labels | Uses the byte-identical resources3 `default.ttf`; decoded outlines are `#060500/2` for HUD counters, `#0C0C0C/2` for wave text and `#000000/3` for action titles |
| Battle phase | Battlefield expands; top HUD and backpack remain visible | Real drag/start flow reaches wave 1, retains both HUD and backpack, advances production and spawns units |

## Earliest remaining visual divergences

1. Static multi-cell connector plates and their rotations are original. Six cross-family level-5 recipes, the first three resulting models, and their shape overlays are restored and covered by explicit fixture screenshots. They remain unverified in a normal evidence-backed account flow because the target account's hero stars are unknown.
2. The wave-1 reference is a developed save (`863 HP`, several placed gears), while the reconstruction evidence is an initial `500 HP` run with one random producer. It proves phase structure and gameplay linkage, but it is not a same-state pixel pair.
3. The trait reference also comes from a developed run. The current initial run was defeated before reaching the first EXP choice, so the trait capture remains missing rather than being reported as passed.
4. The recovered font and the confirmed preparation-state HUD/wave/button outlines now match their original binary records; typography in unvisited popups still requires per-component evidence before it can be called globally exact.

## Random-state boundary

Level 1004 uses the recovered non-first-challenge weighted candidate path (`challengeTimes=2`). Candidate identities may therefore differ between page loads, just as the competitor allows duplicate or different weighted results. A pixel-level candidate comparison needs either a recorded RNG/event trace or a manually reproduced inventory; changing production gameplay to a fixed batch would be behaviorally incorrect.

## Next comparison event

Create a developed reconstruction state matching the original battle reference (same 863 HP, placed gears, wave/time and RNG trace) and capture wave 1 plus the resulting trait overlay. The level-5 fixture screenshots remain supporting evidence only. Pass `visualBaseline` only when all required normal-flow pairs are comparable.
