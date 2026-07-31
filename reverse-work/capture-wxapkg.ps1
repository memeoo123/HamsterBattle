$ErrorActionPreference = 'SilentlyContinue'
$sourceRoot = 'C:\Users\jiachengwei\AppData\Roaming\Tencent\xwechat\radium\users\d833ae57d25e1087edac741082077974\applet\packages'
$captureRoot = 'E:\Projects\weichatAnalysis\cangshu\reverse-work\captured-packages'
$logPath = 'E:\Projects\weichatAnalysis\cangshu\reverse-work\captured-packages\capture-events.jsonl'
New-Item -ItemType Directory -Path $captureRoot -Force | Out-Null
$startRecord = [PSCustomObject]@{ event = 'watcher-start'; utc = [DateTime]::UtcNow.ToString('o'); source = $sourceRoot; durationSeconds = 300 }
$startRecord | ConvertTo-Json -Compress | Add-Content -LiteralPath $logPath -Encoding UTF8
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $sourceRoot
$watcher.Filter = '*.wxapkg'
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, Size, CreationTime'
$watcher.EnableRaisingEvents = $true
$config = @{ SourceRoot = $sourceRoot; CaptureRoot = $captureRoot; LogPath = $logPath }
$captureAction = {
    $cfg = $Event.MessageData
    $eventPath = $Event.SourceEventArgs.FullPath
    if ([string]::IsNullOrWhiteSpace($eventPath) -or -not $eventPath.EndsWith('.wxapkg',[StringComparison]::OrdinalIgnoreCase)) { return }
    $fullSourceRoot = [System.IO.Path]::GetFullPath($cfg.SourceRoot).TrimEnd('\') + '\'
    $fullEventPath = [System.IO.Path]::GetFullPath($eventPath)
    if (-not $fullEventPath.StartsWith($fullSourceRoot,[StringComparison]::OrdinalIgnoreCase)) { return }
    $relativePath = $fullEventPath.Substring($fullSourceRoot.Length)
    $relativeDir = [System.IO.Path]::GetDirectoryName($relativePath)
    $baseName = [System.IO.Path]::GetFileName($relativePath)
    $destinationDir = Join-Path $cfg.CaptureRoot $relativeDir
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
    $stamp = [DateTime]::UtcNow.ToString('yyyyMMdd-HHmmssfff')
    $destination = Join-Path $destinationDir (('{0}-{1}-{2}' -f $stamp,$Event.SourceEventArgs.ChangeType,$baseName))
    $copied = $false
    $copyError = $null
    for ($attempt = 0; $attempt -lt 60 -and -not $copied; $attempt++) {
        try {
            [System.IO.File]::Copy($fullEventPath,$destination,$false)
            $copied = $true
        } catch {
            $copyError = $_.Exception.Message
            Start-Sleep -Milliseconds 50
        }
    }
    $length = if ($copied) { (Get-Item -LiteralPath $destination).Length } else { $null }
    $record = [PSCustomObject]@{ event = 'wxapkg-change'; utc = [DateTime]::UtcNow.ToString('o'); change = [string]$Event.SourceEventArgs.ChangeType; source = $fullEventPath; capture = if ($copied) { $destination } else { $null }; length = $length; error = if ($copied) { $null } else { $copyError } }
    $record | ConvertTo-Json -Compress | Add-Content -LiteralPath $cfg.LogPath -Encoding UTF8
}
$subscriptions = @(
    Register-ObjectEvent -InputObject $watcher -EventName Created -SourceIdentifier 'wxapkg-created' -MessageData $config -Action $captureAction
    Register-ObjectEvent -InputObject $watcher -EventName Changed -SourceIdentifier 'wxapkg-changed' -MessageData $config -Action $captureAction
    Register-ObjectEvent -InputObject $watcher -EventName Renamed -SourceIdentifier 'wxapkg-renamed' -MessageData $config -Action $captureAction
)
try {
    Start-Sleep -Seconds 300
} finally {
    $watcher.EnableRaisingEvents = $false
    $subscriptions | ForEach-Object { Unregister-Event -SourceIdentifier $_.Name -ErrorAction SilentlyContinue; Remove-Job -Id $_.Id -Force -ErrorAction SilentlyContinue }
    $watcher.Dispose()
    [PSCustomObject]@{ event = 'watcher-stop'; utc = [DateTime]::UtcNow.ToString('o') } | ConvertTo-Json -Compress | Add-Content -LiteralPath $logPath -Encoding UTF8
}