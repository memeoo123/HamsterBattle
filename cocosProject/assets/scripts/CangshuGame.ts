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
    mechanicsFirstDefeatCompensation,
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
    gearRotationAngleDegrees,
    powerCoreBattleRotationAngleDegrees,
    HAMSTER_SPAWN_FLIGHT_SECONDS,
    isGearDirectlyAdjacentToCore,
    P01_ROUND_START_PRODUCTIVITY_SECONDS,
    p01RoundStartProductivity,
    POWER_CONTACT_DELAY_SECONDS,
    POWER_QUARTER_LAP_SECONDS,
    powerContactsByGear,
    productionRatePerSecond,
    resolveProducerAttributeScales,
    resolveWorkerPowerPerTrigger,
    unitPresentationBackToFront,
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
    beginCandidatePreparationRound,
    candidateNormalRefreshCost,
    candidateRewardModifiersForRefresh,
    candidateTrayLayout,
    CandidateGearId,
    CandidateRefreshType,
    candidateDrawIds,
    completeCandidateRefresh,
    drawDynamicCandidateBatch,
    displacedPlacementUids,
    gearMergeTargetScore,
    placementAreaValid,
    placementCells,
    resolveGridDrop,
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
    bagLikeProducerRolePosition,
    bagLikeProducerShape,
    bagLikeShapeRolePosition,
    bagLikeWheelHomeHpContribution,
    BagLikePrimarySkillId,
    BagLikeProducerProfile,
} from './BagLikeUnitProgression';
import {
    bagLikeFusionMissingRequirements,
    bagLikeFusionRecipe,
    bagLikeFusionRequirementsMet,
    newlyUnlockedBagLikeFusions,
} from './BagLikeFusion';
import {
    VISUAL_ENEMY_ROSTER,
    VISUAL_GEAR_ROSTER,
    VISUAL_GEAR_SHAPES,
    VisualEnemyEntry,
    VisualGearEntry,
} from './VisualRoster';
import {
    bagLikeFusionActiveProfile,
    bagLikeFusionPrimaryBulletProfile,
    bagLikeH15KillCoins,
    bagLikeH15RoundEndCoins,
    BagLikeFusionActiveProfile,
    BagLikeFusionPrimaryBulletProfile,
} from './BagLikeFusionHeroMechanics';
import {
    directBattleBypassesProgression,
    directBootLevelId,
    enterNormalLevel,
    latestMainLevelId,
    NORMAL_LEVEL_ENERGY_COST,
    playableLevelCards,
    PlayableLevelCard,
} from './MainLevelFlow';
import {
    OUT_OF_BATTLE_BOX_EXP_PER_DRAW,
    OUT_OF_BATTLE_BOX_LEVEL_MAX,
    OUT_OF_BATTLE_BOX_ONE_DRAW_DIAMONDS,
    OUT_OF_BATTLE_BOX_TEN_DRAW_DIAMONDS,
    OUT_OF_BATTLE_DAILY_CHALLENGE_COST_ENERGY,
    OUT_OF_BATTLE_DAILY_CHALLENGE_TIMES,
    OUT_OF_BATTLE_DAILY_EFFECTS,
    OUT_OF_BATTLE_DAILY_INSTANCES,
    OUT_OF_BATTLE_DAILY_REWARD_ROUNDS,
    OUT_OF_BATTLE_DAILY_RULES,
    OUT_OF_BATTLE_DAILY_ACTIVE_REWARDS,
    OUT_OF_BATTLE_DAILY_SHOP_AD_REFRESH_MAX,
    OUT_OF_BATTLE_DAILY_TASKS,
    OUT_OF_BATTLE_ENDLESS,
    OUT_OF_BATTLE_GAMEPLAYS,
    OUT_OF_BATTLE_POWER_LEVEL_ONE_COST,
    OUT_OF_BATTLE_POWER_ROLES,
    OUT_OF_BATTLE_POWER_STAR_MAX,
    OUT_OF_BATTLE_POWER_STAR_ZERO_COST,
    OUT_OF_BATTLE_SEVEN_DAY_REWARDS,
    OUT_OF_BATTLE_SHOP_GOODS,
    OUT_OF_BATTLE_SHOP_NAMES,
    OUT_OF_BATTLE_TABS,
    OutOfBattlePowerRole,
    OutOfBattleShopGood,
    OutOfBattleTabName,
    outOfBattlePowerAbilities,
    outOfBattleSystemUnlockLevel,
    outOfBattleSystemUnlocked,
    purchaseOutOfBattleShopGood,
} from './OutOfBattleConfig';
import {
    advanceEnemySpecialCast,
    assassinateDestination,
    buildNormalLevelRuntimeConfig,
    buildNormalEnemyMechanicsProfiles,
    ItemReward,
    normalLevelFailedAttempts,
    normalLevelRetryState,
    NormalMonsterRow,
    resolveNormalBattleOutcome,
    resolveNormalRoundCompletion,
    selectFarthestEnemySkillTarget,
} from './NormalLevelRuntime';
import {
    canStartSpecialMode,
    claimDailyMilestone,
    currentDailyInstance,
    currentDailyRotation,
    dailyEnemyDamageResistance,
    dailyEnemyMoveMultiplier,
    dailyExtraRoundId,
    dailyHeroAttackMultiplier,
    dailyProductionCount,
    dailyRefreshCost,
    dailyRewardForProgress,
    loadSpecialModeState,
    mergeDailyRound,
    saveSpecialModeState,
    settleDailyChallenge,
    settleEndlessChallenge,
    SpecialMode,
    SpecialModeState,
    SpecialModeTable,
    spendSpecialModeEnergy,
} from './SpecialModeRuntime';
import {
    canBuyDiamondShopEnergy,
    canClaimMockShopEnergy,
    completeMockAdvertisement,
    loadMockAdvertisementState,
    MockAdvertisementState,
    MockAdOutcome,
    MockAdPlacement,
    mockAdvertisementOutcomeFromSearch,
    mockAdvertisementPlacementCount,
    mockAdvertisementPlacementLabel,
    saveMockAdvertisementState,
} from './MockAdvertisement';
import {
    activatePowerRole,
    claimPowerRoleFreeLevel,
    claimPowerRoleFreeFragments,
    equipPowerRole,
    loadPowerRoleState,
    POWER_ROLE_IDS,
    POWER_ROLE_DAILY_FREE_FRAGMENT_TIMES,
    POWER_ROLE_DAILY_FREE_LEVEL_TIMES,
    POWER_ROLE_FREE_FRAGMENT_COUNT,
    POWER_ROLE_MAX_LEVEL,
    POWER_ROLE_MAX_STAR,
    POWER_ROLE_STAR_COSTS,
    powerRoleLevelLimit,
    PowerRoleId,
    PowerRoleState,
    savePowerRoleState,
    upgradePowerRoleStar,
} from './PowerRoleProgression';
import {
    addPowerRoleEnergy,
    p01StartRewardGearLevel,
    p03ActiveHealBasisPoints,
    p04DamageBasisPointsAtHit,
    p04KillProductivityBasisPoints,
    p04KillProductivityCap,
    P04_MAX_HITS,
    POWER_ROLE_ACTIVE_ENERGY_COST,
    POWER_ROLE_ACTIVE_ENERGY_MAX,
    POWER_ROLE_ACTIVE_SECONDS,
    powerRoleActiveAvailable,
    powerRoleActiveBasisPoints,
    powerRoleGlobalAttackBasisPoints,
    powerRoleRoundStartProductivityBasisPoints,
} from './PowerRoleBattle';

const { ccclass, property } = _decorator;

type Team = 'self' | 'enemy';
type Phase = 'deploy' | 'battle' | 'trait' | 'roundClear' | 'won' | 'lost';
type ModelId = string;
type GearId = CandidateGearId
    | 'P01'
    | 'H0104'
    | 'H0204'
    | 'H0304'
    | 'H0404'
    | 'H0504'
    | 'H0604'
    | 'H1104'
    | 'H1204'
    | 'H1304'
    | 'H1404'
    | 'H1604'
    | 'H1704'
    | 'H0705'
    | 'H0805'
    | 'H0905'
    | 'H1005'
    | 'H1505'
    | 'H1805'
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
    H1401: { x: 85, y: 261, width: 86, height: 66, offsetX: -2, offsetY: -3 },
    H1601: { x: 85, y: 1495, width: 78, height: 74, offsetX: 0, offsetY: 0 },
    H1602: { x: 85, y: 1571, width: 78, height: 74, offsetX: 0, offsetY: 0 },
    H1603: { x: 173, y: 1269, width: 78, height: 74, offsetX: 0, offsetY: 0 },
    H1604: { x: 85, y: 1341, width: 80, height: 76, offsetX: 0, offsetY: 0 },
    H1701: { x: 93, y: 867, width: 62, height: 88, offsetX: 0, offsetY: 0 },
    H0705: { x: 165, y: 1499, width: 78, height: 70, offsetX: 0, offsetY: 1 },
    H0805: { x: 175, y: 957, width: 76, height: 76, offsetX: 1, offsetY: 1 },
    H0905: { x: 169, y: 727, width: 82, height: 70, offsetX: 1, offsetY: 1 },
    H1005: { x: 171, y: 491, width: 80, height: 80, offsetX: -2, offsetY: 1 },
    H1101: { x: 165, y: 1571, width: 72, height: 70, offsetX: 0, offsetY: 1 },
    H1505: { x: 85, y: 647, width: 82, height: 76, offsetX: 0, offsetY: 0 },
    H1805: { x: 93, y: 957, width: 80, height: 78, offsetX: 0, offsetY: 0 },
    P01: { x: 167, y: 1345, width: 78, height: 74, offsetX: 0, offsetY: 0 },
    P02: { x: 175, y: 1035, width: 76, height: 76, offsetX: -1, offsetY: 3 },
    P03: { x: 87, y: 1269, width: 84, height: 70, offsetX: -1, offsetY: 1 },
    P04: { x: 85, y: 409, width: 84, height: 78, offsetX: 0, offsetY: 0 },
    coin: { x: 177, y: 259, width: 70, height: 68, offsetX: 0, offsetY: 0 },
};

// Exact FairyGUI atlas rectangles recovered from bagLike.a597d.bin. The five
// 110x110 sprites are ui://bagLike/cl1..cl5 in merge-level order.
const GEAR_BODY_FRAMES: Readonly<Record<number, Rect>> = {
    1: new Rect(1024, 1, 110, 110),
    2: new Rect(775, 117, 110, 110),
    3: new Rect(887, 117, 110, 110),
    4: new Rect(439, 262, 110, 110),
    5: new Rect(551, 262, 110, 110),
};

type BattleNumberGlyph = {
    rect: Rect;
    offset: Vec2;
};

// Exact glyph rectangles decoded from resources2/ui/battleNum. Normal damage
// uses Font_white2; healing uses Font_green2. Every glyph has a 22x28 source
// cell, matching the original bitmap-font metrics.
const BATTLE_NUMBER_GLYPHS: Readonly<Record<'white' | 'green', Readonly<Record<string, BattleNumberGlyph>>>> = {
    white: {
        '0': { rect: new Rect(25, 226, 22, 28), offset: new Vec2(0, 0) },
        '1': { rect: new Rect(182, 226, 18, 27), offset: new Vec2(2, 1) },
        '2': { rect: new Rect(119, 57, 22, 28), offset: new Vec2(0, 0) },
        '3': { rect: new Rect(190, 85, 21, 28), offset: new Vec2(1, 0) },
        '4': { rect: new Rect(43, 144, 22, 27), offset: new Vec2(0, 1) },
        '5': { rect: new Rect(86, 170, 21, 27), offset: new Vec2(1, 1) },
        '6': { rect: new Rect(72, 215, 21, 27), offset: new Vec2(0, 1) },
        '7': { rect: new Rect(109, 170, 21, 27), offset: new Vec2(1, 1) },
        '8': { rect: new Rect(143, 56, 22, 28), offset: new Vec2(0, 0) },
        '9': { rect: new Rect(43, 114, 21, 28), offset: new Vec2(0, 0) },
        '-': { rect: new Rect(199, 173, 17, 12), offset: new Vec2(3, 8) },
        '+': { rect: new Rect(135, 116, 21, 21), offset: new Vec2(1, 4) },
    },
    green: {
        '0': { rect: new Rect(89, 112, 21, 27), offset: new Vec2(1, 1) },
        '1': { rect: new Rect(183, 196, 17, 27), offset: new Vec2(3, 1) },
        '2': { rect: new Rect(190, 56, 22, 27), offset: new Vec2(0, 1) },
        '3': { rect: new Rect(119, 87, 22, 27), offset: new Vec2(0, 1) },
        '4': { rect: new Rect(166, 86, 22, 27), offset: new Vec2(0, 1) },
        '5': { rect: new Rect(67, 141, 21, 27), offset: new Vec2(0, 1) },
        '6': { rect: new Rect(118, 199, 20, 27), offset: new Vec2(1, 1) },
        '7': { rect: new Rect(139, 228, 20, 27), offset: new Vec2(2, 1) },
        '8': { rect: new Rect(214, 61, 22, 27), offset: new Vec2(0, 1) },
        '9': { rect: new Rect(90, 141, 21, 27), offset: new Vec2(1, 1) },
        '-': { rect: new Rect(202, 227, 17, 11), offset: new Vec2(3, 11) },
        '+': { rect: new Rect(43, 202, 21, 21), offset: new Vec2(1, 4) },
    },
};

type BagLikeAtlasFrame = {
    rect: Rect;
    sourceSize: Size;
    offset?: readonly [x: number, y: number];
    insets?: readonly [left: number, top: number, right: number, bottom: number];
};

// Exact image records and 9-slice borders decoded from bagLike.a597d.bin.
const BAGLIKE_ATLAS_FRAMES: Readonly<Record<string, BagLikeAtlasFrame>> = {
    powerCore: {
        // FairyGUI bagLike/power1.png: the exact gold power gear used behind
        // the independently animated equipped hamster model.
        rect: new Rect(775, 341, 108, 102),
        sourceSize: new Size(114, 114),
    },
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
    hpHeart: {
        // bagLike/xl_icon.png, used by HpShieldBar at x=292, y=16.
        rect: new Rect(439, 374, 32, 27),
        sourceSize: new Size(32, 27),
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
    traitDescription: {
        rect: new Rect(1203, 439, 46, 46),
        sourceSize: new Size(46, 46),
        insets: [20, 20, 20, 20],
    },
    playIcon: {
        rect: new Rect(1336, 445, 44, 45),
        sourceSize: new Size(50, 50),
        offset: [3, 3],
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

// Exact SpriteFrame records decoded from the original resources3 image/main
// atlas. These replace the temporary single-character main-tab glyphs.
const MAIN_TAB_ICON_FRAMES: Readonly<Record<OutOfBattleTabName, BagLikeAtlasFrame>> = {
    商店: {
        rect: new Rect(1, 309, 92, 88),
        sourceSize: new Size(110, 110),
        offset: [0, 1],
    },
    角色: {
        rect: new Rect(1, 215, 90, 92),
        sourceSize: new Size(110, 110),
        offset: [0, -2],
    },
    战斗: {
        rect: new Rect(1, 1, 102, 110),
        sourceSize: new Size(110, 110),
    },
    培养: {
        rect: new Rect(1, 113, 92, 100),
        sourceSize: new Size(110, 110),
        offset: [0, -1],
    },
    活动: {
        rect: new Rect(105, 1, 110, 84),
        sourceSize: new Size(110, 110),
        offset: [0, -1],
    },
};

// MainPageTabItemConfig rows 6-11 bind these exact resource paths to the
// out-of-battle side entries. Geometry is decoded from image/main.
const MAIN_SIDE_ICON_FRAMES: Readonly<Record<string, BagLikeAtlasFrame>> = {
    community: { rect: new Rect(169, 315, 78, 82), sourceSize: new Size(90, 90) },
    settings: { rect: new Rect(95, 309, 72, 74), sourceSize: new Size(90, 90), offset: [-2, 2] as const },
    dailyTask: { rect: new Rect(177, 399, 62, 70), sourceSize: new Size(90, 90), offset: [-2, 2] as const },
    sevenDay: { rect: new Rect(93, 231, 74, 76), sourceSize: new Size(90, 90) },
    invitation: { rect: new Rect(95, 143, 88, 86), sourceSize: new Size(90, 90) },
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
    monsterType?: string;
    gold?: number;
    exp?: number;
    productionGearId?: string;
    productionLevel?: number;
    productionSkillId?: BagLikePrimarySkillId;
    visualModelId?: string;
    focusHome?: boolean;
    selfDestructRadius?: number;
    knockbackDistance?: number;
    assassinate?: boolean;
    assassinatePreCooldown?: number;
    assassinateCooldown?: number;
    assassinateDistance?: number;
    enemySpecialAttack?: 'line' | 'self-area';
    enemySpecialPreCooldown?: number;
    enemySpecialCooldown?: number;
    enemySpecialCastTime?: number;
    enemySpecialBehaviorDelay?: number;
    enemySpecialEffectRatio?: number;
    enemySpecialRadius?: number;
    enemySpecialWidth?: number;
    enemySpecialHeight?: number;
    multiHitDelays?: number[];
    fusionActive?: BagLikeFusionActiveProfile;
    fusionPrimaryBullet?: BagLikeFusionPrimaryBulletProfile;
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
    chapter?: number;
    name: string;
    fightscene: string;
    homeHp: number;
    enemyHomeHp?: number;
    enemyHomeGold?: number;
    atkMultiple: number;
    hpMultiple: number;
    roundIds: number[];
    recommendHeroIds?: string[];
    initRewards?: ItemReward[] | null;
    staticBuffs?: Array<{ k: number; v: string }> | null;
    staticBricks?: string[][] | null;
};

type RoundTableRow = {
    id: number;
    monsterTimes: number[];
    monsterIds: string[];
    atkMultiple: number;
    hpMultiple: number;
    coinRewards?: ItemReward[] | null;
};

type NormalLevelTable = {
    source: string;
    levels: LevelTableRow[];
    rounds: Record<string, RoundTableRow>;
    monsters: Record<string, NormalMonsterRow>;
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
    rotationElapsed: number;
    rotationDuration: number;
    rotationActive: boolean;
    rotationTriggerCount: number;
};

type BattleUnit = {
    uid: number;
    team: Team;
    cfg: UnitConfig;
    node: Node;
    shadow: Node;
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
    enemySpecialCooldown: number;
    enemySpecialCasting: boolean;
    enemySpecialElapsed: number;
    enemySpecialBehaviorTriggered: boolean;
    enemySpecialTarget: BattleUnit | null;
    fusionActiveCooldown: number;
    fusionActiveCastRemaining: number;
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

type PendingFusionSkillHit = {
    timer: number;
    attacker: BattleUnit;
    profile: BagLikeFusionActiveProfile;
    effectRatio: number;
    target: BattleUnit;
    launchAttack: number;
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
    sprites: Sprite[];
    fallbackLabel: Label | null;
    elapsed: number;
    startY: number;
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
    angularSpeedDegrees?: number;
    arcHeight?: number;
    orientToPath?: boolean;
    orientationOffsetDegrees?: number;
    sprite?: Sprite;
    frames?: SpriteFrame[];
    frameSeconds?: number;
};

// Exact SpriteFrame records decoded from image/quality's serialized Cocos
// SpriteAtlas. PowerConfig maps P01 to quality 3 (blue) and P02-P04 to quality
// 4 (purple).
const POWER_ROLE_QUALITY_FRAMES: Readonly<Record<3 | 4, {
    hero: BagLikeAtlasFrame;
    level: BagLikeAtlasFrame;
    shape: BagLikeAtlasFrame;
}>> = {
    3: {
        hero: { rect: new Rect(1, 1, 216, 284), sourceSize: new Size(216, 284) },
        level: { rect: new Rect(1509, 373, 38, 40), sourceSize: new Size(38, 40) },
        shape: { rect: new Rect(1309, 193, 58, 58), sourceSize: new Size(58, 58) },
    },
    4: {
        hero: { rect: new Rect(873, 1, 216, 283), sourceSize: new Size(216, 283) },
        level: { rect: new Rect(1471, 415, 38, 40), sourceSize: new Size(38, 40) },
        shape: { rect: new Rect(1337, 349, 58, 58), sourceSize: new Size(58, 58) },
    },
};

// HeroMainView and HeroItem setup_beforeAdd geometry decoded from
// ui_hero.package.bin. The list is FlowHorizontal with 10 px column gap,
// 18 px line gap and three columns inside x=31,y=200,w=698,h=1000.
const HERO_FAIRYGUI_LAYOUT = {
    list: { x: 31, y: 200, width: 698, height: 1000, columns: 3, columnGap: 10, lineGap: 18 },
    item: { width: 226, height: 326 },
    background: { x: 0, y: 4, width: 216, height: 322 },
    portrait: { x: 108, y: 129, width: 130, height: 130 },
    shape: { x: 168, y: 0, width: 58, height: 58 },
    levelBar: { x: 14, y: 231, width: 188, height: 40 },
    fragmentBar: { x: 14, y: 277, width: 188, height: 28 },
    name: { x: 107, y: 42, width: 107, height: 36 },
    level: { x: 108, y: 251, width: 80, height: 34 },
} as const;

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
const LONG_RUN_VALIDATION_SPEED = 90;
const GRID_FACE_SIZE = 84;
const GRID_TOP = 252;
const GRID_LEFT = -300;
const GRID_ROWS = 5;
const GRID_COLS = 7;
const POWER_INDEX = 17;
const DEFAULT_LEVEL_ID = 1004;
// FrameAnim in the recovered version-18 runtime initializes perFrameTime to
// 66.6ms. Sprite-frame effects therefore advance at about 15fps.
const ORIGINAL_EFFECT_FRAME_SECONDS = 0.0666;
type ResourceAuditCategory = 'hero' | 'power-role' | 'monster' | 'projectile' | 'effect';
type ResourceAuditStatus = 'loaded' | 'static-fallback' | 'file-missing';
type ResourceAuditRecord = {
    category: ResourceAuditCategory;
    id: string;
    resourcePath: string | null;
    status: ResourceAuditStatus;
    detail: string;
};
const RECOVERED_PROJECTILE_PRESENTATION_IDS = new Set([
    'H0601', 'H1401', 'H1701',
    'M03', 'Boss03', 'M09', 'Boss09', 'M10', 'Boss10',
]);
// The recovered battle screenshot shows the first four 100401 schedule entries,
// with the 4.001s monster only just inside the field. Freeze the browser-only
// developed fixture at the matching timestamp so delayed captures stay stable.
const DEVELOPED_BATTLE_ELAPSED_SECONDS = 4.01;
const DEVELOPED_BATTLE_SPAWN_Y = [0, -125, 125, -45] as const;

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

const UNITS: Record<string, UnitConfig> = {
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
    H0501: {
        id: 'H0501',
        name: '仓鼠召唤师',
        atk: 30,
        hp: 128,
        range: 150,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 10000,
        attackDelay: 0.3,
        spinePath: 'spine/H0501/js_lieren_1',
        spineScale: 0.8,
        color: new Color(107, 174, 92, 255),
    },
    H0601: {
        id: 'H0601',
        name: '仓鼠飞行员',
        atk: 146,
        hp: 137,
        range: 250,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 5000,
        attackDelay: 0.3,
        projectileSpeed: 800,
        areaRadius: 50,
        maxTargets: 99,
        spinePath: 'spine/H0601/js_feixingyuan_1',
        spineScale: 0.8,
        color: new Color(76, 153, 215, 255),
        attrs: { attackSpeed: -5000 },
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
    H1401: {
        id: 'H1401',
        name: '鲨鱼齿轮',
        atk: 71,
        hp: 280,
        range: 9999,
        searchRange: 9999,
        moveSpeed: 0,
        attackInterval: 1,
        attackType: 'WHEEL',
        effectRatio: 3000,
        attackDelay: 0.3,
        areaRadius: 75,
        maxTargets: 3,
        randomTarget: true,
        knockbackDistance: 50,
        spinePath: '',
        spineScale: 0.8,
        color: new Color(53, 166, 185, 255),
    },
    H1601: {
        id: 'H1601',
        name: '仓鼠怪兽',
        atk: 43,
        hp: 341,
        range: 75,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 10000,
        attackDelay: 0.3,
        spinePath: 'spine/H1601/js_konglong_1',
        spineScale: 0.88,
        color: new Color(97, 178, 102, 255),
    },
    H1701: {
        id: 'H1701',
        name: '镭射齿轮',
        atk: 140,
        hp: 320,
        range: 9999,
        searchRange: 9999,
        moveSpeed: 0,
        attackInterval: 1,
        attackType: 'WHEEL',
        effectRatio: 3000,
        attackDelay: 0,
        maxTargets: 1,
        randomTarget: true,
        multiHitDelays: [0, 0.33, 0.66, 1, 1.3, 1.4],
        spinePath: '',
        spineScale: 0.8,
        color: new Color(226, 75, 96, 255),
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
    H10: {
        id: 'H10',
        name: '仓鼠飞碟',
        atk: 370,
        hp: 694,
        range: 250,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 5000,
        attackDelay: 0.3,
        projectileSpeed: 1000,
        spinePath: 'spine/H1005/js_feidieshu',
        spineScale: 1.1,
        color: new Color(202, 91, 151, 255),
        fusionPrimaryBullet: bagLikeFusionPrimaryBulletProfile('H10') || undefined,
        fusionActive: bagLikeFusionActiveProfile('H10') || undefined,
    },
    H15: {
        id: 'H15',
        name: '吞宝鲨',
        atk: 288,
        hp: 1134,
        range: 9999,
        searchRange: 9999,
        moveSpeed: 0,
        attackInterval: 1,
        attackType: 'WHEEL',
        effectRatio: 3000,
        attackDelay: 0,
        areaRadius: 75,
        maxTargets: 5,
        randomTarget: true,
        knockbackDistance: 50,
        spinePath: '',
        spineScale: 1,
        color: new Color(71, 174, 179, 255),
    },
    H18: {
        id: 'H18',
        name: '仓鼠哥吱拉',
        atk: 218,
        hp: 1726,
        range: 150,
        searchRange: 400,
        moveSpeed: 60,
        attackInterval: 1,
        attackType: 'HAMSTER',
        effectRatio: 10000,
        attackDelay: 0.3,
        spinePath: 'spine/H1805/js_gesila',
        spineScale: 1,
        color: new Color(91, 139, 105, 255),
        fusionActive: bagLikeFusionActiveProfile('H18') || undefined,
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

function registerRecoveredNormalEnemies(monsters: Readonly<Record<string, NormalMonsterRow>>): void {
    const profiles = buildNormalEnemyMechanicsProfiles(monsters);
    const palette = [
        new Color(186, 126, 215, 255), new Color(91, 173, 154, 255),
        new Color(216, 172, 103, 255), new Color(196, 92, 83, 255),
        new Color(88, 139, 202, 255), new Color(164, 115, 77, 255),
    ];
    for (const id of Object.keys(profiles)) {
        const profile = profiles[id];
        if (UNITS[id]) continue;
        const visualEntry = VISUAL_ENEMY_ROSTER.find((entry) => entry.id === id);
        const numericId = Array.from(id).reduce((sum, character) => sum + character.charCodeAt(0), 0);
        const visualFamily = /^Boss(\d+)$/.exec(id);
        const visualModelId = visualFamily ? `M${visualFamily[1]}` : id;
        UNITS[id] = {
            id,
            name: profile.name,
            atk: profile.atk,
            hp: profile.hp,
            range: profile.range,
            searchRange: profile.searchRange,
            moveSpeed: profile.moveSpeed,
            attackInterval: profile.attackInterval,
            attackType: null,
            effectRatio: profile.effectRatio,
            attackDelay: profile.attackDelay,
            projectileSpeed: profile.projectileSpeed || undefined,
            areaRadius: profile.areaRadius || undefined,
            maxTargets: profile.maxTargets,
            controlImmune: profile.controlImmune,
            spinePath: visualEntry?.spinePath || '',
            spineScale: visualEntry?.spineScale || (profile.boss ? 1.1 : 0.65),
            color: palette[numericId % palette.length],
            attrs: {
                heroResistance: profile.heroResistance,
                towerResistance: profile.towerResistance,
                attackSpeed: profile.attackSpeed,
            },
            boss: profile.boss,
            gold: profile.gold,
            exp: profile.exp,
            visualModelId,
            focusHome: profile.focusHome,
            selfDestructRadius: profile.selfDestructRadius,
            knockbackDistance: profile.knockbackDistance,
            assassinate: profile.assassinate,
            assassinatePreCooldown: profile.assassinatePreCooldown,
            assassinateCooldown: profile.assassinateCooldown,
            assassinateDistance: profile.assassinateDistance,
            enemySpecialAttack: profile.specialAttack || undefined,
            enemySpecialPreCooldown: profile.specialPreCooldown,
            enemySpecialCooldown: profile.specialCooldown,
            enemySpecialCastTime: profile.specialCastTime,
            enemySpecialBehaviorDelay: profile.specialBehaviorDelay,
            enemySpecialEffectRatio: profile.specialEffectRatio,
            enemySpecialRadius: profile.specialRadius,
            enemySpecialWidth: profile.specialWidth,
            enemySpecialHeight: profile.specialHeight,
            multiHitDelays: profile.multiHitDelays,
        };
    }
}

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
    H0501: { id: 'H0501', name: '仓鼠召唤师', level: 1, nextId: 'H0502', tint: new Color(107, 174, 92, 255), powerPerTrigger: 5, unit: 'H0501', shape: [[0, 0], [1, 0], [1, 1]] },
    H0502: { id: 'H0502', name: '仓鼠召唤师', level: 2, nextId: 'H0503', tint: new Color(94, 157, 102, 255), powerPerTrigger: 5, unit: 'H0501', shape: [[0, 0], [1, 0], [1, 1]] },
    H0503: { id: 'H0503', name: '仓鼠召唤师', level: 3, nextId: 'H0504', tint: new Color(97, 132, 141, 255), powerPerTrigger: 5, unit: 'H0501', shape: [[0, 0], [1, 0], [1, 1]] },
    H0504: { id: 'H0504', name: '仓鼠召唤师', level: 4, tint: new Color(125, 105, 166, 255), powerPerTrigger: 5, unit: 'H0501', shape: [[0, 0], [1, 0], [1, 1]] },
    H0601: { id: 'H0601', name: '仓鼠飞行员', level: 1, nextId: 'H0602', tint: new Color(76, 153, 215, 255), powerPerTrigger: 3, unit: 'H0601', shape: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    H0602: { id: 'H0602', name: '仓鼠飞行员', level: 2, nextId: 'H0603', tint: new Color(75, 135, 207, 255), powerPerTrigger: 3, unit: 'H0601', shape: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    H0603: { id: 'H0603', name: '仓鼠飞行员', level: 3, nextId: 'H0604', tint: new Color(100, 107, 198, 255), powerPerTrigger: 3, unit: 'H0601', shape: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    H0604: { id: 'H0604', name: '仓鼠飞行员', level: 4, tint: new Color(137, 82, 184, 255), powerPerTrigger: 3, unit: 'H0601', shape: [[0, 0], [0, 1], [1, 0], [1, 1]] },
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
    H1401: { id: 'H1401', name: '鲨鱼齿轮', level: 1, nextId: 'H1402', tint: new Color(53, 166, 185, 255), powerPerTrigger: 12, unit: 'H1401', shape: [[0, 1], [1, 0], [1, 1]] },
    H1402: { id: 'H1402', name: '鲨鱼齿轮', level: 2, nextId: 'H1403', tint: new Color(61, 144, 178, 255), powerPerTrigger: 12, unit: 'H1401', shape: [[0, 1], [1, 0], [1, 1]] },
    H1403: { id: 'H1403', name: '鲨鱼齿轮', level: 3, nextId: 'H1404', tint: new Color(91, 117, 173, 255), powerPerTrigger: 12, unit: 'H1401', shape: [[0, 1], [1, 0], [1, 1]] },
    H1404: { id: 'H1404', name: '鲨鱼齿轮', level: 4, tint: new Color(127, 91, 164, 255), powerPerTrigger: 12, unit: 'H1401', shape: [[0, 1], [1, 0], [1, 1]] },
    H1601: { id: 'H1601', name: '仓鼠怪兽', level: 1, nextId: 'H1602', tint: new Color(97, 178, 102, 255), powerPerTrigger: 4, unit: 'H1601', shape: [[0, 0], [0, 1], [1, 1]] },
    H1602: { id: 'H1602', name: '仓鼠怪兽', level: 2, nextId: 'H1603', tint: new Color(86, 157, 111, 255), powerPerTrigger: 4, unit: 'H1601', shape: [[0, 0], [0, 1], [1, 1]] },
    H1603: { id: 'H1603', name: '仓鼠怪兽', level: 3, nextId: 'H1604', tint: new Color(91, 132, 144, 255), powerPerTrigger: 4, unit: 'H1601', shape: [[0, 0], [0, 1], [1, 1]] },
    H1604: { id: 'H1604', name: '仓鼠怪兽', level: 4, tint: new Color(122, 104, 166, 255), powerPerTrigger: 4, unit: 'H1601', shape: [[0, 0], [0, 1], [1, 1]] },
    H1701: { id: 'H1701', name: '镭射齿轮', level: 1, nextId: 'H1702', tint: new Color(226, 75, 96, 255), powerPerTrigger: 7, unit: 'H1701', shape: [[0, 0], [0, 1], [0, 2]] },
    H1702: { id: 'H1702', name: '镭射齿轮', level: 2, nextId: 'H1703', tint: new Color(210, 76, 113, 255), powerPerTrigger: 7, unit: 'H1701', shape: [[0, 0], [0, 1], [0, 2]] },
    H1703: { id: 'H1703', name: '镭射齿轮', level: 3, nextId: 'H1704', tint: new Color(185, 76, 139, 255), powerPerTrigger: 7, unit: 'H1701', shape: [[0, 0], [0, 1], [0, 2]] },
    H1704: { id: 'H1704', name: '镭射齿轮', level: 4, tint: new Color(154, 77, 164, 255), powerPerTrigger: 7, unit: 'H1701', shape: [[0, 0], [0, 1], [0, 2]] },
    H0705: { id: 'H0705', name: '仓鼠铁铁侠', level: 5, tint: new Color(255, 99, 99, 255), powerPerTrigger: 8, unit: 'H07', shape: [[0, 0], [0, 1]] },
    H0805: { id: 'H0805', name: '仓鼠凹凸曼', level: 5, tint: new Color(255, 99, 99, 255), powerPerTrigger: 7, unit: 'H08', shape: [[0, 0], [1, 0]] },
    H0905: { id: 'H0905', name: '仓鼠战车', level: 5, tint: new Color(255, 99, 99, 255), powerPerTrigger: 6, unit: 'H09', shape: [[0, 0], [0, 1], [1, 0]] },
    H1005: { id: 'H1005', name: '仓鼠飞碟', level: 5, tint: new Color(255, 99, 99, 255), powerPerTrigger: 3, unit: 'H10', shape: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    H1505: { id: 'H1505', name: '吞宝鲨', level: 5, tint: new Color(255, 99, 99, 255), powerPerTrigger: 12, unit: 'H15', shape: [[0, 1], [1, 1]] },
    H1805: { id: 'H1805', name: '仓鼠哥吱拉', level: 5, tint: new Color(255, 99, 99, 255), powerPerTrigger: 4, unit: 'H18', shape: [[0, 0], [0, 1], [1, 1]] },
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

const REFRESH_COST = 15;
const CANDIDATE_TRAY_HEIGHT = 250;
const CANDIDATE_TRAY_WIDTH = 730;
const ACCOUNT_HERO_NAMES: Readonly<Record<BagLikeAccountHeroFamily, string>> = {
    H01: '仓鼠战士',
    H02: '仓鼠射手',
    H03: '仓鼠法师',
    H04: '仓鼠骑士',
    H05: '仓鼠召唤师',
    H06: '仓鼠飞行员',
    H11: '治疗齿轮',
    H12: '雷云齿轮',
    H13: '火炮齿轮',
    H14: '鲨鱼齿轮',
    H16: '仓鼠怪兽',
    H17: '镭射齿轮',
};

@ccclass('CangshuGame')
export class CangshuGame extends Component {
    @property({ tooltip: 'Recovered main-level ID to load from resources/data/normal-levels.json' })
    levelId = DEFAULT_LEVEL_ID;

    @property({ tooltip: 'Original challenge count: non-forever-static levels use weighted candidate drops after the first challenge' })
    challengeTimes = 1;

    @property({ tooltip: 'Semicolon-separated account-unlocked hero families currently supported by the reconstruction candidate/production chain' })
    unlockedHeroFamilies = 'H01;H02;H03;H04;H05;H06;H11;H12;H13;H14;H16;H17';

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H01 star; the runtime account profile persists the active value' })
    h01HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H02 star; the runtime account profile persists the active value' })
    h02HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H03 star; the runtime account profile persists the active value' })
    h03HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H04 star; the runtime account profile persists the active value' })
    h04HeroStar = 1;

    @property({ min: 0, max: 15, step: 1, tooltip: 'Saved H05 hero star used by recovered H1005 fusion verification' })
    h05HeroStar = 1;

    @property({ min: 0, max: 15, step: 1, tooltip: 'Saved H06 hero star used by recovered H1005 fusion verification' })
    h06HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H11 star; baseline 1 keeps unevidenced account upgrades disabled' })
    h11HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H12 star; the runtime account profile persists the active value' })
    h12HeroStar = 1;

    @property({ min: 0, max: 20, step: 1, tooltip: 'Legacy fallback H13 star; the runtime account profile persists the active value' })
    h13HeroStar = 1;

    @property({ min: 0, max: 15, step: 1, tooltip: 'Saved H14 hero star used by recovered H1505 fusion verification' })
    h14HeroStar = 1;

    @property({ min: 0, max: 15, step: 1, tooltip: 'Saved H16 hero star used by recovered H1805 fusion verification' })
    h16HeroStar = 1;

    @property({ min: 0, max: 15, step: 1, tooltip: 'Saved H17 hero star used by recovered H1805 fusion verification' })
    h17HeroStar = 1;

    private initialized = false;
    private accountProfile!: BagLikeAccountProfile;
    private powerRoleState!: PowerRoleState;
    private accountDefaultProfile!: BagLikeAccountProfile;
    private longRunOriginalAccountProfile: BagLikeAccountProfile | null = null;
    private longRunOriginalPowerRoleState: PowerRoleState | null = null;
    private claimedAccountRewardRounds = new Set<number>();
    private accountRewardsThisAttempt: BagLikeLevelAccountReward[] = [];
    private accountUnlockedThisAttempt: BagLikeAccountHeroFamily[] = [];
    private validationHeroStarOverrides: Partial<Record<BagLikeAccountHeroFamily, number>> | null = null;
    private originalFont: TTFFont | null = null;
    private levelTable: NormalLevelTable | null = null;
    private specialModeTable: SpecialModeTable | null = null;
    private specialModeState!: SpecialModeState;
    private mockAdvertisementState!: MockAdvertisementState;
    private mockAdvertisementBusy = false;
    private mockAdvertisementPlacement = '';
    private mockAdvertisementOutcome: MockAdOutcome = 'completed';
    private mockAdvertisementPreviousPaused = false;
    private battleMode: SpecialMode = 'normal';
    private dailyBuffIds: string[] = [];
    private enemyHomeHp = 0;
    private enemyHomeMaxHp = 0;
    private enemyHomeGold = 0;
    private specialKillCount = 0;
    private specialDropGold = 0;
    private specialBattleElapsed = 0;
    private levelSelectionPage = 0;
    private levelName = '';
    private levelCatalog: LevelTableRow[] = [];
    private levelSelectPage = 0;
    private cultivationPage = 0;
    private accountHeroPage = 0;
    private shopSectionId: 101 | 102 | 103 | 104 = 101;
    private selectedDailyInstanceIndex = 0;
    private outOfBattleMusicVolume = 1;
    private outOfBattleSoundVolume = 1;
    private outOfBattleAnimationClock = 0;
    private levelBackground = '';
    private baseLevelHomeHp = 500;
    private levelHomeHp = 500;
    private levelAtkMultiple = 10000;
    private levelHpMultiple = 10000;
    private initialGold = 0;
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
    /** Unit roots that are only being kept alive long enough to finish their death animation. */
    private dyingUnitNodes = new Set<Node>();
    private pendingHits: PendingHit[] = [];
    private pendingFusionSkillHits: PendingFusionSkillHit[] = [];
    private traces: Trace[] = [];
    private floatingTexts: FloatingText[] = [];
    private battleNumberAtlasFrame: SpriteFrame | null = null;
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
    private p04ProjectileFrame: SpriteFrame | null = null;
    private h13ImpactData: sp.SkeletonData | null = null;
    private h0705HitFrames: SpriteFrame[] = [];
    private h08HitFrames: SpriteFrame[] = [];
    private h0905ProjectileFrame: SpriteFrame | null = null;
    private h0905HitFrames: SpriteFrame[] = [];
    private h0905HitAudio: AudioClip | null = null;
    private h0905AudioSource: AudioSource | null = null;
    private h1005ProjectileData: sp.SkeletonData | null = null;
    private h1005NukeData: sp.SkeletonData | null = null;
    private h1005NukeAudio: AudioClip | null = null;
    private h1005AudioSource: AudioSource | null = null;
    private h1505HitFrames: SpriteFrame[] = [];
    private h06ProjectileFrames: SpriteFrame[] = [];
    private h14BombFrames: SpriteFrame[] = [];
    private enemyBoneProjectileFrame: SpriteFrame | null = null;
    private enemyOrbProjectileFrame: SpriteFrame | null = null;
    private h17RayData: sp.SkeletonData | null = null;
    private m10ProjectileData: sp.SkeletonData | null = null;
    private h14HitAudio: AudioClip | null = null;
    private recoveredProjectileAudioSource: AudioSource | null = null;
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
    private powerCoreModelElapsed = 0;
    private powerSkillRemaining = 0;
    private powerRoleEnergy = 0;
    private powerRoleActiveRemaining = 0;
    private powerRoleKillProductivityStacks = 0;
    private powerRoleStartRewardClaimed = false;
    private battleRandom: () => number = createBattleSeedRandom();
    private visualFixtureRandom: () => number = createBattleSeedRandom(1004);
    private productionJobs: ProductionJob[] = [];
    private selfSpawnCount = 0;
    private fusionActiveCastCount = 0;
    private fusionActiveHitCount = 0;
    private h10PrimaryBulletCastCount = 0;
    private h10PrimaryBulletHitCount = 0;
    private h15KillCoinsEarned = 0;
    private h15RoundCoinsEarned = 0;
    private powerContactCount = 0;
    private powerGearTriggerCount = 0;
    private workerApplyCount = 0;
    private powerMissingGearCount = 0;
    private powerMissingConfigCount = 0;
    private visualCatalogLoadedCount = 0;
    private visualCatalogFailedCount = 0;
    private speed = 1;
    private paused = false;
    private failedAttempts = 0;
    private longRunAutomationTimer = 0;
    private longRunElapsedSeconds = 0;
    private longRunRetries = 0;
    private longRunMaxSelfUnits = 0;
    private longRunMaxEnemyUnits = 0;
    private longRunStatus = 'disabled';
    private bagLikeLevel = 1;
    private bagLikeExp = 0;
    private traitRerollsUsed = 0;
    private traitTakeAllUsed = 0;
    private currentTraitChoices: TraitDefinition[] = [];
    private staticBuffsByLevel: ReadonlyMap<number, readonly string[]> = new Map();
    private pendingTraitReturnPhase: 'battle' | 'roundClear' = 'battle';
    private traitStacks = new Map<TraitId, number>();
    private warriorKillAttackStacks = 0;
    private h11SkillId: H11SkillId = H11_BASE_SKILL_ID;
    private h12SkillId: H12SkillId = H12_BASE_SKILL_ID;
    private h13SkillId: H13SkillId = H13_BASE_SKILL_ID;

    private battleLayer!: Node;
    private backgroundEffectLayer!: Node;
    private unitLayer!: Node;
    private effectLayer!: Node;
    private prepareLayer!: Node;
    private hudLayer!: Node;
    private backpackBackground!: Node;
    private backpackPanel!: Node;
    private backpackHpBar!: Node;
    private candidateLayer!: Node;
    private resultLayer!: Node;
    private resultActionsLayer!: Node;
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
    private enemyHomeGraphics!: Graphics;
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
    private refreshCostNode!: Node;
    private speedLabel!: Label;
    private pauseLabel!: Label;
    private powerRoleActiveLabel!: Label;
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
    private resultRevealVersion = 0;
    private tipLabel!: Label;
    private fusionGuideLabel!: Label;
    private dragGear: Gear | null = null;
    private dragOrigin = { row: 0, col: 0, x: 0, y: 0, scale: 1, location: 'grid' as GearLocation };
    private dragTouchOffset = { x: 0, y: 0 };

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
        this.preloadP04Projectile();
        this.preloadH13Impact();
        this.preloadH0705Impact();
        this.preloadH08Impact();
        this.preloadH0905Effects();
        this.preloadLateFusionPresentation();
        this.preloadRecoveredProjectilePresentation();
        this.preloadMeleeAttackAudio();
        resources.load('original/battleNum_0/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && frame) this.battleNumberAtlasFrame = frame;
        });
        resources.load('original/default', TTFFont, (fontError, font) => {
            if (!fontError && font) this.originalFont = font;
            if (this.resourceAuditEnabled()) {
                profiler.hideStats();
                this.buildResourceAudit();
                return;
            }
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
                this.levelTable = asset.json as unknown as NormalLevelTable;
                resources.load('data/special-modes', JsonAsset, (specialError, specialAsset) => {
                    if (specialError || !specialAsset) {
                        this.showLoadError(`活动关卡表加载失败：${specialError?.message || 'missing data/special-modes'}`);
                        return;
                    }
                    this.specialModeTable = specialAsset.json as unknown as SpecialModeTable;
                    // Existing browser evidence URLs keep opening their exact battle
                    // fixture. A normal launch now enters the reconstructed main flow.
                    const search = typeof window === 'undefined' ? '' : window.location.search;
                    const directLevelId = directBootLevelId(search, this.levelId);
                    this.levelId = directLevelId ?? this.levelId;
                    // Power-role presentation is consumed by both the main scene and
                    // the P01 gear created while a level is launched. Initialize it
                    // before account routing so a locked URL can safely return to the
                    // latest unlocked level without racing an undefined role state.
                    this.powerRoleState = loadPowerRoleState(sys.localStorage);
                    savePowerRoleState(sys.localStorage, this.powerRoleState);
                    if (!this.loadAccountProfile()) return;
                    this.specialModeState = loadSpecialModeState(sys.localStorage);
                    saveSpecialModeState(sys.localStorage, this.specialModeState);
                    this.mockAdvertisementState = loadMockAdvertisementState(sys.localStorage);
                    saveMockAdvertisementState(sys.localStorage, this.mockAdvertisementState);
                    const longRunMode = this.longRunRequestedMode();
                    if (longRunMode) {
                        this.showMainScene();
                        this.beginSpecialBattle(longRunMode);
                    } else if (directLevelId !== null) this.launchLevel(directLevelId);
                    else this.showMainScene();
                });
            } catch (levelError) {
                console.error('[cangshu] initialization failed', levelError);
                this.showLoadError(levelError instanceof Error ? levelError.message : String(levelError));
            }
        });
    }

    private launchLevel(levelId: number): void {
        if (!this.levelTable) throw new Error('关卡表尚未加载');
        const search = typeof window === 'undefined' ? '' : window.location.search;
        const bypassProgression = directBattleBypassesProgression(search);
        const validationOriginalProfile = bypassProgression && this.longRunValidationEnabled()
            ? cloneBagLikeAccountProfile(this.accountProfile)
            : null;
        const entry = enterNormalLevel(this.accountProfile, levelId, bypassProgression);
        if (!entry.entered) {
            const message = entry.reason === 'locked'
                ? `请先通关第 ${bagLikeLevelNumber(levelId) - 1} 关`
                : `体力不足，挑战主线需要 ${NORMAL_LEVEL_ENERGY_COST} 点体力`;
            this.showMainScene(message);
            return;
        }
        this.accountProfile = entry.profile;
        if (!bypassProgression) this.persistAccountProfile(false);
        this.resetLevelSession();
        this.battleMode = 'normal';
        this.longRunOriginalAccountProfile = validationOriginalProfile;
        this.destroyRootChildren();
        this.levelId = levelId;
        this.configureLevel(this.levelTable);
        this.buildScene();
        this.initGrid();
        this.addPlacedGear('P01', 2, 3);
        const traitValidationEnabled = this.traitValidationEnabled();
        const developedValidationMode = this.developedValidationMode();
        const projectileValidationEnabled = this.projectileValidationEnabled();
        if (traitValidationEnabled || developedValidationMode || projectileValidationEnabled) profiler.hideStats();
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
        } else if (fusionValidationMode === 'battle' || fusionValidationMode === 'late-battle') {
            this.startRound();
            for (const gear of this.gears) {
                if (gear.id === 'P01') continue;
                gear.workerPower = 99;
                this.queueProduction(gear);
            }
        } else if (projectileValidationEnabled) {
            // startRound requires at least one production gear; keep the
            // browser-only fixture on the same public transition path.
            this.addPlacedGear('H0101', 1, 3);
            this.startRound();
            this.applyProjectileValidationFixture();
        }
        this.refreshUi();
    }

    private beginSpecialBattle(mode: Exclude<SpecialMode, 'normal'>): void {
        if (!this.levelTable || !this.specialModeTable) return;
        this.specialModeState = loadSpecialModeState(sys.localStorage);
        const eligibility = canStartSpecialMode(this.specialModeState, this.accountProfile, mode);
        if (!eligibility.allowed) {
            const message = eligibility.reason === 'attempts' ? '今日挑战次数已用完' : `体力不足，需要 5 点体力`;
            if (mode === 'daily') this.showDailyInstanceScene(message);
            else this.showEndlessModeScene(message);
            return;
        }
        if (eligibility.needsAd) {
            this.playMockAdvertisement('endless-third', () => this.startSpecialBattle(mode, true), (outcome) => {
                this.showEndlessModeScene(outcome === 'cancelled' ? '广告已取消，本次未扣体力和挑战次数' : '广告播放失败，本次未扣体力和挑战次数');
            });
            return;
        }
        this.startSpecialBattle(mode, false);
    }

    private startSpecialBattle(mode: Exclude<SpecialMode, 'normal'>, watchedAdvertisement: boolean): void {
        if (!this.levelTable || !this.specialModeTable) return;
        this.accountProfile = spendSpecialModeEnergy(this.accountProfile);
        this.persistAccountProfile(false);
        this.resetLevelSession();
        this.battleMode = mode;
        if (this.longRunLateProgressionEnabled()) {
            // Validation account only: run every recovered hero and power-role
            // progression modifier through the normal formulas without persisting
            // either preset. This keeps special-mode long runs representative of a
            // late account instead of silently using the initialized P01 role.
            this.longRunOriginalAccountProfile = cloneBagLikeAccountProfile(this.accountProfile);
            this.longRunOriginalPowerRoleState = this.clonePowerRoleState(this.powerRoleState);
            this.accountProfile = setAllBagLikeAccountHeroStars(this.accountProfile, 20);
            this.powerRoleState = this.lateProgressionPowerRoleState(this.powerRoleState);
            this.syncAccountProfileToRuntime(false);
        } else {
            this.longRunOriginalAccountProfile = null;
            this.longRunOriginalPowerRoleState = null;
        }
        this.destroyRootChildren();
        this.configureSpecialMode(mode);
        this.buildScene();
        this.initGrid();
        this.addPlacedGear('P01', 2, 3);
        this.dealPreparationBatch();
        this.applyPhaseLayout();
        this.initialized = true;
        this.tipLabel.string = watchedAdvertisement
            ? '广告播放完成：第 3 次无尽挑战开始'
            : mode === 'daily' ? '每日挑战：增益与减益已生效' : '无尽试炼：300 秒内尽可能击杀敌人';
        this.refreshUi();
    }

    private playMockAdvertisement(
        placement: MockAdPlacement,
        onCompleted: () => void,
        onRejected?: (outcome: Exclude<MockAdOutcome, 'completed'>) => void,
    ): void {
        if (this.mockAdvertisementBusy) return;
        const outcome = mockAdvertisementOutcomeFromSearch(typeof window === 'undefined' ? '' : window.location.search);
        this.mockAdvertisementBusy = true;
        this.mockAdvertisementPlacement = placement;
        this.mockAdvertisementOutcome = outcome;
        this.mockAdvertisementPreviousPaused = this.paused;
        this.paused = true;
        this.syncBrowserContractState();

        const overlay = this.makeNode('MockAdvertisementOverlay', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const shade = overlay.addComponent(Graphics);
        shade.fillColor = new Color(4, 8, 14, 230);
        shade.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        shade.fill();
        const panel = this.makeNode('MockAdvertisementPanel', overlay, 0, 0, 620, 430);
        const panelGraphics = panel.addComponent(Graphics);
        panelGraphics.fillColor = new Color(31, 48, 71, 255);
        panelGraphics.roundRect(-310, -215, 620, 430, 28);
        panelGraphics.fill();
        panelGraphics.strokeColor = GOLD;
        panelGraphics.lineWidth = 4;
        panelGraphics.roundRect(-308, -213, 616, 426, 26);
        panelGraphics.stroke();
        this.makeLabel('MockAdvertisementTitle', panel, 0, 142, 540, 58, '激励视频', 38, GOLD);
        this.makeLabel('MockAdvertisementPlacement', panel, 0, 66, 540, 48,
            mockAdvertisementPlacementLabel(placement), 23, WHITE);
        const statusText = outcome === 'completed'
            ? '广告播放中…\n完整观看后即可获得奖励'
            : outcome === 'cancelled' ? '广告已取消' : '广告加载失败，请稍后重试';
        this.makeLabel('MockAdvertisementStatus', panel, 0, -20, 540, 90, statusText, 19, CREAM);
        this.makeLabel('MockAdvertisementTag', panel, 0, -151, 540, 36,
            '观看完整视频后发放奖励', 15, new Color(150, 181, 211, 255));

        let finished = false;
        const finish = (): void => {
            if (finished) return;
            finished = true;
            if (overlay.isValid) overlay.destroy();
            this.mockAdvertisementBusy = false;
            this.paused = this.mockAdvertisementPreviousPaused;
            if (outcome === 'completed') {
                this.mockAdvertisementState = completeMockAdvertisement(this.mockAdvertisementState, placement);
                saveMockAdvertisementState(sys.localStorage, this.mockAdvertisementState);
                this.syncBrowserContractState();
                onCompleted();
                return;
            }
            this.syncBrowserContractState();
            if (onRejected) onRejected(outcome);
        };
        // Out-of-battle pages intentionally keep the battle component inactive,
        // so use the host timer here instead of Cocos' component scheduler.
        setTimeout(finish, outcome === 'completed' ? 800 : 550);
    }

    private configureSpecialMode(mode: Exclude<SpecialMode, 'normal'>): void {
        if (!this.levelTable || !this.specialModeTable) return;
        registerRecoveredNormalEnemies(this.levelTable.monsters);
        const progressId = Math.max(1001, Math.min(1200, this.accountProfile.maxPassedLevelId));
        const progress = this.levelTable.levels.find((row) => row.id === progressId) || this.levelTable.levels[0];
        this.levelId = progress.id;
        this.levelAtkMultiple = progress.atkMultiple;
        this.levelHpMultiple = progress.hpMultiple;
        this.baseLevelHomeHp = progress.homeHp;
        this.levelHomeHp = progress.homeHp;
        this.selfHp = progress.homeHp;
        this.staticBuffsByLevel = new Map();
        this.staticBatches = [];
        this.enemyHomeHp = 0;
        this.enemyHomeMaxHp = 0;
        this.enemyHomeGold = 0;
        this.dailyBuffIds = [];
        if (mode === 'daily') {
            const instance = currentDailyInstance(this.specialModeTable);
            const rotation = currentDailyRotation(this.specialModeTable);
            this.levelName = `每日挑战·${instance.name}`;
            this.levelBackground = instance.fightscene.split('/').pop() || 'fightscene_01';
            this.initialGold = this.specialModeTable.daily.initCoin;
            this.gold = this.initialGold;
            this.dailyBuffIds = [...rotation.buffIds];
            this.rounds = instance.roundIds.map((id, index) => {
                const base = this.specialModeTable!.rounds[String(id)];
                const extraId = dailyExtraRoundId(this.dailyBuffIds, index);
                const merged = mergeDailyRound(base, extraId === null ? null : this.specialModeTable!.rounds[String(extraId)]);
                return { id: merged.id, times: [...merged.monsterTimes], monsters: [...merged.monsterIds], atkMultiple: merged.atkMultiple, hpMultiple: merged.hpMultiple };
            });
            this.roundCoinRewards = this.rounds.map(() => 20);
        } else {
            const row = this.specialModeTable.rounds['400001'];
            this.levelName = '无尽试炼';
            this.levelBackground = 'fightscene_03';
            this.initialGold = 300;
            this.gold = this.initialGold;
            this.rounds = [{ id: row.id, times: [...row.monsterTimes], monsters: [...row.monsterIds], atkMultiple: row.atkMultiple, hpMultiple: row.hpMultiple }];
            this.roundCoinRewards = [0];
            this.enemyHomeHp = Math.max(1, progress.enemyHomeHp || progress.homeHp);
            this.enemyHomeMaxHp = this.enemyHomeHp;
            this.enemyHomeGold = Math.max(0, progress.enemyHomeGold || 0);
        }
        this.syncBrowserContractState();
    }

    private showMainScene(message = ''): void {
        profiler.hideStats();
        this.resetLevelSession();
        this.destroyRootChildren();
        const root = this.makeNode('MainScene', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        this.addMenuBackground(root, 'fightscene_01');

        const shade = this.makeNode('MainShade', root, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const shadeGraphics = shade.addComponent(Graphics);
        shadeGraphics.fillColor = new Color(16, 30, 36, 82);
        shadeGraphics.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        shadeGraphics.fill();

        const title = this.makeLabel('MainTitle', root, 0, 515, 500, 66, '仓鼠齿轮', 42, GOLD);
        this.applyOriginalOutline(title, new Color(63, 35, 14, 255), 4);
        this.makeLabel('MainSubtitle', root, 0, 468, 420, 40, '齿轮转动，英雄出击', 20, CREAM);

        const halo = this.makeNode('MainHeroHalo', root, 0, 185, 370, 370);
        const haloGraphics = halo.addComponent(Graphics);
        haloGraphics.fillColor = new Color(22, 77, 75, 155);
        haloGraphics.circle(0, 0, 165);
        haloGraphics.fill();
        haloGraphics.strokeColor = new Color(255, 216, 92, 210);
        haloGraphics.lineWidth = 5;
        haloGraphics.circle(0, 0, 145);
        haloGraphics.stroke();
        haloGraphics.strokeColor = new Color(93, 218, 189, 170);
        haloGraphics.lineWidth = 3;
        haloGraphics.circle(0, 0, 174);
        haloGraphics.stroke();

        const mainPowerRotor = this.makeNode('MainPowerRotor', root, 0, 185, 114, 114);
        mainPowerRotor.setScale(2.5, 2.5, 1);
        const mainPowerShadow = this.makeNode('MainPowerShadow', mainPowerRotor, 3, -4, 114, 114);
        this.attachRecoveredAtlasSprite(
            mainPowerShadow,
            'original/bagLike_0/spriteFrame',
            BAGLIKE_ATLAS_FRAMES.powerCore,
            new Color(40, 30, 25, 150),
        );
        const mainPowerBody = this.makeNode('MainPowerBody', mainPowerRotor, 0, 0, 114, 114);
        this.attachBagLikeAtlasSprite(mainPowerBody, BAGLIKE_ATLAS_FRAMES.powerCore);
        const mainHeroMascot = this.makeNode('MainHeroMascot', root, 0, 198, 90, 90);
        mainHeroMascot.setScale(2.05, 2.05, 1);
        this.attachStaticGearPortrait(mainHeroMascot, this.powerRoleState.equippedRoleId, 0, 0);

        const latestLevelId = latestMainLevelId(this.accountProfile.maxPassedLevelId);
        const latestLevel = this.levelTable?.levels.find((level) => level.id === latestLevelId);
        const latestLevelNumber = bagLikeLevelNumber(latestLevelId);

        const stagePanel = this.makeNode('MainStagePanel', root, 0, -90, 500, 120);
        const stageGraphics = stagePanel.addComponent(Graphics);
        stageGraphics.fillColor = new Color(24, 47, 55, 235);
        stageGraphics.roundRect(-250, -60, 500, 120, 24);
        stageGraphics.fill();
        stageGraphics.strokeColor = new Color(255, 211, 88, 255);
        stageGraphics.lineWidth = 3;
        stageGraphics.roundRect(-248, -58, 496, 116, 22);
        stageGraphics.stroke();
        this.makeLabel('MainStageChapter', stagePanel, 0, 25, 440, 38, `主线 · 第 ${latestLevelNumber} 关`, 22, GOLD);
        this.makeLabel('MainStageName', stagePanel, 0, -22, 440, 44, latestLevel?.name || `第 ${latestLevelNumber} 关`, 30, WHITE);

        const levelSelect = this.makeButton('OpenLevelSelection', root, -132, -230, 238, 78, '选择关卡', () => {
            this.levelSelectionPage = 0;
            this.showLevelSelection();
        });
        this.restyleButton(levelSelect, new Color(44, 104, 131, 255), WHITE);
        levelSelect.fontSize = 24;
        const continueBattle = this.makeButton('ContinueBattle', root, 132, -230, 238, 78, `挑战（-${NORMAL_LEVEL_ENERGY_COST}）`, () => this.launchLevel(latestLevelId));
        this.restyleButton(continueBattle, new Color(238, 160, 40, 255), new Color(255, 248, 207, 255));
        continueBattle.fontSize = 25;

        this.buildOutOfBattleResourceHeader(root, '主界面');
        const sevenDay = this.makeButton('MainSevenDay', root, -287, 330, 116, 74, '七天\n登录', () => this.showSevenDayScene());
        this.restyleButton(sevenDay, new Color(132, 75, 157, 242), WHITE);
        this.applyMainSideIcon(sevenDay, MAIN_SIDE_ICON_FRAMES.sevenDay);
        const community = this.makeButton('MainCommunity', root, -287, 235, 116, 70, '游戏圈', () => undefined);
        this.restyleButton(community, new Color(49, 91, 105, 226), new Color(203, 229, 224, 255));
        this.applyMainSideIcon(community, MAIN_SIDE_ICON_FRAMES.community, new Color(203, 229, 224, 255));
        community.node.parent!.getComponent(Button)!.interactable = false;
        const dailyTask = this.makeButton('MainDailyTask', root, 287, 330, 116, 74, '每日\n任务', () => this.showDailyTaskScene());
        this.restyleButton(dailyTask, new Color(43, 105, 143, 242), WHITE);
        const dailyTaskUnlocked = outOfBattleSystemUnlocked(this.accountProfile.maxPassedLevelId, 'DAILY_TASK');
        this.applyMainSideIcon(dailyTask, MAIN_SIDE_ICON_FRAMES.dailyTask,
            dailyTaskUnlocked ? WHITE : new Color(115, 124, 138, 255));
        dailyTask.node.parent!.getComponent(Button)!.interactable = dailyTaskUnlocked;
        if (!dailyTaskUnlocked) this.restyleButton(dailyTask, new Color(68, 75, 88, 255), new Color(160, 166, 178, 255));
        const invitation = this.makeButton('MainInvitation', root, 287, 235, 116, 70, '邀请有礼', () => undefined);
        this.restyleButton(invitation, new Color(49, 91, 105, 226), new Color(203, 229, 224, 255));
        this.applyMainSideIcon(invitation, MAIN_SIDE_ICON_FRAMES.invitation, new Color(203, 229, 224, 255));
        invitation.node.parent!.getComponent(Button)!.interactable = false;
        const settings = this.makeButton('MainSettings', root, 296, 505, 100, 58, '设置', () => this.showSettingsScene());
        this.restyleButton(settings, new Color(55, 70, 80, 235), WHITE);
        this.applyMainSideIcon(settings, MAIN_SIDE_ICON_FRAMES.settings, WHITE, false, 46);
        if (message) this.makeLabel('MainNotice', root, 0, -315, 650, 48, message, 18, new Color(255, 225, 139, 255));
        this.buildMainBottomNavigation(root, '战斗');
    }

    private applyMainSideIcon(
        label: Label,
        frame: BagLikeAtlasFrame,
        tint: Color = WHITE,
        showText = true,
        iconSize = 48,
    ): void {
        const buttonNode = label.node.parent!;
        if (showText) {
            label.node.setPosition(0, -23);
            label.fontSize = 14;
            label.lineHeight = 16;
        } else {
            label.string = '';
        }
        const icon = this.makeNode(`${buttonNode.name}Icon`, buttonNode, 0, showText ? 11 : 0, iconSize, iconSize);
        this.attachRecoveredAtlasSprite(icon, 'original/main/spriteFrame', frame, tint);
    }

    private buildOutOfBattleResourceHeader(parent: Node, pageTitle: string): void {
        const header = this.makeNode('OutOfBattleResourceHeader', parent, 0, 622, 720, 84);
        const graphics = header.addComponent(Graphics);
        graphics.fillColor = new Color(18, 29, 42, 242);
        graphics.roundRect(-360, -42, 720, 84, 20);
        graphics.fill();
        graphics.strokeColor = new Color(98, 128, 162, 255);
        graphics.lineWidth = 2;
        graphics.roundRect(-358, -40, 716, 80, 18);
        graphics.stroke();
        this.makeLabel('OutOfBattlePageName', header, -300, 0, 110, 42, pageTitle, 20, GOLD);
        const resources = [
            { key: 'Energy', icon: '⚡', value: `${this.accountProfile.energy}`, color: new Color(84, 220, 157, 255), canBuy: true },
            { key: 'Gold', icon: '●', value: `${this.accountProfile.gold}`, color: new Color(255, 210, 67, 255), canBuy: true },
            { key: 'Diamond', icon: '◆', value: `${this.accountProfile.diamonds}`, color: new Color(93, 221, 255, 255), canBuy: true },
            { key: 'Ticket', icon: '券', value: '--', color: new Color(216, 166, 255, 255), canBuy: false },
        ];
        resources.forEach((resource, index) => {
            const item = this.makeNode(`OutOfBattleResource${resource.key}`, header, -150 + index * 145, 0, 136, 54);
            const itemGraphics = item.addComponent(Graphics);
            itemGraphics.fillColor = new Color(31, 48, 65, 245);
            itemGraphics.roundRect(-68, -27, 136, 54, 15);
            itemGraphics.fill();
            itemGraphics.strokeColor = new Color(resource.color.r, resource.color.g, resource.color.b, 175);
            itemGraphics.lineWidth = 2;
            itemGraphics.roundRect(-66, -25, 132, 50, 13);
            itemGraphics.stroke();
            this.makeLabel(`OutOfBattleResourceIcon${resource.key}`, item, -43, 0, 34, 36, resource.icon, 21, resource.color);
            this.makeLabel(
                `OutOfBattleResourceValue${resource.key}`,
                item,
                5,
                0,
                66,
                34,
                resource.value,
                17,
                new Color(255, 254, 254, 255),
            );
            if (resource.canBuy) {
                this.makeLabel(
                    `OutOfBattleResourceAdd${resource.key}`,
                    item,
                    51,
                    0,
                    24,
                    30,
                    '+',
                    20,
                    new Color(255, 227, 41, 255),
                );
            }
        });
    }

    private buildMainBottomNavigation(parent: Node, active: OutOfBattleTabName): void {
        const bar = this.makeNode('MainBottomNavigation', parent, 0, -608, 750, 116);
        const background = bar.addComponent(Graphics);
        background.fillColor = new Color(18, 29, 42, 248);
        background.roundRect(-375, -58, 750, 116, 24);
        background.fill();
        background.strokeColor = new Color(99, 130, 169, 255);
        background.lineWidth = 3;
        background.roundRect(-373, -56, 746, 112, 22);
        background.stroke();

        const openTab: Record<OutOfBattleTabName, () => void> = {
            商店: () => this.showShopScene(),
            角色: () => this.showRoleScene(),
            战斗: () => this.showMainScene(),
            培养: () => this.showCultivationScene(),
            活动: () => this.showActivityScene(),
        };
        const tabs = OUT_OF_BATTLE_TABS.map((tab) => ({ ...tab, open: openTab[tab.name] }));
        tabs.forEach((tab, index) => {
            const selected = tab.name === active;
            const unlocked = outOfBattleSystemUnlocked(this.accountProfile.maxPassedLevelId, tab.systemId);
            const open = unlocked
                ? tab.open
                : () => this.showOutOfBattleLockedNotice(parent, tab.name, tab.systemId);
            const label = this.makeButton(
                `MainTab_${tab.name}`,
                bar,
                -288 + index * 144,
                selected ? 6 : -1,
                128,
                selected ? 96 : 86,
                unlocked ? tab.name : `锁 · ${tab.name}`,
                open,
            );
            this.restyleButton(
                label,
                selected ? new Color(211, 145, 38, 255) : new Color(40, 61, 83, 255),
                unlocked ? WHITE : new Color(177, 186, 199, 255),
            );
            label.fontSize = selected ? 18 : 17;
            label.lineHeight = 24;
            label.node.setPosition(0, -31);
            label.node.getComponent(UITransform)!.setContentSize(124, 28);
            const icon = this.makeNode(
                `MainTabIcon_${tab.name}`,
                label.node.parent!,
                0,
                14,
                selected ? 66 : 60,
                selected ? 66 : 60,
            );
            this.attachRecoveredAtlasSprite(
                icon,
                'original/main/spriteFrame',
                MAIN_TAB_ICON_FRAMES[tab.name],
                unlocked ? WHITE : new Color(115, 124, 138, 255),
            );
            // Locked tabs remain clickable so the player gets an explicit unlock
            // condition instead of an apparently broken navigation button.
            label.node.parent!.getComponent(Button)!.interactable = !selected;
        });
    }

    private showOutOfBattleLockedNotice(parent: Node, tabName: OutOfBattleTabName, systemId: string): void {
        const previous = parent.getChildByName('MainTabLockedNotice');
        if (previous?.isValid) previous.destroy();
        const configuredLevel = outOfBattleSystemUnlockLevel(systemId as Parameters<typeof outOfBattleSystemUnlockLevel>[0]);
        const chapter = configuredLevel ? configuredLevel - 1000 : 1;
        const notice = this.makeLabel(
            'MainTabLockedNotice',
            parent,
            0,
            -520,
            620,
            48,
            `${tabName}将在通关第 ${chapter} 关后开放`,
            18,
            new Color(255, 225, 139, 255),
        );
        this.applyOriginalOutline(notice, new Color(35, 26, 20, 255), 3);
        this.scheduleOnce(() => {
            if (notice.node.isValid) notice.node.destroy();
        }, 1.8);
    }

    private createOutOfBattleScene(sceneName: string, backgroundName: string, pageTitle: string): Node {
        profiler.hideStats();
        this.resetLevelSession();
        this.destroyRootChildren();
        const root = this.makeNode(sceneName, this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        this.addMenuBackground(root, backgroundName);
        const shade = this.makeNode(`${sceneName}Shade`, root, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const graphics = shade.addComponent(Graphics);
        graphics.fillColor = new Color(12, 20, 30, 184);
        graphics.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        graphics.fill();
        this.buildOutOfBattleResourceHeader(root, pageTitle);
        return root;
    }

    private loadOutOfBattleAudioSettings(): void {
        const clampVolume = (value: string | null): number => {
            const parsed = value === null ? 1 : Number(value);
            return Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : 1;
        };
        this.outOfBattleMusicVolume = clampVolume(sys.localStorage.getItem('hamsterBattle.musicVolume'));
        this.outOfBattleSoundVolume = clampVolume(sys.localStorage.getItem('hamsterBattle.soundVolume'));
        this.applyOutOfBattleSoundVolume();
    }

    private applyOutOfBattleSoundVolume(): void {
        this.node.getComponents(AudioSource).forEach((source) => {
            source.volume = this.outOfBattleSoundVolume;
        });
    }

    private adjustOutOfBattleAudio(kind: 'music' | 'sound', delta: number): void {
        if (kind === 'music') {
            this.outOfBattleMusicVolume = Math.max(0, Math.min(1, this.outOfBattleMusicVolume + delta));
            sys.localStorage.setItem('hamsterBattle.musicVolume', this.outOfBattleMusicVolume.toFixed(2));
        } else {
            this.outOfBattleSoundVolume = Math.max(0, Math.min(1, this.outOfBattleSoundVolume + delta));
            sys.localStorage.setItem('hamsterBattle.soundVolume', this.outOfBattleSoundVolume.toFixed(2));
            this.applyOutOfBattleSoundVolume();
        }
        this.showSettingsScene();
    }

    private showSettingsScene(): void {
        this.loadOutOfBattleAudioSettings();
        const root = this.createOutOfBattleScene('SettingsScene', 'fightscene_01', '设置');
        this.makeLabel('SettingsTitle', root, 0, 550, 620, 58, '设置', 40, GOLD);
        this.makeLabel('SettingsHint', root, 0, 502, 700, 40,
            '调整音乐和音效，打造更舒适的战斗体验', 18, CREAM);

        const makeVolumeRow = (kind: 'music' | 'sound', y: number, title: string, value: number): void => {
            const row = this.makeNode(`Settings_${kind}`, root, 0, y, 660, 126);
            const graphics = row.addComponent(Graphics);
            graphics.fillColor = new Color(31, 48, 71, 247);
            graphics.roundRect(-330, -63, 660, 126, 22);
            graphics.fill();
            graphics.strokeColor = new Color(103, 147, 187, 255);
            graphics.lineWidth = 3;
            graphics.roundRect(-328, -61, 656, 122, 20);
            graphics.stroke();
            this.makeLabel(`Settings_${kind}_Title`, row, -225, 0, 150, 44, title, 24, WHITE);
            const minus = this.makeButton(`Settings_${kind}_Minus`, row, -68, 0, 72, 54, '－', () => this.adjustOutOfBattleAudio(kind, -0.25));
            const plus = this.makeButton(`Settings_${kind}_Plus`, row, 250, 0, 72, 54, '＋', () => this.adjustOutOfBattleAudio(kind, 0.25));
            minus.node.parent!.getComponent(Button)!.interactable = value > 0;
            plus.node.parent!.getComponent(Button)!.interactable = value < 1;
            this.makeLabel(`Settings_${kind}_Value`, row, 90, 0, 220, 50, `${Math.round(value * 100)}%`, 26, GOLD);
        };
        makeVolumeRow('music', 365, '音乐音量', this.outOfBattleMusicVolume);
        makeVolumeRow('sound', 205, '音效音量', this.outOfBattleSoundVolume);

        const code = this.makeButton('SettingsCode', root, -180, 25, 300, 68, '兑换码', () => undefined);
        const feedback = this.makeButton('SettingsFeedback', root, 180, 25, 300, 68, '问题反馈', () => undefined);
        this.restyleButton(code, new Color(68, 75, 88, 255), new Color(168, 174, 186, 255));
        this.restyleButton(feedback, new Color(68, 75, 88, 255), new Color(168, 174, 186, 255));
        code.node.parent!.getComponent(Button)!.interactable = false;
        feedback.node.parent!.getComponent(Button)!.interactable = false;
        this.makeLabel('SettingsUnavailable', root, 0, -85, 700, 96,
            '兑换码与问题反馈功能暂未开放', 17, CREAM);
        this.makeLabel('SettingsAccount', root, 0, -205, 700, 74,
            '游客账号\n游戏进度已保存在当前设备', 18, WHITE);
        const close = this.makeButton('SettingsClose', root, 0, -350, 260, 66, '关闭', () => this.showMainScene());
        this.restyleButton(close, new Color(43, 99, 132, 255), WHITE);
        this.buildMainBottomNavigation(root, '战斗');
    }

    private showShopScene(message = ''): void {
        this.mockAdvertisementState = loadMockAdvertisementState(sys.localStorage);
        const root = this.createOutOfBattleScene('ShopScene', 'fightscene_02', '商店');
        this.makeLabel('ShopTitle', root, 0, 550, 620, 58, '商店', 40, GOLD);
        const shopUnlocked = outOfBattleSystemUnlocked(this.accountProfile.maxPassedLevelId, 'SHOP');
        const shopUnlockLevel = outOfBattleSystemUnlockLevel('SHOP')! - 1000;
        this.makeLabel('ShopUnlockHint', root, 0, 507, 690, 36,
            shopUnlocked ? '每日好礼与限购商品' : `通关第 ${shopUnlockLevel} 关后开放`,
            17, CREAM);

        const sectionIds: Array<101 | 102 | 103 | 104> = [101, 102, 103, 104];
        sectionIds.forEach((shopId, index) => {
            const selected = shopId === this.shopSectionId;
            const tab = this.makeButton(`ShopSection_${shopId}`, root, -270 + index * 180, 455, 168, 56,
                OUT_OF_BATTLE_SHOP_NAMES[shopId], () => {
                    this.shopSectionId = shopId;
                    this.showShopScene();
                });
            this.restyleButton(tab, selected ? new Color(211, 145, 38, 255) : new Color(45, 69, 91, 255), WHITE);
            tab.node.parent!.getComponent(Button)!.interactable = !selected;
        });

        const goods = OUT_OF_BATTLE_SHOP_GOODS.filter((good) => good.shopId === this.shopSectionId);
        goods.forEach((good, index) => {
            const column = index % 2;
            const row = Math.floor(index / 2);
            const card = this.makeNode(`ShopGood_${good.id}`, root, column === 0 ? -183 : 183, 285 - row * 285, 340, 244);
            const cardGraphics = card.addComponent(Graphics);
            cardGraphics.fillColor = new Color(31, 48, 71, 247);
            cardGraphics.roundRect(-170, -122, 340, 244, 22);
            cardGraphics.fill();
            const mockEnergyGood = good.id === 104002;
            const diamondEnergyGood = good.id === 104001;
            const mockEnergyAvailable = mockEnergyGood && canClaimMockShopEnergy(this.mockAdvertisementState);
            cardGraphics.strokeColor = good.action === 'fixed' || mockEnergyAvailable ? new Color(92, 177, 154, 255) : new Color(107, 133, 166, 255);
            cardGraphics.lineWidth = 3;
            cardGraphics.roundRect(-168, -120, 336, 240, 20);
            cardGraphics.stroke();
            this.makeLabel(`ShopGoodTag_${good.id}`, card, 0, 88, 300, 30,
                this.shopSectionId === 101 ? '每日精选' : this.shopSectionId === 104 ? '每日限购' : '珍稀商品',
                14, new Color(146, 181, 216, 255));
            this.makeLabel(`ShopGoodName_${good.id}`, card, 0, 52, 300, 38, good.name, 23, WHITE);
            this.makeLabel(`ShopGoodReward_${good.id}`, card, 0, 12, 310, 34, good.rewardText, 20, GOLD);
            this.makeLabel(`ShopGoodCost_${good.id}`, card, 0, -25, 310, 34, good.costText, 16, CREAM);
            const diamondEnergyAvailable = diamondEnergyGood && canBuyDiamondShopEnergy(this.mockAdvertisementState);
            const supported = (good.action === 'fixed' && (!diamondEnergyGood || diamondEnergyAvailable)) || mockEnergyAvailable;
            const actionText = diamondEnergyGood
                ? diamondEnergyAvailable
                    ? `购买 ${mockAdvertisementPlacementCount(this.mockAdvertisementState, 'shop-energy-diamond')}/3`
                    : '今日已购 3/3'
                : good.action === 'fixed' ? '购买'
                : mockEnergyGood
                  ? mockEnergyAvailable
                      ? `观看广告 ${mockAdvertisementPlacementCount(this.mockAdvertisementState, 'shop-energy')}/3`
                      : '今日已领 3/3'
                  : good.action === 'chest' ? '查看宝箱' : '暂未开放';
            const action = this.makeButton(`ShopGoodAction_${good.id}`, card, 0, -82, 220, 52, actionText,
                () => this.purchaseShopGood(good));
            if (!supported || !shopUnlocked) {
                this.restyleButton(action, new Color(68, 75, 88, 255), new Color(160, 166, 178, 255));
                action.node.parent!.getComponent(Button)!.interactable = false;
            }
        });
        const shopRule = this.shopSectionId === 101
            ? `每日可刷新 ${OUT_OF_BATTLE_DAILY_SHOP_AD_REFRESH_MAX} 次`
            : this.shopSectionId === 102
              ? `单抽 ${OUT_OF_BATTLE_BOX_ONE_DRAW_DIAMONDS} 钻 / 十连 ${OUT_OF_BATTLE_BOX_TEN_DRAW_DIAMONDS} 钻 · 每抽宝箱经验 ${OUT_OF_BATTLE_BOX_EXP_PER_DRAW} · 最高 ${OUT_OF_BATTLE_BOX_LEVEL_MAX} 级`
              : this.shopSectionId === 104
                ? '体力商品每日限购，观看广告也可领取体力'
                : '金币商店包含每日免费/广告档与固定钻石购买档';
        this.makeLabel('ShopRule', root, 0, -340, 700, 64, shopRule, 16, GOLD);
        this.makeLabel('ShopMessage', root, 0, -410, 700, 64,
            message || '部分珍稀商品会随活动陆续开放', 17, message ? WHITE : CREAM);
        this.buildMainBottomNavigation(root, '商店');
    }

    private purchaseShopGood(good: OutOfBattleShopGood): void {
        if (!outOfBattleSystemUnlocked(this.accountProfile.maxPassedLevelId, 'SHOP')) {
            this.showShopScene('请先通关第3关解锁商店');
            return;
        }
        if (good.id === 104002) {
            if (!canClaimMockShopEnergy(this.mockAdvertisementState)) {
                this.showShopScene('今日 3 次广告体力已经领取完毕');
                return;
            }
            this.playMockAdvertisement('shop-energy', () => {
                const next = cloneBagLikeAccountProfile(this.accountProfile);
                next.energy += good.rewardEnergy || 0;
                this.accountProfile = next;
                this.persistAccountProfile(false);
                this.showShopScene(`领取成功：${good.rewardText}`);
            }, (outcome) => {
                this.showShopScene(outcome === 'cancelled' ? '广告已取消，未发放体力且未消耗次数' : '广告播放失败，未发放体力且未消耗次数');
            });
            return;
        }
        if (good.id === 104001 && !canBuyDiamondShopEnergy(this.mockAdvertisementState)) {
            this.showShopScene('该体力商品今天已经购买 3 次');
            return;
        }
        const result = purchaseOutOfBattleShopGood(this.accountProfile, good.id);
        if (!result.purchased) {
            this.showShopScene(result.reason === 'diamonds' ? `钻石不足，需要 ${good.costDiamonds || 0}` : '该商品依赖平台或服务器状态，当前不执行');
            return;
        }
        const next = cloneBagLikeAccountProfile(this.accountProfile);
        next.gold = result.wallet.gold;
        next.energy = result.wallet.energy;
        next.diamonds = result.wallet.diamonds;
        this.accountProfile = next;
        if (good.id === 104001) {
            this.mockAdvertisementState = completeMockAdvertisement(this.mockAdvertisementState, 'shop-energy-diamond');
            saveMockAdvertisementState(sys.localStorage, this.mockAdvertisementState);
        }
        this.persistAccountProfile(false);
        this.showShopScene(`购买成功：${good.rewardText}`);
    }

    private showActivityScene(): void {
        const root = this.createOutOfBattleScene('ActivityScene', 'fightscene_03', '活动');
        this.makeLabel('ActivityTitle', root, 0, 550, 620, 58, '活动', 40, GOLD);
        const gameplayUnlocked = outOfBattleSystemUnlocked(this.accountProfile.maxPassedLevelId, 'GAMEPLAY');
        this.makeLabel('ActivityHint', root, 0, 500, 700, 38,
            gameplayUnlocked ? '每日挑战、无尽试炼与限时玩法' : '通关第 6 关后开放', 18, CREAM);
        OUT_OF_BATTLE_GAMEPLAYS.forEach((gameplay, index) => {
            const x = -240 + index * 240;
            const card = this.makeNode(`Gameplay_${gameplay.systemId}`, root, x, 230, 218, 300);
            const graphics = card.addComponent(Graphics);
            graphics.fillColor = new Color(31, 48, 71, 247);
            graphics.roundRect(-109, -150, 218, 300, 22);
            graphics.fill();
            graphics.strokeColor = new Color(111, 145, 183, 255);
            graphics.lineWidth = 3;
            graphics.roundRect(-107, -148, 214, 296, 20);
            graphics.stroke();
            this.makeLabel(`GameplayName_${gameplay.id}`, card, 0, 96, 190, 48, gameplay.name, 23, GOLD);
            this.makeLabel(`GameplayUnlock_${gameplay.id}`, card, 0, 42, 190, 38,
                `第 ${gameplay.unlockLevel - 1000} 关开放`, 17, WHITE);
            this.makeLabel(`GameplayReward_${gameplay.id}`, card, 0, -24, 190, 90,
                `奖励/说明\n${gameplay.rewards}`, 16, CREAM);
            const open = gameplay.systemId === 'ENDLESS_MODE'
                ? () => this.showEndlessModeScene()
                : gameplay.systemId === 'DAILY_INSTANCE'
                  ? () => this.showDailyInstanceScene()
                  : () => undefined;
            const supported = gameplay.systemId !== 'OTHER_GAMES';
            const gameplayEntryUnlocked = this.accountProfile.maxPassedLevelId >= gameplay.unlockLevel;
            const preview = this.makeButton(`GameplayPreview_${gameplay.id}`, card, 0, -105, 172, 50,
                supported ? '查看规则' : '敬请期待', open);
            this.restyleButton(preview,
                supported ? new Color(43, 99, 132, 255) : new Color(68, 75, 88, 255),
                supported ? WHITE : new Color(160, 166, 178, 255));
            preview.node.parent!.getComponent(Button)!.interactable = supported && gameplayEntryUnlocked;
        });
        const daily = this.makeButton('ActivityDailyTask', root, -170, -110, 280, 70, '每日任务', () => this.showDailyTaskScene());
        this.restyleButton(daily, new Color(43, 99, 132, 255), WHITE);
        const sevenDay = this.makeButton('ActivitySevenDay', root, 170, -110, 280, 70, '七天登录', () => this.showSevenDayScene());
        this.restyleButton(sevenDay, new Color(129, 77, 154, 255), WHITE);
        this.makeLabel('ActivityEvidence', root, 0, -285, 700, 120,
            '挑战不同玩法，赢取金币和成长奖励', 17, CREAM);
        this.buildMainBottomNavigation(root, '活动');
    }

    private showDailyInstanceScene(notice = ''): void {
        if (!this.specialModeTable) return;
        this.specialModeState = loadSpecialModeState(sys.localStorage);
        const selectedRuntime = currentDailyInstance(this.specialModeTable);
        const rotation = currentDailyRotation(this.specialModeTable);
        const selected = OUT_OF_BATTLE_DAILY_INSTANCES.find((row) => row.id === selectedRuntime.id) || OUT_OF_BATTLE_DAILY_INSTANCES[0];
        const rewardRow = dailyRewardForProgress(this.specialModeTable, this.accountProfile.maxPassedLevelId);
        const unlocked = this.accountProfile.maxPassedLevelId >= 1010;
        const eligibility = canStartSpecialMode(this.specialModeState, this.accountProfile, 'daily');
        const root = this.createOutOfBattleScene('DailyInstanceScene', selected.fightScene, '每日挑战');
        this.makeLabel('DailyInstanceTitle', root, 0, 550, 620, 58, '每日挑战', 40, GOLD);
        this.makeLabel('DailyInstanceHint', root, 0, 505, 700, 38,
            `今日第 ${rotation.id} 组 · 剩余 ${Math.max(0, 3 - this.specialModeState.daily.challengeTimes)}/3 次 · 每次体力 5`, 18, CREAM);

        const detail = this.makeNode('DailyInstanceDetail', root, 0, 145, 690, 520);
        const detailGraphics = detail.addComponent(Graphics);
        detailGraphics.fillColor = new Color(31, 48, 71, 247);
        detailGraphics.roundRect(-345, -260, 690, 520, 24);
        detailGraphics.fill();
        detailGraphics.strokeColor = new Color(111, 145, 183, 255);
        detailGraphics.lineWidth = 3;
        detailGraphics.roundRect(-343, -258, 686, 516, 22);
        detailGraphics.stroke();
        this.makeLabel('DailyInstanceName', detail, 0, 176, 620, 46, selected.name, 28, GOLD);
        this.makeLabel('DailyInstanceRounds', detail, 0, 132, 620, 36,
            `${selected.roundCount} 波 · 初始副本金币 ${selected.initialDailyGold}`, 18, WHITE);
        rotation.buffIds.forEach((effectId, index) => {
            const effect = OUT_OF_BATTLE_DAILY_EFFECTS[effectId];
            const color = effect.buff ? new Color(128, 241, 165, 255) : new Color(255, 157, 142, 255);
            this.makeLabel(`DailyInstanceEffect_${effectId}`, detail, 0, 72 - index * 66, 626, 58,
                `${effect.buff ? '增益' : '减益'} · ${effect.name}：${effect.description}`, 16, color);
        });
        const ruleText = OUT_OF_BATTLE_DAILY_RULES.map((rule) => `${rule.title}：${rule.description}`).join('\n');
        this.makeLabel('DailyInstanceRules', detail, 0, -190, 640, 104, ruleText, 15, CREAM);

        this.makeLabel('DailyInstanceRewards', root, 0, -170, 700, 70,
            `今日局内金币 ${this.specialModeState.daily.dailyGold} · 里程碑 ${rewardRow.rewardRounds.join(' / ')}`, 16, GOLD);
        const startText = !unlocked ? '通关第10关开放'
            : eligibility.reason === 'attempts' ? '今日次数已用完'
              : eligibility.reason === 'energy' ? '体力不足'
                : '开始每日挑战';
        const start = this.makeButton('DailyInstanceStart', root, -205, -265, 280, 62, startText, () => this.beginSpecialBattle('daily'));
        start.node.parent!.getComponent(Button)!.interactable = unlocked && eligibility.allowed;
        this.restyleButton(start, unlocked && eligibility.allowed ? new Color(211, 145, 38, 255) : new Color(68, 75, 88, 255), WHITE);
        const claim = this.makeButton('DailyInstanceClaim', root, 120, -265, 210, 62, '领取里程碑', () => this.claimAvailableDailyMilestones());
        this.restyleButton(claim, new Color(45, 151, 92, 255), WHITE);
        const back = this.makeButton('DailyInstanceBack', root, 285, -265, 105, 62, '返回', () => this.showActivityScene());
        this.restyleButton(back, new Color(43, 99, 132, 255), WHITE);
        this.makeLabel('DailyInstanceEvidence', root, 0, -345, 700, 80,
            notice || '当天轮换、挑战次数、局内金币与里程碑领取均已接入本地日期存档', 16, CREAM);
        this.buildMainBottomNavigation(root, '活动');
    }

    private claimAvailableDailyMilestones(): void {
        if (!this.specialModeTable) return;
        const rewardRow = dailyRewardForProgress(this.specialModeTable, this.accountProfile.maxPassedLevelId);
        const messages: string[] = [];
        for (let index = 0; index < rewardRow.rewardRounds.length; index += 1) {
            const claim = claimDailyMilestone(this.specialModeState, this.accountProfile, rewardRow, index, Math.random);
            if (!claim.claimed) continue;
            this.specialModeState = claim.state;
            this.accountProfile = claim.profile;
            messages.push(claim.text);
        }
        saveSpecialModeState(sys.localStorage, this.specialModeState);
        this.persistAccountProfile(false);
        this.showDailyInstanceScene(messages.length > 0 ? `领取成功：${messages.join('；')}` : '当前没有可领取的里程碑奖励');
    }

    private showEndlessModeScene(notice = ''): void {
        this.specialModeState = loadSpecialModeState(sys.localStorage);
        const unlocked = this.accountProfile.maxPassedLevelId >= 1006;
        const eligibility = canStartSpecialMode(this.specialModeState, this.accountProfile, 'endless');
        const root = this.createOutOfBattleScene('EndlessModeScene', OUT_OF_BATTLE_ENDLESS.fightScene, '无尽试炼');
        this.makeLabel('EndlessModeTitle', root, 0, 550, 620, 58, '无尽试炼', 40, GOLD);
        this.makeLabel('EndlessModeHint', root, 0, 502, 700, 40, '坚持越久，奖励越丰厚', 18, CREAM);
        const panel = this.makeNode('EndlessModePanel', root, 0, 165, 680, 520);
        const graphics = panel.addComponent(Graphics);
        graphics.fillColor = new Color(31, 48, 71, 247);
        graphics.roundRect(-340, -260, 680, 520, 28);
        graphics.fill();
        graphics.strokeColor = GOLD;
        graphics.lineWidth = 4;
        graphics.roundRect(-338, -258, 676, 516, 26);
        graphics.stroke();
        this.makeLabel('EndlessModeRound', panel, 0, 196, 610, 48,
            `持续 300 秒 · 敌人会不断变强`, 21, GOLD);
        this.makeLabel('EndlessModeRules', panel, 0, 65, 610, 210,
            `每日挑战 ${OUT_OF_BATTLE_ENDLESS.dailyChallengeTimes} 次，跨天清零\n每次消耗体力 ${OUT_OF_BATTLE_ENDLESS.costEnergy}\n初始副本金币 ${OUT_OF_BATTLE_ENDLESS.initialDailyGold}\n第 ${OUT_OF_BATTLE_ENDLESS.advertisementAttempt} 次挑战需要广告\n难度继承当前主线进度倍率`, 19, WHITE);
        this.makeLabel('EndlessModeRecord', panel, 0, -105, 610, 92,
            `最高击杀 ${this.specialModeState.endless.maxKillCount} · 最高金币 ${this.specialModeState.endless.maxGold}\n今日剩余 ${Math.max(0, 3 - this.specialModeState.endless.challengeTimes)}/3 次`, 18, CREAM);
        const startText = !unlocked ? '通关第6关开放'
            : eligibility.reason === 'attempts' ? '今日次数已用完'
              : eligibility.reason === 'energy' ? '体力不足'
                : eligibility.needsAd ? '广告挑战（第3次）' : '开始无尽试炼';
        const start = this.makeButton('EndlessModeStart', panel, 0, -205, 320, 62, startText, () => this.beginSpecialBattle('endless'));
        this.restyleButton(start, unlocked && eligibility.allowed ? new Color(211, 145, 38, 255) : new Color(68, 75, 88, 255), WHITE);
        start.node.parent!.getComponent(Button)!.interactable = unlocked && eligibility.allowed;
        this.makeLabel('EndlessModeEvidence', root, 0, -180, 700, 104,
            notice || '300 秒计时、560 条刷怪、敌方基地、击杀金币与历史最高纪录均已接入', 17, CREAM);
        const back = this.makeButton('EndlessModeBack', root, 0, -315, 260, 62, '返回活动', () => this.showActivityScene());
        this.restyleButton(back, new Color(43, 99, 132, 255), WHITE);
        this.buildMainBottomNavigation(root, '活动');
    }

    private showSevenDayScene(): void {
        const root = this.createOutOfBattleScene('SevenDayScene', 'fightscene_03', '七天登录');
        this.makeLabel('SevenDayTitle', root, 0, 550, 620, 58, '七天登录', 40, GOLD);
        this.makeLabel('SevenDayHint', root, 0, 500, 700, 38, '每日登录，连续七天领取好礼', 18, CREAM);
        OUT_OF_BATTLE_SEVEN_DAY_REWARDS.forEach((reward, index) => {
            const column = index % 4;
            const row = Math.floor(index / 4);
            const x = -270 + column * 180;
            const y = 300 - row * 230;
            const card = this.makeNode(`SevenDay_${reward.day}`, root, x, y, 164, 190);
            const graphics = card.addComponent(Graphics);
            graphics.fillColor = reward.day === 7 ? new Color(102, 62, 125, 248) : new Color(31, 48, 71, 247);
            graphics.roundRect(-82, -95, 164, 190, 18);
            graphics.fill();
            graphics.strokeColor = reward.day === 7 ? GOLD : new Color(111, 145, 183, 255);
            graphics.lineWidth = 3;
            graphics.roundRect(-80, -93, 160, 186, 16);
            graphics.stroke();
            this.makeLabel(`SevenDayNumber_${reward.day}`, card, 0, 53, 140, 38, `第${reward.day}天`, 20, GOLD);
            this.makeLabel(`SevenDayReward_${reward.day}`, card, 0, -3, 146, 72,
                reward.day === 7 ? '豪华齿轮碎片\n×100' : reward.rewardText, reward.day === 7 ? 15 : 17, WHITE);
            this.makeLabel(`SevenDayState_${reward.day}`, card, 0, -65, 140, 30, '暂未开放', 14, new Color(163, 171, 184, 255));
        });
        this.makeLabel('SevenDayEvidence', root, 0, -310, 700, 90,
            '登录奖励领取功能即将开放', 17, CREAM);
        this.buildMainBottomNavigation(root, '活动');
    }

    private showDailyTaskScene(): void {
        this.mockAdvertisementState = loadMockAdvertisementState(sys.localStorage);
        const root = this.createOutOfBattleScene('DailyTaskScene', 'fightscene_02', '每日任务');
        this.makeLabel('DailyTaskTitle', root, 0, 550, 620, 58, '每日任务', 40, GOLD);
        const unlocked = outOfBattleSystemUnlocked(this.accountProfile.maxPassedLevelId, 'DAILY_TASK');
        this.makeLabel('DailyTaskHint', root, 0, 505, 700, 38,
            unlocked ? '完成每日任务，积累活跃度领取宝箱' : '通关第 2 关后开放', 18, CREAM);
        OUT_OF_BATTLE_DAILY_TASKS.forEach((task, index) => {
            const y = 420 - index * 86;
            const row = this.makeNode(`DailyTask_${task.id}`, root, 0, y, 690, 70);
            const graphics = row.addComponent(Graphics);
            graphics.fillColor = new Color(31, 48, 71, 242);
            graphics.roundRect(-345, -35, 690, 70, 16);
            graphics.fill();
            this.makeLabel(`DailyTaskText_${task.id}`, row, -105, 0, 430, 38, task.text, 18, WHITE);
            const progressText = task.id === 1005
                ? `${Math.min(task.target, this.mockAdvertisementState.todayCompleted)} / ${task.target}`
                : `-- / ${task.target}`;
            this.makeLabel(`DailyTaskProgress_${task.id}`, row, 165, 0, 130, 38, progressText, 17, CREAM);
            this.makeLabel(`DailyTaskActive_${task.id}`, row, 285, 0, 90, 38, `+${task.activeScore}`, 18, GOLD);
        });
        const activeRewards = OUT_OF_BATTLE_DAILY_ACTIVE_REWARDS.map((reward) => `${reward.active}:${reward.rewardText}`).join('　');
        this.makeLabel('DailyActiveRewards', root, 0, -230, 700, 100, `活跃度宝箱\n${activeRewards}`, 15, GOLD);
        this.makeLabel('DailyTaskEvidence', root, 0, -345, 700, 72,
            '部分任务进度会在对应玩法完成后更新', 17, CREAM);
        this.buildMainBottomNavigation(root, '战斗');
    }

    private showRoleScene(message = ''): void {
        this.powerRoleState = loadPowerRoleState(sys.localStorage);
        profiler.hideStats();
        this.resetLevelSession();
        this.destroyRootChildren();
        const root = this.makeNode('RoleScene', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        this.addMenuBackground(root, 'post-unlock/bg1');
        const shade = this.makeNode('RoleShade', root, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const shadeGraphics = shade.addComponent(Graphics);
        shadeGraphics.fillColor = new Color(12, 20, 30, 172);
        shadeGraphics.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        shadeGraphics.fill();
        this.buildOutOfBattleResourceHeader(root, '角色');
        this.makeLabel('RoleTitle', root, 0, 550, 620, 62, '角色', 42, GOLD);
        const roleUnlocked = outOfBattleSystemUnlocked(this.accountProfile.maxPassedLevelId, 'ROLE');
        this.makeLabel('RoleHint', root, 0, 500, 690, 42,
            roleUnlocked ? `当前出战：${OUT_OF_BATTLE_POWER_ROLES.find((role) => role.id === this.powerRoleState.equippedRoleId)?.name || '跑跑鼠'}` : '通关第5关后开放', 20, CREAM);

        OUT_OF_BATTLE_POWER_ROLES.forEach((role, index) => {
            const column = index % HERO_FAIRYGUI_LAYOUT.list.columns;
            const row = Math.floor(index / HERO_FAIRYGUI_LAYOUT.list.columns);
            const itemLeft = HERO_FAIRYGUI_LAYOUT.list.x
                + column * (HERO_FAIRYGUI_LAYOUT.item.width + HERO_FAIRYGUI_LAYOUT.list.columnGap);
            const itemTop = HERO_FAIRYGUI_LAYOUT.list.y
                + row * (HERO_FAIRYGUI_LAYOUT.item.height + HERO_FAIRYGUI_LAYOUT.list.lineGap);
            const x = itemLeft + HERO_FAIRYGUI_LAYOUT.item.width / 2 - DESIGN_WIDTH / 2;
            const y = DESIGN_HEIGHT / 2 - itemTop - HERO_FAIRYGUI_LAYOUT.item.height / 2;
            this.buildFairyGuiPowerRoleItem(root, role, x, y, roleUnlocked);
        });
        if (message.startsWith('升星成功') || message.startsWith('免费升级成功')) {
            this.playPowerRoleUpgradeGlow(root);
        }
        this.makeLabel('RoleMessage', root, 0, -420, 700, 74,
            message || `每名角色每天可领取 3 次免费碎片；集齐 ${OUT_OF_BATTLE_POWER_STAR_ZERO_COST} 片即可招募`, 17, message ? WHITE : CREAM);
        this.buildMainBottomNavigation(root, '角色');
    }

    private buildFairyGuiPowerRoleItem(
        root: Node,
        role: OutOfBattlePowerRole,
        x: number,
        y: number,
        roleUnlocked: boolean,
    ): void {
        const layout = HERO_FAIRYGUI_LAYOUT;
        const progress = this.powerRoleState.roles[role.id];
        const owned = progress.star >= 0;
        const equipped = this.powerRoleState.equippedRoleId === role.id;
        const quality = role.quality === 3 ? 3 : 4;
        const frames = POWER_ROLE_QUALITY_FRAMES[quality];
        const card = this.makeNode(`RoleCard_${role.id}`, root, x, y, layout.item.width, layout.item.height);
        card.addComponent(Button);
        card.on(Button.EventType.CLICK, () => this.showRoleDetailScene(role.id), this);

        const topLeftCenter = (spec: { x: number; y: number; width: number; height: number }): readonly [number, number] => [
            spec.x + spec.width / 2 - layout.item.width / 2,
            layout.item.height / 2 - spec.y - spec.height / 2,
        ];
        const [backgroundX, backgroundY] = topLeftCenter(layout.background);
        const background = this.makeNode(
            `RoleQualityFrame_${role.id}`,
            card,
            backgroundX,
            backgroundY,
            layout.background.width,
            layout.background.height,
        );
        this.attachRecoveredAtlasSprite(background, 'original/post-unlock/image_quality/spriteFrame', frames.hero);

        const [shapeX, shapeY] = topLeftCenter(layout.shape);
        const shape = this.makeNode(`RoleQualityShape_${role.id}`, card, shapeX, shapeY, layout.shape.width, layout.shape.height);
        this.attachRecoveredAtlasSprite(shape, 'original/post-unlock/image_quality/spriteFrame', frames.shape);
        this.makeLabel(`RoleState_${role.id}`, shape, 0, 0, 52, 30,
            equipped ? '出战' : owned ? `${Math.max(0, progress.star)}★` : '锁', 14, equipped ? GOLD : WHITE);

        const portraitX = layout.portrait.x - layout.item.width / 2;
        const portraitY = layout.item.height / 2 - layout.portrait.y;
        this.attachPowerRolePortrait(card, role.id, portraitX, portraitY);

        const nameX = layout.name.x - layout.item.width / 2;
        const nameY = layout.item.height / 2 - layout.name.y;
        this.makeLabel(`RoleName_${role.id}`, card, nameX, nameY, layout.name.width, layout.name.height,
            role.name, 19, owned ? WHITE : new Color(172, 179, 190, 255));

        const [levelBarX, levelBarY] = topLeftCenter(layout.levelBar);
        const levelBar = this.makeNode(
            `RoleLevelFrame_${role.id}`,
            card,
            levelBarX,
            levelBarY,
            layout.levelBar.width,
            layout.levelBar.height,
        );
        this.attachRecoveredAtlasSprite(levelBar, 'original/post-unlock/image_quality/spriteFrame', frames.level);
        const levelX = layout.level.x - layout.item.width / 2;
        const levelY = layout.item.height / 2 - layout.level.y;
        this.makeLabel(`RoleLevel_${role.id}`, card, levelX, levelY, layout.level.width, layout.level.height,
            owned ? `Lv.${progress.level}` : '未获得', 17, WHITE);

        const [fragmentX, fragmentY] = topLeftCenter(layout.fragmentBar);
        const fragment = this.makeNode(
            `RoleFragmentBar_${role.id}`,
            card,
            fragmentX,
            fragmentY,
            layout.fragmentBar.width,
            layout.fragmentBar.height,
        );
        const fragmentGraphics = fragment.addComponent(Graphics);
        fragmentGraphics.fillColor = new Color(28, 40, 56, 230);
        fragmentGraphics.roundRect(-94, -14, 188, 28, 13);
        fragmentGraphics.fill();
        const targetStar = Math.max(0, progress.star + 1);
        const fragmentCost = POWER_ROLE_STAR_COSTS[Math.min(POWER_ROLE_MAX_STAR, targetStar)];
        const ratio = progress.star >= POWER_ROLE_MAX_STAR ? 1 : Math.min(1, progress.fragments / Math.max(1, fragmentCost));
        if (ratio > 0) {
            fragmentGraphics.fillColor = quality === 3 ? new Color(49, 180, 255, 255) : new Color(214, 103, 255, 255);
            fragmentGraphics.roundRect(-91, -11, 182 * ratio, 22, 10);
            fragmentGraphics.fill();
        }
        this.makeLabel(`RoleFragments_${role.id}`, fragment, 0, 0, 178, 24,
            progress.star >= POWER_ROLE_MAX_STAR ? '已满星' : `${progress.fragments}/${fragmentCost}`, 14, WHITE);

        if (!roleUnlocked) {
            const lock = this.makeNode(`RoleLockedShade_${role.id}`, card, -5, -2, 216, 322);
            const lockGraphics = lock.addComponent(Graphics);
            lockGraphics.fillColor = new Color(11, 18, 26, 150);
            lockGraphics.roundRect(-108, -161, 216, 322, 20);
            lockGraphics.fill();
        }
    }

    private progressPowerRole(id: PowerRoleId): void {
        const progress = this.powerRoleState.roles[id];
        const targetStar = Math.max(0, progress.star + 1);
        const cost = POWER_ROLE_STAR_COSTS[Math.min(POWER_ROLE_MAX_STAR, targetStar)];
        if (progress.fragments >= cost) {
            if (progress.star < 0) {
                const result = activatePowerRole(this.powerRoleState, id);
                this.powerRoleState = result.state;
                savePowerRoleState(sys.localStorage, this.powerRoleState);
                this.showRoleScene(result.activated ? '角色招募成功，现在可以设为出战角色' : '角色碎片不足');
            } else {
                const result = upgradePowerRoleStar(this.powerRoleState, id);
                this.powerRoleState = result.state;
                savePowerRoleState(sys.localStorage, this.powerRoleState);
                this.showRoleScene(result.upgraded ? `升星成功：${this.powerRoleState.roles[id].star} 星` : '角色碎片不足');
            }
            return;
        }
        if (progress.freeFragmentTimes >= POWER_ROLE_DAILY_FREE_FRAGMENT_TIMES) {
            this.showRoleScene('该角色今天的 3 次免费碎片已经领取完毕');
            return;
        }
        this.playMockAdvertisement('role-fragment', () => {
            const result = claimPowerRoleFreeFragments(this.powerRoleState, id);
            this.powerRoleState = result.state;
            savePowerRoleState(sys.localStorage, this.powerRoleState);
            this.showRoleScene(result.claimed ? `获得 ${POWER_ROLE_FREE_FRAGMENT_COUNT} 个角色碎片` : '今天的免费次数已经用完');
        }, (outcome) => {
            this.showRoleScene(outcome === 'cancelled' ? '广告已取消，未发放碎片' : '广告播放失败，未发放碎片');
        });
    }

    private equipPowerRoleFromUi(id: PowerRoleId): void {
        const result = equipPowerRole(this.powerRoleState, id);
        this.powerRoleState = result.state;
        savePowerRoleState(sys.localStorage, this.powerRoleState);
        this.showRoleScene(result.equipped ? '出战角色已更换' : '请先招募该角色');
    }

    private upgradePowerRoleLevelFromUi(id: PowerRoleId): void {
        const progress = this.powerRoleState.roles[id];
        if (progress.star < 0) {
            this.showRoleScene('请先招募该角色');
            return;
        }
        if (progress.level >= powerRoleLevelLimit(progress.star)) {
            this.showRoleScene('当前星级的等级已经达到上限，请先升星');
            return;
        }
        if (progress.freeLevelTimes >= POWER_ROLE_DAILY_FREE_LEVEL_TIMES) {
            this.showRoleScene('该角色今天的 3 次免费升级已经用完');
            return;
        }
        this.playMockAdvertisement('role-level', () => {
            const result = claimPowerRoleFreeLevel(this.powerRoleState, id);
            this.powerRoleState = result.state;
            savePowerRoleState(sys.localStorage, this.powerRoleState);
            this.showRoleScene(result.upgraded ? `免费升级成功：${this.powerRoleState.roles[id].level} 级` : '当前无法升级');
        }, (outcome) => {
            this.showRoleScene(outcome === 'cancelled' ? '广告已取消，未升级' : '广告播放失败，未升级');
        });
    }

    private showRoleDetailScene(powerId: OutOfBattlePowerRole['id']): void {
        const role = OUT_OF_BATTLE_POWER_ROLES.find((entry) => entry.id === powerId) || OUT_OF_BATTLE_POWER_ROLES[0];
        const abilities = outOfBattlePowerAbilities(role.id);
        const root = this.createOutOfBattleScene('RoleDetailScene', 'fightscene_03', '角色详情');
        this.makeLabel('RoleDetailTitle', root, 0, 550, 620, 58, role.name, 38, GOLD);
        this.makeLabel('RoleDetailHint', root, 0, 505, 700, 38,
            `${'★'.repeat(role.quality)} 传奇角色 · 最高 ${OUT_OF_BATTLE_POWER_STAR_MAX} 星`, 18, CREAM);
        abilities.forEach((ability, index) => {
            const y = 418 - index * 78;
            const row = this.makeNode(`RoleAbility_${ability.id}`, root, 0, y, 690, 66);
            const graphics = row.addComponent(Graphics);
            graphics.fillColor = index === 0 ? new Color(65, 70, 101, 247) : new Color(31, 48, 71, 242);
            graphics.roundRect(-345, -33, 690, 66, 15);
            graphics.fill();
            graphics.strokeColor = ability.star === 0 ? GOLD : new Color(89, 122, 157, 255);
            graphics.lineWidth = 2;
            graphics.roundRect(-343, -31, 686, 62, 13);
            graphics.stroke();
            this.makeLabel(`RoleAbilityStar_${ability.id}`, row, -282, 0, 100, 38,
                ability.star === 0 ? '基础' : `${ability.star} 星`, 18, ability.star === 0 ? GOLD : WHITE);
            this.makeLabel(`RoleAbilityText_${ability.id}`, row, 58, 0, 550, 54,
                ability.description, 15, CREAM);
        });
        const progress = this.powerRoleState.roles[role.id];
        const owned = progress.star >= 0;
        const equipped = this.powerRoleState.equippedRoleId === role.id;
        const targetStar = Math.max(0, progress.star + 1);
        const fragmentCost = POWER_ROLE_STAR_COSTS[Math.min(POWER_ROLE_MAX_STAR, targetStar)];
        const remainingFree = Math.max(0, POWER_ROLE_DAILY_FREE_FRAGMENT_TIMES - progress.freeFragmentTimes);
        const enoughFragments = progress.fragments >= fragmentCost;
        const progressAction = this.makeButton('RoleDetailProgress', root, -224, -224, 210, 50,
            progress.star >= POWER_ROLE_MAX_STAR
                ? '已满星'
                : enoughFragments
                  ? owned ? '升星' : '招募'
                  : `免费碎片 +${POWER_ROLE_FREE_FRAGMENT_COUNT}（${remainingFree}/3）`,
            () => this.progressPowerRole(role.id));
        progressAction.fontSize = 15;
        const progressEnabled = progress.star < POWER_ROLE_MAX_STAR && (enoughFragments || remainingFree > 0);
        this.restyleButton(progressAction,
            progressEnabled ? new Color(94, 76, 153, 255) : new Color(70, 76, 88, 255), WHITE);
        progressAction.node.parent!.getComponent(Button)!.interactable = progressEnabled;

        const freeLevelRemaining = Math.max(0, POWER_ROLE_DAILY_FREE_LEVEL_TIMES - progress.freeLevelTimes);
        const levelLimit = powerRoleLevelLimit(progress.star);
        const levelUp = this.makeButton('RoleDetailLevel', root, 0, -224, 210, 50,
            owned ? `Lv.${progress.level}/${levelLimit} · 升级` : '招募后升级',
            () => this.upgradePowerRoleLevelFromUi(role.id));
        levelUp.fontSize = 15;
        this.restyleButton(levelUp, new Color(57, 91, 135, 255), WHITE);
        levelUp.node.parent!.getComponent(Button)!.interactable = owned
            && progress.level < levelLimit && freeLevelRemaining > 0;

        const equip = this.makeButton('RoleDetailEquip', root, 224, -224, 210, 50,
            equipped ? '出战中' : owned ? '设为出战' : '尚未获得', () => this.equipPowerRoleFromUi(role.id));
        this.restyleButton(equip, equipped ? new Color(43, 132, 96, 255) : new Color(56, 82, 105, 255), WHITE);
        equip.node.parent!.getComponent(Button)!.interactable = owned && !equipped;
        this.makeLabel('RoleDetailEvidence', root, 0, -310, 700, 48,
            '提升星级可逐步解锁全部角色能力', 16, CREAM);
        const back = this.makeButton('RoleDetailBack', root, 0, -405, 250, 56, '返回角色', () => this.showRoleScene());
        this.restyleButton(back, new Color(43, 99, 132, 255), WHITE);
        this.buildMainBottomNavigation(root, '角色');
    }

    private showCultivationScene(message = ''): void {
        profiler.hideStats();
        this.resetLevelSession();
        this.destroyRootChildren();
        const root = this.makeNode('CultivationScene', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        this.addMenuBackground(root, 'fightscene_01');
        const shade = this.makeNode('CultivationShade', root, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const shadeGraphics = shade.addComponent(Graphics);
        shadeGraphics.fillColor = new Color(12, 19, 30, 218);
        shadeGraphics.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        shadeGraphics.fill();
        this.makeLabel('CultivationTitle', root, 0, 588, 620, 58, '兵种培养', 40, GOLD);
        this.makeLabel('CultivationResources', root, 0, 535, 680, 42,
            `金币 ${this.accountProfile.gold}　体力 ${this.accountProfile.energy}　钻石 ${this.accountProfile.diamonds}`,
            20, WHITE);

        const pageSize = 6;
        const pageCount = Math.ceil(BAGLIKE_ACCOUNT_HERO_FAMILIES.length / pageSize);
        this.cultivationPage = Math.max(0, Math.min(pageCount - 1, this.cultivationPage));
        BAGLIKE_ACCOUNT_HERO_FAMILIES
            .slice(this.cultivationPage * pageSize, (this.cultivationPage + 1) * pageSize)
            .forEach((family, index) => {
                const column = index % 2;
                const row = Math.floor(index / 2);
                const x = column === 0 ? -184 : 184;
                const y = 385 - row * 270;
                const star = this.accountProfile.stars[family];
                const unlocked = star > 0;
                const fragments = bagLikeAccountHeroFragments(this.accountProfile, family);
                const cost = unlocked ? bagLikeHeroUpgradeCost(star) : null;
                const unlockLevel = bagLikeHeroUnlockLevel(family);
                const card = this.makeNode(`CultivationCard_${family}`, root, x, y, 340, 236);
                const cardGraphics = card.addComponent(Graphics);
                cardGraphics.fillColor = new Color(31, 48, 71, 247);
                cardGraphics.roundRect(-170, -118, 340, 236, 22);
                cardGraphics.fill();
                cardGraphics.strokeColor = unlocked ? new Color(105, 171, 222, 255) : new Color(83, 91, 107, 255);
                cardGraphics.lineWidth = 3;
                cardGraphics.roundRect(-168, -116, 336, 232, 20);
                cardGraphics.stroke();
                const headKey = this.gearHeadKey(`${family}01` as GearId);
                if (headKey) this.attachStaticGearPortrait(card, headKey, -105, 48);
                this.makeLabel(`CultivationName_${family}`, card, 49, 72, 205, 38,
                    ACCOUNT_HERO_NAMES[family], 21, unlocked ? WHITE : new Color(151, 157, 169, 255));
                this.makeLabel(`CultivationStar_${family}`, card, 45, 29, 200, 34,
                    unlocked ? `${star} 星` : `通关第 ${bagLikeLevelNumber(unlockLevel)} 关解锁`, 20, unlocked ? GOLD : new Color(154, 160, 173, 255));
                this.makeLabel(`CultivationFragments_${family}`, card, -58, -42, 190, 36,
                    `碎片 ${fragments}${cost ? ` / ${cost.fragments}` : ''}`, 18, new Color(157, 213, 255, 255));
                this.makeLabel(`CultivationGold_${family}`, card, 82, -42, 130, 36,
                    cost ? `${cost.gold} 金币` : unlocked ? '已满星' : '未解锁', 17, CREAM);
                const upgrade = this.makeButton(`CultivationUpgrade_${family}`, card, 0, -88, 230, 50,
                    !unlocked ? '尚未解锁' : cost ? '升星' : '已满星', () => this.upgradeCultivationHero(family));
                if (!unlocked || !cost) {
                    this.restyleButton(upgrade, new Color(70, 76, 88, 255), new Color(160, 164, 174, 255));
                    upgrade.node.parent!.getComponent(Button)!.interactable = false;
                }
            });

        const previous = this.makeButton('CultivationPrevious', root, -205, -450, 160, 56, '上一页', () => {
            this.cultivationPage -= 1;
            this.showCultivationScene();
        });
        previous.node.parent!.getComponent(Button)!.interactable = this.cultivationPage > 0;
        const next = this.makeButton('CultivationNext', root, 205, -450, 160, 56, '下一页', () => {
            this.cultivationPage += 1;
            this.showCultivationScene();
        });
        next.node.parent!.getComponent(Button)!.interactable = this.cultivationPage < pageCount - 1;
        this.makeLabel('CultivationPage', root, 0, -450, 150, 52, `${this.cultivationPage + 1} / ${pageCount}`, 20, GOLD);
        this.makeLabel('CultivationMessage', root, 0, -515, 680, 42,
            message || '收集碎片并消耗金币，可将兵种提升至 20 星', 18, message ? WHITE : CREAM);
        this.buildMainBottomNavigation(root, '培养');
    }

    private upgradeCultivationHero(family: BagLikeAccountHeroFamily): void {
        const previousStars = { ...this.accountProfile.stars };
        const result = tryUpgradeBagLikeAccountHero(this.accountProfile, family);
        if (!result.upgraded) {
            const message = result.reason === 'locked'
                ? `请先通关第 ${bagLikeLevelNumber(bagLikeHeroUnlockLevel(family))} 关解锁 ${ACCOUNT_HERO_NAMES[family]}`
                : result.reason === 'maxStar'
                  ? `${ACCOUNT_HERO_NAMES[family]}已经达到 20 星`
                  : result.reason === 'fragments'
                    ? `${ACCOUNT_HERO_NAMES[family]}碎片不足，需要 ${result.cost?.fragments || 0}`
                    : `金币不足，需要 ${result.cost?.gold || 0}`;
            this.showCultivationScene(message);
            return;
        }
        this.accountProfile = result.profile;
        this.persistAccountProfile(false);
        const unlockedFusions = newlyUnlockedBagLikeFusions(previousStars, this.accountProfile.stars);
        const fusionMessage = unlockedFusions.length > 0
            ? `；已解锁融合：${unlockedFusions.map((recipe) => GEARS[recipe.resultId as GearId].name).join('、')}`
            : '';
        this.showCultivationScene(`${ACCOUNT_HERO_NAMES[family]}升至 ${this.accountProfile.stars[family]} 星${fusionMessage}`);
    }

    private showLevelSelection(): void {
        if (!this.levelTable) return;
        profiler.hideStats();
        this.initialized = false;
        this.destroyRootChildren();
        const root = this.makeNode('LevelSelectionScene', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        this.addMenuBackground(root, 'fightscene_03');
        const shade = this.makeNode('LevelSelectionShade', root, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const shadeGraphics = shade.addComponent(Graphics);
        shadeGraphics.fillColor = new Color(12, 20, 25, 176);
        shadeGraphics.rect(-DESIGN_WIDTH / 2, -DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
        shadeGraphics.fill();

        const back = this.makeButton('BackToMain', root, -290, 590, 120, 62, '返回', () => this.showMainScene());
        this.restyleButton(back, new Color(44, 126, 153, 255), new Color(200, 244, 255, 255));
        this.makeLabel('LevelSelectionTitle', root, 0, 586, 430, 70, '选择关卡', 42, GOLD);
        const latestUnlocked = latestMainLevelId(this.accountProfile.maxPassedLevelId);
        this.makeLabel('LevelSelectionHint', root, 0, 520, 650, 46,
            `已开放至第 ${bagLikeLevelNumber(latestUnlocked)} 关 · 挑战消耗 ${NORMAL_LEVEL_ENERGY_COST} 体力`, 20, CREAM);

        const cards = playableLevelCards(this.levelTable.levels);
        const pageSize = 10;
        const pageCount = Math.ceil(cards.length / pageSize);
        this.levelSelectionPage = Math.max(0, Math.min(pageCount - 1, this.levelSelectionPage));
        cards.slice(this.levelSelectionPage * pageSize, (this.levelSelectionPage + 1) * pageSize)
            .forEach((card, index) => this.buildCompactLevelCard(root, card, index));
        const previous = this.makeButton('PreviousLevelPage', root, -235, -535, 180, 60, '上一页', () => {
            this.levelSelectionPage = Math.max(0, this.levelSelectionPage - 1);
            this.showLevelSelection();
        });
        const next = this.makeButton('NextLevelPage', root, 235, -535, 180, 60, '下一页', () => {
            this.levelSelectionPage = Math.min(pageCount - 1, this.levelSelectionPage + 1);
            this.showLevelSelection();
        });
        previous.node.active = this.levelSelectionPage > 0;
        next.node.active = this.levelSelectionPage < pageCount - 1;
        this.makeLabel('LevelPage', root, 0, -535, 180, 54, `${this.levelSelectionPage + 1} / ${pageCount}`, 22, GOLD);
        this.buildMainBottomNavigation(root, '战斗');
    }

    private buildCompactLevelCard(root: Node, card: PlayableLevelCard, index: number): void {
        const unlocked = bagLikeLevelUnlocked(this.accountProfile.maxPassedLevelId, card.id);
        const passed = bagLikeLevelPassed(this.accountProfile.maxPassedLevelId, card.id);
        const column = index % 2;
        const row = Math.floor(index / 2);
        const x = column === 0 ? -170 : 170;
        const y = 400 - row * 170;
        const node = this.makeNode(`LevelCard_${card.id}`, root, x, y, 310, 145);
        const panel = node.addComponent(Graphics);
        panel.fillColor = new Color(24, 49, 55, 235);
        panel.roundRect(-155, -72, 310, 144, 18);
        panel.fill();
        panel.strokeColor = passed ? GOLD : unlocked ? new Color(91, 193, 157, 255) : new Color(82, 91, 104, 255);
        panel.lineWidth = 3;
        panel.roundRect(-153, -70, 306, 140, 16);
        panel.stroke();
        this.makeLabel('Chapter', node, -92, 40, 105, 32, `第 ${card.chapter} 关`, 18, GOLD);
        const name = this.makeLabel('LevelName', node, -15, 3, 240, 40, unlocked ? card.name : '尚未开放', 24,
            unlocked ? WHITE : new Color(154, 160, 173, 255));
        name.overflow = Label.Overflow.SHRINK;
        this.makeLabel('LevelInfo', node, -72, -39, 125, 28, `${card.roundCount} 波`, 17, CREAM);
        const challenge = this.makeButton('Challenge', node, 88, -39, 105, 42,
            passed ? '重玩' : unlocked ? '挑战' : '锁定', () => this.launchLevel(card.id));
        this.restyleButton(challenge,
            unlocked ? new Color(48, 183, 130, 255) : new Color(68, 75, 88, 255),
            unlocked ? new Color(222, 255, 235, 255) : new Color(160, 166, 178, 255));
        challenge.node.parent!.getComponent(Button)!.interactable = unlocked;
        challenge.fontSize = 18;
    }

    private buildLevelCard(root: Node, card: PlayableLevelCard, y: number): void {
        const node = this.makeNode(`LevelCard_${card.id}`, root, 0, y, 660, 300);
        const preview = this.makeNode('Preview', node, 0, 0, 650, 290);
        this.addMenuBackground(preview, card.background, 650, 290);
        const shade = this.makeNode('CardShade', node, 0, 0, 650, 290);
        const shadeGraphics = shade.addComponent(Graphics);
        shadeGraphics.fillColor = new Color(19, 33, 38, 155);
        shadeGraphics.roundRect(-325, -145, 650, 290, 24);
        shadeGraphics.fill();
        shadeGraphics.strokeColor = card.id === DEFAULT_LEVEL_ID ? GOLD : new Color(116, 221, 190, 255);
        shadeGraphics.lineWidth = 5;
        shadeGraphics.roundRect(-322, -142, 644, 284, 21);
        shadeGraphics.stroke();

        this.makeLabel('Chapter', node, -235, 86, 150, 42, `第 ${card.chapter} 关`, 24, GOLD);
        const name = this.makeLabel('LevelName', node, -105, 28, 400, 66, card.name, 38, WHITE, HorizontalTextAlignment.LEFT);
        this.applyOriginalOutline(name, new Color(0, 0, 0, 255), 3);
        const heroes = card.recommendedHeroes.length > 0 ? card.recommendedHeroes.join(' · ') : '未记录';
        this.makeLabel('LevelInfo', node, -72, -42, 470, 48, `${card.roundCount} 波　推荐 ${heroes}`, 21, CREAM, HorizontalTextAlignment.LEFT);
        this.makeLabel('LevelBadge', node, 238, 93, 150, 42, card.badge, 18, GOLD);
        const challenge = this.makeButton('Challenge', node, 220, -78, 170, 70, '开始挑战', () => this.launchLevel(card.id));
        this.restyleButton(challenge, new Color(48, 183, 130, 255), new Color(222, 255, 235, 255));
        challenge.fontSize = 23;
    }

    private addMenuBackground(parent: Node, resourceName: string, width = DESIGN_WIDTH, height = DESIGN_HEIGHT): void {
        const background = this.makeNode(`MenuBackground_${resourceName}`, parent, 0, 0, width, height);
        const sprite = background.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        resources.load(`original/${resourceName}/spriteFrame`, SpriteFrame, (error, frame) => {
            if (!error && background.isValid) sprite.spriteFrame = frame;
        });
    }

    private returnToMainScene(): void {
        this.showMainScene();
    }

    private resetLevelSession(): void {
        this.initialized = false;
        this.unscheduleAllCallbacks();
        this.clearUnits();
        for (const gear of [...this.gears, ...this.candidates]) {
            if (gear.node.isValid) gear.node.destroy();
        }
        this.gears = [];
        this.candidates = [];
        this.phase = 'deploy';
        this.roundIndex = 0;
        this.roundClock = 0;
        this.spawnIndex = 0;
        this.clearTimer = 0;
        this.serial = 0;
        this.selfHp = 500;
        this.enemyHomeHp = 0;
        this.enemyHomeMaxHp = 0;
        this.enemyHomeGold = 0;
        this.specialKillCount = 0;
        this.specialDropGold = 0;
        this.specialBattleElapsed = 0;
        this.dailyBuffIds = [];
        this.gold = 0;
        this.refreshIndex = 0;
        this.normalRefreshTimes = 0;
        this.nonAdRefreshTimes = 0;
        this.freeRefreshUsed = false;
        this.powerDirection = 1;
        this.powerTimer = POWER_QUARTER_LAP_SECONDS;
        this.powerCoreModelElapsed = 0;
        this.powerSkillRemaining = 0;
        this.powerRoleEnergy = 0;
        this.powerRoleActiveRemaining = 0;
        this.powerRoleKillProductivityStacks = 0;
        this.powerRoleStartRewardClaimed = false;
        this.productionJobs = [];
        this.selfSpawnCount = 0;
        this.fusionActiveCastCount = 0;
        this.fusionActiveHitCount = 0;
        this.h10PrimaryBulletCastCount = 0;
        this.h10PrimaryBulletHitCount = 0;
        this.h15KillCoinsEarned = 0;
        this.h15RoundCoinsEarned = 0;
        this.powerContactCount = 0;
        this.powerGearTriggerCount = 0;
        this.workerApplyCount = 0;
        this.powerMissingGearCount = 0;
        this.powerMissingConfigCount = 0;
        this.speed = 1;
        this.paused = false;
        this.failedAttempts = 0;
        this.bagLikeLevel = 1;
        this.bagLikeExp = 0;
        this.traitRerollsUsed = 0;
        this.traitTakeAllUsed = 0;
        this.currentTraitChoices = [];
        this.traitStacks.clear();
        this.warriorKillAttackStacks = 0;
        this.h11SkillId = H11_BASE_SKILL_ID;
        this.h12SkillId = H12_BASE_SKILL_ID;
        this.h13SkillId = H13_BASE_SKILL_ID;
        this.unlocked.clear();
        this.dragGear = null;
    }

    private destroyRootChildren(): void {
        // Camera is authored in Main.scene and must survive runtime screen
        // transitions; every other child is generated by this component.
        for (const child of [...this.node.children]) {
            if (child.name !== 'Camera') child.destroy();
        }
    }

    update(dt: number): void {
        const mainScene = this.node.getChildByName('MainScene');
        if (mainScene) {
            this.outOfBattleAnimationClock += Math.max(0, Math.min(dt, 0.05));
            const mainRotor = mainScene.getChildByName('MainPowerRotor');
            if (mainRotor) mainRotor.angle = -this.outOfBattleAnimationClock * 34;
            const mainMascot = mainScene.getChildByName('MainHeroMascot');
            if (mainMascot) {
                mainMascot.setPosition(
                    Math.sin(this.outOfBattleAnimationClock * 0.9) * 7,
                    198 + Math.sin(this.outOfBattleAnimationClock * 2.1) * 8,
                );
            }
        }
        if (!this.initialized) return;
        const longRun = this.longRunValidationEnabled();
        const totalScaled = (longRun ? Math.min(Math.max(0, dt), 1) : Math.min(dt, 0.05)) * this.speed;
        const simulationSteps = longRun ? Math.max(1, Math.ceil(totalScaled / 0.05)) : 1;
        const scaledStep = totalScaled / simulationSteps;
        const rawStep = Math.max(0, dt) / simulationSteps;
        for (let step = 0; step < simulationSteps; step += 1) {
            this.stepLongRunAutomation(rawStep, scaledStep);
            let simulationDt = scaledStep;
            const freezeDevelopedBattle = this.developedValidationMode() === 'battle' && this.phase === 'battle';
            if (freezeDevelopedBattle) {
                simulationDt = Math.min(simulationDt, Math.max(0, DEVELOPED_BATTLE_ELAPSED_SECONDS - this.roundClock));
                if (simulationDt === 0) this.paused = true;
            }
            if (!this.paused && this.phase === 'battle') {
                this.stepPowerProduction(simulationDt, true);
                this.stepGearRotations(simulationDt);
            }
            if (this.phase !== 'battle') {
                this.powerCoreModelElapsed = 0;
                const powerCore = this.gears.find((gear) => gear.id === 'P01');
                if (powerCore) this.applyPowerCorePresentation(powerCore);
            }
            if (this.phase === 'battle' && !this.paused) this.stepBattle(simulationDt);
            if (freezeDevelopedBattle && this.roundClock >= DEVELOPED_BATTLE_ELAPSED_SECONDS) this.paused = true;
            this.stepEffects(simulationDt);
        }
        this.drawEffects();
        this.drawHomes();
        this.refreshUi();
    }

    private configureLevel(table: NormalLevelTable): void {
        this.levelCatalog = table.levels.map((row) => ({ ...row, roundIds: [...row.roundIds] }));
        registerRecoveredNormalEnemies(table.monsters);
        const runtime = buildNormalLevelRuntimeConfig(table, this.levelId, new Set(Object.keys(UNITS)));
        const level = runtime.level;
        const preparation = runtime.preparation;
        this.levelName = level.name;
        this.levelBackground = runtime.backgroundId;
        this.baseLevelHomeHp = level.homeHp;
        this.levelHomeHp = level.homeHp;
        this.levelAtkMultiple = level.atkMultiple;
        this.levelHpMultiple = level.hpMultiple;
        this.selfHp = level.homeHp;
        this.initialGold = preparation.initialCoin;
        this.gold = preparation.initialCoin;
        this.staticBuffsByLevel = preparation.staticBuffsByLevel;
        this.rounds = runtime.rounds.map((round) => ({ ...round, monsters: round.monsters as ModelId[] }));
        this.staticBatches = preparation.staticBatches.map((batch) => [...batch] as GearId[]);
        this.roundCoinRewards = [...preparation.roundCoinRewards];
        this.syncBrowserContractState();
    }

    private syncBrowserContractState(): void {
        // Cocos' native runtime exposes a partial `document`/canvas shim, but that
        // canvas is not an HTMLCanvasElement and has no DOMStringMap `dataset`.
        // This contract is browser-only observability and must never interrupt
        // native scene construction.
        if (typeof document === 'undefined' || typeof document.querySelector !== 'function') return;
        const canvas = document.querySelector('canvas');
        if (!canvas || !canvas.dataset) return;
        canvas.dataset.levelId = String(this.levelId);
        canvas.dataset.battleMode = this.battleMode;
        canvas.dataset.levelName = this.levelName;
        canvas.dataset.phase = this.phase;
        canvas.dataset.round = String(this.roundIndex + 1);
        canvas.dataset.roundCount = String(this.rounds.length);
        canvas.dataset.staticBatchCount = String(this.staticBatches.length);
        canvas.dataset.selfHp = String(Math.max(0, Math.floor(this.selfHp)));
        canvas.dataset.maxHp = String(Math.max(0, Math.floor(this.levelHomeHp)));
        canvas.dataset.gold = String(Math.max(0, Math.floor(this.gold)));
        canvas.dataset.specialKills = String(this.specialKillCount);
        canvas.dataset.specialDropGold = String(this.specialDropGold);
        canvas.dataset.enemyHomeHp = String(Math.max(0, Math.floor(this.enemyHomeHp)));
        canvas.dataset.specialElapsed = this.specialBattleElapsed.toFixed(3);
        canvas.dataset.mockAdBusy = String(this.mockAdvertisementBusy);
        canvas.dataset.mockAdPlacement = this.mockAdvertisementPlacement;
        canvas.dataset.mockAdOutcome = this.mockAdvertisementOutcome;
        canvas.dataset.mockAdViews = String(this.mockAdvertisementState?.todayCompleted || 0);
        canvas.dataset.failedAttempts = String(this.failedAttempts);
        canvas.dataset.longRunEnabled = String(this.longRunValidationEnabled());
        canvas.dataset.longRunStatus = this.longRunStatus;
        canvas.dataset.longRunRetries = String(this.longRunRetries);
        canvas.dataset.longRunElapsed = this.longRunElapsedSeconds.toFixed(3);
        canvas.dataset.longRunSpeed = String(this.longRunValidationEnabled() ? LONG_RUN_VALIDATION_SPEED : this.speed);
        canvas.dataset.longRunAccountScope = this.longRunValidationEnabled()
            ? this.longRunLateProgressionEnabled()
                ? 'late-progression-fixture'
                : !bagLikeLevelUnlocked(this.accountProfile.maxPassedLevelId, this.levelId)
                    ? 'validation-unlock-only'
                    : 'normal-account'
            : 'normal-account';
        canvas.dataset.longRunPowerRoleScope = this.longRunValidationEnabled() && this.longRunLateProgressionEnabled()
            ? 'late-max-nonpersistent'
            : 'normal-account';
        canvas.dataset.longRunMaxSelfUnits = String(this.longRunMaxSelfUnits);
        canvas.dataset.longRunMaxEnemyUnits = String(this.longRunMaxEnemyUnits);
        canvas.dataset.roundClock = this.roundClock.toFixed(3);
        canvas.dataset.candidateIds = this.candidates.map((gear) => gear.id).join(',');
        canvas.dataset.unlockedHeroFamilies = Array.from(bagLikeAccountUnlockedHeroFamilies(this.accountProfile)).join(',');
        canvas.dataset.powerRoleState = this.powerRoleState
            ? `${this.powerRoleState.equippedRoleId}:` + Object.keys(this.powerRoleState.roles)
                .map((id) => {
                    const role = this.powerRoleState.roles[id as PowerRoleId];
                    return `${id}=${role.star}/${role.fragments}/${role.freeFragmentTimes}`;
                })
                .join(',')
            : 'missing';
        canvas.dataset.candidateRuntime = this.candidates
            .map((gear) => `${gear.id}@${gear.node.position.x.toFixed(1)},${gear.node.position.y.toFixed(1)}`)
            .join(';');
        canvas.dataset.gearIds = this.gears.map((gear) => gear.id).join(',');
        canvas.dataset.gearRuntime = this.gears
            .map((gear) => `${gear.id}#${gear.uid}@${gear.row},${gear.col}:${gear.workerPower.toFixed(1)}`)
            .join(';');
        canvas.dataset.gearRotation = this.gears
            .filter((gear) => gear.id !== 'P01')
            .map((gear) => {
                const rotor = gear.node.children.find((child) => child.name.startsWith('GearRotor_'));
                return `${gear.id}#${gear.uid}:${gear.rotationActive ? 'active' : 'idle'}:${(rotor?.angle || 0).toFixed(1)}:${gear.rotationTriggerCount}`;
            })
            .join(';');
        canvas.dataset.workerProgressBars = this.gears
            .filter((gear) => Boolean(GEARS[gear.id].powerPerTrigger))
            .map((gear) => `${gear.id}#${gear.uid}:${this.workerProgressRatio(gear).toFixed(3)}:${gear.node.getChildByName('WorkerProgressBar') ? 'visible' : 'missing'}`)
            .join(';');
        canvas.dataset.gearPortraits = [...this.gears, ...this.candidates]
            .filter((gear) => Boolean(GEARS[gear.id].powerPerTrigger))
            .map((gear) => {
                const portrait = gear.node.children.find((child) => child.name.startsWith('GearPortrait_'));
                const sprite = portrait?.getComponent(Sprite);
                const state = sprite?.spriteFrame?.texture ? 'loaded' : portrait ? 'pending' : 'missing';
                return `${gear.id}#${gear.uid}:${state}`;
            })
            .join(';');
        canvas.dataset.selfUnits = String(this.units.filter((unit) => unit.team === 'self' && !unit.dead).length);
        canvas.dataset.selfRuntime = this.units
            .filter((unit) => unit.team === 'self' && !unit.dead)
            .map((unit) => `${unit.cfg.id}#${unit.uid}@${unit.x.toFixed(1)},${unit.y.toFixed(1)}`)
            .join(';');
        canvas.dataset.unitShadows = String(this.units.filter((unit) => !unit.dead && unit.shadow.isValid).length);
        canvas.dataset.unitDepth = (this.unitLayer?.children || [])
            .filter((child) => child.name.startsWith('self_') || child.name.startsWith('enemy_'))
            .map((child) => child.name)
            .join(';');
        canvas.dataset.selfSpawns = String(this.selfSpawnCount);
        canvas.dataset.fusionActiveCasts = String(this.fusionActiveCastCount);
        canvas.dataset.fusionActiveHits = String(this.fusionActiveHitCount);
        canvas.dataset.h10PrimaryBulletCasts = String(this.h10PrimaryBulletCastCount);
        canvas.dataset.h10PrimaryBulletHits = String(this.h10PrimaryBulletHitCount);
        canvas.dataset.h15KillCoins = String(this.h15KillCoinsEarned);
        canvas.dataset.h15RoundCoins = String(this.h15RoundCoinsEarned);
        canvas.dataset.powerClock = `${this.powerDirection}:${this.powerTimer.toFixed(3)}:${this.powerSkillRemaining.toFixed(3)}`;
        const powerCore = this.gears.find((gear) => gear.id === 'P01');
        const powerRotor = powerCore?.node.getChildByName('PowerCoreRotor');
        const powerHamster = powerCore?.node.getChildByName('PowerCoreHamster');
        canvas.dataset.powerCore = powerCore
            ? `${powerCore.row},${powerCore.col}:${(powerRotor?.angle || 0).toFixed(1)}:${(powerHamster?.position.x || 0).toFixed(1)},${(powerHamster?.position.y || 0).toFixed(1)}`
            : 'missing';
        canvas.dataset.powerContacts = String(this.powerContactCount);
        canvas.dataset.powerGearTriggers = String(this.powerGearTriggerCount);
        canvas.dataset.workerApplies = String(this.workerApplyCount);
        canvas.dataset.powerMissingGear = String(this.powerMissingGearCount);
        canvas.dataset.powerMissingConfig = String(this.powerMissingConfigCount);
        canvas.dataset.enemyUnits = String(this.units.filter((unit) => unit.team === 'enemy' && !unit.dead).length);
        canvas.dataset.enemyRuntime = this.units
            .filter((unit) => unit.team === 'enemy' && !unit.dead)
            .map((unit) => `${unit.cfg.id}#${unit.uid}@${unit.x.toFixed(1)},${unit.y.toFixed(1)}`)
            .join(';');
        canvas.dataset.unitFallbacks = this.units
            .filter((unit) => !unit.dead && unit.fallback.enabled)
            .map((unit) => `${unit.team}:${unit.cfg.id}#${unit.uid}`)
            .join(';');
        canvas.dataset.visualCatalogLoaded = String(this.visualCatalogLoadedCount);
        canvas.dataset.visualCatalogFailed = String(this.visualCatalogFailedCount);
    }

    private syncVisualCatalogContractState(): void {
        if (typeof document === 'undefined' || typeof document.querySelector !== 'function') return;
        const canvas = document.querySelector('canvas');
        if (!canvas || !canvas.dataset) return;
        canvas.dataset.visualCatalogLoaded = String(this.visualCatalogLoadedCount);
        canvas.dataset.visualCatalogFailed = String(this.visualCatalogFailedCount);
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
                H05: this.h05HeroStar,
                H06: this.h06HeroStar,
                H11: this.h11HeroStar,
                H12: this.h12HeroStar,
                H13: this.h13HeroStar,
                H14: this.h14HeroStar,
                H16: this.h16HeroStar,
                H17: this.h17HeroStar,
            },
            levelId: this.levelId,
            challengeTimes: this.challengeTimes,
            // The representative default starts immediately before level 1004. URL
            // navigation must not manufacture progress for an arbitrary requested level.
            maxPassedLevelId: Math.max(1000, DEFAULT_LEVEL_ID - 1),
            // Levels 1001–1003 already completed by this representative profile
            // grant 10 energy each at their recovered middle reward milestone.
            energy: 30,
        });
        const loaded = loadBagLikeAccountProfile(sys.localStorage, this.accountDefaultProfile);
        this.accountProfile = loaded.profile;
        this.syncAccountProfileToRuntime();
        if (loaded.recoveredFromInvalidSave) {
            console.warn('[cangshu] invalid account save ignored; restored evidence-safe defaults');
        }
        const search = typeof window === 'undefined' ? '' : window.location.search;
        if (!bagLikeLevelUnlocked(this.accountProfile.maxPassedLevelId, this.levelId)
            && !this.longRunValidationEnabled()
            && !directBattleBypassesProgression(search)) {
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
        this.h05HeroStar = stars.H05;
        this.h06HeroStar = stars.H06;
        this.h11HeroStar = stars.H11;
        this.h12HeroStar = stars.H12;
        this.h13HeroStar = stars.H13;
        this.h14HeroStar = stars.H14;
        this.h16HeroStar = stars.H16;
        this.h17HeroStar = stars.H17;
        this.unlockedHeroFamilies = [...bagLikeAccountUnlockedHeroFamilies(this.accountProfile)].join(';');
        if (syncChallengeTimes) this.challengeTimes = bagLikeAccountChallengeTimes(this.accountProfile, this.levelId);
    }

    private persistAccountProfile(syncChallengeTimes = true): void {
        this.syncAccountProfileToRuntime(syncChallengeTimes);
        if (!saveBagLikeAccountProfile(sys.localStorage, this.accountProfile)) {
            console.warn('[cangshu] account profile could not be persisted in this runtime');
        }
    }

    private fusionValidationMode(): 'merge' | 'tray' | 'placed' | 'battle' | 'late-tray' | 'late-placed' | 'late-battle' | null {
        if (typeof window === 'undefined') return null;
        const match = /(?:^|[?&])fusionValidation=(merge|tray|placed|battle|late-tray|late-placed|late-battle)(?:&|$)/.exec(window.location.search);
        return match ? match[1] as 'merge' | 'tray' | 'placed' | 'battle' | 'late-tray' | 'late-placed' | 'late-battle' : null;
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

    private projectileValidationEnabled(): boolean {
        if (typeof window === 'undefined') return false;
        return /(?:^|[?&])projectileValidation=1(?:&|$)/.test(window.location.search);
    }

    private accountDebugEnabled(): boolean {
        if (typeof window === 'undefined') return false;
        return /(?:^|[?&])accountDebug=1(?:&|$)/.test(window.location.search);
    }

    private resourceAuditEnabled(): boolean {
        if (typeof window === 'undefined') return false;
        return /(?:^|[?&])resourceAudit=1(?:&|$)/.test(window.location.search);
    }

    private buildResourceAudit(): void {
        const records: ResourceAuditRecord[] = [];
        let pending = 0;
        let queued = false;
        const canvas = typeof document === 'undefined' ? null : document.querySelector('canvas');

        const publish = (): void => {
            if (!canvas) return;
            const ordered = [...records].sort((left, right) =>
                left.category.localeCompare(right.category) || left.id.localeCompare(right.id));
            canvas.dataset.resourceAuditReady = queued && pending === 0 ? '1' : 'loading';
            canvas.dataset.resourceAuditExpected = String(ordered.length + pending);
            canvas.dataset.resourceAuditLoaded = String(ordered.filter((entry) => entry.status === 'loaded').length);
            canvas.dataset.resourceAuditFallback = String(ordered.filter((entry) => entry.status === 'static-fallback').length);
            canvas.dataset.resourceAuditMissing = String(ordered.filter((entry) => entry.status === 'file-missing').length);
            canvas.dataset.resourceAuditManifest = JSON.stringify(ordered);
        };
        const fallback = (
            category: ResourceAuditCategory,
            id: string,
            resourcePath: string | null,
            detail: string,
        ): void => {
            records.push({ category, id, resourcePath, status: 'static-fallback', detail });
        };
        const missing = (
            category: ResourceAuditCategory,
            id: string,
            resourcePath: string,
            detail: string,
        ): void => {
            records.push({ category, id, resourcePath, status: 'file-missing', detail });
        };
        const load = (
            category: ResourceAuditCategory,
            id: string,
            resourcePath: string,
            detail: string,
        ): void => {
            pending += 1;
            resources.load(resourcePath, (error, asset) => {
                records.push({
                    category,
                    id,
                    resourcePath,
                    status: error || !asset ? 'file-missing' : 'loaded',
                    detail: error ? `${detail}; ${error.message}` : detail,
                });
                pending -= 1;
                publish();
            });
        };

        // Every preparation item gets its own audit row even where several
        // portraits deliberately share one recovered atlas frame.
        for (const gear of VISUAL_GEAR_ROSTER) {
            load('hero', `${gear.id}:portrait`, 'original/heroSmallHead/spriteFrame',
                `recovered portrait frame ${gear.headKey}`);
        }
        const hamsterModels: Readonly<Record<string, string>> = {
            H01: 'js_zhanshi', H02: 'js_sheshou', H03: 'js_fashi', H04: 'js_qishi',
            H05: 'js_lieren', H06: 'js_feixingyuan', H16: 'js_konglong',
        };
        for (const family of Object.keys(hamsterModels)) {
            const modelName = hamsterModels[family];
            for (let level = 1; level <= 4; level += 1) {
                const gearId = `${family}0${level}`;
                load('hero', `${gearId}:combat`, `spine/${gearId}/${modelName}_${level}`,
                    'production combat Spine');
            }
        }
        for (const [id, path] of [
            ['H0705', 'spine/H0705/js_gangtiexia'],
            ['H0805', 'spine/H0805/js_aoteman'],
            ['H0905', 'spine/H0905/js_zhanche'],
            ['H1005', 'spine/H1005/js_feidieshu'],
            ['H1805', 'spine/H1805/js_gesila'],
        ] as const) load('hero', `${id}:combat`, path, 'fusion combat Spine');
        for (const id of ['H11', 'H12', 'H13', 'H14', 'H15', 'H17']) {
            fallback('hero', `${id}:combat`, null,
                'original producer is a stationary wheel with no independent combat Spine; gear/effect presentation remains active');
        }

        for (const [id, path] of [
            ['P01:card', 'spine/PowerRoleP01Card/pao_paopaoshu'],
            ['P01:core', 'spine/PowerRoleP01Full/pao_paopaoshu'],
            ['P04:card', 'spine/PowerRoleP04/pao_kakaxi'],
            ['P04:core', 'spine/PowerRoleP04Full/pao_kakaxi'],
        ] as const) load('power-role', id, path, 'recovered configured power-role Spine');
        for (const [id, path] of [
            ['P02:card', 'spine/power/pao_shandianxia0.75/pao_shandianxia'],
            ['P02:core', 'spine/power/pao_shandianxia/pao_shandianxia'],
            ['P03:card', 'spine/power/pao_suonike0.75/pao_suonike'],
            ['P03:core', 'spine/power/pao_suonike/pao_suonike'],
        ] as const) fallback('power-role', id, path,
            'configured lazy-cache model has not been downloaded; colored labeled portrait fallback is used');

        for (const enemy of VISUAL_ENEMY_ROSTER) {
            load('monster', enemy.id, enemy.spinePath, 'recovered enemy/Boss Spine');
        }

        for (const [id, path] of [
            ['H0201', 'original/js_sheshou_zidan/spriteFrame'],
            ['H0204', 'original/js_sheshou_lanqiu/spriteFrame'],
            ['H0301', 'spine/H03Projectile/zidan'],
            ['H0601', 'original/projectile-matrix/js_feixingyuan_dandao2/spriteFrame'],
            ['H0905', 'original/js_zhanche_dandao/spriteFrame'],
            ['H1005', 'spine/H1005Projectile/js_feidieshu_dandao'],
            ['H1301', 'original/baomihuali/spriteFrame'],
            ['H1401', 'original/projectile-matrix/chilun_haidaosha/spriteFrame'],
            ['H1701', 'spine/ProjectileMatrix/H17/chilun_shexian1'],
            ['M03', 'original/projectile-matrix/yugutou_dandao/spriteFrame'],
            ['M09', 'original/projectile-matrix/boss_1_dandao/spriteFrame'],
            ['M10', 'spine/ProjectileMatrix/M10/gw_10_zidan'],
            ['P04', 'original/feibiao/feibiao/spriteFrame'],
        ] as const) load('projectile', id, path, 'production projectile asset');
        missing('projectile', 'H18_S1', 'spriteFrame/skill/js_fashi_dandao',
            'model table references this path, but version-18 resources3 has no matching native asset');

        for (const [id, path] of [
            ['H03:freeze', 'spine/H03Freeze/hit_binkuai'],
            ['H03:transform', 'spine/H03Transform/hit_lizi'],
            ['H11:heal', 'spine/H11Healing/skill01_hit_upper'],
            ['H12:lightning', 'spine/H12Lightning/chilun_leiyun'],
            ['H13:impact', 'spine/H13Impact/baomihua_hill'],
            ['H0705:impact', 'original/js_gangtiexia_hill_baozha/spriteFrame'],
            ['H0805:impact', 'original/js_aoteman_hill/spriteFrame'],
            ['H0905:impact', 'original/js_zhanche_hill/spriteFrame'],
            ['H1005:nuke', 'spine/H1005Nuke/hedang'],
            ['H15:coin-impact', 'original/chilun_chuangzhangsha/spriteFrame'],
            ['preparation:grid-reward-glow', 'spine/PreparationGlowSg1/zhandou_sg1'],
            ['preparation:refresh-glow', 'spine/PreparationGlowSg2/zhandou_sg2'],
            ['power-role:upgrade-glow', 'spine/PowerRoleUpgradeGlow/chilunpy_shengjishanguang'],
            ['audio:H03-transform', 'original/skill_bianxing'],
            ['audio:H03-freeze', 'original/skill_bingfeng'],
            ['audio:H03-laser', 'original/skill_jiguang'],
            ['audio:H12-lightning', 'original/bullet_leiyun'],
            ['audio:melee-sword', 'original/skill_jijian'],
            ['audio:melee-charge', 'original/skill_zhuangji'],
            ['audio:H09', 'original/bullet_zhanche'],
            ['audio:H10', 'original/bullet_hedan'],
            ['audio:H14', 'original/projectile-matrix/bullet_shayu'],
        ] as const) load('effect', id, path, 'production effect/audio asset');

        queued = true;
        publish();
        this.makeLabel('ResourceAuditTitle', this.node, 0, 50, 700, 80,
            '全角色资源运行时巡检中…', 28, WHITE);
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
            // Scene switches may intentionally destroy gallery nodes before an
            // asynchronous resource callback returns. That is cancellation, not
            // an asset failure, and must not surface as a runtime error.
            if (!modelNode.isValid) return;
            if (error) {
                this.visualCatalogFailedCount += 1;
                this.syncVisualCatalogContractState();
                console.error(`[visual-catalog] enemy asset failed ${entry.id} ${entry.spinePath}: ${error.message}`);
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
            this.visualCatalogLoadedCount += 1;
            this.syncVisualCatalogContractState();
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
        const rolePosition = bagLikeShapeRolePosition(entry.shapeId, GRID_CELL);
        this.attachStaticGearPortrait(
            gearNode,
            entry.headKey,
            rolePosition?.x ?? (footprintColumns - 1) * GRID_CELL * 0.5,
            rolePosition?.y ?? -(footprintRows - 1) * GRID_CELL * 0.5,
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
        this.normalRefreshTimes = 1;
        this.addDevelopedGridReward();
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

    // Browser-only presentation fixture for the recovered projectile matrix.
    // It exercises the exact runtime loaders and visual update path without
    // changing normal level data, account state, or combat calculations.
    private applyProjectileValidationFixture(): void {
        if (!this.projectileValidationEnabled() || this.phase !== 'battle') return;
        const canvas = typeof document === 'undefined' ? null : document.querySelector('canvas');
        const loadedAssets = [
            this.h06ProjectileFrames.length === 5 ? 'H06' : '',
            this.h14BombFrames.length === 16 ? 'H14' : '',
            this.h17RayData ? 'H17' : '',
            this.enemyBoneProjectileFrame ? 'M03' : '',
            this.enemyOrbProjectileFrame ? 'M09' : '',
            this.m10ProjectileData ? 'M10' : '',
        ].filter(Boolean);
        if (canvas) {
            canvas.dataset.projectileValidationReady = 'starting';
            canvas.dataset.projectileValidationAssets = loadedAssets.join(',');
        }
        if (loadedAssets.length < 6) {
            if (canvas) canvas.dataset.projectileValidationReady = 'loading';
            this.scheduleOnce(() => this.applyProjectileValidationFixture(), 0.2);
            return;
        }
        this.clearUnits();
        this.spawnIndex = this.rounds[this.roundIndex]?.monsters.length || 0;
        let failedVisuals = 0;
        const emit = (name: string, create: () => void): void => {
            try {
                create();
            } catch (error) {
                failedVisuals += 1;
                console.error(`[projectile-validation] ${name} failed`, error);
            }
        };
        emit('H06', () => this.addH06Projectile(-250, 140, 250, 140, 2, 0));
        emit('H14', () => this.addH14Bomb(-145, -35));
        emit('H17', () => this.addH17Ray(-280, 20, 280, 20));
        emit('M03', () => this.addEnemyBoneProjectile(-250, -150, 250, -150, 2, 0));
        emit('M09', () => this.addEnemyOrbProjectile(-250, -255, 250, -255, 2, 0));
        emit('M10', () => this.addM10Projectile(-250, 255, 250, 255, 2, 0));
        this.paused = true;
        this.speed = 0;
        if (canvas) canvas.dataset.projectileValidationReady = '1';
        if (canvas) canvas.dataset.projectileValidationErrors = String(failedVisuals);
    }

    // Explicit browser-only visual fixture. It is unreachable in the normal
    // game URL and does not alter target-account star defaults or drop tables.
    private applyFusionValidationFixture(mode: 'merge' | 'tray' | 'placed' | 'battle' | 'late-tray' | 'late-placed' | 'late-battle'): void {
        this.clearCandidates();
        const core = this.gears.find((gear) => gear.id === 'P01');
        for (const gear of this.gears) {
            if (gear !== core && gear.node.isValid) gear.node.destroy();
        }
        this.gears = core ? [core] : [];
        this.refreshPlacedWheelHomeHp();

        if (mode === 'merge') {
            this.validationHeroStarOverrides = { H01: 2, H02: 2 };
            this.replaceCandidates(['H0104', 'H0204']);
            return;
        }

        const lateFusion = mode.startsWith('late-');
        if (mode === 'tray' || mode === 'late-tray') {
            this.replaceCandidates(lateFusion
                ? ['H1005', 'H1505', 'H1805']
                : ['H0705', 'H0805', 'H0905']);
            return;
        }

        // H0905's L footprint needs column 5, which is deliberately unlocked
        // only inside this fixture. The three pieces each touch a different
        // side of the power core without overlapping one another.
        for (const [row, col] of [[2, 5], [3, 5]] as const) this.unlocked.add(row * GRID_COLS + col);
        this.drawGrid();
        if (lateFusion) {
            this.addPlacedGear('H1005', 0, 2);
            this.addPlacedGear('H1505', 2, 1);
            this.addPlacedGear('H1805', 2, 4);
        } else {
            this.addPlacedGear('H0705', 1, 3);
            this.addPlacedGear('H0805', 2, 2);
            this.addPlacedGear('H0905', 2, 4);
        }
    }

    private buildScene(): void {
        const background = this.makeNode('OriginalBattlefield', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const backgroundSprite = background.addComponent(Sprite);
        backgroundSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        resources.load(`original/${this.levelBackground}/spriteFrame`, SpriteFrame, (error, frame) => {
            if (!error && background.isValid) backgroundSprite.spriteFrame = frame;
        });

        this.battleLayer = this.makeNode('BattleLayer', this.node, 0, DEPLOY_BATTLE_Y, 750, DEPLOY_BATTLE_HEIGHT);
        this.backgroundEffectLayer = this.makeNode('BackgroundEffects', this.battleLayer, 0, 0, 750, DEPLOY_BATTLE_HEIGHT);
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
        const enemyHomeHp = this.makeNode('EnemyCampHp', enemyHome, 0, 0, 124, 90);
        this.enemyHomeGraphics = enemyHomeHp.addComponent(Graphics);
        enemyHomeHp.active = this.battleMode === 'endless';

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
        const backpackHpHeart = this.makeNode('BackpackHpHeart', this.backpackHpBar, -25, 0, 32, 27);
        this.attachBagLikeAtlasSprite(backpackHpHeart, BAGLIKE_ATLAS_FRAMES.hpHeart);
        this.backpackHpLabel = this.makeLabel('BackpackHpText', this.backpackHpBar, 21, 0, 90, 30, `${this.levelHomeHp}`, 20, WHITE);
        this.applyOriginalOutline(this.backpackHpLabel, new Color(0, 0, 0, 255), 2);
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
        this.fusionGuideLabel = this.makeLabel(
            'FusionGuide',
            this.prepareLayer,
            92,
            -486,
            500,
            30,
            '融合：相同齿轮可升级；两件四级伙伴可融合为红色五级齿轮',
            14,
            new Color(255, 218, 102, 255),
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
        // BagLikeView binds UI10026/zhandou_sg2 to both refresh controls.
        this.attachPreparationButtonGlow(
            this.adRefreshLabel.node.parent!,
            'spine/PreparationGlowSg2/zhandou_sg2',
            'AdRefreshGlow_UI10026',
        );
        this.attachPreparationButtonGlow(
            this.refreshLabel.node.parent!,
            'spine/PreparationGlowSg2/zhandou_sg2',
            'RefreshGlow_UI10026',
        );
        for (const label of [this.adRefreshLabel, this.refreshLabel, this.actionLabel]) {
            label.fontSize = 30;
            label.lineHeight = 36;
        }
        this.adRefreshLabel.node.setPosition(20, 10);
        this.adRefreshLabel.node.getComponent(UITransform)!.setContentSize(150, 52);
        const adRefreshIcon = this.makeNode('AdRefreshTicket', this.adRefreshLabel.node.parent!, -61, 10, 42, 34);
        this.attachRecoveredAtlasSprite(adRefreshIcon, 'original/item/spriteFrame', ITEM_ATLAS_FRAMES.adTicket);
        const adRefreshHint = this.makeLabel('AdRefreshHint', this.adRefreshLabel.node.parent!, 0, -34, 190, 24, '必出高级齿轮', 15, new Color(244, 236, 255, 255));
        this.applyOriginalOutline(adRefreshHint, new Color(77, 27, 107, 255), 2);
        this.refreshCostNode = this.makeNode('RefreshCost', this.refreshLabel.node.parent!, 0, -32, 92, 28);
        const refreshCoin = this.makeNode('RefreshCostCoin', this.refreshCostNode, -25, 0, 26, 26);
        this.attachRecoveredAtlasSprite(refreshCoin, 'original/item/spriteFrame', ITEM_ATLAS_FRAMES.coin);
        const refreshCost = this.makeLabel('RefreshCostValue', this.refreshCostNode, 15, 0, 50, 26, `${REFRESH_COST}`, 19, WHITE);
        this.applyOriginalOutline(refreshCost, new Color(0, 0, 0, 255), 2);
        this.speedLabel = this.makeButton('Speed', this.node, -256.5, 476.5, 150, 54, '1× 速度', () => {
            this.speed = this.speed === 1 ? BATTLE_SPEED_UP_MULTIPLE : 1;
            this.speedLabel.string = `${this.speed}× 速度`;
        });
        this.speedLabel.node.parent!.active = false;
        this.pauseLabel = this.makeButton('Pause', this.node, -296, 617, 72, 72, '', () => {
            if (this.phase === 'deploy') {
                this.returnToMainScene();
                return;
            }
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
        this.powerRoleActiveLabel = this.makeButton('PowerRoleActive', this.hudLayer, 286, 480, 142, 64,
            '', () => this.activateEquippedPowerRole());
        this.restyleButton(this.powerRoleActiveLabel, new Color(91, 74, 162, 245), WHITE);
        this.powerRoleActiveLabel.fontSize = 15;
        this.powerRoleActiveLabel.lineHeight = 20;

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
        this.resultActionsLayer = this.makeNode('ResultActions', this.resultLayer, 0, 0, 620, 100);
        this.makeButton('Retry', this.resultActionsLayer, -220, -125, 190, 64, '重新挑战', () => this.retryCurrentMode());
        this.makeButton('ResultHome', this.resultActionsLayer, 0, -125, 190, 64, '返回主页', () => this.returnFromBattleResult());
        this.resultNextButtonLabel = this.makeButton('NextLevel', this.resultActionsLayer, 220, -125, 190, 64,
            '进入下一关', () => this.navigateToLevel(this.levelId + 1));
        this.restyleButton(this.resultNextButtonLabel, new Color(45, 151, 92, 255), new Color(231, 255, 231, 255));
        this.resultNextButtonLabel.node.parent!.active = false;
        this.resultActionsLayer.active = false;
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
            '培养英雄可以提升整支队伍的战斗力\n金币、体力、钻石、碎片和通关进度会自动保存',
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
            '通关当前关卡后，即可解锁下一关', 17, CREAM);
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
        this.launchLevel(levelId);
    }

    private openAccountPanel(): void {
        if (this.phase !== 'deploy') {
            this.tipLabel.string = '账号星级只能在准备阶段调整';
            return;
        }
        profiler.hideStats();
        this.accountHeroPage = 0;
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
        const resourceSummary = `金币 ${this.accountProfile.gold}  体力 ${this.accountProfile.energy}  钻石 ${this.accountProfile.diamonds}  已通关第 ${Math.max(0, bagLikeLevelNumber(this.accountProfile.maxPassedLevelId))} 关`;

        this.makeLabel('ChallengeLabel', this.accountContentLayer, 0, 360, 620, 72,
            `${resourceSummary}\n当前第 ${bagLikeLevelNumber(this.levelId)} 关 · 第 ${challengeTimes} 次挑战`, 18, WHITE);
        this.makeLabel('AccountColumns', this.accountContentLayer, 0, 292, 620, 32,
            '英雄 / 解锁状态       星级       碎片          下一级消耗', 17, new Color(171, 188, 216, 255));

        const pageSize = 6;
        const pageCount = Math.ceil(BAGLIKE_ACCOUNT_HERO_FAMILIES.length / pageSize);
        this.accountHeroPage = Math.max(0, Math.min(pageCount - 1, this.accountHeroPage));
        BAGLIKE_ACCOUNT_HERO_FAMILIES
            .slice(this.accountHeroPage * pageSize, (this.accountHeroPage + 1) * pageSize)
            .forEach((family, index) => {
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
                : `${family} 第${bagLikeLevelNumber(unlockLevel)}关解锁`;
            this.makeLabel(`AccountName_${family}`, row, -226, 0, 176, 48, heroText, 17, unlocked ? WHITE : new Color(150, 155, 168, 255));
            this.makeLabel(`AccountStar_${family}`, row, -100, 0, 72, 44, unlocked ? `${star}星` : '未解锁', 19, unlocked ? GOLD : new Color(145, 145, 145, 255));
            const fragments = bagLikeAccountHeroFragments(this.accountProfile, family);
            const cost = unlocked ? bagLikeHeroUpgradeCost(star) : null;
            this.makeLabel(`AccountFragments_${family}`, row, -3, 0, 104, 44,
                `${fragments}${cost ? `/${cost.fragments}` : ''}`, 18, new Color(157, 213, 255, 255));
            const costText = !unlocked ? `需通关第${bagLikeLevelNumber(unlockLevel)}关` : cost ? `${cost.gold} 金币` : '属性已满';
            this.makeLabel(`AccountCost_${family}`, row, 118, 0, 142, 44, costText, 17, CREAM);
            const upgradeLabel = this.makeButton(`AccountUpgrade_${family}`, row, 255, 0, 104, 48,
                !unlocked ? '锁定' : cost ? '升星' : '满星', () => this.upgradeAccountHero(family));
            if (!unlocked || !cost) {
                this.restyleButton(upgradeLabel, new Color(74, 78, 88, 255), new Color(165, 165, 165, 255));
                upgradeLabel.node.parent!.getComponent(Button)!.interactable = false;
            }
        });
        const previous = this.makeButton('AccountHeroPrevious', this.accountContentLayer, -185, -305, 150, 52, '上一页', () => {
            this.accountHeroPage -= 1;
            this.renderAccountPanel();
        });
        previous.node.parent!.getComponent(Button)!.interactable = this.accountHeroPage > 0;
        const next = this.makeButton('AccountHeroNext', this.accountContentLayer, 185, -305, 150, 52, '下一页', () => {
            this.accountHeroPage += 1;
            this.renderAccountPanel();
        });
        next.node.parent!.getComponent(Button)!.interactable = this.accountHeroPage < pageCount - 1;
        this.makeLabel('AccountHeroPage', this.accountContentLayer, 0, -305, 140, 48,
            `${this.accountHeroPage + 1} / ${pageCount}`, 19, GOLD);
    }

    private longRunValidationEnabled(): boolean {
        if (typeof window === 'undefined') return false;
        return /(?:^|[?&])longRunValidation=1(?:&|$)/.test(window.location.search);
    }

    private longRunRequestedMode(): 'daily' | 'endless' | null {
        if (typeof window === 'undefined') return null;
        const match = /(?:^|[?&])longRunMode=(daily|endless)(?:&|$)/.exec(window.location.search);
        return match ? match[1] as 'daily' | 'endless' : null;
    }

    private longRunLateProgressionEnabled(): boolean {
        if (typeof window === 'undefined') return false;
        return /(?:^|[?&])longRunProgression=late(?:&|$)/.test(window.location.search);
    }

    private clonePowerRoleState(state: PowerRoleState): PowerRoleState {
        return {
            ...state,
            roles: {
                P01: { ...state.roles.P01 },
                P02: { ...state.roles.P02 },
                P03: { ...state.roles.P03 },
                P04: { ...state.roles.P04 },
            },
        };
    }

    private lateProgressionPowerRoleState(state: PowerRoleState): PowerRoleState {
        const next = this.clonePowerRoleState(state);
        for (const id of POWER_ROLE_IDS) {
            next.roles[id].star = POWER_ROLE_MAX_STAR;
            next.roles[id].level = POWER_ROLE_MAX_LEVEL;
        }
        // P01 is the source-evidenced automatic role. Keeping it equipped avoids
        // synthetic active-skill input while still exercising all global passives.
        next.equippedRoleId = 'P01';
        return next;
    }

    private stepLongRunAutomation(dt: number, scaledDt: number): void {
        if (!this.longRunValidationEnabled()) return;
        this.speed = LONG_RUN_VALIDATION_SPEED;
        if (this.phase === 'battle') this.longRunElapsedSeconds += Math.max(0, scaledDt);
        const livingSelf = this.units.filter((unit) => !unit.dead && unit.team === 'self').length;
        const livingEnemy = this.units.filter((unit) => !unit.dead && unit.team === 'enemy').length;
        this.longRunMaxSelfUnits = Math.max(this.longRunMaxSelfUnits, livingSelf);
        this.longRunMaxEnemyUnits = Math.max(this.longRunMaxEnemyUnits, livingEnemy);
        this.longRunAutomationTimer -= Math.max(0, dt);
        if (this.longRunAutomationTimer > 0) return;
        this.longRunAutomationTimer = 0.65;

        if (this.phase === 'deploy') {
            this.longRunStatus = `deploy-round-${this.roundIndex + 1}`;
            this.longRunPrepareBoard();
            if (this.gears.some((gear) => Boolean(GEARS[gear.id].unit))) this.startRound();
            return;
        }
        if (this.phase === 'trait' && this.currentTraitChoices.length > 0) {
            const choice = this.currentTraitChoices.find((trait) => isRecommendedTrait(trait, this.currentTraitChoices))
                || this.currentTraitChoices[0];
            this.longRunStatus = `trait-${choice.id}`;
            this.chooseTrait(choice);
            return;
        }
        if (this.phase === 'lost' && this.battleMode === 'normal' && this.longRunRetries < 30) {
            this.longRunRetries += 1;
            this.longRunStatus = `retry-${this.longRunRetries}`;
            this.restartLevel();
            return;
        }
        if (this.phase === 'won') this.longRunStatus = this.battleMode === 'normal' ? 'cleared' : 'settled';
        else if (this.phase === 'battle') this.longRunStatus = `battle-round-${this.roundIndex + 1}`;
    }

    private longRunPrepareBoard(): void {
        // Merge only identical ordinary gears through the normal merge reducer.
        // This mirrors a user dropping one matching candidate onto another and
        // deliberately avoids fusion/star shortcuts.
        for (const candidate of [...this.candidates]) {
            if (!candidate.node.isValid || !GEARS[candidate.id].nextId) continue;
            const target = [...this.gears, ...this.candidates]
                .find((gear) => gear !== candidate && gear.id === candidate.id);
            if (target) this.mergeGears(candidate, target);
        }

        // Consume recovered grid rewards through their normal unlock rule.
        for (const reward of [...this.candidates]) {
            if (!GEARS[reward.id].gridUnlock) continue;
            let unlocked = false;
            for (let row = 0; row < GRID_ROWS && !unlocked; row += 1) {
                for (let col = 0; col < GRID_COLS && !unlocked; col += 1) {
                    if (!this.canUnlockShape(reward.id, row, col)) continue;
                    for (const [cellRow, cellCol] of this.gearCellsAt(reward.id, row, col)) {
                        this.unlocked.add(cellRow * GRID_COLS + cellCol);
                    }
                    this.candidates = this.candidates.filter((gear) => gear !== reward);
                    reward.node.destroy();
                    unlocked = true;
                }
            }
            if (unlocked) this.drawGrid();
        }

        const occupied = (): Set<string> => {
            const cells = new Set<string>();
            for (const gear of this.gears) {
                for (const [row, col] of this.gearCellsAt(gear.id, gear.row, gear.col)) cells.add(`${row}:${col}`);
            }
            return cells;
        };
        const ordered = [...this.candidates].sort((left, right) =>
            Number(Boolean(GEARS[right.id].unit)) - Number(Boolean(GEARS[left.id].unit))
            || (GEARS[right.id].level || 0) - (GEARS[left.id].level || 0));
        for (const candidate of ordered) {
            if (!candidate.node.isValid || GEARS[candidate.id].gridUnlock) continue;
            const currentCells = occupied();
            let placed = false;
            for (let radius = 1; radius <= GRID_ROWS + GRID_COLS && !placed; radius += 1) {
                for (let row = 0; row < GRID_ROWS && !placed; row += 1) {
                    for (let col = 0; col < GRID_COLS && !placed; col += 1) {
                        if (Math.abs(row - 2) + Math.abs(col - 3) !== radius) continue;
                        if (!this.canPlaceGear(candidate.id, row, col)) continue;
                        const cells = this.gearCellsAt(candidate.id, row, col);
                        const connected = cells.some(([cellRow, cellCol]) => [
                            `${cellRow}:${cellCol + 1}`,
                            `${cellRow + 1}:${cellCol}`,
                            `${cellRow}:${cellCol - 1}`,
                            `${cellRow - 1}:${cellCol}`,
                        ].some((key) => currentCells.has(key)));
                        if (!connected) continue;
                        this.longRunPlaceCandidate(candidate, row, col);
                        placed = true;
                    }
                }
            }
        }
        this.relayoutCandidates();

        // A late special-mode account normally enters with a developed bag rather
        // than only the first three candidates. During explicit long-run validation,
        // spend the recovered preparation currency through the normal refresh
        // reducer and place/merge each resulting batch before starting the wave.
        // The cap is only a recursion guard; insufficient gold stops the same path.
        if (this.longRunLateProgressionEnabled()
            && this.battleMode !== 'normal'
            && this.normalRefreshTimes < 12) {
            const previousRefreshTimes = this.normalRefreshTimes;
            this.claimNextBatch(false);
            if (this.normalRefreshTimes > previousRefreshTimes) this.longRunPrepareBoard();
        }
    }

    private longRunPlaceCandidate(gear: Gear, row: number, col: number): void {
        this.candidates = this.candidates.filter((candidate) => candidate !== gear);
        gear.location = 'grid';
        gear.candidateIndex = -1;
        gear.row = row;
        gear.col = col;
        gear.rotationActive = false;
        gear.rotationElapsed = gear.rotationDuration;
        if (this.gears.indexOf(gear) < 0) this.gears.push(gear);
        const target = this.gridPosition(row, col);
        gear.node.setPosition(target.x, target.y);
        gear.node.setScale(1, 1, 1);
        this.applyGearRotationPresentation(gear);
        this.refreshPlacedWheelHomeHp();
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
        this.backgroundEffectLayer.getComponent(UITransform)!.setContentSize(DESIGN_WIDTH, layout.battleHeight);
        this.unitLayer.getComponent(UITransform)!.setContentSize(DESIGN_WIDTH, layout.battleHeight);
        const effectLayer = this.battleLayer.getChildByName('BattleEffects');
        effectLayer?.getComponent(UITransform)?.setContentSize(DESIGN_WIDTH, layout.battleHeight);

        this.gridOffsetY = layout.gridOffsetY;
        this.battleLayer.active = this.phase === 'battle' || this.phase === 'trait' || this.phase === 'roundClear';
        this.backpackBackground.setPosition(0, -150 + this.gridOffsetY + layout.backpackBackgroundOffsetY);
        this.backpackPanel.setPosition(0, 51.5 + this.gridOffsetY + layout.backpackPanelOffsetY);
        this.backpackHpBar.setPosition(0, 330 + this.gridOffsetY + layout.backpackHpOffsetY);
        this.gridLayer.setPosition(0, 0);
        for (const gear of this.gears) {
            const position = this.gridPosition(gear.row, gear.col);
            gear.node.setPosition(position.x, position.y);
        }

        this.candidateLayer.active = layout.showPreparationControls;
        this.tipLabel.node.active = layout.showPreparationControls;
        this.fusionGuideLabel.node.active = layout.showPreparationControls;
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
        if (this.battleMode !== 'normal') {
            for (let row = 1; row <= 3; row += 1) {
                for (let col = 1; col <= 5; col += 1) this.unlocked.add(row * GRID_COLS + col);
            }
            this.drawGrid();
            return;
        }
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
        this.powerDirection = 1;
        this.powerTimer = POWER_QUARTER_LAP_SECONDS;
        this.powerCoreModelElapsed = 0;
        this.applyRoundStartHomeHeal();
        this.clearCandidates();
        this.applyPhaseLayout();
        this.roundClock = 0;
        this.spawnIndex = 0;
        this.clearTimer = 0;
        this.pendingHits = [];
        this.pendingFusionSkillHits = [];
        this.productionJobs = [];
        this.powerSkillRemaining = this.powerRoleState.equippedRoleId === 'P01'
            ? P01_ROUND_START_PRODUCTIVITY_SECONDS
            : 0;
        this.powerRoleActiveRemaining = 0;
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

    private activateEquippedPowerRole(): void {
        if (this.phase !== 'battle' || !powerRoleActiveAvailable(this.powerRoleState, this.powerRoleEnergy)) return;
        const roleId = this.powerRoleState.equippedRoleId;
        this.powerRoleEnergy -= POWER_ROLE_ACTIVE_ENERGY_COST;
        this.powerRoleActiveRemaining = POWER_ROLE_ACTIVE_SECONDS;
        if (roleId === 'P03') {
            const previousHp = this.selfHp;
            this.selfHp = resolveHomeHeal(this.selfHp, this.levelHomeHp, p03ActiveHealBasisPoints(this.powerRoleState));
            const healed = this.selfHp - previousHp;
            if (healed > 0) this.addHealText(healed, -HOME_X + 20, -15);
            this.drawHomes();
        } else if (roleId === 'P04') {
            this.castP04ScreenDart();
        }
        this.tipLabel.string = `${roleId} 主动能力已释放`;
        this.refreshUi();
    }

    private powerRoleSkillTotalAttack(): number {
        const roleBasisPoints = powerRoleGlobalAttackBasisPoints(this.powerRoleState);
        const heroStars = this.currentHeroStars();
        let total = 0;
        for (const gear of this.gears) {
            const gearConfig = GEARS[gear.id];
            if (!gearConfig.unit) continue;
            const profile = bagLikeProducerProfile(gear.id);
            const unitConfig = UNITS[gearConfig.unit];
            if (!profile || !unitConfig) continue;
            const starAttack = bagLikeHeroBaseAttributeAtStar(unitConfig.atk, heroStars[profile.heroId] || 1);
            const roleAdjustedAttack = Math.floor(starAttack * (1 + roleBasisPoints / 10000));
            const producerScale = resolveProducerAttributeScales(
                profile.attributeMultiple,
                this.isGearDirectlyAdjacentToPower(gear),
                traitPowerNearAttackMultiplier(IMPLEMENTED_TRAIT_POOL, this.traitStacks),
            ).attack;
            const dailyScale = this.battleMode === 'daily'
                ? dailyHeroAttackMultiplier(this.dailyBuffIds, gearConfig.shape.length)
                : 1;
            total += roleAdjustedAttack * producerScale * dailyScale;
        }
        return total || 1;
    }

    private castP04ScreenDart(): void {
        // Original chain: PowerSkillVo -> CREATE_POWER_SKILL ->
        // BagLilkeManager.getTotalAtk() -> FB_1601 -> M_FB_P04. The Dart unit
        // travels left-to-right at y=0, hits at most ten distinct enemies in a
        // 150 radius, and reduces the configured ratio by 10% of itself per hit.
        const sourceAttack = this.powerRoleSkillTotalAttack();
        const targets = this.units
            .filter((unit) => unit.team === 'enemy' && !unit.dead && Math.abs(unit.y) <= 150)
            .sort((left, right) => left.x - right.x)
            .slice(0, P04_MAX_HITS);
        const fromX = -HOME_X;
        const toX = HOME_X;
        // MissileConfig M_FB_P04_*: speed=1000, path=screnLR,
        // angleSpeed=3 rad/s, fixed=1, offY=0 and actNum=10.
        const travelSeconds = (toX - fromX) / 1000;
        const dart = this.makeNode('P04ScreenDart_H33_S1', this.effectLayer, fromX, 0, 150, 150);
        if (this.p04ProjectileFrame) {
            const sprite = dart.addComponent(Sprite);
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            sprite.spriteFrame = this.p04ProjectileFrame;
        } else {
            const graphics = dart.addComponent(Graphics);
            graphics.fillColor = new Color(131, 101, 233, 245);
            graphics.moveTo(0, 48);
            graphics.lineTo(17, 17);
            graphics.lineTo(48, 0);
            graphics.lineTo(17, -17);
            graphics.lineTo(0, -48);
            graphics.lineTo(-17, -17);
            graphics.lineTo(-48, 0);
            graphics.lineTo(-17, 17);
            graphics.close();
            graphics.fill();
        }
        this.projectileVisuals.push({
            node: dart,
            delay: 0,
            elapsed: 0,
            duration: travelSeconds,
            fromX,
            fromY: 0,
            toX,
            toY: 0,
            angularSpeedDegrees: 3 * 180 / Math.PI,
        });
        targets.forEach((target, index) => {
            const hitSeconds = Math.max(0, Math.min(travelSeconds, (target.x - fromX) / 1000));
            this.scheduleOnce(() => {
                if (target.dead) return;
                const damageRatio = p04DamageBasisPointsAtHit(this.powerRoleState, index);
                const wasAlive = !target.dead;
                this.damageUnit(target, Math.max(1, Math.round(sourceAttack * damageRatio / 10000)));
                if (wasAlive && target.dead) {
                    this.powerRoleKillProductivityStacks = Math.min(
                        p04KillProductivityCap(this.powerRoleState),
                        this.powerRoleKillProductivityStacks + 1,
                    );
                }
            }, hitSeconds);
        });
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
            if (!this.longRunOriginalAccountProfile) this.persistAccountProfile();
        }
        const retryState = normalLevelRetryState(this.failedAttempts);
        this.clearUnits();
        for (const gear of [...this.gears]) gear.node.destroy();
        for (const gear of [...this.candidates]) gear.node.destroy();
        this.gears = [];
        this.candidates = [];
        this.refreshPlacedWheelHomeHp();
        this.phase = 'deploy';
        this.roundIndex = retryState.roundIndex;
        this.failedAttempts = retryState.failedAttempts;
        this.selfHp = this.levelHomeHp;
        this.gold = this.initialGold;
        this.refreshIndex = 0;
        this.normalRefreshTimes = 0;
        this.nonAdRefreshTimes = 0;
        this.freeRefreshUsed = false;
        this.bagLikeLevel = 1;
        this.bagLikeExp = 0;
        this.powerRoleEnergy = 0;
        this.powerRoleActiveRemaining = 0;
        this.powerRoleKillProductivityStacks = 0;
        this.powerRoleStartRewardClaimed = false;
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
        this.resultRevealVersion += 1;
        this.resultActionsLayer.active = false;
        this.resultNextButtonLabel.node.parent!.active = false;
        this.traitLayer.active = false;
        this.applyPhaseLayout();
        this.drawExpBar();
    }

    private retryCurrentMode(): void {
        if (this.battleMode === 'normal') this.restartLevel();
        else this.beginSpecialBattle(this.battleMode);
    }

    private returnFromBattleResult(): void {
        if (this.battleMode === 'daily') this.showDailyInstanceScene();
        else if (this.battleMode === 'endless') this.showEndlessModeScene();
        else this.returnToMainScene();
    }

    private claimNextBatch(_free: boolean): void {
        if (this.phase !== 'deploy') return;
        const baseCost = candidateNormalRefreshCost(this.normalRefreshTimes, REFRESH_COST);
        const cost = this.battleMode === 'daily' ? dailyRefreshCost(baseCost, this.dailyBuffIds) : baseCost;
        if (this.gold < cost) {
            this.tipLabel.string = `金币不足：本次刷新需要 ${cost}`;
            return;
        }
        this.gold -= cost;
        this.replaceCandidates(this.nextCandidateBatch('normal'));
        this.tipLabel.string = cost === 0 ? '本局首次普通刷新免费；请手动拖动候选齿轮' : `已消耗 ${cost} 金币刷新；请手动摆放`;
    }

    private claimFreeBatch(): void {
        if (this.phase !== 'deploy') return;
        if (this.freeRefreshUsed) {
            this.tipLabel.string = '本准备回合的广告刷新已经使用';
            return;
        }
        this.playMockAdvertisement('battle-refresh', () => {
            this.replaceCandidates(this.nextCandidateBatch('ad'));
            this.tipLabel.string = '广告播放完成：候选齿轮已刷新，仍需手动拖入背包';
            this.refreshUi();
        }, (outcome) => {
            this.tipLabel.string = outcome === 'cancelled' ? '已取消广告，刷新次数未消耗' : '广告播放失败，刷新次数未消耗';
            this.refreshUi();
        });
    }

    private dealPreparationBatch(): void {
        const counters = beginCandidatePreparationRound({
            normalRefreshTimes: this.normalRefreshTimes,
            nonAdRefreshTimes: this.nonAdRefreshTimes,
            hasRefreshFromAd: this.freeRefreshUsed,
        });
        this.normalRefreshTimes = counters.normalRefreshTimes;
        this.nonAdRefreshTimes = counters.nonAdRefreshTimes;
        this.freeRefreshUsed = counters.hasRefreshFromAd;
        this.replaceCandidates(this.nextCandidateBatch('prepare'));
    }

    private nextCandidateBatch(refreshType: CandidateRefreshType): GearId[] {
        const counters = completeCandidateRefresh({
            normalRefreshTimes: this.normalRefreshTimes,
            nonAdRefreshTimes: this.nonAdRefreshTimes,
            hasRefreshFromAd: this.freeRefreshUsed,
        }, refreshType);
        this.normalRefreshTimes = counters.normalRefreshTimes;
        this.nonAdRefreshTimes = counters.nonAdRefreshTimes;
        this.freeRefreshUsed = counters.hasRefreshFromAd;
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
        const dailyPrepareModifiers = this.battleMode === 'daily'
            && refreshType === 'prepare'
            && this.dailyBuffIds.indexOf('DI_BUFF_eff02') >= 0
            ? [{ rewardType: 'REWARD' as const, rewardId: 3013, multiplier: 20000 }]
            : [];
        const batch = drawDynamicCandidateBatch(
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
                [...traitPrepareRewardWeightModifiers(IMPLEMENTED_TRAIT_POOL, this.traitStacks), ...dailyPrepareModifiers],
            ),
        );
        if (this.battleMode === 'daily' && this.dailyBuffIds.indexOf('DI_BUFF_eff07') >= 0
            && batch.length > 0 && Math.floor(Math.random() * 10000) <= 200) {
            const maxLevelIds = Array.from(bagLikeAccountUnlockedHeroFamilies(this.accountProfile))
                .map((family) => `${family}04` as GearId)
                .filter((id) => Boolean(GEARS[id]));
            if (maxLevelIds.length > 0) batch[0] = maxLevelIds[Math.floor(Math.random() * maxLevelIds.length)] as CandidateGearId;
        }
        const startRewardLevel = p01StartRewardGearLevel(this.powerRoleState);
        if (refreshType === 'prepare' && !this.powerRoleStartRewardClaimed && startRewardLevel > 0) {
            const rewardIds = Array.from(unlockedHeroFamilies)
                .map((family) => `${family}0${startRewardLevel}` as GearId)
                .filter((id) => Boolean(GEARS[id]));
            if (rewardIds.length > 0) {
                batch.push(rewardIds[Math.floor(Math.random() * rewardIds.length)] as CandidateGearId);
                this.powerRoleStartRewardClaimed = true;
            }
        }
        return batch;
    }

    private replaceCandidates(batch: GearId[]): void {
        const unsupportedIds = batch.filter((id) => !GEARS[id]);
        if (unsupportedIds.length > 0) {
            throw new Error(`候选批次包含未恢复齿轮：${unsupportedIds.join(', ')}；完整批次：${batch.join(', ')}`);
        }
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
        const gear: Gear = {
            uid: ++this.serial,
            id,
            row,
            col,
            node,
            workerPower: 0,
            location,
            candidateIndex,
            rotationElapsed: 0,
            rotationDuration: POWER_CONTACT_DELAY_SECONDS,
            rotationActive: false,
            rotationTriggerCount: 0,
        };
        this.renderGear(gear);
        node.on(Node.EventType.TOUCH_START, (event: EventTouch) => this.beginGearDrag(gear, event), this);
        node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => this.moveGearDrag(gear, event), this);
        node.on(Node.EventType.TOUCH_END, (event: EventTouch) => this.endGearDrag(gear, event), this);
        node.on(Node.EventType.TOUCH_CANCEL, () => this.cancelGearDrag(gear), this);
        return gear;
    }

    private gearFootprint(id: GearId): { rows: number; columns: number } {
        const shape = this.gearShape(id);
        return {
            rows: Math.max(...shape.map(([row]) => row)) + 1,
            columns: Math.max(...shape.map(([, col]) => col)) + 1,
        };
    }

    private renderGear(gear: Gear): void {
        const config = GEARS[gear.id];
        const shape = this.gearShape(gear.id);
        const footprint = this.gearFootprint(gear.id);
        const transform = gear.node.getComponent(UITransform)!;
        transform.setContentSize(footprint.columns * GRID_CELL, footprint.rows * GRID_CELL);
        transform.setAnchorPoint(0.5 / footprint.columns, 1 - 0.5 / footprint.rows);
        gear.node.name = `Gear_${gear.id}_${gear.uid}`;
        for (const child of [...gear.node.children]) child.destroy();

        const g = gear.node.getComponent(Graphics)!;
        g.clear();
        if (gear.id === 'P01') {
            this.attachPowerCorePresentation(gear);
            this.applyPowerCorePresentation(gear);
            return;
        }
        const bodyColor = bagLikeGearBodyColor(config.level, [config.tint.r, config.tint.g, config.tint.b]);
        if (config.level && shape.length > 1) {
            this.attachGearConnectorSprite(gear.node, shape, new Color(bodyColor[0], bodyColor[1], bodyColor[2], 255));
        }
        for (const [shapeRow, shapeCol] of shape) {
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
            if (config.level) {
                const gridIndex = gear.location === 'grid'
                    ? (gear.row + shapeRow) * GRID_COLS + gear.col + shapeCol
                    : this.currentPowerIndex();
                const baseAngle = gear.location === 'grid'
                    ? gearRotationAngleDegrees(gridIndex, this.currentPowerIndex(), 0, 0)
                    : 0;
                this.attachGearBodySprite(gear.node, config.level, cellX, cellY, shapeRow, shapeCol, baseAngle);
            }
        }
        if ((config.level || 0) >= 5) this.attachLevelFiveShapeOverlay(gear.node, shape);
        const headKey = this.gearHeadKey(gear.id);
        if (headKey) {
            const rolePosition = bagLikeProducerRolePosition(gear.id, GRID_CELL);
            const portraitX = rolePosition?.x ?? (footprint.columns - 1) * GRID_CELL * 0.5;
            const portraitY = rolePosition?.y ?? -(footprint.rows - 1) * GRID_CELL * 0.5 + 3;
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
            const progressNode = this.makeNode('WorkerProgressBar', gear.node, labelX, labelY + 22, 82, 14);
            progressNode.addComponent(Graphics);
            this.drawWorkerProgressBar(gear);
            g.fillColor = new Color(40, 48, 82, 245);
            g.roundRect(labelX - 43, labelY - 12, 86, 24, 7);
            g.fill();
            g.strokeColor = CREAM;
            g.lineWidth = 2;
            g.roundRect(labelX - 43, labelY - 12, 86, 24, 7);
            g.stroke();
            this.makeLabel('ProductionRate', gear.node, labelX, labelY, 82, 22, `${productionRate}/s`, 14, CREAM);
        }
        this.applyGearRotationPresentation(gear);
    }

    private gearHeadKey(id: GearId): string | null {
        if (id.startsWith('C')) return 'coin';
        if (id.startsWith('H11')) return 'H1101';
        if (id.startsWith('H12')) return 'H1201';
        if (id.startsWith('H13')) return 'H1301';
        const profile = bagLikeProducerProfile(id);
        if (profile && HERO_SMALL_HEAD_FRAMES[profile.headId]) return profile.headId;
        return HERO_SMALL_HEAD_FRAMES[id] ? id : null;
    }

    private attachStaticGearPortrait(parent: Node, headKey: string, x: number, y: number): void {
        const frameData = HERO_SMALL_HEAD_FRAMES[headKey];
        if (!frameData) {
            const badge = this.makeNode(`StaticGearPortrait_${headKey}`, parent, x, y, 76, 76);
            const graphics = badge.addComponent(Graphics);
            const colors: Record<string, Color> = {
                P02: new Color(207, 67, 65, 255),
                P03: new Color(62, 151, 218, 255),
                P04: new Color(107, 91, 166, 255),
            };
            graphics.fillColor = colors[headKey] || new Color(75, 85, 102, 255);
            graphics.circle(0, 0, 36);
            graphics.fill();
            this.makeLabel(`StaticGearPortraitLabel_${headKey}`, badge, 0, 0, 68, 42, headKey, 19, WHITE);
            return;
        }
        const portraitNode = this.makeNode(`StaticGearPortrait_${headKey}`, parent, x, y, 90, 90);
        resources.load('original/heroSmallHead/spriteFrame', SpriteFrame, (error, atlasFrame) => {
            if (!portraitNode.isValid) return;
            if (error) {
                console.error(`[visual-catalog] head atlas failed ${headKey}: ${error.message}`);
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

    private attachPowerRolePortrait(parent: Node, roleId: PowerRoleId, x: number, y: number): void {
        this.attachStaticGearPortrait(parent, roleId, x, y);
        const resourcePaths: Partial<Record<PowerRoleId, string>> = {
            P01: 'spine/PowerRoleP01Card/pao_paopaoshu',
            P04: 'spine/PowerRoleP04/pao_kakaxi',
        };
        const resourcePath = resourcePaths[roleId];
        if (!resourcePath) return;
        resources.load(resourcePath, sp.SkeletonData, (error, data) => {
            if (error || !data || !parent.isValid) return;
            const fallback = parent.getChildByName(`StaticGearPortrait_${roleId}`);
            if (fallback?.isValid) fallback.destroy();
            const model = this.makeNode(`RecoveredPowerRoleModel_${roleId}`, parent, x + 1, y - 20, 80, 80);
            // ModelConfig.P01L/P04L record offset (1,-20), scale 0.7,
            // height 80 and looping idle for the card/list models.
            model.setScale(0.7, 0.7, 1);
            const skeleton = model.addComponent(sp.Skeleton);
            skeleton.skeletonData = data;
            skeleton.setAnimation(0, 'idle', true);
        });
    }

    private attachPowerCoreRoleModel(parent: Node, roleId: PowerRoleId): void {
        this.attachStaticGearPortrait(parent, roleId, 0, 0);
        const resourcePaths: Partial<Record<PowerRoleId, string>> = {
            P01: 'spine/PowerRoleP01Full/pao_paopaoshu',
            P04: 'spine/PowerRoleP04Full/pao_kakaxi',
        };
        const resourcePath = resourcePaths[roleId];
        if (!resourcePath) return;
        resources.load(resourcePath, sp.SkeletonData, (error, data) => {
            if (error || !data || !parent.isValid) return;
            const fallback = parent.getChildByName(`StaticGearPortrait_${roleId}`);
            if (fallback?.isValid) fallback.destroy();
            const model = this.makeNode(`RecoveredPowerCoreRoleModel_${roleId}`, parent, 1, -10, 80, 80);
            // ModelConfig.P01/P04 share offset (1,-10), scale 1,
            // height 80 and looping idle for the battlefield power-core model.
            model.setScale(1, 1, 1);
            const skeleton = model.addComponent(sp.Skeleton);
            skeleton.skeletonData = data;
            skeleton.setAnimation(0, 'idle', true);
        });
    }

    private playPowerRoleUpgradeGlow(parent: Node): void {
        resources.load(
            'spine/PowerRoleUpgradeGlow/chilunpy_shengjishanguang',
            sp.SkeletonData,
            (error, data) => {
                if (error || !data || !parent.isValid) return;
                // HeroInfoView places its centered 708x380 HeroUpAniComp at
                // FairyGUI (374,341), which maps to Cocos (-1,326) in 750x1334.
                const glow = this.makeNode('RecoveredPowerRoleUpgradeGlow', parent, -1, 326, 708, 380);
                const skeleton = glow.addComponent(sp.Skeleton);
                skeleton.skeletonData = data;
                skeleton.setCompleteListener(() => {
                    if (glow.isValid) glow.destroy();
                });
                skeleton.setAnimation(0, 'idle', false);
                this.scheduleOnce(() => {
                    if (glow.isValid) glow.destroy();
                }, 2);
            },
        );
    }

    private attachGearPortrait(gear: Gear, headKey: string, x: number, y: number): void {
        const frameData = HERO_SMALL_HEAD_FRAMES[headKey];
        if (!frameData) return;
        const portraitNode = this.makeNode(`GearPortrait_${headKey}`, gear.node, x, y, 90, 90);
        if (headKey === 'coin') portraitNode.setScale(0.68, 0.68, 1);
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

    private attachGearBodySprite(
        parent: Node,
        level: number,
        x: number,
        y: number,
        shapeRow = 0,
        shapeCol = 0,
        baseAngle = 0,
    ): void {
        const rect = GEAR_BODY_FRAMES[level];
        if (!rect) return;
        const rotor = this.makeNode(`GearRotor_${shapeRow}_${shapeCol}`, parent, x, y, 116, 116);
        rotor.angle = baseAngle;
        const shadowNode = this.makeNode(`GearBodyShadow_cl${level}`, rotor, 4, -5, 110, 110);
        shadowNode.setScale(1.04, 1.04, 1);
        const glowNode = this.makeNode('GearPowerGlow', rotor, 0, 0, 110, 110);
        glowNode.setScale(1.09, 1.09, 1);
        const bodyNode = this.makeNode(`GearBody_cl${level}`, rotor, 0, 0, 110, 110);
        resources.load('original/bagLike_0/spriteFrame', SpriteFrame, (error, atlasFrame) => {
            if (error || !rotor.isValid) return;
            const makeFrame = (): SpriteFrame => {
                const frame = new SpriteFrame();
                frame.reset({
                    texture: atlasFrame.texture,
                    rect,
                    originalSize: new Size(110, 110),
                    offset: Vec2.ZERO,
                });
                return frame;
            };
            const shadow = shadowNode.addComponent(Sprite);
            shadow.sizeMode = Sprite.SizeMode.CUSTOM;
            shadow.color = new Color(30, 34, 48, 145);
            shadow.spriteFrame = makeFrame();
            const glow = glowNode.addComponent(Sprite);
            glow.sizeMode = Sprite.SizeMode.CUSTOM;
            glow.color = new Color(255, 226, 104, 0);
            glow.spriteFrame = makeFrame();
            const body = bodyNode.addComponent(Sprite);
            body.sizeMode = Sprite.SizeMode.CUSTOM;
            body.spriteFrame = makeFrame();
        });
    }

    private attachPowerCorePresentation(gear: Gear): void {
        const rotor = this.makeNode('PowerCoreRotor', gear.node, 0, 0, 114, 114);
        rotor.setSiblingIndex(0);
        const shadow = this.makeNode('PowerCoreShadow', rotor, 4, -5, 114, 114);
        this.attachRecoveredAtlasSprite(
            shadow,
            'original/bagLike_0/spriteFrame',
            BAGLIKE_ATLAS_FRAMES.powerCore,
            new Color(35, 31, 34, 135),
        );
        const body = this.makeNode('PowerCoreBody', rotor, 0, 0, 114, 114);
        this.attachBagLikeAtlasSprite(body, BAGLIKE_ATLAS_FRAMES.powerCore);

        // The original keeps the equipped role model outside the rotating
        // power-panel node and loops its battle animation independently.
        const hamster = this.makeNode('PowerCoreHamster', gear.node, 0, 7, 90, 90);
        this.attachPowerCoreRoleModel(hamster, this.powerRoleState.equippedRoleId);
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

    private preloadRecoveredProjectilePresentation(): void {
        this.recoveredProjectileAudioSource = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
        resources.load(
            'original/projectile-matrix/js_feixingyuan_dandao2/spriteFrame',
            SpriteFrame,
            (error, sourceFrame) => {
                if (error || !sourceFrame) return;
                const specs = [
                    { rect: new Rect(1, 119, 43, 28), offset: new Vec2(3, 0) },
                    { rect: new Rect(1, 85, 43, 32), offset: new Vec2(3, 0) },
                    { rect: new Rect(1, 1, 43, 40), offset: new Vec2(3, 1) },
                    { rect: new Rect(1, 43, 43, 40), offset: new Vec2(3, 0) },
                    { rect: new Rect(1, 149, 43, 28), offset: new Vec2(3, 0) },
                ];
                this.h06ProjectileFrames = specs.map((spec) => {
                    const frame = new SpriteFrame();
                    frame.reset({
                        texture: sourceFrame.texture,
                        rect: spec.rect,
                        originalSize: new Size(51, 54),
                        offset: spec.offset,
                    });
                    return frame;
                });
            },
        );
        resources.load(
            'original/projectile-matrix/chilun_haidaosha/spriteFrame',
            SpriteFrame,
            (error, sourceFrame) => {
                if (error || !sourceFrame) return;
                const specs = [
                    { rect: new Rect(1, 236, 65, 17), offset: new Vec2(-49, -91) },
                    { rect: new Rect(1520, 179, 165, 69), offset: new Vec2(-90, -65) },
                    { rect: new Rect(1711, 1, 193, 135), offset: new Vec2(-87, -37) },
                    { rect: new Rect(1285, 1, 181, 181), offset: new Vec2(-89, -16) },
                    { rect: new Rect(1108, 1, 175, 219), offset: new Vec2(-79, 0) },
                    { rect: new Rect(923, 1, 183, 223), offset: new Vec2(-65, 2) },
                    { rect: new Rect(1, 1, 217, 233), offset: new Vec2(-44, 6) },
                    { rect: new Rect(220, 1, 219, 223), offset: new Vec2(-25, -1) },
                    { rect: new Rect(441, 1, 223, 213), offset: new Vec2(-27, -6) },
                    { rect: new Rect(666, 1, 255, 149), offset: new Vec2(-17, -38) },
                    { rect: new Rect(1285, 184, 233, 69), offset: new Vec2(-28, -78) },
                    { rect: new Rect(666, 152, 237, 75), offset: new Vec2(-8, -70) },
                    { rect: new Rect(1468, 92, 237, 85), offset: new Vec2(-19, -68) },
                    { rect: new Rect(1468, 1, 241, 89), offset: new Vec2(-17, -68) },
                    { rect: new Rect(1707, 138, 193, 97), offset: new Vec2(35, -66) },
                    { rect: new Rect(1707, 138, 193, 97), offset: new Vec2(35, -66) },
                ];
                this.h14BombFrames = specs.map((spec) => {
                    const frame = new SpriteFrame();
                    frame.reset({
                        texture: sourceFrame.texture,
                        rect: spec.rect,
                        originalSize: new Size(369, 245),
                        offset: spec.offset,
                    });
                    return frame;
                });
            },
        );
        resources.load(
            'original/projectile-matrix/yugutou_dandao/spriteFrame',
            SpriteFrame,
            (error, sourceFrame) => {
                if (error || !sourceFrame) return;
                const frame = new SpriteFrame();
                frame.reset({
                    texture: sourceFrame.texture,
                    rect: new Rect(1, 1, 38, 20),
                    originalSize: new Size(38, 20),
                    offset: Vec2.ZERO,
                });
                this.enemyBoneProjectileFrame = frame;
            },
        );
        resources.load(
            'original/projectile-matrix/boss_1_dandao/spriteFrame',
            SpriteFrame,
            (error, sourceFrame) => {
                if (error || !sourceFrame) return;
                const frame = new SpriteFrame();
                frame.reset({
                    texture: sourceFrame.texture,
                    rect: new Rect(1, 1, 37, 38),
                    originalSize: new Size(39, 40),
                    offset: Vec2.ZERO,
                });
                this.enemyOrbProjectileFrame = frame;
            },
        );
        resources.load('spine/ProjectileMatrix/H17/chilun_shexian1', sp.SkeletonData, (error, data) => {
            if (!error && data) this.h17RayData = data;
        });
        resources.load('spine/ProjectileMatrix/M10/gw_10_zidan', sp.SkeletonData, (error, data) => {
            if (!error && data) this.m10ProjectileData = data;
        });
        resources.load('original/projectile-matrix/bullet_shayu', AudioClip, (error, clip) => {
            if (!error && clip) this.h14HitAudio = clip;
        });
    }

    private addRecoveredSpriteProjectile(
        name: string,
        frames: SpriteFrame[],
        width: number,
        height: number,
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay: number,
        scaleX: number,
        scaleY: number,
        arcHeight = 0,
        animate = false,
    ): void {
        if (frames.length === 0 || !this.effectLayer?.isValid) return;
        const node = this.makeNode(name, this.effectLayer, fromX, fromY, width, height);
        node.getComponent(UITransform)!.setAnchorPoint(0.5, 0.2);
        node.setScale(scaleX, scaleY, 1);
        node.active = delay <= 0;
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = frames[0];
        this.projectileVisuals.push({
            node,
            delay,
            elapsed: 0,
            duration: Math.max(duration, 0.001),
            fromX,
            fromY,
            toX,
            toY,
            arcHeight,
            orientToPath: true,
            sprite: animate ? sprite : undefined,
            frames: animate ? frames : undefined,
            frameSeconds: animate ? ORIGINAL_EFFECT_FRAME_SECONDS : undefined,
        });
    }

    private addH06Projectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay: number,
    ): void {
        this.addRecoveredSpriteProjectile(
            'H19_S1', this.h06ProjectileFrames, 51, 54,
            fromX, fromY, toX, toY, duration, delay, -1.5, 1.5, 200, true,
        );
    }

    private addEnemyBoneProjectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay: number,
    ): void {
        const frames = this.enemyBoneProjectileFrame ? [this.enemyBoneProjectileFrame] : [];
        this.addRecoveredSpriteProjectile(
            'H31_S1', frames, 38, 20,
            fromX, fromY, toX, toY, duration, delay, -1, 1, 200,
        );
    }

    private addEnemyOrbProjectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay: number,
    ): void {
        const frames = this.enemyOrbProjectileFrame ? [this.enemyOrbProjectileFrame] : [];
        this.addRecoveredSpriteProjectile(
            'H30_S1', frames, 39, 40,
            fromX, fromY, toX, toY, duration, delay, 1, 1,
        );
    }

    private addH14Bomb(x: number, y: number): void {
        if (this.h14BombFrames.length === 0 || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H14_S1', this.effectLayer, x, y, 369, 245);
        node.getComponent(UITransform)!.setAnchorPoint(0.5, 0.2);
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.h14BombFrames[0];
        this.hitEffectVisuals.push({
            node,
            sprite,
            frames: this.h14BombFrames,
            frameSeconds: ORIGINAL_EFFECT_FRAME_SECONDS,
            elapsed: 0,
        });
    }

    private playH14HitAudio(): void {
        if (this.recoveredProjectileAudioSource && this.h14HitAudio) {
            this.recoveredProjectileAudioSource.playOneShot(this.h14HitAudio, 1);
        }
    }

    private addH17Ray(fromX: number, fromY: number, toX: number, toY: number): void {
        if (!this.h17RayData || !this.effectLayer?.isValid) return;
        const distance = Math.max(1, Math.hypot(toX - fromX, toY - fromY));
        const node = this.makeNode('H32_S1', this.effectLayer, fromX, fromY, 370, 90);
        node.angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI - 90;
        node.setScale(1.3, distance / 370 * 1.5, 1);
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.h17RayData;
        skeleton.setAnimation(0, 'idle', true);
        this.projectileVisuals.push({
            node,
            delay: 0,
            elapsed: 0,
            duration: 2,
            fromX,
            fromY,
            toX: fromX,
            toY: fromY,
        });
    }

    private addM10Projectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
        delay: number,
    ): void {
        if (!this.m10ProjectileData || !this.effectLayer?.isValid) return;
        const node = this.makeNode('M10_S1', this.effectLayer, fromX, fromY, 128, 64);
        node.setScale(-1, 1, 1);
        node.active = delay <= 0;
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.m10ProjectileData;
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
            arcHeight: 500,
            orientToPath: true,
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

    private preloadH13Impact(): void {
        resources.load('spine/H13Impact/baomihua_hill', sp.SkeletonData, (error, data) => {
            if (!error && data) this.h13ImpactData = data;
        });
    }

    private addH13Impact(x: number, y: number): void {
        if (!this.h13ImpactData || !this.backgroundEffectLayer?.isValid) return;
        const node = this.makeNode('H13_S1_LOWER', this.backgroundEffectLayer, x, y, 280, 288);
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.h13ImpactData;
        skeleton.setCompleteListener(() => {
            if (node.isValid) node.destroy();
        });
        skeleton.setAnimation(0, 'pskill01', false);
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
            frameSeconds: ORIGINAL_EFFECT_FRAME_SECONDS,
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
            frameSeconds: ORIGINAL_EFFECT_FRAME_SECONDS,
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
                frameSeconds: ORIGINAL_EFFECT_FRAME_SECONDS,
                elapsed: 0,
            });
        }
        if (this.h0905AudioSource && this.h0905HitAudio) {
            this.h0905AudioSource.playOneShot(this.h0905HitAudio, 1);
        }
    }

    private preloadLateFusionPresentation(): void {
        this.h1005AudioSource = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
        resources.load('spine/H1005Projectile/js_feidieshu_dandao', sp.SkeletonData, (error, data) => {
            if (!error && data) this.h1005ProjectileData = data;
        });
        resources.load('spine/H1005Nuke/hedang', sp.SkeletonData, (error, data) => {
            if (!error && data) this.h1005NukeData = data;
        });
        resources.load('original/bullet_hedan', AudioClip, (error, clip) => {
            if (!error && clip) this.h1005NukeAudio = clip;
        });
        resources.load('original/chilun_chuangzhangsha/spriteFrame', SpriteFrame, (error, sourceFrame) => {
            if (error || !sourceFrame) return;
            const specs = [
                { rect: new Rect(132, 208, 65, 9), offset: new Vec2(-58, -102) },
                { rect: new Rect(1, 208, 129, 43), offset: new Vec2(-67, -85) },
                { rect: new Rect(1048, 146, 157, 99), offset: new Vec2(-81, -57) },
                { rect: new Rect(972, 1, 155, 143), offset: new Vec2(-72, -35) },
                { rect: new Rect(809, 1, 161, 179), offset: new Vec2(-61, -17) },
                { rect: new Rect(636, 1, 171, 205), offset: new Vec2(-48, -4) },
                { rect: new Rect(445, 1, 189, 205), offset: new Vec2(-48, -4) },
                { rect: new Rect(230, 1, 213, 205), offset: new Vec2(-35, -4) },
                { rect: new Rect(1, 1, 227, 205), offset: new Vec2(-31, -4) },
                { rect: new Rect(1129, 1, 233, 117), offset: new Vec2(-22, -48) },
                { rect: new Rect(1207, 202, 219, 47), offset: new Vec2(-30, -83) },
                { rect: new Rect(1364, 70, 231, 55), offset: new Vec2(-18, -79) },
                { rect: new Rect(1364, 1, 233, 67), offset: new Vec2(-26, -73) },
                { rect: new Rect(809, 182, 237, 67), offset: new Vec2(-24, -73) },
                { rect: new Rect(1412, 127, 185, 73), offset: new Vec2(24, -70) },
                { rect: new Rect(1207, 127, 203, 73), offset: new Vec2(22, -70) },
            ];
            this.h1505HitFrames = specs.map((spec) => {
                const frame = new SpriteFrame();
                frame.reset({
                    texture: sourceFrame.texture,
                    rect: spec.rect,
                    originalSize: new Size(351, 213),
                    offset: spec.offset,
                });
                return frame;
            });
        });
    }

    private addH1005Projectile(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        duration: number,
    ): void {
        if (!this.h1005ProjectileData || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H27_S1', this.effectLayer, fromX, fromY, 128, 200);
        node.angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.h1005ProjectileData;
        skeleton.setAnimation(0, 'idle', true);
        this.projectileVisuals.push({
            node,
            delay: 0,
            elapsed: 0,
            duration: Math.max(duration, 0.001),
            fromX,
            fromY,
            toX,
            toY,
        });
    }

    private addH1005Nuke(): void {
        if (!this.h1005NukeData || !this.backgroundEffectLayer?.isValid) return;
        const previous = this.backgroundEffectLayer.getChildByName('H27_S2_LOWER');
        if (previous?.isValid) previous.destroy();
        // BombUnit's recovered "middle" path fixes the model at (0, -160) on
        // the under-unit layer while its five global hits resolve at 1s steps.
        const node = this.makeNode('H27_S2_LOWER', this.backgroundEffectLayer, 0, -160, 784, 693);
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.h1005NukeData;
        skeleton.setAnimation(0, 'idle', true);
        this.scheduleOnce(() => {
            if (node.isValid) node.destroy();
        }, 5.1);
    }

    private playH1005NukeHitAudio(): void {
        if (this.h1005AudioSource && this.h1005NukeAudio) {
            this.h1005AudioSource.playOneShot(this.h1005NukeAudio, 1);
        }
    }

    private addH1505Impact(x: number, y: number): void {
        if (this.h1505HitFrames.length === 0 || !this.effectLayer?.isValid) return;
        const node = this.makeNode('H15_S1', this.effectLayer, x, y, 351, 213);
        node.getComponent(UITransform)!.setAnchorPoint(0.5, 0.2);
        const sprite = node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.h1505HitFrames[0];
        this.hitEffectVisuals.push({
            node,
            sprite,
            frames: this.h1505HitFrames,
            frameSeconds: ORIGINAL_EFFECT_FRAME_SECONDS,
            elapsed: 0,
        });
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

    private addDevelopedGridReward(): void {
        if (this.prepareLayer.getChildByName('DevelopedGridReward')) return;
        const reward = this.makeNode('DevelopedGridReward', this.prepareLayer, -298, -283, 104, 132);
        // BagLikeView binds UI10025/zhandou_sg1 to adGridBtn.modelNode.
        this.attachPreparationButtonGlow(
            reward,
            'spine/PreparationGlowSg1/zhandou_sg1',
            'GridRewardGlow_UI10025',
        );
        const tile = this.makeNode('GridRewardTile', reward, 0, 0, 56, 56);
        const graphics = tile.addComponent(Graphics);
        graphics.fillColor = new Color(151, 156, 189, 255);
        graphics.strokeColor = new Color(49, 45, 66, 255);
        graphics.lineWidth = 4;
        graphics.roundRect(-28, -28, 56, 56, 8);
        graphics.fill();
        graphics.stroke();
        const question = this.makeLabel('GridRewardQuestion', tile, 0, 0, 48, 48, '?', 32, new Color(56, 55, 70, 255));
        this.applyOriginalOutline(question, new Color(222, 224, 239, 255), 1);
        const ticket = this.makeNode('GridRewardTicket', reward, -28, 42, 34, 28);
        this.attachRecoveredAtlasSprite(ticket, 'original/item/spriteFrame', ITEM_ATLAS_FRAMES.adTicket);
        const count = this.makeLabel('GridRewardCount', reward, 19, 41, 48, 28, '×3', 19, WHITE);
        this.applyOriginalOutline(count, new Color(0, 0, 0, 255), 2);
        const title = this.makeLabel('GridRewardTitle', reward, 0, -47, 104, 30, '获取格子', 20, WHITE);
        this.applyOriginalOutline(title, new Color(0, 0, 0, 255), 3);
    }

    private attachPreparationButtonGlow(parent: Node, resourcePath: string, name: string): void {
        resources.load(resourcePath, sp.SkeletonData, (error, data) => {
            if (error || !data || !parent.isValid || parent.getChildByName(name)) return;
            const glow = this.makeNode(name, parent, 0, 0, 164, 124);
            glow.setSiblingIndex(0);
            const skeleton = glow.addComponent(sp.Skeleton);
            skeleton.skeletonData = data;
            skeleton.premultipliedAlpha = false;
            try {
                skeleton.setAnimation(0, 'idle', true);
            } catch {
                // Preserve the recovered setup pose if a reduced runtime cannot
                // expose the Spine 3.8.99 animation during an import refresh.
            }
        });
    }

    private workerProgressRatio(gear: Gear): number {
        if (this.phase !== 'battle' || gear.location !== 'grid' || !GEARS[gear.id].powerPerTrigger) return 1;
        return Math.max(0, Math.min(1, gear.workerPower / 100));
    }

    private drawWorkerProgressBar(gear: Gear): void {
        const progressNode = gear.node.getChildByName('WorkerProgressBar');
        const visible = this.phase === 'battle' && gear.location === 'grid';
        if (progressNode) progressNode.active = visible;
        if (!visible) return;
        const graphics = progressNode?.getComponent(Graphics);
        if (!graphics) return;
        const ratio = this.workerProgressRatio(gear);
        graphics.clear();
        graphics.fillColor = new Color(19, 24, 35, 245);
        graphics.roundRect(-41, -7, 82, 14, 7);
        graphics.fill();
        graphics.strokeColor = CREAM;
        graphics.lineWidth = 2;
        graphics.roundRect(-40, -6, 80, 12, 6);
        graphics.stroke();
        if (ratio <= 0) return;
        graphics.fillColor = new Color(255, 205, 62, 255);
        graphics.roundRect(-37, -3, 74 * ratio, 6, 3);
        graphics.fill();
    }

    private beginGearDrag(gear: Gear, event: EventTouch): void {
        if (this.phase !== 'deploy') return;
        this.dragGear = gear;
        const touch = event.getUILocation();
        const localTouch = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(touch.x, touch.y, 0));
        this.dragTouchOffset = {
            x: localTouch.x - gear.node.position.x,
            y: localTouch.y - gear.node.position.y,
        };
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
        this.showFusionPartnerHints(gear);
    }

    private moveGearDrag(gear: Gear, event: EventTouch): void {
        if (this.dragGear !== gear || this.phase !== 'deploy') return;
        const p = event.getUILocation();
        const local = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(p.x, p.y, 0));
        gear.node.setPosition(local.x - this.dragTouchOffset.x, local.y - this.dragTouchOffset.y);
    }

    private endGearDrag(gear: Gear, event: EventTouch): void {
        if (this.dragGear !== gear) return;
        this.clearFusionPartnerHints();
        const p = event.getUILocation();
        const local = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(p.x, p.y, 0));
        const dropX = local.x - this.dragTouchOffset.x;
        const dropY = local.y - this.dragTouchOffset.y;
        gear.node.setPosition(dropX, dropY);
        const cell = this.positionToGrid(dropX, dropY);
        const config = GEARS[gear.id];
        const mergeTarget = this.findMergeTarget(gear, dropX, dropY);
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
        const dropResolution = config.gridUnlock ? null : resolveGridDrop({
            source: gear.location,
            movingUid: gear.uid,
            movingShape: this.gearShape(gear.id),
            target: cell,
            rows: GRID_ROWS,
            columns: GRID_COLS,
            unlocked: this.unlocked,
            reserved: gear.id === 'P01' ? new Set<number>() : new Set([this.currentPowerIndex()]),
            placed: this.gears.map((placed) => ({
                uid: placed.uid,
                row: placed.row,
                col: placed.col,
                shape: this.gearShape(placed.id),
            })),
            protectedPlacementUids: new Set(this.gears.filter((placed) => placed.id === 'P01').map((placed) => placed.uid)),
            invalidGridDrop: gear.id === 'P01' ? 'restore-origin' : 'return-to-candidate',
        });
        if (dropResolution?.kind === 'place') {
            const displacedUidSet = new Set(dropResolution.displacedUids);
            const displaced = this.gears.filter((placed) => displacedUidSet.has(placed.uid));
            this.returnGearsToCandidates(displaced);
            gear.row = dropResolution.row;
            gear.col = dropResolution.col;
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
            gear.rotationActive = false;
            gear.rotationElapsed = gear.rotationDuration;
            if (gear.id === 'P01') {
                for (const placed of this.gears) this.applyGearRotationPresentation(placed);
            } else {
                this.applyGearRotationPresentation(gear);
            }
            this.relayoutCandidates();
            this.tipLabel.string = displaced.length
                ? `${config.name}已替换 ${displaced.length} 个旧齿轮；旧齿轮已退回候选栏`
                : `${config.name}已手动摆入背包`;
        } else if (dropResolution?.kind === 'restore-origin') {
            gear.row = this.dragOrigin.row;
            gear.col = this.dragOrigin.col;
            gear.node.setPosition(this.dragOrigin.x, this.dragOrigin.y);
            this.tipLabel.string = gear.id === 'P01'
                ? '动力仓鼠需要放在已解锁的棋盘格内'
                : config.gridUnlock ? '扩展格必须完整落在未解锁区域' : '该形状无法放入此处，请换一个空位';
        } else if (dropResolution?.kind === 'return-to-candidate') {
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
        this.clearFusionPartnerHints();
        gear.row = this.dragOrigin.row;
        gear.col = this.dragOrigin.col;
        gear.node.setPosition(this.dragOrigin.x, this.dragOrigin.y);
        gear.node.setScale(this.dragOrigin.scale, this.dragOrigin.scale, 1);
        this.dragGear = null;
    }

    private clearFusionPartnerHints(): void {
        for (const gear of [...this.gears, ...this.candidates]) {
            gear.node.getChildByName('FusionPartnerHint')?.destroy();
        }
    }

    private showFusionPartnerHints(dragged: Gear): void {
        this.clearFusionPartnerHints();
        const stars = this.currentHeroStars();
        for (const target of [...this.gears, ...this.candidates]) {
            if (target === dragged) continue;
            const recipe = bagLikeFusionRecipe(dragged.id, target.id);
            if (!recipe) continue;
            const footprint = this.gearFootprint(target.id);
            const hint = this.makeNode(
                'FusionPartnerHint',
                target.node,
                (footprint.columns - 1) * GRID_CELL / 2,
                -(footprint.rows - 1) * GRID_CELL / 2,
                footprint.columns * GRID_CELL,
                footprint.rows * GRID_CELL,
            );
            const graphics = hint.addComponent(Graphics);
            const unlocked = bagLikeFusionRequirementsMet(recipe, stars);
            graphics.strokeColor = unlocked ? new Color(255, 223, 75, 255) : new Color(224, 102, 102, 255);
            graphics.lineWidth = 7;
            graphics.roundRect(
                -footprint.columns * GRID_CELL / 2 + 5,
                -footprint.rows * GRID_CELL / 2 + 5,
                footprint.columns * GRID_CELL - 10,
                footprint.rows * GRID_CELL - 10,
                18,
            );
            graphics.stroke();
            const missing = bagLikeFusionMissingRequirements(recipe, stars);
            const text = unlocked
                ? `可融合 → ${GEARS[recipe.resultId as GearId].name}`
                : `需 ${Object.keys(missing).map((heroId) => `${heroId} ${missing[heroId]}星`).join('、')}`;
            const label = this.makeLabel('FusionPartnerText', hint, 0, 0, 190, 42, text, 16, unlocked ? GOLD : WHITE);
            this.applyOriginalOutline(label, new Color(45, 25, 20, 255), 3);
            hint.setSiblingIndex(target.node.children.length - 1);
        }
    }

    private findMergeTarget(dragged: Gear, x: number, y: number): Gear | null {
        const possibleTargets = [...this.gears, ...this.candidates];
        let bestTarget: Gear | null = null;
        let bestScore = Number.POSITIVE_INFINITY;
        for (const target of possibleTargets) {
            if (target === dragged) continue;
            const sameFamilyMerge = target.id === dragged.id && Boolean(GEARS[dragged.id].nextId);
            const fusion = bagLikeFusionRecipe(dragged.id, target.id);
            if (!sameFamilyMerge && !fusion) continue;
            const score = gearMergeTargetScore(
                this.gearShape(dragged.id),
                x,
                y,
                dragged.node.scale.x,
                this.gearShape(target.id),
                target.node.position.x,
                target.node.position.y,
                target.node.scale.x,
                GRID_CELL,
            );
            if (score !== null && score < bestScore) {
                bestScore = score;
                bestTarget = target;
            }
        }
        return bestTarget;
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
        return placementCells(this.gearShape(id), row, col);
    }

    private gearShape(id: GearId): ReadonlyArray<readonly [number, number]> {
        return bagLikeProducerShape(id) || GEARS[id].shape;
    }

    private productionSources(): Array<{ uid: number; row: number; col: number; shape: ReadonlyArray<readonly [number, number]> }> {
        return this.gears.map((gear) => ({
            uid: gear.uid,
            row: gear.row,
            col: gear.col,
            shape: this.gearShape(gear.id),
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

    private currentPowerIndex(): number {
        const core = this.gears.find((gear) => gear.id === 'P01' && gear.location === 'grid');
        return core ? core.row * GRID_COLS + core.col : POWER_INDEX;
    }

    private canPlaceGear(id: GearId, row: number, col: number): boolean {
        return placementAreaValid(
            this.gearShape(id),
            row,
            col,
            GRID_ROWS,
            GRID_COLS,
            this.unlocked,
            id === 'P01' ? new Set<number>() : new Set([this.currentPowerIndex()]),
        );
    }

    private displacedGearsAt(moving: Gear, row: number, col: number): Gear[] {
        const displacedUids = new Set(displacedPlacementUids(
            this.gears.map((gear) => ({
                uid: gear.uid,
                row: gear.row,
                col: gear.col,
                shape: this.gearShape(gear.id),
            })),
            moving.uid,
            this.gearShape(moving.id),
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
            gear.rotationActive = false;
            gear.rotationElapsed = gear.rotationDuration;
            this.applyGearRotationPresentation(gear);
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
        if (this.battleMode === 'endless') this.specialBattleElapsed += dt;

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
        this.refreshUnitPresentationOrder();
        this.stepFusionSkillHits(dt);
        this.stepPendingHits(dt);
        if (this.phase !== 'battle') return;

        const enemiesAlive = this.units.some((unit) => !unit.dead && unit.team === 'enemy');
        const outcome = resolveNormalBattleOutcome({
            homeHp: this.selfHp,
            scheduleComplete: this.spawnIndex >= round.times.length,
            enemiesAlive,
            clearTimer: this.clearTimer,
            dt,
        });
        if (this.battleMode === 'endless') {
            if (this.enemyHomeHp <= 0) {
                const livingGold = this.units
                    .filter((unit) => !unit.dead && unit.team === 'enemy')
                    .reduce((total, unit) => total + Math.max(0, unit.cfg.gold || 0), 0);
                let scheduledGold = 0;
                for (let index = this.spawnIndex; index < round.monsters.length; index += 1) {
                    scheduledGold += Math.max(0, UNITS[round.monsters[index]]?.gold || 0);
                }
                this.specialDropGold += livingGold + scheduledGold + this.enemyHomeGold;
                this.finishSpecialMode();
                return;
            }
            if (this.selfHp <= 0 || this.specialBattleElapsed >= 300
                || (this.spawnIndex >= round.times.length && !enemiesAlive)) {
                this.selfHp = Math.max(0, this.selfHp);
                this.finishSpecialMode();
                return;
            }
            return;
        }
        this.clearTimer = outcome.clearTimer;
        if (outcome.state === 'lost') {
            this.selfHp = 0;
            if (this.battleMode === 'daily') this.finishSpecialMode();
            else this.finish(false);
            return;
        }
        if (outcome.state === 'round-clear') this.completeRound();
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
        const roundStartBasisPoints = powerRoleRoundStartProductivityBasisPoints(this.powerRoleState, this.roundIndex + 1);
        const activeProductivityBasisPoints = this.powerRoleState.equippedRoleId === 'P03' && this.powerRoleActiveRemaining > 0
            ? powerRoleActiveBasisPoints(this.powerRoleState)
            : 0;
        const killProductivityBasisPoints = p04KillProductivityBasisPoints(
            this.powerRoleState,
            this.powerRoleKillProductivityStacks,
        );
        const productivity = applyBattlePower
            ? 1 + (this.powerSkillRemaining > 0 ? roundStartBasisPoints : 0) / 10000
                + activeProductivityBasisPoints / 10000
                + killProductivityBasisPoints / 10000
            : 1;
        const advanced = advancePowerCoreClock(
            { nextDirection: this.powerDirection, remainingSeconds: this.powerTimer },
            dt,
            (direction) => connectedGearUidsAtCoreSide(sources, core.uid, direction).length > 0,
            productivity,
        );
        this.powerDirection = advanced.state.nextDirection;
        this.powerTimer = advanced.state.remainingSeconds;
        this.powerCoreModelElapsed += Math.max(0, dt);
        this.applyPowerCorePresentation(core);
        this.powerContactCount += advanced.contacts.length;
        if (applyBattlePower) {
            this.powerSkillRemaining = Math.max(0, this.powerSkillRemaining - dt);
            this.powerRoleActiveRemaining = Math.max(0, this.powerRoleActiveRemaining - dt);
        }
        if (!applyBattlePower) return;
        for (const contact of advanced.contacts) {
            const triggeredUids = connectedGearUidsAtCoreSide(sources, core.uid, contact.direction);
            this.powerGearTriggerCount += triggeredUids.length;
            for (const uid of triggeredUids) {
                const gear = this.gears.find((item) => item.uid === uid);
                if (!gear) {
                    this.powerMissingGearCount += 1;
                    continue;
                }
                this.triggerGearRotation(gear, POWER_CONTACT_DELAY_SECONDS / productivity);
                const config = GEARS[gear.id];
                if (!config.powerPerTrigger) {
                    this.powerMissingConfigCount += 1;
                    continue;
                }
                this.workerApplyCount += 1;
                const powerPerTrigger = this.workerPowerPerTrigger(gear, config.powerPerTrigger);
                const result = applyWorkerPower(gear.workerPower, powerPerTrigger);
                gear.workerPower = result.value;
                if (result.completed) this.queueProduction(gear);
            }
        }
    }

    private triggerGearRotation(gear: Gear, durationSeconds: number): void {
        if (gear.location !== 'grid' || gear.id === 'P01') return;
        gear.rotationElapsed = 0;
        gear.rotationDuration = Math.max(0.01, durationSeconds);
        gear.rotationActive = true;
        gear.rotationTriggerCount += 1;
        this.applyGearRotationPresentation(gear);
    }

    private stepGearRotations(dt: number): void {
        for (const gear of this.gears) {
            if (!gear.rotationActive) continue;
            gear.rotationElapsed = Math.min(gear.rotationDuration, gear.rotationElapsed + Math.max(0, dt));
            if (gear.rotationElapsed >= gear.rotationDuration) gear.rotationActive = false;
            this.applyGearRotationPresentation(gear);
        }
    }

    private applyGearRotationPresentation(gear: Gear): void {
        if (gear.id === 'P01') {
            this.applyPowerCorePresentation(gear);
            return;
        }
        const shape = this.gearShape(gear.id);
        const activeProgress = gear.rotationActive && gear.rotationDuration > 0
            ? Math.min(1, gear.rotationElapsed / gear.rotationDuration)
            : 1;
        for (const [shapeRow, shapeCol] of shape) {
            const rotor = gear.node.getChildByName(`GearRotor_${shapeRow}_${shapeCol}`);
            if (!rotor) continue;
            if (gear.location === 'grid') {
                const gridIndex = (gear.row + shapeRow) * GRID_COLS + gear.col + shapeCol;
                rotor.angle = gearRotationAngleDegrees(
                    gridIndex,
                    this.currentPowerIndex(),
                    gear.rotationElapsed,
                    gear.rotationDuration,
                );
            } else {
                rotor.angle = 0;
            }
            const glow = rotor.getChildByName('GearPowerGlow')?.getComponent(Sprite);
            if (glow) {
                const glowAlpha = gear.rotationActive
                    ? Math.round(12 + 36 * Math.sin(Math.PI * activeProgress))
                    : 0;
                glow.color = new Color(255, 226, 104, glowAlpha);
            }
        }
    }

    private applyPowerCorePresentation(core: Gear): void {
        const rotor = core.node.getChildByName('PowerCoreRotor');
        if (rotor) {
            rotor.angle = this.phase === 'battle'
                ? powerCoreBattleRotationAngleDegrees(this.powerCoreModelElapsed)
                : 0;
        }
        const hamster = core.node.getChildByName('PowerCoreHamster');
        if (hamster) {
            if (this.phase !== 'battle') {
                hamster.setPosition(0, 7);
                hamster.setScale(1, 1, 1);
                return;
            }
            const phase = this.powerCoreModelElapsed * Math.PI * 2 / 0.58;
            hamster.setPosition(Math.sin(phase * 0.5) * 1.5, 7 + Math.sin(phase) * 4);
            const squash = Math.sin(phase + Math.PI / 2) * 0.025;
            hamster.setScale(1 + squash, 1 - squash, 1);
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
        const outputCount = this.battleMode === 'daily'
            ? dailyProductionCount(this.dailyBuffIds, tower, this.battleRandom)
            : 1;
        for (let index = 0; index < outputCount; index += 1) {
            this.productionJobs.push({
                timer: WORKER_COMPLETE_ANIMATION_SECONDS + (tower ? 0 : HAMSTER_SPAWN_FLIGHT_SECONDS) + index * 0.08,
                gear,
                kind: tower ? 'tower' : 'hamster',
            });
        }
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
        if (unit.enemySpecialCooldown > 0) unit.enemySpecialCooldown = Math.max(0, unit.enemySpecialCooldown - dt);
        if (unit.fusionActiveCooldown > 0) unit.fusionActiveCooldown = Math.max(0, unit.fusionActiveCooldown - dt);
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
            unit.fusionActiveCastRemaining = 0;
            unit.frozen = Math.max(0, unit.frozen - dt);
            this.playAnimation(unit, 'idle', true);
            return;
        }
        if (unit.enemySpecialCasting) {
            this.stepEnemySpecialCast(unit, dt);
            return;
        }
        if (unit.fusionActiveCastRemaining > 0) {
            unit.fusionActiveCastRemaining = Math.max(0, unit.fusionActiveCastRemaining - dt);
            if (unit.fusionActiveCastRemaining === 0) this.playAnimation(unit, 'idle', true);
            this.applyStationaryHeroSeparation(unit, separation);
            return;
        }
        if (unit.barrageCasting) {
            unit.cooldown -= dt;
            this.stepH02BarrageCast(unit, dt);
            this.applyStationaryHeroSeparation(unit, separation);
            return;
        }
        if (unit.laserCasting) {
            unit.cooldown -= dt;
            this.stepH03LaserCast(unit, dt);
            this.applyStationaryHeroSeparation(unit, separation);
            return;
        }
        unit.cooldown -= dt;
        const opponents = this.units.filter((candidate) => !candidate.dead && candidate.team !== unit.team);
        const targetingOpponents = unit.team === 'enemy' && unit.cfg.focusHome ? [] : opponents;
        if (unit.team === 'enemy' && this.tryBeginEnemySpecial(unit, opponents)) return;
        if (unit.team === 'self' && this.tryBeginFusionActive(unit, opponents)) {
            this.applyStationaryHeroSeparation(unit, separation);
            return;
        }
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
                this.applyStationaryHeroSeparation(unit, separation);
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
                this.applyStationaryHeroSeparation(unit, separation);
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
                    this.applyStationaryHeroSeparation(unit, separation);
                    return;
                }
            }
        }

        const enemyHome = { x: unit.team === 'self' ? BATTLEFIELD_HOME_X : -BATTLEFIELD_HOME_X, y: 0 };
        const intent = resolveTargetingIntent(
            unit,
            targetingOpponents,
            unit.cfg.searchRange,
            unit.cfg.range,
            unit.cfg.moveSpeed * dt,
            enemyHome,
            unit.team === 'enemy' || (unit.team === 'self' && this.battleMode === 'endless'),
        );
        if (intent.attackTarget || intent.attackHome) {
            if (unit.cooldown <= 0) {
                this.beginAttack(unit, intent.target, intent.attackHome ? (unit.team === 'self' ? 'enemy' : 'self') : null);
            }
            this.playAnimation(unit, 'idle', true);
            this.applyStationaryHeroSeparation(unit, separation);
            return;
        }

        unit.x += intent.moveX + separation.x;
        unit.y += intent.moveY + separation.y;
        unit.node.setPosition(unit.x, unit.y);
        this.playAnimation(unit, intent.moveX || intent.moveY ? 'run' : 'idle', true);
    }

    private applyStationaryHeroSeparation(
        unit: BattleUnit,
        separation: Readonly<{ x: number; y: number }>,
    ): void {
        // In the recovered ActorUnit.updatePos path, envVec is still applied
        // when updateAI has no main movement vector (for example while the
        // hero is attacking or casting). Keeping that displacement prevents a
        // stationary front line from permanently pinning the moving units
        // behind it. Frozen units return before this path, matching canMove().
        if (unit.team !== 'self' || (!separation.x && !separation.y)) return;
        unit.x += separation.x;
        unit.y += separation.y;
        unit.node.setPosition(unit.x, unit.y);
    }

    private tryBeginFusionActive(unit: BattleUnit, opponents: BattleUnit[]): boolean {
        const profile = unit.cfg.fusionActive;
        if (!profile || unit.fusionActiveCooldown > 0 || opponents.length === 0) return false;
        const target = selectNearestBattlefieldTarget(unit, opponents, profile.castingRange);
        if (!target) return false;
        unit.fusionActiveCooldown = profile.cooldownSeconds;
        unit.fusionActiveCastRemaining = profile.castTimeSeconds;
        this.fusionActiveCastCount += 1;
        const launchAttack = this.effectiveAttack(unit);
        for (const step of profile.steps) {
            this.pendingFusionSkillHits.push({
                timer: step.delaySeconds,
                attacker: unit,
                profile,
                effectRatio: step.effectRatio,
                target,
                launchAttack,
            });
        }
        if (profile.skillId === '10001_2') this.addH1005Nuke();
        this.playAnimation(unit, profile.skillId === '12001_2' ? 'laser' : 'attack', false);
        return true;
    }

    private stepFusionSkillHits(dt: number): void {
        for (const hit of this.pendingFusionSkillHits) hit.timer -= dt;
        const ready = this.pendingFusionSkillHits.filter((hit) => hit.timer <= 0);
        this.pendingFusionSkillHits = this.pendingFusionSkillHits.filter((hit) => hit.timer > 0);
        for (const hit of ready) {
            if (hit.attacker.dead && hit.profile.targeting !== 'global') continue;
            if (hit.profile.skillId === '10001_2') this.playH1005NukeHitAudio();
            const opponents = this.units.filter((unit) => !unit.dead && unit.team !== hit.attacker.team);
            const targets = hit.profile.targeting === 'global'
                ? opponents
                : selectH03LaserTargets(
                    hit.attacker,
                    hit.target,
                    opponents,
                    hit.profile.width,
                    hit.profile.height,
                    999,
                );
            for (const target of targets) {
                this.damageUnit(
                    target,
                    this.calculateDamage(hit.attacker, target.cfg, hit.effectRatio, hit.launchAttack),
                    hit.attacker,
                );
                this.fusionActiveHitCount += 1;
            }
            this.addTrace(hit.attacker, hit.target.x, hit.target.y);
        }
    }

    private tryBeginEnemySpecial(unit: BattleUnit, opponents: BattleUnit[]): boolean {
        if (unit.enemySpecialCooldown > 0 || opponents.length === 0) return false;
        let target: BattleUnit | null = null;
        if (unit.cfg.assassinate) {
            target = selectFarthestEnemySkillTarget(unit, opponents, unit.cfg.searchRange);
            if (!target || battlefieldDistance(unit, target) < unit.cfg.range) return false;
            unit.enemySpecialCooldown = unit.cfg.assassinateCooldown || 20;
        } else if (unit.cfg.enemySpecialAttack) {
            target = selectNearestBattlefieldTarget(unit, opponents, 150);
            if (!target) return false;
            unit.enemySpecialCooldown = unit.cfg.enemySpecialCooldown || 5;
        } else {
            return false;
        }
        unit.enemySpecialCasting = true;
        unit.enemySpecialElapsed = 0;
        unit.enemySpecialBehaviorTriggered = false;
        unit.enemySpecialTarget = target;
        // The recovered special animation names remain presentation backlog for
        // fallback-rendered enemies; the simulation uses the common attack pose.
        this.playAnimation(unit, 'attack', false);
        return true;
    }

    private stepEnemySpecialCast(unit: BattleUnit, dt: number): void {
        const behaviorDelay = unit.cfg.assassinate ? 0.3 : unit.cfg.enemySpecialBehaviorDelay || 0.3;
        const castTime = unit.cfg.assassinate ? 1 : unit.cfg.enemySpecialCastTime || 1.5;
        const advance = advanceEnemySpecialCast(
            { elapsed: unit.enemySpecialElapsed, behaviorTriggered: unit.enemySpecialBehaviorTriggered },
            dt,
            behaviorDelay,
            castTime,
        );
        unit.enemySpecialElapsed = advance.elapsed;
        unit.enemySpecialBehaviorTriggered = advance.behaviorTriggered;
        if (advance.triggerBehavior) this.resolveEnemySpecial(unit);
        if (!advance.complete) return;
        unit.enemySpecialCasting = false;
        unit.enemySpecialElapsed = 0;
        unit.enemySpecialTarget = null;
        this.playAnimation(unit, 'idle', true);
    }

    private resolveEnemySpecial(unit: BattleUnit): void {
        const target = unit.enemySpecialTarget;
        if (unit.cfg.assassinate) {
            if (!target || target.dead) return;
            const destination = assassinateDestination(unit, target, unit.cfg.assassinateDistance || 45);
            unit.x = destination.x;
            unit.y = destination.y;
            unit.node.setPosition(unit.x, unit.y);
            this.damageUnit(target, this.calculateDamage(unit, target.cfg, 10000), unit);
            this.addTrace(unit, target.x, target.y);
            return;
        }
        if (!unit.cfg.enemySpecialAttack || !target) return;
        const opponents = this.units.filter((candidate) => !candidate.dead && candidate.team !== unit.team);
        const victims = unit.cfg.enemySpecialAttack === 'line'
            ? selectH03LaserTargets(
                unit,
                target,
                opponents,
                unit.cfg.enemySpecialWidth || 150,
                unit.cfg.enemySpecialHeight || 500,
                999,
            )
            : opponents.filter((candidate) =>
                Math.hypot(candidate.x - unit.x, candidate.y - unit.y) <= (unit.cfg.enemySpecialRadius || 150),
            );
        for (const victim of victims) {
            this.damageUnit(
                victim,
                this.calculateDamage(unit, victim.cfg, unit.cfg.enemySpecialEffectRatio || 15000),
                unit,
            );
        }
        this.addTrace(unit, target.x, target.y);
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
                        (target.shieldWallRemaining > 0 ? target.shieldWall?.damageResistance || 0 : 0)
                            + this.dailyModeDamageResistance(unit, target),
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
        const primaryBullet = unit.cfg.fusionPrimaryBullet;
        const launchX = unit.x + (primaryBullet?.launchOffsetX || 0);
        const launchY = unit.y + (primaryBullet?.launchOffsetY || 0);
        const homeTargetX = targetHome === 'enemy' ? BATTLEFIELD_HOME_X : -BATTLEFIELD_HOME_X;
        const travelDistance = target
            ? Math.hypot(target.x - launchX, target.y - launchY)
            : targetHome
              ? Math.hypot(homeTargetX - launchX, launchY)
              : 0;
        // Type 11 has no version-18 BulletType factory case and falls through
        // to BulletUnit: fixed launch direction, cfg.speed, and a path ending
        // about 20 units before the target's launch position.
        const travelTime = primaryBullet
            ? Math.max(0, travelDistance - primaryBullet.stopShortDistance) / primaryBullet.speed
            : unit.cfg.projectileSpeed ? travelDistance / unit.cfg.projectileSpeed : 0;
        const behaviorDelay = attackBehaviorDelaySeconds(unit.cfg.attackDelay, attrs.attackSpeed);
        const primaryTravelRatio = primaryBullet && travelDistance > 0
            ? Math.max(0, travelDistance - primaryBullet.stopShortDistance) / travelDistance
            : 1;
        const impactX = target
            ? launchX + (target.x - launchX) * primaryTravelRatio
            : targetHome ? homeTargetX : launchX;
        const impactY = target
            ? launchY + (target.y - launchY) * primaryTravelRatio
            : -10;
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
        const hitDelays = unit.cfg.multiHitDelays && unit.cfg.multiHitDelays.length > 0
            ? unit.cfg.multiHitDelays
            : [behaviorDelay];
        if (primaryBullet && target) this.h10PrimaryBulletCastCount += 1;
        for (const hitDelay of hitDelays) {
            this.pendingHits.push({
                timer: hitDelay + travelTime,
                attacker: unit,
                target,
                targetHome,
                fromX: launchX,
                fromY: launchY,
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
        }
        if (unit.cfg.id === 'H09' && target && travelTime > 0) {
            this.addH0905Projectile(unit.x, unit.y, impactX, impactY, travelTime, behaviorDelay);
        }
        if (unit.cfg.id === 'H10' && target && travelTime > 0) {
            this.addH1005Projectile(launchX, launchY, impactX, impactY, travelTime);
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
        if (unit.cfg.id === 'H0601' && travelTime > 0) {
            this.addH06Projectile(launchX, launchY, impactX, impactY, travelTime, behaviorDelay);
        }
        if (unit.cfg.id === 'H1401' && (target || targetHome)) {
            // BombUnit places H14_S1 at the target immediately; its behavior and
            // hit sound resolve after the recovered 300 ms delay.
            this.addH14Bomb(impactX, impactY);
        }
        if (unit.cfg.id === 'H1701' && (target || targetHome)) {
            // RayUnit lives for the full 2 s MissileConfig timeLimit while its
            // six behaviors resolve at 0/330/660/1000/1300/1400 ms.
            this.addH17Ray(launchX, launchY, impactX, impactY);
        }
        if ((unit.cfg.id === 'M03' || unit.cfg.id === 'Boss03') && travelTime > 0) {
            this.addEnemyBoneProjectile(launchX, launchY, impactX, impactY, travelTime, behaviorDelay);
        }
        if ((unit.cfg.id === 'M09' || unit.cfg.id === 'Boss09') && travelTime > 0) {
            this.addEnemyOrbProjectile(launchX, launchY, impactX, impactY, travelTime, behaviorDelay);
        }
        if ((unit.cfg.id === 'M10' || unit.cfg.id === 'Boss10') && travelTime > 0) {
            this.addM10Projectile(launchX, launchY, impactX, impactY, travelTime, behaviorDelay);
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
                const primaryBullet = hit.attacker.cfg.fusionPrimaryBullet;
                const targets = primaryBullet
                    ? selectH03LaserTargets(
                        { x: hit.impactX, y: hit.impactY },
                        hit.target,
                        this.units.filter((unit) => !unit.dead && unit.team !== hit.attacker.team),
                        primaryBullet.width,
                        primaryBullet.height,
                        999,
                    )
                    : hit.areaRadius > 0
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
                        (target.shieldWallRemaining > 0 ? target.shieldWall?.damageResistance || 0 : 0)
                            + this.dailyModeDamageResistance(hit.attacker, target),
                    );
                    const counterattack = h04ShieldWallCounterattackDamage(
                        damage.rawValue,
                        target.shieldWall?.counterattackRatio || 0,
                        target.shieldWallRemaining > 0 && !hit.attacker.dead,
                    );
                    if (counterattack > 0) this.damageUnit(hit.attacker, counterattack, target);
                    this.damageUnit(target, damage.value, hit.attacker);
                    if (primaryBullet) this.h10PrimaryBulletHitCount += 1;
                    if (!target.dead && hit.attacker.cfg.knockbackDistance) {
                        const direction = hit.attacker.team === 'enemy' ? -1 : 1;
                        target.x += direction * hit.attacker.cfg.knockbackDistance;
                        target.x = Math.max(-HOME_X + 55, Math.min(HOME_X - 55, target.x));
                        target.node.setPosition(target.x, target.y);
                    }
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
                if (hit.attacker.cfg.id === 'H1301') this.addH13Impact(centerX, centerY);
                if (hit.attacker.cfg.id === 'H1401') this.playH14HitAudio();
                if (hit.attacker.cfg.id === 'H1201') this.playH12HitAudio();
                if (hit.target && hit.bounceMaxTimes > 0) this.queueBounceHit(hit);
                if (warriorCombo && (hit.countsAsWarriorAttack || warriorCriticalConsumed)) {
                    this.completeWarriorAttack(hit.attacker, warriorCombo, warriorCriticalConsumed);
                }
                if (
                    ['H09', 'H0201', 'H0301', 'H07', 'H08', 'H1201', 'H1301'].indexOf(hit.attacker.cfg.id) < 0
                    && !RECOVERED_PROJECTILE_PRESENTATION_IDS.has(hit.attacker.cfg.id)
                ) {
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
                if (hit.targetHome === 'enemy') this.enemyHomeHp -= damage;
                else this.selfHp -= damage;
                if (hit.attacker.cfg.selfDestructRadius && !hit.attacker.dead) {
                    // ZB_1701 completes by killing its caster; the ConType_14
                    // death behavior is the single 10000-ratio home hit above.
                    // It does not add a second area hit to nearby heroes.
                    this.killUnit(hit.attacker);
                }
                const x = hit.targetHome === 'enemy' ? HOME_X - 20 : -HOME_X + 20;
                this.addDamageText(damage, x, -15);
                if (hit.attacker.cfg.id === 'H1401') this.playH14HitAudio();
                if (!RECOVERED_PROJECTILE_PRESENTATION_IDS.has(hit.attacker.cfg.id)) {
                    this.addTrace(hit.attacker, x, -10);
                }
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
        const dailyResistance = this.battleMode === 'daily' && targetConfig && attacker.team === 'self'
            ? dailyEnemyDamageResistance(
                this.dailyBuffIds,
                attacker.cfg.attackType === 'WHEEL' ? 'WHEEL' : 'HAMSTER',
                targetConfig.monsterType === 'ELITE',
            )
            : 0;
        return this.calculateDamageResult(attacker, targetConfig, effectRatio, attack, false, 0, dailyResistance).value;
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
        const roleAttackBasisPoints = powerRoleGlobalAttackBasisPoints(this.powerRoleState)
            + (this.powerRoleState.equippedRoleId === 'P02' && this.powerRoleActiveRemaining > 0
                ? powerRoleActiveBasisPoints(this.powerRoleState)
                : 0);
        return unit.atk * (1 + roleAttackBasisPoints / 10000) * warriorKillAttackMultiplier(
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
            if (target.team === 'enemy' && attacker) {
                this.completeWarriorKill(attacker);
                const h15Coins = bagLikeH15KillCoins(attacker.cfg.id, true);
                this.gold += h15Coins;
                this.h15KillCoinsEarned += h15Coins;
            }
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
        // A dead unit stops participating in combat immediately, so its combat-only
        // presentation must disappear immediately as well. Keep just the body node
        // alive for the short death animation.
        this.hideUnitHp(unit);
        if (unit.shadow.isValid) unit.shadow.active = false;
        const dyingNode = unit.node;
        this.dyingUnitNodes.add(dyingNode);
        this.playAnimation(unit, 'die', false);
        this.scheduleOnce(() => {
            this.dyingUnitNodes.delete(dyingNode);
            if (dyingNode.isValid) dyingNode.destroy();
        }, 0.42);
        this.units = this.units.filter((item) => item.uid !== unit.uid);
        this.pendingHits = this.pendingHits.filter((hit) => hit.projectile || (hit.attacker.uid !== unit.uid && hit.target?.uid !== unit.uid));
        if (unit.team === 'enemy') {
            this.powerRoleEnergy = addPowerRoleEnergy(this.powerRoleEnergy, unit.cfg.exp || 0);
            this.addExperience(unit.cfg.exp || 0);
            if (this.battleMode === 'endless') {
                this.specialKillCount += 1;
                this.specialDropGold += Math.max(0, unit.cfg.gold || 0);
            }
        }
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
        this.playMockAdvertisement('trait-reroll', () => this.completeTraitReroll(), (outcome) => {
            this.tipLabel.string = outcome === 'cancelled' ? '已取消广告，重抽次数未消耗' : '广告播放失败，重抽次数未消耗';
        });
    }

    private preloadP04Projectile(): void {
        resources.load('original/feibiao/feibiao/spriteFrame', SpriteFrame, (error, sourceFrame) => {
            if (error || !sourceFrame) return;
            const frame = new SpriteFrame();
            frame.reset({
                texture: sourceFrame.texture,
                rect: new Rect(1, 1, 288, 290),
                originalSize: new Size(300, 300),
                offset: new Vec2(0, 1),
            });
            this.p04ProjectileFrame = frame;
        });
    }

    private completeTraitReroll(): void {
        this.traitRerollsUsed += 1;
        this.drawNewTraitChoices(TRAIT_REROLL_MIN_QUALITY);
        this.renderTraitChoices();
    }

    private takeAllTraits(): void {
        if (this.traitTakeAllUsed >= TRAIT_TAKE_ALL_MAX) return;
        this.playMockAdvertisement('trait-take-all', () => this.completeTraitTakeAll(), (outcome) => {
            this.tipLabel.string = outcome === 'cancelled' ? '已取消广告，全选次数未消耗' : '广告播放失败，全选次数未消耗';
        });
    }

    private completeTraitTakeAll(): void {
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
        const randomChoices = drawWeightedTraits(
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
        const fixedChoices = minimumQuality === 0
            ? (this.staticBuffsByLevel.get(this.bagLikeLevel) || [])
                .map((id) => IMPLEMENTED_TRAIT_POOL.find((trait) => trait.id === id))
                .filter((trait): trait is TraitDefinition => Boolean(trait))
            : [];
        const fixedIds = new Set(fixedChoices.map((trait) => trait.id));
        this.currentTraitChoices = [
            ...fixedChoices,
            ...randomChoices.filter((trait) => !fixedIds.has(trait.id)),
        ].slice(0, 3);
    }

    private currentHeroStars(): Record<string, number> {
        return {
            ...this.accountProfile.stars,
            ...(this.validationHeroStarOverrides || {}),
        };
    }

    private dailyModeDamageResistance(attacker: BattleUnit, target: BattleUnit): number {
        if (this.battleMode !== 'daily' || attacker.team !== 'self' || target.team !== 'enemy') return 0;
        return dailyEnemyDamageResistance(
            this.dailyBuffIds,
            attacker.cfg.attackType === 'WHEEL' ? 'WHEEL' : 'HAMSTER',
            target.cfg.monsterType === 'ELITE',
        );
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
        if (!profile || profile.kind !== 'hamster' || !UNITS[model]) return;
        if (this.fusionValidationMode()) console.log(`[fusion-validation] spawning ${gear.id} as ${profile.modelId}`);
        const config: UnitConfig = {
            ...UNITS[model],
            productionGearId: profile.gearId,
            productionLevel: profile.level,
            productionSkillId: profile.primarySkillId,
            visualModelId: profile.modelId,
            spinePath: profile.spineResourcePath || UNITS[model].spinePath,
            spineScale: profile.modelScale || UNITS[model].spineScale,
        };
        const scales = this.producerAttributeScales(gear, profile, config);
        const validationSpawnY: Readonly<Record<string, number>> = {
            H0705: -95,
            H0805: 0,
            H0905: 95,
            H1005: -95,
            H1805: 95,
        };
        const spawnY = this.fusionValidationMode() ? (validationSpawnY[gear.id] || 0) : Math.random() * 150;
        this.createUnit('self', config, -300, spawnY, scales.attack, scales.hp);
        this.selfSpawnCount += 1;
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
            shadow: gear.node,
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
            enemySpecialCooldown: 0,
            enemySpecialCasting: false,
            enemySpecialElapsed: 0,
            enemySpecialBehaviorTriggered: false,
            enemySpecialTarget: null,
            fusionActiveCooldown: 0,
            fusionActiveCastRemaining: 0,
        };
        if (model === 'H1701') {
            // LS_1501 emits six recovered pulses through a 150 x 500 forward
            // rectangle. Wheel attacks originate at the player's battlefield
            // edge rather than at the backpack's UI-space gear coordinates.
            caster.x = -HOME_X + 55;
            caster.y = 0;
            const lineTargets = selectH03LaserTargets(caster, target, targets, 150, 500, 999);
            for (const lineTarget of lineTargets) this.beginAttack(caster, lineTarget, null);
            return;
        }
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
        if (model === 'H15') this.addH1505Impact(target.x, target.y);
        for (const unit of affected) {
            this.damageUnit(unit, this.calculateDamage(caster, unit.cfg, cfg.effectRatio), caster);
            if (!unit.dead && cfg.knockbackDistance) {
                unit.x = Math.min(HOME_X - 40, unit.x + cfg.knockbackDistance);
                unit.node.setPosition(unit.x, unit.y);
            }
        }
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
            attack: scales.attack
                * (config.atk > 0 ? starAttack / config.atk : 1)
                * (this.battleMode === 'daily' ? dailyHeroAttackMultiplier(this.dailyBuffIds, GEARS[gear.id].shape.length) : 1),
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
        const config = this.battleMode === 'daily'
            ? {
                ...base,
                moveSpeed: base.moveSpeed * dailyEnemyMoveMultiplier(this.dailyBuffIds),
                controlImmune: base.controlImmune || this.dailyBuffIds.indexOf('DI_DEBUFF_eff02') >= 0,
            }
            : base;
        const defeatScale = this.battleMode === 'normal' ? mechanicsFirstDefeatCompensation(this.failedAttempts) : 1;
        const atkScale = (this.levelAtkMultiple / 10000) * (round.atkMultiple / 10000) * defeatScale;
        const hpScale = (this.levelHpMultiple / 10000) * (round.hpMultiple / 10000) * defeatScale;
        const developedBattle = this.developedValidationMode() === 'battle';
        const fixtureY = DEVELOPED_BATTLE_SPAWN_Y[this.spawnIndex];
        const y = developedBattle && fixtureY !== undefined
            ? fixtureY
            : Math.random() * UNIT_Y_LIMIT * 2 - UNIT_Y_LIMIT;
        const xJitter = developedBattle ? 0 : 2 * (Math.random() - 0.5);
        const yJitter = developedBattle ? 0 : 2 * (Math.random() - 0.5);
        this.createUnit('enemy', config, HOME_X - 55 + xJitter, y + yJitter, atkScale, hpScale);
    }

    private createUnit(team: Team, cfg: UnitConfig, x: number, y: number, atkScale: number, hpScale: number): void {
        const node = this.makeNode(`${team}_${cfg.visualModelId || cfg.id}_${this.serial}`, this.unitLayer, x, y, 90, 110);
        if (team === 'enemy') node.setScale(-1, 1, 1);
        const shadow = this.makeNode('UnitShadow', node, 0, -43, cfg.boss ? 84 : 68, cfg.boss ? 28 : 22);
        shadow.setScale(1, cfg.boss ? 0.38 : 0.32, 1);
        const shadowGraphics = shadow.addComponent(Graphics);
        shadowGraphics.fillColor = new Color(29, 29, 38, cfg.boss ? 118 : 92);
        shadowGraphics.circle(0, 0, cfg.boss ? 39 : 32);
        shadowGraphics.fill();
        const fallbackNode = this.makeNode('FallbackUnit', node, 0, 0, 90, 110);
        const fallback = fallbackNode.addComponent(Graphics);
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
            shadow,
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
            enemySpecialCooldown: cfg.assassinatePreCooldown || cfg.enemySpecialPreCooldown || 0,
            enemySpecialCasting: false,
            enemySpecialElapsed: 0,
            enemySpecialBehaviorTriggered: false,
            enemySpecialTarget: null,
            fusionActiveCooldown: cfg.fusionActive?.initialCooldownSeconds || 0,
            fusionActiveCastRemaining: 0,
        };
        this.units.push(unit);
        this.loadSkeleton(unit);
        this.drawUnitHp(unit);
        this.refreshUnitPresentationOrder();
    }

    private refreshUnitPresentationOrder(): void {
        const living = this.units.filter((unit) => !unit.dead && unit.node.isValid);
        const byUid = new Map(living.map((unit) => [unit.uid, unit]));
        const order = unitPresentationBackToFront(living.map((unit) => ({ uid: unit.uid, y: unit.y })));
        for (let index = 0; index < order.length; index += 1) {
            byUid.get(order[index])?.node.setSiblingIndex(index);
        }
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
            unit.shadow.setSiblingIndex(0);
            skeletonNode.setSiblingIndex(2);
            unit.node.getChildByName('HpBar')?.setSiblingIndex(unit.node.children.length - 1);
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
        // The recovered controller removes every remaining bullet as soon as
        // victory is detected. EXP has already been emitted synchronously by
        // each monster death; round coin rewards wait for roundEnd one second
        // later.
        this.clearUnits();
        if (this.battleMode === 'normal') this.claimAccountRoundReward(this.roundIndex + 1);
        this.scheduleOnce(() => {
            const h15RoundCoins = bagLikeH15RoundEndCoins(this.gears.map((gear) => gear.id));
            this.gold += (this.roundCoinRewards[this.roundIndex] || 0) + h15RoundCoins;
            this.h15RoundCoinsEarned += h15RoundCoins;
            const completion = resolveNormalRoundCompletion(this.roundIndex, this.rounds.length);
            if (completion.state === 'won') {
                if (this.battleMode === 'daily') this.finishSpecialMode();
                else this.finish(true);
                return;
            }
            this.roundIndex = completion.roundIndex;
            this.phase = 'deploy';
            this.freeRefreshUsed = false;
            this.dealPreparationBatch();
            this.tipLabel.string = `进入第 ${this.roundIndex + 1} 波准备：新候选需手动摆放`;
            this.applyPhaseLayout();
        }, 1);
    }

    private revealResultActionsAfterSourceDelay(showNext: boolean): void {
        const version = ++this.resultRevealVersion;
        this.resultNextButtonLabel.node.parent!.active = showNext;
        this.resultActionsLayer.active = false;
        // BattleWinView/BattleFailView open immediately, then onUpdateRewards
        // reveals the buttons and rewards after GameTimer.once(MB), MB = 300 ms.
        this.scheduleOnce(() => {
            if (version !== this.resultRevealVersion || !this.resultLayer.active) return;
            if (this.phase !== 'won' && this.phase !== 'lost') return;
            this.resultActionsLayer.active = true;
        }, 0.3);
    }

    private finish(won: boolean): void {
        const validationOriginalProfile = this.battleMode === 'normal'
            ? this.longRunOriginalAccountProfile
            : null;
        if (won) {
            const completion = completeBagLikeAccountLevel(this.accountProfile, this.levelId);
            this.accountProfile = completion.profile;
            this.accountUnlockedThisAttempt = completion.unlocked;
            if (!validationOriginalProfile) this.persistAccountProfile(false);
        }
        this.failedAttempts = normalLevelFailedAttempts(this.failedAttempts, won);
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
            : `我方兵营已被摧毁\n下次敌军属性降至 ${Math.round(mechanicsFirstDefeatCompensation(this.failedAttempts) * 100)}%`;
        this.revealResultActionsAfterSourceDelay(won && this.levelId < BAGLIKE_LAST_LEVEL_ID);
        this.resultNextButtonLabel.string = this.levelId < BAGLIKE_LAST_LEVEL_ID
            ? `进入第 ${bagLikeLevelNumber(this.levelId + 1)} 关`
            : '全部通关';
        this.tipLabel.string = won ? `${this.levelName}已通关：${this.rounds.length} 波敌人全部清除` : '我方兵营被摧毁，调整齿轮后重试';
        if (validationOriginalProfile) {
            this.accountProfile = cloneBagLikeAccountProfile(validationOriginalProfile);
            this.longRunOriginalAccountProfile = null;
        }
    }

    private finishSpecialMode(): void {
        const mode = this.battleMode;
        if (mode === 'daily') {
            this.specialModeState = settleDailyChallenge(this.specialModeState, this.roundIndex);
        } else if (mode === 'endless') {
            this.specialModeState = settleEndlessChallenge(this.specialModeState, this.specialKillCount, this.specialDropGold);
            this.accountProfile = cloneBagLikeAccountProfile(this.longRunOriginalAccountProfile || this.accountProfile);
            this.accountProfile.gold += this.specialDropGold;
            this.persistAccountProfile(false);
        }
        if (mode === 'daily' && this.longRunOriginalAccountProfile) {
            this.accountProfile = cloneBagLikeAccountProfile(this.longRunOriginalAccountProfile);
            this.persistAccountProfile(false);
        }
        if (this.longRunOriginalPowerRoleState) {
            this.powerRoleState = this.clonePowerRoleState(this.longRunOriginalPowerRoleState);
        }
        this.longRunOriginalAccountProfile = null;
        this.longRunOriginalPowerRoleState = null;
        saveSpecialModeState(sys.localStorage, this.specialModeState);
        this.phase = 'won';
        this.paused = false;
        this.traitLayer.active = false;
        this.clearUnits();
        this.prepareLayer.active = false;
        this.resultLayer.active = true;
        if (mode === 'daily') {
            this.resultTitleLabel.string = '每日挑战结算';
            this.resultBodyLabel.string = `完成到第 ${Math.min(this.roundIndex + 1, this.rounds.length)} 波\n本次里程碑金币 +${(this.roundIndex + 1) * 500} · 今日累计 ${this.specialModeState.daily.dailyGold}`;
            this.tipLabel.string = '每日挑战次数与里程碑进度已保存';
        } else {
            this.resultTitleLabel.string = '无尽试炼结算';
            this.resultBodyLabel.string = `本次击杀 ${this.specialKillCount} · 获得金币 ${this.specialDropGold}\n历史最高：${this.specialModeState.endless.maxKillCount} 击杀 / ${this.specialModeState.endless.maxGold} 金币`;
            this.tipLabel.string = '无尽试炼按金币优先、同金币按击杀数更新纪录';
        }
        this.revealResultActionsAfterSourceDelay(false);
    }

    private clearUnits(): void {
        const unitNodes = new Set<Node>();
        for (const unit of this.units) {
            unit.dead = true;
            this.hideUnitHp(unit);
            unitNodes.add(unit.node);
        }
        for (const node of this.dyingUnitNodes) unitNodes.add(node);
        for (const node of unitNodes) {
            // Node.destroy() is deferred until the end of the frame. Deactivate it
            // first so round-clear/result screens cannot render one stale frame.
            if (!node.isValid) continue;
            node.active = false;
            node.destroy();
        }
        this.dyingUnitNodes.clear();
        this.units = [];
        this.pendingHits = [];
        this.pendingFusionSkillHits = [];
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
        this.addBattleNumberText(`${damage}`, x, y, 'white');
    }

    private addHealText(amount: number, x: number, y: number): void {
        this.addBattleNumberText(`+${amount}`, x, y, 'green');
    }

    private addBattleNumberText(value: string, x: number, y: number, palette: 'white' | 'green'): void {
        const node = this.makeNode(`BattleNumber_${this.serial}`, this.unitLayer, x, y, 100, 30);
        node.setScale(1.3, 1.3, 1);
        const sprites: Sprite[] = [];
        let fallbackLabel: Label | null = null;
        const atlasFrame = this.battleNumberAtlasFrame;
        if (atlasFrame) {
            const glyphs = Array.from(value);
            const advance = 22;
            const startX = (1 - glyphs.length) * advance * 0.5;
            glyphs.forEach((character, index) => {
                const glyph = BATTLE_NUMBER_GLYPHS[palette][character];
                if (!glyph) return;
                const glyphNode = this.makeNode(`Glyph_${character}_${index}`, node, startX + index * advance, 0, 22, 28);
                const frame = new SpriteFrame();
                frame.reset({
                    texture: atlasFrame.texture,
                    rect: glyph.rect,
                    originalSize: new Size(22, 28),
                    offset: glyph.offset,
                });
                const sprite = glyphNode.addComponent(Sprite);
                sprite.sizeMode = Sprite.SizeMode.CUSTOM;
                sprite.spriteFrame = frame;
                sprites.push(sprite);
            });
        } else {
            fallbackLabel = this.makeLabel('BitmapFontFallback', node, 0, 0, 100, 30, value, 24, palette === 'green' ? GREEN : WHITE);
        }
        this.floatingTexts.push({ node, sprites, fallbackLabel, elapsed: 0, startY: y });
    }

    private stepEffects(dt: number): void {
        for (const trace of this.traces) trace.life -= dt;
        this.traces = this.traces.filter((trace) => trace.life > 0);
        for (const floating of this.floatingTexts) {
            floating.elapsed += dt;
            // resources2/battleNum transition "t": move 46 px upward over 2/3 s
            // with QuadOut easing; begin a 0.7 s QuadOut fade at t=0.3 s.
            const moveProgress = Math.min(1, floating.elapsed / (2 / 3));
            const moveEase = 1 - (1 - moveProgress) * (1 - moveProgress);
            floating.node.setPosition(floating.node.position.x, floating.startY + 46 * moveEase);
            const fadeProgress = Math.max(0, Math.min(1, (floating.elapsed - 0.3) / 0.7));
            const alpha = Math.round((1 - fadeProgress) * (1 - fadeProgress) * 255);
            for (const sprite of floating.sprites) sprite.color = new Color(255, 255, 255, alpha);
            if (floating.fallbackLabel) {
                const color = floating.fallbackLabel.color;
                floating.fallbackLabel.color = new Color(color.r, color.g, color.b, alpha);
            }
            if (floating.elapsed >= 1 && floating.node.isValid) floating.node.destroy();
        }
        this.floatingTexts = this.floatingTexts.filter((floating) => floating.elapsed < 1);
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
            const controlY = Math.max(visual.fromY, visual.toY) + (visual.arcHeight || 0);
            const inverseProgress = 1 - progress;
            const visualY = visual.arcHeight
                ? inverseProgress * inverseProgress * visual.fromY
                  + 2 * inverseProgress * progress * controlY
                  + progress * progress * visual.toY
                : visual.fromY + (visual.toY - visual.fromY) * progress;
            visual.node.setPosition(
                visual.fromX + (visual.toX - visual.fromX) * progress,
                visualY,
            );
            if (visual.sprite && visual.frames?.length && visual.frameSeconds) {
                const frameIndex = Math.floor(visual.elapsed / visual.frameSeconds) % visual.frames.length;
                visual.sprite.spriteFrame = visual.frames[frameIndex];
            }
            if (visual.orientToPath) {
                const tangentX = visual.toX - visual.fromX;
                const tangentY = visual.arcHeight
                    ? 2 * inverseProgress * (controlY - visual.fromY)
                      + 2 * progress * (visual.toY - controlY)
                    : visual.toY - visual.fromY;
                visual.node.angle = Math.atan2(tangentY, tangentX) * 180 / Math.PI
                    + (visual.orientationOffsetDegrees || 0);
            }
            if (visual.angularSpeedDegrees) {
                visual.node.angle = visual.elapsed * visual.angularSpeedDegrees;
            }
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
        if (!unit.node.isValid || !unit.hpGraphics.isValid) return;
        const g = unit.hpGraphics;
        if (unit.dead || unit.hp <= 0) {
            this.hideUnitHp(unit);
            return;
        }
        g.node.active = true;
        g.clear();
        const ratio = Math.max(0, unit.hp / unit.maxHp);
        g.fillColor = new Color(30, 34, 34, 210);
        g.roundRect(-32, -5, 64, 10, 5);
        g.fill();
        g.fillColor = unit.team === 'self' ? GREEN : RED;
        g.roundRect(-30, -3, 60 * ratio, 6, 3);
        g.fill();
    }

    private hideUnitHp(unit: BattleUnit): void {
        if (!unit.hpGraphics.isValid || !unit.hpGraphics.node.isValid) return;
        unit.hpGraphics.clear();
        unit.hpGraphics.node.active = false;
    }

    private drawHomes(): void {
        this.drawHomeBar(this.selfHomeGraphics, this.selfHp / this.levelHomeHp, BLUE);
        if (this.enemyHomeGraphics && this.battleMode === 'endless') {
            this.drawHomeBar(this.enemyHomeGraphics, this.enemyHomeHp / Math.max(1, this.enemyHomeMaxHp), RED);
        }
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
        this.backpackHpLabel.string = `${Math.ceil(this.selfHp)}`;
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
        this.syncBrowserContractState();
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
        if (this.battleMode === 'endless') {
            this.roundLabel.string = `无尽 ${Math.max(0, Math.ceil(300 - this.specialBattleElapsed))}秒`;
        }
        this.goldLabel.string = `${this.gold}`;
        this.selfHpLabel.string = `我方兵营 ${Math.ceil(this.selfHp)} / ${this.levelHomeHp}`;
        this.objectiveLabel.string = this.phase === 'battle' || this.phase === 'trait' ? `剩余敌人 ${this.units.filter((unit) => unit.team === 'enemy' && !unit.dead).length}` : '目标：清除全部敌人';
        this.actionLabel.string =
            this.phase === 'deploy'
                ? '开战'
                : this.phase === 'won' || this.phase === 'lost'
                  ? '重新挑战'
                  : '战斗进行中';
        this.refreshLabel.string = '刷新';
        this.refreshLabel.node.setPosition(0, this.normalRefreshTimes > 0 ? 10 : 0);
        this.refreshCostNode.active = this.normalRefreshTimes > 0;
        this.refreshLabel.color = this.phase === 'deploy' ? CREAM : new Color(170, 170, 170, 255);
        this.adRefreshLabel.string = '刷新';
        this.adRefreshLabel.color = this.phase === 'deploy' && !this.freeRefreshUsed ? CREAM : new Color(170, 170, 170, 255);
        this.pauseLabel.string = '';
        if (this.powerRoleActiveLabel) {
            const roleId = this.powerRoleState.equippedRoleId;
            const roleName = OUT_OF_BATTLE_POWER_ROLES.find((role) => role.id === roleId)?.name || '跑跑鼠';
            const active = this.powerRoleActiveRemaining > 0;
            this.powerRoleActiveLabel.string = roleId === 'P01'
                ? `${roleName} 自动\n${Math.ceil(this.powerSkillRemaining)}秒`
                : active
                  ? `${roleName} 生效\n${Math.ceil(this.powerRoleActiveRemaining)}秒`
                  : `${roleName} 能量\n${Math.floor(this.powerRoleEnergy)}/${POWER_ROLE_ACTIVE_ENERGY_MAX}`;
            this.powerRoleActiveLabel.node.parent!.active = this.phase === 'battle';
            this.powerRoleActiveLabel.node.parent!.getComponent(Button)!.interactable =
                this.phase === 'battle' && powerRoleActiveAvailable(this.powerRoleState, this.powerRoleEnergy) && !active;
            this.powerRoleActiveLabel.color = this.powerRoleActiveLabel.node.parent!.getComponent(Button)!.interactable
                ? WHITE
                : new Color(170, 170, 180, 255);
        }
        this.levelButtonLabel.string = `第 ${bagLikeLevelNumber(this.levelId)} 关`;
        for (const gear of [...this.gears, ...this.candidates]) {
            this.drawWorkerProgressBar(gear);
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
