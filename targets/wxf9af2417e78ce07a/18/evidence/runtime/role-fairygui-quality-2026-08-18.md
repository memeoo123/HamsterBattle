# Role FairyGUI and `image_quality` reconstruction — 2026-08-18

Target: `wxf9af2417e78ce07a/18`

## Exact recovered layout

`ui_hero.package.bin` now scans all 12 declared components, including source-less
FairyGUI Loader/List/Text/Group objects that the earlier byte scanner skipped. The
evidence file is
`evidence/assets/original/post-unlock-cache-2026-08-18/ui_hero.layout.json`
(SHA-256 `6119df8c71191097729bb6e0567342833c9a73f86dc864836569f6b8988210b2`).

- `HeroMainView`: `750×1334`; `bg (0,-146,750,1626)`,
  `top_bg (0,-380,750,320)`, `listHero (31,200,698,1000)`,
  `btnSkin (574,145)`, `btnHandBook (684,145)`, and
  `gMenu (534,105,190,80)`.
- `listHero`: FlowHorizontal, 3 columns, 10 px column gap, 18 px line gap.
- `HeroItem`: `226×326`, with 11 recovered children. The runtime uses the exact
  background, portrait, level-frame, fragment-bar, name, level and quality-shape
  coordinates from this component.
- `HeroInfoView`: all 16 children are recovered. `HeroUpAniComp` is centered at
  FairyGUI `(374,341)`, size `708×380`, mapped to Cocos `(-1,326)`.

The package's legacy structured decoder still reports a section-level parse error;
the bounded object-record scanner is the authoritative layout source here. It
identifies every declared component and the complete child counts above without
inventing relations or controller states.

## `image_quality` atlas

The exact import-pack parser produced
`cocosProject/assets/resources/data/image-quality-frames.json`:

- logical path: `image/quality`;
- atlas UUID: `95uJP+j/9NzKUIVSSxFJVN`;
- image size: `1586×512`;
- 42 SpriteFrame records, including offsets, source sizes, pivots and cap insets.

The role configuration maps P01 to quality 3 (blue) and P02/P03/P04 to quality 4
(purple). The runtime now consumes the corresponding exact frames:

- blue: `blue_hero_frame`, `blue_hero_lv`, `blue_hero_shape`;
- purple: `purple_hero_frame`, `purple_hero_lv`, `purple_hero_shape`.

## Validation

- Dedicated test: `cocosProject/tests/role-fairygui-quality.test.mjs`.
- Creator 3.8.8 import/build: pass; the quality frame map has generated metadata.
- Cocos project check: 282 assets, 0 missing metadata, TypeScript pass.
- Web Mobile build: `cocosProject/build/role-presentation-validation-20260818/web-mobile`.

