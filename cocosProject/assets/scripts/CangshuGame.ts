import {
    _decorator,
    AudioClip,
    AudioSource,
    Button,
    Color,
    Component,
    EventTouch,
    Graphics,
    HorizontalTextAlignment,
    JsonAsset,
    Label,
    Node,
    profiler,
    ResolutionPolicy,
    Rect,
    RichText,
    resources,
    Size,
    Sprite,
    SpriteFrame,
    sys,
    TTFFont,
    UITransform,
    Vec2,
    Vec3,
    VerticalTextAlignment,
    view,
    sp,
} from 'cc';
import {
    advanceH02BarrageCast,
    advanceH03LaserCast,
    advanceH03Transform,
    advanceH04ShieldWall,
    applyH03TransformHit,
    attackBehaviorDelaySeconds,
    attackKillFlyRollSucceeds,
    attackIntervalSeconds,
    ATTACK_KILL_FLY_DAMAGE,
    BATTLEFIELD_HOME_X,
    battlefieldDistance,
    CombatAttributes,
    DamageResult,
    defeatCompensation,
    EMPTY_COMBAT_ATTRIBUTES,
    heroSeparationVector,
    H04_SHIELD_WALL_INTERVAL_SECONDS,
    h04ShieldWallCounterattackDamage,
    H13_BASE_SKILL_ID,
    H13ReplacementTraitId,
    H13SkillId,
    HeroAttackType,
    createBattleSeedRandom,
    randomBattleRoll,
    resolveAttackAtImpact,
    resolveBounceAttack,
    resolveBounceMaxTimes,
    resolveH13BounceProfileForSkill,
    resolveTargetingIntent,
    resolveBattleDamageWithRandom,
    replaceH13Skill,
    selectH03LaserTargets,
    selectBounceBattlefieldTarget,
    selectNearestBattlefieldTarget,
    selectSplitShotTarget,
    splitShotRollSucceeds,
    SPLIT_SHOT_EFFECT_RATIO,
    SPLIT_SHOT_PROJECTILE_SPEED,
} from './BattlefieldKernel';
import {
    advancePowerCoreClock,
    applyWorkerPower,
    BATTLE_SPEED_UP_MULTIPLE,
    connectedGearUidsAtCoreSide,
    HAMSTER_SPAWN_FLIGHT_SECONDS,
    isGearDirectlyAdjacentToCore,
    POWER_QUARTER_LAP_SECONDS,
    powerContactsByGear,
    productionRatePerSecond,
    resolveProducerAttributeScales,
    resolveWorkerPowerPerTrigger,
    WORKER_COMPLETE_ANIMATION_SECONDS,
} from './BattlefieldProduction';
import {
    advancePeriodicAttackHeal,
    H04_PERIODIC_HEAL_INTERVAL_SECONDS,
    H11_BASE_ATTACK,
    H11_BASE_SKILL_ID,
    H11_GEAR_SHAPE,
    H11_POWER_PER_TRIGGER,
    H11_TARGET_RADIUS,
    H11_UNIT_HEAL_RATIO,
    H11ReplacementTraitId,
    H11SkillId,
    applyShieldedDamage,
    replaceH11Skill,
    resolveH11HealingProfileForSkill,
    resolveH11Healing,
} from './BattlefieldHealing';
import {
    applyH12Paralysis,
    H12_BASE_SKILL_ID,
    H12_EFFECT_RATIO,
    H12_IMPACT_DELAY_SECONDS,
    H12_MAX_TARGETS,
    H12_TARGET_RADIUS,
    H12ReplacementTraitId,
    H12SkillId,
    replaceH12Skill,
    resolveH12CastProfileForSkill,
} from './BattlefieldParalysis';
import {
    battlefieldLayoutForPhase,
    DEPLOY_CANDIDATE_Y,
    DEPLOY_BATTLE_HEIGHT,
    DEPLOY_BATTLE_Y,
} from './BattlefieldLayout';
import {
    addBagLikeExp,
    bagLikeHomeHpPercent,
    BagLikeGearUpgradeItem,
    chooseBagLikeGearUpgrade,
    completeWarriorComboAttack,
    completeWarriorKillAttackStack,
    drawWeightedTraits,
    expTargetForLevel,
    IMPLEMENTED_TRAIT_POOL,
    isRecommendedTrait,
    resolveHomeHeal,
    traitEffectAmount,
    traitExpMultiplier,
    traitMonsterAttackMultiplier,
    traitPowerNearAttackMultiplier,
    traitPowerNearWorkerMultiplier,
    traitPrepareRewardWeightModifiers,
    traitRoundStartHomeHealBasisPoints,
    traitH02BarrageProfile,
    traitH03LaserProfile,
    traitH03TransformProfile,
    traitH04ShieldWallProfile,
    traitWarriorComboProfile,
    traitWarriorKillAttackProfile,
    TraitDefinition,
    TraitEffectKind,
    TraitId,
    H02BarrageProfile,
    H03LaserProfile,
    H03TransformProfile,
    H04ShieldWallProfile,
    WarriorComboProfile,
    warriorKillAttackMultiplier,
    TRAIT_REROLL_MAX,
    TRAIT_REROLL_MIN_QUALITY,
    TRAIT_TAKE_ALL_MAX,
} from './BagLikeProgression';
import {
    bagLikeGearBodyColor,
    candidateRewardModifiersForRefresh,
    candidateTrayLayout,
    CandidateGearId,
    CandidateRefreshType,
    candidateDrawIds,
    drawDynamicCandidateBatch,
    displacedPlacementUids,
    placementAreaValid,
    placementCells,
    shouldUseStaticCandidateBatch,
} from './BagLikeCandidateDrops';
import {
    bagLikeAccountHeroFragments,
    bagLikeHeroBaseAttributeAtStar,
    BagLikeAccountHeroFamily,
    BagLikeAccountProfile,
    BagLikeLevelAccountReward,
    BAGLIKE_ACCOUNT_HERO_FAMILIES,
    bagLikeAccountChallengeTimes,
    bagLikeAccountUnlockedHeroFamilies,
    bagLikeHeroUnlockLevel,
    bagLikeHeroUpgradeCost,
    claimBagLikeLevelRoundAccountReward,
    cloneBagLikeAccountProfile,
    completeBagLikeAccountLevel,
    createBagLikeAccountProfile,
    incrementBagLikeAccountChallengeTimes,
    loadBagLikeAccountProfile,
    saveBagLikeAccountProfile,
    setAllBagLikeAccountHeroStars,
    setBagLikeAccountChallengeTimes,
    tryUpgradeBagLikeAccountHero,
} from './BagLikeAccountProfile';
import {
    BAGLIKE_LAST_LEVEL_ID,
    bagLikeLatestUnlockedLevel,
    bagLikeLevelFromSearch,
    bagLikeLevelIdsForPage,
    bagLikeLevelNumber,
    bagLikeLevelPageCount,
    bagLikeLevelPageForId,
    bagLikeLevelPassed,
    bagLikeLevelUnlocked,
} from './BagLikeLevelSelection';
import {
    bagLikeProducerProfile,
    bagLikeWheelHomeHpContribution,
    BagLikePrimarySkillId,
    BagLikeProducerProfile,
} from './BagLikeUnitProgression';
import { bagLikeFusionRecipe, bagLikeFusionRequirementsMet } from './BagLikeFusion';
import {
    VISUAL_ENEMY_ROSTER,
    VISUAL_GEAR_ROSTER,
    VISUAL_GEAR_SHAPES,
    VisualEnemyEntry,
    VisualGearEntry,
} from './VisualRoster';

const { ccclass, property } = _decorator;

type Team = 'self' | 'enemy';
type Phase = 'deploy' | 'battle' | 'trait' | 'roundClear' | 'won' | 'lost';
type ModelId =
    | 'H0101'
    | 'H0201'
    | 'H0301'
    | 'H0401'
    | 'H1101'
    | 'H1201'
    | 'H1301'
    | 'H07'
    | 'H08'
    | 'H09'
    | 'M02'
    | 'M03'
    | 'M07'
    | 'Boss02'
    | 'Boss03'
    | 'Boss07';
type GearId = CandidateGearId
    | 'P01'
    | 'H0104'
    | 'H0204'
    | 'H0304'
    | 'H0404'
    | 'H1104'
    | 'H1204'
    | 'H1304'
    | 'H0705'
    | 'H0805'
    | 'H0905'
    | 'C04';
type GearLocation = 'grid' | 'candidate';

type HeadFrame = {
    x: number;
    y: number;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
};

const HERO_SMALL_HEAD_FRAMES: Record<string, HeadFrame> = {
    H0101: { x: 169, y: 799, width: 80, height: 74, offsetX: 2, offsetY: -3 },
    H0102: { x: 93, y: 1193, width: 80, height: 74, offsetX: 2, offsetY: -3 },
    H0103: { x: 93, y: 1037, width: 80, height: 76, offsetX: 2, offsetY: -3 },
    H0104: { x: 1, y: 1367, width: 82, height: 80, offsetX: 1, offsetY: 0 },
    H0201: { x: 1, y: 1123, width: 90, height: 76, offsetX: 0, offsetY: 0 },
    H0202: { x: 85, y: 489, width: 84, height: 76, offsetX: 1, offsetY: 0 },
    H0203: { x: 1, y: 1449, width: 82, height: 80, offsetX: 0, offsetY: -1 },
    H0204: { x: 93, y: 1115, width: 80, height: 76, offsetX: -1, offsetY: -3 },
    H0301: { x: 1, y: 1531, width: 82, height: 80, offsetX: 1, offsetY: 0 },
    H0302: { x: 1, y: 177, width: 82, height: 90, offsetX: 1, offsetY: 0 },
    H0303: { x: 1, y: 359, width: 80, height: 88, offsetX: 1, offsetY: 0 },
    H0304: { x: 85, y: 567, width: 82, height: 78, offsetX: 2, offsetY: -1 },
    H0401: { x: 83, y: 329, width: 84, height: 78, offsetX: 1, offsetY: 2 },
    H0402: { x: 85, y: 177, width: 90, height: 82, offsetX: 0, offsetY: 0 },
    H0403: { x: 1, y: 89, width: 90, height: 86, offsetX: 0, offsetY: 0 },
    H0404: { x: 93, y: 1, width: 86, height: 88, offsetX: 0, offsetY: -1 },
    H0501: { x: 85, y: 1419, width: 78, height: 74, offsetX: -1, offsetY: 1 },
    H0502: { x: 175, y: 1113, width: 76, height: 72, offsetX: -1, offsetY: 2 },
    H0503: { x: 175, y: 1187, width: 76, height: 72, offsetX: -1, offsetY: 2 },
    H0504: { x: 165, y: 1421, width: 72, height: 76, offsetX: -1, offsetY: 0 },
    H0601: { x: 1, y: 1613, width: 82, height: 80, offsetX: 0, offsetY: 0 },
    H0602: { x: 1, y: 1283, width: 82, height: 82, offsetX: 0, offsetY: 0 },
    H0603: { x: 1, y: 537, width: 82, height: 86, offsetX: 0, offsetY: 2 },
    H0604: { x: 169, y: 653, width: 82, height: 72, offsetX: -1, offsetY: -1 },
    H1201: { x: 85, y: 725, width: 78, height: 56, offsetX: -1, offsetY: 0 },
    H1301: { x: 183, y: 81, width: 68, height: 68, offsetX: 0, offsetY: 0 },
    H0705: { x: 165, y: 1499, width: 78, height: 70, offsetX: 0, offsetY: 1 },
    H0805: { x: 175, y: 957, width: 76, height: 76, offsetX: 1, offsetY: 1 },
    H0905: { x: 169, y: 727, width: 82, height: 70, offsetX: 1, offsetY: 1 },
    H1005: { x: 171, y: 491, width: 80, height: 80, offsetX: -2, offsetY: 1 },
    H1101: { x: 165, y: 1571, width: 72, height: 70, offsetX: 0, offsetY: 1 },
    H1401: { x: 85, y: 261, width: 86, height: 66, offsetX: -2, offsetY: -3 },
    H1505: { x: 85, y: 647, width: 82, height: 76, offsetX: 0, offsetY: 0 },
    H1601: { x: 85, y: 1495, width: 78, height: 74, offsetX: 0, offsetY: 0 },
    H1602: { x: 85, y: 1571, width: 78, height: 74, offsetX: 0, offsetY: 0 },
    H1603: { x: 173, y: 1269, width: 78, height: 74, offsetX: 0, offsetY: 0 },
    H1604: { x: 85, y: 1341, width: 80, height: 76, offsetX: 0, offsetY: 0 },
    H1701: { x: 93, y: 867, width: 62, height: 88, offsetX: 0, offsetY: 0 },
    H1805: { x: 93, y: 957, width: 80, height: 78, offsetX: 0, offsetY: 0 },
    P01: { x: 167, y: 1345, width: 78, height: 74, offsetX: 0, offsetY: 0 },
    coin: { x: 177, y: 259, width: 70, height: 68, offsetX: 0, offsetY: 0 },
};

// Exact FairyGUI atlas rectangles recovered from bagLike.a597d.bin. The five
// 110x110 sprites are ui://bagLike/cl1..cl5 in merge-level order.
const GEAR_BODY_FRAMES: Readonly<Record<number, Rect>> = {
    1: new Rect(1024, 0, 110, 110),
    2: new Rect(775, 117, 110, 110),
    3: new Rect(887, 117, 110, 110),
    4: new Rect(439, 262, 110, 110),
    5: new Rect(551, 262, 110, 110),
};

type BagLikeAtlasFrame = {
    rect: Rect;
    sourceSize: Size;
    offset?: readonly [x: number, y: number];
    insets?: readonly [left: number, top: number, right: number, bottom: number];
};

// Exact image records and 9-slice borders decoded from bagLike.a597d.bin.
const BAGLIKE_ATLAS_FRAMES: Readonly<Record<string, BagLikeAtlasFrame>> = {
    gridOpen: {
        rect: new Rect(1049, 376, 58, 58),
        sourceSize: new Size(58, 58),
        insets: [20, 20, 20, 20],
    },
    operationBackground: {
        rect: new Rect(1109, 376, 51, 76),
        sourceSize: new Size(51, 76),
        insets: [12, 19, 15, 19],
    },
    backpackPanel: {
        rect: new Rect(908, 1, 114, 114),
        sourceSize: new Size(114, 114),
        insets: [44, 38, 39, 43],
    },
    connectorTwo: {
        rect: new Rect(409, 451, 158, 60),
        sourceSize: new Size(158, 60),
    },
    connectorL: {
        rect: new Rect(461, 102, 158, 158),
        sourceSize: new Size(158, 158),
    },
    connectorThree: {
        rect: new Rect(999, 117, 60, 257),
        sourceSize: new Size(60, 257),
    },
    connectorSquare: {
        rect: new Rect(621, 102, 152, 152),
        sourceSize: new Size(152, 152),
    },
};

const COMM_ATLAS_FRAMES: Readonly<Record<string, BagLikeAtlasFrame>> = {
    pause: {
        rect: new Rect(1339, 309, 72, 72),
        sourceSize: new Size(72, 72),
    },
    blueButton: {
        rect: new Rect(438, 270, 138, 128),
        sourceSize: new Size(138, 128),
        insets: [69, 40, 51, 70],
    },
    purpleButton: {
        rect: new Rect(803, 305, 120, 128),
        sourceSize: new Size(120, 128),
        insets: [56, 43, 38, 42],
    },
    traitTitleRibbon: {
        rect: new Rect(416, 1, 524, 83),
        sourceSize: new Size(524, 83),
    },
    videoIcon: {
        rect: new Rect(1336, 445, 44, 45),
        sourceSize: new Size(50, 50),
        offset: [3, 3],
    },
    greenButton: {
        rect: new Rect(807, 175, 120, 128),
        sourceSize: new Size(120, 128),
        insets: [56, 43, 38, 42],
    },
    yellowButton: {
        rect: new Rect(956, 72, 120, 128),
        sourceSize: new Size(120, 128),
        insets: [63, 41, 40, 77],
    },
    battleStats: {
        // comm/ongji_icon.png (the leading "t" is absent in the packed name).
        rect: new Rect(1203, 372, 60, 65),
        sourceSize: new Size(80, 80),
    },
    handbook: {
        rect: new Rect(1186, 297, 77, 73),
        sourceSize: new Size(80, 80),
    },
    headerCounter: {
        rect: new Rect(170, 452, 40, 40),
        sourceSize: new Size(40, 40),
        insets: [10, 10, 10, 10],
    },
};

// Normalized from the original 820x1542 gameplay crop to the 750x1334
// reconstruction canvas. Keep this geometry centralized so a fresh visual
// capture can be compared without hunting through modal construction code.
const TRAIT_VISUAL_LAYOUT = {
    titleY: 420,
    cardsY: 85,
    cardStepX: 212,
    cardWidth: 174,
    cardHeight: 470,
    iconY: 158,
    descriptionY: -83,
    descriptionWidth: 150,
    descriptionHeight: 240,
    actionY: -360,
    actionHintY: -430,
} as const;

// Exact SpriteFrame records decoded from the authorized resources3 effect atlas.
// Unmapped traits intentionally retain the text fallback until their original
// image keys have the same evidence chain.
const TRAIT_ICON_FRAMES: Readonly<Record<string, BagLikeAtlasFrame>> = {
    RG_ALL_abl13_eff01: {
        rect: new Rect(315, 301, 76, 82),
        sourceSize: new Size(100, 100),
        offset: [-1, 0],
    },
    RG_H02_abl02_eff01: {
        rect: new Rect(467, 71, 92, 72),
        sourceSize: new Size(100, 100),
        offset: [2, -2],
    },
    RG_H03_abl02_eff01: {
        rect: new Rect(315, 71, 76, 72),
        sourceSize: new Size(100, 100),
        offset: [-1, 1],
    },
};

function wrapTraitDescription(text: string, maxUnits = 7.5): string {
    const lines: string[] = [];
    let line = '';
    let units = 0;
    for (const character of Array.from(text)) {
        const characterUnits = /[A-Za-z0-9%]/.test(character) ? 0.55 : 1;
        if (line && units + characterUnits > maxUnits) {
            lines.push(line);
            line = '';
            units = 0;
        }
        line += character;
        units += characterUnits;
    }
    if (line) lines.push(line);
    return lines.join('\n');
}

function traitDescriptionMarkup(text: string): string {
    return wrapTraitDescription(text).replace(
        /(仓鼠(?:射手|法师|战士|牧师|刺客|矿工)|\d+(?:\.\d+)?%)/g,
        '<color=#6dff70>$1</color>',
    );
}

// ItemConfig rows 5 (COIN) and 4 (AD_TICKET) point to these exact
// resources3 SpriteFrames in the recovered image/item atlas.
const ITEM_ATLAS_FRAMES: Readonly<Record<string, BagLikeAtlasFrame>> = {
    coin: {
        rect: new Rect(257, 233, 96, 94),
        sourceSize: new Size(132, 132),
        offset: [0, 1],
    },
    adTicket: {
        rect: new Rect(147, 233, 108, 88),
        sourceSize: new Size(132, 132),
        offset: [0, 0],
    },
};

type Attributes = CombatAttributes;

type UnitConfig = {
    id: ModelId;
    name: string;
    atk: number;
    hp: number;
    range: number;
    searchRange: number;
    moveSpeed: number;
    attackInterval: number;
    attackType: HeroAttackType;
    effectRatio: number;
    attackDelay: number;
    projectileSpeed?: number;
    bounceTimes?: number;
    bounceRange?: number;
    areaRadius?: number;
    maxTargets?: number;
    randomTarget?: boolean;
    controlImmune?: boolean;
    spinePath: string;
    spineScale: number;
    color: Color;
    attrs?: Partial<Attributes>;
    boss?: boolean;
    gold?: number;
    exp?: number;
    productionGearId?: string;
    productionLevel?: number;
    productionSkillId?: BagLikePrimarySkillId;
    visualModelId?: string;
};

type RoundConfig = {
    id?: number;
    times: number[];
    monsters: ModelId[];
    atkMultiple: number;
    hpMultiple: number;
};

type LevelTableRow = {
    id: number;
    name: string;
    fightscene: string;
    homeHp: number;
    atkMultiple: number;
    hpMultiple: number;
    roundIds: number[];
};

type RoundTableRow = {
    id: number;
    monsterTimes: number[];
    monsterIds: string[];
    atkMultiple: number;
    hpMultiple: number;
};

type NormalLevelTable = {
    source: string;
    levels: LevelTableRow[];
    rounds: Record<string, RoundTableRow>;
};

type PreparationConfig = {
    staticBatches: GearId[][];
    roundCoinRewards: number[];
};

type GearConfig = {
    id: GearId;
    name: string;
    tint: Color;
    level?: number;
    nextId?: GearId;
    powerPerTrigger?: number;
    unit?: ModelId;
    coinAmount?: number;
    shape: ReadonlyArray<readonly [number, number]>;
    gridUnlock?: boolean;
};

type Gear = {
    uid: number;
    id: GearId;
    row: number;
    col: number;
    node: Node;
    workerPower: number;
    location: GearLocation;
    candidateIndex: number;
};

type BattleUnit = {
    uid: number;
    team: Team;
    cfg: UnitConfig;
    node: Node;
    hpGraphics: Graphics;
    fallback: Graphics;
    skeleton: sp.Skeleton | null;
    hp: number;
    maxHp: number;
    shield: number;
    atk: number;
    x: number;
    y: number;
    cooldown: number;
    dead: boolean;
    frozen: number;
    barrage: H02BarrageProfile | null;
    barrageCooldown: number;
    barrageCasting: boolean;
    barrageCooldownStarted: boolean;
    barrageElapsed: number;
    barrageTarget: BattleUnit | null;
    barrageLaunchAttack: number;
    laser: H03LaserProfile | null;
    laserCooldown: number;
    laserCasting: boolean;
    laserCooldownStarted: boolean;
    laserElapsed: number;
    laserTarget: BattleUnit | null;
    transform: H03TransformProfile | null;
    transformRemaining: number;
    transformDamageIncrease: number;
    periodicHealRatio: number;
    periodicHealTimer: number;
    shieldWall: H04ShieldWallProfile | null;
    shieldWallCooldown: number;
    shieldWallRemaining: number;
    warriorCombo: WarriorComboProfile | null;
    warriorComboCompletedAttacks: number;
    warriorComboCriticalReady: boolean;
};

type PendingHit = {
    timer: number;
    attacker: BattleUnit;
    target: BattleUnit | null;
    targetHome: Team | null;
    fromX: number;
    fromY: number;
    effectRatio: number;
    areaRadius: number;
    maxTargets: number;
    impactX: number;
    impactY: number;
    projectile: boolean;
    launchAttack: number;
    bounceTimes: number;
    bounceMaxTimes: number;
    bounceRange: number;
    bounceAttackIncrease: number;
    bounceHitUids: Set<number>;
    countsAsWarriorAttack: boolean;
};

type ProductionJob = {
    timer: number;
    gear: Gear;
    kind: 'hamster' | 'tower' | 'coin';
};

type Trace = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    life: number;
    color: Color;
};

type FloatingText = {
    node: Node;
    label: Label;
    life: number;
};

type ProjectileVisual = {
    node: Node;
    delay: number;
    elapsed: number;
    duration: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
};

type HitEffectVisual = {
    node: Node;
    sprite: Sprite;
    frames: SpriteFrame[];
    frameSeconds: number;
    elapsed: number;
};

const DESIGN_WIDTH = 750;
const DESIGN_HEIGHT = 1334;
const HOME_X = 345;
const UNIT_Y_LIMIT = 110;
const GRID_CELL = 100;
const GRID_FACE_SIZE = 84;
const GRID_TOP = 252;
const GRID_LEFT = -300;
const GRID_ROWS = 5;
const GRID_COLS = 7;
const POWER_INDEX = 17;
const DEFAULT_LEVEL_ID = 1004;
const INFERRED_EFFECT_FRAME_SECONDS = 1 / 30;

const WHITE = new Color(255, 255, 255, 255);
const INK = new Color(62, 48, 43, 255);
const CREAM = new Color(255, 247, 213, 255);
const GREEN = new Color(55, 151, 99, 255);
const GREEN_DARK = new Color(27, 91, 68, 255);
const RED = new Color(218, 76, 74, 255);
const BLUE = new Color(64, 147, 231, 255);
const GOLD = new Color(255, 195, 55, 255);
const PANEL = new Color(34, 45, 48, 224);

const DEFAULT_ATTRS: Attributes = EMPTY_COMBAT_ATTRIBUTES;

const UNITS: Record<ModelId, UnitConfig> = {
    H0101: {
        id: 'H0101',
        name: '仓鼠战士',
        atk: 20,
        hp: 70,
        range: 50,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 10000,
        attackDelay: 0.3,
        spinePath: 'spine/H0101/js_zhanshi_1',
        spineScale: 0.8,
        color: new Color(246, 177, 73, 255),
    },
    H0201: {
        id: 'H0201',
        name: '仓鼠射手',
        atk: 27,
        hp: 51,
        range: 250,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 10000,
        attackDelay: 0.3,
        projectileSpeed: 700,
        spinePath: 'spine/H0201/js_sheshou_1',
        spineScale: 0.8,
        color: new Color(237, 121, 65, 255),
        attrs: { attackSpeed: 1500 },
    },
    H0301: {
        id: 'H0301',
        name: '仓鼠法师',
        atk: 30,
        hp: 55,
        range: 250,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 10000,
        attackDelay: 0.5,
        projectileSpeed: 300,
        spinePath: 'spine/H0301/js_fashi_1',
        spineScale: 0.8,
        color: new Color(72, 161, 229, 255),
    },
    H0401: {
        id: 'H0401',
        name: '仓鼠骑士',
        atk: 51,
        hp: 179,
        range: 75,
        searchRange: 400,
        moveSpeed: 90,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 10000,
        attackDelay: 0.3,
        spinePath: 'spine/H0401/js_qishi_1',
        spineScale: 0.8,
        color: new Color(107, 183, 106, 255),
    },
    H1101: {
        id: 'H1101',
        name: '治疗齿轮',
        atk: H11_BASE_ATTACK,
        hp: 220,
        range: 9999,
        searchRange: 9999,
        moveSpeed: 0,
        attackInterval: 1,
        attackType: 'WHEEL',
        effectRatio: H11_UNIT_HEAL_RATIO,
        attackDelay: 0,
        areaRadius: H11_TARGET_RADIUS,
        maxTargets: 1,
        randomTarget: true,
        spinePath: '',
        spineScale: 0.8,
        color: new Color(55, 189, 126, 255),
    },
    H1201: {
        id: 'H1201',
        name: '雷云齿轮',
        atk: 49,
        hp: 200,
        range: 9999,
        searchRange: 9999,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'WHEEL',
        effectRatio: H12_EFFECT_RATIO,
        attackDelay: H12_IMPACT_DELAY_SECONDS,
        areaRadius: H12_TARGET_RADIUS,
        maxTargets: H12_MAX_TARGETS,
        randomTarget: true,
        spinePath: '',
        spineScale: 0.8,
        color: new Color(125, 104, 231, 255),
    },
    H1301: {
        id: 'H1301',
        name: '火炮齿轮',
        atk: 66,
        hp: 300,
        range: 9999,
        searchRange: 9999,
        moveSpeed: 0,
        attackInterval: 1,
        attackType: 'WHEEL',
        effectRatio: 3500,
        attackDelay: 0,
        projectileSpeed: 1000,
        bounceTimes: 2,
        bounceRange: 300,
        randomTarget: true,
        spinePath: '',
        spineScale: 0.8,
        color: new Color(224, 132, 61, 255),
    },
    H07: {
        id: 'H07',
        name: '仓鼠铁铁侠',
        atk: 137,
        hp: 258,
        range: 150,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 10000,
        attackDelay: 0.3,
        spinePath: 'spine/H0705/js_gangtiexia',
        spineScale: 1.2,
        color: new Color(211, 71, 62, 255),
    },
    H08: {
        id: 'H08',
        name: '仓鼠凹凸曼',
        atk: 152,
        hp: 278,
        range: 250,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 10000,
        attackDelay: 0.15,
        projectileSpeed: 500,
        spinePath: 'spine/H0805/js_aoteman',
        spineScale: 1,
        color: new Color(219, 82, 65, 255),
    },
    H09: {
        id: 'H09',
        name: '仓鼠战车',
        atk: 258,
        hp: 906,
        range: 100,
        searchRange: 400,
        moveSpeed: 90,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 3500,
        attackDelay: 0,
        projectileSpeed: 400,
        bounceTimes: 2,
        bounceRange: 300,
        spinePath: 'spine/H0905/js_zhanche',
        spineScale: 1,
        color: new Color(185, 74, 69, 255),
    },
    M02: {
        id: 'M02',
        name: '云云猪',
        atk: 20,
        hp: 70,
        range: 50,
        searchRange: 1200,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: null,
        effectRatio: 10000,
        attackDelay: 0.3,
        spinePath: 'spine/M02/gw_02',
        spineScale: 0.6,
        color: new Color(186, 126, 215, 255),
        exp: 5,
    },
    M03: {
        id: 'M03',
        name: '僵僵猫',
        atk: 16,
        hp: 30,
        range: 250,
        searchRange: 1200,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: null,
        effectRatio: 5000,
        attackDelay: 0.3,
        projectileSpeed: 800,
        spinePath: 'spine/M03/gw_03',
        spineScale: 0.6,
        color: new Color(91, 173, 154, 255),
        attrs: { towerResistance: -5000 },
        exp: 5,
    },
    M07: {
        id: 'M07',
        name: '鬼鬼羊',
        atk: 16,
        hp: 30,
        range: 50,
        searchRange: 1200,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: null,
        effectRatio: 5000,
        attackDelay: 0.3,
        areaRadius: 75,
        maxTargets: 99,
        spinePath: 'spine/M07/gw_07',
        spineScale: 0.7,
        color: new Color(216, 172, 103, 255),
        exp: 5,
    },
    Boss02: {
        id: 'Boss02',
        name: '精英云云猪',
        atk: 30,
        hp: 690,
        range: 50,
        searchRange: 1200,
        moveSpeed: 90,
        attackInterval: 1,
        attackType: null,
        effectRatio: 10000,
        attackDelay: 0.3,
        spinePath: 'spine/M02/gw_02',
        spineScale: 1.2,
        color: new Color(181, 105, 205, 255),
        attrs: { attackSpeed: 5000 },
        boss: true,
        controlImmune: true,
        exp: 100,
    },
    Boss03: {
        id: 'Boss03',
        name: '精英僵僵猫',
        atk: 24,
        hp: 296,
        range: 250,
        searchRange: 1200,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: null,
        effectRatio: 5000,
        attackDelay: 0.3,
        projectileSpeed: 800,
        spinePath: 'spine/M03/gw_03',
        spineScale: 1.2,
        color: new Color(63, 139, 126, 255),
        attrs: { attackSpeed: 5000 },
        boss: true,
        controlImmune: true,
        exp: 100,
    },
    Boss07: {
        id: 'Boss07',
        name: '精英鬼鬼羊',
        atk: 24,
        hp: 296,
        range: 50,
        searchRange: 1200,
        moveSpeed: 90,
        attackInterval: 1,
        attackType: null,
        effectRatio: 5000,
        attackDelay: 0.3,
        areaRadius: 75,
        maxTargets: 99,
        spinePath: 'spine/M07/gw_07',
        spineScale: 1.1,
        color: new Color(192, 130, 75, 255),
        attrs: { attackSpeed: 5000 },
        boss: true,
        controlImmune: true,
        exp: 100,
    },
};

const GEARS: Record<GearId, GearConfig> = {
    P01: { id: 'P01', name: '能量核心', tint: new Color(255, 193, 52, 255), shape: [[0, 0]] },
    H0101: { id: 'H0101', name: '仓鼠战士', level: 1, nextId: 'H0102', tint: new Color(225, 84, 64, 255), powerPerTrigger: 10, unit: 'H0101', shape: [[0, 0]] },
    H0102: { id: 'H0102', name: '仓鼠战士', level: 2, nextId: 'H0103', tint: new Color(217, 104, 65, 255), powerPerTrigger: 10, unit: 'H0101', shape: [[0, 0]] },
    H0103: { id: 'H0103', name: '仓鼠战士', level: 3, nextId: 'H0104', tint: new Color(199, 83, 121, 255), powerPerTrigger: 10, unit: 'H0101', shape: [[0, 0]] },
    H0104: { id: 'H0104', name: '仓鼠战士', level: 4, tint: new Color(159, 76, 176, 255), powerPerTrigger: 10, unit: 'H0101', shape: [[0, 0]] },
    H0201: { id: 'H0201', name: '仓鼠射手', level: 1, nextId: 'H0202', tint: new Color(74, 157, 229, 255), powerPerTrigger: 8, unit: 'H0201', shape: [[0, 0], [0, 1]] },
    H0202: { id: 'H0202', name: '仓鼠射手', level: 2, nextId: 'H0203', tint: new Color(69, 137, 226, 255), powerPerTrigger: 8, unit: 'H0201', shape: [[0, 0], [0, 1]] },
    H0203: { id: 'H0203', name: '仓鼠射手', level: 3, nextId: 'H0204', tint: new Color(107, 99, 225, 255), powerPerTrigger: 8, unit: 'H0201', shape: [[0, 0], [0, 1]] },
    H0204: { id: 'H0204', name: '仓鼠射手', level: 4, tint: new Color(145, 82, 207, 255), powerPerTrigger: 8, unit: 'H0201', shape: [[0, 0], [0, 1]] },
    H0301: { id: 'H0301', name: '仓鼠法师', level: 1, nextId: 'H0302', tint: new Color(64, 166, 229, 255), powerPerTrigger: 7, unit: 'H0301', shape: [[0, 0], [1, 0]] },
    H0302: { id: 'H0302', name: '仓鼠法师', level: 2, nextId: 'H0303', tint: new Color(70, 143, 224, 255), powerPerTrigger: 7, unit: 'H0301', shape: [[0, 0], [1, 0]] },
    H0303: { id: 'H0303', name: '仓鼠法师', level: 3, nextId: 'H0304', tint: new Color(97, 112, 215, 255), powerPerTrigger: 7, unit: 'H0301', shape: [[0, 0], [1, 0]] },
    H0304: { id: 'H0304', name: '仓鼠法师', level: 4, tint: new Color(131, 84, 198, 255), powerPerTrigger: 7, unit: 'H0301', shape: [[0, 0], [1, 0]] },
    H0401: { id: 'H0401', name: '仓鼠骑士', level: 1, nextId: 'H0402', tint: new Color(70, 167, 99, 255), powerPerTrigger: 6, unit: 'H0401', shape: [[0, 0], [1, 0], [2, 0]] },
    H0402: { id: 'H0402', name: '仓鼠骑士', level: 2, nextId: 'H0403', tint: new Color(59, 153, 111, 255), powerPerTrigger: 6, unit: 'H0401', shape: [[0, 0], [1, 0], [2, 0]] },
    H0403: { id: 'H0403', name: '仓鼠骑士', level: 3, nextId: 'H0404', tint: new Color(73, 132, 151, 255), powerPerTrigger: 6, unit: 'H0401', shape: [[0, 0], [1, 0], [2, 0]] },
    H0404: { id: 'H0404', name: '仓鼠骑士', level: 4, tint: new Color(112, 101, 181, 255), powerPerTrigger: 6, unit: 'H0401', shape: [[0, 0], [1, 0], [2, 0]] },
    H1101: { id: 'H1101', name: '治疗齿轮', level: 1, nextId: 'H1102', tint: new Color(55, 189, 126, 255), powerPerTrigger: H11_POWER_PER_TRIGGER, unit: 'H1101', shape: H11_GEAR_SHAPE },
    H1102: { id: 'H1102', name: '治疗齿轮', level: 2, nextId: 'H1103', tint: new Color(48, 167, 117, 255), powerPerTrigger: H11_POWER_PER_TRIGGER, unit: 'H1101', shape: H11_GEAR_SHAPE },
    H1103: { id: 'H1103', name: '治疗齿轮', level: 3, nextId: 'H1104', tint: new Color(63, 151, 147, 255), powerPerTrigger: H11_POWER_PER_TRIGGER, unit: 'H1101', shape: H11_GEAR_SHAPE },
    H1104: { id: 'H1104', name: '治疗齿轮', level: 4, tint: new Color(89, 129, 164, 255), powerPerTrigger: H11_POWER_PER_TRIGGER, unit: 'H1101', shape: H11_GEAR_SHAPE },
    H1201: { id: 'H1201', name: '雷云齿轮', level: 1, nextId: 'H1202', tint: new Color(125, 104, 231, 255), powerPerTrigger: 20, unit: 'H1201', shape: [[0, 0], [0, 1]] },
    H1202: { id: 'H1202', name: '雷云齿轮', level: 2, nextId: 'H1203', tint: new Color(101, 83, 210, 255), powerPerTrigger: 20, unit: 'H1201', shape: [[0, 0], [0, 1]] },
    H1203: { id: 'H1203', name: '雷云齿轮', level: 3, nextId: 'H1204', tint: new Color(118, 76, 196, 255), powerPerTrigger: 20, unit: 'H1201', shape: [[0, 0], [0, 1]] },
    H1204: { id: 'H1204', name: '雷云齿轮', level: 4, tint: new Color(139, 68, 178, 255), powerPerTrigger: 20, unit: 'H1201', shape: [[0, 0], [0, 1]] },
    H1301: { id: 'H1301', name: '火炮齿轮', level: 1, nextId: 'H1302', tint: new Color(224, 132, 61, 255), powerPerTrigger: 15, unit: 'H1301', shape: [[0, 0], [0, 1], [1, 0]] },
    H1302: { id: 'H1302', name: '火炮齿轮', level: 2, nextId: 'H1303', tint: new Color(214, 110, 66, 255), powerPerTrigger: 15, unit: 'H1301', shape: [[0, 0], [0, 1], [1, 0]] },
    H1303: { id: 'H1303', name: '火炮齿轮', level: 3, nextId: 'H1304', tint: new Color(190, 87, 104, 255), powerPerTrigger: 15, unit: 'H1301', shape: [[0, 0], [0, 1], [1, 0]] },
    H1304: { id: 'H1304', name: '火炮齿轮', level: 4, tint: new Color(159, 76, 154, 255), powerPerTrigger: 15, unit: 'H1301', shape: [[0, 0], [0, 1], [1, 0]] },
    H0705: { id: 'H0705', name: '仓鼠铁铁侠', level: 5, tint: new Color(255, 99, 99, 255), powerPerTrigger: 8, unit: 'H07', shape: [[0, 0], [0, 1]] },
    H0805: { id: 'H0805', name: '仓鼠凹凸曼', level: 5, tint: new Color(255, 99, 99, 255), powerPerTrigger: 7, unit: 'H08', shape: [[0, 0], [1, 0]] },
    H0905: { id: 'H0905', name: '仓鼠战车', level: 5, tint: new Color(255, 99, 99, 255), powerPerTrigger: 6, unit: 'H09', shape: [[0, 0], [0, 1], [1, 0]] },
    C01: { id: 'C01', name: '银币齿轮', level: 1, nextId: 'C02', tint: new Color(255, 190, 43, 255), powerPerTrigger: 3, coinAmount: 2, shape: [[0, 0]] },
    C02: { id: 'C02', name: '银币齿轮', level: 2, nextId: 'C03', tint: new Color(245, 169, 41, 255), powerPerTrigger: 3, coinAmount: 4, shape: [[0, 0]] },
    C03: { id: 'C03', name: '银币齿轮', level: 3, nextId: 'C04', tint: new Color(232, 139, 55, 255), powerPerTrigger: 3, coinAmount: 8, shape: [[0, 0]] },
    C04: { id: 'C04', name: '银币齿轮', level: 4, tint: new Color(216, 104, 75, 255), powerPerTrigger: 3, coinAmount: 16, shape: [[0, 0]] },
    G01: { id: 'G01', name: '单格扩展', tint: new Color(84, 205, 180, 255), shape: [[0, 0]], gridUnlock: true },
    G02: { id: 'G02', name: '横向两格', tint: new Color(84, 205, 180, 255), shape: [[0, 0], [0, 1]], gridUnlock: true },
    G03: { id: 'G03', name: '纵向两格', tint: new Color(84, 205, 180, 255), shape: [[0, 0], [1, 0]], gridUnlock: true },
    G04: { id: 'G04', name: '横向三格', tint: new Color(84, 205, 180, 255), shape: [[0, 0], [0, 1], [0, 2]], gridUnlock: true },
    G05: { id: 'G05', name: '纵向三格', tint: new Color(84, 205, 180, 255), shape: [[0, 0], [1, 0], [2, 0]], gridUnlock: true },
    G06: { id: 'G06', name: '左下三格', tint: new Color(84, 205, 180, 255), shape: [[0, 0], [1, 0], [1, 1]], gridUnlock: true },
    G07: { id: 'G07', name: '左上三格', tint: new Color(84, 205, 180, 255), shape: [[0, 0], [0, 1], [1, 0]], gridUnlock: true },
    G08: { id: 'G08', name: '右下三格', tint: new Color(84, 205, 180, 255), shape: [[0, 1], [1, 0], [1, 1]], gridUnlock: true },
    G09: { id: 'G09', name: '右上三格', tint: new Color(84, 205, 180, 255), shape: [[0, 0], [0, 1], [1, 1]], gridUnlock: true },
};

const STATIC_BATCHES: GearId[][] = [
    ['H0101'],
    ['H0201', 'C01'],
    ['G02'],
    ['H0401', 'H0101', 'H0201'],
    ['H0101', 'H0401', 'H1201'],
    ['H1201', 'H0201', 'G02'],
    ['H0401', 'H0202', 'H0203'],
    ['H1202', 'H0203', 'H0201', 'G03'],
];

const ROUND_COIN_REWARDS = [0, 0, 15, 15, 15];
const PREPARATION_CONFIGS: Record<number, PreparationConfig> = {
    1001: {
        staticBatches: STATIC_BATCHES,
        roundCoinRewards: ROUND_COIN_REWARDS,
    },
    1004: {
        staticBatches: [
            ['H0401', 'H0401', 'H1301'],
            ['H1201', 'H0101', 'C01'],
            ['H0402', 'C01', 'G03'],
        ],
        roundCoinRewards: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15, 15, 15],
    },
};
const REFRESH_COST = 15;
const CANDIDATE_TRAY_HEIGHT = 250;
const CANDIDATE_TRAY_WIDTH = 730;
const ACCOUNT_HERO_NAMES: Readonly<Record<BagLikeAccountHeroFamily, string>> = {
    H01: '仓鼠战士',
    H02: '仓鼠射手',
    H03: '仓鼠法师',
    H04: '仓鼠骑士',
    H11: '治疗齿轮',
    H12: '雷云齿轮',
    H13: '火炮齿轮',
};

@ccclass('CangshuGame')
export class CangshuGame extends Component {
    @property({ tooltip: 'Recovered main-level ID to load from resources/data/normal-levels.json' })
    levelId = DEFAULT_LEVEL_ID;

    @property({ tooltip: 'Original challenge count: non-forever-static levels use weighted candidate drops after the first challenge' })
    challengeTimes = 2;

    @property({ tooltip: 'Semicolon-separated account-unlocked hero families currently supported by the reconstruction candidate/production chain' })
    unlockedHeroFamilies = 'H01;H02;H04;H12';

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H01 star; the runtime account profile persists the active value' })
    h01HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H02 star; the runtime account profile persists the active value' })
    h02HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H03 star; the runtime account profile persists the active value' })
    h03HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H04 star; the runtime account profile persists the active value' })
    h04HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H11 star; baseline 1 keeps unevidenced account upgrades disabled' })
    h11HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H12 star; the runtime account profile persists the active value' })
    h12HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H13 star; the runtime account profile persists the active value' })
    h13HeroStar = 1;

    private initialized = false;
    private accountProfile!: BagLikeAccountProfile;
    private accountDefaultProfile!: BagLikeAccountProfile;
    private claimedAccountRewardRounds = new Set<number>();
    private accountRewardsThisAttempt: BagLikeLevelAccountReward[] = [];
    private accountUnlockedThisAttempt: BagLikeAccountHeroFamily[] = [];
    private validationHeroStarOverrides: Partial<Record<BagLikeAccountHeroFamily, number>> | null = null;
    private originalFont: TTFFont | null = null;
    private levelName = '';
    private levelCatalog: LevelTableRow[] = [];
    private levelSelectPage = 0;
    private levelBackground = '';
    private baseLevelHomeHp = 500;
    private levelHomeHp = 500;
    private levelAtkMultiple = 10000;
    private levelHpMultiple = 10000;
    private rounds: RoundConfig[] = [];
    private staticBatches: GearId[][] = [];
    private roundCoinRewards: number[] = [];
    private gridOffsetY = 0;
    private phase: Phase = 'deploy';
    private roundIndex = 0;
    private roundClock = 0;
    private spawnIndex = 0;
    private clearTimer = 0;
    private serial = 0;
    private gears: Gear[] = [];
    private candidates: Gear[] = [];
    private units: BattleUnit[] = [];
    private pendingHits: PendingHit[] = [];
    private traces: Trace[] = [];
    private floatingTexts: FloatingText[] = [];
    private projectileVisuals: ProjectileVisual[] = [];
    private hitEffectVisuals: HitEffectVisual[] = [];
    private h02ProjectileFrame: SpriteFrame | null = null;
    private h0204ProjectileFrame: SpriteFrame | null = null;
    private h03ProjectileData: sp.SkeletonData | null = null;
    private h03FreezeData: sp.SkeletonData | null = null;
    private h03TransformData: sp.SkeletonData | null = null;
    private h03TransformAudio: AudioClip | null = null;
    private h03FreezeAudio: AudioClip | null = null;
    private h03StatusAudioSource: AudioSource | null = null;
    private h03LaserAudio: AudioClip | null = null;
    private h03LaserAudioSource: AudioSource | null = null;
    private h11HealingData: sp.SkeletonData | null = null;
    private h12SkillData: sp.SkeletonData | null = null;
    private h12HitAudio: AudioClip | null = null;
    private h12AudioSource: AudioSource | null = null;
    private h13ProjectileFrame: SpriteFrame | null = null;
    private h0705HitFrames: SpriteFrame[] = [];
    private h08HitFrames: SpriteFrame[] = [];
    private h0905ProjectileFrame: SpriteFrame | null = null;
    private h0905HitFrames: SpriteFrame[] = [];
    private h0905HitAudio: AudioClip | null = null;
    private h0905AudioSource: AudioSource | null = null;
    private h01AttackAudio: AudioClip | null = null;
    private h04AttackAudio: AudioClip | null = null;
    private meleeAttackAudioSource: AudioSource | null = null;
    private unlocked = new Set<number>();
    private selfHp = 500;
    private gold = 0;
    private refreshIndex = 0;
    private normalRefreshTimes = 0;
    private nonAdRefreshTimes = 0;
    private freeRefreshUsed = false;
    private powerDirection: 0 | 1 | 2 | 3 = 1;
    private powerTimer = POWER_QUARTER_LAP_SECONDS;
    private battleRandom: () => number = createBattleSeedRandom();
    private visualFixtureRandom: () => number = createBattleSeedRandom(1004);
    private productionJobs: ProductionJob[] = [];
    private speed: 1 | typeof BATTLE_SPEED_UP_MULTIPLE = 1;
    private paused = false;
    private failedAttempts = 0;
    private bagLikeLevel = 1;
    private bagLikeExp = 0;
    private traitRerollsUsed = 0;
    private traitTakeAllUsed = 0;
    private currentTraitChoices: TraitDefinition[] = [];
    private pendingTraitReturnPhase: 'battle' | 'roundClear' = 'battle';
    private traitStacks = new Map<TraitId, number>();
    private warriorKillAttackStacks = 0;
    private h11SkillId: H11SkillId = H11_BASE_SKILL_ID;
    private h12SkillId: H12SkillId = H12_BASE_SKILL_ID;
    private h13SkillId: H13SkillId = H13_BASE_SKILL_ID;

    private battleLayer!: Node;
    private unitLayer!: Node;
    private effectLayer!: Node;
    private prepareLayer!: Node;
    private hudLayer!: Node;
    private backpackBackground!: Node;
    private backpackPanel!: Node;
    private backpackHpBar!: Node;
    private candidateLayer!: Node;
    private resultLayer!: Node;
    private traitLayer!: Node;
    private accountLayer!: Node;
    private accountContentLayer!: Node;
    private levelSelectionLayer!: Node;
    private levelSelectionContentLayer!: Node;
    private traitCardsLayer!: Node;
    private gridLayer!: Node;
    private effectGraphics!: Graphics;
    private gridGraphics!: Graphics;
    private selfHomeGraphics!: Graphics;
    private backpackHpGraphics!: Graphics;
    private expGraphics!: Graphics;
    private phaseLabel!: Label;
    private roundLabel!: Label;
    private goldLabel!: Label;
    private ticketLabel!: Label;
    private selfHpLabel!: Label;
    private backpackHpLabel!: Label;
    private objectiveLabel!: Label;
    private actionLabel!: Label;
    private refreshLabel!: Label;
    private adRefreshLabel!: Label;
    private speedLabel!: Label;
    private pauseLabel!: Label;
    private accountButtonLabel!: Label;
    private levelButtonLabel!: Label;
    private levelTitleLabel!: Label;
    private expLevelLabel!: Label;
    private expValueLabel!: Label;
    private traitRerollLabel!: Label;
    private traitTakeAllLabel!: Label;
    private traitRerollCountLabel!: RichText;
    private traitTakeAllCountLabel!: RichText;
    private resultTitleLabel!: Label;
    private resultBodyLabel!: Label;
    private resultNextButtonLabel!: Label;
    private tipLabel!: Label;
    private dragGear: Gear | null = null;
    private dragOrigin = { row: 0, col: 0, x: 0, y: 0, scale: 1, location: 'grid' as GearLocation };

    onLoad(): void {
        view.setDesignResolutionSize(DESIGN_WIDTH, DESIGN_HEIGHT, ResolutionPolicy.SHOW_ALL);
        const transform = this.node.getComponent(UITransform) || this.node.addComponent(UITransform);
        transform.setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
        const requestedLevel = bagLikeLevelFromSearch(typeof window === 'undefined' ? '' : window.location.search);
        if (requestedLevel !== null) this.levelId = requestedLevel;
        this.preloadH02Projectile();
        this.preloadH0204Projectile();
        this.preloadH03Projectile();
        this.preloadH03StatusEffects();
        this.preloadH03LaserAudio();
        this.preloadH11Healing();
        this.preloadH12Skill();
        this.preloadH13Projectile();
        this.preloadH0705Impact();
        this.preloadH08Impact();
        this.preloadH0905Effects();
        this.preloadMeleeAttackAudio();
        resources.load('original/default', TTFFont, (fontError, font) => {
            if (!fontError && font) this.originalFont = font;
            if (this.visualCatalogMode()) {
                profiler.hideStats();
                this.buildVisualCatalog();
                return;
            }
            this.loadLevelAndBuildScene();
        });
    }

    private loadLevelAndBuildScene(): void {
        resources.load('data/normal-levels', JsonAsset, (error, asset) => {
            if (error || !asset) {
                this.showLoadError(`关卡表加载失败：${error?.message || 'missing data/normal-levels'}`);
                return;
            }
            try {
                this.configureLevel(asset.json as unknown as NormalLevelTable);
                if (!this.loadAccountProfile()) return;
                this.buildScene();
                this.initGrid();
                this.addPlacedGear('P01', 2, 3);
                const traitValidationEnabled = this.traitValidationEnabled();
                const developedValidationMode = this.developedValidationMode();
                if (traitValidationEnabled || developedValidationMode) profiler.hideStats();
                else this.dealPreparationBatch();
                const fusionValidationMode = this.fusionValidationMode();
                if (developedValidationMode) this.applyDevelopedValidationFixture();
                else if (fusionValidationMode) this.applyFusionValidationFixture(fusionValidationMode);
                else if (traitValidationEnabled) this.applyFusionValidationFixture('placed');
                this.applyPhaseLayout();
                this.initialized = true;
                if (developedValidationMode === 'trait') {
                    this.startRound();
                    this.bagLikeLevel = 2;
                    this.drawExpBar();
                    this.openTraitSelection();
                    this.currentTraitChoices = [
                        IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_ALL_abl13_eff01')!,
                        IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H02_abl02_eff01')!,
                        IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === 'RG_H03_abl02_eff01')!,
                    ];
                    this.renderTraitChoices();
                } else if (developedValidationMode === 'battle') {
                    this.startRound();
                    this.applyDevelopedBattleCaptureFixture();
                } else if (traitValidationEnabled) {
                    this.startRound();
                    this.openTraitSelection();
                } else if (fusionValidationMode === 'battle') {
                    this.startRound();
                    for (const gear of this.gears) {
                        if (gear.id === 'P01') continue;
                        gear.workerPower = 99;
                        this.queueProduction(gear);
                    }
                }
                this.refreshUi();
            } catch (levelError) {
                console.error('[cangshu] initialization failed', levelError);
                this.showLoadError(levelError instanceof Error ? levelError.message : String(levelError));
            }
        });
    }

    update(dt: number): void {
        if (!this.initialized) return;
        const scaled = Math.min(dt, 0.05) * this.speed;
        if (!this.paused && (this.phase === 'deploy' || this.phase === 'battle')) {
            this.stepPowerProduction(scaled, this.phase === 'battle');
        }
        if (this.phase === 'battle' && !this.paused) this.stepBattle(scaled);
        this.stepEffects(scaled);
        this.drawEffects();
        this.drawHomes();
        this.refreshUi();
    }

    private configureLevel(table: NormalLevelTable): void {
        this.levelCatalog = table.levels.map((row) => ({ ...row, roundIds: [...row.roundIds] }));
        const level = table.levels.find((row) => row.id === this.levelId);
        if (!level) throw new Error(`恢复关卡 ${this.levelId} 不存在于 ${table.source || 'normal-levels'}`);
        const preparation = PREPARATION_CONFIGS[level.id];
        if (!preparation) throw new Error(`恢复关卡 ${level.id} 尚未加入准备阶段配置`);
        const supportedModels = new Set(Object.keys(UNITS));
        const rounds = level.roundIds.map((roundId) => {
            const row = table.rounds[String(roundId)];
            if (!row) throw new Error(`恢复关卡 ${level.id} 缺少波次 ${roundId}`);
            for (const modelId of row.monsterIds) {
                if (!supportedModels.has(modelId)) throw new Error(`波次 ${roundId} 使用了未恢复单位 ${modelId}`);
            }
            return {
                id: row.id,
                times: [...row.monsterTimes],
                monsters: [...row.monsterIds] as ModelId[],
                atkMultiple: row.atkMultiple,
                hpMultiple: row.hpMultiple,
            };
        });
        this.levelName = level.name;
        this.levelBackground = level.fightscene.split('/').pop() || 'fightscene_01';
        this.baseLevelHomeHp = level.homeHp;
        this.levelHomeHp = level.homeHp;
        this.levelAtkMultiple = level.atkMultiple;
        this.levelHpMultiple = level.hpMultiple;
        this.selfHp = level.homeHp;
        this.rounds = rounds;
        this.staticBatches = preparation.staticBatches.map((batch) => [...batch]);
        this.roundCoinRewards = [...preparation.roundCoinRewards];
    }

    private showLoadError(message: string): void {
        this.makeLabel('LoadError', this.node, 0, 0, 680, 180, message, 24, RED);
    }

    private loadAccountProfile(): boolean {
        this.accountDefaultProfile = createBagLikeAccountProfile({
            unlockedHeroFamilies: this.unlockedHeroFamilies,
            heroStars: {
                H01: this.h01HeroStar,
                H02: this.h02HeroStar,
                H03: this.h03HeroStar,
                H04: this.h04HeroStar,
                H11: this.h11HeroStar,
                H12: this.h12HeroStar,
                H13: this.h13HeroStar,
            },
            levelId: this.levelId,
            challengeTimes: this.challengeTimes,
            // The representative default starts immediately before level 1004. URL
            // navigation must not manufacture progress for an arbitrary requested level.
            maxPassedLevelId: Math.max(1000, DEFAULT_LEVEL_ID - 1),
        });
        const loaded = loadBagLikeAccountProfile(sys.localStorage, this.accountDefaultProfile);
        this.accountProfile = loaded.profile;
        this.syncAccountProfileToRuntime();
        if (loaded.recoveredFromInvalidSave) {
            console.warn('[cangshu] invalid account save ignored; restored evidence-safe defaults');
        }
        if (!bagLikeLevelUnlocked(this.accountProfile.maxPassedLevelId, this.levelId)) {
            const fallbackLevel = bagLikeLatestUnlockedLevel(this.accountProfile.maxPassedLevelId);
            console.warn(`[cangshu] locked level ${this.levelId} rejected; returning to ${fallbackLevel}`);
            this.navigateToLevel(fallbackLevel);
            return false;
        }
        return true;
    }

    private syncAccountProfileToRuntime(syncChallengeTimes = true): void {
        const stars = this.accountProfile.stars;
        this.h01HeroStar = stars.H01;
        this.h02HeroStar = stars.H02;
        this.h03HeroStar = stars.H03;
        this.h04HeroStar = stars.H04;
        this.h11HeroStar = stars.H11;
        this.h12HeroStar = stars.H12;
        this.h13HeroStar = stars.H13;
        this.unlockedHeroFamilies = [...bagLikeAccountUnlockedHeroFamilies(this.accountProfile)].join(';');
        if (syncChallengeTimes) this.challengeTimes = bagLikeAccountChallengeTimes(this.accountProfile, this.levelId);
    }

    private persistAccountProfile(syncChallengeTimes = true): void {
        this.syncAccountProfileToRuntime(syncChallengeTimes);
        if (!saveBagLikeAccountProfile(sys.localStorage, this.accountProfile)) {
            console.warn('[cangshu] account profile could not be persisted in this runtime');
        }
    }

    private fusionValidationMode(): 'tray' | 'placed' | 'battle' | null {
        if (typeof window === 'undefined') return null;
        const match = /(?:^|[?&])fusionValidation=(tray|placed|battle)(?:&|$)/.exec(window.location.search);
        return match ? match[1] as 'tray' | 'placed' | 'battle' : null;
    }

    private traitValidationEnabled(): boolean {
        if (typeof window === 'undefined') return false;
        return /(?:^|[?&])traitValidation=1(?:&|$)/.test(window.location.search);
    }

    private developedValidationMode(): 'preparation' | 'battle' | 'trait' | null {
        if (typeof window === 'undefined') return null;
        const match = /(?:^|[?&])developedValidation=(preparation|battle|trait)(?:&|$)/.exec(window.location.search);
        return match ? match[1] as 'preparation' | 'battle' | 'trait' : null;
    }

    private accountDebugEnabled(): boolean {
        if (typeof window === 'undefined') return false;
        return /(?:^|[?&])accountDebug=1(?:&|$)/.test(window.location.search);
    }

    private visualCatalogMode(): 'enemies' | 'gears' | null {
        if (typeof window === 'undefined') return null;
        const match = /(?:^|[?&])visualCatalog=(enemies|gears)(?:&|$)/.exec(window.location.search);
        return match ? match[1] as 'enemies' | 'gears' : null;
    }

    private visualCatalogPage(): number {
        if (typeof window === 'undefined') return 0;
        const match = /(?:^|[?&])visualPage=(\d+)(?:&|$)/.exec(window.location.search);
        return match ? Math.max(0, Number(match[1]) || 0) : 0;
    }

    private navigateVisualCatalog(mode: 'enemies' | 'gears', page = 0): void {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        url.searchParams.set('visualCatalog', mode);
        if (mode === 'gears') url.searchParams.set('visualPage', String(page));
        else url.searchParams.delete('visualPage');
        window.location.href = url.toString();
    }

    private buildVisualCatalog(): void {
        const mode = this.visualCatalogMode() || 'enemies';
        const background = this.makeNode('VisualCatalogBackground', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const backgroundGraphics = background.addComponent(Graphics);
        backgroundGraphics.fillColor = new Color(22, 31, 48, 255);
        backgroundGraphics.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        backgroundGraphics.fill();

        this.makeLabel('VisualCatalogTitle', this.node, 0, 620, 700, 52,
            mode === 'enemies' ? '200关敌人 / Boss 原始外观（25种）' : '我方齿轮原始外观（58件）', 30, WHITE);
        this.makeButton('EnemyCatalogTab', this.node, -170, 566, 290, 54, '敌人 / Boss 25种', () => this.navigateVisualCatalog('enemies'));
        this.makeButton('GearCatalogTab', this.node, 170, 566, 290, 54, '我方齿轮 58件', () => this.navigateVisualCatalog('gears'));

        if (mode === 'enemies') this.buildEnemyVisualCatalog();
        else this.buildGearVisualCatalog();
    }

    private buildEnemyVisualCatalog(): void {
        VISUAL_ENEMY_ROSTER.forEach((entry, index) => {
            const column = index % 5;
            const row = Math.floor(index / 5);
            const card = this.makeVisualCatalogCard(`EnemyVisual_${entry.id}`, -292 + column * 146, 435 - row * 180, 136, 168);
            this.attachEnemyVisual(card, entry);
            this.makeLabel(`EnemyName_${entry.id}`, card, 0, -54, 128, 40, `${entry.id}\n${entry.name}`, 17,
                entry.kind === 'BOSS' ? GOLD : WHITE);
        });
        this.makeLabel('EnemyCatalogEvidence', this.node, 0, -486, 700, 30,
            '覆盖 normal-levels.json 的200关、2978波；同族Boss按原配置放大显示', 16, CREAM);
    }

    private attachEnemyVisual(parent: Node, entry: VisualEnemyEntry): void {
        const modelNode = this.makeNode(`EnemySpine_${entry.id}`, parent, 0, 25, 120, 120);
        resources.load(entry.spinePath, sp.SkeletonData, (error, data) => {
            if (error || !modelNode.isValid) {
                console.error(`[visual-catalog] enemy asset failed ${entry.id} ${entry.spinePath}: ${error?.message || 'invalid node'}`);
                return;
            }
            const skeleton = modelNode.addComponent(sp.Skeleton);
            skeleton.skeletonData = data;
            skeleton.premultipliedAlpha = false;
            const galleryScale = entry.spineScale * (entry.kind === 'BOSS' ? 0.55 : 0.72);
            modelNode.setScale(galleryScale, galleryScale, 1);
            try {
                if (skeleton.findAnimation('idle')) skeleton.setAnimation(0, 'idle', true);
            } catch {
                // Valid 3.8.99 skeleton data still renders its setup pose.
            }
        });
    }

    private buildGearVisualCatalog(): void {
        const pageSize = 20;
        const pageCount = Math.ceil(VISUAL_GEAR_ROSTER.length / pageSize);
        const page = Math.min(this.visualCatalogPage(), pageCount - 1);
        const pageEntries = VISUAL_GEAR_ROSTER.slice(page * pageSize, (page + 1) * pageSize);
        pageEntries.forEach((entry, index) => {
            const column = index % 4;
            const row = Math.floor(index / 4);
            const card = this.makeVisualCatalogCard(`GearVisual_${entry.id}`, -270 + column * 180, 435 - row * 180, 168, 168);
            this.attachGearVisual(card, entry);
            this.makeLabel(`GearName_${entry.id}`, card, 0, -57, 158, 36, `${entry.id}  ${entry.name}`, 15, WHITE);
        });
        this.makeButton('GearCatalogPrevious', this.node, -205, -486, 170, 48, '上一页', () => this.navigateVisualCatalog('gears', (page + pageCount - 1) % pageCount));
        this.makeLabel('GearCatalogPage', this.node, 0, -486, 150, 44, `${page + 1} / ${pageCount}`, 22, GOLD);
        this.makeButton('GearCatalogNext', this.node, 205, -486, 170, 48, '下一页', () => this.navigateVisualCatalog('gears', (page + 1) % pageCount));
    }

    private attachGearVisual(parent: Node, entry: VisualGearEntry): void {
        const shape = VISUAL_GEAR_SHAPES[entry.shapeId];
        if (!shape) return;
        const footprintRows = Math.max(...shape.map(([row]) => row)) + 1;
        const footprintColumns = Math.max(...shape.map(([, column]) => column)) + 1;
        const gearNode = this.makeNode(`ExactGear_${entry.id}`, parent,
            -(footprintColumns - 1) * GRID_CELL * 0.19,
            24 + (footprintRows - 1) * GRID_CELL * 0.19,
            footprintColumns * GRID_CELL,
            footprintRows * GRID_CELL);
        gearNode.setScale(0.38, 0.38, 1);
        if (shape.length > 1) this.attachGearConnectorSprite(gearNode, shape, WHITE);
        for (const [shapeRow, shapeColumn] of shape) {
            this.attachGearBodySprite(gearNode, entry.level, shapeColumn * GRID_CELL, -shapeRow * GRID_CELL);
        }
        if (entry.level >= 5) this.attachLevelFiveShapeOverlay(gearNode, shape);
        this.attachStaticGearPortrait(
            gearNode,
            entry.headKey,
            (footprintColumns - 1) * GRID_CELL * 0.5,
            -(footprintRows - 1) * GRID_CELL * 0.5 + 3,
        );
    }

    private makeVisualCatalogCard(name: string, x: number, y: number, width: number, height: number): Node {
        const card = this.makeNode(name, this.node, x, y, width, height);
        const graphics = card.addComponent(Graphics);
        graphics.fillColor = new Color(41, 55, 78, 245);
        graphics.roundRect(-width / 2, -height / 2, width, height, 14);
        graphics.fill();
        graphics.strokeColor = new Color(113, 146, 190, 255);
        graphics.lineWidth = 2;
        graphics.roundRect(-width / 2 + 1, -height / 2 + 1, width - 2, height - 2, 13);
        graphics.stroke();
        return card;
    }

    // Evidence-backed account/layout fixture for the three developed-state
    // screenshots. It is isolated from the normal URL and save-state defaults.
    private applyDevelopedValidationFixture(): void {
        this.clearCandidates();
        const core = this.gears.find((gear) => gear.id === 'P01');
        for (const gear of this.gears) {
            if (gear !== core && gear.node.isValid) gear.node.destroy();
        }
        this.gears = core ? [core] : [];
        this.h13HeroStar = 3;
        this.h02HeroStar = 3;
        this.validationHeroStarOverrides = { H13: 3, H02: 3 };
        this.refreshPlacedWheelHomeHp();

        this.addPlacedGear('H1301', 1, 2);
        this.addPlacedGear('H0301', 1, 4);
        this.addPlacedGear('H0202', 3, 2);
        this.replaceCandidates(['C01']);
    }

    // Screenshot-only 10 s boundary normalized from the authorized level-1004
    // battle reference. The normal game URL never calls this method.
    private applyDevelopedBattleCaptureFixture(): void {
        if (this.developedValidationMode() !== 'battle' || this.phase !== 'battle') return;
        this.clearUnits();
        const round = this.rounds[0];
        const atkScale = (this.levelAtkMultiple / 10000) * (round.atkMultiple / 10000);
        const hpScale = (this.levelHpMultiple / 10000) * (round.hpMultiple / 10000);
        const referenceUnits: ReadonlyArray<readonly [ModelId, number, number]> = [
            ['M07', 310, 120],
            ['M02', 145, 35],
            ['M02', 285, -35],
            ['M02', 220, -120],
        ];
        for (const [model, x, y] of referenceUnits) {
            this.createUnit('enemy', UNITS[model], x, y, atkScale, hpScale);
            this.addDamageText(27, x, y + 48);
        }
        this.paused = true;
    }

    // Explicit browser-only visual fixture. It is unreachable in the normal
    // game URL and does not alter target-account star defaults or drop tables.
    private applyFusionValidationFixture(mode: 'tray' | 'placed' | 'battle'): void {
        this.clearCandidates();
        const core = this.gears.find((gear) => gear.id === 'P01');
        for (const gear of this.gears) {
            if (gear !== core && gear.node.isValid) gear.node.destroy();
        }
        this.gears = core ? [core] : [];
        this.refreshPlacedWheelHomeHp();

        if (mode === 'tray') {
            this.replaceCandidates(['H0705', 'H0805', 'H0905']);
            return;
        }

        // H0905's L footprint needs column 5, which is deliberately unlocked
        // only inside this fixture. The three pieces each touch a different
        // side of the power core without overlapping one another.
        for (const [row, col] of [[2, 5], [3, 5]] as const) this.unlocked.add(row * GRID_COLS + col);
        this.drawGrid();
        this.addPlacedGear('H0705', 1, 3);
        this.addPlacedGear('H0805', 2, 2);
        this.addPlacedGear('H0905', 2, 4);
    }

    private buildScene(): void {
        const background = this.makeNode('OriginalBattlefield', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const backgroundSprite = background.addComponent(Sprite);
        backgroundSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        resources.load(`original/${this.levelBackground}/spriteFrame`, SpriteFrame, (error, frame) => {
            if (!error && background.isValid) backgroundSprite.spriteFrame = frame;
        });

        this.battleLayer = this.makeNode('BattleLayer', this.node, 0, DEPLOY_BATTLE_Y, 750, DEPLOY_BATTLE_HEIGHT);
        this.unitLayer = this.makeNode('Units', this.battleLayer, 0, 0, 750, DEPLOY_BATTLE_HEIGHT);
        this.effectLayer = this.makeNode('BattleEffects', this.battleLayer, 0, 0, 750, DEPLOY_BATTLE_HEIGHT);
        this.effectGraphics = this.effectLayer.addComponent(Graphics);

        const selfHome = this.makeNode('SelfCamp', this.battleLayer, -HOME_X, 0, 120, 236);
        const selfSprite = selfHome.addComponent(Sprite);
        selfSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        resources.load('original/blue_base/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && selfHome.isValid) selfSprite.spriteFrame = frame;
        });
        const selfHomeHp = this.makeNode('SelfCampHp', selfHome, 0, 0, 124, 90);
        this.selfHomeGraphics = selfHomeHp.addComponent(Graphics);

        const enemyHome = this.makeNode('EnemyCamp', this.battleLayer, HOME_X, 0, 120, 236);
        const enemySprite = enemyHome.addComponent(Sprite);
        enemySprite.sizeMode = Sprite.SizeMode.CUSTOM;
        enemyHome.setScale(-1, 1, 1);
        resources.load('original/red_base/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && enemyHome.isValid) enemySprite.spriteFrame = frame;
        });

        // Recovered FairyGUI BagLikeTopItem is 750x320 at the top of the
        // 750x1334 design canvas. Child coordinates below are converted from
        // its top-left space to Cocos' centered, y-up space.
        const topPanel = this.makeNode('TopHud', this.node, 0, 507, 750, 320);
        this.goldLabel = this.makeHudCounter('CoinCounter', topPanel, -136, 115, 150, ITEM_ATLAS_FRAMES.coin, '0');
        this.ticketLabel = this.makeHudCounter('TicketCounter', topPanel, 45, 115, 150, ITEM_ATLAS_FRAMES.adTicket, '3');
        this.roundLabel = this.makeLabel('Round', topPanel, 0, -2, 150, 32, `1/${this.rounds.length}波`, 21, WHITE);
        this.applyOriginalOutline(this.roundLabel, new Color(12, 12, 12, 255), 2);

        const levelBadge = this.makeNode('LevelBadge', topPanel, 327, 35, 58, 58);
        const levelBadgeGraphics = levelBadge.addComponent(Graphics);
        levelBadgeGraphics.fillColor = new Color(255, 218, 86, 255);
        levelBadgeGraphics.strokeColor = new Color(69, 52, 31, 255);
        levelBadgeGraphics.lineWidth = 4;
        levelBadgeGraphics.moveTo(0, 29);
        levelBadgeGraphics.lineTo(25, 15);
        levelBadgeGraphics.lineTo(25, -15);
        levelBadgeGraphics.lineTo(0, -29);
        levelBadgeGraphics.lineTo(-25, -15);
        levelBadgeGraphics.lineTo(-25, 15);
        levelBadgeGraphics.close();
        levelBadgeGraphics.fill();
        levelBadgeGraphics.stroke();
        this.expLevelLabel = this.makeLabel('ExpLevel', levelBadge, 0, 0, 46, 38, '1', 24, INK);

        const statsIcon = this.makeNode('BattleStats', topPanel, 223, -36, 80, 80);
        this.attachRecoveredAtlasSprite(statsIcon, 'original/comm_0/spriteFrame', COMM_ATLAS_FRAMES.battleStats);

        const handbookIcon = this.makeNode('Handbook', topPanel, 303, -36, 80, 80);
        this.attachRecoveredAtlasSprite(handbookIcon, 'original/comm_0/spriteFrame', COMM_ATLAS_FRAMES.handbook);

        // These labels remain as internal observability sinks for refreshUi;
        // the original top item does not render the reconstruction-only title,
        // objective, phase, or duplicate home-HP copy.
        this.selfHpLabel = this.makeLabel('SelfHp', topPanel, 0, 0, 1, 1, '', 1, WHITE);
        this.objectiveLabel = this.makeLabel('Objective', topPanel, 0, 0, 1, 1, '', 1, WHITE);
        this.phaseLabel = this.makeLabel('Phase', topPanel, 0, 0, 1, 1, '', 1, WHITE);
        this.selfHpLabel.node.active = false;
        this.objectiveLabel.node.active = false;
        this.phaseLabel.node.active = false;

        this.prepareLayer = this.makeNode('PreparationLayer', this.node, 0, 0, 750, DESIGN_HEIGHT);
        this.backpackBackground = this.makeNode('BackpackBackground', this.prepareLayer, 0, -150, 750, 1034);
        this.attachBagLikeAtlasSprite(this.backpackBackground, BAGLIKE_ATLAS_FRAMES.operationBackground);

        this.backpackHpBar = this.makeNode('BackpackHpBar', this.prepareLayer, 0, 330, 680, 38);
        this.backpackHpGraphics = this.backpackHpBar.addComponent(Graphics);
        this.backpackHpLabel = this.makeLabel('BackpackHpText', this.backpackHpBar, 0, 0, 180, 30, `♥ ${this.levelHomeHp}`, 20, WHITE);
        // FairyGUI places the 529px panel at y=77 in BagLikeOperComp's
        // top-left coordinates. Its Cocos centre is therefore y=51.5.
        this.backpackPanel = this.makeNode('BackpackPanel', this.prepareLayer, 0, 51.5, 730, 529);
        this.attachBagLikeAtlasSprite(this.backpackPanel, BAGLIKE_ATLAS_FRAMES.backpackPanel);
        this.gridLayer = this.makeNode('BackpackGrid', this.prepareLayer, 0, 0, 750, DESIGN_HEIGHT);
        this.gridGraphics = this.gridLayer.addComponent(Graphics);

        this.candidateLayer = this.makeNode('CandidateShop', this.prepareLayer, 0, DEPLOY_CANDIDATE_Y, 730, CANDIDATE_TRAY_HEIGHT);
        this.candidateLayer.addComponent(Graphics);

        this.tipLabel = this.makeLabel(
            'Tip',
            this.prepareLayer,
            105,
            -515,
            470,
            34,
            '先把候选齿轮拖入背包；刷新会替换尚未摆放的候选',
            15,
            CREAM,
        );

        this.adRefreshLabel = this.makeButton('AdRefresh', this.prepareLayer, -235.5, -598.5, 215, 103, '广告刷新 1/1', () => this.claimFreeBatch());
        this.refreshLabel = this.makeButton('Refresh', this.prepareLayer, -3, -598, 214, 102, '免费刷新', () => this.claimNextBatch(false));
        this.actionLabel = this.makeButton('Action', this.prepareLayer, 230.5, -598.5, 215, 103, '开始第 1 波', () => this.onAction());
        this.restyleButton(this.adRefreshLabel, new Color(0, 196, 236, 255), new Color(236, 255, 255, 255));
        this.restyleButton(this.refreshLabel, new Color(50, 211, 153, 255), new Color(226, 255, 240, 255));
        this.restyleButton(this.actionLabel, new Color(255, 191, 46, 255), new Color(255, 245, 188, 255));
        this.applyCommButtonSkin(this.adRefreshLabel, COMM_ATLAS_FRAMES.blueButton);
        this.applyCommButtonSkin(this.refreshLabel, COMM_ATLAS_FRAMES.greenButton);
        this.applyCommButtonSkin(this.actionLabel, COMM_ATLAS_FRAMES.yellowButton);
        for (const label of [this.adRefreshLabel, this.refreshLabel, this.actionLabel]) {
            label.fontSize = 30;
            label.lineHeight = 36;
        }
        this.speedLabel = this.makeButton('Speed', this.node, -256.5, 476.5, 150, 54, '1× 速度', () => {
            this.speed = this.speed === 1 ? BATTLE_SPEED_UP_MULTIPLE : 1;
            this.speedLabel.string = `${this.speed}× 速度`;
        });
        this.speedLabel.node.parent!.active = false;
        this.pauseLabel = this.makeButton('Pause', this.node, -296, 617, 72, 72, '', () => {
            if (this.phase !== 'battle') return;
            this.paused = !this.paused;
            this.pauseLabel.string = '';
        });
        this.restyleButton(this.pauseLabel, new Color(40, 179, 237, 255), new Color(197, 245, 255, 255));
        this.applyCommButtonSkin(this.pauseLabel, COMM_ATLAS_FRAMES.pause);
        this.accountButtonLabel = this.makeButton('Account', this.node, -190, 617, 130, 58, '账号 / 星级', () => this.openAccountPanel());
        this.restyleButton(this.accountButtonLabel, new Color(82, 79, 176, 255), new Color(235, 233, 255, 255));
        this.accountButtonLabel.node.parent!.active = !this.traitValidationEnabled()
            && !this.developedValidationMode()
            && !this.fusionValidationMode();
        this.levelButtonLabel = this.makeButton('LevelSelection', this.node, 280, 617, 140, 58,
            `第 ${bagLikeLevelNumber(this.levelId)} 关`, () => this.openLevelSelectionPanel());
        this.restyleButton(this.levelButtonLabel, new Color(39, 118, 171, 255), new Color(225, 248, 255, 255));
        this.levelButtonLabel.node.parent!.active = this.accountButtonLabel.node.parent!.active;

        this.levelTitleLabel = this.makeLabel('LevelTitle', this.node, 0, 625, 1, 1, '', 1, CREAM);
        this.levelTitleLabel.node.active = false;

        const expNode = this.makeNode('BagLikeExp', this.node, 0, 542, 666, 28);
        this.expGraphics = expNode.addComponent(Graphics);
        this.expValueLabel = this.makeLabel('ExpValue', expNode, 0, 0, 1, 1, '', 1, WHITE);
        this.expValueLabel.node.active = false;

        this.hudLayer = this.makeNode('HudOverlay', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        topPanel.parent = this.hudLayer;
        this.pauseLabel.node.parent!.parent = this.hudLayer;
        this.speedLabel.node.parent!.parent = this.hudLayer;
        this.accountButtonLabel.node.parent!.parent = this.hudLayer;
        this.levelButtonLabel.node.parent!.parent = this.hudLayer;
        this.levelTitleLabel.node.parent = this.hudLayer;
        expNode.parent = this.hudLayer;

        this.resultLayer = this.makeNode('ResultOverlay', this.node, 0, 0, 620, 380);
        const resultGraphics = this.resultLayer.addComponent(Graphics);
        resultGraphics.fillColor = new Color(22, 38, 40, 242);
        resultGraphics.roundRect(-310, -190, 620, 380, 28);
        resultGraphics.fill();
        resultGraphics.strokeColor = new Color(239, 210, 119, 255);
        resultGraphics.lineWidth = 5;
        resultGraphics.roundRect(-307, -187, 614, 374, 25);
        resultGraphics.stroke();
        this.resultTitleLabel = this.makeLabel('ResultTitle', this.resultLayer, 0, 118, 480, 64, '关卡胜利', 38, GOLD);
        this.resultBodyLabel = this.makeLabel('ResultBody', this.resultLayer, 0, 36, 540, 110, '', 20, CREAM);
        this.makeButton('Retry', this.resultLayer, -130, -125, 230, 64, '重新挑战', () => this.restartLevel());
        this.resultNextButtonLabel = this.makeButton('NextLevel', this.resultLayer, 130, -125, 230, 64,
            '进入下一关', () => this.navigateToLevel(this.levelId + 1));
        this.restyleButton(this.resultNextButtonLabel, new Color(45, 151, 92, 255), new Color(231, 255, 231, 255));
        this.resultNextButtonLabel.node.parent!.active = false;
        this.resultLayer.active = false;

        this.traitLayer = this.makeNode('TraitSelectionOverlay', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const shade = this.traitLayer.addComponent(Graphics);
        shade.fillColor = new Color(18, 20, 28, 202);
        shade.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        shade.fill();
        const titleRibbon = this.makeNode('TraitTitleRibbon', this.traitLayer, 0, TRAIT_VISUAL_LAYOUT.titleY, 580, 92);
        this.attachRecoveredAtlasSprite(titleRibbon, 'original/comm_0/spriteFrame', COMM_ATLAS_FRAMES.traitTitleRibbon);
        const traitTitle = this.makeLabel('TraitTitle', titleRibbon, 0, 1, 480, 58, '选择激活特性', 34, WHITE);
        this.applyOriginalOutline(traitTitle, new Color(19, 9, 0, 255), 5);
        this.traitCardsLayer = this.makeNode('TraitCards', this.traitLayer, 0, TRAIT_VISUAL_LAYOUT.cardsY, 700, 500);
        this.traitRerollLabel = this.makeButton('TraitReroll', this.traitLayer, -174, TRAIT_VISUAL_LAYOUT.actionY, 270, 92, '换一批', () => this.rerollTraits());
        this.traitTakeAllLabel = this.makeButton('TraitTakeAll', this.traitLayer, 174, TRAIT_VISUAL_LAYOUT.actionY, 270, 92, '全都要', () => this.takeAllTraits());
        this.applyCommButtonSkin(this.traitRerollLabel, COMM_ATLAS_FRAMES.blueButton);
        this.applyCommButtonSkin(this.traitTakeAllLabel, COMM_ATLAS_FRAMES.purpleButton);
        this.addTraitVideoIcon(this.traitRerollLabel);
        this.addTraitVideoIcon(this.traitTakeAllLabel);
        const rerollButtonNode = this.traitRerollLabel.node.parent!;
        const takeAllButtonNode = this.traitTakeAllLabel.node.parent!;
        this.traitRerollCountLabel = this.makeTraitCountLabel('TraitRerollCount', rerollButtonNode);
        this.traitTakeAllCountLabel = this.makeTraitCountLabel('TraitTakeAllCount', takeAllButtonNode);
        this.makeLabel('TraitRerollHint', this.traitLayer, -174, TRAIT_VISUAL_LAYOUT.actionHintY, 270, 28, '必出紫品以上属性', 16, new Color(190, 124, 255, 255));
        this.makeLabel('TraitTakeAllHint', this.traitLayer, 174, TRAIT_VISUAL_LAYOUT.actionHintY, 270, 28, '全选胜率加倍', 16, GOLD);
        this.traitLayer.active = false;
        this.buildAccountPanel();
        this.buildLevelSelectionPanel();
        this.drawExpBar();
    }

    private buildAccountPanel(): void {
        this.accountLayer = this.makeNode('AccountOverlay', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const shade = this.accountLayer.addComponent(Graphics);
        shade.fillColor = new Color(12, 16, 28, 220);
        shade.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        shade.fill();

        const panel = this.makeNode('AccountPanel', this.accountLayer, 0, 0, 700, 1120);
        const panelGraphics = panel.addComponent(Graphics);
        panelGraphics.fillColor = new Color(29, 40, 61, 252);
        panelGraphics.roundRect(-350, -560, 700, 1120, 28);
        panelGraphics.fill();
        panelGraphics.strokeColor = new Color(139, 175, 226, 255);
        panelGraphics.lineWidth = 4;
        panelGraphics.roundRect(-348, -558, 696, 1116, 26);
        panelGraphics.stroke();

        this.makeLabel('AccountTitle', panel, 0, 505, 620, 58, '账号养成 · 英雄星级', 34, GOLD);
        this.makeLabel(
            'AccountEvidenceNotice',
            panel,
            0,
            457,
            630,
            56,
            '关卡奖励、解锁条件和 1–20 星消耗均来自原包配置\n金币、体力、钻石、碎片、通关进度会保存到本地',
            17,
            CREAM,
        );
        this.accountContentLayer = this.makeNode('AccountContent', panel, 0, 0, 660, 760);

        this.makeButton('AccountReset', panel, -125, -500, 200, 58, '重置本地档案', () => this.resetAccountProfile());
        this.makeButton('AccountClose', panel, 125, -500, 200, 58, '保存并关闭', () => this.closeAccountPanel());
        if (this.accountDebugEnabled()) {
            this.makeButton('AccountAllOneStar', panel, -210, -425, 170, 54, '测试：全 1 星', () => this.applyAccountStarPreset(1));
            this.makeButton('AccountAllMaxStar', panel, 0, -425, 170, 54, '测试：全 20 星', () => this.applyAccountStarPreset(20));
            this.makeButton('AccountChallengePlus', panel, 210, -425, 170, 54, '测试：挑战 +1', () => this.changeAccountChallengeTimes(1));
        }
        this.accountLayer.active = false;
    }

    private buildLevelSelectionPanel(): void {
        this.levelSelectionLayer = this.makeNode('LevelSelectionOverlay', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const shade = this.levelSelectionLayer.addComponent(Graphics);
        shade.fillColor = new Color(12, 16, 28, 220);
        shade.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        shade.fill();

        const panel = this.makeNode('LevelSelectionPanel', this.levelSelectionLayer, 0, 0, 700, 1120);
        const panelGraphics = panel.addComponent(Graphics);
        panelGraphics.fillColor = new Color(29, 40, 61, 252);
        panelGraphics.roundRect(-350, -560, 700, 1120, 28);
        panelGraphics.fill();
        panelGraphics.strokeColor = new Color(112, 193, 238, 255);
        panelGraphics.lineWidth = 4;
        panelGraphics.roundRect(-348, -558, 696, 1116, 26);
        panelGraphics.stroke();

        this.makeLabel('LevelSelectionTitle', panel, 0, 505, 620, 58, '主线关卡 · 1–200', 34, GOLD);
        this.makeLabel('LevelSelectionEvidence', panel, 0, 457, 630, 42,
            '通关当前关后只解锁下一关；规则来自原包 TrunkInstanceModel', 17, CREAM);
        this.levelSelectionContentLayer = this.makeNode('LevelSelectionContent', panel, 0, 0, 660, 850);
        this.makeButton('LevelSelectionClose', panel, 0, -505, 230, 62, '返回布阵', () => this.closeLevelSelectionPanel());
        this.levelSelectionLayer.active = false;
    }

    private openLevelSelectionPanel(): void {
        if (this.phase !== 'deploy') {
            this.tipLabel.string = '只能在布阵阶段切换关卡';
            return;
        }
        profiler.hideStats();
        this.levelSelectPage = bagLikeLevelPageForId(this.levelId);
        this.renderLevelSelectionPanel();
        this.levelSelectionLayer.active = true;
        this.levelSelectionLayer.setSiblingIndex(this.node.children.length - 1);
    }

    private closeLevelSelectionPanel(): void {
        this.levelSelectionLayer.active = false;
        this.tipLabel.string = `当前关卡：第 ${bagLikeLevelNumber(this.levelId)} 关 ${this.levelName}`;
    }

    private renderLevelSelectionPanel(): void {
        for (const child of [...this.levelSelectionContentLayer.children]) {
            child.removeFromParent();
            child.destroy();
        }
        const maxPassed = this.accountProfile.maxPassedLevelId;
        const latestUnlocked = bagLikeLatestUnlockedLevel(maxPassed);
        const pageCount = bagLikeLevelPageCount();
        const pageIds = bagLikeLevelIdsForPage(this.levelSelectPage);
        this.makeLabel('LevelSelectionProgress', this.levelSelectionContentLayer, 0, 390, 620, 42,
            `已通关 ${Math.max(0, maxPassed - 1000)}/200 · 当前可挑战到第 ${bagLikeLevelNumber(latestUnlocked)} 关`,
            19, new Color(157, 213, 255, 255));

        pageIds.forEach((levelId, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            const level = this.levelCatalog.find((entry) => entry.id === levelId);
            if (!level) return;
            const passed = bagLikeLevelPassed(maxPassed, levelId);
            const unlocked = bagLikeLevelUnlocked(maxPassed, levelId);
            const current = levelId === this.levelId;
            const stateText = current ? '当前' : passed ? '已通关' : unlocked ? '可挑战' : '未解锁';
            const label = this.makeButton(
                `Level_${levelId}`,
                this.levelSelectionContentLayer,
                -240 + col * 160,
                278 - row * 130,
                146,
                108,
                `第 ${bagLikeLevelNumber(levelId)} 关\n${level.name}\n${stateText}`,
                () => this.navigateToLevel(levelId),
            );
            label.fontSize = 17;
            label.lineHeight = 22;
            const button = label.node.parent!.getComponent(Button)!;
            button.interactable = unlocked;
            const fill = current
                ? new Color(190, 139, 39, 255)
                : passed
                  ? new Color(43, 129, 86, 255)
                  : unlocked
                    ? new Color(42, 111, 173, 255)
                    : new Color(63, 69, 82, 255);
            const textColor = unlocked ? WHITE : new Color(145, 151, 164, 255);
            this.restyleButton(label, fill, textColor);
        });

        const previous = this.makeButton('LevelPagePrevious', this.levelSelectionContentLayer, -215, -395, 180, 58,
            '上一页', () => {
                this.levelSelectPage = Math.max(0, this.levelSelectPage - 1);
                this.renderLevelSelectionPanel();
            });
        previous.node.parent!.getComponent(Button)!.interactable = this.levelSelectPage > 0;
        previous.color = this.levelSelectPage > 0 ? WHITE : new Color(130, 135, 148, 255);
        this.makeLabel('LevelPageStatus', this.levelSelectionContentLayer, 0, -395, 180, 58,
            `${this.levelSelectPage + 1} / ${pageCount}`, 20, CREAM);
        const next = this.makeButton('LevelPageNext', this.levelSelectionContentLayer, 215, -395, 180, 58,
            '下一页', () => {
                this.levelSelectPage = Math.min(pageCount - 1, this.levelSelectPage + 1);
                this.renderLevelSelectionPanel();
            });
        next.node.parent!.getComponent(Button)!.interactable = this.levelSelectPage < pageCount - 1;
        next.color = this.levelSelectPage < pageCount - 1 ? WHITE : new Color(130, 135, 148, 255);
    }

    private navigateToLevel(levelId: number): void {
        if (!bagLikeLevelUnlocked(this.accountProfile.maxPassedLevelId, levelId)) {
            this.tipLabel.string = `第 ${bagLikeLevelNumber(levelId)} 关尚未解锁`;
            return;
        }
        if (levelId === this.levelId && this.initialized) {
            this.closeLevelSelectionPanel();
            return;
        }
        if (typeof window === 'undefined') {
            this.tipLabel.string = '当前运行环境不支持页面级关卡切换';
            return;
        }
        const debugFlag = this.accountDebugEnabled() ? '&accountDebug=1' : '';
        window.location.search = `?level=${levelId}${debugFlag}`;
    }

    private openAccountPanel(): void {
        if (this.phase !== 'deploy') {
            this.tipLabel.string = '账号星级只能在准备阶段调整';
            return;
        }
        profiler.hideStats();
        this.renderAccountPanel();
        this.accountLayer.active = true;
        this.accountLayer.setSiblingIndex(this.node.children.length - 1);
    }

    private closeAccountPanel(): void {
        this.accountLayer.active = false;
        this.tipLabel.string = '账号档案已保存；英雄升星和解锁从下次刷新生效';
        this.refreshUi();
    }

    private renderAccountPanel(): void {
        for (const child of [...this.accountContentLayer.children]) {
            child.removeFromParent();
            child.destroy();
        }
        const challengeTimes = bagLikeAccountChallengeTimes(this.accountProfile, this.levelId);
        const resourceSummary = `金币 ${this.accountProfile.gold}  体力 ${this.accountProfile.energy}  钻石 ${this.accountProfile.diamonds}  通关 ${this.accountProfile.maxPassedLevelId}`;

        this.makeLabel('ChallengeLabel', this.accountContentLayer, 0, 360, 620, 72,
            `${resourceSummary}\n当前关卡 ${this.levelId} · 第 ${challengeTimes} 次挑战`, 18, WHITE);
        this.makeLabel('AccountColumns', this.accountContentLayer, 0, 292, 620, 32,
            '英雄 / 解锁状态       星级       碎片          下一级消耗', 17, new Color(171, 188, 216, 255));

        BAGLIKE_ACCOUNT_HERO_FAMILIES.forEach((family, index) => {
            const star = this.accountProfile.stars[family];
            const y = 238 - index * 82;
            const unlocked = star > 0;
            const row = this.makeNode(`AccountHero_${family}`, this.accountContentLayer, 0, y, 630, 72);
            const rowGraphics = row.addComponent(Graphics);
            rowGraphics.fillColor = new Color(index % 2 === 0 ? 42 : 36, index % 2 === 0 ? 57 : 50, index % 2 === 0 ? 82 : 74, 235);
            rowGraphics.roundRect(-315, -36, 630, 72, 12);
            rowGraphics.fill();
            const unlockLevel = bagLikeHeroUnlockLevel(family);
            const heroText = unlocked
                ? `${family} ${ACCOUNT_HERO_NAMES[family]}`
                : `${family} 通关${unlockLevel}解锁`;
            this.makeLabel(`AccountName_${family}`, row, -226, 0, 176, 48, heroText, 17, unlocked ? WHITE : new Color(150, 155, 168, 255));
            this.makeLabel(`AccountStar_${family}`, row, -100, 0, 72, 44, unlocked ? `${star}星` : '未解锁', 19, unlocked ? GOLD : new Color(145, 145, 145, 255));
            const fragments = bagLikeAccountHeroFragments(this.accountProfile, family);
            const cost = unlocked ? bagLikeHeroUpgradeCost(star) : null;
            this.makeLabel(`AccountFragments_${family}`, row, -3, 0, 104, 44,
                `${fragments}${cost ? `/${cost.fragments}` : ''}`, 18, new Color(157, 213, 255, 255));
            const costText = !unlocked ? `需通关 ${unlockLevel}` : cost ? `${cost.gold} 金币` : '属性已满';
            this.makeLabel(`AccountCost_${family}`, row, 118, 0, 142, 44, costText, 17, CREAM);
            const upgradeLabel = this.makeButton(`AccountUpgrade_${family}`, row, 255, 0, 104, 48,
                !unlocked ? '锁定' : cost ? '升星' : '满星', () => this.upgradeAccountHero(family));
            if (!unlocked || !cost) this.restyleButton(upgradeLabel, new Color(74, 78, 88, 255), new Color(165, 165, 165, 255));
        });
    }

    private upgradeAccountHero(family: BagLikeAccountHeroFamily): void {
        const result = tryUpgradeBagLikeAccountHero(this.accountProfile, family);
        if (!result.upgraded) {
            const message = result.reason === 'locked'
                ? `请先通关 ${bagLikeHeroUnlockLevel(family)} 解锁 ${ACCOUNT_HERO_NAMES[family]}`
                : result.reason === 'maxStar'
                  ? `${ACCOUNT_HERO_NAMES[family]}已经达到 20 星`
                  : result.reason === 'fragments'
                    ? `${ACCOUNT_HERO_NAMES[family]}碎片不足，需要 ${result.cost?.fragments || 0}`
                    : `金币不足，需要 ${result.cost?.gold || 0}`;
            this.tipLabel.string = message;
            return;
        }
        this.accountProfile = result.profile;
        this.tipLabel.string = `${ACCOUNT_HERO_NAMES[family]}升至 ${this.accountProfile.stars[family]} 星`;
        this.applyAccountProfileChange();
    }

    private changeAccountChallengeTimes(delta: number): void {
        const current = bagLikeAccountChallengeTimes(this.accountProfile, this.levelId);
        this.accountProfile = setBagLikeAccountChallengeTimes(this.accountProfile, this.levelId, current + delta);
        this.applyAccountProfileChange();
    }

    private applyAccountStarPreset(star: number): void {
        this.accountProfile = setAllBagLikeAccountHeroStars(this.accountProfile, star);
        this.applyAccountProfileChange();
    }

    private resetAccountProfile(): void {
        this.accountProfile = cloneBagLikeAccountProfile(this.accountDefaultProfile);
        if (!bagLikeLevelUnlocked(this.accountProfile.maxPassedLevelId, this.levelId)) {
            this.persistAccountProfile(false);
            this.navigateToLevel(bagLikeLatestUnlockedLevel(this.accountProfile.maxPassedLevelId));
            return;
        }
        this.applyAccountProfileChange();
    }

    private applyAccountProfileChange(): void {
        this.persistAccountProfile(false);
        this.refreshPlacedWheelHomeHp();
        this.renderAccountPanel();
        this.refreshUi();
    }

    private applyPhaseLayout(): void {
        const layout = battlefieldLayoutForPhase(this.phase);
        this.battleLayer.setPosition(0, layout.battleY);
        this.battleLayer.getComponent(UITransform)!.setContentSize(DESIGN_WIDTH, layout.battleHeight);
        this.unitLayer.getComponent(UITransform)!.setContentSize(DESIGN_WIDTH, layout.battleHeight);
        const effectLayer = this.battleLayer.getChildByName('BattleEffects');
        effectLayer?.getComponent(UITransform)?.setContentSize(DESIGN_WIDTH, layout.battleHeight);

        this.gridOffsetY = layout.gridOffsetY;
        this.battleLayer.active = this.phase === 'battle' || this.phase === 'trait' || this.phase === 'roundClear';
        this.backpackBackground.setPosition(0, -150 + this.gridOffsetY);
        this.backpackPanel.setPosition(0, 51.5 + this.gridOffsetY);
        this.backpackHpBar.setPosition(0, 330 + this.gridOffsetY);
        this.gridLayer.setPosition(0, 0);
        for (const gear of this.gears) {
            const position = this.gridPosition(gear.row, gear.col);
            gear.node.setPosition(position.x, position.y);
        }

        this.candidateLayer.active = layout.showPreparationControls;
        this.tipLabel.node.active = false;
        this.adRefreshLabel.node.parent!.active = layout.showPreparationControls;
        this.refreshLabel.node.parent!.active = layout.showPreparationControls;
        this.actionLabel.node.parent!.active = layout.showPreparationControls;
        this.accountButtonLabel.node.parent!.active = layout.showPreparationControls
            && !this.traitValidationEnabled()
            && !this.developedValidationMode()
            && !this.fusionValidationMode();
        this.levelButtonLabel.node.parent!.active = this.accountButtonLabel.node.parent!.active;
        this.prepareLayer.active = layout.showBackpack;
        // BattleLayer becomes active only after start and can otherwise cover
        // the already-created HUD in the release renderer. Keep the original
        // BagLikeTopItem above battle/backpack, while modal overlays stay last.
        this.hudLayer.setSiblingIndex(this.node.children.length - 1);
        if (this.traitLayer.active) this.traitLayer.setSiblingIndex(this.node.children.length - 1);
        if (this.resultLayer.active) this.resultLayer.setSiblingIndex(this.node.children.length - 1);
        if (this.accountLayer.active) this.accountLayer.setSiblingIndex(this.node.children.length - 1);
        if (this.levelSelectionLayer.active) this.levelSelectionLayer.setSiblingIndex(this.node.children.length - 1);
        this.drawGrid();
    }

    private initGrid(): void {
        this.unlocked.clear();
        for (let row = 1; row <= 3; row += 1) {
            for (let col = 2; col <= 4; col += 1) this.unlocked.add(row * GRID_COLS + col);
        }
        this.drawGrid();
    }

    private drawGrid(): void {
        const g = this.gridGraphics;
        g.clear();
        for (const child of [...this.gridLayer.children]) child.destroy();
        for (let row = 0; row < GRID_ROWS; row += 1) {
            for (let col = 0; col < GRID_COLS; col += 1) {
                const index = row * GRID_COLS + col;
                const pos = this.gridPosition(row, col);
                const open = this.unlocked.has(index);
                if (!open) continue;
                const face = this.makeNode(`GridFace_${row}_${col}`, this.gridLayer, pos.x, pos.y, GRID_FACE_SIZE, GRID_FACE_SIZE);
                this.attachBagLikeAtlasSprite(face, BAGLIKE_ATLAS_FRAMES.gridOpen);
            }
        }
    }

    private onAction(): void {
        if (this.phase === 'deploy') {
            this.startRound();
        } else if (this.phase === 'won' || this.phase === 'lost') {
            this.restartLevel();
        }
    }

    private startRound(): void {
        if (!this.gears.some((gear) => GEARS[gear.id].unit)) {
            this.tipLabel.string = '先从候选栏拖入至少一个仓鼠英雄齿轮';
            return;
        }
        this.phase = 'battle';
        this.paused = false;
        this.applyRoundStartHomeHeal();
        this.clearCandidates();
        this.applyPhaseLayout();
        this.roundClock = 0;
        this.spawnIndex = 0;
        this.clearTimer = 0;
        this.pendingHits = [];
        this.productionJobs = [];
        this.battleRandom = createBattleSeedRandom();
        this.visualFixtureRandom = createBattleSeedRandom(1004);
        for (const gear of this.gears) {
            gear.workerPower = 0;
        }
        this.tipLabel.string = '供能核心开始转动；齿轮进度满 100 后才会出兵或释放塔技能';
    }

    private applyRoundStartHomeHeal(): void {
        const amount = traitRoundStartHomeHealBasisPoints(IMPLEMENTED_TRAIT_POOL, this.traitStacks);
        if (amount <= 0) return;
        const previousHp = this.selfHp;
        this.selfHp = resolveHomeHeal(this.selfHp, this.levelHomeHp, amount);
        const healed = this.selfHp - previousHp;
        if (healed > 0) this.addHealText(healed, -HOME_X + 20, -15);
        this.drawHomes();
    }

    private claimAccountRoundReward(roundNumber: number): void {
        if (this.claimedAccountRewardRounds.has(roundNumber)) return;
        const claim = claimBagLikeLevelRoundAccountReward(this.accountProfile, this.levelId, roundNumber, Math.random);
        if (!claim.reward) return;
        this.claimedAccountRewardRounds.add(roundNumber);
        this.accountRewardsThisAttempt.push(claim.reward);
        this.accountProfile = claim.profile;
        this.persistAccountProfile(false);
    }

    private accountAttemptRewardText(): string {
        const gold = this.accountRewardsThisAttempt.reduce((total, reward) => total + reward.gold, 0);
        const energy = this.accountRewardsThisAttempt.reduce((total, reward) => total + reward.energy, 0);
        const diamonds = this.accountRewardsThisAttempt.reduce((total, reward) => total + reward.diamonds, 0);
        const fragmentBoxes = this.accountRewardsThisAttempt.reduce((total, reward) => total + reward.fragmentBoxes, 0);
        const parts: string[] = [];
        if (gold > 0) parts.push(`金币 +${gold}`);
        if (energy > 0) parts.push(`体力 +${energy}`);
        if (diamonds > 0) parts.push(`钻石 +${diamonds}`);
        if (fragmentBoxes > 0) parts.push(`随机英雄碎片 +${fragmentBoxes}`);
        return parts.length > 0 ? parts.join('，') : '本次尚未到达账号奖励波次';
    }

    private restartLevel(): void {
        if (this.phase === 'won' || this.phase === 'lost') {
            this.accountProfile = incrementBagLikeAccountChallengeTimes(this.accountProfile, this.levelId);
            this.persistAccountProfile();
        }
        this.clearUnits();
        for (const gear of [...this.gears]) gear.node.destroy();
        for (const gear of [...this.candidates]) gear.node.destroy();
        this.gears = [];
        this.candidates = [];
        this.refreshPlacedWheelHomeHp();
        this.phase = 'deploy';
        this.roundIndex = 0;
        this.selfHp = this.levelHomeHp;
        this.gold = 0;
        this.refreshIndex = 0;
        this.normalRefreshTimes = 0;
        this.nonAdRefreshTimes = 0;
        this.freeRefreshUsed = false;
        this.bagLikeLevel = 1;
        this.bagLikeExp = 0;
        this.traitRerollsUsed = 0;
        this.traitTakeAllUsed = 0;
        this.currentTraitChoices = [];
        this.traitStacks.clear();
        this.warriorKillAttackStacks = 0;
        this.claimedAccountRewardRounds.clear();
        this.accountRewardsThisAttempt = [];
        this.accountUnlockedThisAttempt = [];
        this.h11SkillId = H11_BASE_SKILL_ID;
        this.h12SkillId = H12_BASE_SKILL_ID;
        this.h13SkillId = H13_BASE_SKILL_ID;
        this.initGrid();
        this.addPlacedGear('P01', 2, 3);
        this.dealPreparationBatch();
        this.tipLabel.string = '把候选仓鼠战士拖入背包后，再开始第 1 波';
        this.resultLayer.active = false;
        this.resultNextButtonLabel.node.parent!.active = false;
        this.traitLayer.active = false;
        this.applyPhaseLayout();
        this.drawExpBar();
    }

    private claimNextBatch(_free: boolean): void {
        if (this.phase !== 'deploy') return;
        const cost = this.normalRefreshTimes > 0 ? REFRESH_COST : 0;
        if (this.gold < cost) {
            this.tipLabel.string = `金币不足：本次刷新需要 ${cost}`;
            return;
        }
        this.gold -= cost;
        this.normalRefreshTimes += 1;
        this.replaceCandidates(this.nextCandidateBatch('normal'));
        this.tipLabel.string = cost === 0 ? '本局首次普通刷新免费；请手动拖动候选齿轮' : `已消耗 ${cost} 金币刷新；请手动摆放`;
    }

    private claimFreeBatch(): void {
        if (this.phase !== 'deploy') return;
        if (this.freeRefreshUsed) {
            this.tipLabel.string = '本准备回合的广告刷新已经使用';
            return;
        }
        this.freeRefreshUsed = true;
        this.replaceCandidates(this.nextCandidateBatch('ad'));
        this.tipLabel.string = '广告刷新完成；候选齿轮仍需手动拖入背包';
    }

    private dealPreparationBatch(): void {
        this.replaceCandidates(this.nextCandidateBatch('prepare'));
    }

    private nextCandidateBatch(refreshType: CandidateRefreshType): GearId[] {
        if (refreshType !== 'ad') this.nonAdRefreshTimes += 1;
        const useStatic = shouldUseStaticCandidateBatch(
            this.levelId,
            this.challengeTimes,
            this.refreshIndex,
            this.staticBatches.length,
        );
        const staticBatch = useStatic ? this.staticBatches[this.refreshIndex] : null;
        this.refreshIndex += 1;
        if (staticBatch) return [...staticBatch];

        const unlockedHeroFamilies = bagLikeAccountUnlockedHeroFamilies(this.accountProfile);
        const hasLockedGrid = this.unlocked.size < GRID_ROWS * GRID_COLS;
        return drawDynamicCandidateBatch(
            candidateDrawIds(refreshType, this.nonAdRefreshTimes, hasLockedGrid),
            {
                unlockedHeroFamilies,
                hasLockedGrid,
                placedGearIds: this.gears.map((gear) => gear.id).filter((id) => id !== 'P01'),
                nonAdRefreshTimes: this.nonAdRefreshTimes,
            },
            Math.random,
            candidateRewardModifiersForRefresh(
                refreshType,
                traitPrepareRewardWeightModifiers(IMPLEMENTED_TRAIT_POOL, this.traitStacks),
            ),
        );
    }

    private replaceCandidates(batch: GearId[]): void {
        for (const gear of this.candidates) {
            if (gear.node.isValid) gear.node.destroy();
        }
        const renderableBatch = batch.filter((id) => {
            const supported = Object.prototype.hasOwnProperty.call(GEARS, id);
            if (!supported) console.error(`[cangshu] skipped unsupported candidate gear: ${String(id)}`);
            return supported;
        });
        this.candidates = renderableBatch.map((id, index) => this.createGear(id, -1, -1, 'candidate', index));
        this.relayoutCandidates();
    }

    private clearCandidates(): void {
        for (const gear of this.candidates) {
            if (gear.node.isValid) gear.node.destroy();
        }
        this.candidates = [];
    }

    private relayoutCandidates(): void {
        const layout = candidateTrayLayout(
            this.candidates.map((gear) => this.gearFootprint(gear.id)),
            GRID_CELL,
            12,
            CANDIDATE_TRAY_WIDTH,
        );
        this.candidates.forEach((gear, index) => {
            gear.candidateIndex = index;
            const placement = layout[index];
            gear.node.setScale(placement.scale, placement.scale, 1);
            gear.node.setPosition(placement.x, DEPLOY_CANDIDATE_Y + placement.y);
        });
    }

    private addPlacedGear(id: GearId, row: number, col: number): Gear {
        const gear = this.createGear(id, row, col, 'grid', -1);
        this.gears.push(gear);
        this.refreshPlacedWheelHomeHp();
        return gear;
    }

    private refreshPlacedWheelHomeHp(): void {
        const previousMaxHp = this.levelHomeHp;
        const wheelHp = bagLikeWheelHomeHpContribution(
            this.gears.map((gear) => gear.id),
            this.currentHeroStars(),
        );
        const nextMaxHp = this.baseLevelHomeHp + wheelHp;
        if (nextMaxHp === previousMaxHp) return;
        const previousRatio = previousMaxHp > 0 ? this.selfHp / previousMaxHp : 1;
        this.levelHomeHp = nextMaxHp;
        this.selfHp = Math.floor(nextMaxHp * Math.max(0, Math.min(1, previousRatio)));
        this.drawHomes();
    }

    private createGear(id: GearId, row: number, col: number, location: GearLocation, candidateIndex: number): Gear {
        const pos = location === 'grid' ? this.gridPosition(row, col) : { x: 0, y: DEPLOY_CANDIDATE_Y };
        const node = this.makeNode(`Gear_${id}_${this.serial}`, this.prepareLayer, pos.x, pos.y, GRID_CELL, GRID_CELL);
        node.addComponent(Graphics);
        const gear: Gear = { uid: ++this.serial, id, row, col, node, workerPower: 0, location, candidateIndex };
        this.renderGear(gear);
        if (id !== 'P01') {
            node.on(Node.EventType.TOUCH_START, (event: EventTouch) => this.beginGearDrag(gear, event), this);
            node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => this.moveGearDrag(gear, event), this);
            node.on(Node.EventType.TOUCH_END, (event: EventTouch) => this.endGearDrag(gear, event), this);
            node.on(Node.EventType.TOUCH_CANCEL, () => this.cancelGearDrag(gear), this);
        }
        return gear;
    }

    private gearFootprint(id: GearId): { rows: number; columns: number } {
        const shape = GEARS[id].shape;
        return {
            rows: Math.max(...shape.map(([row]) => row)) + 1,
            columns: Math.max(...shape.map(([, col]) => col)) + 1,
        };
    }

    private renderGear(gear: Gear): void {
        const config = GEARS[gear.id];
        const footprint = this.gearFootprint(gear.id);
        const transform = gear.node.getComponent(UITransform)!;
        transform.setContentSize(footprint.columns * GRID_CELL, footprint.rows * GRID_CELL);
        transform.setAnchorPoint(0.5 / footprint.columns, 1 - 0.5 / footprint.rows);
        gear.node.name = `Gear_${gear.id}_${gear.uid}`;
        for (const child of [...gear.node.children]) child.destroy();

        const g = gear.node.getComponent(Graphics)!;
        g.clear();
        const bodyColor = bagLikeGearBodyColor(config.level, [config.tint.r, config.tint.g, config.tint.b]);
        if (config.level && config.shape.length > 1) {
            this.attachGearConnectorSprite(gear.node, config.shape, new Color(bodyColor[0], bodyColor[1], bodyColor[2], 255));
        }
        for (const [shapeRow, shapeCol] of config.shape) {
            const cellX = shapeCol * GRID_CELL;
            const cellY = -shapeRow * GRID_CELL;
            g.fillColor = new Color(bodyColor[0], bodyColor[1], bodyColor[2], 245);
            g.roundRect(cellX - 42, cellY - 42, 84, 84, 16);
            g.fill();
            g.strokeColor = CREAM;
            g.lineWidth = 4;
            g.roundRect(cellX - 42, cellY - 42, 84, 84, 16);
            g.stroke();
            g.strokeColor = new Color(255, 255, 255, 135);
            g.lineWidth = 2;
            g.circle(cellX, cellY, 25);
            g.stroke();
            if (config.level) this.attachGearBodySprite(gear.node, config.level, cellX, cellY);
        }
        if ((config.level || 0) >= 5) this.attachLevelFiveShapeOverlay(gear.node, config.shape);
        const headKey = this.gearHeadKey(gear.id);
        if (headKey) {
            const portraitX = (footprint.columns - 1) * GRID_CELL * 0.5;
            const portraitY = -(footprint.rows - 1) * GRID_CELL * 0.5 + 3;
            this.attachGearPortrait(gear, headKey, portraitX, portraitY);
        } else {
            const fallbackX = (footprint.columns - 1) * GRID_CELL * 0.5;
            const fallbackY = -(footprint.rows - 1) * GRID_CELL * 0.5 + 6;
            this.makeLabel('GearFallback', gear.node, fallbackX, fallbackY, 64, 30, gear.id.startsWith('G') ? '格' : '★', 21, WHITE);
        }
        if (config.powerPerTrigger) {
            const productionRate = this.productionRateForGear(gear).toFixed(2);
            const labelX = (footprint.columns - 1) * GRID_CELL * 0.5;
            const labelY = -(footprint.rows - 1) * GRID_CELL - 55;
            g.fillColor = new Color(40, 48, 82, 245);
            g.roundRect(labelX - 43, labelY - 12, 86, 24, 7);
            g.fill();
            g.strokeColor = CREAM;
            g.lineWidth = 2;
            g.roundRect(labelX - 43, labelY - 12, 86, 24, 7);
            g.stroke();
            this.makeLabel('ProductionRate', gear.node, labelX, labelY, 82, 22, `${productionRate}/s`, 14, CREAM);
        }
    }

    private gearHeadKey(id: GearId): string | null {
        if (id.startsWith('C')) return 'coin';
        if (id.startsWith('H11')) return 'H1101';
        if (id.startsWith('H12')) return 'H1201';
        if (id.startsWith('H13')) return 'H1301';
        return HERO_SMALL_HEAD_FRAMES[id] ? id : null;
    }

    private attachStaticGearPortrait(parent: Node, headKey: string, x: number, y: number): void {
        const frameData = HERO_SMALL_HEAD_FRAMES[headKey];
        if (!frameData) {
            console.error(`[visual-catalog] missing recovered head frame ${headKey}`);
            return;
        }
        const portraitNode = this.makeNode(`StaticGearPortrait_${headKey}`, parent, x, y, 90, 90);
        resources.load('original/heroSmallHead/spriteFrame', SpriteFrame, (error, atlasFrame) => {
            if (error || !portraitNode.isValid) {
                console.error(`[visual-catalog] head atlas failed ${headKey}: ${error?.message || 'invalid node'}`);
                return;
            }
            const frame = new SpriteFrame();
            frame.reset({
                texture: atlasFrame.texture,
                rect: new Rect(frameData.x, frameData.y, frameData.width, frameData.height),
                originalSize: new Size(90, 90),
                offset: new Vec2(frameData.offsetX, frameData.offsetY),
            });
            const sprite = portraitNode.addComponent(Sprite);
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            sprite.spriteFrame = frame;
        });
    }

    private attachGearPortrait(gear: Gear, headKey: string, x: number, y: number): void {
        const frameData = HERO_SMALL_HEAD_FRAMES[headKey];
        if (!frameData) return;
        const portraitNode = this.makeNode(`GearPortrait_${headKey}`, gear.node, x, y, 90, 90);
        const fillNode = this.makeNode('WorkerProgressFill', portraitNode, 0, 0, 90, 90);
        resources.load('original/heroSmallHead/spriteFrame', SpriteFrame, (error, atlasFrame) => {
            if (error || !portraitNode.isValid) return;
            const frame = new SpriteFrame();
            frame.reset({
                texture: atlasFrame.texture,
                rect: new Rect(frameData.x, frameData.y, frameData.width, frameData.height),
                originalSize: new Size(90, 90),
                offset: new Vec2(frameData.offsetX, frameData.offsetY),
            });
            const background = portraitNode.addComponent(Sprite);
            background.sizeMode = Sprite.SizeMode.CUSTOM;
            background.color = new Color(56, 60, 68, 255);
            background.spriteFrame = frame;

            if (!fillNode.isValid) return;
            const fill = fillNode.addComponent(Sprite);
            // BarFilled.updateUVs needs a valid frame as soon as the sprite switches to
            // FILLED. Binding the recovered portrait first avoids a null texture rect.
            fill.spriteFrame = frame;
            fill.sizeMode = Sprite.SizeMode.CUSTOM;
            fill.type = Sprite.Type.FILLED;
            fill.fillType = Sprite.FillType.VERTICAL;
            fill.fillStart = 0;
            fill.fillRange = this.workerProgressRatio(gear);
        });
    }

    private attachGearBodySprite(parent: Node, level: number, x: number, y: number): void {
        const rect = GEAR_BODY_FRAMES[level];
        if (!rect) return;
        const bodyNode = this.makeNode(`GearBody_cl${level}`, parent, x, y, 110, 110);
        bodyNode.setSiblingIndex(0);
        resources.load('original/bagLike_0/spriteFrame', SpriteFrame, (error, atlasFrame) => {
            if (error || !bodyNode.isValid) return;
            const frame = new SpriteFrame();
            frame.reset({
                texture: atlasFrame.texture,
                rect,
                originalSize: new Size(110, 110),
                offset: Vec2.ZERO,
            });
            const sprite = bodyNode.addComponent(Sprite);
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            sprite.spriteFrame = frame;
        });
    }

    private attachBagLikeAtlasSprite(node: Node, spec: BagLikeAtlasFrame): void {
        this.attachRecoveredAtlasSprite(node, 'original/bagLike_0/spriteFrame', spec);
    }

    private attachGearConnectorSprite(
        parent: Node,
        shape: readonly (readonly [number, number])[],
        tint: Color,
    ): void {
        const footprintRows = Math.max(...shape.map(([row]) => row)) + 1;
        const footprintColumns = Math.max(...shape.map(([, column]) => column)) + 1;
        let spec: BagLikeAtlasFrame;
        let angle = 0;
        if (shape.length === 2) {
            spec = BAGLIKE_ATLAS_FRAMES.connectorTwo;
            angle = footprintRows === 2 ? 90 : 0;
        } else if (shape.length === 3 && (footprintRows === 1 || footprintColumns === 1)) {
            spec = BAGLIKE_ATLAS_FRAMES.connectorThree;
            angle = footprintColumns === 3 ? 90 : 0;
        } else if (shape.length === 3) {
            spec = BAGLIKE_ATLAS_FRAMES.connectorL;
            const occupied = new Set(shape.map(([row, column]) => `${row},${column}`));
            if (!occupied.has('0,1')) angle = -90;
            else if (!occupied.has('1,1')) angle = 0;
            else if (!occupied.has('0,0')) angle = 180;
            else angle = 90;
        } else {
            spec = BAGLIKE_ATLAS_FRAMES.connectorSquare;
        }
        const centreX = (footprintColumns - 1) * GRID_CELL * 0.5;
        const centreY = -(footprintRows - 1) * GRID_CELL * 0.5;
        const connector = this.makeNode(
            'OriginalGearConnector',
            parent,
            centreX,
            centreY,
            spec.sourceSize.width,
            spec.sourceSize.height,
        );
        connector.angle = angle;
        connector.setSiblingIndex(0);
        this.attachRecoveredAtlasSprite(connector, 'original/bagLike_0/spriteFrame', spec, tint);
    }

    private attachLevelFiveShapeOverlay(
        parent: Node,
        shape: readonly (readonly [number, number])[],
    ): void {
        const footprintRows = Math.max(...shape.map(([row]) => row)) + 1;
        const footprintColumns = Math.max(...shape.map(([, column]) => column)) + 1;
        let resourcePath = '';
        let angle = 0;
        if (shape.length === 2) {
            resourcePath = 'spine/UI10020/chilun_hongse_2';
            angle = footprintRows === 2 ? 90 : 0;
        } else if (shape.length === 3 && footprintRows === 2 && footprintColumns === 2) {
            resourcePath = 'spine/UI10021/chilun_hongse_3';
            const occupied = new Set(shape.map(([row, column]) => `${row},${column}`));
            if (!occupied.has('0,1')) angle = -90;
            else if (!occupied.has('1,1')) angle = 0;
            else if (!occupied.has('0,0')) angle = 180;
            else angle = 90;
        } else if (shape.length === 4 && footprintRows === 2 && footprintColumns === 2) {
            resourcePath = 'spine/UI10022/chilun_hongse_4';
        }
        if (!resourcePath) return;

        const centreX = (footprintColumns - 1) * GRID_CELL * 0.5;
        const centreY = -(footprintRows - 1) * GRID_CELL * 0.5;
        const overlay = this.makeNode('OriginalLevelFiveShapeOverlay', parent, centreX, centreY, 200, 200);
        overlay.angle = angle;
        resources.load(resourcePath, sp.SkeletonData, (error, data) => {
            if (error || !overlay.isValid) return;
            const skeleton = overlay.addComponent(sp.Skeleton);
            skeleton.skeletonData = data;
            skeleton.premultipliedAlpha = false;
            try {
                if (skeleton.findAnimation('idle')) skeleton.setAnimation(0, 'idle', true);
            } catch {
                // The recovered 3.8.99 data is still rendered if a reduced runtime
                // does not expose animation lookup during an import refresh.
            }
        });
    }

    private attachRecoveredAtlasSprite(
        node: Node,
        resourcePath: string,
        spec: BagLikeAtlasFrame,
        tint?: Color,
    ): void {
        const transform = node.getComponent(UITransform)!;
        const targetWidth = transform.contentSize.width;
        const targetHeight = transform.contentSize.height;
        resources.load(resourcePath, SpriteFrame, (error, atlasFrame) => {
            if (error || !node.isValid) return;
            const frame = new SpriteFrame();
            frame.reset({
                texture: atlasFrame.texture,
                rect: spec.rect,
                originalSize: spec.sourceSize,
                offset: spec.offset ? new Vec2(spec.offset[0], spec.offset[1]) : Vec2.ZERO,
            });
            if (spec.insets) {
                frame.insetLeft = spec.insets[0];
                frame.insetTop = spec.insets[1];
                frame.insetRight = spec.insets[2];
                frame.insetBottom = spec.insets[3];
            }
            const sprite = node.addComponent(Sprite);
            sprite.spriteFrame = frame;
            sprite.type = spec.insets ? Sprite.Type.SLICED : Sprite.Type.SIMPLE;
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            if (tint) sprite.color = tint;
            // Assigning a cropped frame can restore its source size in the same
            // tick. Reapply the recovered FairyGUI target size afterwards.
            transform.setContentSize(targetWidth, targetHeight);
        });
    }

    private preloadH02Projectile(): void {
        resources.load('original/js_sheshou_zidan/spriteFrame', SpriteFrame, (error, sourceFrame) => {
            if (error || !sourceFrame) return;
            const frame = new SpriteFrame();
            frame.reset({
                texture: sourceFrame.texture,
                rect: new Rect(1, 1, 72, 48),
                originalSize: new Size(72, 48),
                offset: Vec2.ZERO,
            });
            this.h02ProjectileFrame = frame;
        });
    }

    private addH02Projectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay = 0,
    ): void {
        if (!this.h02ProjectileFrame || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H29_S1', this.effectLayer, fromX, fromY, 72, 48);
        node.getComponent(UITransform)!.setAnchorPoint(0.5, 0.2);
        node.setScale(-1, 1, 1);
        node.active = delay <= 0;
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.h02ProjectileFrame;
        this.projectileVisuals.push({
            node,
            delay,
            elapsed: 0,
            duration: Math.max(duration, 0.001),
            fromX,
            fromY,
            toX,
            toY,
        });
    }

    private preloadH0204Projectile(): void {
        resources.load('original/js_sheshou_lanqiu/spriteFrame', SpriteFrame, (error, sourceFrame) => {
            if (error || !sourceFrame) return;
            const frame = new SpriteFrame();
            frame.reset({
                texture: sourceFrame.texture,
                rect: new Rect(1, 1, 41, 41),
                originalSize: new Size(43, 43),
                offset: Vec2.ZERO,
            });
            this.h0204ProjectileFrame = frame;
        });
    }

    private addH0204Projectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay = 0,
    ): void {
        if (!this.h0204ProjectileFrame || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H29_S2', this.effectLayer, fromX, fromY, 43, 43);
        node.getComponent(UITransform)!.setAnchorPoint(0.5, 0.2);
        node.active = delay <= 0;
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.h0204ProjectileFrame;
        this.projectileVisuals.push({
            node,
            delay,
            elapsed: 0,
            duration: Math.max(duration, 0.001),
            fromX,
            fromY,
            toX,
            toY,
        });
    }

    private preloadH03Projectile(): void {
        resources.load('spine/H03Projectile/zidan', sp.SkeletonData, (error, data) => {
            if (!error && data) this.h03ProjectileData = data;
        });
    }

    private preloadH03StatusEffects(): void {
        this.h03StatusAudioSource = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
        resources.load('spine/H03Freeze/hit_binkuai', sp.SkeletonData, (error, data) => {
            if (!error && data) this.h03FreezeData = data;
        });
        resources.load('spine/H03Transform/hit_lizi', sp.SkeletonData, (error, data) => {
            if (!error && data) this.h03TransformData = data;
        });
        resources.load('original/skill_bianxing', AudioClip, (error, clip) => {
            if (!error && clip) this.h03TransformAudio = clip;
        });
        resources.load('original/skill_bingfeng', AudioClip, (error, clip) => {
            if (!error && clip) this.h03FreezeAudio = clip;
        });
    }

    private addH03FreezeEffect(target: BattleUnit): void {
        if (!this.h03FreezeData || !target.node?.isValid) return;
        const previous = target.node.getChildByName('H28_S1');
        if (previous?.isValid) previous.destroy();
        const node = this.makeNode('H28_S1', target.node, 0, 0, 100, 100);
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.h03FreezeData;
        skeleton.setAnimation(0, 'idle', true);
        this.scheduleOnce(() => {
            if (node.isValid) node.destroy();
        }, 3);
    }

    private addH03TransformEffect(target: BattleUnit): void {
        if (!this.h03TransformData || !target.node?.isValid) return;
        const node = this.makeNode('H28_S2', target.node, 0, 0, 100, 100);
        node.setScale(0.5, 0.5, 1);
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.h03TransformData;
        skeleton.setCompleteListener(() => {
            if (node.isValid) node.destroy();
        });
        skeleton.setAnimation(0, 'hit', false);
    }

    private playH03StatusAudio(clip: AudioClip | null): void {
        if (this.h03StatusAudioSource && clip) this.h03StatusAudioSource.playOneShot(clip, 1);
    }

    private preloadH03LaserAudio(): void {
        this.h03LaserAudioSource = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
        resources.load('original/skill_jiguang', AudioClip, (error, clip) => {
            if (!error && clip) this.h03LaserAudio = clip;
        });
    }

    private playH03LaserAudio(): void {
        if (this.h03LaserAudioSource && this.h03LaserAudio) {
            this.h03LaserAudioSource.playOneShot(this.h03LaserAudio, 1);
        }
    }

    private preloadH11Healing(): void {
        resources.load('spine/H11Healing/skill01_hit_upper', sp.SkeletonData, (error, data) => {
            if (!error && data) this.h11HealingData = data;
        });
    }

    private addH11HealingEffect(x: number, y: number): void {
        if (!this.h11HealingData || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H11_S1', this.effectLayer, x, y, 230, 220);
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.h11HealingData;
        skeleton.setCompleteListener(() => {
            if (node.isValid) node.destroy();
        });
        skeleton.setAnimation(0, 'skill01_hit_upper', false);
    }

    private preloadH12Skill(): void {
        this.h12AudioSource = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
        resources.load('spine/H12Lightning/chilun_leiyun', sp.SkeletonData, (error, data) => {
            if (!error && data) this.h12SkillData = data;
        });
        resources.load('original/bullet_leiyun', AudioClip, (error, clip) => {
            if (!error && clip) this.h12HitAudio = clip;
        });
    }

    private addH12SkillEffect(x: number, y: number): void {
        if (!this.h12SkillData || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H12_S1', this.effectLayer, x, y, 697, 589);
        node.setScale(0.8, 0.8, 1);
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.h12SkillData;
        skeleton.setCompleteListener(() => {
            if (node.isValid) node.destroy();
        });
        skeleton.setAnimation(0, 'attack', false);
    }

    private playH12HitAudio(): void {
        if (this.h12AudioSource && this.h12HitAudio) this.h12AudioSource.playOneShot(this.h12HitAudio, 1);
    }

    private preloadMeleeAttackAudio(): void {
        this.meleeAttackAudioSource = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
        resources.load('original/skill_jijian', AudioClip, (error, clip) => {
            if (!error && clip) this.h01AttackAudio = clip;
        });
        resources.load('original/skill_zhuangji', AudioClip, (error, clip) => {
            if (!error && clip) this.h04AttackAudio = clip;
        });
    }

    private playMeleeAttackAudio(unit: BattleUnit): void {
        if (!this.meleeAttackAudioSource) return;
        const clip = unit.cfg.id === 'H0101'
            ? this.h01AttackAudio
            : unit.cfg.id === 'H0401'
              ? this.h04AttackAudio
              : null;
        if (clip) this.meleeAttackAudioSource.playOneShot(clip, 1);
    }

    private preloadH13Projectile(): void {
        resources.load('original/baomihuali/spriteFrame', SpriteFrame, (error, sourceFrame) => {
            if (error || !sourceFrame) return;
            const frame = new SpriteFrame();
            frame.reset({
                texture: sourceFrame.texture,
                rect: new Rect(1, 1, 24, 27),
                originalSize: new Size(24, 27),
                offset: Vec2.ZERO,
            });
            this.h13ProjectileFrame = frame;
        });
    }

    private addH13Projectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay = 0,
    ): void {
        if (!this.h13ProjectileFrame || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H25_S1', this.effectLayer, fromX, fromY, 24, 27);
        node.getComponent(UITransform)!.setAnchorPoint(0.5, 0.5);
        node.setScale(1.5, 1.5, 1);
        node.active = delay <= 0;
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.h13ProjectileFrame;
        this.projectileVisuals.push({
            node,
            delay,
            elapsed: 0,
            duration: Math.max(duration, 0.001),
            fromX,
            fromY,
            toX,
            toY,
        });
    }

    private addH03Projectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay = 0,
    ): void {
        if (!this.h03ProjectileData || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H13_S1', this.effectLayer, fromX, fromY, 40, 40);
        node.active = delay <= 0;
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.h03ProjectileData;
        skeleton.setAnimation(0, 'idle', true);
        this.projectileVisuals.push({
            node,
            delay,
            elapsed: 0,
            duration: Math.max(duration, 0.001),
            fromX,
            fromY,
            toX,
            toY,
        });
    }

    private preloadH08Impact(): void {
        resources.load('original/js_aoteman_hill/spriteFrame', SpriteFrame, (error, sourceFrame) => {
            if (error || !sourceFrame) return;
            const specs = [
                { rect: new Rect(967, 1, 108, 151), offset: new Vec2(1, 1) },
                { rect: new Rect(595, 1, 168, 175), offset: new Vec2(0, -8) },
                { rect: new Rect(765, 1, 200, 173), offset: new Vec2(0, -1) },
                { rect: new Rect(1, 1, 196, 193), offset: new Vec2(1, 1) },
                { rect: new Rect(199, 1, 196, 181), offset: new Vec2(1, 1) },
                { rect: new Rect(397, 1, 196, 175), offset: new Vec2(1, 1) },
            ];
            this.h08HitFrames = specs.map((spec) => {
                const frame = new SpriteFrame();
                frame.reset({
                    texture: sourceFrame.texture,
                    rect: spec.rect,
                    originalSize: new Size(202, 201),
                    offset: spec.offset,
                });
                return frame;
            });
        });
    }

    private preloadH0705Impact(): void {
        resources.load('original/js_gangtiexia_hill_baozha/spriteFrame', SpriteFrame, (error, sourceFrame) => {
            if (error || !sourceFrame) return;
            const specs = [
                { rect: new Rect(6, 1, 58, 50), offset: new Vec2(11, -15) },
                { rect: new Rect(1, 65, 106, 84), offset: new Vec2(8, -14) },
                { rect: new Rect(1, 239, 110, 110), offset: new Vec2(6, 0) },
                { rect: new Rect(1, 151, 112, 86), offset: new Vec2(6, -6) },
                { rect: new Rect(66, 1, 32, 62), offset: new Vec2(16, -12) },
                { rect: new Rect(1, 1, 3, 3), offset: new Vec2(-91.5, 91.5) },
            ];
            this.h0705HitFrames = specs.map((spec) => {
                const frame = new SpriteFrame();
                frame.reset({
                    texture: sourceFrame.texture,
                    rect: spec.rect,
                    originalSize: new Size(186, 186),
                    offset: spec.offset,
                });
                return frame;
            });
        });
    }

    private addH0705Impact(x: number, y: number): void {
        if (this.h0705HitFrames.length === 0 || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H22_S1_LOWER', this.effectLayer, x, y, 186, 186);
        node.getComponent(UITransform)!.setAnchorPoint(0.3, 0.2);
        node.setScale(0.8, 0.8, 1);
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.h0705HitFrames[0];
        this.hitEffectVisuals.push({
            node,
            sprite,
            frames: this.h0705HitFrames,
            frameSeconds: INFERRED_EFFECT_FRAME_SECONDS,
            elapsed: 0,
        });
    }

    private addH08Impact(x: number, y: number): void {
        if (this.h08HitFrames.length === 0 || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H21_S1_LOWER', this.effectLayer, x, y, 202, 201);
        node.getComponent(UITransform)!.setAnchorPoint(0.5, 0.5);
        node.setScale(1.5, 1.5, 1);
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.h08HitFrames[0];
        this.hitEffectVisuals.push({
            node,
            sprite,
            frames: this.h08HitFrames,
            frameSeconds: INFERRED_EFFECT_FRAME_SECONDS,
            elapsed: 0,
        });
    }

    private preloadH0905Effects(): void {
        this.h0905AudioSource = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
        resources.load('original/js_zhanche_dandao/spriteFrame', SpriteFrame, (error, sourceFrame) => {
            if (error || !sourceFrame) return;
            const frame = new SpriteFrame();
            frame.reset({
                texture: sourceFrame.texture,
                rect: new Rect(1, 1, 109, 20),
                originalSize: new Size(109, 20),
                offset: Vec2.ZERO,
            });
            this.h0905ProjectileFrame = frame;
        });
        resources.load('original/js_zhanche_hill/spriteFrame', SpriteFrame, (error, sourceFrame) => {
            if (error || !sourceFrame) return;
            const specs = [
                { rect: new Rect(1, 1, 106, 76), offset: new Vec2(-11, -41) },
                { rect: new Rect(1, 195, 92, 110), offset: new Vec2(7, -25) },
                { rect: new Rect(1, 79, 92, 114), offset: new Vec2(-10, -26) },
            ];
            this.h0905HitFrames = specs.map((spec) => {
                const frame = new SpriteFrame();
                frame.reset({
                    texture: sourceFrame.texture,
                    rect: spec.rect,
                    originalSize: new Size(200, 200),
                    offset: spec.offset,
                });
                return frame;
            });
        });
        resources.load('original/bullet_zhanche', AudioClip, (error, clip) => {
            if (!error && clip) this.h0905HitAudio = clip;
        });
    }

    private addH0905Projectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay = 0,
    ): void {
        if (!this.h0905ProjectileFrame || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H24_S1', this.effectLayer, fromX, fromY, 109, 20);
        node.getComponent(UITransform)!.setAnchorPoint(0.5, 0.2);
        node.setScale(0.7, 0.7, 1);
        node.angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        node.active = delay <= 0;
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.h0905ProjectileFrame;
        this.projectileVisuals.push({
            node,
            delay,
            elapsed: 0,
            duration: Math.max(duration, 0.001),
            fromX,
            fromY,
            toX,
            toY,
        });
    }

    private addH0905Impact(x: number, y: number): void {
        if (this.h0905HitFrames.length > 0 && this.effectLayer?.isValid) {
            const node = this.makeNode('H24_S1_LOWER', this.effectLayer, x, y, 200, 200);
            node.getComponent(UITransform)!.setAnchorPoint(0.4, 0.3);
            const sprite = node.addComponent(Sprite);
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            sprite.spriteFrame = this.h0905HitFrames[0];
            this.hitEffectVisuals.push({
                node,
                sprite,
                frames: this.h0905HitFrames,
                frameSeconds: INFERRED_EFFECT_FRAME_SECONDS,
                elapsed: 0,
            });
        }
        if (this.h0905AudioSource && this.h0905HitAudio) {
            this.h0905AudioSource.playOneShot(this.h0905HitAudio, 1);
        }
    }

    private applyCommButtonSkin(label: Label, spec: BagLikeAtlasFrame): void {
        const buttonNode = label.node.parent!;
        buttonNode.getComponent(Graphics)?.clear();
        const size = buttonNode.getComponent(UITransform)!.contentSize;
        const skin = this.makeNode(`${buttonNode.name}OriginalSkin`, buttonNode, 0, 0, size.width, size.height);
        skin.setSiblingIndex(0);
        this.attachRecoveredAtlasSprite(skin, 'original/comm_0/spriteFrame', spec);
    }

    private addTraitVideoIcon(label: Label): void {
        const buttonNode = label.node.parent!;
        const icon = this.makeNode(`${buttonNode.name}VideoIcon`, buttonNode, -76, 0, 52, 52);
        this.attachRecoveredAtlasSprite(icon, 'original/comm_0/spriteFrame', COMM_ATLAS_FRAMES.videoIcon);
        label.node.setPosition(20, 0);
        label.node.getComponent(UITransform)!.setContentSize(178, 82);
        label.fontSize = 24;
    }

    private makeTraitCountLabel(name: string, parent: Node): RichText {
        const node = this.makeNode(name, parent, 0, 68, 250, 34);
        const label = node.addComponent(RichText);
        if (this.originalFont) label.font = this.originalFont;
        label.fontSize = 20;
        label.lineHeight = 26;
        label.maxWidth = 250;
        label.fontColor = WHITE;
        label.horizontalAlign = HorizontalTextAlignment.CENTER;
        return label;
    }

    private workerProgressRatio(gear: Gear): number {
        if (this.phase !== 'battle' || gear.location !== 'grid' || !GEARS[gear.id].powerPerTrigger) return 1;
        return Math.max(0, Math.min(1, gear.workerPower / 100));
    }

    private beginGearDrag(gear: Gear, _event: EventTouch): void {
        if (this.phase !== 'deploy') return;
        this.dragGear = gear;
        this.dragOrigin = {
            row: gear.row,
            col: gear.col,
            x: gear.node.position.x,
            y: gear.node.position.y,
            scale: gear.node.scale.x,
            location: gear.location,
        };
        gear.node.setSiblingIndex(this.prepareLayer.children.length - 1);
        gear.node.setScale(1.05, 1.05, 1);
    }

    private moveGearDrag(gear: Gear, event: EventTouch): void {
        if (this.dragGear !== gear || this.phase !== 'deploy') return;
        const p = event.getUILocation();
        const local = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(p.x, p.y, 0));
        gear.node.setPosition(local.x, local.y);
    }

    private endGearDrag(gear: Gear, event: EventTouch): void {
        if (this.dragGear !== gear) return;
        const p = event.getUILocation();
        const local = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(p.x, p.y, 0));
        const cell = this.positionToGrid(local.x, local.y);
        const config = GEARS[gear.id];
        const mergeTarget = this.findMergeTarget(gear, local.x, local.y);
        if (mergeTarget && this.mergeGears(gear, mergeTarget)) {
            this.dragGear = null;
            return;
        }
        if (cell && config.gridUnlock && gear.location === 'candidate' && this.canUnlockShape(gear.id, cell.row, cell.col)) {
            for (const [row, col] of this.gearCellsAt(gear.id, cell.row, cell.col)) this.unlocked.add(row * GRID_COLS + col);
            this.candidates = this.candidates.filter((item) => item !== gear);
            gear.node.destroy();
            this.drawGrid();
            this.relayoutCandidates();
            this.tipLabel.string = `${config.name}已生效：新格子已解锁`;
            this.dragGear = null;
            return;
        }
        if (cell && !config.gridUnlock && this.canPlaceGear(gear.id, cell.row, cell.col)) {
            const displaced = this.displacedGearsAt(gear, cell.row, cell.col);
            this.returnGearsToCandidates(displaced);
            gear.row = cell.row;
            gear.col = cell.col;
            if (gear.location === 'candidate') {
                this.candidates = this.candidates.filter((item) => item !== gear);
                this.gears.push(gear);
                gear.location = 'grid';
                gear.candidateIndex = -1;
                this.refreshPlacedWheelHomeHp();
                this.relayoutCandidates();
            }
            const target = this.gridPosition(gear.row, gear.col);
            gear.node.setPosition(target.x, target.y);
            gear.node.setScale(1, 1, 1);
            this.relayoutCandidates();
            this.tipLabel.string = displaced.length
                ? `${config.name}已替换 ${displaced.length} 个旧齿轮；旧齿轮已退回候选栏`
                : `${config.name}已手动摆入背包`;
        } else if (gear.location === 'grid') {
            this.returnGearsToCandidates([gear]);
            this.tipLabel.string = `${config.name}已从背包取下并退回候选栏`;
        } else {
            gear.node.setPosition(this.dragOrigin.x, this.dragOrigin.y);
            this.tipLabel.string = config.gridUnlock ? '扩展格必须完整落在未解锁区域' : '该形状无法放入此处，请换一个空位';
        }
        if (gear.location === 'candidate') this.relayoutCandidates();
        else gear.node.setScale(1, 1, 1);
        this.dragGear = null;
    }

    private cancelGearDrag(gear: Gear): void {
        if (this.dragGear !== gear) return;
        gear.row = this.dragOrigin.row;
        gear.col = this.dragOrigin.col;
        gear.node.setPosition(this.dragOrigin.x, this.dragOrigin.y);
        gear.node.setScale(this.dragOrigin.scale, this.dragOrigin.scale, 1);
        this.dragGear = null;
    }

    private findMergeTarget(dragged: Gear, x: number, y: number): Gear | null {
        const possibleTargets = [...this.gears, ...this.candidates];
        for (const target of possibleTargets) {
            if (target === dragged) continue;
            const sameFamilyMerge = target.id === dragged.id && Boolean(GEARS[dragged.id].nextId);
            const fusion = bagLikeFusionRecipe(dragged.id, target.id);
            if (!sameFamilyMerge && !fusion) continue;
            const scale = target.node.scale.x;
            for (const [rowOffset, colOffset] of GEARS[target.id].shape) {
                const cellX = target.node.position.x + colOffset * GRID_CELL * scale;
                const cellY = target.node.position.y - rowOffset * GRID_CELL * scale;
                if (Math.abs(x - cellX) <= GRID_CELL * 0.46 * scale && Math.abs(y - cellY) <= GRID_CELL * 0.46 * scale) return target;
            }
        }
        return null;
    }

    private mergeGears(dragged: Gear, target: Gear): boolean {
        const sameFamilyNextId = target.id === dragged.id ? GEARS[dragged.id].nextId : null;
        const fusionRecipe = bagLikeFusionRecipe(dragged.id, target.id);
        if (!sameFamilyNextId && !fusionRecipe) return false;
        if (fusionRecipe && !bagLikeFusionRequirementsMet(fusionRecipe, this.currentHeroStars())) {
            const requirements = Object.keys(fusionRecipe.heroStarRequirements)
                .map((heroId) => `${heroId}≥${fusionRecipe.heroStarRequirements[heroId]}星`)
                .join('、');
            dragged.node.setPosition(this.dragOrigin.x, this.dragOrigin.y);
            dragged.node.setScale(this.dragOrigin.scale, this.dragOrigin.scale, 1);
            if (dragged.location === 'candidate') this.relayoutCandidates();
            this.tipLabel.string = `合成条件不足：${requirements}`;
            return true;
        }
        const nextIdValue = sameFamilyNextId || fusionRecipe?.resultId;
        if (!nextIdValue || !(nextIdValue in GEARS)) return false;
        const nextId = nextIdValue as GearId;
        const sourceName = fusionRecipe ? `${GEARS[dragged.id].name}+${GEARS[target.id].name}` : GEARS[dragged.id].name;
        this.gears = this.gears.filter((gear) => gear !== dragged);
        this.candidates = this.candidates.filter((gear) => gear !== dragged);
        if (dragged.node.isValid) dragged.node.destroy();
        target.id = nextId;
        target.workerPower = 0;
        this.renderGear(target);
        if (target.location === 'candidate') {
            this.relayoutCandidates();
        } else if (!this.canPlaceGear(nextId, target.row, target.col)) {
            this.returnGearsToCandidates([target]);
        } else {
            const displaced = this.displacedGearsAt(target, target.row, target.col);
            this.returnGearsToCandidates(displaced);
            target.node.setScale(1, 1, 1);
        }
        const level = GEARS[nextId].level || 0;
        this.refreshPlacedWheelHomeHp();
        this.tipLabel.string = `${sourceName}合成成功${level ? `：Lv.${level}` : ''}`;
        return true;
    }

    private gearCellsAt(id: GearId, row: number, col: number): Array<[number, number]> {
        return placementCells(GEARS[id].shape, row, col);
    }

    private productionSources(): Array<{ uid: number; row: number; col: number; shape: ReadonlyArray<readonly [number, number]> }> {
        return this.gears.map((gear) => ({
            uid: gear.uid,
            row: gear.row,
            col: gear.col,
            shape: GEARS[gear.id].shape,
        }));
    }

    private productionRateForGear(gear: Gear): number {
        const basePowerPerTrigger = GEARS[gear.id].powerPerTrigger || 0;
        if (gear.location === 'candidate') return productionRatePerSecond(basePowerPerTrigger, 1);
        const core = this.gears.find((item) => item.id === 'P01');
        if (!core) return 0;
        const contacts = powerContactsByGear(this.productionSources(), core.uid).get(gear.uid) || 0;
        return productionRatePerSecond(this.workerPowerPerTrigger(gear, basePowerPerTrigger), contacts);
    }

    private canPlaceGear(id: GearId, row: number, col: number): boolean {
        return placementAreaValid(
            GEARS[id].shape,
            row,
            col,
            GRID_ROWS,
            GRID_COLS,
            this.unlocked,
            new Set([POWER_INDEX]),
        );
    }

    private displacedGearsAt(moving: Gear, row: number, col: number): Gear[] {
        const displacedUids = new Set(displacedPlacementUids(
            this.gears.map((gear) => ({
                uid: gear.uid,
                row: gear.row,
                col: gear.col,
                shape: GEARS[gear.id].shape,
            })),
            moving.uid,
            GEARS[moving.id].shape,
            row,
            col,
        ));
        return this.gears.filter((gear) => displacedUids.has(gear.uid) && gear.id !== 'P01');
    }

    private returnGearsToCandidates(gears: ReadonlyArray<Gear>): void {
        if (gears.length === 0) return;
        const returning = new Set(gears.map((gear) => gear.uid));
        this.gears = this.gears.filter((gear) => !returning.has(gear.uid));
        for (const gear of gears) {
            if (gear.id === 'P01' || !gear.node.isValid) continue;
            gear.location = 'candidate';
            gear.row = -1;
            gear.col = -1;
            gear.workerPower = 0;
            if (this.candidates.indexOf(gear) < 0) this.candidates.push(gear);
        }
        this.refreshPlacedWheelHomeHp();
        this.relayoutCandidates();
    }

    private canUnlockShape(id: GearId, row: number, col: number): boolean {
        return this.gearCellsAt(id, row, col).every(([cellRow, cellCol]) => {
            if (cellRow < 0 || cellRow >= GRID_ROWS || cellCol < 0 || cellCol >= GRID_COLS) return false;
            return !this.unlocked.has(cellRow * GRID_COLS + cellCol);
        });
    }

    private stepBattle(dt: number): void {
        const round = this.rounds[this.roundIndex];
        this.roundClock += dt;

        // BattleInstanceController schedules every due monster before the
        // BattleProcessor snapshot, so a newly spawned unit acts this frame.
        while (this.spawnIndex < round.times.length && round.times[this.spawnIndex] * 0.001 <= this.roundClock) {
            this.spawnMonster(round.monsters[this.spawnIndex], round);
            this.spawnIndex += 1;
        }

        // The original snapshots collision state, calculates hero-only separation,
        // then updates heroes and monsters in reverse creation order.
        const heroes = this.units.filter((unit) => !unit.dead && unit.team === 'self');
        const monsters = this.units.filter((unit) => !unit.dead && unit.team === 'enemy');
        const separation = new Map<number, { x: number; y: number }>();
        for (let index = heroes.length - 1; index >= 0; index -= 1) {
            separation.set(heroes[index].uid, heroSeparationVector(heroes[index], heroes));
        }
        for (let index = heroes.length - 1; index >= 0; index -= 1) {
            this.stepUnit(heroes[index], dt, separation.get(heroes[index].uid));
        }
        for (let index = monsters.length - 1; index >= 0; index -= 1) {
            this.stepUnit(monsters[index], dt);
        }
        this.stepPendingHits(dt);
        if (this.phase !== 'battle') return;

        if (this.selfHp <= 0) {
            this.selfHp = 0;
            this.finish(false);
            return;
        }
        const enemiesAlive = this.units.some((unit) => !unit.dead && unit.team === 'enemy');
        if (this.spawnIndex >= round.times.length && !enemiesAlive) {
            this.clearTimer += dt;
            if (this.clearTimer >= 1) this.completeRound();
        } else {
            this.clearTimer = 0;
        }
    }

    private stepPowerProduction(dt: number, applyBattlePower: boolean): void {
        const core = this.gears.find((gear) => gear.id === 'P01');
        if (!core) return;

        // Jobs created by this frame's core contact start counting down on the
        // next frame, matching the original completion tween/event ordering.
        if (applyBattlePower) {
            for (const job of this.productionJobs) job.timer -= dt;
            const ready = this.productionJobs.filter((job) => job.timer <= 0);
            this.productionJobs = this.productionJobs.filter((job) => job.timer > 0);
            for (const job of ready) {
                const config = GEARS[job.gear.id];
                if (job.kind === 'hamster' && config.unit) this.spawnHero(config.unit, job.gear);
                else if (job.kind === 'tower' && config.unit) this.castTowerSkill(config.unit, job.gear);
                else if (job.kind === 'coin') this.gold += config.coinAmount || 0;
            }
        }

        const sources = this.productionSources();
        const advanced = advancePowerCoreClock(
            { nextDirection: this.powerDirection, remainingSeconds: this.powerTimer },
            dt,
            (direction) => connectedGearUidsAtCoreSide(sources, core.uid, direction).length > 0,
        );
        this.powerDirection = advanced.state.nextDirection;
        this.powerTimer = advanced.state.remainingSeconds;
        if (!applyBattlePower) return;
        for (const contact of advanced.contacts) {
            const triggeredUids = connectedGearUidsAtCoreSide(sources, core.uid, contact.direction);
            for (const uid of triggeredUids) {
                const gear = this.gears.find((item) => item.uid === uid);
                if (!gear) continue;
                const config = GEARS[gear.id];
                if (!config.powerPerTrigger) continue;
                const powerPerTrigger = this.workerPowerPerTrigger(gear, config.powerPerTrigger);
                const result = applyWorkerPower(gear.workerPower, powerPerTrigger);
                gear.workerPower = result.value;
                if (result.completed) this.queueProduction(gear);
            }
        }
    }

    private queueProduction(gear: Gear): void {
        const config = GEARS[gear.id];
        if (config.coinAmount) {
            this.productionJobs.push({ timer: WORKER_COMPLETE_ANIMATION_SECONDS, gear, kind: 'coin' });
            return;
        }
        if (!config.unit) return;
        const tower = UNITS[config.unit].attackType === 'WHEEL';
        this.productionJobs.push({
            timer: WORKER_COMPLETE_ANIMATION_SECONDS + (tower ? 0 : HAMSTER_SPAWN_FLIGHT_SECONDS),
            gear,
            kind: tower ? 'tower' : 'hamster',
        });
        if (this.fusionValidationMode()) console.log(`[fusion-validation] queued ${gear.id}`);
    }

    private stepUnit(unit: BattleUnit, dt: number, separation = { x: 0, y: 0 }): void {
        if (unit.periodicHealRatio > 0) {
            const periodicHeal = advancePeriodicAttackHeal({
                hp: unit.hp,
                maxHp: unit.maxHp,
                attack: unit.atk,
                ratio: unit.periodicHealRatio,
                timer: unit.periodicHealTimer,
                elapsed: dt,
            });
            unit.periodicHealTimer = periodicHeal.timer;
            if (periodicHeal.appliedAmount > 0) {
                unit.hp = periodicHeal.hp;
                this.addHealText(periodicHeal.appliedAmount, unit.x, unit.y + 48);
                this.drawUnitHp(unit);
            }
        }
        if (unit.shieldWall) {
            const shieldWall = advanceH04ShieldWall(
                { cooldown: unit.shieldWallCooldown, remaining: unit.shieldWallRemaining },
                dt,
            );
            unit.shieldWallCooldown = shieldWall.cooldown;
            unit.shieldWallRemaining = shieldWall.remaining;
        }
        if (unit.transformRemaining > 0) {
            const transform = advanceH03Transform({
                remaining: unit.transformRemaining,
                outgoingDamageIncrease: unit.transformDamageIncrease,
            }, dt);
            unit.transformRemaining = transform.remaining;
            unit.transformDamageIncrease = transform.outgoingDamageIncrease;
        }
        if (unit.barrageCooldown > 0) unit.barrageCooldown = Math.max(0, unit.barrageCooldown - dt);
        if (unit.laserCooldown > 0) unit.laserCooldown = Math.max(0, unit.laserCooldown - dt);
        if (unit.frozen > 0) {
            if (unit.barrageCasting) {
                unit.barrageCasting = false;
                unit.barrageElapsed = 0;
                unit.barrageTarget = null;
            }
            if (unit.laserCasting) {
                unit.laserCasting = false;
                unit.laserCooldownStarted = false;
                unit.laserElapsed = 0;
                unit.laserTarget = null;
            }
            unit.frozen = Math.max(0, unit.frozen - dt);
            this.playAnimation(unit, 'idle', true);
            return;
        }
        if (unit.barrageCasting) {
            unit.cooldown -= dt;
            this.stepH02BarrageCast(unit, dt);
            return;
        }
        if (unit.laserCasting) {
            unit.cooldown -= dt;
            this.stepH03LaserCast(unit, dt);
            return;
        }
        unit.cooldown -= dt;
        const opponents = this.units.filter((candidate) => !candidate.dead && candidate.team !== unit.team);
        if (unit.laser && unit.laserCooldown <= 0 && opponents.length > 0) {
            const laserIntent = resolveTargetingIntent(
                unit,
                opponents,
                unit.cfg.searchRange,
                unit.laser.castingRange,
                unit.cfg.moveSpeed * dt,
                { x: unit.team === 'self' ? BATTLEFIELD_HOME_X : -BATTLEFIELD_HOME_X, y: 0 },
                false,
            );
            if (laserIntent.attackTarget && laserIntent.target) {
                this.beginH03LaserCast(unit, laserIntent.target);
                return;
            }
            if (laserIntent.target) {
                unit.x += laserIntent.moveX + separation.x;
                unit.y += laserIntent.moveY + separation.y;
                unit.node.setPosition(unit.x, unit.y);
                this.playAnimation(unit, laserIntent.moveX || laserIntent.moveY ? 'run' : 'idle', true);
                return;
            }
        }
        if (unit.barrage && unit.barrageCooldown <= 0 && opponents.length > 0) {
            const barrageTarget = selectNearestBattlefieldTarget(unit, opponents, 9999);
            if (barrageTarget) {
                this.beginH02BarrageCast(unit, barrageTarget);
                return;
            }
        }
        if (unit.cfg.randomTarget && opponents.length > 0) {
            // Mobile units currently all use nearest search; keep the decoded
            // random-search branch valid for any future mobile skill config.
            const inRange = opponents.filter((candidate) => battlefieldDistance(unit, candidate) < unit.cfg.searchRange);
            if (inRange.length > 0) {
                const target = inRange[Math.floor(this.battleRandom() * inRange.length)];
                if (battlefieldDistance(unit, target) < unit.cfg.range) {
                    if (unit.cooldown <= 0) this.beginAttack(unit, target, null);
                    this.playAnimation(unit, 'idle', true);
                    return;
                }
            }
        }

        const enemyHome = { x: unit.team === 'self' ? BATTLEFIELD_HOME_X : -BATTLEFIELD_HOME_X, y: 0 };
        const intent = resolveTargetingIntent(
            unit,
            opponents,
            unit.cfg.searchRange,
            unit.cfg.range,
            unit.cfg.moveSpeed * dt,
            enemyHome,
            unit.team === 'enemy',
        );
        if (intent.attackTarget || intent.attackHome) {
            if (unit.cooldown <= 0) {
                this.beginAttack(unit, intent.target, intent.attackHome ? 'self' : null);
            }
            this.playAnimation(unit, 'idle', true);
            return;
        }

        unit.x += intent.moveX + separation.x;
        unit.y += intent.moveY + separation.y;
        unit.node.setPosition(unit.x, unit.y);
        this.playAnimation(unit, intent.moveX || intent.moveY ? 'run' : 'idle', true);
    }

    private beginH02BarrageCast(unit: BattleUnit, target: BattleUnit): void {
        if (!unit.barrage) return;
        unit.barrageCasting = true;
        unit.barrageCooldownStarted = false;
        unit.barrageElapsed = 0;
        unit.barrageTarget = target;
        unit.barrageLaunchAttack = this.effectiveAttack(unit);
        this.playAnimation(unit, 'attack', false);
    }

    private beginH03LaserCast(unit: BattleUnit, target: BattleUnit): void {
        if (!unit.laser) return;
        unit.laserCasting = true;
        unit.laserCooldownStarted = false;
        unit.laserElapsed = 0;
        unit.laserTarget = target;
        this.playAnimation(unit, 'laser', false);
        this.playH03LaserAudio();
    }

    private stepH03LaserCast(unit: BattleUnit, dt: number): void {
        const profile = unit.laser;
        if (!profile) return;
        const advance = advanceH03LaserCast(
            unit.laserElapsed,
            dt,
            profile.behaviorDelaySeconds,
            profile.castTimeSeconds,
        );
        unit.laserElapsed = advance.elapsed;
        if (advance.behaviorTriggered) {
            if (!unit.laserCooldownStarted) {
                unit.laserCooldown = Math.max(
                    0,
                    profile.cooldownSeconds - (advance.elapsed - profile.behaviorDelaySeconds),
                );
                unit.laserCooldownStarted = true;
            }
            const lockedTarget = unit.laserTarget;
            if (lockedTarget) {
                const targets = selectH03LaserTargets(
                    unit,
                    lockedTarget,
                    this.units.filter((candidate) => !candidate.dead && candidate.team !== unit.team),
                    profile.width,
                    profile.height,
                    profile.maxTargets,
                );
                const attack = this.effectiveAttack(unit);
                for (const target of targets) {
                    const damage = this.calculateDamageResult(
                        unit,
                        target.cfg,
                        profile.effectRatio,
                        attack,
                        false,
                        0,
                        target.shieldWallRemaining > 0 ? target.shieldWall?.damageResistance || 0 : 0,
                    );
                    const counterattack = h04ShieldWallCounterattackDamage(
                        damage.rawValue,
                        target.shieldWall?.counterattackRatio || 0,
                        target.shieldWallRemaining > 0 && !unit.dead,
                    );
                    if (counterattack > 0) this.damageUnit(unit, counterattack, target);
                    this.damageUnit(target, damage.value, unit);
                }
                const aimX = lockedTarget.x - unit.x;
                const aimY = lockedTarget.y - unit.y;
                const aimDistance = Math.hypot(aimX, aimY);
                const directionX = aimDistance > 0 ? aimX / aimDistance : 1;
                const directionY = aimDistance > 0 ? aimY / aimDistance : 0;
                this.addTrace(
                    unit,
                    unit.x + directionX * profile.height,
                    unit.y + directionY * profile.height,
                );
            }
        }
        if (advance.complete) {
            unit.laserCasting = false;
            unit.laserCooldownStarted = false;
            unit.laserElapsed = 0;
            unit.laserTarget = null;
            this.playAnimation(unit, 'idle', true);
        }
    }

    private stepH02BarrageCast(unit: BattleUnit, dt: number): void {
        const profile = unit.barrage;
        if (!profile) return;
        const previousElapsed = unit.barrageElapsed;
        const advance = advanceH02BarrageCast(
            previousElapsed,
            dt,
            profile.configuredShotDelays,
            profile.castTimeSeconds,
        );
        unit.barrageElapsed = advance.elapsed;
        if (advance.shotIndices.length > 0 && !unit.barrageCooldownStarted) {
            const firstDelay = profile.configuredShotDelays[advance.shotIndices[0]];
            unit.barrageCooldown = Math.max(0, profile.cooldownSeconds - (advance.elapsed - firstDelay));
            unit.barrageCooldownStarted = true;
        }
        const target = unit.barrageTarget;
        if (target && !target.dead) {
            for (let remainingShots = advance.shotIndices.length; remainingShots > 0; remainingShots -= 1) {
                const fromX = unit.x;
                const fromY = unit.y;
                const impactX = target.x;
                const impactY = target.y;
                const travelTime = Math.hypot(impactX - fromX, impactY - fromY) / profile.projectileSpeed;
                this.pendingHits.push({
                    timer: travelTime,
                    attacker: unit,
                    target,
                    targetHome: null,
                    fromX,
                    fromY,
                    effectRatio: profile.effectRatio,
                    areaRadius: 0,
                    maxTargets: 1,
                    impactX,
                    impactY,
                    projectile: true,
                    launchAttack: unit.barrageLaunchAttack,
                    bounceTimes: 0,
                    bounceMaxTimes: 0,
                    bounceRange: 0,
                    bounceAttackIncrease: 0,
                    bounceHitUids: new Set<number>(),
                    countsAsWarriorAttack: false,
                });
                this.addH02Projectile(fromX, fromY, impactX, impactY, travelTime);
            }
        }
        if (advance.complete) {
            unit.barrageCasting = false;
            unit.barrageCooldownStarted = false;
            unit.barrageElapsed = 0;
            unit.barrageTarget = null;
            this.playAnimation(unit, 'idle', true);
        }
    }

    private beginAttack(unit: BattleUnit, target: BattleUnit | null, targetHome: Team | null): void {
        const attrs = this.attrsFor(unit.cfg);
        unit.cooldown = attackIntervalSeconds(unit.cfg.attackInterval, attrs.attackSpeed);
        this.playAnimation(unit, 'attack', false);
        this.playMeleeAttackAudio(unit);
        const travelDistance = target
            ? Math.hypot(target.x - unit.x, target.y - unit.y)
            : targetHome
              ? Math.hypot(-BATTLEFIELD_HOME_X - unit.x, unit.y)
              : 0;
        const travelTime = unit.cfg.projectileSpeed ? travelDistance / unit.cfg.projectileSpeed : 0;
        const behaviorDelay = attackBehaviorDelaySeconds(unit.cfg.attackDelay, attrs.attackSpeed);
        const impactX = target ? target.x : targetHome ? -BATTLEFIELD_HOME_X : unit.x;
        const impactY = target ? target.y : -10;
        const h13BounceProfile = unit.cfg.id === 'H1301' || unit.cfg.id === 'H09'
            ? resolveH13BounceProfileForSkill(this.h13SkillId)
            : null;
        const splitShotProbability = target ? this.traitEffectAmount('splitShot', unit.cfg) : 0;
        if (target && splitShotProbability > 0 && splitShotRollSucceeds(splitShotProbability, this.battleRandom)) {
            const splitTarget = selectSplitShotTarget(
                unit,
                this.units.filter((candidate) => !candidate.dead && candidate.team !== unit.team),
            );
            if (splitTarget) {
                const splitTravelTime = battlefieldDistance(unit, splitTarget) / SPLIT_SHOT_PROJECTILE_SPEED;
                this.pendingHits.push({
                    timer: splitTravelTime,
                    attacker: unit,
                    target: splitTarget,
                    targetHome: null,
                    fromX: unit.x,
                    fromY: unit.y,
                    effectRatio: SPLIT_SHOT_EFFECT_RATIO,
                    areaRadius: 0,
                    maxTargets: 1,
                    impactX: splitTarget.x,
                    impactY: splitTarget.y,
                    projectile: true,
                    launchAttack: this.effectiveAttack(unit),
                    bounceTimes: 0,
                    bounceMaxTimes: 0,
                    bounceRange: 0,
                    bounceAttackIncrease: 0,
                    bounceHitUids: new Set<number>(),
                    countsAsWarriorAttack: false,
                });
                this.addH02Projectile(unit.x, unit.y, splitTarget.x, splitTarget.y, splitTravelTime);
            }
        }
        this.pendingHits.push({
            timer: behaviorDelay + travelTime,
            attacker: unit,
            target,
            targetHome,
            fromX: unit.x,
            fromY: unit.y,
            effectRatio: unit.cfg.effectRatio,
            areaRadius: unit.cfg.areaRadius || 0,
            maxTargets: unit.cfg.maxTargets || 1,
            impactX,
            impactY,
            projectile: Boolean(unit.cfg.projectileSpeed),
            launchAttack: this.effectiveAttack(unit),
            bounceTimes: 0,
            bounceMaxTimes: resolveBounceMaxTimes(
                unit.cfg.bounceTimes || 0,
                this.traitEffectAmount('bounceTimes', unit.cfg),
            ),
            bounceRange: unit.cfg.bounceRange || 0,
            bounceAttackIncrease: h13BounceProfile?.attackIncreasePerBounce || 0,
            bounceHitUids: new Set<number>(),
            countsAsWarriorAttack: true,
        });
        if (unit.cfg.id === 'H09' && target && travelTime > 0) {
            this.addH0905Projectile(unit.x, unit.y, impactX, impactY, travelTime, behaviorDelay);
        }
        if (unit.cfg.id === 'H1301' && target && travelTime > 0) {
            this.addH13Projectile(unit.x, unit.y, impactX, impactY, travelTime, behaviorDelay);
        }
        if (unit.cfg.id === 'H0201' && travelTime > 0) {
            if (unit.cfg.productionSkillId === 2002) {
                this.addH0204Projectile(unit.x, unit.y, impactX, impactY, travelTime, behaviorDelay);
            } else {
                this.addH02Projectile(unit.x, unit.y, impactX, impactY, travelTime, behaviorDelay);
            }
        }
        if ((unit.cfg.id === 'H0301' || unit.cfg.id === 'H08') && travelTime > 0) {
            this.addH03Projectile(unit.x, unit.y, impactX, impactY, travelTime, behaviorDelay);
        }
    }

    private stepPendingHits(dt: number): void {
        for (const hit of this.pendingHits) hit.timer -= dt;
        const ready = this.pendingHits.filter((hit) => hit.timer <= 0);
        this.pendingHits = this.pendingHits.filter((hit) => hit.timer > 0);
        for (const hit of ready) {
            if (hit.attacker.dead && !hit.projectile) continue;
            if (hit.target && (!hit.target.dead || (hit.projectile && hit.areaRadius > 0))) {
                const centerX = hit.projectile ? hit.impactX : hit.target.x;
                const centerY = hit.projectile ? hit.impactY : hit.target.y;
                const targets = hit.areaRadius > 0
                    ? this.units
                          .filter((unit) => !unit.dead && unit.team !== hit.attacker.team)
                          .map((unit) => ({ unit, distance: Math.hypot(unit.x - centerX, unit.y - centerY) }))
                          .filter((entry) => entry.distance <= hit.areaRadius)
                          .sort((left, right) => left.distance - right.distance)
                          .slice(0, hit.maxTargets)
                          .map((entry) => entry.unit)
                    : hit.target.dead ? [] : [hit.target];
                const attack = resolveBounceAttack(
                    resolveAttackAtImpact(
                        this.effectiveAttack(hit.attacker),
                        hit.launchAttack,
                        hit.projectile,
                        !hit.attacker.dead,
                    ),
                    hit.bounceTimes,
                    hit.bounceAttackIncrease,
                );
                const warriorCombo = hit.attacker.warriorCombo;
                const forcedWarriorCritical = Boolean(warriorCombo && hit.attacker.warriorComboCriticalReady);
                let warriorCriticalConsumed = false;
                for (const target of targets) {
                    const killFlyProbability = this.traitEffectAmount('attackKillFly', hit.attacker.cfg);
                    if (attackKillFlyRollSucceeds(killFlyProbability, !target.cfg.boss, true, this.battleRandom)) {
                        this.damageUnit(target, ATTACK_KILL_FLY_DAMAGE, hit.attacker);
                        continue;
                    }
                    const damage = this.calculateDamageResult(
                        hit.attacker,
                        target.cfg,
                        hit.effectRatio,
                        attack,
                        forcedWarriorCritical,
                        forcedWarriorCritical ? warriorCombo?.bonusCritDamage || 0 : 0,
                        target.shieldWallRemaining > 0 ? target.shieldWall?.damageResistance || 0 : 0,
                    );
                    const counterattack = h04ShieldWallCounterattackDamage(
                        damage.rawValue,
                        target.shieldWall?.counterattackRatio || 0,
                        target.shieldWallRemaining > 0 && !hit.attacker.dead,
                    );
                    if (counterattack > 0) this.damageUnit(hit.attacker, counterattack, target);
                    this.damageUnit(target, damage.value, hit.attacker);
                    warriorCriticalConsumed ||= forcedWarriorCritical && damage.status === 'critical';
                    if (hit.attacker.transform) {
                        const transform = applyH03TransformHit({
                            remaining: target.transformRemaining,
                            frozen: target.frozen,
                            outgoingDamageIncrease: target.transformDamageIncrease,
                        }, hit.attacker.transform, Boolean(target.cfg.controlImmune));
                        target.transformRemaining = transform.remaining;
                        target.frozen = transform.frozen;
                        target.transformDamageIncrease = transform.outgoingDamageIncrease;
                        this.addH03TransformEffect(target);
                        if (hit.attacker.transform.traitId === 'RG_H03_abl03_eff01') {
                            this.playH03StatusAudio(this.h03TransformAudio);
                        }
                    }
                    if (
                        (hit.attacker.cfg.id === 'H0301' || hit.attacker.cfg.id === 'H08')
                        && this.traitCount('RG_H03_abl02_eff01') > 0
                        && !target.cfg.controlImmune
                        && randomBattleRoll(this.battleRandom) <= 3000
                    ) {
                        target.frozen = Math.max(target.frozen, 3);
                        this.addH03FreezeEffect(target);
                        this.playH03StatusAudio(this.h03FreezeAudio);
                    }
                }
                if (hit.attacker.cfg.id === 'H07') this.addH0705Impact(centerX, centerY);
                if (hit.attacker.cfg.id === 'H08') this.addH08Impact(centerX, centerY);
                if (hit.attacker.cfg.id === 'H09') this.addH0905Impact(centerX, centerY);
                if (hit.attacker.cfg.id === 'H1201') this.playH12HitAudio();
                if (hit.target && hit.bounceMaxTimes > 0) this.queueBounceHit(hit);
                if (warriorCombo && (hit.countsAsWarriorAttack || warriorCriticalConsumed)) {
                    this.completeWarriorAttack(hit.attacker, warriorCombo, warriorCriticalConsumed);
                }
                if (['H09', 'H0201', 'H0301', 'H07', 'H08', 'H1201', 'H1301'].indexOf(hit.attacker.cfg.id) < 0) {
                    this.addTrace(hit.attacker, centerX, centerY, hit.fromX, hit.fromY);
                }
            } else if (hit.targetHome) {
                const attack = resolveAttackAtImpact(
                    this.effectiveAttack(hit.attacker),
                    hit.launchAttack,
                    hit.projectile,
                    !hit.attacker.dead,
                );
                const damage = this.calculateDamage(hit.attacker, null, hit.effectRatio, attack);
                this.selfHp -= damage;
                const x = -HOME_X + 20;
                this.addDamageText(damage, x, -15);
                this.addTrace(hit.attacker, x, -10);
            }
        }
    }

    private queueBounceHit(hit: PendingHit): void {
        const previousTarget = hit.target;
        if (!previousTarget) return;
        hit.bounceHitUids.add(previousTarget.uid);
        const nextTarget = selectBounceBattlefieldTarget(
            { x: hit.impactX, y: hit.impactY },
            this.units.filter((unit) => !unit.dead && unit.team !== hit.attacker.team),
            hit.bounceHitUids,
            hit.bounceTimes,
            hit.bounceMaxTimes,
            hit.bounceRange,
        );
        if (!nextTarget) return;
        const projectileSpeed = hit.attacker.cfg.projectileSpeed || 0;
        const fromX = previousTarget.x;
        const fromY = previousTarget.y;
        const impactX = nextTarget.x;
        const impactY = nextTarget.y;
        this.pendingHits.push({
            ...hit,
            timer: projectileSpeed > 0 ? Math.hypot(impactX - fromX, impactY - fromY) / projectileSpeed : 0,
            target: nextTarget,
            targetHome: null,
            fromX,
            fromY,
            impactX,
            impactY,
            bounceTimes: hit.bounceTimes + 1,
        });
        if (projectileSpeed > 0 && hit.attacker.cfg.id === 'H09') {
            this.addH0905Projectile(
                fromX,
                fromY,
                impactX,
                impactY,
                Math.hypot(impactX - fromX, impactY - fromY) / projectileSpeed,
            );
        }
        if (projectileSpeed > 0 && hit.attacker.cfg.id === 'H1301') {
            this.addH13Projectile(
                fromX,
                fromY,
                impactX,
                impactY,
                Math.hypot(impactX - fromX, impactY - fromY) / projectileSpeed,
            );
        }
    }

    private calculateDamage(attacker: BattleUnit, targetConfig: UnitConfig | null, effectRatio: number, attack = this.effectiveAttack(attacker)): number {
        return this.calculateDamageResult(attacker, targetConfig, effectRatio, attack).value;
    }

    private calculateDamageResult(
        attacker: BattleUnit,
        targetConfig: UnitConfig | null,
        effectRatio: number,
        attack = this.effectiveAttack(attacker),
        forcedCritical = false,
        bonusCritDamage = 0,
        targetDamageResistance = 0,
    ): DamageResult {
        const source = this.attrsFor(attacker.cfg);
        source.damageIncrease += this.traitEffectAmount('attackIncrease', attacker.cfg);
        if (attacker.transformRemaining > 0) source.damageIncrease += attacker.transformDamageIncrease;
        source.bossIncrease += this.traitEffectAmount('bossVulnerability', attacker.cfg);
        source.critDamage += bonusCritDamage;
        const target = { ...(targetConfig ? this.attrsFor(targetConfig) : DEFAULT_ATTRS) };
        target.damageResistance += targetDamageResistance;
        return resolveBattleDamageWithRandom({
            attack,
            effectRatio,
            sourceType: attacker.cfg.attackType,
            source,
            target,
            targetIsBoss: targetConfig?.boss || false,
            forcedCritical,
        }, this.battleRandom);
    }

    private completeWarriorAttack(
        unit: BattleUnit,
        profile: WarriorComboProfile,
        criticalBuffConsumed: boolean,
    ): void {
        const result = completeWarriorComboAttack(
            {
                completedAttacks: unit.warriorComboCompletedAttacks,
                criticalReady: unit.warriorComboCriticalReady,
            },
            profile,
            criticalBuffConsumed,
        );
        unit.warriorComboCompletedAttacks = result.completedAttacks;
        unit.warriorComboCriticalReady = result.criticalReady;
        if (!result.triggered || profile.healMaxHpBasisPoints <= 0) return;
        const previousHp = unit.hp;
        unit.hp = resolveHomeHeal(unit.hp, unit.maxHp, profile.healMaxHpBasisPoints);
        const healed = unit.hp - previousHp;
        if (healed > 0) this.addHealText(healed, unit.x, unit.y + 48);
        this.drawUnitHp(unit);
    }

    private effectiveAttack(unit: BattleUnit): number {
        if (unit.team === 'enemy') {
            return unit.atk * traitMonsterAttackMultiplier(IMPLEMENTED_TRAIT_POOL, this.traitStacks);
        }
        return unit.atk * warriorKillAttackMultiplier(
            traitWarriorKillAttackProfile(IMPLEMENTED_TRAIT_POOL, this.traitStacks),
            this.warriorKillAttackStacks,
            unit.cfg.id.slice(0, 3),
        );
    }

    private attrsFor(config: UnitConfig): Attributes {
        const result = { ...DEFAULT_ATTRS, ...(config.attrs || {}) };
        result.attackSpeed += this.traitEffectAmount('attackSpeed', config);
        result.critDamage = Math.min(25000, Math.max(0, result.critDamage + this.traitEffectAmount('criticalDamage', config)));
        result.critRate = Math.min(10000, Math.max(0, result.critRate + this.traitEffectAmount('criticalRate', config)));
        return result;
    }

    private damageUnit(target: BattleUnit, damage: number, attacker: BattleUnit | null = null): void {
        if (target.dead) return;
        const result = applyShieldedDamage(target.hp, target.shield, damage);
        target.hp = result.hp;
        target.shield = result.shield;
        this.addDamageText(damage, target.x, target.y + 48);
        if (target.hp <= 0) {
            if (target.team === 'enemy' && attacker) this.completeWarriorKill(attacker);
            this.killUnit(target);
        }
    }

    private completeWarriorKill(attacker: BattleUnit): void {
        const profile = traitWarriorKillAttackProfile(IMPLEMENTED_TRAIT_POOL, this.traitStacks);
        if (!profile) return;
        const result = completeWarriorKillAttackStack(
            this.warriorKillAttackStacks,
            profile,
            attacker.cfg.id.slice(0, 3),
        );
        this.warriorKillAttackStacks = result.stacks;
    }

    private killUnit(unit: BattleUnit): void {
        if (unit.dead) return;
        unit.dead = true;
        this.playAnimation(unit, 'die', false);
        this.scheduleOnce(() => {
            if (unit.node.isValid) unit.node.destroy();
        }, 0.42);
        this.units = this.units.filter((item) => item.uid !== unit.uid);
        this.pendingHits = this.pendingHits.filter((hit) => hit.projectile || (hit.attacker.uid !== unit.uid && hit.target?.uid !== unit.uid));
        if (unit.team === 'enemy') this.addExperience(unit.cfg.exp || 0);
    }

    private addExperience(amount: number): void {
        if (amount <= 0) return;
        const result = addBagLikeExp(
            { level: this.bagLikeLevel, exp: this.bagLikeExp },
            amount,
            traitExpMultiplier(IMPLEMENTED_TRAIT_POOL, this.traitStacks),
        );
        this.bagLikeLevel = result.level;
        this.bagLikeExp = result.exp;
        this.drawExpBar();
        if (result.leveledUp) this.openTraitSelection();
    }

    private openTraitSelection(): void {
        if (this.phase !== 'battle' && this.phase !== 'roundClear') return;
        this.pendingTraitReturnPhase = this.phase;
        this.phase = 'trait';
        this.drawNewTraitChoices();
        this.renderTraitChoices();
        this.traitLayer.active = true;
        this.traitLayer.setSiblingIndex(this.node.children.length - 1);
        this.applyPhaseLayout();
    }

    private renderTraitChoices(): void {
        for (const child of [...this.traitCardsLayer.children]) child.destroy();
        this.currentTraitChoices.forEach((trait, index) => this.makeTraitCard(trait, (index - 1) * TRAIT_VISUAL_LAYOUT.cardStepX));
        this.traitRerollLabel.string = '换一批';
        this.traitTakeAllLabel.string = '全都要';
        this.traitRerollCountLabel.string = `<outline color=#12162f width=2>剩余次数 <color=#4aff58>${TRAIT_REROLL_MAX - this.traitRerollsUsed}/${TRAIT_REROLL_MAX}</color></outline>`;
        this.traitTakeAllCountLabel.string = `<outline color=#12162f width=2>剩余次数 <color=#4aff58>${TRAIT_TAKE_ALL_MAX - this.traitTakeAllUsed}/${TRAIT_TAKE_ALL_MAX}</color></outline>`;
    }

    private makeTraitCard(trait: TraitDefinition, x: number): void {
        const card = this.makeNode(
            `Trait_${trait.id}`,
            this.traitCardsLayer,
            x,
            0,
            TRAIT_VISUAL_LAYOUT.cardWidth,
            TRAIT_VISUAL_LAYOUT.cardHeight,
        );
        const graphics = card.addComponent(Graphics);
        graphics.fillColor = new Color(79, 91, 157, 255);
        graphics.circle(-58, 224, 13);
        graphics.circle(58, 224, 13);
        graphics.fill();
        graphics.roundRect(-84, -230, 168, 460, 27);
        graphics.fill();
        graphics.strokeColor = new Color(35, 43, 78, 255);
        graphics.lineWidth = 5;
        graphics.roundRect(-81, -227, 162, 454, 24);
        graphics.stroke();
        const iconLevel = Math.max(1, Math.min(5, trait.quality - 1));
        const iconGear = this.makeNode('TraitIconGear', card, 0, TRAIT_VISUAL_LAYOUT.iconY, 110, 110);
        this.attachRecoveredAtlasSprite(iconGear, 'original/bagLike_0/spriteFrame', {
            rect: GEAR_BODY_FRAMES[iconLevel],
            sourceSize: new Size(110, 110),
        });
        const descriptionPanel = this.makeNode(
            'TraitDescriptionPanel',
            card,
            0,
            TRAIT_VISUAL_LAYOUT.descriptionY,
            TRAIT_VISUAL_LAYOUT.descriptionWidth,
            TRAIT_VISUAL_LAYOUT.descriptionHeight,
        );
        const descriptionGraphics = descriptionPanel.addComponent(Graphics);
        descriptionGraphics.fillColor = new Color(64, 74, 133, 255);
        descriptionGraphics.roundRect(
            -TRAIT_VISUAL_LAYOUT.descriptionWidth / 2,
            -TRAIT_VISUAL_LAYOUT.descriptionHeight / 2,
            TRAIT_VISUAL_LAYOUT.descriptionWidth,
            TRAIT_VISUAL_LAYOUT.descriptionHeight,
            14,
        );
        descriptionGraphics.fill();
        const icons: Record<TraitEffectKind, string> = {
            attackIncrease: '攻',
            attackKillFly: '飞',
            attackSpeed: '速',
            barrage: '幕',
            bossVulnerability: '破',
            bounceTimes: '弹',
            criticalDamage: '爆',
            criticalRate: '暴',
            enemyAttackDecrease: '弱',
            expGain: '经',
            gearUpgrade: '升',
            healToShield: '盾',
            immediateHomeHeal: '疗',
            paralysis: '麻',
            penetratingLaser: '光',
            periodicSelfHeal: '愈',
            powerNearAttack: '核',
            powerNearWorker: '效',
            prepareRewardWeight: '刷',
            roundStartHomeHeal: '愈',
            runtimeNoOp: '疗',
            shieldWall: '壁',
            skillReplacement: '电',
            splitShot: '射',
            freeze: '冰',
            transform: '变',
            hpIncrease: '血',
            warriorComboCritical: '暴',
            warriorKillAttackIncrease: '叠',
        };
        const exactIconFrame = TRAIT_ICON_FRAMES[trait.id];
        if (exactIconFrame) {
            const exactIcon = this.makeNode('TraitIcon', card, 0, TRAIT_VISUAL_LAYOUT.iconY, 94, 94);
            this.attachRecoveredAtlasSprite(
                exactIcon,
                'original/trait-icons/effect/spriteFrame',
                exactIconFrame,
            );
        } else {
            const icon = icons[trait.effect.kind];
            const iconLabel = this.makeLabel('TraitIconFallback', card, 0, TRAIT_VISUAL_LAYOUT.iconY, 90, 60, icon, 34, WHITE);
            this.applyOriginalOutline(iconLabel, new Color(6, 5, 0, 255), 2);
        }
        const descriptionNode = this.makeNode(
            'TraitDescription',
            card,
            0,
            TRAIT_VISUAL_LAYOUT.descriptionY,
            TRAIT_VISUAL_LAYOUT.descriptionWidth - 18,
            TRAIT_VISUAL_LAYOUT.descriptionHeight - 22,
        );
        const description = descriptionNode.addComponent(RichText);
        description.string = traitDescriptionMarkup(trait.description);
        if (this.originalFont) description.font = this.originalFont;
        description.fontSize = 20;
        description.lineHeight = 27;
        description.maxWidth = TRAIT_VISUAL_LAYOUT.descriptionWidth - 18;
        description.fontColor = CREAM;
        description.horizontalAlign = HorizontalTextAlignment.CENTER;
        if (isRecommendedTrait(trait, this.currentTraitChoices)) {
            const badge = this.makeNode('Recommend', card, 56, 214, 98, 50);
            badge.angle = -15;
            const badgeGraphics = badge.addComponent(Graphics);
            badgeGraphics.fillColor = new Color(18, 9, 15, 255);
            badgeGraphics.roundRect(-50, -26, 100, 52, 11);
            badgeGraphics.fill();
            badgeGraphics.fillColor = new Color(242, 83, 105, 255);
            badgeGraphics.roundRect(-46, -22, 92, 44, 8);
            badgeGraphics.fill();
            badgeGraphics.fillColor = new Color(18, 9, 15, 255);
            badgeGraphics.moveTo(-20, -25);
            badgeGraphics.lineTo(-3, -25);
            badgeGraphics.lineTo(-13, -39);
            badgeGraphics.close();
            badgeGraphics.fill();
            badgeGraphics.fillColor = new Color(242, 83, 105, 255);
            badgeGraphics.moveTo(-18, -22);
            badgeGraphics.lineTo(-5, -22);
            badgeGraphics.lineTo(-13, -34);
            badgeGraphics.close();
            badgeGraphics.fill();
            const recommendText = this.makeLabel('RecommendText', badge, 0, 1, 82, 34, '推荐', 20, GOLD);
            this.applyOriginalOutline(recommendText, new Color(18, 9, 15, 255), 2);
        }
        card.addComponent(Button);
        card.on(Button.EventType.CLICK, () => this.chooseTrait(trait), this);
    }

    private chooseTrait(trait: TraitDefinition): void {
        this.applyTrait(trait);
        this.closeTraitSelection();
    }

    private rerollTraits(): void {
        if (this.traitRerollsUsed >= TRAIT_REROLL_MAX) return;
        this.traitRerollsUsed += 1;
        this.drawNewTraitChoices(TRAIT_REROLL_MIN_QUALITY);
        this.renderTraitChoices();
    }

    private takeAllTraits(): void {
        if (this.traitTakeAllUsed >= TRAIT_TAKE_ALL_MAX) return;
        this.traitTakeAllUsed += 1;
        for (const trait of this.currentTraitChoices) this.applyTrait(trait);
        this.closeTraitSelection();
    }

    private drawNewTraitChoices(minimumQuality = 0): void {
        const usedHeroIds = new Set<string>();
        for (const gear of this.gears) {
            const model = GEARS[gear.id].unit;
            if (model) usedHeroIds.add(model.slice(0, 3));
        }
        this.currentTraitChoices = drawWeightedTraits(
            IMPLEMENTED_TRAIT_POOL,
            usedHeroIds,
            this.traitStacks,
            3,
            minimumQuality,
            Math.random,
            this.roundIndex + 1,
            bagLikeHomeHpPercent(this.selfHp, this.levelHomeHp),
            new Map(Object.keys(this.currentHeroStars()).map((heroId) => [heroId, this.currentHeroStars()[heroId]])),
        );
    }

    private currentHeroStars(): Record<string, number> {
        return {
            ...this.accountProfile.stars,
            ...(this.validationHeroStarOverrides || {}),
        };
    }

    private applyTrait(trait: TraitDefinition): void {
        const current = this.traitCount(trait.id);
        if (!trait.noRestore && current >= trait.maxTimes) return;
        if (!trait.noRestore) this.traitStacks.set(trait.id, Math.min(trait.maxTimes, current + 1));
        if (
            trait.id === 'RG_H12_abl01_eff01'
            || trait.id === 'RG_H12_abl01_eff02'
            || trait.id === 'RG_H12_abl04_eff01'
        ) {
            this.h12SkillId = replaceH12Skill(this.h12SkillId, trait.id as H12ReplacementTraitId);
        }
        if (trait.id === 'RG_H11_abl01_eff02') {
            this.h11SkillId = replaceH11Skill(this.h11SkillId, trait.id as H11ReplacementTraitId);
        }
        if (trait.id === 'RG_H13_abl02_eff01' || trait.id === 'RG_H13_abl02_eff02') {
            this.h13SkillId = replaceH13Skill(this.h13SkillId, trait.id as H13ReplacementTraitId);
        }
        if (trait.effect.kind === 'immediateHomeHeal') {
            const previousHp = this.selfHp;
            this.selfHp = resolveHomeHeal(this.selfHp, this.levelHomeHp, trait.effect.amount);
            const healed = this.selfHp - previousHp;
            if (healed > 0) this.addHealText(healed, -HOME_X + 20, -15);
            this.drawHomes();
        }
        if (trait.effect.kind === 'gearUpgrade') {
            this.upgradeOnePlacedGear();
        }
        if (trait.effect.kind === 'hpIncrease') {
            const range = trait.range || [];
            const multiple = 1 + trait.effect.amount / 10000;
            for (const unit of this.units) {
                if (unit.team !== 'self' || range.indexOf(unit.cfg.id.slice(0, 3)) < 0) continue;
                unit.maxHp *= multiple;
                unit.hp *= multiple;
                this.drawUnitHp(unit);
            }
        }
    }

    private upgradeOnePlacedGear(): void {
        type UpgradeItem = BagLikeGearUpgradeItem<GearId> & { gear: Gear };
        const items: UpgradeItem[] = [...this.gears, ...this.candidates].map((gear) => ({
            gear,
            sid: gear.uid,
            id: gear.id,
            location: gear.location,
            isPower: gear.id === 'P01',
        }));
        const result = chooseBagLikeGearUpgrade<GearId, UpgradeItem>(
            items,
            (id) => GEARS[id].nextId || null,
            Math.random,
        );
        if (!result) {
            this.tipLabel.string = '当前棋盘没有可升级齿轮';
            return;
        }
        const gear = result.item.gear;
        gear.id = result.nextId;
        this.renderGear(gear);
        gear.node.setScale(1, 1, 1);
        const level = GEARS[result.nextId].level || 0;
        this.refreshPlacedWheelHomeHp();
        this.tipLabel.string = `${GEARS[result.previousId].name}随机升级${level ? `至 Lv.${level}` : ''}`;
    }

    private traitCount(id: TraitId): number {
        return this.traitStacks.get(id) || 0;
    }

    private traitEffectAmount(kind: TraitEffectKind, config: UnitConfig): number {
        return traitEffectAmount(IMPLEMENTED_TRAIT_POOL, this.traitStacks, kind, config.id.slice(0, 3));
    }

    private closeTraitSelection(): void {
        this.traitLayer.active = false;
        this.phase = this.pendingTraitReturnPhase;
        this.applyPhaseLayout();
    }

    private spawnHero(model: ModelId, gear: Gear): void {
        const profile = bagLikeProducerProfile(gear.id);
        if (!profile || profile.kind !== 'hamster' || !profile.modelId || !profile.spineResourcePath || !profile.modelScale) return;
        if (this.fusionValidationMode()) console.log(`[fusion-validation] spawning ${gear.id} as ${profile.modelId}`);
        const config: UnitConfig = {
            ...UNITS[model],
            productionGearId: profile.gearId,
            productionLevel: profile.level,
            productionSkillId: profile.primarySkillId,
            visualModelId: profile.modelId,
            spinePath: profile.spineResourcePath,
            spineScale: profile.modelScale,
        };
        const scales = this.producerAttributeScales(gear, profile, config);
        const validationSpawnY: Readonly<Record<string, number>> = { H0705: -95, H0805: 0, H0905: 95 };
        const spawnY = this.fusionValidationMode() ? validationSpawnY[gear.id] : Math.random() * 150;
        this.createUnit('self', config, -300, spawnY, scales.attack, scales.hp);
    }

    private castTowerSkill(model: ModelId, gear: Gear): void {
        const cfg = UNITS[model];
        const profile = bagLikeProducerProfile(gear.id);
        if (!profile || profile.kind !== 'wheel') return;
        const scales = this.producerAttributeScales(gear, profile, cfg);
        if (model === 'H1101') {
            this.castH11Healing(cfg.atk * scales.attack);
            return;
        }
        const targets = this.units.filter((unit) => !unit.dead && unit.team === 'enemy');
        if (targets.length === 0) return;
        const target = targets[Math.floor(this.battleRandom() * targets.length)];
        const position = this.gridPosition(gear.row, gear.col);
        const graphics = gear.node.getComponent(Graphics)!;
        const caster: BattleUnit = {
            uid: ++this.serial,
            team: 'self',
            cfg,
            node: gear.node,
            hpGraphics: graphics,
            fallback: graphics,
            skeleton: null,
            hp: cfg.hp,
            maxHp: cfg.hp,
            shield: 0,
            atk: cfg.atk * scales.attack,
            x: position.x,
            y: position.y,
            cooldown: 0,
            dead: false,
            frozen: 0,
            barrage: null,
            barrageCooldown: 0,
            barrageCasting: false,
            barrageCooldownStarted: false,
            barrageElapsed: 0,
            barrageTarget: null,
            barrageLaunchAttack: 0,
            laser: null,
            laserCooldown: 0,
            laserCasting: false,
            laserCooldownStarted: false,
            laserElapsed: 0,
            laserTarget: null,
            transform: null,
            transformRemaining: 0,
            transformDamageIncrease: 0,
            periodicHealRatio: 0,
            periodicHealTimer: H04_PERIODIC_HEAL_INTERVAL_SECONDS,
            shieldWall: null,
            shieldWallCooldown: 0,
            shieldWallRemaining: 0,
            warriorCombo: null,
            warriorComboCompletedAttacks: 0,
            warriorComboCriticalReady: false,
        };
        if (cfg.projectileSpeed) {
            this.beginAttack(caster, target, null);
            return;
        }
        if (model === 'H1201') {
            const castProfile = resolveH12CastProfileForSkill(this.h12SkillId);
            this.addH12SkillEffect(target.x, target.y);
            target.frozen = applyH12Paralysis(
                target.frozen,
                castProfile.paralysisSeconds,
                Boolean(target.cfg.controlImmune),
            );
            this.beginAttack(caster, target, null);
            return;
        }
        const affected = this.units
            .filter((unit) => !unit.dead && unit.team === 'enemy')
            .map((unit) => ({ unit, distance: Math.hypot(unit.x - target.x, unit.y - target.y) }))
            .filter((entry) => entry.distance <= (cfg.areaRadius || 0))
            .sort((left, right) => left.distance - right.distance)
            .slice(0, cfg.maxTargets || 1)
            .map((entry) => entry.unit);
        for (const unit of affected) this.damageUnit(unit, this.calculateDamage(caster, unit.cfg, cfg.effectRatio), caster);
        this.addTrace(caster, target.x, target.y);
    }

    private castH11Healing(attack: number): void {
        const castProfile = resolveH11HealingProfileForSkill(this.h11SkillId);
        const allies = this.units.filter((unit) => !unit.dead && unit.team === 'self');
        const plan = resolveH11Healing({
            attack,
            allies: allies.map((unit) => ({
                id: unit.uid,
                hp: unit.hp,
                maxHp: unit.maxHp,
                x: unit.x,
                y: unit.y,
            })),
            homeHp: this.selfHp,
            homeMaxHp: this.levelHomeHp,
            unitHealRatio: castProfile.unitHealRatio,
            homeHealRatio: castProfile.homeHealRatio,
            radius: H11_TARGET_RADIUS,
            maxUnitTargets: 1,
            healToShield: this.traitEffectAmount('healToShield', UNITS.H1101) > 0,
            random: Math.random,
        });
        if (!plan) return;

        for (const heal of plan.unitHeals) {
            const unit = allies.find((candidate) => candidate.uid === heal.id);
            if (!unit) continue;
            unit.hp += heal.appliedAmount;
            unit.shield += heal.shieldAmount;
            this.addH11HealingEffect(unit.x, unit.y);
            if (heal.appliedAmount > 0) this.addHealText(heal.appliedAmount, unit.x, unit.y + 48);
            this.drawUnitHp(unit);
        }
        if (plan.homeAppliedAmount > 0) {
            this.selfHp += plan.homeAppliedAmount;
            this.addHealText(plan.homeAppliedAmount, -HOME_X + 20, -15);
            this.drawHomes();
        }
    }

    private producerAttributeScales(gear: Gear, profile: BagLikeProducerProfile, config: UnitConfig): { attack: number; hp: number } {
        const scales = resolveProducerAttributeScales(
            profile.attributeMultiple,
            this.isGearDirectlyAdjacentToPower(gear),
            traitPowerNearAttackMultiplier(IMPLEMENTED_TRAIT_POOL, this.traitStacks),
        );
        const accountStar = this.currentHeroStars()[profile.heroId] || 1;
        const starAttack = bagLikeHeroBaseAttributeAtStar(config.atk, accountStar);
        const starHp = bagLikeHeroBaseAttributeAtStar(config.hp, accountStar);
        return {
            attack: scales.attack * (config.atk > 0 ? starAttack / config.atk : 1),
            hp: scales.hp * (config.hp > 0 ? starHp / config.hp : 1),
        };
    }

    private workerPowerPerTrigger(gear: Gear, powerPerTrigger: number): number {
        return resolveWorkerPowerPerTrigger(
            powerPerTrigger,
            this.isGearDirectlyAdjacentToPower(gear),
            traitPowerNearWorkerMultiplier(IMPLEMENTED_TRAIT_POOL, this.traitStacks),
        );
    }

    private isGearDirectlyAdjacentToPower(gear: Gear): boolean {
        const core = this.gears.find((item) => item.id === 'P01');
        return Boolean(core && isGearDirectlyAdjacentToCore(
            this.productionSources(),
            core.uid,
            gear.uid,
        ));
    }

    private spawnMonster(model: ModelId, round: RoundConfig): void {
        const base = UNITS[model];
        const config = base;
        const defeatScale = defeatCompensation(this.failedAttempts);
        const atkScale = (this.levelAtkMultiple / 10000) * (round.atkMultiple / 10000) * defeatScale;
        const hpScale = (this.levelHpMultiple / 10000) * (round.hpMultiple / 10000) * defeatScale;
        const positionRandom = this.developedValidationMode() === 'battle' ? this.visualFixtureRandom : Math.random;
        const y = positionRandom() * UNIT_Y_LIMIT * 2 - UNIT_Y_LIMIT;
        const xJitter = 2 * (positionRandom() - 0.5);
        const yJitter = 2 * (positionRandom() - 0.5);
        this.createUnit('enemy', config, HOME_X - 55 + xJitter, y + yJitter, atkScale, hpScale);
    }

    private createUnit(team: Team, cfg: UnitConfig, x: number, y: number, atkScale: number, hpScale: number): void {
        const node = this.makeNode(`${team}_${cfg.visualModelId || cfg.id}_${this.serial}`, this.unitLayer, x, y, 90, 110);
        if (team === 'enemy') node.setScale(-1, 1, 1);
        const fallback = node.addComponent(Graphics);
        fallback.fillColor = cfg.color;
        fallback.circle(0, 0, cfg.boss ? 31 : 24);
        fallback.fill();
        fallback.fillColor = CREAM;
        fallback.circle(team === 'self' ? 7 : -7, 4, 4);
        fallback.fill();
        const hpNode = this.makeNode('HpBar', node, 0, 48, 64, 10);
        const hpGraphics = hpNode.addComponent(Graphics);
        const traitHpMultiple = team === 'self' ? 1 + this.traitEffectAmount('hpIncrease', cfg) / 10000 : 1;
        const maxHp = cfg.hp * hpScale * traitHpMultiple;
        const warriorCombo = team === 'self'
            ? traitWarriorComboProfile(IMPLEMENTED_TRAIT_POOL, this.traitStacks, cfg.id.slice(0, 3))
            : null;
        const periodicHealRatio = team === 'self'
            ? this.traitEffectAmount('periodicSelfHeal', cfg)
            : 0;
        const shieldWall = team === 'self'
            ? traitH04ShieldWallProfile(IMPLEMENTED_TRAIT_POOL, this.traitStacks, cfg.id.slice(0, 3))
            : null;
        const transform = team === 'self'
            ? traitH03TransformProfile(IMPLEMENTED_TRAIT_POOL, this.traitStacks, cfg.id.slice(0, 3))
            : null;
        const barrage = team === 'self'
            ? traitH02BarrageProfile(IMPLEMENTED_TRAIT_POOL, this.traitStacks, cfg.id.slice(0, 3))
            : null;
        const laser = team === 'self'
            ? traitH03LaserProfile(IMPLEMENTED_TRAIT_POOL, this.traitStacks, cfg.id.slice(0, 3))
            : null;
        const unit: BattleUnit = {
            uid: ++this.serial,
            team,
            cfg,
            node,
            hpGraphics,
            fallback,
            skeleton: null,
            hp: maxHp,
            maxHp,
            shield: 0,
            atk: cfg.atk * atkScale,
            x,
            y,
            cooldown: team === 'enemy' ? 0.2 + this.battleRandom() * 0.25 : 0.2,
            dead: false,
            frozen: 0,
            barrage,
            barrageCooldown: barrage?.initialCooldownSeconds || 0,
            barrageCasting: false,
            barrageCooldownStarted: false,
            barrageElapsed: 0,
            barrageTarget: null,
            barrageLaunchAttack: 0,
            laser,
            laserCooldown: laser?.initialCooldownSeconds || 0,
            laserCasting: false,
            laserCooldownStarted: false,
            laserElapsed: 0,
            laserTarget: null,
            transform,
            transformRemaining: 0,
            transformDamageIncrease: 0,
            periodicHealRatio,
            periodicHealTimer: H04_PERIODIC_HEAL_INTERVAL_SECONDS,
            shieldWall,
            shieldWallCooldown: shieldWall ? H04_SHIELD_WALL_INTERVAL_SECONDS : 0,
            shieldWallRemaining: 0,
            warriorCombo,
            warriorComboCompletedAttacks: 0,
            warriorComboCriticalReady: false,
        };
        this.units.push(unit);
        this.loadSkeleton(unit);
        this.drawUnitHp(unit);
    }

    private loadSkeleton(unit: BattleUnit): void {
        if (!unit.cfg.spinePath) return;
        resources.load(unit.cfg.spinePath, sp.SkeletonData, (error, data) => {
            if (error || unit.dead || !unit.node.isValid) {
                if (error && this.fusionValidationMode()) console.error(`[fusion-validation] Spine load failed ${unit.cfg.spinePath}: ${error.message}`);
                return;
            }
            if (this.fusionValidationMode()) console.log(`[fusion-validation] Spine ready ${unit.cfg.spinePath}`);
            const skeletonNode = this.makeNode('Skeleton', unit.node, 0, -34, 100, 120);
            const skeleton = skeletonNode.addComponent(sp.Skeleton);
            skeleton.skeletonData = data;
            skeleton.premultipliedAlpha = false;
            skeletonNode.setScale(unit.cfg.spineScale, unit.cfg.spineScale, 1);
            unit.skeleton = skeleton;
            unit.fallback.enabled = false;
            this.playAnimation(unit, 'idle', true);
        });
    }

    private playAnimation(unit: BattleUnit, requested: 'idle' | 'run' | 'attack' | 'laser' | 'die', loop: boolean): void {
        const skeleton = unit.skeleton;
        if (!skeleton || !skeleton.isValid) return;
        const candidates: Record<string, string[]> = {
            idle: ['idle', 'daiji', 'animation'],
            run: ['move', 'run', 'walk', 'yidong', 'idle'],
            attack: ['attack', 'gongji', 'skill01', 'idle'],
            laser: ['skill01', 'attack', 'idle'],
            die: ['die', 'death', 'siwang', 'idle'],
        };
        for (const name of candidates[requested]) {
            try {
                if (skeleton.findAnimation(name)) {
                    const current = skeleton.getCurrent(0);
                    if (!current || current.animation?.name !== name) skeleton.setAnimation(0, name, loop);
                    return;
                }
            } catch {
                // Imported Spine versions can expose a smaller runtime API; the drawn fallback remains valid.
            }
        }
    }

    private completeRound(): void {
        this.phase = 'roundClear';
        this.clearUnits();
        this.gold += this.roundCoinRewards[this.roundIndex] || 0;
        this.claimAccountRoundReward(this.roundIndex + 1);
        this.scheduleOnce(() => {
            if (this.roundIndex >= this.rounds.length - 1) {
                this.finish(true);
                return;
            }
            this.roundIndex += 1;
            this.phase = 'deploy';
            this.freeRefreshUsed = false;
            this.dealPreparationBatch();
            this.tipLabel.string = `进入第 ${this.roundIndex + 1} 波准备：新候选需手动摆放`;
            this.applyPhaseLayout();
        }, 0.7);
    }

    private finish(won: boolean): void {
        if (won) {
            this.failedAttempts = 0;
            const completion = completeBagLikeAccountLevel(this.accountProfile, this.levelId);
            this.accountProfile = completion.profile;
            this.accountUnlockedThisAttempt = completion.unlocked;
            this.persistAccountProfile(false);
        }
        else this.failedAttempts += 1;
        this.phase = won ? 'won' : 'lost';
        this.paused = false;
        this.traitLayer.active = false;
        this.clearUnits();
        this.prepareLayer.active = false;
        this.resultLayer.active = true;
        this.resultTitleLabel.string = won ? '关卡胜利' : '关卡失败';
        const unlockedText = this.accountUnlockedThisAttempt.length > 0
            ? `\n新英雄解锁：${this.accountUnlockedThisAttempt.map((family) => ACCOUNT_HERO_NAMES[family]).join('、')}`
            : '';
        this.resultBodyLabel.string = won
            ? `${this.rounds.length} 波敌人已经全部清除\n账号奖励：${this.accountAttemptRewardText()}${unlockedText}`
            : `我方兵营已被摧毁\n下次敌军属性降至 ${Math.round(defeatCompensation(this.failedAttempts) * 100)}%`;
        this.resultNextButtonLabel.node.parent!.active = won && this.levelId < BAGLIKE_LAST_LEVEL_ID;
        this.resultNextButtonLabel.string = this.levelId < BAGLIKE_LAST_LEVEL_ID
            ? `进入第 ${bagLikeLevelNumber(this.levelId + 1)} 关`
            : '全部通关';
        this.tipLabel.string = won ? `${this.levelName}已通关：${this.rounds.length} 波敌人全部清除` : '我方兵营被摧毁，调整齿轮后重试';
    }

    private clearUnits(): void {
        for (const unit of this.units) {
            unit.dead = true;
            if (unit.node.isValid) unit.node.destroy();
        }
        this.units = [];
        this.pendingHits = [];
        this.productionJobs = [];
        this.traces = [];
        for (const visual of this.projectileVisuals) {
            if (visual.node.isValid) visual.node.destroy();
        }
        for (const visual of this.hitEffectVisuals) {
            if (visual.node.isValid) visual.node.destroy();
        }
        this.projectileVisuals = [];
        this.hitEffectVisuals = [];
    }

    private addTrace(attacker: BattleUnit, x: number, y: number, fromX = attacker.x, fromY = attacker.y): void {
        this.traces.push({
            x1: fromX,
            y1: fromY,
            x2: x,
            y2: y,
            life: 0.11,
            color: attacker.team === 'self' ? GOLD : RED,
        });
    }

    private addDamageText(damage: number, x: number, y: number): void {
        const label = this.makeLabel(`Damage_${this.serial}`, this.unitLayer, x, y, 100, 30, `-${damage}`, 19, damage >= 25 ? GOLD : WHITE);
        this.floatingTexts.push({ node: label.node, label, life: 0.7 });
    }

    private addHealText(amount: number, x: number, y: number): void {
        const label = this.makeLabel(`Heal_${this.serial}`, this.unitLayer, x, y, 100, 30, `+${amount}`, 19, GREEN);
        this.floatingTexts.push({ node: label.node, label, life: 0.7 });
    }

    private stepEffects(dt: number): void {
        for (const trace of this.traces) trace.life -= dt;
        this.traces = this.traces.filter((trace) => trace.life > 0);
        for (const floating of this.floatingTexts) {
            floating.life -= dt;
            floating.node.setPosition(floating.node.position.x, floating.node.position.y + dt * 42);
            floating.label.color = new Color(floating.label.color.r, floating.label.color.g, floating.label.color.b, Math.max(0, floating.life / 0.7) * 255);
            if (floating.life <= 0 && floating.node.isValid) floating.node.destroy();
        }
        this.floatingTexts = this.floatingTexts.filter((floating) => floating.life > 0);
        for (const visual of this.projectileVisuals) {
            let activeDt = dt;
            if (visual.delay > 0) {
                visual.delay -= dt;
                if (visual.delay > 0) continue;
                activeDt = -visual.delay;
                visual.delay = 0;
                visual.node.active = true;
            }
            visual.elapsed += activeDt;
            const progress = Math.min(1, visual.elapsed / visual.duration);
            visual.node.setPosition(
                visual.fromX + (visual.toX - visual.fromX) * progress,
                visual.fromY + (visual.toY - visual.fromY) * progress,
            );
            if (progress >= 1 && visual.node.isValid) visual.node.destroy();
        }
        this.projectileVisuals = this.projectileVisuals.filter((visual) => visual.elapsed < visual.duration);
        for (const visual of this.hitEffectVisuals) {
            visual.elapsed += dt;
            const frameIndex = Math.floor(visual.elapsed / visual.frameSeconds);
            if (frameIndex >= visual.frames.length) {
                if (visual.node.isValid) visual.node.destroy();
            } else {
                visual.sprite.spriteFrame = visual.frames[frameIndex];
            }
        }
        this.hitEffectVisuals = this.hitEffectVisuals.filter(
            (visual) => visual.elapsed < visual.frames.length * visual.frameSeconds,
        );
        for (const unit of this.units) this.drawUnitHp(unit);
    }

    private drawEffects(): void {
        const g = this.effectGraphics;
        g.clear();
        for (const trace of this.traces) {
            g.strokeColor = new Color(trace.color.r, trace.color.g, trace.color.b, 220);
            g.lineWidth = 4;
            g.moveTo(trace.x1, trace.y1 + 8);
            g.lineTo(trace.x2, trace.y2 + 8);
            g.stroke();
        }
    }

    private drawUnitHp(unit: BattleUnit): void {
        const g = unit.hpGraphics;
        g.clear();
        const ratio = Math.max(0, unit.hp / unit.maxHp);
        g.fillColor = new Color(30, 34, 34, 210);
        g.roundRect(-32, -5, 64, 10, 5);
        g.fill();
        g.fillColor = unit.team === 'self' ? GREEN : RED;
        g.roundRect(-30, -3, 60 * ratio, 6, 3);
        g.fill();
    }

    private drawHomes(): void {
        this.drawHomeBar(this.selfHomeGraphics, this.selfHp / this.levelHomeHp, BLUE);
        const ratio = Math.max(0, this.selfHp / this.levelHomeHp);
        const g = this.backpackHpGraphics;
        g.clear();
        g.fillColor = new Color(19, 24, 35, 255);
        g.rect(-340, -15, 680, 30);
        g.fill();
        g.strokeColor = new Color(8, 12, 20, 255);
        g.lineWidth = 4;
        g.rect(-340, -15, 680, 30);
        g.stroke();
        g.fillColor = new Color(72, 194, 91, 255);
        g.rect(-333, -8, 666 * ratio, 16);
        g.fill();
        this.backpackHpLabel.string = `♥ ${Math.ceil(this.selfHp)}`;
    }

    private drawHomeBar(g: Graphics, ratio: number, color: Color): void {
        g.clear();
        g.fillColor = new Color(29, 34, 35, 230);
        g.roundRect(-62, 64, 124, 15, 7);
        g.fill();
        g.fillColor = color;
        g.roundRect(-59, 67, 118 * Math.max(0, ratio), 9, 4);
        g.fill();
    }

    private refreshUi(): void {
        const phaseText: Record<Phase, string> = {
            deploy: '布阵阶段',
            battle: '战斗中',
            trait: '选择激活特性',
            roundClear: '本波清理完毕',
            won: '关卡胜利',
            lost: '关卡失败',
        };
        this.phaseLabel.string = phaseText[this.phase];
        this.roundLabel.string = `${Math.min(this.roundIndex + 1, this.rounds.length)}/${this.rounds.length}波`;
        this.goldLabel.string = `${this.gold}`;
        this.selfHpLabel.string = `我方兵营 ${Math.ceil(this.selfHp)} / ${this.levelHomeHp}`;
        this.objectiveLabel.string = this.phase === 'battle' || this.phase === 'trait' ? `剩余敌人 ${this.units.filter((unit) => unit.team === 'enemy' && !unit.dead).length}` : '目标：清除全部敌人';
        this.actionLabel.string =
            this.phase === 'deploy'
                ? `开始第 ${this.roundIndex + 1} 波`
                : this.phase === 'won' || this.phase === 'lost'
                  ? '重新挑战'
                  : '战斗进行中';
        this.refreshLabel.string = this.normalRefreshTimes === 0 ? '免费刷新' : `刷新 ${REFRESH_COST}`;
        this.refreshLabel.color = this.phase === 'deploy' ? CREAM : new Color(170, 170, 170, 255);
        this.adRefreshLabel.string = this.freeRefreshUsed ? '广告刷新 0/1' : '广告刷新 1/1';
        this.adRefreshLabel.color = this.phase === 'deploy' && !this.freeRefreshUsed ? CREAM : new Color(170, 170, 170, 255);
        this.pauseLabel.string = '';
        this.levelButtonLabel.string = `第 ${bagLikeLevelNumber(this.levelId)} 关`;
        for (const gear of [...this.gears, ...this.candidates]) {
            const headKey = this.gearHeadKey(gear.id);
            const progressFill = headKey
                ? gear.node.getChildByName(`GearPortrait_${headKey}`)?.getChildByName('WorkerProgressFill')?.getComponent(Sprite)
                : null;
            // Cocos 3.8's filled assembler assumes a live frame whenever fillRange is
            // assigned. The portrait is loaded asynchronously, so skip early frames and
            // avoid forcing an identical UV rebuild on every update tick.
            if (progressFill?.spriteFrame?.texture) {
                const nextProgress = this.workerProgressRatio(gear);
                if (Math.abs(progressFill.fillRange - nextProgress) > 0.0001) {
                    progressFill.fillRange = nextProgress;
                }
            }
            const label = gear.node.getChildByName('ProductionRate')?.getComponent(Label);
            if (!label) continue;
            const rate = this.productionRateForGear(gear).toFixed(2);
            label.string = `${rate}/s`;
        }
        this.drawExpBar();
    }

    private drawExpBar(): void {
        if (!this.expGraphics) return;
        const target = expTargetForLevel(this.bagLikeLevel);
        const ratio = Math.max(0, Math.min(1, this.bagLikeExp / target));
        const g = this.expGraphics;
        g.clear();
        g.fillColor = new Color(15, 18, 23, 245);
        g.roundRect(-322, -14, 644, 28, 4);
        g.fill();
        g.strokeColor = new Color(4, 5, 8, 255);
        g.lineWidth = 4;
        g.roundRect(-322, -14, 644, 28, 4);
        g.stroke();
        if (ratio > 0) {
            g.fillColor = new Color(63, 181, 84, 255);
            g.roundRect(-317, -9, 634 * ratio, 18, 3);
            g.fill();
        }
        if (this.expLevelLabel) this.expLevelLabel.string = `${this.bagLikeLevel}`;
        if (this.expValueLabel) this.expValueLabel.string = `${Math.floor(this.bagLikeExp)} / ${target}`;
    }

    private gridPosition(row: number, col: number): { x: number; y: number } {
        return { x: GRID_LEFT + col * GRID_CELL, y: GRID_TOP - row * GRID_CELL + this.gridOffsetY };
    }

    private positionToGrid(x: number, y: number): { row: number; col: number } | null {
        const col = Math.round((x - GRID_LEFT) / GRID_CELL);
        const row = Math.round((GRID_TOP + this.gridOffsetY - y) / GRID_CELL);
        if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return null;
        const pos = this.gridPosition(row, col);
        if (Math.abs(pos.x - x) > 48 || Math.abs(pos.y - y) > 48) return null;
        return { row, col };
    }

    private makeNode(name: string, parent: Node, x: number, y: number, width: number, height: number): Node {
        const node = new Node(name);
        parent.addChild(node);
        node.setPosition(x, y, 0);
        const transform = node.addComponent(UITransform);
        transform.setContentSize(width, height);
        transform.setAnchorPoint(0.5, 0.5);
        return node;
    }

    private makeLabel(
        name: string,
        parent: Node,
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        fontSize: number,
        color: Color,
        align: HorizontalTextAlignment = HorizontalTextAlignment.CENTER,
    ): Label {
        const node = this.makeNode(name, parent, x, y, width, height);
        const label = node.addComponent(Label);
        label.string = text;
        if (this.originalFont) label.font = this.originalFont;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 5;
        label.color = color;
        label.horizontalAlign = align;
        label.verticalAlign = VerticalTextAlignment.CENTER;
        label.overflow = Label.Overflow.SHRINK;
        return label;
    }

    private makeButton(
        name: string,
        parent: Node,
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        handler: () => void,
    ): Label {
        const node = this.makeNode(name, parent, x, y, width, height);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = GREEN_DARK;
        graphics.roundRect(-width / 2, -height / 2, width, height, 15);
        graphics.fill();
        graphics.strokeColor = new Color(179, 222, 151, 255);
        graphics.lineWidth = 3;
        graphics.roundRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4, 13);
        graphics.stroke();
        node.addComponent(Button);
        node.on(Button.EventType.CLICK, handler, this);
        const label = this.makeLabel(`${name}Label`, node, 0, 0, width - 16, height - 10, text, 17, CREAM);
        this.applyOriginalOutline(label, new Color(0, 0, 0, 255), 3);
        return label;
    }

    private makeHudCounter(
        name: string,
        parent: Node,
        x: number,
        y: number,
        width: number,
        iconFrame: BagLikeAtlasFrame,
        value: string,
    ): Label {
        const node = this.makeNode(name, parent, x, y, width, 40);
        const background = this.makeNode(`${name}OriginalBackground`, node, 5, 0, width - 10, 40);
        background.setSiblingIndex(0);
        this.attachRecoveredAtlasSprite(background, 'original/comm_0/spriteFrame', COMM_ATLAS_FRAMES.headerCounter);
        const iconX = -width / 2 + 22;
        const iconNode = this.makeNode(`${name}OriginalIcon`, node, iconX, 0, 54, 54);
        this.attachRecoveredAtlasSprite(iconNode, 'original/item/spriteFrame', iconFrame);
        const label = this.makeLabel(`${name}Value`, node, 23, 0, width - 58, 38, value, 24, WHITE);
        this.applyOriginalOutline(label, new Color(6, 5, 0, 255), 2);
        return label;
    }

    private applyOriginalOutline(label: Label, color: Color, width: number): void {
        label.enableOutline = true;
        label.outlineColor = color;
        label.outlineWidth = width;
    }

    private restyleButton(label: Label, fill: Color, stroke: Color): void {
        const node = label.node.parent!;
        const transform = node.getComponent(UITransform)!;
        const width = transform.contentSize.width;
        const height = transform.contentSize.height;
        const graphics = node.getComponent(Graphics)!;
        graphics.clear();
        graphics.fillColor = fill;
        graphics.roundRect(-width / 2, -height / 2, width, height, 15);
        graphics.fill();
        graphics.strokeColor = stroke;
        graphics.lineWidth = 4;
        graphics.roundRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4, 13);
        graphics.stroke();
    }
}
