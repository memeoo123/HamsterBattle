param(
    [Parameter(Mandatory = $true)]
    [string]$DecodedDirectory,

    [int[]]$ProgressLevelIds = @(1001, 1040, 1080, 1120, 1160, 1200),

    [string]$OutputDirectory
)

$ErrorActionPreference = "Stop"

$decodedRoot = (Resolve-Path -LiteralPath $DecodedDirectory).Path
if (-not $OutputDirectory) {
    $OutputDirectory = Join-Path $decodedRoot "special-mode-model"
}
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null

function Read-Rows {
    param([string]$FileName)

    return @((Get-Content -LiteralPath (Join-Path $decodedRoot $FileName) `
        -Raw -Encoding UTF8 | ConvertFrom-Json).rows)
}

function New-RowMap {
    param([object[]]$Rows)

    $map = @{}
    foreach ($row in $Rows) {
        $map[[string]$row.id] = $row
    }
    return $map
}

function Get-RoundBaseLoad {
    param(
        [object]$Round,
        [hashtable]$MonsterMap
    )

    $attack = 0.0
    $hp = 0.0
    foreach ($monsterId in @($Round.monsterIds)) {
        $monster = $MonsterMap[[string]$monsterId]
        if ($null -eq $monster) {
            throw "Missing monster reference $monsterId in round $($Round.id)"
        }
        $attack += [double]$monster.atk
        $hp += [double]$monster.hp
    }
    return [PSCustomObject]@{
        attack = $attack
        hp = $hp
        spawns = @($Round.monsterIds).Count
    }
}

function Get-ModeLoad {
    param(
        [object[]]$ModeRounds,
        [object]$ProgressLevel,
        [hashtable]$MonsterMap
    )

    $attack = 0.0
    $hp = 0.0
    $spawns = 0
    foreach ($round in $ModeRounds) {
        $base = Get-RoundBaseLoad -Round $round -MonsterMap $MonsterMap
        $attack += $base.attack *
            [double]$ProgressLevel.atkMultiple / 10000.0 *
            [double]$round.atkMultiple / 10000.0
        $hp += $base.hp *
            [double]$ProgressLevel.hpMultiple / 10000.0 *
            [double]$round.hpMultiple / 10000.0
        $spawns += $base.spawns
    }
    return [PSCustomObject]@{
        spawns = $spawns
        attackLoad = [Math]::Round($attack, 4)
        hpLoad = [Math]::Round($hp, 4)
        proxy = [Math]::Round(
            [Math]::Sqrt([Math]::Max(0, $attack) * [Math]::Max(0, $hp)),
            4
        )
    }
}

$levels = Read-Rows "trunkinstance.TrunkInstanceConfig.json"
$rounds = Read-Rows "trunkinstance.TrunkInstanceRoundConfig.json"
$daily = Read-Rows "dailyInstance.DailyInstanceConfig.json"
$abilities = Read-Rows "all-tables/baglike.BagLikeAbilityEffectiveConfig.json"
$constants = Read-Rows "all-tables/trunkinstance.TrunkInstanceConstantConfig.json"
$monsters = Read-Rows "monster.MonsterAttributeConfig.json"

$levelMap = New-RowMap $levels
$roundMap = New-RowMap $rounds
$monsterMap = New-RowMap $monsters

$progressLevels = New-Object System.Collections.Generic.List[object]
foreach ($levelId in $ProgressLevelIds) {
    $level = $levelMap[[string]$levelId]
    if ($null -eq $level) {
        throw "Unknown progress level $levelId"
    }
    $progressLevels.Add($level)
}

$dailyTemplates = @{}
foreach ($config in $daily) {
    $signature = @($config.roundIds) -join ","
    if (-not $dailyTemplates.ContainsKey($signature)) {
        $dailyTemplates[$signature] = [PSCustomObject]@{
            ids = New-Object System.Collections.Generic.List[int]
            names = New-Object System.Collections.Generic.List[string]
            roundIds = @($config.roundIds)
        }
    }
    $dailyTemplates[$signature].ids.Add([int]$config.id)
    $dailyTemplates[$signature].names.Add([string]$config.name)
}

$scenarioRows = New-Object System.Collections.Generic.List[object]
$templateIndex = 0
foreach ($template in ($dailyTemplates.Values |
    Sort-Object { $_.roundIds[0] })) {
    $templateIndex++
    $modeRounds = @($template.roundIds | ForEach-Object {
        $roundMap[[string]$_]
    })
    foreach ($level in $progressLevels) {
        $load = Get-ModeLoad -ModeRounds $modeRounds `
            -ProgressLevel $level -MonsterMap $monsterMap
        $scenarioRows.Add([PSCustomObject]@{
            mode = "daily_template_$templateIndex"
            sourceIds = @($template.ids) -join ";"
            progressLevel = [int]$level.id
            progressLevelName = [string]$level.name
            levelAttackMultiple = [int]$level.atkMultiple
            levelHpMultiple = [int]$level.hpMultiple
            roundCount = $modeRounds.Count
            spawnCount = $load.spawns
            effectiveAttackLoad = $load.attackLoad
            effectiveHpLoad = $load.hpLoad
            difficultyProxy = $load.proxy
        })
    }
}

$endlessConstant = $constants |
    Where-Object id -eq "ENDLESS_MODE:ROUND_IDS" |
    Select-Object -First 1
$endlessRoundIds = @([string]$endlessConstant.content -split ";" |
    Where-Object { $_ -match "^\d+$" })
$endlessRounds = @($endlessRoundIds | ForEach-Object {
    $roundMap[[string]$_]
})
foreach ($level in $progressLevels) {
    $load = Get-ModeLoad -ModeRounds $endlessRounds `
        -ProgressLevel $level -MonsterMap $monsterMap
    $scenarioRows.Add([PSCustomObject]@{
        mode = "endless"
        sourceIds = $endlessRoundIds -join ";"
        progressLevel = [int]$level.id
        progressLevelName = [string]$level.name
        levelAttackMultiple = [int]$level.atkMultiple
        levelHpMultiple = [int]$level.hpMultiple
        roundCount = $endlessRounds.Count
        spawnCount = $load.spawns
        effectiveAttackLoad = $load.attackLoad
        effectiveHpLoad = $load.hpLoad
        difficultyProxy = $load.proxy
    })
}

$extraRows = New-Object System.Collections.Generic.List[object]
foreach ($ability in $abilities) {
    $parameters = @($ability.param)
    if ($parameters.Count -le 1 -or
        [string]$parameters[0] -ne "ADD_EXTRA_MONSTER") {
        continue
    }
    foreach ($roundId in $parameters[1..($parameters.Count - 1)]) {
        $round = $roundMap[[string]$roundId]
        $base = Get-RoundBaseLoad -Round $round -MonsterMap $monsterMap
        $extraRows.Add([PSCustomObject]@{
            abilityId = [string]$ability.id
            roundId = [int]$round.id
            wave = [int]$round.round
            spawnCount = $base.spawns
            baseAttackLoad = $base.attack
            baseHpLoad = $base.hp
            configuredAttackMultiple = [int]$round.atkMultiple
            configuredHpMultiple = [int]$round.hpMultiple
            runtimeScaling = "host_normal_round_attrMultiple"
        })
    }
}

$scenarioRows | ConvertTo-Json -Depth 12 |
    Set-Content -LiteralPath (Join-Path $OutputDirectory "special-mode-scenarios.json") `
        -Encoding UTF8
$scenarioRows | Export-Csv -LiteralPath `
    (Join-Path $OutputDirectory "special-mode-scenarios.csv") `
    -NoTypeInformation -Encoding UTF8
$extraRows | Export-Csv -LiteralPath `
    (Join-Path $OutputDirectory "extra-monster-overhead.csv") `
    -NoTypeInformation -Encoding UTF8

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("# Special-mode scenario model")
$lines.Add("")
$lines.Add("- Progress checkpoints: $($ProgressLevelIds -join ', ')")
$lines.Add("- Daily templates: $($dailyTemplates.Count)")
$lines.Add("- Endless configured rounds: $($endlessRounds.Count)")
$lines.Add("- Extra-monster rounds: $($extraRows.Count)")
$lines.Add("")
$lines.Add("Daily and endless modes inherit the current main-progress level multipliers.")
$lines.Add("Extra-monster rounds provide schedules and monster IDs only; runtime monster")
$lines.Add('stats use the host normal round''s `attrMultiple`, not the 3000xx row multipliers.')
$lines.Add("")
$lines.Add("| Mode | Source IDs | Progress | Rounds | Spawns | Attack load | HP load | Proxy |")
$lines.Add("|---|---|---:|---:|---:|---:|---:|---:|")
foreach ($row in $scenarioRows) {
    $lines.Add(
        "| $($row.mode) | $($row.sourceIds) | $($row.progressLevel) | " +
        "$($row.roundCount) | $($row.spawnCount) | " +
        "$($row.effectiveAttackLoad) | $($row.effectiveHpLoad) | " +
        "$($row.difficultyProxy) |"
    )
}
$lines | Set-Content -LiteralPath `
    (Join-Path $OutputDirectory "special-mode-analysis.md") -Encoding UTF8

[PSCustomObject]@{
    DailyTemplates = $dailyTemplates.Count
    ScenarioRows = $scenarioRows.Count
    EndlessRounds = $endlessRounds.Count
    ExtraMonsterRounds = $extraRows.Count
    OutputDirectory = $OutputDirectory
} | Format-List

