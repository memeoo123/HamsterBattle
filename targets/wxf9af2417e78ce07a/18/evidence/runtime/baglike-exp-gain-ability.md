# BagLike 经验强化能力

## 结论

[已确认] `RG_ALL_abl07_eff01`（经验强化）为品质 4、权重 5、最多选择 1 次，效果参数是
`EXP_GAIN/5000`。其 `WAVE_TIMES/11/15` 条件在运行时是排除区间，所以代表关卡 1004 中
只会在第 1–10 波进入候选池。

[已确认] 选择该能力不会改写怪物 EXP。`BagLikeBuffManager.addExpGain` 把 5000 累加到
`_expGain`，`getExpMultiple` 返回 `1 + _expGain / 10000`。之后每个怪物死亡产生的 EXP
通知都在 `BagLikeTopItem.onAddExp` 中先乘这个倍率。因此普通怪由 5 变为 7.5 EXP，Boss
由 100 变为 150 EXP。

[已确认] 倍率不会改变升级时序：同一次 EXP 通知最多触发一次升级，余数仍使用触发前的当前
等级阈值取模。比如 Lv.1 已有 15 EXP，再收到普通怪的 `5 × 1.5 = 7.5`，结果是升到 Lv.2
并保留 2.5 EXP，而不是取整或连续升级。

## 证据链

- `reverse-work/resources/.../baglike.BagLikeAbilityEffectConfig.json`：
  `RG_ALL_abl07_eff01` 的品质 4、权重 5、次数 1、`WAVE_TIMES/11/15` 和描述。
- `reverse-work/resources/.../baglike.BagLikeAbilityEffectiveConfig.json`：消费者为
  `EXP_GAIN`，参数 `[5000]`。
- `work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js:77-78`：
  `getExpMultiple = 1 + _expGain / 10000`。
- 同文件 `:120-121,189-190`：`EXP_GAIN` 路由到 `addExpGain`，并把参数累加到 `_expGain`。
- `work/ui-module-analysis/modules/BagLikeTopItem.ts.deobfuscated.js:3` 的 `onAddExp`：
  本次 EXP 乘 `getExpMultiple()`，达到阈值后只递增一级，并按旧 `expBar.max` 取模。
- `work/gear-upgrade-analysis/ConditionWaveTimes.ts.deobfuscated.js:3`：区间内检查失败，当前波次
  使用 `curRound + 1`。

## 复原接入与验证

- `BagLikeProgression.ts` 加入原表卡片及 `traitExpMultiplier`，按活动能力累加万分比参数。
- `CangshuGame.ts.addExperience` 在调用既有 `addBagLikeExp` 前读取当前能力倍率；怪物基础 EXP、
  阈值和升级弹窗路径均未改动。
- `baglike-traits.test.mjs`：33 项通过，覆盖精确表值、波次、一次上限和 1.5 倍倍率。
- `battlefield-scenario.test.mjs`：28 项通过，覆盖 15 + 7.5 → Lv.2/2.5 的小数余数。
- 全部 7 组规则测试合计 374 项通过；47 个 golden cases、Creator TypeScript 和 Cocos
  工程结构检查通过。
