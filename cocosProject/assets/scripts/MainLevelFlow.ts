export const PLAYABLE_LEVEL_IDS: readonly number[] = Array.from({ length: 200 }, (_, index) => 1001 + index);
export const CANDIDATE_VALIDATION_LEVEL_IDS = [1002, 1003] as const;

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
    const validationRequested = /(?:^|[?&])(?:fusionValidation|traitValidation|developedValidation)=/.test(search);
    const candidateRequested = /(?:^|[?&])candidateBattle=1(?:&|$)/.test(search);
    if (!directRequested && !validationRequested && !candidateRequested) return null;

    const requestedMatch = /(?:^|[?&])level=(\d+)(?:&|$)/.exec(search);
    const requestedLevelId = requestedMatch ? Number(requestedMatch[1]) : fallbackLevelId;
    if (isPlayableLevelId(requestedLevelId)) return requestedLevelId;
    if (candidateRequested && isCandidateValidationLevelId(requestedLevelId)) return requestedLevelId;
    if (isPlayableLevelId(fallbackLevelId)) return fallbackLevelId;
    return PLAYABLE_LEVEL_IDS[0];
}
