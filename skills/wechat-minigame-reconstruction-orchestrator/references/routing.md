# Routing and phase contracts

| Current phase | Primary skill | Required output |
|---|---|---|
| `discovery` | `$wechat-minigame-package-inventory` | `packageInventory` |
| `target-identification` on Windows | `$wechat-minigame-file-locator` | `handoff` |
| `target-identification` on macOS | `$wechat-minigame-package-inventory` diff | `handoff` |
| `reverse-analysis` | `$wechat-minigame-reverse-expert` | `reverseManifest`, confirmed engine |
| `restore-specification` | `$wechat-minigame-reverse-expert` | ready `restoreSpec`, `goldenCases` |
| `implementation` for Cocos | `$cocos-minigame-restorer` | `cocosProject` |
| `validation` for Cocos | `$cocos-minigame-restorer` | `validationReport`, required checks |

For a battle-heavy reconstruction, invoke `$wechat-minigame-battlefield-restorer` inside
`restore-specification`, `implementation`, or `validation` to maintain subsystem evidence,
implementation, deterministic-test, and matched-replay gates. The orchestration phase and
primary artifact owner remain unchanged.

## Routing rules

- If the user supplies an exact authorized package path and AppID/version, register the
  target and record the package/handoff; do not force another discovery scan.
- If several AppIDs changed, stay in target identification until a clean comparison or
  user evidence selects one.
- If the engine is not Cocos, do not route to `cocos-minigame-restorer`. Keep the target in
  reverse analysis or report that no implementation skill is installed for that engine.
- If `RESTORE_SPEC.json` has `implementationReady: false`, route back to reverse-expert.
- If visual reference is absent, validation cannot pass `visualBaseline`; record the
  external action needed instead of declaring completion.

## Artifact meanings

- `packageInventory`: schema 2.0 metadata scan/snapshot/diff.
- `handoff`: selected target candidate with AppID/version and paths.
- `reverseManifest`: per-target reverse-expert `manifest.json`; it must declare
  `reverseAnalysisComplete: true` before the reverse-analysis gate passes.
- `restoreSpec`: schema 1.0 evidence-bearing restoration contract.
- `goldenCases`: deterministic combat/wave/base/interval cases.
- `cocosProject`: project directory containing `package.json` and `assets/`.
- `originalReference`: matched screenshot or recording used for fidelity comparison.
- `validationReport`: final confirmed/approximate/missing matrix.
