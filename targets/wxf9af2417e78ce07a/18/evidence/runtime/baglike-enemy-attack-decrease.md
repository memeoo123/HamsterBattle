# RG_ALL_abl08_eff01：敌方全体攻击降低 5%

## 配置结论

- `BagLikeAbilityEffectConfig`：`quality=2`、`weight=20`、`times=10`、
  `rangeType=MONSTER`，无阵容、波次或星级条件。
- `BagLikeAbilityEffectiveConfig`：`effectType=ATTR`，写入 `ATK_DEC=500`。
- 因此每次选择降低 5%，最多选择十次，即本卡配置最多降低 50%。

## 运行时作用域

`BagLikeBuffManager.addAttr` 将 `MONSTER` 写入共享的 `monsterAttr`，而不是只写普通怪。
`BattleAttr.getBuffValue` 对所有非 Hero 单位先读取 `monsterAttr`，Boss 再叠加
`bossAttr`，精英再叠加 `eliteAttr`。所以该卡同时影响普通怪、精英怪和 Boss。

`BattleUnit.getAttrValue(ATK)` 的公式为：

```text
基础攻击 × max(0, 1 + (ATK_INC - ATK_DEC) / 10000)
```

属性在攻击求值时从共享管理器读取，因此已经生成在场的敌人和以后生成的敌人都会立即使用
新倍率，不需要重写单位的基础攻击字段。

## 弹丸边界

发射弹丸时，`FightSkillInfo` 把行为中的攻击值复制进 Bullet，同时保留 `casterUid`。
命中结算时，`FightFormula.fight` 优先读取仍能由 `StateMemory` 找到的施法者实时攻击；只有
施法者已离场时才回退到 Bullet 的发射快照。因此：

- 施法者仍存活：在途弹丸会受到选择后减攻的实时影响；
- 施法者已死亡并离场：仍继续飞行的弹丸保持发射时攻击快照；
- 非弹丸行为：使用仍存活施法者的实时攻击。

## 复原接入

- `BagLikeProgression.ts` 加入精确卡表、十次上限和共享敌军攻击倍率。
- `CangshuGame.ts` 对敌方普通怪、精英和 Boss 统一应用实时倍率，并保存发射攻击快照。
- `BattlefieldKernel.ts` 隔离“存活读实时、死亡弹丸读快照”的确定性选择规则。

## 验证

- `baglike-traits`: 40/40；覆盖表值、无条件入池、1 次 0.95、10 次 0.5、次数封顶和公式归零保护。
- `battlefield-kernel`: 29/29；覆盖存活弹丸实时值、死亡弹丸快照和非弹丸实时值。
- 全部 7 组规则测试：384/384。
- Golden cases：47/47。
- Cocos Creator 3.8.8 随附 TypeScript：`--noEmit --skipLibCheck true` 退出码 0。

