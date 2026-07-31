# VALIDATION_REPORT

## Baseline

- Target: `wxf9af2417e78ce07a/18`
- Representative level: `1001 / 宁静森林`
- Original reference: 尚无同分辨率、同阶段、同时间点截图或录像
- Original Cocos version: `3.8.2`
- Reconstruction Cocos version: `3.8.8`
- Resolution: `750 × 1334` portrait（已纠正）
- Validation date: 2026-07-31

## Automated checks

| Check | Result | Evidence |
|---|---|---|
| Restore spec structure | Pass | validator: `valid=true` |
| Restore spec ready gate | Pass | `implementationReady=true`，无阻塞 unknown |
| Golden cases | Pass | `22/22`；wave 直接读取 `CangshuGame.ts`，另覆盖刷新成本、金币不足、多格摆放、扩展格和 4 个状态转换案例 |
| Asset metadata | Pass | 22 asset files, 0 missing `.meta` |
| TypeScript | Pass | Creator 3.8.8 project declarations, exit code 0 |
| Creator project open | Pass | pre-existing main process PID 42220 opened `cocosProject` |
| Main startup rendering | Pass | 修复同节点重复 Renderable2D 后，显式 Main UUID 预览显示完整布阵首屏且无新增同类警告 |
| Post-change interactive preview | Pending | 需要在现有 Creator 窗口执行一次完整点击冒烟测试 |
| Matched visual baseline | Pending | 尚无原游戏匹配截图/录像 |

## Fidelity matrix

| Area | Confirmed | Approximate / pending |
|---|---|---|
| Scene | 750×1334、战场 750×300、兵营与 HUD/操作区 FairyGUI 锚点 | 背景九宫格裁切、最终纹理比例需预览 |
| UI | 7×5、100×100 格子、730×529 容器、候选栏、手动拖放、按钮坐标、准备层进出流程 | GList 内边距、字体和 atlas 子图皮肤 |
| Refresh | 自动准备发牌、首次普通刷新免费、后续 15 金币、每准备回合一次广告刷新、刷新替换未摆放候选 | 八批静态候选后的权重掉落 |
| Units | H01/H02/M02/M03/Boss03 属性、Boss03 独立模型配置、Spine 资源、方向与基础动画 | H04 暂用绘制回退；H12 技能、实机单位缩放、排序、特效 |
| Combat | 普通伤害顺序、取整/最小值、冷却、0.3s 命中延迟、倍率链 | 主动技能、状态效果 |
| Rounds | 关卡 1001 五波完整排期与真实清怪胜利条件 | 实际点击通关时长与手感 |
| Audio/effects | 胜败流程已实现 | 声音、命中/技能/结算特效 |

## Completion decision

关卡 1001 已达到“实现可运行、静态与数值校验通过”的状态；在完成 Creator
窗口内的一次完整交互冒烟测试前，不标记为最终验收完成。像素级一致性仍受缺失的
匹配原游戏视觉基线限制。
