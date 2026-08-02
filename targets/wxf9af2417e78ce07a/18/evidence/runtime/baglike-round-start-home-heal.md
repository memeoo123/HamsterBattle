# RG_ALL_abl18_eff01：每轮开战前恢复基地生命

## 结论

- 能力卡 `RG_ALL_abl18_eff01` 的原表权重为 `999`、品质为 `4`、最多选择 `1` 次。
- 只有主基地当前生命比例为 `0%–75%`（包含端点）时才进入候选池。
- 选中时不会立即治疗。能力会持久化，并在之后每次
  `BAGLIKE_BATTLE_ROUND_START` 通知时恢复主基地最大生命的 `10%`。
- 治疗量为 `floor(maxHp × 1000 / 10000)`，实际生命封顶到 `maxHp`；原版显示绿色治疗数字。
- 它不在回合结束时触发。若在战斗中的升级弹窗里选中，当前波不会补发开战通知，第一次治疗发生在下一波开战时。

## 原始配置

`baglike.BagLikeAbilityEffectConfig.json:473-492`：

- `conditions = [["BASE_HP", 0, 75]]`
- `weight = 999`
- `times = 1`
- `quality = 4`
- `noRestore = 0`
- 描述为“每次战斗开始前恢复 10% 主基地生命”

`baglike.BagLikeAbilityEffectiveConfig.json:173-180`：

- `effectType = "SPECIAL_WORD"`
- `param = ["HEAL_HOME", "ROUND", 1000]`

## 运行时链路

1. `BagLikeBuffManager.ts.deobfuscated.js:446-456` 将
   `HEAL_HOME/ROUND` 的数值写入 `specialWordActiveMap[HEAL_HOME].round`；这与
   `HEAL_HOME/IMMED` 的选中即治疗分支不同。
2. `BagLikeBuffModel.ts.deobfuscated.js:3` 监听
   `BAGLIKE_BATTLE_ROUND_START`，在 `initFormationHeroEffectives()` 完成后读取上述
   `round` 值并调用 `healHome()`。监听列表没有用回合结束触发这次治疗。
3. `BattleManager.ts.deobfuscated.js:125-128` 按万分比向下取整最大生命值，调用基地
   `heal()`，再创建治疗数字。

## 重建接入与验证

- `BagLikeProgression.ts` 已加入原表卡牌、0%–75% 入池边界、持久次数及
  `HEAL_HOME/ROUND/1000` 解析。
- `CangshuGame.ts` 只在 `startRound()` 的开战入口执行持久治疗，不在选择能力或结算入口执行。
- `baglike-traits.test.mjs` 覆盖配置字段、0/75/75.01 边界、次数上限、持久值、10% 向下取整和最大生命封顶。
- 本轮结果：特性测试 `68/68`，7 组规则测试共 `421/421`，golden cases `47/47`，Creator TypeScript 与项目静态检查通过。
