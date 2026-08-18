# 全角色资源运行时巡检（2026-08-18）

- 目标：`wxf9af2417e78ce07a` / version `18`
- 构建：`cocosProject/build/resource-audit-validation-20260818/web-mobile`
- 方法：使用审计专用 `?resourceAudit=1` 路由，逐项调用 Cocos `resources.load`；静态回退项来自生产配置中的显式无模型/未下载分支。
- 结果：166 项；成功加载 155，使用静态回退 10，文件缺失 1；运行时异常 0。

| 类别 | 总数 | 成功加载 | 静态回退 | 文件缺失 |
| --- | ---: | ---: | ---: | ---: |
| 英雄/齿轮头像与战斗模型 | 97 | 91 | 6 | 0 |
| 动力角色卡片与战斗核心 | 8 | 4 | 4 | 0 |
| 怪物/Boss | 25 | 25 | 0 | 0 |
| 弹体 | 14 | 13 | 0 | 1 |
| 特效与关联音频 | 22 | 22 | 0 | 0 |

## 静态回退

- `H11/H12/H13/H14/H15/H17:combat`：原配置为驻场齿轮，没有独立战斗 Spine；齿轮头像和对应技能特效均已成功加载。
- `P02:card/core`、`P03:card/core`：原配置路径已知，但懒下载缓存尚未出现；当前使用带角色 ID 和品质色的静态头像回退。

## 文件缺失

- `H18_S1` → `spriteFrame/skill/js_fashi_dandao`：模型表引用该路径，但 version-18 `resources3` 没有对应 native 资源记录。这是当前唯一真实缺文件项。

## 巡检中修复

- `P04` 卡西西鼠飞镖文件实际存在；原生产绑定少了一层 `feibiao` 目录。已从 `original/feibiao/spriteFrame` 修正为 `original/feibiao/feibiao/spriteFrame`，重建后运行时加载成功。

逐项机器清单见 `full-resource-audit.json`。
