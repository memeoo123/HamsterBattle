# VALIDATION_REPORT

## Baseline

- Target: `wxf9af2417e78ce07a/18`
- Representative level: `1001 / 宁静森林`
- Original reference: 缺失；尚无同分辨率、同阶段、同时间点截图或录像
- Original Cocos version: `3.8.2`
- Reconstruction Cocos version: `3.8.8`
- Original resolution: `750 × 1334` portrait
- Current implementation resolution: `750 × 1000`（已确认差异）
- Migration date: 2026-07-31

## Automated checks

| Check | Result | Evidence |
|---|---|---|
| Restore spec structure | Pass | `targets/wxf9af2417e78ce07a/18/generated/RESTORE_SPEC.json`; validator reports `valid: true` |
| Restore spec ready gate | Pending | `implementationReady: false`; exact anchors/UI geometry/original reference unresolved |
| Golden cases | Pass | 13/13 damage, wave, base-HP and interval cases passed |
| Asset metadata | Pass (static) | Cocos checker: 22 asset files, 0 missing `.meta`, no errors/warnings |
| TypeScript | Pass (historical) | Existing `RESTORE_PROGRESS.md`; not rerun during this migration |
| Creator preview/build | Pending | Previous bounded headless attempt stalled; no successful preview/build evidence |
| Visual baseline | Pending | No matched original capture |

## Fidelity matrix

| Area | Confirmed | Approximate | Missing | Next verification |
|---|---|---|---|---|
| Scene | Original forest background and portrait orientation | Current crop and battlefield/grid split | Pixel-accurate anchors at 750×1334 | Correct design height, then compare matched captures |
| UI | 7×5 backpack, centered 3×3 unlock area, power index 17 | Spacing, layer order, fonts and skins | Matched original rectangles | Capture deployment phase and measure geometry |
| Units | H01/H02/M02/M03 assets and core attributes | Current scale, sorting and fallback rendering | Full later-level model coverage | Preview level 1001 and compare unit scale/facing |
| Combat | Regular damage order, floor/minimum, cooldown/hit delay, multiplier chain | Some active skills/status effects | Remaining skills/effects | Add evidence-backed cases after baseline acceptance |
| Rounds | Complete five schedules for level 1001 | Runtime presentation timing | Matched motion capture | Compare each spawn timestamp in preview |
| Audio/effects | None accepted | None | Sounds, hit/skill/result effects | Recover and map after visual baseline |

## Completion decision

Target is **not complete**. Golden numeric behavior and static asset metadata pass, but the
restore-ready gate, successful preview/build, and visual baseline remain open. Existing
Cocos implementation is registered as an early downstream artifact and does not bypass
the missing evidence gates.

