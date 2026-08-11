# Main navigation, cultivation, and merge-assist validation

Date: 2026-08-11

## Evidence-backed scope

- `mainpage.MainPageTabItemConfig.json` fixes the original bottom-tab order and labels as
  `商店 / 角色 / 战斗 / 培养 / 活动`.
- `PowerConfig.json` supplies the four role IDs, names, and qualities shown by the role page.
- `HeroConfig.json` and `HeroStarConfig.json` supply the twelve trainable hero families,
  pass-level unlocks, the 1–20 star range, and fragment/gold costs.
- Exact page styling is a functional reconstruction; no matched competitor capture exists for
  these menu pages.

## Implementation

- Normal startup now exposes the five-tab bottom navigation. `角色`, `战斗`, and `培养` are
  functional; unsupported `商店` and `活动` remain visibly disabled.
- The cultivation page paginates all twelve families, uses recovered head-atlas frames, displays
  persistent resources/star/fragments/costs, and performs the formal resource-spending upgrade.
- Account schema v3 migrates old saves and stores H05/H06/H14/H16/H17 alongside the previously
  persisted families, so cultivation stars drive candidate, fusion, and production consumers.
- Dragging preserves the user's grab offset. Merge matching compares the dragged and target
  footprints, accepts an evidence-safe magnetic radius, and selects the nearest compatible target.

## Validation

- Restore spec ready: pass (`valid=true`, `implementationReady=true`).
- Golden cases: `47/47` pass.
- Cocos project checker: `180` assets, `0` missing metadata.
- Creator 3.8.8 bundled TypeScript: pass with project `tsconfig.json`, `--noEmit`, and
  `--skipLibCheck true`.
- Dedicated tests: account profile `95`, candidate/merge `47`, unit progression `416`, main flow
  `31`; all pass.
- Full test-file run: `39/40` files pass. The only failure is the pre-existing H13 impact-atlas
  SHA-256 mismatch in `h13-projectile.test.mjs`; this change does not touch that resource.
- Creator 3.8.8 Web Mobile build reached `build Task (web-mobile) Finished`.
- Fresh browser session at the 750×1334 design viewport opened role, cultivation page 1, and
  cultivation page 2 (including H14 shark); warning/error count was zero after the portrait-key fix.
- Live level-1004 preparation drag started from the edge of the first H0401 and released about
  `(65, 40)` pixels away from the second H0401 anchor. It still merged into the blue H0402 while
  remaining in `deploy`, with `powerMissingGear=0`. The old point-only hit boxes reject that offset.
- Pure shape tests separately cover the H1401 L-shaped shark: a `(72, 58)` anchor offset is accepted,
  a distant `(190, 150)` offset is rejected, and competing compatible targets rank by proximity.

