# RG_ALL_abl17_eff01：低血量时立即恢复 50% 主基地生命

## 配置结论

- `BagLikeAbilityEffectConfig`：品质 4、权重 999、`times=99`，无英雄范围、波次或星级验证；
  条件为 `BASE_HP / 0 / 50`，描述为“立即恢复 50% 主基地生命”。
- 该卡带 `noRestore=1`。`BagLikeBuffManager.addBuff` 因此不会把它写入 `_buffTimesMap`，但仍会
  调用 `addEffective`；它是即时消耗效果，不是永久 Buff，可以在以后满足条件时再次出现。
- `BagLikeAbilityEffectiveConfig`：`SPECIAL_WORD / HEAL_HOME / IMMED / 5000`。

## 入池条件

从原始 `subpackages/game/game.js` 隔离提取的 `ConditionBaseHp` 读取
`BagLikeManager.homeHpPercent / 100`，并执行包含端点的判断：

```text
currentPercent >= min && currentPercent <= max
```

`BagLikeView.onHpChange` 把基地血量保存为
`floor(10000 * currentHp / maxHp)`，所以该卡只在量化后的基地生命比例处于 `0%–50%`（含
50%）时进入抽取池；满血或超过 50% 时不会参与权重抽取。

## 治疗数值与时机

`BagLikeBuffManager.addSpecialWord` 对 `HEAL_HOME / IMMED` 立即调用
`BattleManager.healHome(5000)`。消费者按以下顺序执行：

1. 读取我方基地 `maxHp`；
2. 计算 `floor(maxHp * 5000 / 10000)`；
3. 立即加入当前 HP，由基地单位的 `heal` 路径封顶到 `maxHp`；
4. 创建绿色治疗数字。

因此代表关卡最大生命 500 时固定恢复 250 点；当前 200 变为 450，当前 300 封顶为 500。
效果不是“恢复已损生命的 50%”，也不会提高基地最大生命。

## 复原接入

- `BagLikeProgression.ts` 加入精确卡表、包含端点的基地 HP 条件、`noRestore` 语义、百分比量化
  和即时治疗函数。
- `CangshuGame.ts` 在每次初抽/刷新时传入实时基地比例；选择后立即更新基地 HP、两处血条和
  绿色治疗数字，且不写入永久特性栈。

## 验证

- `baglike-traits`：59/59，覆盖精确表值、0%/50%/50.01% 边界、`noRestore`、最大 HP
  比例治疗、向下取整和满血封顶。
- 全部 7 组规则测试：412/412。
- Golden cases：47/47。
- Cocos Creator 3.8.8 随附 TypeScript：`--noEmit --skipLibCheck true` 退出码 0。
- Cocos 项目静态检查：有效，74 个资源文件，缺失 `.meta` 为 0；该能力不引入新资源。
