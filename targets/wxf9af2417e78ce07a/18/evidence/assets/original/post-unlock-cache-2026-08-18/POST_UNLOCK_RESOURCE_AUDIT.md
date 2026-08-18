# 全角色解锁后下载资源审计（2026-08-18）

## 结论

- `[已确认]` 目标 `wxf9af2417e78ce07a/18` 的 `.wxapkg` 未变化；新增内容来自微信桌面端的 `usr/gamecaches/resources2|resources3` 远程资源缓存。
- `[已确认]` 2026-08-18 14:19:41、14:24:39 与 14:49:37（北京时间）出现三批共 15 个新缓存项，合计 901,150 字节；第三批由装备 P04 进入战斗触发。
- `[已确认]` 第二批直接包含 `ui/hero` FairyGUI 包、`ui/hero_0` 图集和角色页背景，和用户报告的“已解锁所有角色并打开相关界面”相符。
- `[已确认]` 第三批包含 P04 完整战斗 Spine 两件和一张与既有 `fightscene_02` 完全相同的背景。所有非重复文件均已原样保存并记录 SHA-256。
- `[未恢复]` 此次仍未出现 `H18_S1 / spriteFrame/skill/js_fashi_dandao`。版本 18 的 `resources3` 配置没有该逻辑路径或原生 UUID，新的缓存索引也没有对应项。

## 新增资源组

### 角色界面

- `ui_hero.package.bin`：zlib 压缩 FairyGUI 包，包名 `hero`、包 ID `69f29748`。
- `ui_hero.atlas.png`：710×446，包含重置、锁定、升级标题/框等角色页通用图形。
- `bg1.jpg`：750×1626，角色主页背景。
- 包内确认 12 个组件：`HeroMainView`、`HeroInfoView`、`HeroUnlockView`、`HeroResetView`、角色卡、碎片条、属性、技能、升级动画等；三个主页面均声明 750×1334。

### 通用角色/养成图集

- `image_quality.png`：品质卡框、颜色条、圆形/齿轮品质标记。
- `image_shape.png`：角色/齿轮形状遮罩与装饰；与工程现有 `original/shape.png` 的 SHA-256 完全一致，复用现有文件。
- `image_effect.png`：完整能力/状态图标图集；与工程现有 `original/effect.png` 的 SHA-256 完全一致，复用现有文件。
- `chilunpy_shengjishanguang.skel/.png`：Spine 3.8.99 齿轮升级闪光，动画 `idle`。

### 其他按需表现

- `pao_kakaxi.skel/.png`：Spine 3.8.99，路径 `spine/power/pao_kakaxi0.75/pao_kakaxi`，含待机、攻击和 `skill01_fenghen` 动画族。
- `pao_kakaxi.full.skel/.png`：Spine 3.8.99，路径 `spine/power/pao_kakaxi/pao_kakaxi`，为装备 P04 进入战斗后下载的完整战斗模型；与 0.75 版分开保存。
- `cj_xuedi.skel/.png`：Spine 3.8.99 雪地场景装饰，动画 `idle`。

## 证据边界

- 只读取了资源缓存目录与资源索引；没有读取 MMKV、账号数据库、登录材料、日志、凭据或令牌。
- “全部角色已解锁”来自用户报告；本次没有通过读取账号存档来独立验证解锁标志或星级。
- 新资源能够补齐角色页与养成表现证据，但不能证明目标账号的每名英雄等级/星级，也不能关闭原账号数值一致性门禁。
- 更正：资源配置中的路径如果尚未出现在本地缓存，只能标记为“懒加载待触发”，不能标记为“资源不存在”。当前 P01 与 P04 的完整/0.75 模型均已缓存；P02、P03 路径已配置但本地尚未缓存。
- P01 两套模型来自 2026-07-31 的既有缓存，并非本次解锁操作的新下载；它们因缓存文件名是数字而被早期文件名扫描漏判，现已按 UUID/逻辑路径补录并合入工程。

## 产物

- `manifest.json`：缓存时间、UUID、逻辑路径、尺寸、哈希和负证据。
- `ui_hero.package.raw`：FairyGUI 包解压副本。
- `ui_hero.layout.json`：包项、组件尺寸和候选子节点解析结果；布局解析器仍不能保证像素级完整关系/控制器还原。
- `cacheList.snapshot.json`：本次远程资源 URL 到 `wxfile://usr/gamecaches/...` 的映射快照。
- `cacheList.after-p04-battle.json`：装备 P04 进入战斗后的 82 项缓存索引快照。
