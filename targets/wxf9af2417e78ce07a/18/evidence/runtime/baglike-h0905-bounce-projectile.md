# H0905 战车弹射弹丸

状态：**[已确认并接入]**。此前把 H0905 描述成“type-8 双发”不准确；版本 18 的
`M_ZC_9001` 实际走 `BounceBullet`，含义是首发命中后最多弹射两次，而不是对同一目标
固定发射两枚弹丸。

## 配置连接

- `battle.SkillConfig.json:4117-4141`：技能 `9001 / 战车` 每 `1000 ms` 施放一次，射程
  `100`，行为 `bh9001_1`。
- `battle.BehaviorConfig.json:1923-1941`：`bh9001_1` 创建 `M_ZC_9001`。
- `battle.MissileConfig.json:563-581`：该弹丸速度 `400`、`type=8`、参数
  `{times:2, missile:"M_ZC_9001"}`，命中行为为 `9001_11`。
- `UnitFactory.ts.deobfuscated.js:113-135`：运行时把 `BulletType.Bounce` 映射到
  `BounceBullet`；`BattleEnum.ts.deobfuscated.js:3` 的枚举顺序确认 `Bounce=8`。
- `battle.BehaviorConfig.json:1944-1966`：每段命中执行 `hurt amount=3500`，即攻击力的
  `35%`。

## 运行时语义

`BounceBullet.ts.deobfuscated.js:33-63` 确认：

1. 初始化时 `bouncelMaxTimes=parameter.times`、`bouncelTimes=0`，并创建共享
   `hitUnitMap`。
2. 每段命中先结算本段行为，再把当前目标 UID 写入共享命中表。
3. 尚未达到最大弹射次数时，以当前弹丸为圆心搜索敌方最近单位；混淆常量由
   `primitive-variables.json:1537,2772` 还原为半径 `300`、候选上限 `99999`。
4. 排序后的候选会跳过 `hitUnitMap` 中已命中过的目标；默认 `num=1`，每段只生成一个
   后续弹丸。子弹丸继承 `bouncelTimes` 和同一个 `hitUnitMap`。
5. 因此 `times=2` 的上限是“首发 + 两次后续弹射 = 最多三个不同目标”。范围内没有
   新目标或原目标在弹丸到达前已从运行时 UID 表消失时，链条提前结束。
6. 每个后续弹丸仍使用同一 `M_ZC_9001`、速度 `400`，从上一目标位置飞向下一目标；
   没有独立的固定连发时间间隔。`BounceBullet.actionBehavior(true)` 会在到达时强制结算
   本段行为，所以表中 `delays:[300]` 不形成额外的 300 ms 命中等待。

## 复原实现与验证

- `BattlefieldKernel.selectBounceBattlefieldTarget` 实现共享已命中集合、严格 `<300` 搜索
  边界、最近未命中目标和两次后续弹射上限。
- `CangshuGame` 的 H09 配置接入 `bounceTimes=2`、`bounceRange=300`；每段按速度 `400`
  单独排入弹丸结算，并继续使用原有的存活施法者实时攻击/施法者离场后发射快照规则。
- `battlefield-kernel.test.mjs` 新增 3 项边界断言；战斗内核共 `34/34`，全部 9 组规则
  测试共 `487/487` 通过。
- Creator 3.8.8 随附 TypeScript：`--skipLibCheck true` 退出码 `0`；Cocos 项目检查为
  `99` 个资源、缺失 meta `0`。

## 原始表现资源接入

- `M_ZC_9001.modelId=H24_S1` 绑定原包
  `spriteFrame/skill/js_zhanche_dandao`。唯一帧为 `rect=(1,1,109,20)`，锚点
  `(0.5,0.2)`，模型缩放 `0.7`；现已替代此前 H09 的占位直线，并按每段实际速度 400
  从当前目标飞向下一目标。
- `H24_S1_LOWER` 绑定原包 `spriteFrame/skill/js_zhanche_hill` 的三帧
  `idle_0/1/2`；精确裁切、`200×200` 原尺寸、offset 和 `(0.4,0.3)` 锚点均从 packed
  import 恢复。当前播放器按 30 FPS 播放；原 `SpriteFrameUnitNode` 实现不在已保存脚本包，
  所以该单帧时长保持“推定”，不冒充确认值。
- `MissileConfig.hitSound=bullet_zhanche` 已连接原包 0.709583 秒 MP3，每段命中播放一次。
- 原始文件、UUID/native version、哈希和帧几何保存在
  `evidence/assets/original/H0905-effects/manifest.json`；新增 `15/15` 资源/绑定断言通过。
- Creator Web 构建已包含三项资源，750×1334 `fusionValidation=battle` 冒烟截图和运行日志
  无项目控制台错误。仍需含 H0905 的竞品同状态录像对逐段轨迹、三帧速度和响度做最终
  matched replay。
