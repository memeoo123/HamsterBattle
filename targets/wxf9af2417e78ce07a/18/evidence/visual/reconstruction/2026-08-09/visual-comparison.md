# Level 1004 developed-state comparison — 2026-08-09

## Decision

`visualBaseline` remains **pending**, but the former state mismatch is closed.
The reconstruction now has deterministic preparation, battle and trait fixtures
for the same developed account/board represented by the original captures.

## Newly matched state

| Field | Original | Reconstruction |
|---|---:|---:|
| Level / wave | 1004 / 1 of 15 | 1004 / 1 of 15 |
| Home HP | 863 / 863 | 863 / 863 |
| H13 | green level 1, upper-left L, 0.33/s | same |
| H03 | green level 1, upper-right vertical, 0.16/s | same |
| H02 | blue level 2, lower-left horizontal, 0.18/s | same |
| Candidate | level-1 coin, 0.03/s | same |
| Trait level | 2 | 2 |
| Trait choices | spell +5%, H02 30% split shot, H03 30% freeze | same three IDs and recommendation state |

The 863 value is mechanics-backed rather than fixture text: level 1004 contributes
500, and the placed star-3 H13 contributes `floor(300 × 1.21) = 363`. The four
placed board items form one connected component touching every core side, which
also reproduces all displayed production rates without overrides.

## Remaining presentation work

1. Finish inline colored spans and minor font-metric calibration in the trait
   descriptions. Original ribbon/card/button/pictogram art is now bound; see
   `../2026-08-09-trait-package/visual-comparison.md`.
2. Tighten backpack panel, grid and control geometry against normalized viewport
   coordinates; the semantic topology is now fixed, so geometry can be compared
   without random-state noise.
3. Capture at a matched elapsed-time/RNG event boundary. The current battle image
   already contains the reconstructed HUD; the absent white strip is the excluded
   WeChat host header, not a missing in-game component.

These are presentation/timing differences. The account state, gear identities,
home-HP rule, connectivity, rates and visible trait selection are no longer blockers.
