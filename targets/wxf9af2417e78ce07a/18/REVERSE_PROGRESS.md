# REVERSE_PROGRESS — `wxf9af2417e78ce07a/18`

## 单一目标概览

- 授权范围：用户授权的本地包体分析与 Cocos 工程还原
- AppID/版本：`wxf9af2417e78ce07a/18`
- 引擎：Cocos Creator `3.8.2`
- 当前阶段：Cocos 代表关卡实现与验证
- 还原契约：`implementationReady=true`
- 活动工程：`E:\Projects\weichatAnalysis\cangshu\cocosProject`
- 更新日期：2026-08-06

## 阶段进度

| 阶段 | 状态 | 关键输出/证据 |
|---|---|---|
| 输入盘点、解包、引擎识别 | 已完成 | 主包、game 分包、Cocos 3.8.2 |
| 静态逻辑与关卡 Schema | 已完成代表关卡主链 | 118 表、200 关、2,978 引用回合 |
| FairyGUI 几何恢复 | 已完成关键组件 | `evidence/fairygui/bagLike.layout.json` |
| 真实胜负规则恢复 | 已完成 | `evidence/runtime/BattleTrunkChapterVo...`、`BattleInstanceController...` |
| 还原交接契约 | 已完成 | ready gate 通过、47/47 golden cases（含伤害分支、核心触发生产、刷新、手动落位、合成、占格尺寸、失败补偿和真实状态转换） |
| Cocos 代表关卡实现 | 进行中 | 已切换为表驱动 1004、15 波、荒漠背景、战斗扩展/背包常驻、EXP/三选一 |
| Creator 交互冒烟 | 待现场执行 | 当前工程在 PID 49776 的 Creator 窗口中打开 |
| 匹配视觉验收 | 待重建截图 | 已有 1004 同阶段原图，尚缺重建 matched capture |

## 本轮关键纠正

- 原工程的 `750 × 1000` 已改为原版 `750 × 1334`。
- 原工程虚构的“攻击 4000 HP 敌方兵营”已删除。主线运行时将 `enemyHomeHp`
  设为 `-1`，每波真实胜利条件是排期结束且敌人清零。
- 原版战场、兵营、100 像素棋盘、操作按钮和顶部 HUD 锚点已由 FairyGUI 包确认，
  不再依赖类型游戏猜测。
- 原版刷新不是自动摆放：`refreshBrick` 只向 `ChooseCom` 发出候选，玩家通过
  `DRAG_BRICK_BEGIN -> TAKE_ON_BRICK` 手动落格；非法落点由 `TAKE_OFF_BRICK` 返回候选。
- 原版本局首次普通刷新免费，之后每次 `15` 金币；广告刷新每个准备回合一次，
  普通刷新没有独立硬次数上限，但受局内金币约束。
- 已纠正“静态批次耗尽后重复最后一批”：1004 仅首次挑战使用三组静态候选，非首次挑战
  从第一次准备发牌起按 `3000..3004` 奖励树逐槽独立抽取；概率重复合法，但不会缓存重放整批。
- 原版合成由 `BagLikeMergeDatas` 的 `material1/material2` 配方驱动；候选栏和背包格都支持拖拽到伙伴上合成，拖动件被消耗、目标件原地升级。
- 原版齿轮视图尺寸是形状行列数乘以 `100` 像素格子尺寸，且逐个渲染每个占用单元；此前 24 像素压缩图示不符合占格信息。
- 战斗伤害已按运行时纠正：闪避为 `50%` 伤害而不是 0；HAMSTER 只读取英雄抗性，WHEEL 只读取塔抗性；Boss 增伤、暴击、取整和最小 1 均进入独立内核。
- 普攻的 300 ms 行为延迟会随攻速缩放并按毫秒向上取整；弹丸复制发射时攻击/来源与初始方向，施法者死亡后不会被取消。
- 出兵不再使用错误的固定秒间隔：核心每圈逐侧触发连通块，工人满 100 才产出；H01/H02/H04 的 10/8/6 是单次触发进度，开战没有立即出兵。
- 最新战斗截图与 `WorkerBar` 运行时共同确认：棋子进度不是数字百分比，而是同一头像的暗色底图与全彩前景叠加，前景按 `workerPower / 100` 从下向上填充；复原工程已据此改为纵向头像遮罩，并移除错误的 `%` 文本。
- HAMSTER 完成后经过 0.25 秒工人动画与 0.5 秒飞行动画再从 `x=-300, y=random(0,150)` 出兵；原运行时没有发现最大存活数限制。
- H12 的 20 是单次进度，满后从齿轮位置释放一次随机目标、500 ms 后按半攻倍率结算、半径 50 内最多 5 目标的 WHEEL 技能，并不生成常驻 H12 单位；星级 1/3 的高压电击分别替换为 `LY_1202/LY_1203`，对主目标麻痹 1/2 秒；M03/Boss03 远程攻击为半攻倍率。
- Boss03 的 `ATK_SPD=5000`、控制免疫和 M03 独有的 `TOWER_DMG_RES=-5000` 已纠正；连续失败的 15 档敌军 ATK/HP 下调也已接入重试。
- 用户原图已确认目标是 `1004 / 荒漠沙地`；工程现从恢复表加载该关卡的 15 波排期、
  `fightscene_03`、M07 与第 5/10/15 波 Boss03/Boss02/Boss07。
- 开战后不再隐藏背包：战场扩大、背包下移并保持可见，准备候选和刷新/开战按钮隐藏。
- EXP/特性链已恢复：普通怪 5 EXP、Boss 100 EXP，20/50/100 阈值，升级暂停，截图中
  三张能力及 10 次换一批/3 次全都要计数。详细证据见
  `evidence/runtime/baglike-exp-trait-selection.md`。
- 已纠正“截图三张能力固定轮换”的错误：原版每次使用 `getChooseBuff(3)` 按权重抽取，过滤
  次数上限、阵容范围、账号星级、条件/验证；当前实现池中的 33 条原表效果行按 29 个互斥
  能力组参与抽取（28 个有效组和 1 个版本配置断链的确认无效项），并走
  同一抽取规则，完整未实现效果仍明确保留为缺口。
- **纠正（2026-08-02）**：上一条对“品质 4 保底”的适用范围描述过宽。
  `BagLikeBuffWin.refreshBuff` 首次打开时 `_buffs == null`，只使用不带最低品质参数的
  `getChooseBuff` 补满三张；仅 `_buffs` 已存在后的“换一批”分支读取
  `BUFF_REFRESH_MIN_QUALITY=4` 并执行随机槽位替换。品质 4 经 `QualityConfig` 确认为紫色，
  所以普通升级允许三张都不是紫色，刷新才必出紫色或更高品质。
- H0401 的模型路径已由 `ModelConfig` 确认为 `spine/hero/js_qishi_1/js_qishi_1`；原始
  Spine 3.8.99 三件套已按 resources3 UUID/版本恢复、留存哈希并导入 Cocos。
- **齿轮等级颜色纠正（2026-08-02）**：竞品 `BrickShowBaseCom` 对所有可生产齿轮调用
  `BagLikeGearColorUtils.getLevelColor(config.level)`，不是按英雄系列上色；完整等级色为
  `1=#378A4A` 绿、`2=#3E6FD4` 蓝、`3=#8140CB` 紫、`4=#CB9B40` 金、`5=#FF6363` 红，
  并同步按等级选择 `cl1..cl5` 齿轮底图。Cocos 工程现已在候选、棋盘和合成刷新共用的
  `renderGear` 路径按等级应用上述精确 RGB；无等级的能量核心/扩格件才回退配置 `tint`。
  等级颜色语义已修复，原版 `cl1..cl5` 异形底图/纹理仍是后续视觉恢复项。证据见
  `evidence/runtime/baglike-gear-level-color.md`。
- **齿轮等级产兵联动（2026-08-02）**：`BagLikeItemConfig` 与 `WorkerBar` 确认 H01/H02/H03/H04
  的 1–4 级会同时传递 `10000/15000/22500/33750` 属性倍率、等级头像和等级 `modelId`；
  `BattleInstanceController.createHeroUnits` 将倍率乘到英雄 ATK/HP，并把模型 ID 交给战斗单位。
  H12/H13 没有常驻模型，仅把相同倍率用于一次性 WHEEL 技能。Cocos 现已接入完整等级 profile，
  并从 `resources3` 恢复、哈希、检查和导入此前缺失的 12 套二/三/四级 Spine 3.8.99。
  H0204 的 `skill0=2002` 也已随等级传递；已确认其数值行为与 2001 相同、差异为后续表现阶段
  恢复的弹丸模型。证据见 `evidence/runtime/baglike-unit-level-production.md`。
- **随机齿轮升级能力（2026-08-02）**：`RG_ALL_abl10_eff01` 已连接
  `GEAR_UPGRAGE → BagLikeBuffManager.gearUpgrage → BagLilkeManager.upgradeOneGear`。原运行时只从
  棋盘 `_usedMap` 中排除核心与无 `nextId` 项后均匀随机，候选栏不参与；命中后原地切到
  `nextId` 并刷新，不清空工人进度。`ConditionWaveTimes` 还确认 `[0,10]` 是检查失败区间，
  所以该卡只在 1004 的第 11–15 波入池。复原实现、20 项确定性断言和 Creator TypeScript
  均通过。证据见 `evidence/runtime/baglike-random-gear-upgrade.md`。
- **二级齿轮准备刷新权重（2026-08-02）**：`RG_ALL_abl11_eff01` 已按版本 18 原行为接入。
  卡在第 1–10 波可选、最多一次，只对动态 `Prepare` 自动发牌尝试安装临时修正；首次不扣金币
  的 `Normal`、`Ad` 和静态教学批次均不适用。关键是原卡写入 `REWARD/3012 × 20000`，而同版
  `RewardDropConfig` 的二级池为 3015 且没有 3012，`RewardMgr` 又只做精确 ID 匹配，所以
  竞品此版本中它会占用选择次数但不会实际提升概率。工程明确保留该 no-op，没有擅自修成
  3015；通用倍率路径、刷新类型边界和断链结果均有确定性测试。证据见
  `evidence/runtime/baglike-level2-prepare-weight.md`。
- **经验强化能力（2026-08-02）**：`RG_ALL_abl07_eff01` 已按
  `EXP_GAIN/5000 → _expGain → getExpMultiple → BagLikeTopItem.onAddExp` 完整接入。卡为品质 4、
  权重 5、最多一次，在 1004 的第 1–10 波可选；选择后普通怪 5 EXP 变为 7.5，Boss 100
  变为 150。倍率在每次通知进入升级判断前计算，同一次通知仍最多升一级并按旧阈值保留小数
  余数。证据见
  `evidence/runtime/baglike-exp-gain-ability.md`。
- **敌方攻击弱化（2026-08-02）**：`RG_ALL_abl08_eff01` 已按 `MONSTER + ATTR/ATK_DEC=500`
  接入。`MONSTER` 是普通怪、精英和 Boss 共用的基础敌军属性层，不是“仅普通怪”；每次 -5%，
  最多十次。属性在攻击求值时实时读取，因此已出生和以后出生的敌人统一生效。弹丸命中时若
  施法者仍在场则取实时攻击，施法者离场才回退到发射快照，完整保留竞品的在途边界。40 项
  特性测试、29 项战斗内核测试、28 项场景测试、全量 384 项规则测试、47 项 golden cases 和
  Creator TypeScript 均通过。证据见 `evidence/runtime/baglike-enemy-attack-decrease.md`。
- **动力核心相邻齿轮攻击（2026-08-02）**：`RG_ALL_abl12_eff01` 已按
  `SPECIAL_WORD/POWER_NEAR_ATK_UP/2000` 接入。竞品的“周围”只读取动力核心四个正交邻格
  对应的齿轮 SID，不等于整个供能连通块；多格齿轮任一格直接接触即整件生效。能力在后续
  HAMSTER 产出和 H12/H13 一次性 WHEEL 技能创建时把攻击乘 1.2，HP 与已生成仓鼠均不追溯
  修改。45 项特性测试、20 项生产内核测试、全量 394 项规则测试、47 项 golden cases、
  Creator TypeScript 与 Cocos 项目检查均通过。证据见
  `evidence/runtime/baglike-power-near-attack.md`。
- **动力核心相邻齿轮效率（2026-08-02）**：`RG_ALL_abl16_eff01` 已按
  `SPECIAL_WORD/POWER_NEAR_WORKER_UP/2000` 接入，并与相邻攻击复用核心四个正交邻格的精确
  SID 判定。相邻齿轮每次核心触发的进度与 `/s` 显示乘 1.2；H02 等非整点进度保留小数并在
  满 100 后按模保留余数。候选区、仅连通齿轮、核心转速和产出单位属性都不受影响。50 项
  特性测试、24 项生产内核测试、全量 403 项规则测试、47 项 golden cases、Creator
  TypeScript 与 Cocos 项目检查均通过。证据见
  `evidence/runtime/baglike-power-near-worker.md`。
- **低血量即时基地治疗（2026-08-02）**：`RG_ALL_abl17_eff01` 已按
  `BASE_HP/0/50 + HEAL_HOME/IMMED/5000` 接入。`ConditionBaseHp` 对量化后的基地生命百分比
  执行包含端点的 0%–50% 判断；选中后立即恢复 `floor(maxHp × 0.5)` 并封顶，500 最大生命
  时恢复 250。原表 `noRestore=1` 使它不写入永久次数，后续再次低血时仍可入池。59 项特性
  测试、全量 412 项规则测试、47 项 golden cases、Creator TypeScript 与 Cocos 项目检查均
  通过。证据见 `evidence/runtime/baglike-immediate-home-heal.md`。
- **每轮开战前基地治疗（2026-08-02）**：`RG_ALL_abl18_eff01` 已按
  `BASE_HP/0/75 + HEAL_HOME/ROUND/1000` 接入。它最多选择一次且持久化，选中时不立即治疗；
  `BagLikeBuffModel` 只在 `BAGLIKE_BATTLE_ROUND_START` 读取持久值，因此之后每次开战恢复
  `floor(maxHp × 0.1)` 并封顶，回合结束不触发。若在当前战斗的升级弹窗选中，首次治疗在
  下一波开战发生。68 项特性测试、全量 421 项规则测试、47 项 golden cases、Creator
  TypeScript 与 Cocos 项目检查均通过。证据见
  `evidence/runtime/baglike-round-start-home-heal.md`。
- **H01 连击必暴（2026-08-02）**：`RG_H01_abl02_eff01..04` 已沿
  `HERO_STAR_GE → ADD_PASSIVITY_SKILL → ConType23 → 一次性 CRI_RATE/CRI_DMG Buff` 接入。
  四条要求 H01 账号星级 `3/5/8/10`，同一时刻只让满足条件的最高版本进入权重池；实际
  被动条件表要求完成 `3/3/2/2` 次基础攻击后让下一次未闪避攻击必暴，与界面文案的
  `2/2/1/1` 不同。后三版额外增加 5000 暴伤，十星版触发时按 20000 基点治疗并封顶为
  满血。被动只注入选择后新生成的 H01；已有单位不追补，闪避也不消耗已准备的必暴。
  安装包只包含从 `_localVo.stars` 读取账号星级的逻辑，不包含目标账号 H01 实际值，因此
  重建属性 `h01HeroStar` 默认保持 1，等待截图或存档后再还原资格。82 项特性测试、31 项
  战斗内核测试、全量 437 项规则测试、47 项 golden cases、Creator TypeScript 与 Cocos
  项目检查均通过。证据见 `evidence/runtime/baglike-warrior-combo-critical.md`。
- **H0905 战车弹射纠正（2026-08-02）**：`M_ZC_9001` 的 `type=8` 已沿
  `UnitFactory → BounceBullet` 确认为弹射弹丸，不是对同一目标固定双发。`times=2` 表示首发
  后最多再弹射两次，总计最多三个不同目标；每次以弹丸位置搜索 300 范围内最近且共享
  `hitUnitMap` 尚未命中的敌人，每段速度 400、伤害倍率 3500。复原玩法链、3 项新增边界断言、
  全量 487 项规则测试和 Creator TypeScript 均通过。现已进一步恢复 `H24_S1` 原始绿色
  飞弹、`H24_S1_LOWER` 三帧命中特效与 0.709583 秒 `bullet_zhanche` 音效；原包 UUID、
  native version、哈希、精确裁切/offset/锚点均已留证，新增 15 项绑定断言和 750×1334
  Web 冒烟通过。三帧单帧时长暂按 30 FPS 推定，仍待竞品同状态录像做视听 matched replay。
  证据见 `evidence/runtime/baglike-h0905-bounce-projectile.md`。
- **准备动态发牌规则（2026-08-02）**：`BagLilkeManager.refreshBrick`、
  `BagLikeUsedHeroMap`、`BagLikeCoinWeightDatas` 与常量/权重表共同确认：金币齿轮按等级计为
  `1/2/4/8`，并把 `3034` 权重从 1 枚时 `10000` 逐步压到 16 枚后的 `100`；英雄族最多同时记录
  `5` 种，达到上限后逐槽排除新族，未满时又会把重复候选替换为同等级的已解锁缺失族；仍有
  锁格时每第 `7` 次非广告刷新若本批无扩格，会把第 3 槽替换为 `3030`。这些规则已进入正式
  发牌路径并有 `40/40` 确定性断言。H11 的治疗消费者现已恢复，因此原版不计入五个受追踪
  英雄族上限的例外已正式启用。证据见 `evidence/runtime/baglike-preparation-dynamic-rewards.md`。
- **H11 治疗齿轮（2026-08-06）**：H1101..H1104 已按原表接入 9 点单次工人进度、
  `1/1.5/2.25/3.375` 属性倍率与一次性 WHEEL `ZL_1101`。工人满 100 后沿 0.25 秒完成路径
  施放；全场先选友方最低生命比例单位，再在目标半径 200 内按相同优先级治疗一个友军，
  原始治疗量为攻击 100%，同次成功施法按攻击 50% 修复基地。公式在等级倍率和 `HL_INC`
  后统一向下取整并封顶；无存活友军时不施法，满血友军仍允许配套基地修复。基础星级逻辑
  已进入正式候选/生产路径，19 项专项断言、全量 557 项日志断言、Creator TypeScript、
  100 资源/0 missing meta 与状态校验均通过。高星替换技能、溢出护盾、多目标和额外治疗
  加成仍等待目标账号星级证据。证据见 `evidence/runtime/baglike-h11-healing-gear.md`。
- **H12 高压电击（2026-08-06）**：`RG_H12_abl01_eff01/02` 已沿
  `HERO_STAR_GE → REPLACE_SKILL → LY_1202/LY_1203 → addBuff` 接入。两条同组能力均为品质 2、
  权重 200、最多一次、范围 H12/H08，只让账号 H12 星级满足的最高版本进入池；一星版的
  `LY_bf1202` 持续 1000 ms，三星版 `LY_bf1203` 持续 2000 ms。二者的 `abnormal type=3`
  经 `SkillEnum` 确认为 `dizziness`，会同时阻止移动和攻击，并走控制免疫。共享
  `M_LY_1201 → H_LY_1201` 仍在 500 ms 后对目标半径 50 内最多 5 个敌人造成 5000 比率伤害。
  默认 `h12HeroStar=1` 启用有证据的一秒基线；目标账号高星值仍需外部证明。专项 10 项、
  特性池 91 项、全量 576 项断言、Creator TypeScript、101 资源/0 missing meta 和规格校验均
  通过。证据见 `evidence/runtime/baglike-h12-paralysis.md`。
- **H12 十万伏特（2026-08-06）**：`RG_H12_abl02_eff01` 已按
  `HERO_STAR_GE H12 2 → ATTR/CRI_RATE=10000` 接入。原 `BagLikeBuffManager.addAttr` 对 HERO
  范围逐个写入特殊英雄属性，因此精确作用于 H12/H08；`AttributeConfig` 将暴击率限制在
  `0..10000`，非闪避伤害必定进入 15000 基础暴击倍率。`FightFormula` 还确认先闪避后暴击：
  闪避成功不执行 `checkCrit`，一次性强制必暴短路暴击 RNG，而属性必暴在未闪避后仍读取一次
  暴击随机数。复原伤害入口已改为相同的惰性 RNG 顺序。默认 H12 星级 1 不让此卡进入基线；
  特性池 98 项、战斗内核 37 项、全量 586 项断言和 Creator TypeScript 均通过。证据见
  `evidence/runtime/baglike-h12-guaranteed-critical.md`。
- **H12 百万伏特（2026-08-06）**：`RG_H12_abl03_eff01` 已按
  `HERO_STAR_GE H12 7 → ATTR/CRI_DMG=5000` 接入。能力为品质 3、权重 100、最多一次，范围
  H12/H08；`AttributeConfig` 将暴击伤害限制在 `0..25000`。原 `FightFormula` 只在未闪避且
  确认暴击后读取该属性，并把倍率从 `(15000 + 0)/10000` 提升为
  `(15000 + 5000)/10000=2.0`，不自行增加暴击率。复原 H12 的 49 攻击、5000 技能比率在
  必暴和本卡同时生效时得到 `floor(49×0.5×2)=49`。默认 1 星仍不让七星卡入池；特性池
  105 项、战斗内核 38 项、全量 594 项断言及 Creator TypeScript 均通过。证据见
  `evidence/runtime/baglike-h12-critical-damage.md`。
- **H12 感电效应（2026-08-06）**：`RG_H12_abl04_eff01` 已按
  `HERO_STAR_GE H12 10 → REPLACE_SKILL LY_1204 → LY_bf1204` 接入。能力为品质 4、权重 50、
  最多一次、范围 H12/H08；`LY_1204` 与麻痹技能共用 `SkillConfig.group=LY_1201`，原
  `BattleExSkillManager` 每组只保存最后一次替换，所以选择先后严格决定最终是感电还是麻痹。
  `LY_bf1204_1` 是 `timeLimit=0`、单层常驻的 `DMG_RES=-1000`，但 `FightFormula.getValue`
  在 Buff 后按 `AttributeConfig` 把 `DMG_RES` 钳到最小 0；关卡目标通用抗性为 0，因此不臆造
  描述中的 10% 易伤。专项 15 项、特性池 110 项、全量 604 项断言及 Creator TypeScript 均
  通过。证据见 `evidence/runtime/baglike-h12-electrified.md`。

## 当前非阻塞缺口

- 需要在 Creator 中完成一次完整点击通关冒烟测试。
- 至少约 17 条当前已表现英雄族相关 BagLike 效果仍未接入真实运行时消费者；玩家账号解锁、
  英雄星级、部分 condition/verify 与广告完成边界仍需外部账号证据或继续恢复。
- 首次核心接触、同帧事件和 RNG 调用顺序，以及跨进程失败次数仍需 matched trace/生命周期验证。
- 五级融合六组配方和星级门槛已恢复；前三组已有显式实机夹具，仍缺目标账号星级下的正常流程。
- 视觉、音效、精确布局与 matched visual 按用户当前优先级暂缓，不作为下一工作切片。

## 机制与数据交接（2026-08-02）

- 代表关卡固定为 `1004 / 荒漠沙地`、15 波；旧 `1001 / 5 波` 交接与计划已纠正。
- 规划估算：1004 机制/数据约 `75%–80%`，全约 200 关系统约 `50%–55%`；正式门禁仍以
  `BATTLEFIELD_RESTORE_STATE.json` 为准，当前四门禁均未通过。
- 自动基线为 golden `47/47`、12 个规则/资源脚本记录 `604/604`、动态发牌 `40/40`、
  H11 治疗 `19/19`、H12 替换/状态 `15/15`、战斗内核 `38/38` 和 Creator TypeScript 通过。
- 完整已完成项、剩余顺序、准确恢复入口与验证命令见 `MECHANICS_DATA_HANDOFF.md`。

## 本轮交接快照（2026-08-06）

- 已完成 H11 基础治疗齿轮，以及 H12 高压电击、十万伏特、百万伏特、感电效应的表驱动消费者；
  Unity 项目明确不在当前工作范围内。
- 特性池当前为 33 条效果行、29 个互斥能力组；约 17 条当前英雄族相关效果仍待恢复。
- 自动验证保持 golden `47/47`、规则/资源测试 `604/604`、Creator 3.8.8 TypeScript 通过，
  Cocos 工程检查为 101 个资源、0 missing meta、0 warning。
- 总编排仍为 `validation / mechanics-data / in_progress`；`mechanicsData` 和
  `visualBaseline` 尚未关闭，下一步继续恢复会改变模拟结果的 BagLike 技能/Buff 消费者。
