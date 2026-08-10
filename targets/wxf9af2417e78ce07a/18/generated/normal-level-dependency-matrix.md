# 200 关依赖矩阵摘要

目标：`wxf9af2417e78ce07a/18`

## 结论

- 关卡表完整覆盖 **200 关 / 2978 波 / 54816 个排期刷怪项**。
- 当前 **200 关**通过现有运行时依赖并已开放验证；其余 0 关不是独立玩法工程，而是被共享依赖门禁挡住。
- 全量普通关只使用 **4 张背景**，还缺 0 张。
- 全量普通关实际使用 **25 种敌人模型/行为**，还缺 0 种。
- 推荐阵容涉及 **12 个英雄族**，还缺 0 个族；推荐阵容仅为信息依赖，不单独阻止关卡运行。
- 准备阶段已有 **200/200 关**接入通用表驱动；每关直接读取 staticBricks/initRewards，每波读取 coinRewards。

## 剩余验证顺序

1. 用新 Creator Web 构建抽样 1001、1100、1200，确认早/中/晚关选择、准备和开战。
2. 使用有证据的账号成长输入验证后期关卡平衡和完整胜利闭环。
3. 视觉资源与 matched capture 继续作为独立低优先级门禁。

## 背景依赖

| ID | 名称 | 引用关卡数 | 状态 |
|---|---|---:|---|
| fightscene_01 | fightscene_01 | 80 | implemented |
| fightscene_02 | fightscene_02 | 40 | implemented |
| fightscene_03 | fightscene_03 | 40 | implemented |
| fightscene_04 | fightscene_04 | 40 | implemented |

## 缺失敌人依赖（按覆盖收益排序）

| ID | 名称 | 引用关卡数 | 状态 |
|---|---|---:|---|


## 缺失推荐英雄族

| ID | 名称 | 引用关卡数 | 状态 |
|---|---|---:|---|


完整逐关字段见 `normal-level-dependency-matrix.csv`，机器可读结果见 `normal-level-dependency-matrix.json`。
