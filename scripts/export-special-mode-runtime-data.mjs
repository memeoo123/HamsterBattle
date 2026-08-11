#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function readRows(decodedDirectory, fileName) {
    return JSON.parse(fs.readFileSync(path.join(decodedDirectory, fileName), 'utf8').replace(/^\uFEFF/, '')).rows;
}

function orderedObject(rows, project) {
    return Object.fromEntries(rows.map((row) => [String(row.id), project(row)]));
}

export function exportSpecialModeRuntimeData(decodedDirectory) {
    const dailyInstances = readRows(decodedDirectory, 'dailyInstance.DailyInstanceConfig.json').sort((a, b) => a.id - b.id);
    const dailyRotation = readRows(decodedDirectory, 'dailyInstance.DailyInstanceRandomConfig.json').sort((a, b) => a.id - b.id);
    const dailyRewards = readRows(decodedDirectory, 'dailyInstance.DailyInstanceRewardConfig.json').sort((a, b) => a.id - b.id);
    const allRounds = readRows(decodedDirectory, 'trunkinstance.TrunkInstanceRoundConfig.json');
    const effects = readRows(decodedDirectory, 'baglike.BagLikeAbilityEffectiveConfig.json');
    const selectedRoundIds = new Set([
        ...dailyInstances.flatMap((instance) => instance.roundIds),
        ...Array.from({ length: 10 }, (_, index) => 300001 + index),
        400001,
    ].map(String));
    const specialRounds = allRounds.filter((round) => selectedRoundIds.has(String(round.id)));
    const selectedEffectIds = new Set(dailyRotation.flatMap((row) => row.buffIds));

    return {
        version: 1,
        source: 'wxf9af2417e78ce07a/18',
        daily: {
            challengeTimes: 3,
            initCoin: 30,
            roundGold: 500,
            instances: dailyInstances.map((row) => ({
                id: Number(row.id),
                name: String(row.name),
                fightscene: String(row.fightscene),
                roundIds: [...row.roundIds],
                initRewards: [...(row.initRewards || [])],
            })),
            rotation: dailyRotation.map((row) => ({
                id: Number(row.id),
                dailyInstanceId: Number(row.dailyInstanceId),
                buffIds: [...row.buffIds],
            })),
            rewards: dailyRewards.map((row) => ({
                id: Number(row.id),
                cost: [...(row.cost || [])],
                rewardRounds: [...row.rewardRounds],
                rewards: [row.rewards1, row.rewards2, row.rewards3, row.rewards4].map((items) => [...(items || [])]),
            })),
            effects: orderedObject(
                effects.filter((row) => selectedEffectIds.has(row.id)),
                (row) => ({ id: String(row.id), effectType: String(row.effectType), param: row.param, attr: row.attr }),
            ),
        },
        endless: {
            challengeTimes: 3,
            adTimes: [3],
            cost: [{ k: 1, v: 5 }],
            initRewards: [{ k: 5, v: 300 }],
            roundIds: [400001],
            fightscene: 'image/unpack/fightscene/fightscene_03',
            timeoutSeconds: 300,
        },
        rounds: orderedObject(specialRounds, (round) => ({
            id: Number(round.id),
            round: Number(round.round),
            monsterTimes: [...round.monsterTimes],
            monsterIds: [...round.monsterIds],
            atkMultiple: Number(round.atkMultiple),
            hpMultiple: Number(round.hpMultiple),
            rewards: round.rewards === null ? null : [...(round.rewards || [])],
            coinRewards: round.coinRewards === null ? null : [...(round.coinRewards || [])],
        })),
    };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const [decodedDirectory, outputPath] = process.argv.slice(2);
    if (!decodedDirectory || !outputPath) {
        throw new Error('Usage: node scripts/export-special-mode-runtime-data.mjs <decoded-directory> <output-path>');
    }
    const payload = exportSpecialModeRuntimeData(path.resolve(decodedDirectory));
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(payload)}\n`);
    process.stdout.write(`${JSON.stringify({ daily: payload.daily.instances.length, rewards: payload.daily.rewards.length, rounds: Object.keys(payload.rounds).length, outputPath }, null, 2)}\n`);
}
