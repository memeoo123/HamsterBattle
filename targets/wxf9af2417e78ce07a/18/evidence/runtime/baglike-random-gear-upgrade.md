# BagLike 随机齿轮升级能力

## 结论

[已确认] `RG_ALL_abl10_eff01` 是品质 3、权重 10、最多选择 99 次的即时能力，效果为
“随机 1 个齿轮升级”。它只在第 11 波及以后进入候选池；代表关卡 1004 共 15 波，因此实际
范围为第 11–15 波。

[已确认] 选择后只扫描已经放在棋盘 `_usedMap` 中的物件：排除 `POWER`，并排除配置没有
`nextId` 的满级或不可升级物件。候选栏不在 `_usedMap` 中，因此不会被升级。合法集合按
数值型 `itemSid` 键的升序枚举，再用
`Math.floor(Math.random() * eligible.length)` 选一个。没有合法物件时不消耗随机数，也没有
配置变化；能力次数仍由上层 `addBuff` 正常记录。

[已确认] 命中物件后仅把同一个物件的 `configId` 改为当前配置的 `nextId`，再依次发出
`TAKE_ON_BRICK`、`UPDATE_GRID_BRICK`、`BAGLIKE_UP_ONE_GEAR_LV`。原实现没有清零该物件的
工人进度，也没有处理候选栏物件。

## 证据链

- 解码表 `baglike.BagLikeAbilityEffectConfig.json:309-327`：卡 ID、`WAVE_TIMES/0/10`、
  `weight=10`、`times=99`、`quality=3` 与描述。
- 解码表 `baglike.BagLikeAbilityEffectiveConfig.json:105-108`：相同 ID 消费者类型为
  `GEAR_UPGRAGE`。
- `work/gear-upgrade-analysis/ConditionWaveTimes.ts.deobfuscated.js:3`：运行时取
  `curRound + 1`；当波次落在配置的 min/max 内时 `check()` 返回 `false`，所以 `[0,10]`
  是排除区间，而不是准入区间。
- `work/battlefield-runtime-analysis/formatted/BagLikeBuffManager.ts.deobfuscated.js:115-137,206-208`：
  `addEffective` 将 `GEAR_UPGRAGE` 路由到 `bagLikeMgr.upgradeOneGear()`。
- `work/battlefield-runtime-analysis/formatted/BagLilkeManager.ts.deobfuscated.js:325-333`：合法集合、
  随机索引、原地 `nextId` 替换和三个刷新事件。

## 复原接入与验证

- `cocosProject/assets/scripts/BagLikeProgression.ts` 加入原表卡片、波次排除条件和可注入随机源的
  `chooseBagLikeGearUpgrade`。纯函数先按 SID 升序固定合法集合，返回被选物件和前后 ID，由
  Cocos 层负责变更与刷新。
- `cocosProject/assets/scripts/CangshuGame.ts` 在第 11–15 波的能力抽取中传入当前波次；能力生效时
  从棋盘与候选的统一快照中严格过滤 `location=grid`、非核心且有 `nextId` 的物件，原地刷新
  齿轮显示。`workerPower` 与指向该齿轮的待完成生产任务均保留，因此后续产兵/塔技能/金币
  会消费升级后的配置。
- `node --experimental-strip-types cocosProject/tests/baglike-traits.test.mjs`：20 项通过，覆盖表值、
  第 10/11 波边界、核心/满级/候选排除、首尾随机边界、无合法物件不消费 RNG 和选择层不提前
  修改物件。
- Creator 3.8.8 随附 TypeScript 5.8.2：`--noEmit --skipLibCheck true` 退出码 0。
