export type BattlefieldLayoutPhase = 'deploy' | 'battle' | 'trait' | 'roundClear' | 'won' | 'lost';

export type BattlefieldLayoutState = {
    battleY: number;
    battleHeight: number;
    gridOffsetY: number;
    showBackpack: boolean;
    showPreparationControls: boolean;
};

export const DEPLOY_BATTLE_Y = 110;
export const DEPLOY_BATTLE_HEIGHT = 300;
// The original 808x1522 capture contains an 82px WeChat chrome strip. After
// cropping and scaling its 808x1440 game area to the 750x1334 design canvas,
// the backpack begins at y=300 and the power core center lands at y=616.
// The base preparation geometry already produces those anchors at offset 0.
export const DEPLOY_GRID_OFFSET_Y = 0;
export const DEPLOY_CANDIDATE_Y = -385;
export const ACTIVE_BATTLE_Y = 165;
export const ACTIVE_BATTLE_HEIGHT = 500;
export const ACTIVE_GRID_OFFSET_Y = -425;

export function battlefieldLayoutForPhase(phase: BattlefieldLayoutPhase): BattlefieldLayoutState {
    const fighting = phase === 'battle' || phase === 'trait' || phase === 'roundClear';
    return {
        battleY: fighting ? ACTIVE_BATTLE_Y : DEPLOY_BATTLE_Y,
        battleHeight: fighting ? ACTIVE_BATTLE_HEIGHT : DEPLOY_BATTLE_HEIGHT,
        gridOffsetY: fighting ? ACTIVE_GRID_OFFSET_Y : DEPLOY_GRID_OFFSET_Y,
        showBackpack: phase !== 'won' && phase !== 'lost',
        showPreparationControls: phase === 'deploy',
    };
}
