# RG_ALL_abl16_eff01：动力核心相邻齿轮效率提升 20%

## 配置结论

- `BagLikeAbilityEffectConfig`：品质 4、权重 5、最多一次，无阵容、波次或星级条件；
  原配置 `name` 为空，描述为“动力仓鼠周围的齿轮效率提升 20%”。
- `BagLikeAbilityEffectiveConfig`：`SPECIAL_WORD / POWER_NEAR_WORKER_UP / 2000`。
- `BagLikeBuffManager` 将 `2000` 除以 `10000` 保存为 `workerInc=0.2`；激活状态变化时还会
  发出 `BAGLIKE_WORKER_SPEED_UPDATE`，要求界面立即刷新生产率。

## “周围”的精确范围

该能力与 `POWER_NEAR_ATK_UP` 共用 `BagLilkePowerUtils.isNearPower(itemSid)`：

- 只读取动力核心上、下、左、右四个直接邻格中的齿轮 SID；
- 多格齿轮任一占用格直接贴着核心，整件齿轮生效；
- 只通过其他齿轮连通核心、自身没有占用直接邻格的齿轮不生效；
- 候选区齿轮没有棋盘 SID 邻接关系，不获得加成。

## 数值、余数与表现

`WorkerBar.addBar` 在每次核心触发时先读取齿轮的基础 `perPowerPoint`，相邻且能力激活时再乘
`1 + workerInc`，然后累积到 100 点生产进度。因此 H01 的 10 点变为 12 点，H02 的 8 点
变为 9.6 点；内部 `_trueValue` 保留小数，并在完成时使用 `% 100` 保存余数。

`WorkerBar.updateSpeed` 对 `/s` 生产率使用相同的 1.2 倍。该能力不改变核心一圈的时长，
也不修改产出仓鼠或一次性 WHEEL 技能的 ATK/HP；它只让相邻齿轮更快累积到下一次生产完成。
选择能力前已经累积的进度保持原值，选择后的每次触发开始使用新倍率。

## 复原接入

- `BagLikeProgression.ts` 加入精确卡表和 `POWER_NEAR_WORKER_UP/2000` 倍率。
- `BattlefieldProduction.ts` 提供单次工人进度解析，复用已恢复的核心直接相邻判定。
- `CangshuGame.ts` 在真实生产进度与 `/s` 显示两条路径应用同一倍率；候选区保持基础预览率。

## 验证

- `baglike-traits`：50/50，覆盖精确表值、无条件入池、1.2 倍和一次上限。
- `battlefield-production`：24/24，覆盖直接相邻、仅连通、小数进度余数和生产率显示。
- 全部 7 组规则测试：403/403。
- Golden cases：47/47。
- Cocos Creator 3.8.8 随附 TypeScript：`--noEmit --skipLibCheck true` 退出码 0。
- Cocos 项目静态检查：有效，74 个资源文件，缺失 `.meta` 为 0；该能力不引入新资源。
