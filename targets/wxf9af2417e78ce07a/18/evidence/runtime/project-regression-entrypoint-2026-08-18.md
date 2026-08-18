# 项目一键回归入口（2026-08-18）

入口：`scripts/run-project-regression.ps1`

## Quick

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/run-project-regression.ps1 -Profile Quick
```

Quick 会依次执行：

- 新鲜 Cocos Creator 3.8.8 Web Mobile 构建；
- TypeScript、Golden Cases 和全部 `*.test.mjs` 机制验证；
- 166 项全资源运行时巡检；
- 1001、1002、1100 的发牌/布阵/生产/刷怪/回合清算冒烟。

本轮从源码构建的 Quick 实测 47.104 秒完成并通过：Creator 构建 8 秒，61 条验证命令、59 个测试文件、166 项资源和 3/3 代表关均通过。

## Full

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/run-project-regression.ps1 -Profile Full
```

Full 在 Quick 基础上改为遍历全部 200 关，并顺序运行 1001、1002、1100 最终胜利长流程；单个长流程超过边界时，会在同一浏览器会话最多续跑两段。该档适合发布前或大批资源合并后使用。

可用选项：

- `-SkipBuild -BuildPath <web-mobile>`：复用明确指定的现有构建；
- `-WorkerCount 1..8`：调整 200 关并发分片数，默认 4；
- `-PerLevelTimeoutMs <ms>`：调整单关冒烟观察上限，默认 60000；
- `-SkipLongRuns`：只在专门做 200 关巡检时跳过已通过的三关长流程。

每次执行都会创建独立证据目录，写入 `regression-summary.json`、机制报告、资源清单、关卡清单和各进程日志，并在 `finally` 中只关闭本次启动的服务器与 Chrome 进程。
