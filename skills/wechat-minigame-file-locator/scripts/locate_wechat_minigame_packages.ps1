[CmdletBinding()]
param(
    [ValidateSet("Scan", "Snapshot", "Diff", "Watch")]
    [string]$Mode = "Scan",

    [string]$SnapshotPath,

    [string]$OutputPath,

    [ValidateRange(1, 500)]
    [int]$RecentLimit = 30,

    [ValidateRange(1, 300)]
    [int]$DurationSeconds = 30,

    [ValidateRange(100, 5000)]
    [int]$PollMilliseconds = 500
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-NormalizedPath {
    param([Parameter(Mandatory = $true)][string]$Path)

    return [System.IO.Path]::GetFullPath($Path).TrimEnd(
        [System.IO.Path]::DirectorySeparatorChar,
        [System.IO.Path]::AltDirectorySeparatorChar
    )
}

function Test-IsDescendantPath {
    param(
        [Parameter(Mandatory = $true)][string]$Child,
        [Parameter(Mandatory = $true)][string]$Parent
    )

    $childPath = Get-NormalizedPath -Path $Child
    $parentPath = Get-NormalizedPath -Path $Parent
    $prefix = $parentPath + [System.IO.Path]::DirectorySeparatorChar

    return $childPath.Equals(
        $parentPath,
        [System.StringComparison]::OrdinalIgnoreCase
    ) -or $childPath.StartsWith(
        $prefix,
        [System.StringComparison]::OrdinalIgnoreCase
    )
}

function Add-PackageRoot {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyCollection()]
        [System.Collections.Generic.List[object]]$Roots,
        [Parameter(Mandatory = $true)][string]$Kind,
        [Parameter(Mandatory = $true)][string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
        return
    }

    $normalized = Get-NormalizedPath -Path $Path
    foreach ($root in $Roots) {
        if ($root.path.Equals(
            $normalized,
            [System.StringComparison]::OrdinalIgnoreCase
        )) {
            return
        }
    }

    $Roots.Add([pscustomobject][ordered]@{
        kind = $Kind
        path = $normalized
    })
}

function Get-ConfiguredDataRoots {
    $results = New-Object "System.Collections.Generic.List[string]"
    $configDirectory = Join-Path $env:APPDATA "Tencent\xwechat\config"

    if (-not (Test-Path -LiteralPath $configDirectory -PathType Container)) {
        return
    }

    foreach ($file in Get-ChildItem -LiteralPath $configDirectory -File -Filter "*.ini" -ErrorAction SilentlyContinue) {
        if ($file.Length -gt 4096) {
            continue
        }

        try {
            $candidate = ([System.IO.File]::ReadAllText($file.FullName)).Trim()
            if ([System.IO.Path]::IsPathRooted($candidate) -and
                (Test-Path -LiteralPath $candidate -PathType Container)) {
                $normalized = Get-NormalizedPath -Path $candidate
                if (-not $results.Contains($normalized)) {
                    $results.Add($normalized)
                }
            }
        }
        catch {
            continue
        }
    }

    $results | ForEach-Object { $_ }
}

function Get-PackageRoots {
    $roots = New-Object "System.Collections.Generic.List[object]"

    $radiumCandidates = @(
        (Join-Path $env:APPDATA "Tencent\xwechat\radium\users"),
        (Join-Path $env:APPDATA "Tencent\WeChat\radium\users")
    )

    foreach ($usersRoot in $radiumCandidates) {
        if (-not (Test-Path -LiteralPath $usersRoot -PathType Container)) {
            continue
        }

        foreach ($userDirectory in Get-ChildItem -LiteralPath $usersRoot -Directory -ErrorAction SilentlyContinue) {
            Add-PackageRoot -Roots $roots -Kind "xwechat-radium" -Path (
                Join-Path $userDirectory.FullName "applet\packages"
            )
        }
    }

    $documents = [Environment]::GetFolderPath("MyDocuments")
    $legacyCandidates = @(
        (Join-Path $documents "WeChat Files\Applet"),
        (Join-Path $documents "xwechat_files\Applet")
    )

    foreach ($candidate in $legacyCandidates) {
        Add-PackageRoot -Roots $roots -Kind "legacy-applet" -Path $candidate
    }

    foreach ($dataRoot in Get-ConfiguredDataRoots) {
        $accountContainers = @(
            (Join-Path $dataRoot "xwechat_files"),
            (Join-Path $dataRoot "WeChat Files")
        )

        foreach ($accountContainer in $accountContainers) {
            if (-not (Test-Path -LiteralPath $accountContainer -PathType Container)) {
                continue
            }

            Add-PackageRoot -Roots $roots -Kind "configured-data-root" -Path (
                Join-Path $accountContainer "Applet"
            )

            foreach ($accountDirectory in Get-ChildItem -LiteralPath $accountContainer -Directory -ErrorAction SilentlyContinue) {
                Add-PackageRoot -Roots $roots -Kind "configured-data-root" -Path (
                    Join-Path $accountDirectory.FullName "Applet"
                )
                Add-PackageRoot -Roots $roots -Kind "configured-data-root" -Path (
                    Join-Path $accountDirectory.FullName "applet\packages"
                )
            }
        }
    }

    $roots | ForEach-Object { $_ }
}

function Get-PackageRole {
    param([Parameter(Mandatory = $true)][string]$Name)

    switch ($Name.ToLowerInvariant()) {
        "__app__.wxapkg" { return "main" }
        "__plugincode__.wxapkg" { return "plugin" }
        "__without_multi_plugincode__.wxapkg" { return "plugin-bundle" }
        default { return "subpackage" }
    }
}

function Get-PackageInventory {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyCollection()]
        [object[]]$Roots
    )

    $packages = New-Object "System.Collections.Generic.List[object]"

    foreach ($root in $Roots) {
        foreach ($file in Get-ChildItem -LiteralPath $root.path -File -Recurse -Filter "*.wxapkg" -ErrorAction SilentlyContinue) {
            $relative = $file.FullName.Substring($root.path.Length).TrimStart(
                [System.IO.Path]::DirectorySeparatorChar,
                [System.IO.Path]::AltDirectorySeparatorChar
            )
            $segments = $relative -split "[\\/]"
            $appId = $null
            $version = $null
            $appIndex = -1

            for ($index = 0; $index -lt $segments.Count; $index++) {
                if ($segments[$index] -match "^wx[0-9a-fA-F]{16}$") {
                    $appId = $segments[$index].ToLowerInvariant()
                    $appIndex = $index
                    break
                }
            }

            if ($appIndex -ge 0 -and ($appIndex + 1) -lt $segments.Count) {
                $version = $segments[$appIndex + 1]
            }

            $packages.Add([pscustomobject][ordered]@{
                rootKind = $root.kind
                packageRoot = $root.path
                appId = $appId
                version = $version
                role = Get-PackageRole -Name $file.Name
                name = $file.Name
                fullPath = $file.FullName
                relativePath = $relative
                length = [long]$file.Length
                lastWriteTimeUtc = $file.LastWriteTimeUtc.ToString("o")
            })
        }
    }

    return @($packages | Sort-Object lastWriteTimeUtc -Descending)
}

function Get-InventoryReport {
    param([switch]$IncludeAllPackages)

    $roots = @(Get-PackageRoots)
    $packages = @(Get-PackageInventory -Roots $roots)
    $visiblePackages = $packages

    if (-not $IncludeAllPackages) {
        $visiblePackages = @($packages | Select-Object -First $RecentLimit)
    }

    $appIds = @($packages | Where-Object { $null -ne $_.appId } | Select-Object -ExpandProperty appId -Unique)
    $versions = @(
        $packages |
            Where-Object { $null -ne $_.appId -and $null -ne $_.version } |
            ForEach-Object { "$($_.appId)|$($_.version)" } |
            Select-Object -Unique
    )

    return [pscustomobject][ordered]@{
        schemaVersion = "2.0"
        sourceReadOnly = $true
        contentRead = $false
        scannedAtUtc = [DateTime]::UtcNow.ToString("o")
        roots = $roots
        summary = [pscustomobject][ordered]@{
            rootCount = $roots.Count
            appIdCount = $appIds.Count
            versionCount = $versions.Count
            packageFileCount = $packages.Count
            visiblePackageCount = $visiblePackages.Count
        }
        packages = $visiblePackages
    }
}

function Assert-SnapshotPathIsSafe {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][object[]]$Roots
    )

    $normalized = Get-NormalizedPath -Path $Path
    foreach ($root in $Roots) {
        if (Test-IsDescendantPath -Child $normalized -Parent $root.path) {
            throw "SnapshotPath must not be inside a WeChat package root: $($root.path)"
        }
    }

    $wechatRuntimeRoot = Join-Path $env:APPDATA "Tencent\xwechat"
    if ((Test-Path -LiteralPath $wechatRuntimeRoot -PathType Container) -and
        (Test-IsDescendantPath -Child $normalized -Parent $wechatRuntimeRoot)) {
        throw "SnapshotPath must not be inside the WeChat runtime data directory."
    }

    $parent = Split-Path -Parent $normalized
    if ([string]::IsNullOrWhiteSpace($parent) -or
        -not (Test-Path -LiteralPath $parent -PathType Container)) {
        throw "SnapshotPath parent directory must already exist: $parent"
    }

    return $normalized
}

function Get-PackageKey {
    param([Parameter(Mandatory = $true)][object]$Package)

    return ([string]$Package.fullPath).ToLowerInvariant()
}

function Get-HandoffCandidates {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyCollection()]
        [object[]]$Changes
    )

    $groups = @(
        $Changes |
            Group-Object {
                "$($_.packageRoot)|$($_.appId)|$($_.version)"
            }
    )
    return @($groups | ForEach-Object {
        $ordered = @($_.Group | Sort-Object lastWriteTimeUtc -Descending)
        $first = $ordered[0]
        $main = @($ordered | Where-Object { $_.role -eq "main" } | Select-Object -ExpandProperty fullPath)
        $related = @($ordered | Where-Object { $_.role -ne "main" } | Select-Object -ExpandProperty fullPath)
        $confidence = if ($first.appId -and $first.version -and $main.Count -gt 0) {
            "high"
        } elseif ($first.appId -and $first.version) {
            "medium"
        } else {
            "low"
        }
        [pscustomobject][ordered]@{
            platform = "windows"
            layout = $first.rootKind
            packageRoot = $first.packageRoot
            appId = $first.appId
            version = $first.version
            mainPackage = if ($main.Count -gt 0) { $main[0] } else { $null }
            relatedPackages = $related
            confidence = $confidence
            evidence = "before-after-filesystem-metadata-diff"
            classification = "unknown-from-metadata"
            contentRead = $false
        }
    })
}

function Compare-InventoryReports {
    param(
        [Parameter(Mandatory = $true)][object]$Before,
        [Parameter(Mandatory = $true)][object]$Current
    )

    $beforeByPath = @{}
    foreach ($package in @($Before.packages)) {
        $beforeByPath[(Get-PackageKey -Package $package)] = $package
    }

    $changes = New-Object "System.Collections.Generic.List[object]"
    foreach ($package in @($Current.packages)) {
        $key = Get-PackageKey -Package $package
        $change = "new"
        if ($beforeByPath.ContainsKey($key)) {
            $old = $beforeByPath[$key]
            if ([long]$old.length -eq [long]$package.length -and
                [string]$old.lastWriteTimeUtc -eq [string]$package.lastWriteTimeUtc) {
                continue
            }
            $change = "modified"
        }
        $changes.Add([pscustomobject][ordered]@{
            change = $change
            rootKind = $package.rootKind
            packageRoot = $package.packageRoot
            appId = $package.appId
            version = $package.version
            role = $package.role
            name = $package.name
            fullPath = $package.fullPath
            length = $package.length
            lastWriteTimeUtc = $package.lastWriteTimeUtc
        })
    }

    $orderedChanges = @($changes | Sort-Object lastWriteTimeUtc -Descending)
    return [pscustomobject][ordered]@{
        schemaVersion = "2.0"
        sourceReadOnly = $true
        contentRead = $false
        mode = "Diff"
        baselineScannedAtUtc = $Before.scannedAtUtc
        scannedAtUtc = $Current.scannedAtUtc
        summary = [pscustomobject][ordered]@{
            changedPackageCount = $orderedChanges.Count
            changedAppIdCount = @(
                $orderedChanges |
                    Where-Object { $null -ne $_.appId } |
                    Select-Object -ExpandProperty appId -Unique
            ).Count
        }
        changes = $orderedChanges
        handoffCandidates = @(Get-HandoffCandidates -Changes $orderedChanges)
    }
}

function Write-JsonResult {
    param(
        [Parameter(Mandatory = $true)][object]$Value,
        [AllowNull()][string]$Path,
        [Parameter(Mandatory = $true)][object[]]$Roots
    )

    $json = $Value | ConvertTo-Json -Depth 10
    if (-not [string]::IsNullOrWhiteSpace($Path)) {
        $safePath = Assert-SnapshotPathIsSafe -Path $Path -Roots $Roots
        [System.IO.File]::WriteAllText(
            $safePath,
            $json,
            (New-Object System.Text.UTF8Encoding($false))
        )
    }
    return $json
}

switch ($Mode) {
    "Scan" {
        $report = Get-InventoryReport
        Write-JsonResult -Value $report -Path $OutputPath -Roots $report.roots
        break
    }

    "Snapshot" {
        if ([string]::IsNullOrWhiteSpace($SnapshotPath)) {
            throw "SnapshotPath is required in Snapshot mode."
        }

        $report = Get-InventoryReport -IncludeAllPackages
        $safePath = Assert-SnapshotPathIsSafe -Path $SnapshotPath -Roots $report.roots
        $json = $report | ConvertTo-Json -Depth 10
        [System.IO.File]::WriteAllText(
            $safePath,
            $json,
            (New-Object System.Text.UTF8Encoding($false))
        )
        $json
        break
    }

    "Diff" {
        if ([string]::IsNullOrWhiteSpace($SnapshotPath)) {
            throw "SnapshotPath is required in Diff mode."
        }

        $snapshot = Get-NormalizedPath -Path $SnapshotPath
        if (-not (Test-Path -LiteralPath $snapshot -PathType Leaf)) {
            throw "Snapshot file not found: $snapshot"
        }

        $before = Get-Content -LiteralPath $snapshot -Raw | ConvertFrom-Json
        if ($before.schemaVersion -notin @("1.0", "2.0")) {
            throw "Unsupported snapshot schema version: $($before.schemaVersion)"
        }

        $current = Get-InventoryReport -IncludeAllPackages
        $diff = Compare-InventoryReports -Before $before -Current $current
        Write-JsonResult -Value $diff -Path $OutputPath -Roots $current.roots
        break
    }

    "Watch" {
        $before = Get-InventoryReport -IncludeAllPackages
        $deadline = [DateTime]::UtcNow.AddSeconds($DurationSeconds)
        $latest = $null
        do {
            Start-Sleep -Milliseconds $PollMilliseconds
            $current = Get-InventoryReport -IncludeAllPackages
            $candidate = Compare-InventoryReports -Before $before -Current $current
            if ($candidate.summary.changedPackageCount -gt 0) {
                $latest = $candidate
            }
        } while ([DateTime]::UtcNow -lt $deadline)

        if ($null -eq $latest) {
            $current = Get-InventoryReport -IncludeAllPackages
            $latest = Compare-InventoryReports -Before $before -Current $current
        }
        $latest.mode = "Watch"
        $latest | Add-Member -NotePropertyName durationSeconds -NotePropertyValue $DurationSeconds
        Write-JsonResult -Value $latest -Path $OutputPath -Roots $current.roots
        break
    }
}
