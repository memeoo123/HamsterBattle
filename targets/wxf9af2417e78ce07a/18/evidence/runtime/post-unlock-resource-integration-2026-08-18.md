# Post-unlock resource integration — 2026-08-18

Target: `wxf9af2417e78ce07a/18`

## Imported, bound, and retained

- `ui/unpack/bg/bg1` → role-scene background.
- `spine/power/pao_kakaxi0.75/pao_kakaxi` → P04 role-card model, using the recovered `P04L` scale `0.7`, offset `(1,-20)`, and looping `idle` action.
- `spine/power/pao_kakaxi/pao_kakaxi` → P04 full battle model. It appeared in the live cache at 2026-08-18 14:49 CST after entering battle with P04 equipped and is bound to the battlefield power core with recovered `ModelConfig.P04` offset `(1,-10)`, scale `1`, height `80`, and looping `idle`.
- `spine/power/pao_paopaoshu/pao_paopaoshu` and `spine/power/pao_paopaoshu0.75/pao_paopaoshu` → P01 full/card models recovered from older cache entries that the earlier filename-only scan missed. The role card uses `ModelConfig.P01L` offset `(1,-20)` and scale `0.7`; the battlefield core uses `ModelConfig.P01` offset `(1,-10)` and scale `1`; both loop `idle`.
- `spine/ui/chilunpy_shengjishanguang/chilunpy_shengjishanguang` → successful role star/level-up feedback. The complete `HeroInfoView` child scan places the `708×380` `HeroUpAniComp` exactly at FairyGUI `(374,341)`, mapped to Cocos `(-1,326)`.

The exact `ui/hero` package, its atlas, `image/quality`, and `cj_xuedi` were also imported. The role list now consumes the decoded `HeroMainView`/`HeroItem` geometry and exact blue/purple quality frames; `cj_xuedi` remains retained without a guessed consumer. `image/shape` and `image/effect` were not duplicated because their hashes already match existing project assets exactly.

## Cache interpretation correction

The earlier filename-only cache audit conflated "not downloaded in this cache yet" with "resource absent." Cocos UUID/path mapping now proves that P01 full and 0.75 models were already cached, while P04 full and 0.75 models are both cached after the P04 battle entry. P02/P03 full and 0.75 paths exist in the version-18 resource configuration but are not present in the current local cache, so they are classified as lazy-download pending rather than confirmed missing.

## Validation

- Cocos Creator 3.8.8 generated metadata for the separate P01 full/card and P04 full Spine triplets.
- The final bounded `web-mobile` import/build completed successfully (Creator exit code 36) at `cocosProject/build/power-role-cache-import-validation/web-mobile`.
- Static Cocos project/TypeScript validation reports 275 assets, zero missing `.meta` files, and zero errors.
- Spine inspection confirms runtime 3.8.99 compatibility and matching atlas texture references for all newly imported triplets.
- P01/P04 now replace the static central-core portrait with their exact full Spine model after successful asynchronous loading; P02/P03 intentionally retain the static fallback until their configured lazy resources are cached.

## Import/build result

- Creator: `Cocos Creator 3.8.8`
- Process PID: `58652`
- Started: `2026-08-18T06:42:03.5860179Z`
- Finished: `2026-08-18T06:42:22.7815396Z`
- Output: `cocosProject/build/post-unlock-validation-20260818/web-mobile`
- Result: build task finished successfully; `266` assets, `0` missing metadata, TypeScript pass.
- Non-blocking environment note: the extension-manager network request reset while the local build continued and completed.

## Regression result

- Validation profile: `mechanics`
- Commands: `57/57` passed
- Test files: `55/55` passed
- Golden cases: passed
- Dedicated coverage: `cocosProject/tests/post-unlock-resource-integration.test.mjs`

## Battlefield full-model binding validation

- `ModelConfig.P01/P04` was decoded directly from the version-18 table before binding; both rows specify offset `(1,-10)`, scale `(1,1)`, height `80`, and looping `idle`.
- The central power-core presentation now loads `PowerRoleP01Full` or `PowerRoleP04Full` according to the equipped role, while preserving the static portrait if loading fails or if P02/P03 is equipped.
- A fresh bounded Cocos Creator 3.8.8 Web Mobile build completed successfully on 2026-08-18 15:49 CST at `cocosProject/build/power-core-role-model-validation/web-mobile` (PID `73192`, Creator exit code `36`). The extension-manager `ECONNRESET` remained non-blocking; the local build task finished normally.
- Static project validation reports `275` assets, `0` missing metadata files, and a clean Creator TypeScript check.

## Remaining evidence gaps

- `H18_S1 / spriteFrame/skill/js_fashi_dandao` is still absent from version 18 and the new cache.
- P02/P03 full and 0.75 power-role model paths are configured but their lazy resource files have not yet appeared in the authorized local cache; their runtime consumers therefore keep the exact static fallback.
- The representative level-1004 battle gear glow and remaining status/result animation/audio timing still need matched runtime evidence.
- The user's report that all roles are unlocked is accepted as external observation; exact account levels and stars were not read or inferred.
