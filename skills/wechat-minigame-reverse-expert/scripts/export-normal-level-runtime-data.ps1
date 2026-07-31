param(
    [Parameter(Mandatory = $true)]
    [string]$DecodedDirectory,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath
)

$ErrorActionPreference = "Stop"

function Read-Rows {
    param([string]$FileName)

    $path = Join-Path $DecodedDirectory $FileName
    return @((Get-Content -LiteralPath $path -Raw -Encoding UTF8 |
        ConvertFrom-Json).rows)
}

$levels = Read-Rows "trunkinstance.TrunkInstanceConfig.json"
$rounds = Read-Rows "trunkinstance.TrunkInstanceRoundConfig.json"
$monsters = Read-Rows "monster.MonsterAttributeConfig.json"
$heroes = Read-Rows "hero.HeroConfig.json"

$mainRoundIds = New-Object "System.Collections.Generic.HashSet[string]"
$levelRows = @($levels | Sort-Object id | ForEach-Object {
    foreach ($roundId in @($_.roundIds)) {
        [void]$mainRoundIds.Add([string]$roundId)
    }
    [ordered]@{
        id = [int]$_.id
        chapter = [int]$_.chapter
        name = [string]$_.name
        fightscene = [string]$_.fightscene
        homeHp = [int]$_.homeHp
        enemyHomeHp = [int]$_.enemyHomeHp
        enemyHomeGold = [int]$_.enemyHomeGold
        atkMultiple = [int]$_.atkMultiple
        hpMultiple = [int]$_.hpMultiple
        goldMultiple = [int]$_.goldMultiple
        recommendHeroIds = @($_.recommendHeroIds)
        roundIds = @($_.roundIds)
    }
})

$roundRows = [ordered]@{}
foreach ($round in ($rounds | Sort-Object id)) {
    if (-not $mainRoundIds.Contains([string]$round.id)) {
        continue
    }
    $roundRows[[string]$round.id] = [ordered]@{
        id = [int]$round.id
        round = [int]$round.round
        monsterTimes = @($round.monsterTimes)
        monsterIds = @($round.monsterIds)
        atkMultiple = [int]$round.atkMultiple
        hpMultiple = [int]$round.hpMultiple
    }
}

$monsterRows = [ordered]@{}
foreach ($monster in $monsters) {
    $monsterRows[[string]$monster.id] = [ordered]@{
        id = [string]$monster.id
        name = [string]$monster.name
        monsterType = [string]$monster.monsterType
        atk = [double]$monster.atk
        hp = [double]$monster.hp
        gold = [double]$monster.gold
        desc = [string]$monster.desc
    }
}

$heroRows = [ordered]@{}
foreach ($hero in $heroes) {
    $heroRows[[string]$hero.id] = [ordered]@{
        id = [string]$hero.id
        name = [string]$hero.name
        atk = [double]$hero.atk
        hp = [double]$hero.hp
    }
}

$payload = [ordered]@{
    version = 1
    source = "wxf9af2417e78ce07a/18"
    levelCount = $levelRows.Count
    roundCount = $roundRows.Count
    levels = $levelRows
    rounds = $roundRows
    monsters = $monsterRows
    heroes = $heroRows
}

$parent = Split-Path -Parent $OutputPath
New-Item -ItemType Directory -Path $parent -Force | Out-Null
$payload | ConvertTo-Json -Depth 20 -Compress |
    Set-Content -LiteralPath $OutputPath -Encoding UTF8

$hash = Get-FileHash -LiteralPath $OutputPath -Algorithm SHA256
[PSCustomObject]@{
    Levels = $levelRows.Count
    Rounds = $roundRows.Count
    Monsters = $monsterRows.Count
    Heroes = $heroRows.Count
    Bytes = (Get-Item -LiteralPath $OutputPath).Length
    SHA256 = $hash.Hash
    OutputPath = $OutputPath
} | Format-List
