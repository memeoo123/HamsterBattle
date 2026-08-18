[CmdletBinding()]
param(
    [ValidateSet('Quick', 'Full')]
    [string]$Profile = 'Quick',
    [string]$BuildPath = '',
    [string]$OutputRoot = '',
    [ValidateRange(1, 8)]
    [int]$WorkerCount = 4,
    [ValidateRange(3000, 120000)]
    [int]$PerLevelTimeoutMs = 60000,
    [switch]$SkipBuild,
    [switch]$SkipLongRuns
)

$ErrorActionPreference = 'Stop'
# Some managed launchers expose both `PATH` and `Path`. Windows treats them as
# one variable, but Windows PowerShell 5.1 Start-Process builds a case-insensitive
# dictionary and otherwise fails before starting any child process.
$taskPathValue = $env:Path
[Environment]::SetEnvironmentVariable('PATH', $null, 'Process')
[Environment]::SetEnvironmentVariable('Path', $null, 'Process')
[Environment]::SetEnvironmentVariable('Path', $taskPathValue, 'Process')
$script:StartedProcesses = [System.Collections.Generic.List[System.Diagnostics.Process]]::new()
$script:TemporaryDirectories = [System.Collections.Generic.List[string]]::new()
$startedAt = Get-Date
$projectRoot = Split-Path -Parent $PSScriptRoot
$cocosProject = Join-Path $projectRoot 'cocosProject'
$targetRoot = Join-Path $projectRoot 'targets\wxf9af2417e78ce07a\18'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
if (-not $OutputRoot) {
    $OutputRoot = Join-Path $targetRoot "evidence\runtime\project-regression-$timestamp"
}
$OutputRoot = [System.IO.Path]::GetFullPath($OutputRoot)
New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null

function Add-StartedProcess {
    param([System.Diagnostics.Process]$Process)
    $script:StartedProcesses.Add($Process)
    return $Process
}

function Stop-StartedProcess {
    param([System.Diagnostics.Process]$Process)
    if (-not $Process) { return }
    try {
        $Process.Refresh()
        if (-not $Process.HasExited) { Stop-Process -Id $Process.Id -Force -ErrorAction SilentlyContinue }
    } catch {
        Write-Warning "Could not stop task-owned process $($Process.Id): $($_.Exception.Message)"
    }
}

function Wait-HttpEndpoint {
    param([string]$Url, [int]$TimeoutSeconds = 30)
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    do {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) { return }
        } catch {
            Start-Sleep -Milliseconds 200
        }
    } while ((Get-Date) -lt $deadline)
    throw "Timed out waiting for $Url"
}

function Resolve-ChromePath {
    $candidates = @(
        "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    )
    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path -LiteralPath $candidate)) { return $candidate }
    }
    throw 'Google Chrome was not found.'
}

function Start-RegressionChrome {
    param([int]$DebugPort, [int]$AppPort, [string]$Name)
    $profileDirectory = Join-Path ([System.IO.Path]::GetTempPath()) "cangshu-regression-$timestamp-$PID-$Name"
    New-Item -ItemType Directory -Path $profileDirectory -Force | Out-Null
    $script:TemporaryDirectories.Add([System.IO.Path]::GetFullPath($profileDirectory))
    $chrome = Start-Process -FilePath (Resolve-ChromePath) -ArgumentList @(
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--remote-allow-origins=*',
        '--no-first-run',
        '--no-default-browser-check',
        "--remote-debugging-port=$DebugPort",
        "--user-data-dir=$profileDirectory",
        "http://127.0.0.1:$AppPort/"
    ) -WindowStyle Hidden -PassThru
    Add-StartedProcess $chrome | Out-Null
    Wait-HttpEndpoint -Url "http://127.0.0.1:$DebugPort/json/list"
    return $chrome
}

function Invoke-NodeContract {
    param([string[]]$Arguments, [string]$LogName)
    $stdout = Join-Path $OutputRoot "$LogName.stdout.log"
    $stderr = Join-Path $OutputRoot "$LogName.stderr.log"
    Push-Location $projectRoot
    try {
        & node @Arguments 1> $stdout 2> $stderr
        $exitCode = $LASTEXITCODE
    } finally {
        Pop-Location
    }
    return [pscustomobject]@{ ExitCode = $exitCode; Stdout = $stdout; Stderr = $stderr }
}

function Invoke-CreatorBuild {
    $creator = 'C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe'
    if (-not (Test-Path -LiteralPath $creator)) { throw "Creator executable missing: $creator" }
    $buildRoot = Join-Path $cocosProject "build\project-regression-$timestamp"
    $stdout = Join-Path $OutputRoot 'creator-build.stdout.log'
    $stderr = Join-Path $OutputRoot 'creator-build.stderr.log'
    $arguments = @('--project', $cocosProject, '--build', "platform=web-mobile;debug=false;buildPath=$buildRoot")
    $process = Start-Process -FilePath $creator -ArgumentList $arguments -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    Add-StartedProcess $process | Out-Null
    $process.WaitForExit()
    $process.Refresh()
    $logText = ((Get-Content -LiteralPath $stdout -Raw -ErrorAction SilentlyContinue) + "`n" +
        (Get-Content -LiteralPath $stderr -Raw -ErrorAction SilentlyContinue))
    # Creator 3.8.8 may report its successful CLI sentinel as process code 36,
    # and Windows PowerShell can expose a blank ExitCode for this Electron
    # launcher. The build-finished marker plus the emitted index are the stable
    # cross-shell success contract.
    if ($logText -notmatch 'build Task \(web-mobile\) Finished') {
        throw "Creator build did not reach its completion marker (exit $($process.ExitCode)). See $stdout and $stderr"
    }
    $result = Join-Path $buildRoot 'web-mobile'
    if (-not (Test-Path -LiteralPath (Join-Path $result 'index.html'))) {
        throw "Creator reported success but build index is absent: $result"
    }
    return $result
}

function Resolve-LatestBuild {
    $candidates = Get-ChildItem -LiteralPath (Join-Path $cocosProject 'build') -Directory -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -eq 'web-mobile' -and (Test-Path -LiteralPath (Join-Path $_.FullName 'index.html')) } |
        Sort-Object LastWriteTime -Descending
    if (-not $candidates) { throw 'No web-mobile build was found. Omit -SkipBuild to create one.' }
    return $candidates[0].FullName
}

function Invoke-MechanicsValidation {
    $output = Join-Path $OutputRoot 'mechanics-validation.json'
    & python (Join-Path $projectRoot 'skills\cocos-minigame-restorer\scripts\generate_validation_manifest.py') `
        --project $cocosProject --profile mechanics `
        --golden-cases (Join-Path $targetRoot 'generated\golden-cases.json') `
        --creator-root 'C:\ProgramData\cocos\editors\Creator\3.8.8' --output $output | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "Mechanics validation failed. See $output" }
    $manifest = Get-Content -LiteralPath $output -Raw -Encoding UTF8 | ConvertFrom-Json
    if (-not $manifest.passed) { throw "Mechanics validation manifest reports failure: $output" }
    return $output
}

function Invoke-ResourceAudit {
    param([int]$AppPort, [int]$DebugPort)
    $directory = Join-Path $OutputRoot 'resource-audit'
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
    $chrome = Start-RegressionChrome -DebugPort $DebugPort -AppPort $AppPort -Name 'resource-audit'
    try {
        $result = Invoke-NodeContract -LogName 'resource-audit' -Arguments @(
            (Join-Path $cocosProject 'tests\full-resource-audit-browser-contract.mjs'),
            "http://127.0.0.1:$DebugPort",
            "http://127.0.0.1:$AppPort",
            $directory
        )
        if ($result.ExitCode -ne 0) { throw "Resource audit exited $($result.ExitCode). See $($result.Stderr)" }
    } finally {
        Stop-StartedProcess $chrome
    }
    return (Join-Path $directory 'full-resource-audit.json')
}

function Invoke-AllLevelSmoke {
    param([int]$AppPort, [int]$DebugPortBase, [bool]$AllLevels)
    $levelData = Get-Content -LiteralPath (Join-Path $cocosProject 'assets\resources\data\normal-levels.json') -Raw -Encoding UTF8 | ConvertFrom-Json
    $ids = if ($AllLevels) { @($levelData.levels | ForEach-Object { [int]$_.id }) } else { @(1001, 1002, 1100) }
    $actualWorkers = [Math]::Min($WorkerCount, $ids.Count)
    $shards = @()
    for ($index = 0; $index -lt $actualWorkers; $index += 1) { $shards += ,([System.Collections.Generic.List[int]]::new()) }
    for ($index = 0; $index -lt $ids.Count; $index += 1) { $shards[$index % $actualWorkers].Add($ids[$index]) }
    $processes = @()
    $chromes = @()
    try {
        for ($index = 0; $index -lt $actualWorkers; $index += 1) {
            $debugPort = $DebugPortBase + $index
            $chrome = Start-RegressionChrome -DebugPort $debugPort -AppPort $AppPort -Name "all-level-$index"
            $chromes += $chrome
            $output = Join-Path $OutputRoot "all-level-shard-$index.json"
            $failureDirectory = Join-Path $OutputRoot "all-level-failures-$index"
            $stdout = Join-Path $OutputRoot "all-level-shard-$index.stdout.log"
            $stderr = Join-Path $OutputRoot "all-level-shard-$index.stderr.log"
            $arguments = @(
                (Join-Path $cocosProject 'tests\all-level-runtime-smoke-browser-contract.mjs'),
                "http://127.0.0.1:$debugPort",
                "http://127.0.0.1:$AppPort",
                $output,
                ($shards[$index] -join ','),
                [string]$PerLevelTimeoutMs,
                $failureDirectory
            )
            $process = Start-Process -FilePath 'node' -ArgumentList $arguments -WorkingDirectory $projectRoot `
                -WindowStyle Hidden -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
            Add-StartedProcess $process | Out-Null
            $processes += [pscustomobject]@{ Process = $process; Output = $output; Stdout = $stdout; Stderr = $stderr }
        }
        foreach ($item in $processes) { $item.Process.WaitForExit() }
        $reports = @()
        foreach ($item in $processes) {
            $item.Process.Refresh()
            if (-not (Test-Path -LiteralPath $item.Output)) { throw "All-level shard did not write $($item.Output). See $($item.Stderr)" }
            $reports += Get-Content -LiteralPath $item.Output -Raw -Encoding UTF8 | ConvertFrom-Json
        }
        $evidence = @($reports | ForEach-Object { $_.evidence } | Sort-Object levelId)
        $failures = @($evidence | Where-Object { -not $_.passed })
        $report = [ordered]@{
            schemaVersion = 1
            capturedAt = (Get-Date).ToUniversalTime().ToString('o')
            passed = $failures.Count -eq 0
            profile = if ($AllLevels) { 'all-200-levels' } else { 'representative-three-levels' }
            workerCount = $actualWorkers
            perLevelTimeoutMs = $PerLevelTimeoutMs
            totals = [ordered]@{ expected = $evidence.Count; passed = $evidence.Count - $failures.Count; failed = $failures.Count }
            failures = @($failures | ForEach-Object { [ordered]@{ levelId = $_.levelId; issues = $_.issues; screenshot = $_.screenshot } })
            evidence = $evidence
        }
        $combined = Join-Path $OutputRoot 'all-level-runtime-smoke.json'
        [System.IO.File]::WriteAllText($combined, (($report | ConvertTo-Json -Depth 100) + "`n"), [System.Text.UTF8Encoding]::new($false))
        if ($failures.Count -gt 0) { throw "$($failures.Count) level smoke checks failed. See $combined" }
        return $combined
    } finally {
        foreach ($chrome in $chromes) { Stop-StartedProcess $chrome }
    }
}

function Invoke-RepresentativeLongRuns {
    param([int]$AppPort, [int]$DebugPort)
    $targets = @(
        [pscustomobject]@{ Level = 1001; Contract = 'level-1001-closure-browser-contract.mjs'; Timeout = 900000 },
        [pscustomobject]@{ Level = 1002; Contract = 'candidate-level-closure-browser-contract.mjs'; Timeout = 1200000 },
        [pscustomobject]@{ Level = 1100; Contract = 'level-15-closure-browser-contract.mjs'; Timeout = 1200000 }
    )
    $results = @()
    $targetIndex = 0
    foreach ($target in $targets) {
        $targetDebugPort = $DebugPort + $targetIndex
        $targetIndex += 1
        $directory = Join-Path $OutputRoot "long-run-$($target.Level)"
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
        $chrome = Start-RegressionChrome -DebugPort $targetDebugPort -AppPort $AppPort -Name "long-$($target.Level)"
        try {
            $passed = $false
            for ($segment = 0; $segment -lt 3 -and -not $passed; $segment += 1) {
                $resume = if ($segment -eq 0) { 'navigate' } else { 'resume' }
                $arguments = switch ($target.Level) {
                    1001 { @((Join-Path $cocosProject "tests\$($target.Contract)"), "http://127.0.0.1:$targetDebugPort", "http://127.0.0.1:$AppPort", $directory, [string]$target.Timeout, $resume) }
                    1002 { @((Join-Path $cocosProject "tests\$($target.Contract)"), "http://127.0.0.1:$targetDebugPort", "http://127.0.0.1:$AppPort", $directory, '1002', [string]$target.Timeout, $resume) }
                    1100 { @((Join-Path $cocosProject "tests\$($target.Contract)"), "http://127.0.0.1:$targetDebugPort", "http://127.0.0.1:$AppPort", $directory, '1100', [string]$target.Timeout, $resume) }
                }
                $run = Invoke-NodeContract -Arguments $arguments -LogName "long-run-$($target.Level)-segment-$segment"
                $passed = $run.ExitCode -eq 0
            }
            $manifestPath = Join-Path $directory 'manifest.json'
            if (-not $passed -or -not (Test-Path -LiteralPath $manifestPath)) {
                throw "Representative long run $($target.Level) did not finish after three bounded segments."
            }
            $manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
            if (-not $manifest.won) { throw "Representative long run $($target.Level) did not reach won." }
            $results += [ordered]@{ levelId = $target.Level; manifest = $manifestPath; won = $manifest.won; highestRound = $manifest.highestRound }
        } finally {
            Stop-StartedProcess $chrome
        }
    }
    $output = Join-Path $OutputRoot 'representative-long-runs.json'
    [System.IO.File]::WriteAllText($output, (([ordered]@{ passed = $true; levels = $results } | ConvertTo-Json -Depth 10) + "`n"), [System.Text.UTF8Encoding]::new($false))
    return $output
}

$summary = [ordered]@{
    schemaVersion = 1
    profile = $Profile
    startedAt = $startedAt.ToUniversalTime().ToString('o')
    project = $cocosProject
    outputRoot = $OutputRoot
    build = $null
    passed = $false
    steps = [ordered]@{}
    error = $null
}

try {
    if (-not $SkipBuild) { $BuildPath = Invoke-CreatorBuild }
    elseif (-not $BuildPath) { $BuildPath = Resolve-LatestBuild }
    $BuildPath = [System.IO.Path]::GetFullPath($BuildPath)
    if (-not (Test-Path -LiteralPath (Join-Path $BuildPath 'index.html'))) { throw "Invalid web build: $BuildPath" }
    $summary.build = $BuildPath

    $serverStdout = Join-Path $OutputRoot 'http-server.stdout.log'
    $serverStderr = Join-Path $OutputRoot 'http-server.stderr.log'
    $appPort = 18190
    $server = Start-Process -FilePath 'python' -ArgumentList @('-m', 'http.server', [string]$appPort, '--bind', '127.0.0.1') `
        -WorkingDirectory $BuildPath -WindowStyle Hidden -PassThru -RedirectStandardOutput $serverStdout -RedirectStandardError $serverStderr
    Add-StartedProcess $server | Out-Null
    Wait-HttpEndpoint -Url "http://127.0.0.1:$appPort/"

    $summary.steps.mechanicsValidation = Invoke-MechanicsValidation
    $summary.steps.resourceAudit = Invoke-ResourceAudit -AppPort $appPort -DebugPort 19310
    $summary.steps.allLevelRuntimeSmoke = Invoke-AllLevelSmoke -AppPort $appPort -DebugPortBase 19320 -AllLevels ($Profile -eq 'Full')
    if ($Profile -eq 'Full' -and -not $SkipLongRuns) {
        $summary.steps.representativeLongRuns = Invoke-RepresentativeLongRuns -AppPort $appPort -DebugPort 19340
    } elseif ($Profile -eq 'Full') {
        $summary.steps.representativeLongRuns = 'skipped by -SkipLongRuns'
    }
    $summary.passed = $true
} catch {
    $summary.error = $_.Exception.ToString()
    throw
} finally {
    $summary.finishedAt = (Get-Date).ToUniversalTime().ToString('o')
    $summary.elapsedSeconds = [Math]::Round(((Get-Date) - $startedAt).TotalSeconds, 3)
    $summaryPath = Join-Path $OutputRoot 'regression-summary.json'
    [System.IO.File]::WriteAllText($summaryPath, (($summary | ConvertTo-Json -Depth 30) + "`n"), [System.Text.UTF8Encoding]::new($false))
    foreach ($process in $script:StartedProcesses) { Stop-StartedProcess $process }
    $temporaryRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
    foreach ($directory in $script:TemporaryDirectories) {
        $resolvedDirectory = [System.IO.Path]::GetFullPath($directory)
        $leaf = Split-Path -Leaf $resolvedDirectory
        if ($resolvedDirectory.StartsWith($temporaryRoot, [System.StringComparison]::OrdinalIgnoreCase) `
            -and $leaf.StartsWith('cangshu-regression-', [System.StringComparison]::OrdinalIgnoreCase) `
            -and (Test-Path -LiteralPath $resolvedDirectory)) {
            Remove-Item -LiteralPath $resolvedDirectory -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Output "Regression summary: $summaryPath"
}
