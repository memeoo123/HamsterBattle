# VALIDATION_REPORT

## Baseline

- Target: `wxf9af2417e78ce07a/18`
- Representative level: `1004 / 荒漠沙地`
- Original reference: 已有 4 张原版 1004 截图；当前工程已对齐场景，尚待采集重建端同阶段截图
- Original Cocos version: `3.8.2`
- Reconstruction Cocos version: `3.8.8`
- Resolution: `750 × 1334` portrait（已纠正）
- Validation date: 2026-08-07

## Automated checks

| Check | Result | Evidence |
|---|---|---|
| Restore spec structure | Pass | validator: `valid=true` |
| Restore spec ready gate | Pass | `implementationReady=true`，无阻塞 unknown |
| Golden cases | Pass | 当前 `golden-cases.json` 为 `47/47`；含伤害、波次、基地生命、生产、刷新、摆放、合成、占格、金币、失败补偿和阶段条件 |
| Production combat kernel | Pass | `116/116` assertions；含原版伤害、攻速/失败补偿、严格范围、四叉树等距优先、归一化移动、基地路径、英雄分离碰撞、完整战斗帧阶段、同帧刷怪/弹丸/销毁顺序、原生坐标随机与种子战斗随机分域、`9301/49297/233280` LCG、弹丸实时攻击/死亡快照边界、H02 分裂射击概率/随机目标/施法者半径、H02 弹幕延迟队列/重复 600 ms 行为/施法边界及 3500 ms 断链、H03 变形持续/免控/刷新/`DMG_INC` 方向、H03 激光的 300 ms 行为/1 秒施法/4 秒冷却与 100×300 前向矩形、H04/H09 普攻击飞的概率边界及 Boss/技能类型惰性门禁、H04/H09 盾墙的周期/持续/减伤/反伤顺序、H09/H13 的 2/4/6 次近邻弹射上限、H13 爆米花逐跳 10% 复利及末跳弹丸断链、强制/属性暴击、附加暴伤、H12 20000 暴击倍率、闪避优先级及惰性暴击 RNG |
| Production mechanism kernel | Pass | `28/28` assertions；含准备到战斗连续核心相位、方向 1 首次完成接触、占用侧 200 ms 停顿、连通块、多侧核心接触、产率、满 100、余数、输出延迟、1.5 倍速、直接相邻/仅连通边界，以及相邻效率的小数进度与显示率 |
| Unit level progression | Pass (numeric + asset import) | `271/271`：H01/H02/H03/H04 的 1–4 级及 H0705/H0805/H0905 的倍率、头像、模型 ID、资源路径、缩放、主技能编号，H0204 技能 2002，以及 H11/H12/H13 等级倍率和技能身份；15 套新增 Spine 3.8.99 均完成 Creator 导入 |
| H01 final-kill attack stacking | Pass (star-1 baseline; star-7 gated) | 特性池 `240/240`：`RG_H01_abl03_eff01` 在 H01 星 7 时开放一次，原表范围为 H01/H07。v18 死亡事件只携带最终击杀者 ID，并无助攻列表，因此卡面“参与击败”实际仅由最后一击触发；每次给 H01/H07 的共享实时属性层增加 `ATK_INC=200`（+2%），最多 30 层（+60%），当前与后续单位均生效，普通回合切换不清除，整局重开归零。目标账号 H01 实际星级仍待证明 |
| H02 split-shot consumers | Pass (star-1 baseline; star-3/5/10 gated) | 特性池 `240/240`、战斗内核 `116/116`：三条同组能力按 H02 星 3/5/10 只开放最高合格行，概率为 3000/5000/10000，范围 H02/H07；被动在主技能动作前判定，从施法者半径 250 内随机选择一个敌人（主目标仍合法），发射独立速度 700、10000 比率弹体。默认 H02 星级 1 不开放高星卡；目标账号实际星级仍待证明 |
| H02/H07 barrage-time consumers | Pass (star-1 baseline; star-7/8 gated) | 特性池 `240/240`、战斗内核 `116/116`：星 7/8 同组能力只开放最高合格行并把 `2001_5/2001_6` 快照到后续 H02/H07。首次 6 秒后施放，冷却在首个行为触发时开始；两档施法 2/3 秒，分别实际发射 9/6 枚速度 700、5000 比率弹丸。星 8 配置的 3500 ms 第七发在 3000 ms 施法结束时被清除；孤立的 3/4 秒 `ATK_SPD=30000` Buff 组没有入边，因此不凭卡面接入。`H29_S1` 表现资源仍缺；目标账号 H02 实际星级仍待证明 |
| H03/H08 transform consumers | Pass (star-1 baseline; star-7/8 gated) | 特性池 `240/240`、战斗内核 `116/116`：`RG_H03_abl03` 只开放最高合格行并快照到后续 H03/H08。星 7 普攻伤害后对命中目标施加 2 秒变形与 dizziness，控制免疫只拒绝控制；星 8 替换前档，只施加 2 秒 `DMG_INC=3000`。原版伤害公式从攻击者读取该属性，因此实际让变形目标自身出伤 +30%，并非卡面所写受到伤害 +30%；工程保留这一 v18 运行时冲突。`H28_S2` 表现资源仍缺；目标账号 H03 实际星级仍待证明 |
| H03/H08 penetrating laser | Pass (star-1 baseline; star-10 gated) | 特性池 `240/240`、战斗内核 `116/116`：`RG_H03_abl04_eff01` 要求 H03 星 10，范围 H03/H08，并把主动技能 `3001_5` 快照到后续单位。它在严格 50 距离内抢占普攻，施法 1000 ms；300 ms 行为触发时开始 4000 ms 冷却，并以锁定方向直接命中 100×300 前向矩形内最多 999 个敌军中心点，伤害比率 5000。边界包含、输入碰撞顺序和受控中断边界已固定；H0301/H0805 均绑定原始 `skill01`，配置音频 `skill_jiguang` 尚未在资源树找到。目标账号 H03 实际星级仍待证明 |
| H04 knight-vitality consumers | Pass (star-1 baseline; star-2/3 gated) | 治疗专项 `42/42`、特性池 `240/240`：星 2/3 的 `RG_H04_abl02` 只开放最高合格行，并把 `4001_1/4001_2` 加到后续 H04/H09 单位；首个 1000 ms 后每秒自疗。卡牌虽写最大生命 2%/5%，v18 实际由通用 `heal` 按攻击力 200/500 基点、`HL_INC` 后向下取整并封顶；一级 H04 每跳为 1/2 HP。冻结不暂停计时；目标账号 H04 实际星级仍待证明 |
| H04/H09 attack kill-fly | Pass (star-1 baseline; star-8 gated) | 特性池 `240/240`、战斗内核 `116/116`：星 8 `RG_H04_abl04_eff01` 为一次性 `FEATURE/ATTACK_KILL_FLY=3000`，范围 H04/H09；仅普通攻击命中 `canKillFly=true` 的非 Boss 怪物时按闭区间 `randomInt(0,10000) <= 3000` 判定，成功直接走 `Kill/999999` 并短路闪避、暴击和普通伤害 RNG。Boss 与非普通技能不消耗该随机数；目标账号 H04 实际星级仍待证明 |
| H04/H09 shield wall | Pass (star-1 baseline; star-7/10 gated) | 特性池 `240/240`、战斗内核 `116/116`：`RG_H04_abl03` 只开放最高合格行并快照到后续 H04/H09 单位；每 5000 ms 触发持续 2000 ms 的 `DMG_RES=3000`。星 10 档另在原伤害和护盾结算前反弹 `floor(减伤后、取整前伤害 × 3000/10000)`，低于 1 时为 0，`CounterAttack` 状态不递归反弹；目标账号 H04 实际星级仍待证明 |
| H11 healing gear | Pass (star-1 baseline; star-2/5 features gated; star-7 disconnect preserved) | 治疗专项 `42/42`、特性池 `240/240`：竖向两格占格、9 点工人进度、0.25 秒 WHEEL 既有完成路径、最低友军 HP% 目标、200 半径、单位 100%/基地 50% 攻击治疗、等级倍率前置、向下取整、封顶、满血友军与无友军边界；星 2 把单位溢出治疗转为可叠加且优先承伤的护盾，但基地只普通回血；星 5 `ZL_1103` 保持单位治疗并把基地修复提高到 100% 攻击；星 7 `HEAL_MORE_TARGER` 可抽取并计次，但 v18 分派器无处理分支、无旁路消费者，故保持 `num=1`；目标账号 H11 实际星级仍待证明 |
| H12 ability consumers | Pass (star-1 baseline; higher variants gated) | 替换/状态专项 `15/15`、特性池 `240/240`、战斗内核 `116/116`：`LY_1202/LY_1203` 的 1/2 秒 dizziness、2 星 `CRI_RATE=10000` 必暴、7 星 `CRI_DMG=5000`/20000 暴击倍率、10 星 `LY_1204` 感电、同组最后选择覆盖顺序、`DMG_RES=-1000` 的零下限、H12/H08 范围、控制免疫、500 ms 延时区域伤害及惰性暴击 RNG；目标账号 H12 实际星级仍待证明 |
| H13 bounce consumers | Pass (star-1 baseline; star-2/3/7/10 gated) | 特性池 `240/240`、战斗内核 `116/116`：基础 `TZ_1301` 为 2 次后续弹射，星 2/3 的 `FEATURE/BOUNCE_TIMES +2/+4` 将 H13/H09 上限提高到 4/6；星 7/10 的 `TZ_1302/TZ_1303` 每段后续弹射按 1.1 复利。`TZ_1303` 的配置末跳爆炸因版本 18 reset-before-copy 顺序不可达；共享命中集合、最近未命中目标、严格 300 半径和同组最高版本均已验证；目标账号 H13 实际星级仍待证明 |
| Level-5 cross-family fusion | Pass (rules + fixture render), matched account pending | `10/10`：六组原表配方、双向材料、全部星级门槛和非配方拒绝；750×1334 显式夹具已验证 H0705/H0805/H0905 的候选/棋盘形状、正式生产队列及 R1001/R1002/R1003 Spine 加载。目标账号星级未知，夹具截图不等于竞品正常存档 |
| H0905 recovered effects | Pass (asset/linkage), matched timing pending | `15/15`：原包飞弹、三帧命中图和音频哈希，精确裁切、offset、锚点、0.7 缩放、首发/弹射段创建、逐段命中播放和占位线关闭均通过；三帧时长暂按 30 FPS 推定 |
| Asset metadata | Pass | 102 asset files，missing meta `0`，warnings `0`；`BagLikeHealing.ts`、`BattlefieldHealing.ts`、`BattlefieldParalysis.ts` 均具备有效 TypeScript meta；既有原始 UI、shape Spine、融合英雄 Spine 与 H0905 资源保持可加载 |
| TypeScript | Pass (project scripts) | 2026-08-07 Creator 3.8.8 新构建完成项目脚本编译；既有独立 `--skipLibCheck true` 基线继续有效 |
| Web build smoke | Pass (artifact), launcher warning recorded | Creator 日志完成 `build Task (web-desktop) Finished`，新产物在本地浏览器正常加载且无项目控制台错误；真实画布交互完成候选拖放、开战、失败、重试和三侧连通组件验证。CLI 最终码 36 仍来自已记录的构建后扩展路径，不是项目编译/资源失败 |
| Creator project open | Pass | pre-existing main process PID 49776 opened `cocosProject`；未启动第二个编辑器 |
| Main startup rendering | Pass | 修复同节点重复 Renderable2D 后，显式 Main UUID 预览显示完整布阵首屏且无新增同类警告 |
| Post-change interactive preview | Partial | 五级候选、棋盘和产兵显式夹具已完成实机截图与日志验证，并修复战斗 `BackpackPanel` 遮挡战场回归；仍需用有证据的账号星级执行正常拖拽融合完整点击测试 |
| Original visual references | Pass (reference only) | 4 张：初始准备、发展后准备、第 1 波战斗、特性三选一；清单见目标目录 `evidence/visual/original/2026-08-01/manifest.json` |
| Level-1004 deterministic scenario | Pass | `28/28`：15 波、Boss 顺序、准备棋盘/候选分区、阶段布局、EXP 阈值、截图三能力 ID，以及 1.5 倍 EXP 的单级升级/小数余数 |
| Weighted trait draw and gear upgrade | Pass | `240/240`：权重边界、不重复、阵容/账号星级/次数/波次/基地生命过滤、同组最高星级版本、普通升级无保底、仅刷新品质 4 保底；覆盖随机棋盘升级、3012 no-op、经验强化、全敌军减攻、核心相邻强化、两种基地治疗、H01 连击必暴四版本与最终击杀共享叠攻、H02 分裂射击三版本与弹幕两版本、H03 变形两版本与穿透激光、H04 骑士活力两版本、盾墙两版本与星 8 H04/H09 普攻击飞、H11 星 2 护盾/星 5 基地修复/星 7 分派断链 no-op、H12 全部能力，以及 H13 弹射次数/爆米花替换能力 |
| Weighted preparation draw | Pass (supported-family runtime path) | `40/40`：静态资格、3000–3004 路由、独立槽位抽取、账号已解锁族过滤、H11 不计入五英雄族上限的例外、金币计数权重、缺失族替换、第七次非广告刷新强制扩格、Prepare 精确倍率及原版 3012 no-op；仍缺目标账号精确解锁集合 |
| Preparation placement | Pass (numeric + user smoke) | `24/24`：合成优先后的整件覆盖退回、主动取下、边界/核心保护、候选/棋盘固定同尺寸、候选溢出分行，以及 1–5 级精确色值、等级色覆盖兵种色和无等级特殊件回退色；用户已确认尺寸、重叠和棋盘分区问题解决 |
| Level-specific hero Spine import | Pass | H01/H02/H03/H04 的 1–4 级模型路径已接入；本轮新增 12 套二/三/四级原始 Spine 3.8.99，atlas/texture/skeleton 均由 Creator 导入 |
| Matched visual baseline | Partial / Pending | 已采集 750×1334 release 准备态与真实拖放后进入的第 1 波。顶部 HUD、准备区 `y=300` 起点、背包/候选/按钮分区以及战斗 HUD/背包常驻已结构对齐；`cl1..cl5`、操作底/背包/开放格、通用 HUD/按钮、ItemConfig 银币/观影券均使用原始资源。五阶融合另有显式夹具三态截图，并由此修复战斗 `BackpackPanel` 遮挡战场回归，但该夹具不是竞品同账号状态。竞品战斗参考是 863 HP 发展中存档，当前为 500 HP 初始局；仍无同状态特性截图，因此不得标 Pass。证据见 `evidence/visual/reconstruction/2026-08-02/manifest.json` 与其 `fusion-validation/manifest.json` |

## Fidelity matrix

| Area | Confirmed | Approximate / pending |
|---|---|---|
| Scene | 表驱动 1004、15 波、fightscene_03、750×1334；战斗扩展且背包常驻 | 战场高度/位移仍是截图推定值，待 matched capture 校正 |
| UI | 7×5、100×100 数据网格、84×84 空格/棋子可视面、候选拖放、同类 1-4 级合成、六组跨族五级配方/星级门槛、覆盖旧齿轮整件退回、主动取下、逐格占位；候选和棋盘均固定 1.0 倍，溢出分行；准备棋盘与候选区已分离，产率使用独立胶囊标签；生产齿轮使用原版 `cl1..cl5` atlas 表达 1 绿、2 蓝、3 紫、4 金、5 红，静态多格底板按 ShapeConfig 使用 `panel1..4` 和原旋转/等级着色；操作底、背包面板、开放格、顶部 HUD/按钮、银币/观影券及准备态已确认字体/描边均使用原始资源；五级 shape `UI10020/21/22` 原始 Spine 与旋转路径已接入 | 目标账号星级未知，五级 shape 动画尚未在有证据的正常流程实机触发；未访问弹窗文字；战斗与特性尚无同存档状态 matched pair |
| Refresh | 自动准备发牌、首次普通刷新免费、后续 15 金币、每准备回合一次广告刷新、刷新替换未摆放候选；静态资格与 3000–3004 基础权重树；账号解锁族过滤；金币齿轮计数驱动 3034 权重；最多五种受追踪英雄族及 H11 例外/缺失族替换；每七次非广告刷新强制扩格；二级概率能力保留 3012 配置断链 no-op | 目标账号精确解锁集合 |
| Units | H01/H02/H03/H04/H07/H08/H09/M02/M03/Boss03 基础属性、类型、移速、范围、攻速、奖励和 Boss 标志；生产齿轮 1–4 级及前三种五级融合兵使用精确属性倍率、模型路径和配置缩放；H0905 已恢复 `BounceBullet` 数值链及原始飞弹/三帧命中/音效；H12/H13 按原版作为一次性塔技能 | 单位排序、其他等级弹丸、H0905 三帧精确时长和状态特效待表现复验 |
| Production | 核心逐侧触发连通块、100 点工人进度、HAMSTER 0.75 秒输出延迟、H12 一次性技能、银币完成产出、1.5 倍速；核心相位从准备连续进入战斗，零角度后首次完成接触为方向 1，占用侧准备接触保留 200 ms 停顿但不加进度；核心直接相邻齿轮可按能力对后续 HAMSTER/WHEEL 攻击乘 1.2，或对每次工人进度及 `/s` 显示乘 1.2，且不会误作用于仅连通齿轮、候选区或 HP | 仅核心 `GameTimer` 与战斗 `BattleTimer` 同 tick 的跨调度器先后待 matched trace |
| Combat | 原版伤害内核、攻速缩放行为延迟、弹丸存活规则；战斗帧已固定为到时刷怪后进入队伍/碰撞、英雄逆序、怪物逆序、销毁、弹丸逆序与胜负检查，到时怪物和行动中新弹丸均可同帧更新；原生出生/抖动随机与 `9301/49297/233280` 种子战斗 RNG 已分离；逐帧最近目标、四叉树等距优先、严格搜索/攻击边界、归一化移动、英雄分离、基地路径与更新顺序；EXP 20/50/100；升级暂停；53 条原表效果行按 41 个互斥能力组参与抽取（39 个有效组和 2 个证据确认的配置/分派断链 no-op），并按原权重/阵容/账号星级/次数/基地生命/已恢复波次过滤；H01 连击必暴与星 7 最终击杀共享叠攻、H02 星 3/5/10 分裂射击与星 7/8 弹幕、H03 星 7/8 变形与星 10 穿透激光、H04 星 2/3 按实际攻击比例周期自疗、星 7/10 盾墙及星 8 H04/H09 普攻击飞、H11 星 2 护盾/星 5 基地修复、H12 全部能力、H13 基础/加成弹射次数及爆米花替换、经验强化、敌方攻击弱化、核心相邻强化、两种基地治疗及随机棋盘升级均已连接运行时消费者；H11 星 7 `HEAL_MORE_TARGER` 保留可选中/计次但不改变单目标行为的原版断链；伤害阶段已恢复护盾优先承伤、盾墙减伤及反伤先于原伤害/护盾结算、击飞对 Boss/技能类型及后续 RNG 的惰性门禁、H03 变形目标的出伤属性方向、激光对普通攻击专属被动的隔离，以及闪避/强制必暴对暴击 RNG 的惰性短路 | 当前英雄族相关效果行已全部建模；目标账号 H01/H02/H03/H04/H11/H12/H13 实际星级仍需外部截图或存档确认，跨调度器同 tick 边界与状态特效仍待 matched trace |
| Rounds | 关卡 1004 十五波完整排期、M07、三组 Boss 与真实清怪胜利条件 | 实际点击通关时长与手感 |
| Audio/effects | H0905 `H24_S1` 飞弹、`H24_S1_LOWER` 三帧命中与逐段 `bullet_zhanche` 已接入；H03/H08 激光已绑定原始 `skill01` Spine 动画与 300 长度数值射线；胜败流程已实现 | `skill_jiguang` 音频资产缺失，H0905 帧时长/响度 matched 验收，以及其余声音、技能、状态和结算特效 |

## Completion decision

工程已切换到用户截图对应的关卡 1004，并补上十五波、战斗扩展/背包常驻以及首个
EXP 三选一闭环。准备态与第 1 波重建截图已经采集，最早的顶部/准备区结构偏差已修正；
但战斗参考不是同一存档状态、特性选择重建截图仍缺，且广告流程、原始
跨族五级配方虽已接入，但目标账号星级和 shape 动画实机触发尚未验收；同状态战斗/特性配对和部分未访问界面仍不完整，因此 `visualBaseline` 保持 Pending，不标记为最终完成。
