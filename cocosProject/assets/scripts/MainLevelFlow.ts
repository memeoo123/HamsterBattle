export const PLAYABLE_LEVEL_IDS: readonly number[] = Array.from({ length: 200 }, (_, index) => 1001 + index);
export const CANDIDATE_VALIDATION_LEVEL_IDS = [1002, 1003] as const;
export const NORMAL_LEVEL_ENERGY_COST = 5;

export type PlayableLevelId = number;
export type CandidateValidationLevelId = (typeof CANDIDATE_VALIDATION_LEVEL_IDS)[number];
export type DirectBootLevelId = PlayableLevelId | CandidateValidationLevelId;

export type RecoveredLevelRow = {
    id: number;
    chapter?: number;
    name: string;
    fightscene: string;
    roundIds: number[];
    recommendHeroIds?: string[];
};

export type PlayableLevelCard = {
    id: PlayableLevelId;
    chapter: number;
    name: string;
    background: string;
    roundCount: number;
    recommendedHeroes: string[];
    badge: string;
};

const PLAYABLE_LEVEL_ID_SET = new Set<number>(PLAYABLE_LEVEL_IDS);
const CANDIDATE_VALIDATION_LEVEL_ID_SET = new Set<number>(CANDIDATE_VALIDATION_LEVEL_IDS);

export function isPlayableLevelId(levelId: number): levelId is PlayableLevelId {
    return PLAYABLE_LEVEL_ID_SET.has(levelId);
}

export function isCandidateValidationLevelId(levelId: number): levelId is CandidateValidationLevelId {
    return CANDIDATE_VALIDATION_LEVEL_ID_SET.has(levelId);
}

export function playableLevelCards(levels: readonly RecoveredLevelRow[]): PlayableLevelCard[] {
    const byId = new Map(levels.map((level) => [level.id, level]));
    return PLAYABLE_LEVEL_IDS.map((id) => {
        const level = byId.get(id);
        if (!level) throw new Error(`已恢复关卡 ${id} 不存在于关卡表`);
        return {
            id,
            chapter: level.chapter ?? id - 1000,
            name: level.name,
            background: level.fightscene.split('/').pop() || 'fightscene_01',
            roundCount: level.roundIds.length,
            recommendedHeroes: [...(level.recommendHeroIds || [])],
            badge: id === 1004 ? '视觉基准' : id === 1001 ? '机制基准' : '数据已接入',
        };
    });
}

export function directBootLevelId(search: string, fallbackLevelId: number): DirectBootLevelId | null {
    const directRequested = /(?:^|[?&])directBattle=1(?:&|$)/.test(search);
    const validationRequested = /(?:^|[?&])(?:fusionValidation|traitValidation|developedValidation|projectileValidation)=/.test(search);
    const candidateRequested = /(?:^|[?&])candidateBattle=1(?:&|$)/.test(search);
    if (!directRequested && !validationRequested && !candidateRequested) return null;

    const requestedMatch = /(?:^|[?&])level=(\d+)(?:&|$)/.exec(search);
    const requestedLevelId = requestedMatch ? Number(requestedMatch[1]) : fallbackLevelId;
    if (isPlayableLevelId(requestedLevelId)) return requestedLevelId;
    if (candidateRequested && isCandidateValidationLevelId(requestedLevelId)) return requestedLevelId;
    if (isPlayableLevelId(fallbackLevelId)) return fallbackLevelId;
    return PLAYABLE_LEVEL_IDS[0];
}

export function directBattleBypassesProgression(search: string): boolean {
    return /(?:^|[?&])(?:directBattle|candidateBattle|longRun)=1(?:&|$)/.test(search)
        || /(?:^|[?&])(?:fusionValidation|traitValidation|developedValidation|projectileValidation)=/.test(search);
}

export function latestMainLevelId(maxPassedLevelId: number): PlayableLevelId {
    return Math.max(1001, Math.min(1200, Math.floor(maxPassedLevelId) + 1));
}

type NormalLevelAccountProfile = {
    energy: number;
    maxPassedLevelId: number;
    [key: string]: unknown;
};

export type NormalLevelEntryResult<T extends NormalLevelAccountProfile = NormalLevelAccountProfile> = {
    profile: T;
    entered: boolean;
    reason: 'entered' | 'locked' | 'energy';
};

/** Mirrors TrunkInstanceMgr.challenge: only the next main level is enterable and each entry costs 5 energy. */
export function enterNormalLevel<T extends NormalLevelAccountProfile>(
    profile: T,
    levelId: number,
    bypassProgression = false,
): NormalLevelEntryResult<T> {
    const next = JSON.parse(JSON.stringify(profile)) as T;
    if (bypassProgression) return { profile: next, entered: true, reason: 'entered' };
    if (!isPlayableLevelId(levelId) || levelId > latestMainLevelId(profile.maxPassedLevelId)) {
        return { profile: next, entered: false, reason: 'locked' };
    }
    if (next.energy < NORMAL_LEVEL_ENERGY_COST) {
        return { profile: next, entered: false, reason: 'energy' };
    }
    next.energy -= NORMAL_LEVEL_ENERGY_COST;
    return { profile: next, entered: true, reason: 'entered' };
}
