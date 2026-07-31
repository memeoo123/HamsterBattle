param(
    [Parameter(Mandatory = $true)]
    [string]$DecodedDirectory,

    [string]$OutputDirectory
)

$ErrorActionPreference = "Stop"

$decodedRoot = (Resolve-Path -LiteralPath $DecodedDirectory).Path
if (-not $OutputDirectory) {
    $OutputDirectory = Join-Path $decodedRoot "level-model"
}
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null

function Read-TableRows {
    param([string]$FileName)

    $path = Join-Path $decodedRoot $FileName
    $table = Get-Content -LiteralPath $path -Raw -Encoding UTF8 | ConvertFrom-Json
    return @($table.rows)
}

function New-RowMap {
    param(
        [object[]]$Rows,
        [string]$Key = "id"
    )

    $map = @{}
    foreach ($row in $Rows) {
        $map[[string]$row.$Key] = $row
    }
    return $map
}

function Add-RewardValues {
    param(
        [hashtable]$Totals,
        [object]$Rewards
    )

    foreach ($reward in @($Rewards)) {
        if ($null -eq $reward) {
            continue
        }
        $key = [string]$reward.k
        if (-not $key) {
            continue
        }
        $value = [double]$reward.v
        if (-not $Totals.ContainsKey($key)) {
            $Totals[$key] = 0.0
        }
        $Totals[$key] += $value
    }
}

$levels = Read-TableRows "trunkinstance.TrunkInstanceConfig.json"
$rounds = Read-TableRows "trunkinstance.TrunkInstanceRoundConfig.json"
$monsters = Read-TableRows "monster.MonsterAttributeConfig.json"
$heroes = Read-TableRows "hero.HeroConfig.json"
$items = Read-TableRows "item.ItemConfig.json"
$models = Read-TableRows "model.ModelConfig.json"
$skills = Read-TableRows "battle.SkillConfig.json"

$roundById = New-RowMap $rounds
$monsterById = New-RowMap $monsters
$heroById = New-RowMap $heroes
$itemById = New-RowMap $items
$modelById = New-RowMap $models
$skillById = New-RowMap $skills

$missingRoundRefs = New-Object System.Collections.Generic.HashSet[string]
$missingMonsterRefs = New-Object System.Collections.Generic.HashSet[string]
$missingHeroRefs = New-Object System.Collections.Generic.HashSet[string]
$missingItemRefs = New-Object System.Collections.Generic.HashSet[string]
$missingModelRefs = New-Object System.Collections.Generic.HashSet[string]
$missingSkillRefs = New-Object System.Collections.Generic.HashSet[string]

$levelModels = New-Object System.Collections.Generic.List[object]
$summaryRows = New-Object System.Collections.Generic.List[object]

foreach ($level in ($levels | Sort-Object id)) {
    $monsterCounts = @{}
    $levelRewards = @{}
    $roundModels = New-Object System.Collections.Generic.List[object]
    $spawnCount = 0
    $effectiveAttackLoad = 0.0
    $effectiveHpLoad = 0.0
    $maxRoundAttackMultiple = 0
    $maxRoundHpMultiple = 0

    Add-RewardValues $levelRewards $level.rewards1
    Add-RewardValues $levelRewards $level.rewards2
    Add-RewardValues $levelRewards $level.rewards3
    Add-RewardValues $levelRewards $level.initRewards

    foreach ($roundId in @($level.roundIds)) {
        $roundKey = [string]$roundId
        if (-not $roundById.ContainsKey($roundKey)) {
            [void]$missingRoundRefs.Add($roundKey)
            continue
        }

        $round = $roundById[$roundKey]
        $roundMonsterIds = @($round.monsterIds)
        $roundMonsterTimes = @($round.monsterTimes)
        $roundDistinct = @($roundMonsterIds | Sort-Object -Unique)
        $roundAttackLoad = 0.0
        $roundHpLoad = 0.0

        if ([int]$round.atkMultiple -gt $maxRoundAttackMultiple) {
            $maxRoundAttackMultiple = [int]$round.atkMultiple
        }
        if ([int]$round.hpMultiple -gt $maxRoundHpMultiple) {
            $maxRoundHpMultiple = [int]$round.hpMultiple
        }

        for ($index = 0; $index -lt $roundMonsterIds.Count; $index++) {
            $monsterId = [string]$roundMonsterIds[$index]
            $spawnCount++
            if (-not $monsterCounts.ContainsKey($monsterId)) {
                $monsterCounts[$monsterId] = 0
            }
            $monsterCounts[$monsterId]++

            if (-not $monsterById.ContainsKey($monsterId)) {
                [void]$missingMonsterRefs.Add($monsterId)
                continue
            }

            $monster = $monsterById[$monsterId]
            $attackLoad = [double]$monster.atk *
                [double]$level.atkMultiple / 10000.0 *
                [double]$round.atkMultiple / 10000.0
            $hpLoad = [double]$monster.hp *
                [double]$level.hpMultiple / 10000.0 *
                [double]$round.hpMultiple / 10000.0
            $roundAttackLoad += $attackLoad
            $roundHpLoad += $hpLoad
            $effectiveAttackLoad += $attackLoad
            $effectiveHpLoad += $hpLoad
        }

        Add-RewardValues $levelRewards $round.rewards
        Add-RewardValues $levelRewards $round.coinRewards

        $roundModels.Add([PSCustomObject]@{
            id = [int]$round.id
            round = [int]$round.round
            spawnCount = $roundMonsterIds.Count
            firstSpawnMs = if ($roundMonsterTimes.Count) {
                ($roundMonsterTimes | Measure-Object -Minimum).Minimum
            }
            else { $null }
            lastSpawnMs = if ($roundMonsterTimes.Count) {
                ($roundMonsterTimes | Measure-Object -Maximum).Maximum
            }
            else { $null }
            monsterIds = $roundMonsterIds
            distinctMonsterIds = $roundDistinct
            attackMultiple = [int]$round.atkMultiple
            hpMultiple = [int]$round.hpMultiple
            effectiveAttackLoad = [Math]::Round($roundAttackLoad, 4)
            effectiveHpLoad = [Math]::Round($roundHpLoad, 4)
            rewards = @($round.rewards)
            coinRewards = @($round.coinRewards)
        })
    }

    $monsterDetails = New-Object System.Collections.Generic.List[object]
    foreach ($monsterId in ($monsterCounts.Keys | Sort-Object)) {
        $monster = $monsterById[$monsterId]
        if ($null -eq $monster) {
            continue
        }

        $modelId = [string]$monster.modelId
        if ($modelId -and -not $modelById.ContainsKey($modelId)) {
            [void]$missingModelRefs.Add($modelId)
        }

        foreach ($skillId in @($monster.skillIds)) {
            $skillKey = [string]$skillId
            if ($skillKey -and -not $skillById.ContainsKey($skillKey)) {
                [void]$missingSkillRefs.Add($skillKey)
            }
        }

        $monsterDetails.Add([PSCustomObject]@{
            id = $monsterId
            name = [string]$monster.name
            type = [string]$monster.monsterType
            count = [int]$monsterCounts[$monsterId]
            baseAttack = [double]$monster.atk
            baseHp = [double]$monster.hp
            modelId = $modelId
            skills = @($monster.skillIds)
            description = [string]$monster.desc
        })
    }

    $recommendedHeroes = New-Object System.Collections.Generic.List[object]
    foreach ($heroId in @($level.recommendHeroIds)) {
        $heroKey = [string]$heroId
        if (-not $heroById.ContainsKey($heroKey)) {
            [void]$missingHeroRefs.Add($heroKey)
            continue
        }
        $hero = $heroById[$heroKey]
        $recommendedHeroes.Add([PSCustomObject]@{
            id = $heroKey
            name = [string]$hero.name
            baseAttack = [double]$hero.atk
            baseHp = [double]$hero.hp
        })
    }

    $rewardDetails = New-Object System.Collections.Generic.List[object]
    foreach ($itemId in ($levelRewards.Keys | Sort-Object)) {
        $itemKey = [string]$itemId
        $item = $itemById[$itemKey]
        if ($null -eq $item) {
            [void]$missingItemRefs.Add($itemKey)
        }
        $rewardDetails.Add([PSCustomObject]@{
            id = $itemKey
            name = if ($null -ne $item) { [string]$item.name } else { $null }
            quantity = $levelRewards[$itemId]
        })
    }

    $difficultyProxy = [Math]::Sqrt(
        [Math]::Max(0.0, $effectiveAttackLoad) *
        [Math]::Max(0.0, $effectiveHpLoad)
    )

    $model = [PSCustomObject]@{
        id = [int]$level.id
        chapter = [int]$level.chapter
        name = [string]$level.name
        scene = [string]$level.fightscene
        roundCount = @($level.roundIds).Count
        spawnCount = $spawnCount
        distinctMonsterCount = $monsterCounts.Count
        maxRoundAttackMultiple = $maxRoundAttackMultiple
        maxRoundHpMultiple = $maxRoundHpMultiple
        effectiveAttackLoad = [Math]::Round($effectiveAttackLoad, 4)
        effectiveHpLoad = [Math]::Round($effectiveHpLoad, 4)
        difficultyProxy = [Math]::Round($difficultyProxy, 4)
        homeHp = [int]$level.homeHp
        enemyHomeHp = [int]$level.enemyHomeHp
        enemyHomeGold = [int]$level.enemyHomeGold
        levelAttackMultiple = [int]$level.atkMultiple
        levelHpMultiple = [int]$level.hpMultiple
        goldMultiple = [int]$level.goldMultiple
        rewardRounds = @($level.rewardRounds)
        rewards = $rewardDetails.ToArray()
        recommendedHeroes = $recommendedHeroes.ToArray()
        newMonsterIds = @($level.newMonsterIds | Where-Object {
            $null -ne $_ -and [string]$_ -ne ""
        })
        monsters = $monsterDetails.ToArray()
        rounds = $roundModels.ToArray()
    }
    $levelModels.Add($model)

    $summaryRows.Add([PSCustomObject]@{
        id = $model.id
        chapter = $model.chapter
        name = $model.name
        scene = $model.scene
        roundCount = $model.roundCount
        spawnCount = $model.spawnCount
        distinctMonsterCount = $model.distinctMonsterCount
        maxRoundAttackMultiple = $model.maxRoundAttackMultiple
        maxRoundHpMultiple = $model.maxRoundHpMultiple
        effectiveAttackLoad = $model.effectiveAttackLoad
        effectiveHpLoad = $model.effectiveHpLoad
        difficultyProxy = $model.difficultyProxy
        homeHp = $model.homeHp
        enemyHomeHp = $model.enemyHomeHp
        enemyHomeGold = $model.enemyHomeGold
        recommendedHeroes = ($recommendedHeroes | ForEach-Object {
            "$($_.id):$($_.name)"
        }) -join ";"
        monsters = ($monsterDetails | ForEach-Object {
            "$($_.id):$($_.name)x$($_.count)"
        }) -join ";"
    })
}

$levelModels | ConvertTo-Json -Depth 40 |
    Set-Content -LiteralPath (Join-Path $OutputDirectory "levels.json") -Encoding UTF8
$summaryRows | Export-Csv -LiteralPath (Join-Path $OutputDirectory "level-summary.csv") `
    -NoTypeInformation -Encoding UTF8

$topDifficulty = @($summaryRows | Sort-Object difficultyProxy -Descending | Select-Object -First 20)
$topSpawns = @($summaryRows | Sort-Object spawnCount -Descending | Select-Object -First 20)

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add("# Cocos Main-Level Model")
$lines.Add("")
$lines.Add("- Levels: $($levelModels.Count)")
$lines.Add('- Difficulty proxy combines base stats, level multipliers, and round multipliers (all multipliers are treated as permyriad values).')
$lines.Add("- This proxy excludes runtime buffs, AI behavior, pathing, hero builds, and server-side modifiers.")
$lines.Add("")
$lines.Add("## Referential integrity")
$lines.Add("")
$lines.Add("- Missing rounds: $($missingRoundRefs.Count)")
$lines.Add("- Missing monsters: $($missingMonsterRefs.Count)")
$lines.Add("- Missing recommended heroes: $($missingHeroRefs.Count)")
$lines.Add("- Missing reward items: $($missingItemRefs.Count)")
$lines.Add("- Missing monster models: $($missingModelRefs.Count)")
$lines.Add("- Missing monster skills: $($missingSkillRefs.Count)")
$lines.Add("")
$lines.Add("## Top 20 by difficulty proxy")
$lines.Add("")
$lines.Add("| Rank | Level | Name | Spawns | Monsters | Attack load | HP load | Proxy |")
$lines.Add("|---:|---:|---|---:|---:|---:|---:|---:|")
$rank = 0
foreach ($row in $topDifficulty) {
    $rank++
    $lines.Add("| $rank | $($row.id) | $($row.name) | $($row.spawnCount) | " +
        "$($row.distinctMonsterCount) | $($row.effectiveAttackLoad) | " +
        "$($row.effectiveHpLoad) | $($row.difficultyProxy) |")
}
$lines.Add("")
$lines.Add("## Top 20 by spawn count")
$lines.Add("")
$lines.Add("| Rank | Level | Name | Spawns | Rounds | Monsters |")
$lines.Add("|---:|---:|---|---:|---:|---:|")
$rank = 0
foreach ($row in $topSpawns) {
    $rank++
    $lines.Add("| $rank | $($row.id) | $($row.name) | $($row.spawnCount) | " +
        "$($row.roundCount) | $($row.distinctMonsterCount) |")
}
$lines | Set-Content -LiteralPath (Join-Path $OutputDirectory "level-analysis.md") -Encoding UTF8

[PSCustomObject]@{
    Levels = $levelModels.Count
    MissingRounds = $missingRoundRefs.Count
    MissingMonsters = $missingMonsterRefs.Count
    MissingHeroes = $missingHeroRefs.Count
    MissingItems = $missingItemRefs.Count
    MissingModels = $missingModelRefs.Count
    MissingSkills = $missingSkillRefs.Count
    OutputDirectory = $OutputDirectory
} | Format-List




