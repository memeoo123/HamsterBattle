# BagLike level-5 fusion evidence

Target: `wxf9af2417e78ce07a/18`

## Exact recipes and gates

| Result | Materials (bidirectional) | Shape | Production | Model | Verification |
|---|---|---:|---:|---|---|
| H0705 | H0104 + H0204 | 2 | 8 | R1001 | H01 ≥ 2, H02 ≥ 2 |
| H0805 | H0304 + H1204 | 3 | 7 | R1002 | H03 ≥ 3, H12 ≥ 3 |
| H0905 | H0404 + H1304 | 7 | 6 | R1003 | H04 ≥ 5, H13 ≥ 5 |
| H1005 | H0504 + H0604 | 10 | 6 | R1004 | H05 ≥ 5, H06 ≥ 5 |
| H1505 | H1404 + C04 | 8 | 6 | R1005 | H14 ≥ 5 |
| H1805 | H1604 + H1704 | 9 | 6 | R1006 | H16 ≥ 5, H17 ≥ 5 |

Source: decoded `resources3/decoded/all-tables/baglike.BagLikeItemConfig.json`.
`BagLikeMergeDatas` constructs a partner map in both directions. The item
verification list is evaluated before the merge result replaces the target.

## Restored runtime scope

- All six recipes and star gates are represented in `BagLikeFusion.ts`.
- H0705, H0805, and H0905 are reachable from the hero families already restored
  in the representative level runtime. Their exact heads, level-5 red gear body,
  footprints, production values, hero base attributes, primary skill IDs, model
  paths and model scales are connected.
- H1005, H1505, and H1805 remain rule-only until their source material families
  H05/H06/H14/H16/H17 are restored; this avoids inventing unavailable producers.
- Target-account hero stars are not contained in the package. Creator properties
  therefore remain at evidence-safe star 1 by default; interactive fusion requires
  setting the evidenced account values.
- H0905 skill 9001 is currently connected through its confirmed base projectile
  path. Missile type-8 repeat semantics (`times: 2`) still require a dedicated
  runtime trace before the full hit chain can be called exact.

## Validation

- Fusion rule tests: 10/10.
- Unit progression tests: 254/254.
- Full existing gameplay regression suites pass.
- Cocos 3.8.8 static check: TypeScript exit 0, 96 assets, missing meta 0.
- Web-mobile debug build: finished successfully on 2026-08-02; the unrelated
  extension-manager `ECONNRESET` warning did not block asset import or build output.
- Explicit fixture captures are recorded under
  `evidence/visual/reconstruction/2026-08-02/fusion-validation/manifest.json`.
  They confirm all three recovered footprints in both tray and grid, plus the
  production queue and successful R1001/R1002/R1003 Spine loads. The fixture is
  URL-gated and leaves the default account stars/drop flow unchanged.
- The first battle fixture capture exposed a real layout regression: the backpack
  grid/background moved down for battle but `BackpackPanel` stayed at its deploy
  coordinate and covered the battlefield. `applyPhaseLayout` now moves the panel
  with `gridOffsetY`; the accepted battle capture confirms the field is visible.
- These are reconstruction-only fixture captures, not a matched original account
  state, so they do not close `visualBaseline` or establish target-account stars.
