[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$Destination,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $projectRoot 'skills'

if (-not (Test-Path -LiteralPath $sourceRoot -PathType Container)) {
    throw "Project skill directory not found: $sourceRoot"
}

if ([string]::IsNullOrWhiteSpace($Destination)) {
    $codexHome = [Environment]::GetEnvironmentVariable('CODEX_HOME')
    if ([string]::IsNullOrWhiteSpace($codexHome)) {
        $userProfile = [Environment]::GetFolderPath('UserProfile')
        $codexHome = Join-Path $userProfile '.codex'
    }
    $Destination = Join-Path $codexHome 'skills'
}

$skillFolders = Get-ChildItem -LiteralPath $sourceRoot -Directory |
    Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') } |
    Sort-Object Name

if (-not $skillFolders) {
    throw "No skill folders containing SKILL.md were found in: $sourceRoot"
}

New-Item -ItemType Directory -Path $Destination -Force | Out-Null
$backupRoot = Join-Path (Split-Path -Parent $Destination) 'skill-backups'
$installed = 0
$skipped = 0

foreach ($skill in $skillFolders) {
    $target = Join-Path $Destination $skill.Name

    if ((Test-Path -LiteralPath $target) -and -not $Force) {
        Write-Warning "$($skill.Name) already exists at $target; use -Force to replace it with the repository version."
        $skipped++
        continue
    }

    if (-not $PSCmdlet.ShouldProcess($target, "Install project skill $($skill.Name)")) {
        continue
    }

    $temporaryTarget = Join-Path $Destination ".$($skill.Name).installing-$PID"
    if (Test-Path -LiteralPath $temporaryTarget) {
        Remove-Item -LiteralPath $temporaryTarget -Recurse -Force
    }

    Copy-Item -LiteralPath $skill.FullName -Destination $temporaryTarget -Recurse -Force

    if (Test-Path -LiteralPath $target) {
        New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
        $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
        $backupTarget = Join-Path $backupRoot "$($skill.Name)-$timestamp"
        Move-Item -LiteralPath $target -Destination $backupTarget
        Write-Host "Backed up previous $($skill.Name) to $backupTarget"
    }

    Move-Item -LiteralPath $temporaryTarget -Destination $target
    Write-Host "Installed $($skill.Name) -> $target"
    $installed++
}

Write-Host "Project skills complete: installed=$installed skipped=$skipped destination=$Destination"
Write-Host 'Open a new Codex task so the installed skill catalog is refreshed.'
