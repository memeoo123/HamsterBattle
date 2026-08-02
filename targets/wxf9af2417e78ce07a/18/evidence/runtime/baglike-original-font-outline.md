# BagLike original font and outline evidence

Target: `wxf9af2417e78ce07a/18`

## Font asset

The authorized `resources3/config.cce0e.json` bundle maps path index `283` to
`font/default` with type `cc.TTFFont`. Its compressed UUID is
`a62EheLq5CzLlYhlVVUGr0`, which resolves to
`a6d8485e-2eae-42cc-b958-865555506af4`; native version `be5b6` points to the bundled
`default.ttf`. The recovered file has SHA-256
`072c8fe3f6d86fad4cf3be45f0613485930d2c2169e4239a1661ef7452b8273a` and identifies
itself as `TsangerYunHei W08 / Regular` (`TsangerYunHei-W08`).

## FairyGUI text styles

The following records were decoded directly from
`evidence/fairygui/bagLike.a597d.bin`. Offsets are byte offsets in that evidence file.
The record order follows FairyGUI `GTextField.setup_beforeAdd`: font, size, color,
alignment/style flags, then outline color and width.

| Component / field | Record start | Style start | Fill | Outline | Width |
|---|---:|---:|---|---|---:|
| common `HeaderItem/lbCnt` | 2128 | 2190 | `#FFFFFF` | `#060500` | `2.0` |
| bagLike `waveTxt` | 20116 | 20172 | `#FBFBFB` | `#0C0C0C` | `2.0` |
| common generic button `title` | 1629 | 1691 | record-defined | `#000000` | `3.0` |
| bagLike bottom button `title` | 10011 | 10073 | record-defined | `#000000` | `3.0` |

## Implementation and validation

`CangshuGame.ts` loads `resources/original/default.ttf` before constructing the scene,
assigns it to generated labels, and applies the confirmed outline treatments to HUD
counters, wave text and bottom button titles. A Cocos Creator 3.8.8 release Web build
contains a byte-identical TTF and the 750x1334 capture
`evidence/visual/reconstruction/2026-08-02/preparation-initial-original-font-outline.png`
shows the font and outlines in the preparation state.

This evidence confirms the visible categories above. It does not claim that every text
field in every unvisited popup has been decoded or matched.
