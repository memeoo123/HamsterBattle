#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const defaultLevelDataPath = path.join(projectRoot, 'cocosProject/assets/resources/data/normal-levels.json');
const defaultCapabilityPath = path.join(projectRoot, 'targets/wxf9af2417e78ce07a/18/generated/normal-level-runtime-capabilities.json');
const defaultOutputBase = path.join(projectRoot, 'targets/wxf9af2417e78ce07a/18/generated/normal-level-dependency-matrix');

function sortedUnique(values) {
    return [...new Set(values)].sort((left, right) => String(left).localeCompare(String(right), 'en'));
}

function countByLevel(levels, selectIds) {
    const counts = new Map();
    for (const level of levels) {
        for (const id of new Set(selectIds(level))) counts.set(id, (counts.get(id) || 0) + 1);
    }
    return counts;
}

function digest(value) {
    return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function dependencyRows(ids, catalog, usage, supportedIds) {
    const supported = new Set(supportedIds);
    return ids.map((id) => ({
        id,
        name: catalog[id]?.name || id,
        usedByLevelCount: usage.get(id) || 0,
        status: supported.has(id) ? 'implemented' : 'missing',
    })).sort((left, right) =>
        Number(left.status === 'implemented') - Number(right.status === 'implemented')
        || right.usedByLevelCount - left.usedByLevelCount
        || left.id.localeCompare(right.id, 'en'));
}

function backgroundId(fightscene) {
    return fightscene.split('/').pop() || fightscene;
}

export function buildDependencyMatrix(levelData, capabilities) {
    if (levelData.source !== capabilities.target) {
        throw new Error(`Target mismatch: level data is ${levelData.source}, capabilities are ${capabilities.target}`);
    }

    const implemented = capabilities.implemented;
    const supportedBackgrounds = new Set(implemented.backgroundIds);
    const supportedEnemies = new Set(implemented.enemyModelIds);
    const supportedHeroes = new Set(implemented.heroFamilyIds);
    const supportedPreparation = new Set(implemented.preparationLevelIds || []);
    const genericPreparationEnabled = implemented.genericPreparation?.enabled === true;
    const verifiedPlayable = new Set(implemented.verifiedPlayableLevelIds);
    const verifyAllRecoveredLevels = implemented.verifiedPlayableAllRecoveredLevels === true;

    const levels = levelData.levels.map((level) => {
        const missingRoundIds = level.roundIds.filter((roundId) => !levelData.rounds[String(roundId)]);
        const roundRows = level.roundIds.map((roundId) => levelData.rounds[String(roundId)]).filter(Boolean);
        const malformedRoundIds = roundRows
            .filter((round) => round.monsterTimes.length !== round.monsterIds.length)
            .map((round) => round.id);
        const monsterIds = sortedUnique(roundRows.flatMap((round) => round.monsterIds));
        const unknownMonsterIds = monsterIds.filter((id) => !levelData.monsters[id]);
        const missingEnemyModelIds = monsterIds.filter((id) => !supportedEnemies.has(id));
        const recommendedHeroIds = sortedUnique(level.recommendHeroIds || []);
        const missingRecommendedHeroIds = recommendedHeroIds.filter((id) => !supportedHeroes.has(id));
        const scene = backgroundId(level.fightscene);
        const dataComplete = missingRoundIds.length === 0 && malformedRoundIds.length === 0 && unknownMonsterIds.length === 0;
        const backgroundReady = supportedBackgrounds.has(scene);
        const enemiesReady = missingEnemyModelIds.length === 0;
        const preparationDataComplete = Object.hasOwn(level, 'staticBricks')
            && Object.hasOwn(level, 'initRewards')
            && roundRows.every((round) => Object.hasOwn(round, 'coinRewards'));
        const preparationReady = genericPreparationEnabled
            ? preparationDataComplete
            : supportedPreparation.has(level.id);
        const runtimeReady = dataComplete && backgroundReady && enemiesReady && preparationReady;
        const verified = verifyAllRecoveredLevels || verifiedPlayable.has(level.id);
        if (verified && !runtimeReady) throw new Error(`Verified level ${level.id} has incomplete runtime dependencies`);

        const blockers = [];
        if (!dataComplete) blockers.push('level-data');
        if (!preparationReady) blockers.push('preparation');
        if (!backgroundReady) blockers.push('background');
        if (!enemiesReady) blockers.push('enemy-models');

        return {
            id: level.id,
            chapter: level.chapter ?? level.id - 1000,
            name: level.name,
            roundCount: level.roundIds.length,
            scheduledSpawnCount: roundRows.reduce((sum, round) => sum + round.monsterIds.length, 0),
            backgroundId: scene,
            monsterIds,
            recommendedHeroIds,
            dependencies: {
                dataComplete,
                preparationReady,
                backgroundReady,
                enemiesReady,
                recommendationHeroesReady: missingRecommendedHeroIds.length === 0,
                preparationDataComplete,
                missingRoundIds,
                malformedRoundIds,
                unknownMonsterIds,
                missingEnemyModelIds,
                missingRecommendedHeroIds,
            },
            blockers,
            runtimeReady,
            verifiedPlayable: verified,
            status: verified ? 'verified-playable' : runtimeReady ? 'runtime-ready-unverified' : 'blocked',
        };
    });

    const usedBackgroundIds = sortedUnique(levels.map((level) => level.backgroundId));
    const usedEnemyIds = sortedUnique(levels.flatMap((level) => level.monsterIds));
    const usedHeroIds = sortedUnique(levels.flatMap((level) => level.recommendedHeroIds));
    const backgroundUsage = countByLevel(levels, (level) => [level.backgroundId]);
    const enemyUsage = countByLevel(levels, (level) => level.monsterIds);
    const heroUsage = countByLevel(levels, (level) => level.recommendedHeroIds);
    const implementedPreparationLevelIds = levels.filter((level) => level.dependencies.preparationReady).map((level) => level.id);
    const missingPreparationLevelIds = levels.filter((level) => !level.dependencies.preparationReady).map((level) => level.id);
    const statusCounts = Object.fromEntries(['verified-playable', 'runtime-ready-unverified', 'blocked'].map((status) => [
        status,
        levels.filter((level) => level.status === status).length,
    ]));

    const backgrounds = usedBackgroundIds.map((id) => ({
        id,
        usedByLevelCount: backgroundUsage.get(id) || 0,
        status: supportedBackgrounds.has(id) ? 'implemented' : 'missing',
    })).sort((left, right) =>
        Number(left.status === 'implemented') - Number(right.status === 'implemented')
        || right.usedByLevelCount - left.usedByLevelCount
        || left.id.localeCompare(right.id, 'en'));
    const enemies = dependencyRows(usedEnemyIds, levelData.monsters, enemyUsage, implemented.enemyModelIds);
    const heroes = dependencyRows(usedHeroIds, levelData.heroes, heroUsage, implemented.heroFamilyIds);

    return {
        schemaVersion: 1,
        target: levelData.source,
        sourceDigest: digest(levelData),
        capabilityDigest: digest(capabilities),
        summary: {
            totalLevels: levels.length,
            totalRounds: levelData.roundCount,
            totalScheduledSpawns: levels.reduce((sum, level) => sum + level.scheduledSpawnCount, 0),
            verifiedPlayableLevels: statusCounts['verified-playable'],
            runtimeReadyUnverifiedLevels: statusCounts['runtime-ready-unverified'],
            blockedLevels: statusCounts.blocked,
            levelsWithAllEnemyModels: levels.filter((level) => level.dependencies.enemiesReady).length,
            levelsWithBackgroundAsset: levels.filter((level) => level.dependencies.backgroundReady).length,
            levelsWithPreparationConfig: levels.filter((level) => level.dependencies.preparationReady).length,
            levelsWithSupportedRecommendations: levels.filter((level) => level.dependencies.recommendationHeroesReady).length,
            uniqueBackgrounds: backgrounds.length,
            missingBackgrounds: backgrounds.filter((item) => item.status === 'missing').length,
            uniqueEnemyModels: enemies.length,
            missingEnemyModels: enemies.filter((item) => item.status === 'missing').length,
            uniqueRecommendedHeroFamilies: heroes.length,
            missingRecommendedHeroFamilies: heroes.filter((item) => item.status === 'missing').length,
            missingPreparationLevels: missingPreparationLevelIds.length,
        },
        dependencyCatalog: {
            backgrounds,
            enemies,
            recommendedHeroFamilies: heroes,
            preparation: {
                mode: genericPreparationEnabled ? 'generic-table-driven' : 'explicit-level-list',
                implementedLevelIds: implementedPreparationLevelIds,
                missingLevelIds: missingPreparationLevelIds,
                note: genericPreparationEnabled
                    ? 'All levels consume recovered staticBricks/initRewards and per-round coinRewards through the shared runtime path.'
                    : 'Preparation is a shared runtime system, but the current loader still gates it with per-level entries. Missing IDs are an integration backlog, not independent mechanics implementations.',
            },
        },
        levels,
    };
}

function csvCell(value) {
    const text = Array.isArray(value) ? value.join(';') : String(value);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function renderCsv(matrix) {
    const header = [
        'levelId', 'chapter', 'name', 'roundCount', 'scheduledSpawnCount', 'backgroundId',
        'monsterIds', 'recommendedHeroIds', 'dataComplete', 'preparationReady', 'backgroundReady',
        'enemiesReady', 'recommendationHeroesReady', 'missingEnemyModelIds',
        'missingRecommendedHeroIds', 'blockers', 'runtimeReady', 'verifiedPlayable', 'status',
    ];
    const rows = matrix.levels.map((level) => [
        level.id, level.chapter, level.name, level.roundCount, level.scheduledSpawnCount, level.backgroundId,
        level.monsterIds, level.recommendedHeroIds, level.dependencies.dataComplete,
        level.dependencies.preparationReady, level.dependencies.backgroundReady, level.dependencies.enemiesReady,
        level.dependencies.recommendationHeroesReady, level.dependencies.missingEnemyModelIds,
        level.dependencies.missingRecommendedHeroIds, level.blockers, level.runtimeReady,
        level.verifiedPlayable, level.status,
    ].map(csvCell).join(','));
    return `${header.join(',')}\n${rows.join('\n')}\n`;
}

function renderCatalogTable(items) {
    return items.map((item) => `| ${item.id} | ${item.name || item.id} | ${item.usedByLevelCount} | ${item.status} |`).join('\n');
}

export function renderMarkdown(matrix) {
    const summary = matrix.summary;
    const missingEnemies = matrix.dependencyCatalog.enemies.filter((item) => item.status === 'missing');
    const missingHeroes = matrix.dependencyCatalog.recommendedHeroFamilies.filter((item) => item.status === 'missing');
    const backgrounds = matrix.dependencyCatalog.backgrounds;
    const rolloutSection = summary.blockedLevels === 0
        ? `## 剩余验证顺序\n\n` +
          `1. 用新 Creator Web 构建抽样 1001、1100、1200，确认早/中/晚关选择、准备和开战。\n` +
          `2. 使用有证据的账号成长输入验证后期关卡平衡和完整胜利闭环。\n` +
          `3. 视觉资源与 matched capture 继续作为独立低优先级门禁。\n\n`
        : `## 批量开放顺序\n\n` +
          `1. 按“覆盖关卡数”依次恢复下表敌人；每个敌人只实现一次，所有引用关卡自动受益。\n` +
          `2. 导入缺少的 fightscene 背景，然后由矩阵自动计算新增 runtime-ready 关卡。\n` +
          `3. 对当前 runtime-ready 但未验证的关卡按依赖族选择代表关做闭环验证，通过后批量开放同依赖集合。\n\n`;
    return `# 200 关依赖矩阵摘要\n\n` +
        `目标：\`${matrix.target}\`\n\n` +
        `## 结论\n\n` +
        `- 关卡表完整覆盖 **${summary.totalLevels} 关 / ${summary.totalRounds} 波 / ${summary.totalScheduledSpawns} 个排期刷怪项**。\n` +
        `- 当前 **${summary.verifiedPlayableLevels} 关**通过现有运行时依赖并已开放验证；其余 ${summary.blockedLevels} 关不是独立玩法工程，而是被共享依赖门禁挡住。\n` +
        `- 全量普通关只使用 **${summary.uniqueBackgrounds} 张背景**，还缺 ${summary.missingBackgrounds} 张。\n` +
        `- 全量普通关实际使用 **${summary.uniqueEnemyModels} 种敌人模型/行为**，还缺 ${summary.missingEnemyModels} 种。\n` +
        `- 推荐阵容涉及 **${summary.uniqueRecommendedHeroFamilies} 个英雄族**，还缺 ${summary.missingRecommendedHeroFamilies} 个族；推荐阵容仅为信息依赖，不单独阻止关卡运行。\n` +
        `- 准备阶段已有 **${summary.levelsWithPreparationConfig}/${summary.totalLevels} 关**接入通用表驱动；每关直接读取 staticBricks/initRewards，每波读取 coinRewards。\n\n` +
        rolloutSection +
        `## 背景依赖\n\n| ID | 名称 | 引用关卡数 | 状态 |\n|---|---|---:|---|\n` +
        `${renderCatalogTable(backgrounds)}\n\n` +
        `## 缺失敌人依赖（按覆盖收益排序）\n\n| ID | 名称 | 引用关卡数 | 状态 |\n|---|---|---:|---|\n` +
        `${renderCatalogTable(missingEnemies)}\n\n` +
        `## 缺失推荐英雄族\n\n| ID | 名称 | 引用关卡数 | 状态 |\n|---|---|---:|---|\n` +
        `${renderCatalogTable(missingHeroes)}\n\n` +
        `完整逐关字段见 \`normal-level-dependency-matrix.csv\`，机器可读结果见 \`normal-level-dependency-matrix.json\`。\n`;
}

export function generateFiles(levelDataPath = defaultLevelDataPath, capabilityPath = defaultCapabilityPath, outputBase = defaultOutputBase) {
    const levelData = JSON.parse(fs.readFileSync(levelDataPath, 'utf8'));
    const capabilities = JSON.parse(fs.readFileSync(capabilityPath, 'utf8'));
    const matrix = buildDependencyMatrix(levelData, capabilities);
    fs.mkdirSync(path.dirname(outputBase), { recursive: true });
    fs.writeFileSync(`${outputBase}.json`, `${JSON.stringify(matrix, null, 2)}\n`);
    fs.writeFileSync(`${outputBase}.csv`, renderCsv(matrix));
    fs.writeFileSync(`${outputBase}.md`, renderMarkdown(matrix));
    return matrix;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const matrix = generateFiles(process.argv[2], process.argv[3], process.argv[4]);
    process.stdout.write(`${JSON.stringify(matrix.summary, null, 2)}\n`);
}
