# Progressive unit unlock and power-role acquisition

Date: 2026-08-12

## Source evidence

- `HeroUnlockConfig`-derived gates already present in `BagLikeAccountProfile.ts`:
  starter families `H01/H02/H04/H12`; then `H13@1001`, `H03@1002`,
  `H11@1004`, `H05@1005`, `H14@1007`, `H06@1009`, `H16@1012`,
  `H17@1015`.
- Original `RoleModel.ts`, `RoleMgr.ts` and `RoleMainView.ts` were extracted to
  `work/power-role-analysis/` from the authorized v18 game package.
- `POWER:INIT_DATA` initializes only `P01` at `lv=0`, `star=0`, equipped.
  Other power roles use `star=-1` until activated.
- `PowerStarConfig` requires 10 fragments for locked-to-star-0 activation.
- `POWER:DAILY_MAX_FREE_FRAGMENT_TIMES=3` and
  `POWER:FREE_FRAGMENT_COUNT=2`. The counters are role-specific and reset on
  day change. `RoleMgr` grants fragments only after the advertisement callback.

## Implemented correction

- Account schema 4 now re-locks every future hero family whose recovered
  unlock level is above `maxPassedLevelId`. This repairs legacy reconstruction
  saves that initialized all twelve families at one star.
- Dynamic candidate draws continue to consume only
  `bagLikeAccountUnlockedHeroFamilies(accountProfile)`. First-challenge static
  batches remain exact table data; their introduced families align with the
  previous-level unlock gates.
- Added persistent P01-P04 role state. P01 starts owned/equipped; P02-P04 start
  locked. Each role has a visible fragment meter, three daily local mock-ad
  claims of two fragments, 10-fragment recruitment, exact 0-8 star fragment
  costs, and an equip action restricted to acquired roles.
- The ROLE system gate remains exact: it opens after level 1005. Before that,
  the page is a locked preview and cannot claim or recruit.

## Validation

- `PowerRoleProgression` regression: 21 assertions.
- Account/candidate migration regression: 95 assertions.
- Full project regression: 45/45 test files, including 200/200 level state
  construction and all candidate-drop tests.
- Creator 3.8.8 TypeScript: pass with project config, `--noEmit` and
  `--skipLibCheck true`.
- Static Cocos project check: 185 assets, 0 missing meta, 0 warnings/errors.
- Fresh Web Mobile build completed at 2026-08-12 12:03. Live 750x1334 check
  showed the evidence-backed main hierarchy and the level-5-gated role page
  with P01 owned plus P02-P04 locked fragment/recruit controls.
