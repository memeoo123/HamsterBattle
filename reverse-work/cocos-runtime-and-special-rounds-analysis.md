# Cocos 倍率运行时语义与非主线回合分析

目标：`wxf9af2417e78ce07a/18`。

## 倍率计算已经由业务代码确认

还原后的 `BattleTrunkChapterVo.ts` 明确实现：

- `getAttrMultiple(value)`：有值时返回 `value / 10000`，否则返回 `1`。
- 攻击倍率：`关卡 atkMultiple × 回合 atkMultiple × 失败补偿 atkMultiple`。
- 生命倍率：`关卡 hpMultiple × 回合 hpMultiple × 失败补偿 hpMultiple`。

`BattleInstanceController.ts` 创建怪物时进一步确认：

- 怪物最终攻击为 `MonsterAttributeConfig.atk × 攻击倍率`。
- 怪物最终生命为 `MonsterAttributeConfig.hp × 生命倍率`。

因此此前关卡模型把关卡与回合倍率按万分比相乘的口径是正确的，不再只是数值分布推断。现有静态难度代理默认失败补偿为 `1`，表示首次挑战口径。

## 连败补偿

主线战败时，`TrunkInstanceModel.setFailChpater()` 会记录当前关卡及连续失败次数；胜利后由 `clearFailChapter()` 清零。`getFailMultipleCfg()` 把失败次数限制在 `1..15`，再读取 `TrunkInstanceDefeatConfig`。

补偿同时作用于怪物攻击和生命：

| 连败次数 | 倍率 |
|---:|---:|
| 1 | 0.9500 |
| 2 | 0.9025 |
| 3 | 0.8574 |
| 5 | 0.7738 |
| 10 | 0.5987 |
| 15+ | 0.4633 |

这是一条明确的动态降难机制：连续失败 15 次后，怪物攻击与生命都降至初次挑战静态值的 46.33%。若使用几何均值难度代理，两项同时乘同一补偿时，代理值也同比乘该补偿。

## 31 条“非主线回合”的真实用途

对 118 张表执行全量引用扫描，并与还原后的章节控制代码交叉验证后，31 条回合全部找到有效用途，未知项为 0；它们不是可直接认定的测试或遗留数据。

| ID 范围 | 数量 | 用途 | 出生总数 | 运行时证据 |
|---|---:|---|---:|---|
| `200001..200010` | 10 | 日常副本波次模板 A | 212 | `BattleDailyChapterVo` 从 `DailyInstanceConfig.roundIds` 读取 |
| `200101..200110` | 10 | 日常副本波次模板 B | 212 | 同上 |
| `300001..300010` | 10 | `DI_DEBUFF_eff05 / ADD_EXTRA_MONSTER` 追加波次 | 24 | `BattleTrunkChapterVo.checkExtraMonsterSchedule()` 动态读取 |
| `400001` | 1 | 无尽模式回合 | 560 | `ENDLESS_MODE:ROUND_IDS` 与 `BattleEndlessChapterVo.roundId` |

### 日常副本

`DailyInstanceConfig` 有 10 个副本，但复用两套十波模板：

- 模板 A 被副本 `2001、2003、2004、2009、2010` 使用。
- 模板 B 被副本 `2002、2005、2006、2007、2008` 使用。
- 两套模板的每波出生数和倍率完全相同，怪物阵容不同。
- 第十波均为 28 个出生；A 使用 B01/M01/M08/M09，B 使用 B01/M02/M03/M04。

### 额外怪物能力

`BagLikeAbilityEffectiveConfig.DI_DEBUFF_eff05` 的参数是：

`ADD_EXTRA_MONSTER, 300001, …, 300010`

这十波只追加 M12 先锋狼，每波 1–3 只，共 24 只。运行时代码根据当前波次选择对应 ID，并与正常波次并行调度。

需要特别注意：`createMonsterUnits()` 统一读取宿主章节的 `attrMultiple`，而该属性根据当前正常 `roundId` 计算。因此 `3000xx` 行自身的 `atkMultiple/hpMultiple` 在这条追加怪物路径中没有参与最终属性计算；它们提供的是出生计划和怪物 ID，新增先锋狼沿用宿主正常波次倍率。

### 无尽模式

`TrunkInstanceConstantConfig.ENDLESS_MODE:ROUND_IDS` 指向 `400001`。该回合包含：

- 560 个出生、12 种怪物。
- 回合攻击与生命倍率均为 `200000`，即 20 倍。
- 数量最多的是 M05 火火炉 134、M09 恶魔犬 133、M06 冰冰狗 54、M12 先锋狼 52。

无尽章节会另外选取玩家当前主线进度对应的 `TrunkInstanceConfig`，所以其最终怪物倍率仍会与该主线关卡倍率相乘。

## 进度场景模型

日常副本和无尽模式都继承玩家当前主线进度对应关卡的全局倍率，因此没有脱离玩家进度的单一绝对难度。按主线 `1001、1040、1080、1120、1160、1200` 建立场景后：

| 模式 | 1001 代理值 | 1200 代理值 | 出生数 |
|---|---:|---:|---:|
| 日常模板 A | 27,095.2712 | 2,013,627.2520 | 212 |
| 日常模板 B | 29,561.9781 | 2,196,902.3503 | 212 |
| 无尽模式 | 140,295.4373 | 10,426,183.9218 | 560 |

在固定主线进度下，模板 B 的代理值约比模板 A 高 9.1%；无尽模式约为模板 B 的 4.75 倍。该比较仍采用首次挑战和静态负载口径。

## 证据产物

- `reverse-work/cocos-modules/BattleTrunkChapterVo.ts.deobfuscated.js`
- `reverse-work/cocos-modules/BattleInstanceController.ts.deobfuscated.js`
- `reverse-work/cocos-modules/TrunkInstanceModel.ts.deobfuscated.js`
- `reverse-work/cocos-modules/BattleDailyChapterVo.ts.deobfuscated.js`
- `reverse-work/cocos-modules/BattleEndlessChapterVo.ts.deobfuscated.js`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/nonmain-rounds/`
- `reverse-work/resources/wxf9af2417e78ce07a/18/resources3/decoded/special-mode-model/`

