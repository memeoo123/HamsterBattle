# BagLike 刷新与手动摆放证据

目标：`wxf9af2417e78ce07a/18`。以下结论来自用户授权的本地包体与已解码配置。

## [已确认] 刷新约束

- `baglike.BagLikeConstantConfig` 的 `BAGLIKE:NORMAL_REFRESH_COST` 为 `5:15;`，即普通刷新消耗物品 5（局内金币）15 个。
- `BagLikeView.onPrepare` 每个准备回合将 `refreshTimesPerRound` 归零、将 `hasRefreshFromAd` 归零，并自动调用一次 `refreshBrick(Prepare)` 生成候选。
- 普通刷新按钮仅在 `refreshTimes > 0` 时扣除 `realRefreshCostArr`；`refreshTimes` 初始为 0，所以本局第一次普通刷新免费，此后每次 15 金币。
- 普通刷新没有独立的硬次数上限；资源不足时不会刷新。广告刷新通过 `hasRefreshFromAd` 限制为每个准备回合一次。
- 证据：
  - `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeConstantConfig.json`
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/BagLikeView.ts.deobfuscated.js:3`（`onPrepare`、刷新按钮、`updateRefreshBtn`、`onRefreshBrickFromAD`）
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/BagLilkeManager.ts.deobfuscated.js:3`（`refreshBrick`、`refreshTimes`、`refreshTimesPerRound`）

## [已确认] 刷新后必须手动摆放

- `refreshBrick` 发出 `REFRESH_BRICK`，`ChooseCom.createBricks` 清空旧候选并在候选容器中创建新齿轮；它不写入战场网格。
- 候选齿轮开始拖拽时发出 `DRAG_BRICK_BEGIN`，`ChooseCom.onDragBrickBegin` 将其从候选栏移除。
- `BagLikeView.onDragBrickMove` 根据落点和形状调用 `checkBrick` / `checkGrid`。合法落点执行 `setBrick` / `setGrid` 与 `TAKE_ON_BRICK`；非法落点发出 `TAKE_OFF_BRICK`，候选回到 `ChooseCom`。
- 开战时 `ChooseCom.onRoundStart` 清空尚未放置的候选。
- 证据：
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/ChooseCom.ts.deobfuscated.js:3`
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/BrickCom.ts.deobfuscated.js:3`
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/BagLikeView.ts.deobfuscated.js:3`

## [已确认] 关卡 1001 的静态候选与形状

- 首次挑战的前八批候选由 `TrunkInstanceConfig[1001].staticBricks` 固定：
  1. `H0101`
  2. `H0201, C01`
  3. `G02`
  4. `H0401, H0101, H0201`
  5. `H0101, H0401, H1201`
  6. `H1201, H0201, G02`
  7. `H0401, H0202, H0203`
  8. `H1202, H0203, H0201, G03`
- `BagLikeShapeConfig`：shape 1 为单格；shape 2 为横向两格；shape 3 为纵向两格；shape 5 为纵向三格。
- `G02/G03` 是扩展格道具，只能完整落在尚未解锁的区域，放置后解锁对应格子。
- 证据：
  - `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/trunkinstance.TrunkInstanceConfig.json`
  - `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeItemConfig.json`
  - `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeShapeConfig.json`
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/BagLilkeManager.ts.deobfuscated.js:3`（`getStaticItemsIds`）

## 当前实现边界

- 刷新经济、候选替换、手动拖放、形状占位和扩展格交互已按上述证据实现。
- 八批静态候选之后，原版进入权重掉落；当前代表关卡实现使用可玩的确定性候选回退，权重池仍需单独还原。
- H12 的原版雷云攻击技能与完整合成链尚未在代表关卡实现中恢复，不把它们标记为已确认完成。
