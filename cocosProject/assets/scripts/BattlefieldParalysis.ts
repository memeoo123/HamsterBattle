export const H12_BASE_SKILL_ID = 'LY_1201';
export const H12_ONE_SECOND_SKILL_ID = 'LY_1202';
export const H12_TWO_SECOND_SKILL_ID = 'LY_1203';
export const H12_ELECTRIFIED_SKILL_ID = 'LY_1204';
export const H12_IMPACT_DELAY_SECONDS = 0.5;
export const H12_EFFECT_RATIO = 5000;
export const H12_TARGET_RADIUS = 50;
export const H12_MAX_TARGETS = 5;

export type H12SkillId =
    | typeof H12_BASE_SKILL_ID
    | typeof H12_ONE_SECOND_SKILL_ID
    | typeof H12_TWO_SECOND_SKILL_ID
    | typeof H12_ELECTRIFIED_SKILL_ID;

export type H12ReplacementTraitId =
    | 'RG_H12_abl01_eff01'
    | 'RG_H12_abl01_eff02'
    | 'RG_H12_abl04_eff01';

export type H12CastProfile = {
    skillId: H12SkillId;
    paralysisSeconds: number;
    impactDelaySeconds: number;
    effectRatio: number;
    radius: number;
    maxTargets: number;
};

export function replaceH12Skill(_currentSkillId: H12SkillId, traitId: H12ReplacementTraitId): H12SkillId {
    if (traitId === 'RG_H12_abl01_eff01') return H12_ONE_SECOND_SKILL_ID;
    if (traitId === 'RG_H12_abl01_eff02') return H12_TWO_SECOND_SKILL_ID;
    return H12_ELECTRIFIED_SKILL_ID;
}

export function resolveH12ElectrifiedResistance(rawResistance: number): number {
    // AttributeConfig.DMG_RES has min=0 in version 18, so LY_bf1204_1's
    // persistent -1000 modifier cannot make a target vulnerable.
    return Math.min(7000, Math.max(0, rawResistance - 1000));
}

export function resolveH12CastProfileForSkill(skillId: H12SkillId): H12CastProfile {
    return {
        skillId,
        paralysisSeconds: skillId === H12_TWO_SECOND_SKILL_ID ? 2 : skillId === H12_ONE_SECOND_SKILL_ID ? 1 : 0,
        impactDelaySeconds: H12_IMPACT_DELAY_SECONDS,
        effectRatio: H12_EFFECT_RATIO,
        radius: H12_TARGET_RADIUS,
        maxTargets: H12_MAX_TARGETS,
    };
}

// BagLikeAbilityEffectiveConfig replaces the base lightning-cloud skill with
// LY_1202/LY_1203. Their BuffGroupConfig rows retain the abnormal status for
// 1000/2000 ms while the shared missile behavior resolves damage after 500 ms.
export function resolveH12CastProfile(paralysisMilliseconds: number): H12CastProfile {
    const duration = paralysisMilliseconds >= 2000 ? 2 : paralysisMilliseconds >= 1000 ? 1 : 0;
    return resolveH12CastProfileForSkill(
        duration >= 2 ? H12_TWO_SECOND_SKILL_ID : duration >= 1 ? H12_ONE_SECOND_SKILL_ID : H12_BASE_SKILL_ID,
    );
}

// Abnormal type 3 is `dizziness`: BattleAttr blocks both movement and attacks.
// Reapplication keeps the longer remaining duration; control-immune units keep
// their current status unchanged.
export function applyH12Paralysis(
    currentSeconds: number,
    incomingSeconds: number,
    controlImmune = false,
): number {
    if (controlImmune || incomingSeconds <= 0) return Math.max(0, currentSeconds);
    return Math.max(0, currentSeconds, incomingSeconds);
}
