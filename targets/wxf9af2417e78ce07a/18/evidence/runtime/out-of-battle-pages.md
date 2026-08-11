# Out-of-battle page reconstruction

Date: 2026-08-11

## Evidence boundary

- Bottom navigation order and unlock gates come from `MainPageTabItemConfig` and `PlayerSystemOpenConfig`.
- Shop sections, goods, fixed costs and deterministic rewards come from `ShopConfig`, `ShopGoodsConfig` and `RewardDropConfig`.
- Role names, qualities, skills, all 0–8 star abilities and first upgrade costs come from `PowerConfig`, `PowerAbilityConfig`, `PowerLevelConfig` and `PowerStarConfig`.
- Activity entrances, seven-day rewards, daily tasks and active-score rewards come from their recovered decoded tables. Daily challenge chapters/effects/rules come from the six `DailyInstance*Config` tables; endless cost, attempts, round `400001` and initial reward come from `TrunkInstanceConstantConfig`.
- `SettingMainView`, `SettingModel`, `DailyInstanceModel` and `EndlessModeModel` were extracted from the original System.register bundle into `targets/wxf9af2417e78ce07a/18/work/out-of-battle-module-analysis/` before implementation.
- The target account's ad callbacks, daily limits, random draws, sign-in records and role save are not present in the package. Those actions remain visibly unavailable and never fabricate rewards.

## Implemented behavior

- The five original tabs are all navigable, including locked-page configuration previews.
- Fixed gold and energy purchases debit diamonds and persist through the local account profile.
- Platform/server/random goods are display-only.
- Daily tasks and seven-day rewards show exact recovered schedules while account progress/claim state uses an explicit unknown marker.
- Every P01–P04 card opens its complete nine-row ability ladder.
- Settings restores the original music/effect controls as locally persisted 0–100% values. Code redemption, feedback and UID remain visible but unavailable because their platform/server state is absent.
- Daily challenge restores ten named chapters, two five-chapter pages, ten rounds per chapter, the exact three-effect rotation, three recovered rules, four reward thresholds, three attempts and five-energy cost. The dedicated battle/claim action remains disabled.
- Endless restores the three-attempt/five-energy rule, third-attempt advertisement gate, initial 300 daily gold, round `400001`, recovered 560-spawn schedule and high-score fields. The dedicated scoring/settlement action remains disabled.
- Daily challenge has an explicit return-to-activity action; this was added after live testing found the selected activity tab could otherwise trap the user in the detail page.

## Validation

- Creator 3.8.8 imported `OutOfBattleConfig.ts`; project inventory is `181 assets / 0 missing meta`.
- Project TypeScript passed with `--noEmit --skipLibCheck true`.
- Dedicated out-of-battle regression passed.
- The 750×1334 Web Mobile build was clicked through shop, role, cultivation, activity, daily task and seven-day pages; console warnings/errors were `0`.
- A fresh 750×1334 build was additionally clicked through settings (including a persisted 100%→75% music change), P04's complete ability ladder, both daily-challenge chapter pages, return navigation and endless details. Browser logs were `0 warning / 0 error`.
- A live visual check caught and fixed the day-7 reward overflow; the rebuilt card now renders the reward on two lines.
- The H13 atlas regression was traced to Git LF bytes versus the Windows CRLF worktree and fixed by hashing normalized text in the manifest test; the actual recovered atlas was unchanged.
- Final gates: `41/41` test files, Golden Cases `47/47`, Creator TypeScript pass, `181 assets / 0 missing meta`, fresh Web Mobile build pass.
