param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,

    [string]$OutputDirectory,

    [switch]$ExportAll
)

$ErrorActionPreference = "Stop"

$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
if (-not $OutputDirectory) {
    $OutputDirectory = Join-Path (Split-Path -Parent $resolvedInput) "decoded"
}

New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
Add-Type -AssemblyName System.IO.Compression

# Numeric field-name tokens index into localdata/str.json.
$script:stringTable = @()

function Resolve-FieldName {
    param(
        [object]$Token,
        [int]$ColumnIndex
    )

    if ($Token -is [string]) {
        return $Token
    }

    $numericToken = [int]$Token
    if ($numericToken -ge 0 -and $numericToken -lt $script:stringTable.Count) {
        return [string]$script:stringTable[$numericToken]
    }

    return "field_$numericToken"
}

function Convert-CellValue {
    param(
        [AllowNull()]
        [object]$Value,
        [int]$TypeCode
    )

    if ($null -eq $Value) {
        return $null
    }

    $resolved = $Value
    if (($TypeCode -eq 3 -or $TypeCode -eq 4) -and $Value -isnot [string]) {
        $token = [int]$Value
        if ($token -ge 0 -and $token -lt $script:stringTable.Count) {
            $resolved = $script:stringTable[$token]
        }
    }

    if ($TypeCode -eq 4 -and $resolved -is [string] -and $resolved -match '^\s*[\[\{]') {
        try {
            $parsed = $resolved | ConvertFrom-Json
            if ($parsed -is [System.Array]) {
                return [PSCustomObject]@{ __decodedArray = @($parsed) }
            }
            return $parsed
        }
        catch {
            return $resolved
        }
    }

    if ($TypeCode -eq 5) {
        return ([int]$resolved -ne 0)
    }

    return $resolved
}

function Convert-CompactTable {
    param(
        [object[]]$Values,
        [string]$TableName
    )

    if ($Values.Count -eq 0) {
        return [PSCustomObject]@{
            table = $TableName
            columnCount = 0
            rowCount = 0
            schema = @()
            rows = @()
            validLength = $true
        }
    }

    if ($Values.Count -eq 1 -and $Values[0] -is [System.Array]) {
        $Values = @($Values[0])
    }

    if ($Values.Count -eq 0) {
        return [PSCustomObject]@{
            table = $TableName
            columnCount = 0
            rowCount = 0
            schema = @()
            rows = @()
            sourceLength = 0
            expectedLength = 0
            validLength = $true
        }
    }

    $columnCount = [int]$Values[0]
    $schema = @()
    for ($column = 0; $column -lt $columnCount; $column++) {
        $typeCode = [int]$Values[1 + (2 * $column)]
        $fieldToken = $Values[2 + (2 * $column)]
        $schema += [PSCustomObject]@{
            index = $column
            name = Resolve-FieldName -Token $fieldToken -ColumnIndex $column
            token = $fieldToken
            typeCode = $typeCode
        }
    }

    $rowCountIndex = 1 + (2 * $columnCount)
    $rowCount = [int]$Values[$rowCountIndex]
    $dataStart = $rowCountIndex + 1
    $expectedLength = $dataStart + ($columnCount * $rowCount)
    $rows = New-Object System.Collections.Generic.List[object]

    for ($row = 0; $row -lt $rowCount; $row++) {
        $record = [ordered]@{}
        foreach ($field in $schema) {
            $valueIndex = $dataStart + ($field.index * $rowCount) + $row
            $decodedValue = Convert-CellValue -Value $Values[$valueIndex] -TypeCode $field.typeCode
            if ($decodedValue -is [PSCustomObject] -and $decodedValue.PSObject.Properties["__decodedArray"]) {
                $record[$field.name] = @($decodedValue.__decodedArray)
            }
            else {
                $record[$field.name] = $decodedValue
            }
        }
        $rows.Add([PSCustomObject]$record)
    }

    return [PSCustomObject]@{
        table = $TableName
        columnCount = $columnCount
        rowCount = $rowCount
        schema = $schema
        rows = $rows
        sourceLength = $Values.Count
        expectedLength = $expectedLength
        validLength = ($Values.Count -eq $expectedLength)
    }
}

$selectedTables = @(
    "baglike.BagLikeLevelConfig",
    "battle.BattleConfig",
    "condition.ConditionConfig",
    "dailyInstance.DailyInstanceConfig",
    "hero.HeroConfig",
    "item.ItemConfig",
    "model.ModelConfig",
    "monster.MonsterAttributeConfig",
    "reward.RewardDropConfig",
    "battle.SkillConfig",
    "trunkinstance.TrunkInstanceClickConfig",
    "trunkinstance.TrunkInstanceConfig",
    "trunkinstance.TrunkInstanceDefeatConfig",
    "trunkinstance.TrunkInstanceRoundConfig"
)

$stream = [IO.File]::OpenRead($resolvedInput)
$archive = New-Object IO.Compression.ZipArchive(
    $stream,
    [IO.Compression.ZipArchiveMode]::Read,
    $false
)

try {
    $stringEntry = $archive.GetEntry("localdata/str.json")
    if (-not $stringEntry) {
        throw "Missing required localdata/str.json string table"
    }
    $stringReader = New-Object IO.StreamReader($stringEntry.Open(), [Text.Encoding]::UTF8)
    try {
        $script:stringTable = $stringReader.ReadToEnd() | ConvertFrom-Json
    }
    finally {
        $stringReader.Dispose()
    }
    $script:stringTable | ConvertTo-Json -Depth 8 |
        Set-Content -LiteralPath (Join-Path $OutputDirectory "string-table.json") -Encoding UTF8

    $inventory = New-Object System.Collections.Generic.List[object]

    foreach ($entry in ($archive.Entries | Sort-Object FullName)) {
        if ($entry.FullName -eq "localdata/str.json") {
            continue
        }
        $reader = New-Object IO.StreamReader($entry.Open(), [Text.Encoding]::UTF8)
        try {
            $text = $reader.ReadToEnd()
        }
        finally {
            $reader.Dispose()
        }

        $tableName = $entry.FullName -replace "^localdata/", ""
        $values = @($text | ConvertFrom-Json)
        $decoded = Convert-CompactTable -Values $values -TableName $tableName

        $schemaText = ($decoded.schema | ForEach-Object {
            "$($_.name):t$($_.typeCode)"
        }) -join ", "

        $inventory.Add([PSCustomObject]@{
            table = $tableName
            rows = $decoded.rowCount
            columns = $decoded.columnCount
            compressedBytes = $entry.CompressedLength
            uncompressedBytes = $entry.Length
            validLength = $decoded.validLength
            schema = $schemaText
        })

        if ($ExportAll -or $selectedTables -contains $tableName) {
            $safeName = $tableName -replace "[^A-Za-z0-9_.-]", "_"
            $outputPath = Join-Path $OutputDirectory "$safeName.json"
            $decoded | ConvertTo-Json -Depth 30 |
                Set-Content -LiteralPath $outputPath -Encoding UTF8
        }
    }

    $inventory |
        ConvertTo-Json -Depth 8 |
        Set-Content -LiteralPath (Join-Path $OutputDirectory "table-inventory.json") -Encoding UTF8

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("# Cocos LocalData Inventory")
    $lines.Add("")
    $lines.Add(('- Source: `{0}`' -f $resolvedInput))
    $lines.Add("- ZIP entries: $($inventory.Count)")
    $lines.Add('- Compact format: column count, `(type, field-token)` pairs, row count, then column-major values')
    $lines.Add(('- Field names resolved through `localdata/str.json` ({0} strings)' -f $script:stringTable.Count))
    $lines.Add("")
    $lines.Add("| Table | Rows | Columns | Compressed | Uncompressed | Length check | Schema |")
    $lines.Add("|---|---:|---:|---:|---:|---|---|")
    foreach ($item in $inventory) {
        $escapedSchema = $item.schema -replace "\|", "\|"
        $lines.Add(
            "| ``$($item.table)`` | $($item.rows) | $($item.columns) | " +
            "$($item.compressedBytes) | $($item.uncompressedBytes) | " +
            "$($item.validLength) | $escapedSchema |"
        )
    }
    $lines | Set-Content -LiteralPath (Join-Path $OutputDirectory "table-inventory.md") -Encoding UTF8

    $inventory |
        Sort-Object rows -Descending |
        Select-Object -First 20 table, rows, columns, uncompressedBytes, validLength |
        Format-Table -AutoSize
}
finally {
    $archive.Dispose()
    $stream.Dispose()
}











