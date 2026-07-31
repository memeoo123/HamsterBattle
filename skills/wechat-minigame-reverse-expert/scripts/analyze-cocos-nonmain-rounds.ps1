param(
    [Parameter(Mandatory = $true)]
    [string]$DecodedDirectory,

    [string]$OutputDirectory
)

$ErrorActionPreference = "Stop"

$decodedRoot = (Resolve-Path -LiteralPath $DecodedDirectory).Path
if (-not $OutputDirectory) {
    $OutputDirectory = Join-Path $decodedRoot "nonmain-rounds"
}
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null

function Read-Rows {
    param([string]$FileName)

    $path = Join-Path $decodedRoot $FileName
    return @((Get-Content -LiteralPath $path -Raw -Encoding UTF8 |
        ConvertFrom-Json).rows)
}

function Add-Source {
    param(
        [hashtable]$Map,
        [object]$RoundId,
        [string]$Source
    )

    $key = [string]$RoundId
    if (-not $Map.ContainsKey($key)) {
        $Map[$key] = New-Object System.Collections.Generic.List[string]
    }
    $Map[$key].Add($Source)
}

$levels = Read-Rows "trunkinstance.TrunkInstanceConfig.json"
$rounds = Read-Rows "trunkinstance.TrunkInstanceRoundConfig.json"
$dailyInstances = Read-Rows "dailyInstance.DailyInstanceConfig.json"
$abilities = Read-Rows "all-tables/baglike.BagLikeAbilityEffectiveConfig.json"
$constants = Read-Rows "all-tables/trunkinstance.TrunkInstanceConstantConfig.json"
$monsters = Read-Rows "monster.MonsterAttributeConfig.json"

$monsterMap = @{}
foreach ($monster in $monsters) {
    $monsterMap[[string]$monster.id] = $monster
}

$mainReferences = New-Object "System.Collections.Generic.HashSet[string]"
foreach ($level in $levels) {
    foreach ($roundId in @($level.roundIds)) {
        [void]$mainReferences.Add([string]$roundId)
    }
}

$sourceMap = @{}
foreach ($daily in $dailyInstances) {
    foreach ($roundId in @($daily.roundIds)) {
        Add-Source -Map $sourceMap -RoundId $roundId `
            -Source "DailyInstanceConfig:$($daily.id)/$($daily.name)"
    }
}

foreach ($ability in $abilities) {
    $parameters = @($ability.param)
    if ($parameters.Count -gt 1 -and
        [string]$parameters[0] -eq "ADD_EXTRA_MONSTER") {
        foreach ($roundId in $parameters[1..($parameters.Count - 1)]) {
            Add-Source -Map $sourceMap -RoundId $roundId `
                -Source "BagLikeAbilityEffectiveConfig:$($ability.id)/ADD_EXTRA_MONSTER"
        }
    }
}

foreach ($constant in $constants) {
    if ([string]$constant.id -ne "ENDLESS_MODE:ROUND_IDS") {
        continue
    }
    foreach ($roundId in ([string]$constant.content -split ";" |
        Where-Object { $_ -match "^\d+$" })) {
        Add-Source -Map $sourceMap -RoundId $roundId `
            -Source "TrunkInstanceConstantConfig:ENDLESS_MODE:ROUND_IDS"
    }
}

$models = New-Object System.Collections.Generic.List[object]
foreach ($round in $rounds) {
    if ($mainReferences.Contains([string]$round.id)) {
        continue
    }

    $sources = @($sourceMap[[string]$round.id])
    $category = if ($sources -match "^DailyInstanceConfig:") {
        "daily_instance"
    }
    elseif ($sources -match "^BagLikeAbilityEffectiveConfig:") {
        "extra_monster_buff"
    }
    elseif ($sources -match "^TrunkInstanceConstantConfig:ENDLESS_MODE") {
        "endless_mode"
    }
    else {
        "unknown"
    }

    $monsterCounts = New-Object System.Collections.Generic.List[object]
    foreach ($group in (@($round.monsterIds) | Group-Object | Sort-Object Name)) {
        $monster = $monsterMap[[string]$group.Name]
        $monsterCounts.Add([PSCustomObject]@{
            id = [string]$group.Name
            name = if ($monster) { [string]$monster.name } else { $null }
            count = $group.Count
        })
    }

    $models.Add([PSCustomObject]@{
        id = [int]$round.id
        category = $category
        sources = $sources
        round = [int]$round.round
        spawnCount = @($round.monsterIds).Count
        distinctMonsterCount = $monsterCounts.Count
        atkMultiple = [int]$round.atkMultiple
        hpMultiple = [int]$round.hpMultiple
        monsters = $monsterCounts.ToArray()
        rewards = @($round.rewards)
        coinRewards = @($round.coinRewards)
    })
}

$models = @($models | Sort-Object id)
$categorySummary = @(
    $models |
        Group-Object category |
        Sort-Object Name |
        ForEach-Object {
            [PSCustomObject]@{
                category = $_.Name
                rounds = $_.Count
                totalSpawns = ($_.Group | Measure-Object spawnCount -Sum).Sum
            }
        }
)
$unknownCount = @($models | Where-Object category -eq "unknown").Count

$models | ConvertTo-Json -Depth 20 |
    Set-Content -LiteralPath (Join-Path $OutputDirectory "nonmain-rounds.json") -Encoding UTF8
$models |
    Select-Object id, category, round, spawnCount, distinctMonsterCount,
        atkMultiple, hpMultiple,
        @{Name = "sources"; Expression = { $_.sources -join ";" }},
        @{Name = "monsters"; Expression = {
            ($_.monsters | ForEach-Object { "$($_.id):$($_.name)x$($_.count)" }) -join ";"
        }} |
    Export-Csv -LiteralPath (Join-Path $OutputDirectory "nonmain-round-summary.csv") `
        -NoTypeInformation -Encoding UTF8

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("# Non-main round classification")
$lines.Add("")
$lines.Add("- Non-main rounds: $($models.Count)")
$lines.Add("- Unknown/unreferenced after full-table correlation: $unknownCount")
$lines.Add("")
$lines.Add("## Categories")
$lines.Add("")
$lines.Add("| Category | Rounds | Total spawns |")
$lines.Add("|---|---:|---:|")
foreach ($summary in $categorySummary) {
    $lines.Add("| $($summary.category) | $($summary.rounds) | $($summary.totalSpawns) |")
}
$lines.Add("")
$lines.Add("## Round inventory")
$lines.Add("")
$lines.Add("| ID | Category | Wave | Spawns | Monsters | ATK | HP | Source |")
$lines.Add("|---:|---|---:|---:|---:|---:|---:|---|")
foreach ($model in $models) {
    $lines.Add(
        "| $($model.id) | $($model.category) | $($model.round) | " +
        "$($model.spawnCount) | $($model.distinctMonsterCount) | " +
        "$($model.atkMultiple) | $($model.hpMultiple) | " +
        "$($model.sources -join '<br>') |"
    )
}
$lines | Set-Content -LiteralPath `
    (Join-Path $OutputDirectory "nonmain-round-analysis.md") -Encoding UTF8

[PSCustomObject]@{
    NonMainRounds = $models.Count
    DailyInstanceRounds = @($models | Where-Object category -eq "daily_instance").Count
    ExtraMonsterBuffRounds = @($models | Where-Object category -eq "extra_monster_buff").Count
    EndlessModeRounds = @($models | Where-Object category -eq "endless_mode").Count
    UnknownRounds = $unknownCount
    ReferencedSourceIds = $sourceMap.Count
    OutputDirectory = $OutputDirectory
} | Format-List
