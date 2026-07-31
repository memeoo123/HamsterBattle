# HamsterBattle

微信小游戏逆向分析与 Cocos Creator 还原工程。

项目进度以 `ORCHESTRATION_STATE.json` 为准，`ORCHESTRATION_STATUS.md` 提供便于阅读的
状态摘要。项目使用的完整 Codex skill 链已经保存在 `skills/`，换设备后的安装和维护
方式见 `PROJECT_SKILLS.md`。

快速安装项目 skill：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-project-skills.ps1
```

安装依赖或用 Cocos Creator 打开工程后会重新生成 `node_modules`、`library`、`temp`、
`build` 等目录；这些内容不进入 Git。
