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

export function exportNormalLevelRuntimeData(decodedDirectory) {
    const levels = readRows(decodedDirectory, 'trunkinstance.TrunkInstanceConfig.json').sort((a, b) => a.id - b.id);
    const rounds = readRows(decodedDirectory, 'trunkinstance.TrunkInstanceRoundConfig.json').sort((a, b) => a.id - b.id);
    const monsters = readRows(decodedDirectory, 'monster.MonsterAttributeConfig.json');
    const heroes = readRows(decodedDirectory, 'hero.HeroConfig.json');
    const mainRoundIds = new Set(levels.flatMap((level) => level.roundIds).map(String));
    const mainRounds = rounds.filter((round) => mainRoundIds.has(String(round.id)));

    return {
        version: 2,
        source: 'wxf9af2417e78ce07a/18',
        levelCount: levels.length,
        roundCount: mainRounds.length,
        levels: levels.map((level) => ({
            id: Number(level.id),
            chapter: Number(level.chapter),
            name: String(level.name),
            fightscene: String(level.fightscene),
            homeHp: Number(level.homeHp),
            enemyHomeHp: Number(level.enemyHomeHp),
            enemyHomeGold: Number(level.enemyHomeGold),
            atkMultiple: Number(level.atkMultiple),
            hpMultiple: Number(level.hpMultiple),
            goldMultiple: Number(level.goldMultiple),
            recommendHeroIds: [...(level.recommendHeroIds || [])],
            roundIds: [...level.roundIds],
            initRewards: level.initRewards === null ? null : [...(level.initRewards || [])],
            staticBuffs: level.staticBuffs === null ? null : [...(level.staticBuffs || [])],
            staticBricks: level.staticBricks === null ? null : [...(level.staticBricks || [])].map((batch) => [...batch]),
        })),
        rounds: orderedObject(mainRounds, (round) => ({
            id: Number(round.id),
            round: Number(round.round),
            monsterTimes: [...round.monsterTimes],
            monsterIds: [...round.monsterIds],
            atkMultiple: Number(round.atkMultiple),
            hpMultiple: Number(round.hpMultiple),
            coinRewards: round.coinRewards === null ? null : [...(round.coinRewards || [])],
        })),
        monsters: orderedObject(monsters, (monster) => ({
            id: String(monster.id),
            name: String(monster.name),
            monsterType: String(monster.monsterType),
            atk: Number(monster.atk),
            hp: Number(monster.hp),
            gold: Number(monster.gold),
            desc: String(monster.desc),
        })),
        heroes: orderedObject(heroes, (hero) => ({
            id: String(hero.id),
            name: String(hero.name),
            atk: Number(hero.atk),
            hp: Number(hero.hp),
        })),
    };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const [decodedDirectory, outputPath] = process.argv.slice(2);
    if (!decodedDirectory || !outputPath) {
        throw new Error('Usage: node scripts/export-normal-level-runtime-data.mjs <decoded-directory> <output-path>');
    }
    const payload = exportNormalLevelRuntimeData(path.resolve(decodedDirectory));
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(payload)}\n`);
    process.stdout.write(`${JSON.stringify({ levels: payload.levelCount, rounds: payload.roundCount, outputPath }, null, 2)}\n`);
}
