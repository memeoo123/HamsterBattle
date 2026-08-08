# H08 impact recovery

H08 primary missile behavior `7001_11` explicitly attaches the lower-layer model
`H21_S1_LOWER`. `ModelConfig` maps it to `spriteFrame/skill/js_aoteman_hill` with center
anchor and scale 1.5.

The resources3 SpriteAtlas contains six `idle` frames in playback order. All use source
size 202×201; exact packed rectangles and offsets are preserved in the Cocos loader.

- Compressed texture UUID: `f0+vw/lF5K4okS3qUKrl8g`
- Decoded UUID: `f0fafc3f-945e-4ae2-8912-dea50aae5f20`
- Native version: `9faca`
- Native sheet: 1076×195 PNG
- SHA-256: `64370d93aa4d70ec5785bf2051bc627bb54781951b4a53f897c63aa095b7e600`

No per-frame duration is present in the recovered model or behavior rows. The current
1/30-second interval is therefore explicit reconstruction inference and remains pending
matched-video calibration.
