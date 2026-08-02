# H01 连击必暴能力运行时证据

## 结论

`RG_H01_abl02` 不是普通暴击率加成，而是给之后生成的 H01 单位追加一个被动：完成指定次数的基础攻击后，下一次未被闪避的攻击必定暴击。四个星级版本共享同一能力组，抽取时只能让当前 H01 星级满足的最高版本进入权重池。

| 效果 ID | H01 最低星级 | 运行时完成攻击数 | 必暴附加暴伤 | 触发时治疗 |
| --- | ---: | ---: | ---: | ---: |
| `RG_H01_abl02_eff01` | 3 | 3 | 0 | 0 |
| `RG_H01_abl02_eff02` | 5 | 3 | 5000 | 0 |
| `RG_H01_abl02_eff03` | 8 | 2 | 5000 | 0 |
| `RG_H01_abl02_eff04` | 10 | 2 | 5000 | 最大生命的 20000 基点，实际封顶为满血 |

四条均为品质 4、权重 50、最多选择一次，作用范围为 `H01/H07`。当前重建关卡只实现并验证 H01 分支。

## 配置链

- `resources3/decoded/all-tables/baglike.BagLikeAbilityEffectConfig.json` 中四条效果分别要求 H01 星级 `3/5/8/10`，并声明同组 `RG_H01_abl02`。
- `baglike.BagLikeAbilityEffectiveConfig.json` 把四个版本映射为 `ADD_PASSIVITY_SKILL 1002_2/1002_3/1002_4/1002_5`。
- `battle.SkillConfig.json` 再映射到 `1002_p2/1002_p3/1002_p4/1002_p5`。
- `battle.PassivitySkillConfig.json` 的条件类型 23 分别使用计数 `3/3/2/2`；这才是运行时实际触发阈值。
- `battle.BehaviorConfig.json` 和 `battle.BuffGroupConfig.json` 最终加入一次性 Buff。`battle.BuffConfig.json` 显示：第一版为 `CRI_RATE +10000`；后三版还包含 `CRI_DMG +5000`；十星版另加 `healMax/hpRate 20000`。

界面文案写的是“攻击 2/2/1/1 次后”，与运行时条件表的 `3/3/2/2` 不一致。重建采用被动条件消费者的实际计数，不按展示文案猜测。

## 运行时链

- `ConditionHeroStarGe.ts.deobfuscated.js` 的 `check()` 直接读取 `heroModel.getHeroVo(heroId).star`，因此这是玩家账号星级条件，不是棋盘齿轮等级。
- `HeroModel.ts.deobfuscated.js` 从本地存档 `_localVo.stars[heroId]` 恢复账号星级；安装包和现有截图不包含目标账号 H01 的该存档值。
- `BagLikeBuffManager` 把 `ADD_PASSIVITY_SKILL` 交给 `BattleExSkillManager`；后者只在构建单位技能列表时追加被动。因此选择能力前已经在战场上的 H01 不会追补，之后产生的 H01 才获得能力。
- `SkillData.ts` 在一次基础技能完成后更新条件 23 的计数；`PassivitySkillData.ts` 在一次性必暴 Buff 已激活时跳过该次攻击的下一轮计数，并在达到阈值时清零。
- `FightFormula.ts` 先判定闪避，再判定暴击。闪避不会消耗已经准备好的必暴；真正产生暴击后才消耗一次性 Buff。
- `BuffManager.ts` 的 `countLimit=1` 在读取属性后移除必暴 Buff。基础暴伤为 15000，附加 5000 后，效02至效04的必暴总倍率为 2 倍。
- `HealMaxHpBuff.ts` 使用 `floor(maxHp * hpRate / 10000)`；`hpRate=20000` 会请求恢复两倍最大生命，经过通用生命封顶后等同于回满。

## 重建决策与未知项

`CangshuGame.h01HeroStar` 暴露为 Creator 属性，默认保持为 1。这样在没有目标账号证据时不会凭空让星级限定紫卡进入池；拿到竞品账号 H01 的实际星级后，将该属性设置成对应值即可按 `3/5/8/10` 自动选择唯一正确版本。

## 验证

- `baglike-traits.test.mjs`：82 项断言，覆盖四版本表、星级最高版本选择、次数上限、计数、消耗、闪避保留和十星治疗封顶。
- `battlefield-kernel.test.mjs`：31 项断言，覆盖强制暴击、附加暴伤及闪避优先级。
- 全套规则：437 项断言通过。
- golden cases：47/47 通过。
- Cocos Creator 3.8.8 TypeScript 检查：通过。
