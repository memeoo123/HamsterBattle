# VALIDATION_REPORT

## Baseline

- Target: `wxf9af2417e78ce07a/18`
- Representative level: `1004 / 荒漠沙地`
- Original reference: 已有 4 张原版 1004 截图；重建端已按同一发展态复现 863 HP、H13/H03/H02 布局、四个产率、等级 2 与三张指定特质卡
- Original Cocos version: `3.8.2`
- Reconstruction Cocos version: `3.8.8`
- Resolution: `750 × 1334` portrait（已纠正）
- Validation date: 2026-08-11

## Automated checks

| Check | Result | Evidence |
|---|---|---|
| All 200 normal levels | Pass (data/runtime/state-machine/opening-deployment + early/middle/late smoke + representative full closure) | 主选择开放 `1001..1200`；契约逐关构建 2,978 波和 54,816 个刷怪项，依赖矩阵 `200 verified / 0 blocked`，全部波次 reducer 与 1,728 种动态开局均通过。Creator 实机通过 1001/1100/1200 的真实拖放、开战和生产；1001、1002、1100 分别完成 5/8/15 波正式胜利闭环。1100 从零累计 17 次失败后在重建专用 1% 最终补偿下正常完成全部 15 波并清零失败计数，获胜段峰值己方 9、敌方 22，0 缺失生产配置和 0 运行错误；原版账号平衡仍单独保持高保真取证项 |
| Main scene and level flow | Pass (functional reconstruction) | 正常启动进入主页；关卡页从恢复表开放 `1001..1200` 全部 200 关并分页显示。真实 Web Mobile 画布已完成主页/选关/返回点击契约及 1001、1003、1005、1009、1100、1200 早中晚抽样；1005/1009 直接加载恢复的雪山/火山原图，最新运行日志无 warning/error。该 UI 是功能性还原，不声明与原版所有关外页面像素级一致 |
| Role and cultivation navigation | Pass (evidence-backed functional reconstruction) | 按原 `MainPageTabItemConfig` 恢复 `商店 / 角色 / 战斗 / 培养 / 活动` 顺序；角色页接入 P01–P04 原名/品质及 `PowerAbilityConfig` 每人完整 0–8 星九档能力，培养页覆盖 12 兵种、恢复头像、本地资源、1–20 星消耗和解锁关卡。750×1334 新构建实机点击 P04 九档能力、培养页及 H14 鲨鱼页，warning/error `0`；无 matched 菜单截图，因此不声明像素级一致 |
| Out-of-battle pages | Pass (evidence-backed functional reconstruction + explicit mock ads) | 资源栏、四类商店、七日登录、每日任务及设置本地持久化均已接通。每日挑战运行 15 格/10 波，且无尽运行 `400001` 的 300 秒/560 刷怪闭环。用户授权的本地模拟广告成功才发放/扣除，取消失败无副作用；随机广告宝箱奖励池仍不伪造。主页底栏与 `每日任务 / 七天登录 / 设置 / 社区 / 邀请` 已绑定原 `image/main` 图集帧；未取得的页面原图仍不声明像素级一致 |
| Large/irregular gear merge interaction | Pass (numeric + live interaction) | 拖动保留抓取偏移，合并按双方 footprint 磁吸并选择最近兼容目标。专项含 H1401 L 形鲨鱼 `(72,58)` 偏移吸附、远距拒绝和最近目标排序；1004 实机从 H0401 边缘抓取并以约 `(65,40)` 锚点偏移释放，成功合成 H0402，`powerMissingGear=0` |
| Normal-level preparation data | Pass (table-driven integration) | v2 运行表覆盖 `200` 关 / `2978` 波，逐关导出 `initRewards/staticBuffs/staticBricks`、逐波导出 `coinRewards`；正式加载器已删除 `PREPARATION_CONFIGS` 白名单。导出重现 `3383/3383`、准备配置 `411/411`，依赖矩阵为 `200 verified / 0 blocked`；全部静态齿轮 ID 与 12 个推荐英雄族均有生产配置 |
| Candidate levels 1002/1003 | Pass (full live closure) | 生产配置构建器验证两关共 18 波的排期、模型依赖与准备奖励。1002 完成 8/8 波；1003 完成 10/10 波、876.781 秒、7 次正常重整并胜利，缺失 gear/config 均为 0。资源更新后的最新构建又让 1003 覆盖失败重试、特质选择和第 2 波，未出现回归 |
| Restore spec structure | Pass | validator: `valid=true` |
| Restore spec ready gate | Pass | `implementationReady=true`，无阻塞 unknown |
| Golden cases | Pass | 当前 `golden-cases.json` 为 `47/47`；含伤害、波次、基地生命、生产、刷新、摆放、合成、占格、金币、失败补偿和阶段条件 |
| Production combat kernel | Pass | `116/116` assertions；含原版伤害、攻速/失败补偿、严格范围、四叉树等距优先、归一化移动、基地路径、英雄分离碰撞、完整战斗帧阶段、同帧刷怪/弹丸/销毁顺序、原生坐标随机与种子战斗随机分域、`9301/49297/233280` LCG、弹丸实时攻击/死亡快照边界、H02 分裂射击概率/随机目标/施法者半径、H02 弹幕延迟队列/重复 600 ms 行为/施法边界及 3500 ms 断链、H03 变形持续/免控/刷新/`DMG_INC` 方向、H03 激光的 300 ms 行为/1 秒施法/4 秒冷却与 100×300 前向矩形、H04/H09 普攻击飞的概率边界及 Boss/技能类型惰性门禁、H04/H09 盾墙的周期/持续/减伤/反伤顺序、H09/H13 的 2/4/6 次近邻弹射上限、H13 爆米花逐跳 10% 复利及末跳弹丸断链、强制/属性暴击、附加暴伤、H12 20000 暴击倍率、闪避优先级及惰性暴击 RNG |
| Production mechanism kernel | Pass | `51/51` assertions；含准备态核心静止、战斗从 0°/方向 1 启动、中心齿轮 4 秒视觉整圈、占用侧 200 ms 停顿、连通块、多侧核心接触、产率、满 100、余数、输出延迟、1.5 倍速、直接相邻/仅连通边界，以及相邻效率的小数进度与显示率 |
| Unit level progression | Pass (numeric + asset import) | `415/415`：除既有等级/资源链外，新增验证 H05/H06/H16 产兵、H14/H17 一次性齿轮技能、H11/H12/H13/H14/H17 的 WHEEL HP 与齿轮等级倍率，以及 H1005/H1505/H1805 的精确形状、属性、模型/头像映射和主技能；3 星 H13 的 363 HP 与 1004 基础 500 精确组成参考 863 |
| Late fusion heroes | Pass (mechanics + original presentation + live browser) | `H1005/H1505/H1805` 机制保持通过，新增原始表现与浏览器契约。H1005 已接入 R1004 飞碟鼠 Spine、H27_S1 弹体、H27_S2 下层核弹及五次 `bullet_hedan`；H1505 接入 H15_S1 十六帧冲撞图；H1805 接入 R1005 哥吱拉 Spine。新鲜 Web Mobile `late-battle` 实机 4 次出兵、2 次主动施放/命中、6 次 H10 主弹体发射/2 次命中，缺失齿轮/配置均为 0；全部存活单位 `unitFallbacks` 为空且无 warning/error。resources3 无 H18_S1 资源实体，未伪造缺失弹体 |
| H01 final-kill attack stacking | Pass (star-1 baseline; star-7 gated) | 特性池 `240/240`：`RG_H01_abl03_eff01` 在 H01 星 7 时开放一次，原表范围为 H01/H07。v18 死亡事件只携带最终击杀者 ID，并无助攻列表，因此卡面“参与击败”实际仅由最后一击触发；每次给 H01/H07 的共享实时属性层增加 `ATK_INC=200`（+2%），最多 30 层（+60%），当前与后续单位均生效，普通回合切换不清除，整局重开归零。目标账号 H01 实际星级仍待证明 |
| H02 split-shot consumers | Pass (star-1 baseline; star-3/5/10 gated) | 特性池 `240/240`、战斗内核 `116/116`：三条同组能力按 H02 星 3/5/10 只开放最高合格行，概率为 3000/5000/10000，范围 H02/H07；被动在主技能动作前判定，从施法者半径 250 内随机选择一个敌人（主目标仍合法），发射独立速度 700、10000 比率弹体。默认 H02 星级 1 不开放高星卡；目标账号实际星级仍待证明 |
| H02/H07 barrage-time consumers | Pass (star-1 baseline; star-7/8 gated) | 特性池 `240/240`、战斗内核 `116/116`：星 7/8 同组能力只开放最高合格行并把 `2001_5/2001_6` 快照到后续 H02/H07。首次 6 秒后施放，冷却在首个行为触发时开始；两档施法 2/3 秒，分别实际发射 9/6 枚速度 700、5000 比率弹丸。星 8 配置的 3500 ms 第七发在 3000 ms 施法结束时被清除；孤立的 3/4 秒 `ATK_SPD=30000` Buff 组没有入边，因此不凭卡面接入。逐发 `H29_S1` 原始表现已接入；目标账号 H02 实际星级仍待证明 |
| H03/H08 transform consumers | Pass (star-1 baseline; star-7/8 gated) | 特性池 `240/240`、战斗内核 `116/116`：`RG_H03_abl03` 只开放最高合格行并快照到后续 H03/H08。星 7 普攻伤害后对命中目标施加 2 秒变形与 dizziness，控制免疫只拒绝控制；星 8 替换前档，只施加 2 秒 `DMG_INC=3000`。原版伤害公式从攻击者读取该属性，因此实际让变形目标自身出伤 +30%，并非卡面所写受到伤害 +30%；工程保留这一 v18 运行时冲突。两档均已接入 `H28_S2` 原版表现，星 7 音效按配置恢复；目标账号 H03 实际星级仍待证明 |
| H03/H08 penetrating laser | Pass (star-1 baseline; star-10 gated) | 特性池 `240/240`、战斗内核 `116/116`：`RG_H03_abl04_eff01` 要求 H03 星 10，范围 H03/H08，并把主动技能 `3001_5` 快照到后续单位。它在严格 50 距离内抢占普攻，施法 1000 ms；300 ms 行为触发时开始 4000 ms 冷却，并以锁定方向直接命中 100×300 前向矩形内最多 999 个敌军中心点，伤害比率 5000。边界包含、输入碰撞顺序和受控中断边界已固定；H0301/H0805 均绑定原始 `skill01`，`skill_jiguang` 按零延迟配置在施法起点播放。目标账号 H03 实际星级仍待证明 |
| H04 knight-vitality consumers | Pass (star-1 baseline; star-2/3 gated) | 治疗专项 `42/42`、特性池 `240/240`：星 2/3 的 `RG_H04_abl02` 只开放最高合格行，并把 `4001_1/4001_2` 加到后续 H04/H09 单位；首个 1000 ms 后每秒自疗。卡牌虽写最大生命 2%/5%，v18 实际由通用 `heal` 按攻击力 200/500 基点、`HL_INC` 后向下取整并封顶；一级 H04 每跳为 1/2 HP。冻结不暂停计时；目标账号 H04 实际星级仍待证明 |
| H04/H09 attack kill-fly | Pass (star-1 baseline; star-8 gated) | 特性池 `240/240`、战斗内核 `116/116`：星 8 `RG_H04_abl04_eff01` 为一次性 `FEATURE/ATTACK_KILL_FLY=3000`，范围 H04/H09；仅普通攻击命中 `canKillFly=true` 的非 Boss 怪物时按闭区间 `randomInt(0,10000) <= 3000` 判定，成功直接走 `Kill/999999` 并短路闪避、暴击和普通伤害 RNG。Boss 与非普通技能不消耗该随机数；目标账号 H04 实际星级仍待证明 |
| H04/H09 shield wall | Pass (star-1 baseline; star-7/10 gated) | 特性池 `240/240`、战斗内核 `116/116`：`RG_H04_abl03` 只开放最高合格行并快照到后续 H04/H09 单位；每 5000 ms 触发持续 2000 ms 的 `DMG_RES=3000`。星 10 档另在原伤害和护盾结算前反弹 `floor(减伤后、取整前伤害 × 3000/10000)`，低于 1 时为 0，`CounterAttack` 状态不递归反弹；目标账号 H04 实际星级仍待证明 |
| H11 healing gear | Pass (star-1 baseline; star-2/5 features gated; star-7 disconnect preserved) | 治疗专项 `42/42`、特性池 `240/240`：竖向两格占格、9 点工人进度、0.25 秒 WHEEL 既有完成路径、最低友军 HP% 目标、200 半径、单位 100%/基地 50% 攻击治疗、等级倍率前置、向下取整、封顶、满血友军与无友军边界；星 2 把单位溢出治疗转为可叠加且优先承伤的护盾，但基地只普通回血；星 5 `ZL_1103` 保持单位治疗并把基地修复提高到 100% 攻击；星 7 `HEAL_MORE_TARGER` 可抽取并计次，但 v18 分派器无处理分支、无旁路消费者，故保持 `num=1`；目标账号 H11 实际星级仍待证明 |
| H12 ability consumers | Pass (star-1 baseline; higher variants gated) | 替换/状态专项 `15/15`、特性池 `240/240`、战斗内核 `116/116`：`LY_1202/LY_1203` 的 1/2 秒 dizziness、2 星 `CRI_RATE=10000` 必暴、7 星 `CRI_DMG=5000`/20000 暴击倍率、10 星 `LY_1204` 感电、同组最后选择覆盖顺序、`DMG_RES=-1000` 的零下限、H12/H08 范围、控制免疫、500 ms 延时区域伤害及惰性暴击 RNG；目标账号 H12 实际星级仍待证明 |
| H13 bounce consumers | Pass (star-1 baseline; star-2/3/7/10 gated) | 特性池 `240/240`、战斗内核 `116/116`：基础 `TZ_1301` 为 2 次后续弹射，星 2/3 的 `FEATURE/BOUNCE_TIMES +2/+4` 将 H13/H09 上限提高到 4/6；星 7/10 的 `TZ_1302/TZ_1303` 每段后续弹射按 1.1 复利。`TZ_1303` 的配置末跳爆炸因版本 18 reset-before-copy 顺序不可达；共享命中集合、最近未命中目标、严格 300 半径和同组最高版本均已验证；目标账号 H13 实际星级仍待证明 |
| Level-5 cross-family fusion | Pass (rules + fixture render), matched account pending | `10/10`：六组原表配方、双向材料、全部星级门槛和非配方拒绝；750×1334 显式夹具已验证 H0705/H0805/H0905 的候选/棋盘形状、正式生产队列及 R1001/R1002/R1003 Spine 加载。目标账号星级未知，夹具截图不等于竞品正常存档 |
| H0905 recovered effects | Pass (asset/linkage + source-exact timing) | `15/15`：原包飞弹、三帧命中图和音频哈希，精确裁切、offset、锚点、0.7 缩放、首发/弹射段创建、逐段命中播放和占位线关闭均通过；逐帧时基已由原 `FrameAnim._perFrameTime = 66.6ms` 关闭推定项 |
| H02 recovered projectile | Pass (asset/linkage + launch timing), matched capture pending | `12/12`：`H29_S1` 原始光弹哈希、72×48 裁切、锚点、X 轴翻转、低等级普攻/分裂/弹幕路由、H0204 分流和行为帧延迟显示均通过；原配置不含发射/命中音效 |
| H0204 recovered projectile | Pass (asset/linkage), matched capture pending | `8/8`：resources3 的 `H29_S2`/`M_SS_2002` 原始篮球 PNG 哈希、41×41 裁切、43×43 原尺寸、`(0.5,0.2)` 锚点、技能 `2002` 专属选择与速度 700 的正式弹丸运动路径均已绑定；原配置不含发射/命中音效 |
| H03/H08 recovered projectile | Pass (asset/linkage + numeric correction), matched capture pending | `13/13`：`H13_S1` Spine 3.8.99 三件套哈希/导入、`idle` 动画、H03 速度 300、H08 速度 500、两族路由、行为帧延迟显示和占位线关闭均通过 |
| H0705 recovered impact | Pass (asset/linkage + source-exact timing) | `14/14`：技能 `8001` / 行为 `bh8001_1` 的 `H22_S1_LOWER` 原始六帧图集哈希、全部 rect/offset、186×186 原尺寸、`(0.3,0.2)` 锚点、0.8 缩放、H07 专属命中路由和占位线关闭均通过；逐帧时基已恢复为原 `66.6ms` |
| H08 recovered impact | Pass (asset/linkage + source-exact timing) | `15/15`：行为 `7001_11` 的 `H21_S1_LOWER` 六帧图集哈希、全部 rect、原尺寸、锚点、1.5 缩放、H08 专属命中路由和逐效果帧间隔/清理均通过；逐帧时基已恢复为原 `66.6ms` |
| H11 recovered healing effect | Pass (asset/linkage), matched capture pending | `7/7`：`ZL_1101 → B_ZL_1101 → H11_S1` 的原始 Spine 3.8.99 三件套哈希、导入路径、`skill01_hit_upper` 非循环动作、所选友军位置绑定和完成清理均通过；原技能配置没有音效 |
| H13 recovered projectile and impact | Pass (source-exact linkage/layer/action + fresh matched capture) | `15/15`：`TZ_1301 → M_TZ_1301_1 → B_TZ_1301_2` 的飞行 `H25_S1` 与命中 `H13_S1_LOWER` 原始资源哈希通过；后者使用 Spine 3.8.99 `baomihua_hill`、`pskill01`、原 `low → BgLayer` 路由，并在首击/逐次弹跳的伤害与数字同一更新创建。4.010 秒 750×1334 新鲜截图无控制台错误；原 MissileConfig 没有音效 |
| H12 recovered lightning effect | Pass (asset/linkage), matched capture pending | `12/12`：`LY_1201 → M_LY_1201 → H12_S1` 的原始 Spine 3.8.99 三件套与 `bullet_leiyun` 哈希、目标位置、0.8 缩放、`attack` 非循环动作、完成清理、既有 500 ms 命中时刻播放音频及占位线关闭均通过 |
| H01/H04 recovered attack audio | Pass (asset/linkage), matched volume pending | `8/8`：`1001/bh1001 → skill_jijian` 与 `4001/bh4001 → skill_zhuangji` 的原始音频哈希、资源路径、英雄路由、`soundDelay=0` 攻击起始播放及 one-shot 调用均通过；两行为 `modelId` 为空，未添加无证据特效 |
| H03 recovered status effects | Pass (asset/linkage), matched capture pending | `19/19`：变形 `H28_S2` 与冰冻 `H28_S1` 两套原始 Spine 3.8.99 三件套、`hit/idle` 动作、模型缩放、2/3 秒 Buff 路由与刷新清理、星 7 专属 `skill_bianxing` 及独立 30% 冰冻的 `skill_bingfeng` 均通过；星 8 替换按空音效配置保持静音 |
| H03 recovered laser audio | Pass (asset/linkage), matched volume pending | `5/5`：`3001_5` 原始 `skill_jiguang` 哈希、资源路径、零延迟施法起点播放、one-shot 调用及与 300 ms 行为触发分离均通过 |
| Trait presentation | Pass (source + recovered art + fresh-build fixture) | `21/21`：发展态夹具精确锁定等级 2 与三张能力；原版 `bagLikeBuff` 丝带/卡框/推荐角标、common 蓝紫按钮/播放图标和 `image/effect` 的 `buff_0027 / buff_0036 / buff_0006` 已绑定。说明文字使用恢复字体和 RichText，复现原表绿色强调与原图断行；新的 750×1334 Web Mobile 截图无控制台错误。证据见 `evidence/visual/reconstruction/2026-08-09-trait-richtext/manifest.json` |
| Preparation presentation | Pass (global geometry and controls) | `15/15`：归一化顶部 HUD、血条、背包板、棋盘、候选和底部按钮锚点保持匹配；恢复“获取格子 ×3”、广告刷新提示、15 银币费用和 `刷新 / 刷新 / 开战`，隐藏准备期产兵条并移除遮挡货币栏的重建主页按钮。新鲜 750×1334 Web Mobile 截图无控制台错误；证据见 `evidence/visual/reconstruction/2026-08-09-preparation-controls/manifest.json` |
| Asset metadata | Pass | 240 asset files，missing meta `0`；新增雪山/火山背景、H05/H06/H16 共 12 套后期 Spine 与对应证据清单均由 Creator 3.8.8 正式导入。资源门禁覆盖 25 种敌人、12 套后期英雄、2 张背景和 5 个关外侧栏图标 |
| TypeScript | Pass (project scripts) | 2026-08-12 使用 Creator 3.8.8 随附 TypeScript、工程 `tsconfig.json`、`--noEmit` 与 `--skipLibCheck true` 检查通过；移除其解析器不支持的 `satisfies` 并加入兼容性门禁，不抑制项目脚本错误 |
| Web build smoke | Pass (actual 200-level + activity + recovered-resource artifact) | 2026-08-12 23:42:06 的新鲜 `web-mobile` 产物完成；1005 雪山、1009 火山与 25 种敌人画廊运行资源加载均通过。自动图鉴契约记录 `25 loaded / 0 failed / 0 console errors`；既有广告、主页、活动、1003/1100/1200 长跑证据保持有效 |
| Creator project open | Pass | 使用 Creator 3.8.8 隐藏 CLI 完成两次有界 Web Mobile 构建；首次发现每日挑战返回缺口，修复后的增量构建 7 秒完成且命令自行退出。未发现或终止用户既有 Creator 会话 |
| Main startup rendering | Pass | 修复同节点重复 Renderable2D 后，显式 Main UUID 预览显示完整布阵首屏且无新增同类警告 |
| Post-change interactive preview | Partial | 五级候选、棋盘和产兵显式夹具已完成实机截图与日志验证，并修复战斗 `BackpackPanel` 遮挡战场回归；仍需用有证据的账号星级执行正常拖拽融合完整点击测试 |
| Original visual references | Pass (reference only) | 4 张：初始准备、发展后准备、第 1 波战斗、特性三选一；清单见目标目录 `evidence/visual/original/2026-08-01/manifest.json` |
| Level-1004 deterministic scenario | Pass | `32/32`：15 波、Boss 顺序、准备棋盘/候选分区、战斗态三个独立源枢轴偏移、EXP 阈值、截图三能力 ID，以及 1.5 倍 EXP 的单级升级/小数余数 |
| Weighted trait draw and gear upgrade | Pass | `240/240`：权重边界、不重复、阵容/账号星级/次数/波次/基地生命过滤、同组最高星级版本、普通升级无保底、仅刷新品质 4 保底；覆盖随机棋盘升级、3012 no-op、经验强化、全敌军减攻、核心相邻强化、两种基地治疗、H01 连击必暴四版本与最终击杀共享叠攻、H02 分裂射击三版本与弹幕两版本、H03 变形两版本与穿透激光、H04 骑士活力两版本、盾墙两版本与星 8 H04/H09 普攻击飞、H11 星 2 护盾/星 5 基地修复/星 7 分派断链 no-op、H12 全部能力，以及 H13 弹射次数/爆米花替换能力 |
| Weighted preparation draw | Pass (supported-family runtime path) | `41/41`：静态资格、3000–3004 路由、全部 12 个推荐英雄族、独立槽位抽取、账号已解锁族过滤、H11 不计入五英雄族上限的例外、金币计数权重、缺失族替换、第七次非广告刷新强制扩格、Prepare 精确倍率及原版 3012 no-op；仍缺目标账号精确解锁集合 |
| Preparation placement | Pass (numeric + live P01 drag) | `24/24` 既有占格/覆盖/回退/尺寸/颜色规则保持通过；2026-08-12 进一步按竞品恢复 P01 通用拖动，在 1004 实机从 `(2,3)` 拖到 `(1,3)`，动力索引随位置更新，无效落点回原位，warning/error `0` |
| P01 power-core presentation | Pass (phase gate + calibrated build; exact competitor frame timing approximate) | 使用原始 `power1.png` 金色齿轮；准备态固定 0°，每波战斗从 0° 启动，视觉转速独立降为 4 秒一圈，仓鼠层独立循环且不随齿轮旋转。1004 准备态 `0.0° → 0.0°`，战斗态约一秒采样 `46.5° → 138.1° → 231.2°`；专项 51、全量 54/54、Golden 47/47、TypeScript 与 2026-08-13 12:13 Web Mobile 构建通过；证据见 `evidence/runtime/p01-battle-only-motion-2026-08-13/manifest.json` |
| Irregular gear role position | Pass (source table + full roster + fresh build) | 原版 `BrickShowBaseCom` 的逐形状 `rolePos` 已进入棋盘与图鉴共用路径：H05 左下、H09/H13 左上、H14/H15 右下、H16/H18 右上；H1505 足迹同时恢复为三格 L。54/54 个 HERO 的原始 `shapeId`、足迹和头像坐标均逐项通过，所有非中心锚点均落在实际占用格；全量 44/44、200/200 关状态机、Creator TypeScript 与 2026-08-12 11:17 Web Mobile 构建通过，三页图鉴/棋盘截图 warning/error `0`；证据见 `evidence/visual/reconstruction/2026-08-12-shape-rolepos/manifest.json` |
| Progressive hero-family unlocks | Pass (migration + runtime filtering) | Schema 4 会把旧版“全兵种 1 星”存档中尚未达到关卡门槛的族重新锁定；动态发牌继续只消费账号已解锁集合。第 4 关代表存档为 `H01/H02/H03/H04/H12/H13`，后续按恢复表加入。账号专项 `95/95`、候选专项 `47/47`、200/200 关状态机通过 |
| Power-role acquisition | Pass (source-exact local path; platform ad mocked) | P01 按 `POWER:INIT_DATA` 初始 0 星并出战；P02-P04 初始 -1。按原 `RoleMgr` 恢复每角色每日 3 次、每次 2 碎片、10 片招募、0-8 星成本与已获得角色出战切换；广告使用本地模拟完成回调，取消/失败不发碎片。角色系统仍在 1005 开放。专项 `21/21`，角色页 750×1334 实机显示通过 |
| Level-specific hero Spine import | Pass | H01/H02/H03/H04 的 1–4 级模型路径已接入；本轮新增 12 套二/三/四级原始 Spine 3.8.99，atlas/texture/skeleton 均由 Creator 导入 |
| Matched visual baseline | Pass | 最终 `developed-trait-polished.png` 与 `developed-battle-fixed.png` 已关闭精确图标、RichText、标题/按钮、完整 HUD、常驻背包、863 HP 和固定敌军快照；H13 原始 `pskill01` 与 `Font_white2` 伤害数字同帧子基线也保持通过。750×1334 截图 warning/error 0；最终证据见 `evidence/visual/reconstruction/2026-08-10/manifest.json`，H13 子基线见 `evidence/visual/reconstruction/2026-08-10-h13-impact/manifest.json` |

## 最终表现与长跑闭环（2026-08-12）

- P02–P04 已使用原 `heroSmallHead` 精确图集帧；P04 `H33_S1` 原始 `feibiao` 已恢复，按 `speed=1000 / angleSpeed=3 / maxHits=10` 连续移动和旋转，不再使用紫色占位轨迹。
- 关外锁定入口、玩家化文案、角色招募、兵种逐步开启、动力齿轮/仓鼠独立运动、齿轮阴影/辉光、单位阴影、Y 深度、死亡清场均已闭环；异步切页不再把已销毁节点误报为资源加载错误。
- 实机长跑：1003 `10/10`（876.781 s）、1100 `15/15`（1652.598 s）、1200 `15/15`（1289.538 s）均胜利，缺失 gear/config 均为 0。
- 特殊模式：每日 `10/10`、199.176 s；无尽 293.182 s 摧毁敌方兵营，539 击杀、2915 金币。后期账号/角色夹具仅走恢复的进度、刷新、放置和合成公式，结算恢复且不落盘；直达普通长跑也不会再污染玩家关卡存档。
- 五级融合最终实机：`P01,H1005,H1505,H1805`，三头像 loaded，H10 主弹体 `6/2` 发射/命中，融合主动技 `2/2` 施放/命中，warning/error 为 0。
- 最终 52/52 测试文件、200 关 / 2,978 波 / 54,816 刷怪项通过。Cocos 工程检查为 240 assets、0 missing meta、TypeScript 通过；最新 Web Mobile 构建时间 2026-08-12 23:42:06，25 种敌人 Spine 浏览器契约为 25/25。
- 结构化证据：`targets/wxf9af2417e78ce07a/18/evidence/runtime/final-presentation-and-long-run-closure-2026-08-12/manifest.json`。

## Fidelity matrix

| Area | Confirmed | Approximate / pending |
|---|---|---|
| Scene | 表驱动 1004、15 波、fightscene_03、750×1334；战斗扩展且背包常驻 | 战场高度/位移仍是截图推定值，待 matched capture 校正 |
| UI | 7×5、100×100 数据网格、84×84 空格/棋子可视面、候选拖放、同类 1-4 级合成、六组跨族五级配方/星级门槛、覆盖旧齿轮整件退回、主动取下、逐格占位；候选和棋盘均固定 1.0 倍，溢出分行；准备棋盘与候选区已分离，产率使用独立胶囊标签；生产齿轮使用原版 `cl1..cl5` atlas 表达 1 绿、2 蓝、3 紫、4 金、5 红，静态多格底板按 ShapeConfig 使用 `panel1..4` 和原旋转/等级着色；操作底、背包面板、开放格、顶部 HUD/按钮、银币/观影券及准备态已确认字体/描边均使用原始资源；五级 shape `UI10020/21/22` 原始 Spine 与旋转路径已接入 | 目标账号星级未知，五级 shape 动画尚未在有证据的正常流程实机触发；未访问弹窗文字；战斗与特性尚无同存档状态 matched pair |
| Refresh | 自动准备发牌、首次普通刷新免费、后续 15 金币、每准备回合一次广告刷新、刷新替换未摆放候选；静态资格与 3000–3004 基础权重树；账号解锁族过滤；金币齿轮计数驱动 3034 权重；最多五种受追踪英雄族及 H11 例外/缺失族替换；每七次非广告刷新强制扩格；二级概率能力保留 3012 配置断链 no-op | 目标账号精确解锁集合 |
| Units | H01/H02/H03/H04/H07/H08/H09/M02/M03/Boss03 基础属性、类型、移速、范围、攻速、奖励和 Boss 标志；生产齿轮 1–4 级及六种五级融合兵使用精确属性倍率、模型路径和配置缩放；H02/H03/H07/H08/H09/H10 的可恢复弹体与命中特效均已接入，H0705/H08/H0905/H1505 使用原 `66.6ms` 逐帧时基；H1005/H1805 使用原角色 Spine，H1005 核弹和 H1505 冲撞图已恢复 | resources3 缺失的 H18_S1 主弹体、其余尚未恢复兵种弹丸及完整 matched capture 仍是证据边界 |
| Production | 核心逐侧触发连通块、100 点工人进度、HAMSTER 0.75 秒输出延迟、H12/H13 一次性技能、银币完成产出、1.5 倍速；准备态核心静止，每波战斗从方向 1 重新启动，P01 星 0 每波前 5 秒按原表提供 1.1 生产率；Release 使用 `Array.from` 保证连通 Set 正确转为 UID，1002 实机记录 1,986/1,986 次应用；核心直接相邻强化范围保持原语义；同一战斗 tick 为 `GameTimer` 核心生产先、`BattleTimer` 战斗帧后，48 条生产契约通过 | 无已知确定性生产顺序缺口；中心齿轮精确视觉转速仍待竞品录像逐帧计时 |
| Combat | 原版伤害内核、攻速缩放行为延迟、弹丸存活规则；战斗帧已固定为到时刷怪后进入队伍/碰撞、英雄逆序、怪物逆序、销毁、弹丸逆序与胜负检查，到时怪物和行动中新弹丸均可同帧更新；原生出生/抖动随机与 `9301/49297/233280` 种子战斗 RNG 已分离；逐帧最近目标、四叉树等距优先、严格搜索/攻击边界、归一化移动、英雄分离、基地路径与更新顺序；EXP 20/50/100；升级暂停；53 条原表效果行按 41 个互斥能力组参与抽取（39 个有效组和 2 个证据确认的配置/分派断链 no-op），并按原权重/阵容/账号星级/次数/基地生命/已恢复波次过滤；H01 连击必暴与星 7 最终击杀共享叠攻、H02 星 3/5/10 分裂射击与星 7/8 弹幕、H03 星 7/8 变形与星 10 穿透激光、H04 星 2/3 按实际攻击比例周期自疗、星 7/10 盾墙及星 8 H04/H09 普攻击飞、H11 星 2 护盾/星 5 基地修复、H12 全部能力、H13 基础/加成弹射次数及爆米花替换、经验强化、敌方攻击弱化、核心相邻强化、两种基地治疗及随机棋盘升级均已连接运行时消费者；H11 星 7 `HEAL_MORE_TARGER` 保留可选中/计次但不改变单目标行为的原版断链；伤害阶段已恢复护盾优先承伤、盾墙减伤及反伤先于原伤害/护盾结算、击飞对 Boss/技能类型及后续 RNG 的惰性门禁、H03 变形目标的出伤属性方向、激光对普通攻击专属被动的隔离，以及闪避/强制必暴对暴击 RNG 的惰性短路；跨调度器同 tick 固定为核心生产先于战斗帧 | 当前英雄族相关效果行已全部建模；目标账号 H01/H02/H03/H04/H11/H12/H13 实际星级仍需外部截图或存档确认，状态特效仍待 matched trace |
| Rounds | 关卡 1004 十五波完整排期、M07、三组 Boss 与真实清怪胜利条件；到期弹丸先结算、基地死亡优先，最后击杀同步结算 EXP 并立即清除未来弹丸，回合金币在 1000 ms `roundEnd` 回调发放；未完成战斗可恢复 `failedTimes`，失败/结束/退出清除断点 | 实际点击通关时长与手感 |
| Audio/effects | H02 `H29_S1` 光弹、H0204 `H29_S2` 篮球弹丸、H03/H08 `H13_S1` Spine 弹丸、H08 `H21_S1_LOWER` 六帧命中、H0905 `H24_S1` 飞弹/三帧命中、H13 `H25_S1 → H13_S1_LOWER` 飞行/低层命中链与逐段 `bullet_zhanche` 已接入；2026-08-13 新增 H06 五帧抛物线、H14 十六帧定点爆炸与 `bullet_shayu`、H17 两秒 Spine 射线、M03/Boss03 鱼骨抛物线、M09/Boss09 直线光球、M10/Boss10 Spine 抛物线，六类实机资源全部加载且控制台为 0；主弹等待攻击行为帧后显现；H03/H08 激光已绑定原始 `skill01` Spine 动画、300 长度数值射线与 `skill_jiguang`；胜败流程已实现 | v18 resources3 无 `H18_S1 / js_fashi_dandao` 原始文件；H08/H0905 帧时长与 H0905 响度 matched 验收，以及其余声音、技能、状态和结算特效 |

## Completion decision

工程已完成 1001–1200 的 200 关机制数据闭环，并合入账号成长、关卡奖励与连续推进。
最终特质和固定战斗截图已通过 `visualBaseline`；目标账号精确存档、广告平台流程、shape 动画逐帧复验和部分未访问界面保留为非阻塞扩展。

## 2026-08-12 progression/role audit addendum

| Check | Result | Evidence |
|---|---|---|
| Sequential level entry and energy | Pass | Only passed + latest challenge are interactable; normal entry spends 5 energy, validation routes are isolated bypasses |
| Unit unlock pool | Pass | Candidate families are derived from the recovered chapter unlock table; locked families cannot enter dynamic draws |
| Role acquisition and leveling | Pass | P01 default equipped; P02–P04 require 10 fragments; 3×2 daily fragments, 3 daily free levels, star level caps, 0–8 star costs and equip persistence are active |
| Role battle attributes | Pass | Equipped level/star attributes, all-role global level/star milestones, P01 start reward, P02/P03 actives and P04 active/passive consumers are connected |
| P04 damage source | Pass | Recovered `getTotalAtk()` source; left-to-right y=0 Dart, radius 150, max 10 distinct hits, 6000/9000/12000 base ratio with 1000 decay |
| Hero soft separation | Pass (source + deterministic); dense live replay pending | Stationary attacking/casting heroes now consume the recovered environment vector instead of pinning rear units; frozen units remain immobile. Kernel 116 assertions and movement integration 10 assertions pass |
| Regression/build | Pass | TypeScript pass; 47/47 tests; 200 levels / 2,978 rounds / 54,816 spawns; Web Mobile build finished at 14:24:23 |
| Terminal enemy presentation | Pass | Fatal damage immediately hides HP/shadow while preserving the death body animation; round cleanup also deactivates and destroys tracked death-animation roots. Dedicated 8 assertions; full 48/48 tests; TypeScript and 14:51 Web Mobile build pass. Fresh 1004 runtime captured `roundClear` with 0 enemies, empty unit layer, 0 shadows and no console warnings/errors |

P02–P04 精确头像与 P04 `H33_S1/feibiao` 已在后续表现闭环中恢复。仍保留的证据边界是目标账号精确存档、resources3 中不存在的 H18_S1 弹体，以及未访问页面的平台/服务器状态。

## 2026-08-12 Android device-build addendum

| Check | Result | Evidence |
|---|---|---|
| Android native build | Pass | Creator 3.8.8 生成原生工程；Gradle 8.11.1 `assembleDebug` 成功，90 项任务完成，680/680 C/C++ 编译并链接 `libcocos.so` |
| APK package | Pass | `com.cangshu.hamsterbattle` 1.0.1（versionCode 2）；35,095,085 bytes；minSdk 21、targetSdk 35、portrait、arm64-v8a |
| APK integrity | Pass | SHA-256 `846555C43C3FBBB97F8CA45DBD56D06857941599B79524D3DAF833AA79B6AD4A`；使用首包同一 Debug 证书，v1/v2/v3 签名及 4-byte zipalign 均验证通过 |
| Physical device smoke | Pass | Redmi Note 8 / Android 13 / arm64-v8a 覆盖安装成功；第 4 关布阵与实际战斗均正常渲染，进程存活，未匹配到 JS exception、fatal exception、native fatal signal 或 ANR |
| Native level-entry regression | Pass | 原生 canvas shim 存在但无 `dataset`，旧实现清场后写浏览器观测字段触发 TypeError；现已在任何 DOM 写入前保护退出。专项 4 项、全量 52/52、200 关 / 2,978 波 / 54,816 刷怪项、TypeScript 与新鲜 Android 构建均通过；诊断消耗已恢复为 30 体力、空挑战计数 |

交付包位于 `artifacts/android/cangshu-hamster-battle-1.0.1-v2-arm64.apk`；这是供实机体验的 debug 签名包，不是应用商店 release 包。Huawei 报告暂缺 ADB 设备现场，先通过 versionCode 2 和独立文件名排除旧包误装；若 1.0.1 仍复现，必须以该机 logcat 判定是否存在第二条原生异常或 GPU/Shader 分支，不在无证据时切换渲染后端。完整记录见 `targets/wxf9af2417e78ce07a/18/evidence/runtime/android-apk-build-2026-08-12.md`。
