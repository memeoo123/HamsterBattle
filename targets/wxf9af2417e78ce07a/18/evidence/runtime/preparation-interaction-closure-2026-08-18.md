# Preparation interaction closure — 2026-08-18

Target: `wxf9af2417e78ce07a/18`

## Evidence-backed closure

- Preparation-round state now resets `normalRefreshTimes` and the advertisement-use flag before the automatic `Prepare` deal. The global non-ad draw sequence remains continuous, matching the separation between `refreshTimesPerRound` and total refresh progression in the recovered runtime.
- The first normal refresh in every preparation round is free; later normal refreshes cost 15. A successful ad refresh marks only the current preparation round and does not advance the non-ad sequence.
- Normal occupied drops first retain the existing merge path. If no merge succeeds, the complete footprint is placed and every intersecting old gear is returned whole to the candidate tray.
- A placed normal gear dropped outside a valid open-grid footprint returns to the candidate tray. An invalid candidate drop restores its tray origin. The power core remains protected and restores its grid origin instead of entering the tray.
- Starting a battle clears unplaced candidates. The backpack remains active during battle, trait selection, and round-clear phases; only the preparation controls are hidden.
- Grid drawing creates the recovered `gridOpen` face only for unlocked cells. Locked cells remain the untouched recovered backpack panel treatment shown in the reference.
- Recovered multi-cell connector frames and rotations were already complete. The child order is corrected so the connector stays below every `cl1..cl5` cog body and below the portrait/level-five overlay.

## Deterministic and integration coverage

- `preparation-interaction-integration.test.mjs`: 17 assertions for occupied replacement, multi-gear eviction, placed-gear return, invalid candidate restore, protected power-core restore, preparation-round refresh counters, candidate clearing, phase-persistent backpack, unlocked-cell treatment, and connector layering.
- Existing focused regressions remain green:
  - `baglike-preparation.test.mjs`: 24 assertions.
  - `baglike-candidate-drops.test.mjs`: 47 assertions.
  - `preparation-presentation.test.mjs`: 19 assertions.
  - `gear-connector-presentation.test.mjs`: 16 assertions.
  - `battlefield-kernel.test.mjs`: 116 assertions.

## Creator validation

- Creator: `Cocos Creator 3.8.8`.
- Process: PID `71324`.
- Started: `2026-08-18T16:43:03.3385802+08:00`.
- Finished: `2026-08-18T16:43:20.8123646+08:00`.
- Output: `cocosProject/build/preparation-closure-validation-20260818/web-mobile`.
- Result: `build Task (web-mobile) Finished in (5 s)`.
- Static project/TypeScript check: 282 assets, zero missing metadata, zero errors.
- The extension-manager `ECONNRESET` was non-blocking; the local build completed and produced the expected Web Mobile files.

## Deferred external inputs

- The target account's exact saved hero unlock/star values are still external to the package artifacts.
- P02/P03 lazy role-model files, `H18_S1`, `ui/battle`, result audio, and the representative same-frame capture remain in the shared missing-resource/evidence queue; no substitute assets were invented here.
