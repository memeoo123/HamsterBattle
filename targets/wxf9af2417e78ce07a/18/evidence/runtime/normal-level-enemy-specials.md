# 普通关敌人特殊机制证据

状态：`[已确认]`，目标 `wxf9af2417e78ce07a/18`。

## 配置连接

- M14、Boss14 与 B01/B02/B03 的实体行位于恢复后的 `monster.MonsterAttributeConfig.json:452,781,810,838,867`。
- 刺杀 `CS_1801` 位于 `battle.SkillConfig.json:5360`：首次冷却 1000ms、循环冷却 20000ms、施法 1000ms、范围 9999、行为延迟 300ms、伤害倍率 10000、闪现距离 45。
- `SkillEnum.ts.deobfuscated.js:56` 将行为 `targetType=3` 映射为 `Farthest`；`SkillUtils.ts.deobfuscated.js:117` 按施法者距离降序选择目标。`FightSkillInfo.assassinate` 再把施法者放到目标面向一侧的 45 距离处后结算伤害。
- B01/B02/B03 的主动技 `GWZX_001/GWZX_002/GWFW_001` 位于 `battle.SkillConfig.json:825,881,937`：首次和循环冷却均 5000ms、施法 1500ms、300ms 行为点。
- 对应行为位于 `battle.BehaviorConfig.json:351,375,399`。B01/B02 是 150×500 直线区域，B03 是自身半径 150；三者均为 15000 伤害倍率。
- B01 普攻行为 `M_HS_50002_1` 位于 `battle.BehaviorConfig.json:286`，单发倍率 5000；技能表的三个行为点为 300/600/900ms，因此一次普攻实际排入三发。
- M11/Boss11 的 `JT_001 → JT_bh001` 位于 `battle.SkillConfig.json:1104` 与 `battle.BehaviorConfig.json:464`，击退距离为 100。
- M13 自爆技能 `ZB_1701` 位于 `battle.SkillConfig.json:5245`；死亡行为 `H_ZB_1701_1` 位于 `battle.BehaviorConfig.json:2879`。生产实现只结算一次基地伤害并自毁，不额外伪造附近英雄伤害。

## 生产实现与验证

- 数据/Profile/施法时间推进：`cocosProject/assets/scripts/NormalLevelRuntime.ts`。
- 正式消费者：`CangshuGame.tryBeginEnemySpecial`、`stepEnemySpecialCast`、`resolveEnemySpecial`、`beginAttack` 和自爆/击退命中分支。
- `all-level-playability.test.mjs` 覆盖远端选人、范围拒绝、闪现坐标、300ms/1500ms 边界、B01 三发时点、生产消费者连接、自爆负向边界，以及 200 关全部 2,978 波的胜负状态机。
- 全量 `tests/*.test.mjs` 通过；Creator 3.8.8 项目 TypeScript 检查通过。机制模块已并入带稳定 `.meta` 的 `NormalLevelRuntime.ts`；仍待当前活动编辑器会话可安全构建时进行 Web 早/中/晚关冒烟。
