# Gear connector art verification — 2026-08-09

`baglike.BagLikeShapeConfig` defines the connector resource and `panelRotate`
for every multi-cell footprint used by the reconstruction:

| Shape IDs | Footprint | Source panel | Rotation |
|---|---|---|---|
| 2 / 3 | horizontal / vertical two-cell | `panel1` | `0 / 90` |
| 4 / 5 | horizontal / vertical three-cell | `panel3` | `90 / 0` |
| 6 / 7 / 8 / 9 | four L orientations | `panel2` | `-90 / 0 / 180 / 90` |
| 10 | 2×2 square | `panel4` | `0` |

The Cocos renderer consumes those exact four atlas frames from recovered
`bagLike_0.png`, centers them on the footprint, applies the table rotation, and
uses the recovered level tint before layering exact `cl1..cl5` cog cells above
the connector. All currently supported producer families resolve to one of the
listed source shapes.

This review found and corrected one local crop mismatch: `cl1.png` starts at
atlas `(1024, 1)`, not `(1024, 0)`. The other four cog rectangles and all four
connector rectangles already matched `bagLike.layout.json`. The developed
level-1004 capture exercises panel1 (H03/H02) and panel2 (H13), including the
zero- and 90-degree orientations. The 16-assertion presentation contract locks
the complete panel/rotation mapping.
