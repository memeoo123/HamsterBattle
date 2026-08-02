# BagLike EXP 与战斗特性选择证据

目标：`wxf9af2417e78ce07a/18`  
日期：2026-08-01

## 已确认运行时

- `BagLikeTopItem.onAddExp` 仅在 `BattleSetting.lvMode == EXP_UP_BUFF` 时处理经验；
  `TRUNK_INSTANCE` 的 `lvMode=1`，对应 `EXP_UP_BUFF`。
- 经验增加量为怪物经验乘当前 EXP 倍率。到达当前上限后只执行一次升级，余数按旧上限
  取模，然后暂停战斗并打开 `BagLikeBuffWin(level)`。
- `BagLikeLevelConfig`：1→2 需要 20，2→3 需要 50，之后每级需要 100。
- M02、M03、M07 每只提供 5 EXP；Boss02、Boss03、Boss07 每只提供 100 EXP。
- `BagLikeBuffWin` 构造时发出暂停；关闭时恢复战斗。默认请求 3 个候选，点击一张后添加
  对应能力并关闭。
- `BagLikeBuffManager.getChooseBuff(3)` 每次创建新的权重容器，先排除已达 `times` 上限、
  当前已摆放英雄范围不匹配以及 `conditions/verifys` 不通过的能力，再按 `weight` 做一次
  不重复抽取。“换一批”重新调用同一抽取链，而不是轮换固定数组。
- `BagLikeBuffWin.refreshBuff` 的首次打开分支以 `_buffs == null` 为条件：可选地加入关卡
  `staticBuffs` 后，用不带最低品质参数的 `getChooseBuff(3 - n.length)` 补满，因此普通升级
  三选一没有紫色保底。
- 只有 `_buffs` 已存在后的“换一批”分支，才先调用 `getChooseBuff(3)`，再读取
  `BAGLIKE:BUFF_REFRESH_MIN_QUALITY=4`；若三张均低于该品质，随机替换一个槽位，并从最低
  品质要求 4 开始逐级回退。`QualityConfig` 的品质 4 对应 `jn_purple`，即紫色。
- “换一批”对应 `BAGLIKE:AD_BUFF_CHANGE`，上限 10；“全都要”对应
  `BAGLIKE:AD_BUFF_ALL`，上限 3。原版两者均先播放广告，“全都要”把当前三张全部加入。

## 截图中三张能力的精确配置

| ID | 名称 | 效果 | 运行时落点 |
|---|---|---|---|
| `RG_ALL_abl13_eff01` | 法术强化·1 | 所有法术齿轮攻击 +5% | `ATTR / ATK_INC=500`，范围 H11–H15，可叠 99 次 |
| `RG_H02_abl02_eff01` | 分裂射击·1 | 射手 30% 概率额外攻击 1 个敌人 | 添加技能 `2001_2`；被动概率 3000/10000，额外目标半径 250、数量 1 |
| `RG_H03_abl02_eff01` | 可乐加冰 | 法师攻击 30% 概率冰冻敌人 | 添加技能 `3001_2`；概率 3000/10000，Buff `3001_bf2` 持续 3000ms |

## 证据路径

- `work/ui-module-analysis/modules/BagLikeTopItem.ts.deobfuscated.js`
- `work/battlefield-runtime-analysis/BagLikeBuffManager.ts.deobfuscated.js`
- `work/trait-selection-analysis/BagLikeBuffWin.ts.deobfuscated.js`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/all-tables/`
  下的 `BagLikeLevelConfig`、`BagLikeConstantConfig`、`BagLikeAbilityEffectConfig`、
  `BagLikeAbilityEffectiveConfig`、`SkillConfig`、`PassivitySkillConfig`、`BehaviorConfig`、
  `BuffConfig` 与 `BuffGroupConfig`。

## 当前还原边界

- 截图中的三张牌仅证明它们属于当次可用池，不再作为固定候选。
- 当前工程对所有已实现效果使用原表权重、品质、次数上限和阵容范围；普通升级按权重随机
  抽三张且不保证紫色，只有“换一批”执行品质 4 保底。两条路径都会重新抽取，而不是固定轮换。
- `RG_ALL_abl07_eff01` 的 `EXP_GAIN/5000` 已沿 `BagLikeBuffManager.getExpMultiple →
  BagLikeTopItem.onAddExp` 接入：后续每次 EXP 通知乘 1.5，并保留原版一次通知最多升一级与
  小数余数语义。
- 原版完整池中尚未实现的换技能、被动、特殊词条与条件型效果暂不进入抽取池，避免出现
  “抽得到但点击无效果”的伪还原；广告播放与玩家账号英雄星级条件仍待接入。
