# RG_ALL_abl12_eff01：动力核心相邻齿轮攻击提升 20%

## 配置结论

- `BagLikeAbilityEffectConfig`：品质 4、权重 5、最多一次，无阵容、波次或星级条件；
  原配置 `name` 为空，描述为“动力仓鼠周围的齿轮攻击提升 20%”。
- `BagLikeAbilityEffectiveConfig`：`SPECIAL_WORD / POWER_NEAR_ATK_UP / 2000`。
- `BagLikeBuffManager` 将 `2000` 除以 `10000` 保存为 `atkInc=0.2`。

## “周围”的精确范围

`BagLilkePowerUtils.calPowerLink` 同时构造两个不同概念：

- `powerLinkArr`：从核心四边出发搜索到的完整正交连通分量，用于生产触发；
- `nearPowerSidMap`：只记录核心左、右、上、下四个直接相邻格中的齿轮 SID。

`isNearPower(itemSid)` 只读取 `nearPowerSidMap`。因此完整行为是：

- 齿轮任意一个占用格直接贴着核心，整件多格齿轮都算相邻；
- 仅通过其他齿轮连到核心、但自身没有占用四个直接邻格的齿轮，不获得攻击加成；
- 斜角接触不算相邻。

## 数值与生效时机

`WorkerBar.make` 在一次生产完成时把 `isNearPower` 连同齿轮等级倍率传给战斗控制器。

- HAMSTER：`createHeroUnits` 先计算 `基础攻击 × 齿轮等级倍率`，若相邻且能力已激活，
  再乘 `1 + 0.2`；HP 只乘齿轮等级倍率，不乘 1.2。
- WHEEL：`createTowerSkillOnce` 对 H12/H13 一次性技能的攻击使用相同 1.2 倍规则。
- 已经生成的仓鼠攻击已经写入战斗单位，不会因为之后选择该能力而追溯变化；后续产出使用新倍率。
- 当前代表关卡尚未接入动力核心主动技能；将来恢复其 `getTotalAtk` 消费者时，也必须复用同一
  相邻判定和 1.2 倍规则。

## 复原接入

- `BagLikeProgression.ts` 加入精确卡表和 `POWER_NEAR_ATK_UP/2000` 倍率。
- `BattlefieldProduction.ts` 隔离直接相邻判定，并分别返回攻击与 HP 的生产倍率。
- `CangshuGame.ts` 在仓鼠产出和 H12/H13 一次性 WHEEL 技能创建时应用该规则。

## 验证

- `baglike-traits`：45/45，覆盖精确表值、无条件入池、1.2 倍和一次上限。
- `battlefield-production`：20/20，覆盖多格直接接触、单格直接接触、连通但不直接接触、
  仅攻击提升以及非相邻不提升。
- 全部 7 组规则测试：394/394。
- Golden cases：47/47。
- Cocos Creator 3.8.8 随附 TypeScript：`--noEmit --skipLibCheck true` 退出码 0。
- Cocos 项目静态检查：有效，74 个资源文件，缺失 `.meta` 为 0。

