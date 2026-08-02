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
- 普通齿轮落在已占用的开放格时并不判定失败：`takeOnBrickComplete` 先尝试合成，不能合成则由
  `setBrick` 放入新齿轮；所有与新形状相交的旧齿轮会整件清除占格并通过 `TAKE_OFF_BRICK`
  退回 `ChooseCom`。这是一种“覆盖并退回”，不是交换位置，也不会销毁旧齿轮。
- 已在背包内的齿轮拖到无效区域时同样执行 `clearOldBrick`，随后以 `showIndex=-1` 发出
  `TAKE_OFF_BRICK`，因此玩家可以主动把已摆放齿轮取回候选栏以释放空间。
- 开战时 `ChooseCom.onRoundStart` 清空尚未放置的候选。
- 证据：
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/ChooseCom.ts.deobfuscated.js:3`
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/BrickCom.ts.deobfuscated.js:3`
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/BagLikeView.ts.deobfuscated.js:3`
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/BagLilkeManager.ts.deobfuscated.js:3`（`clearOldBrick`、`setBrick`）

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

## [已确认] 静态候选退出条件与权重掉落

- `getStaticItemsIds` 只在“挑战次数不大于 1”或关卡属于永久静态列表时返回静态批次；
  永久静态关卡为 `1001;1002;1006;1007`。1004 非首次挑战从第一次准备发牌起即进入权重掉落。
- 每次 `refreshBrick` 都先增加 `totalRefreshTimes`。静态批次耗尽后不会重复最后一批，
  而是调用 `getCurDrawIds`，并对每个掉落 ID 分别调用一次 `RewardMgr.getRewards`。
- 非广告的第一次权重发牌使用 `3000;3000;3000`；仍有未解锁格时的后续普通刷新使用
  `3001;3002;3003`；无未解锁格时使用 `3002;3002;3002`；广告刷新使用
  `3002;3003;3004`。
- `3000` 只含一级英雄池 `3014`；`3001..3004` 按原表在一级 `3014`、二级
  `3015`、三级 `3016`、格子 `3030`、金币/治疗分支 `3034` 间加权，再递归抽取具体物品。
- 各候选位独立抽取，原运行时没有“连续批次强制不同”或“同批不重复”规则，因此概率重复是合法结果。
- 证据：
  - `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/baglike.BagLikeConstantConfig.json`
  - `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/trunkinstance.TrunkInstanceConstantConfig.json`
  - `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/reward.RewardDropConfig.json`
  - `targets/wxf9af2417e78ce07a/18/work/refresh-placement-analysis/BagLilkeManager.ts.deobfuscated.js:3`

## 当前实现边界

- 刷新经济、候选替换、静态退出条件、`3000..3004` 基础权重树、手动拖放、形状占位和
  `G01..G09` 扩展格交互已按上述证据实现；1004 默认按非首次挑战运行。
- 当前权重池只保留已经实现玩法的英雄系列 `H01/H02/H03/H04/H12/H13` 与金币、格子；
  玩家账号实际解锁表、H11 治疗齿轮、金币数量临时权重、最多五英雄类型替换和每七次强制格子
  仍需继续接入，不能据此宣称完整掉落池已一比一完成。
- H12 的原版雷云攻击技能与完整合成链尚未在代表关卡实现中恢复，不把它们标记为已确认完成。
