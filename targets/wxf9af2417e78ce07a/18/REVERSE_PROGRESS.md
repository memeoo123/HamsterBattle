# REVERSE_PROGRESS — `wxf9af2417e78ce07a/18`

## 单一目标概览

- 授权范围：用户授权的本地包体分析与 Cocos 工程还原
- AppID/版本：`wxf9af2417e78ce07a/18`
- 引擎：Cocos Creator `3.8.2`
- 当前阶段：Cocos 代表关卡实现与验证
- 还原契约：`implementationReady=true`
- 活动工程：`E:\Projects\weichatAnalysis\cangshu\cocosProject`
- 更新日期：2026-07-31

## 阶段进度

| 阶段 | 状态 | 关键输出/证据 |
|---|---|---|
| 输入盘点、解包、引擎识别 | 已完成 | 主包、game 分包、Cocos 3.8.2 |
| 静态逻辑与关卡 Schema | 已完成代表关卡主链 | 118 表、200 关、2,978 引用回合 |
| FairyGUI 几何恢复 | 已完成关键组件 | `evidence/fairygui/bagLike.layout.json` |
| 真实胜负规则恢复 | 已完成 | `evidence/runtime/BattleTrunkChapterVo...`、`BattleInstanceController...` |
| 还原交接契约 | 已完成 | ready gate 通过、22/22 golden cases（含刷新、手动落位和真实状态转换） |
| Cocos 代表关卡实现 | 已完成静态实现 | 750×1334、五波清怪、我方兵营失败、胜败闭环 |
| Creator 交互冒烟 | 待现场执行 | 当前工程已在 PID 42220 的 Creator 窗口中打开 |
| 匹配视觉验收 | 待原始参照 | 缺少同关卡/同阶段截图或录像 |

## 本轮关键纠正

- 原工程的 `750 × 1000` 已改为原版 `750 × 1334`。
- 原工程虚构的“攻击 4000 HP 敌方兵营”已删除。主线运行时将 `enemyHomeHp`
  设为 `-1`，每波真实胜利条件是排期结束且敌人清零。
- 原版战场、兵营、100 像素棋盘、操作按钮和顶部 HUD 锚点已由 FairyGUI 包确认，
  不再依赖类型游戏猜测。
- 原版刷新不是自动摆放：`refreshBrick` 只向 `ChooseCom` 发出候选，玩家通过
  `DRAG_BRICK_BEGIN -> TAKE_ON_BRICK` 手动落格；非法落点由 `TAKE_OFF_BRICK` 返回候选。
- 原版本局首次普通刷新免费，之后每次 `15` 金币；广告刷新每个准备回合一次，
  普通刷新没有独立硬次数上限，但受局内金币约束。

## 当前非阻塞缺口

- 需要在 Creator 中完成一次完整点击通关冒烟测试。
- 需要原游戏匹配截图/录像做像素级视觉验收。
- 声音、技能、状态效果和更完整的 atlas 皮肤属于下一轮精修，不阻塞关卡 1001
  的基础可玩闭环。
- 八批静态候选后的权重掉落与 H12 雷云技能/完整合成链尚未还原。
