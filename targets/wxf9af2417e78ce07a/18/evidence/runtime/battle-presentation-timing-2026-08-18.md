# Battle presentation and timing audit — 2026-08-18

Target: `wxf9af2417e78ce07a/18`

## Closed from exact source/cache evidence

| Surface | Source result | Reconstruction result |
|---|---|---|
| Get-grid glow | `UI10025 → spine/ui/zhandou_sg/zhandou_sg1`, loop `idle`; bound by `BagLikeView.adGridBtn.modelNode` | Recovered Spine is bound to the developed get-grid control |
| Refresh glow | `UI10026 → spine/ui/zhandou_sg/zhandou_sg2`, loop `idle`; bound by both refresh model nodes | Recovered Spine is bound to advertisement and normal refresh controls |
| H03 freeze | `hit_binkuai`, loop `idle`, 3-second lifetime | Exact Spine, lifetime and freeze audio path are retained |
| H03 transform | `hit_lizi`, one-shot, scale `0.5` | Exact Spine, scale, completion cleanup and transform audio are retained |
| H12 lightning/paralysis | `H12_S1 → chilun_leiyun`, `attack`, scale `0.8`; hit sound `bullet_leiyun` | Exact skill Spine starts at cast target; hit audio plays at delayed impact |
| H04 shield-wall status | `4001_bf3/4001_bf4` have `modelId=null` and `modelId2=null` | No speculative shield aura is added |
| H12 paralysis status | `LY_bf1202/1203` have `modelId=null` and `modelId2=null` | No speculative persistent paralysis model is added |
| Result controls | `BattleWinView`/`BattleFailView` open immediately, then `GameTimer.once(MB)` with `MB=300ms` reveals buttons/rewards | Result overlay opens immediately and its action group is revealed after exactly `0.3s` |

The two recovered `164×124` glow textures are byte-identical. Skeleton-to-model
assignment follows the cache request order and is recorded as
`inferred-by-cache-request-order`, not as a same-frame visual proof. Source hashes,
consumers and atlas records are in
`evidence/assets/original/presentation-cache-2026-08-18/manifest.json`.

## Confirmed but not locally recoverable yet

- Victory audio: `audio/sound/battle_win`, configured duration `2.378917s`, played
  immediately when the victory view opens.
- Defeat audio: `audio/sound/battle_fail`, configured duration `2.2485s`, played
  immediately when the defeat view opens.
- `BattleFailView` reuses the victory-view timing and only overrides the sound.

Neither audio file is present in the authorized cache. The `ui/battle` FairyGUI
package is also absent, so the exact result-panel art/transition cannot be recovered
without inventing data. The generic result panel is retained, with only the exact
300ms control timing applied.

## Validation and remaining same-frame work

- Dedicated test: `cocosProject/tests/battle-presentation-timing.test.mjs`.
- Creator 3.8.8 Web Mobile build completed in 5 seconds, PID `78048`, exit code `36`,
  output `cocosProject/build/role-presentation-validation-20260818/web-mobile`.
- Project check: 282 assets, zero missing metadata, TypeScript pass.
- Full same-frame visual/audio comparison remains pending until the user reaches a
  win or loss and the result package/audio are downloaded. A representative original
  recording is also still needed to visually confirm the two glow skeleton mappings
  and H08/H0905 frame timing.

