import {
    _decorator,
    Button,
    Color,
    Component,
    EventTouch,
    Graphics,
    HorizontalTextAlignment,
    Label,
    Node,
    ResolutionPolicy,
    resources,
    Sprite,
    SpriteFrame,
    UITransform,
    Vec3,
    VerticalTextAlignment,
    view,
    sp,
} from 'cc';

const { ccclass } = _decorator;

type Team = 'self' | 'enemy';
type Phase = 'deploy' | 'battle' | 'roundClear' | 'won' | 'lost';
type ModelId = 'H0101' | 'H0201' | 'H0401' | 'M02' | 'M03' | 'Boss03';
type GearId = 'P01' | 'H0101' | 'H0201' | 'H0202' | 'H0203' | 'H0401' | 'H1201' | 'H1202' | 'C01' | 'G02' | 'G03';
type GearLocation = 'grid' | 'candidate';

type Attributes = {
    hit: number;
    dodge: number;
    dodgeRes: number;
    critRate: number;
    critDamage: number;
    damageIncrease: number;
    damageResistance: number;
    heroResistance: number;
    towerResistance: number;
    bossIncrease: number;
    attackSpeed: number;
};

type UnitConfig = {
    id: ModelId;
    name: string;
    atk: number;
    hp: number;
    range: number;
    searchRange: number;
    moveSpeed: number;
    attackInterval: number;
    spinePath: string;
    spineScale: number;
    color: Color;
    attrs?: Partial<Attributes>;
    boss?: boolean;
    gold?: number;
};

type RoundConfig = {
    times: number[];
    monsters: ModelId[];
    atkMultiple: number;
    hpMultiple: number;
};

type GearConfig = {
    id: GearId;
    name: string;
    tint: Color;
    spawnEvery?: number;
    unit?: ModelId;
    unitMultiple?: number;
    shape: ReadonlyArray<readonly [number, number]>;
    gridUnlock?: boolean;
};

type Gear = {
    uid: number;
    id: GearId;
    row: number;
    col: number;
    node: Node;
    nextSpawn: number;
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
    atk: number;
    x: number;
    y: number;
    cooldown: number;
    dead: boolean;
};

type PendingHit = {
    timer: number;
    attacker: BattleUnit;
    target: BattleUnit | null;
    targetHome: Team | null;
    fromX: number;
    fromY: number;
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

const DESIGN_WIDTH = 750;
const DESIGN_HEIGHT = 1334;
const BATTLE_Y = 110;
const HOME_X = 345;
const UNIT_Y_LIMIT = 110;
const GRID_CELL = 100;
const GRID_TOP = 252;
const GRID_LEFT = -300;
const GRID_ROWS = 5;
const GRID_COLS = 7;
const POWER_INDEX = 17;
const LEVEL_ATK_MULTIPLE = 4000;
const LEVEL_HP_MULTIPLE = 4000;

const WHITE = new Color(255, 255, 255, 255);
const INK = new Color(62, 48, 43, 255);
const CREAM = new Color(255, 247, 213, 255);
const GREEN = new Color(55, 151, 99, 255);
const GREEN_DARK = new Color(27, 91, 68, 255);
const RED = new Color(218, 76, 74, 255);
const BLUE = new Color(64, 147, 231, 255);
const GOLD = new Color(255, 195, 55, 255);
const GRID_LOCKED = new Color(43, 50, 65, 215);
const GRID_OPEN = new Color(238, 230, 202, 225);
const PANEL = new Color(34, 45, 48, 224);

const DEFAULT_ATTRS: Attributes = {
    hit: 0,
    dodge: 0,
    dodgeRes: 0,
    critRate: 0,
    critDamage: 0,
    damageIncrease: 0,
    damageResistance: 0,
    heroResistance: 0,
    towerResistance: 0,
    bossIncrease: 0,
    attackSpeed: 0,
};

const UNITS: Record<ModelId, UnitConfig> = {
    H0101: {
        id: 'H0101',
        name: '仓鼠战士',
        atk: 20,
        hp: 70,
        range: 50,
        searchRange: 400,
        moveSpeed: 78,
        attackInterval: 1,
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
        moveSpeed: 72,
        attackInterval: 1,
        spinePath: 'spine/H0201/js_sheshou_1',
        spineScale: 0.8,
        color: new Color(237, 121, 65, 255),
        attrs: { attackSpeed: 1500 },
    },
    H0401: {
        id: 'H0401',
        name: '仓鼠骑士',
        atk: 51,
        hp: 179,
        range: 50,
        searchRange: 400,
        moveSpeed: 95,
        attackInterval: 1,
        spinePath: 'spine/H0401/js_qishi_1',
        spineScale: 0.8,
        color: new Color(107, 183, 106, 255),
    },
    M02: {
        id: 'M02',
        name: '云云猪',
        atk: 20,
        hp: 70,
        range: 50,
        searchRange: 400,
        moveSpeed: 66,
        attackInterval: 1,
        spinePath: 'spine/M02/gw_02',
        spineScale: 0.6,
        color: new Color(186, 126, 215, 255),
        gold: 5,
    },
    M03: {
        id: 'M03',
        name: '僵僵猫',
        atk: 16,
        hp: 30,
        range: 250,
        searchRange: 400,
        moveSpeed: 62,
        attackInterval: 1,
        spinePath: 'spine/M03/gw_03',
        spineScale: 0.6,
        color: new Color(91, 173, 154, 255),
        attrs: { towerResistance: -5000 },
        gold: 5,
    },
    Boss03: {
        id: 'Boss03',
        name: '精英僵僵猫',
        atk: 24,
        hp: 296,
        range: 250,
        searchRange: 400,
        moveSpeed: 58,
        attackInterval: 1,
        spinePath: 'spine/M03/gw_03',
        spineScale: 0.9,
        color: new Color(63, 139, 126, 255),
        attrs: { towerResistance: -5000 },
        boss: true,
        gold: 20,
    },
};

const GEARS: Record<GearId, GearConfig> = {
    P01: { id: 'P01', name: '能量核心', tint: new Color(255, 193, 52, 255), shape: [[0, 0]] },
    H0101: { id: 'H0101', name: '仓鼠战士', tint: new Color(225, 84, 64, 255), spawnEvery: 10, unit: 'H0101', shape: [[0, 0]] },
    H0201: { id: 'H0201', name: '仓鼠射手', tint: new Color(74, 157, 229, 255), spawnEvery: 8, unit: 'H0201', shape: [[0, 0], [0, 1]] },
    H0202: { id: 'H0202', name: '仓鼠射手 II', tint: new Color(69, 137, 226, 255), spawnEvery: 8, unit: 'H0201', unitMultiple: 1.5, shape: [[0, 0], [0, 1]] },
    H0203: { id: 'H0203', name: '仓鼠射手 III', tint: new Color(107, 99, 225, 255), spawnEvery: 8, unit: 'H0201', unitMultiple: 2.25, shape: [[0, 0], [0, 1]] },
    H0401: { id: 'H0401', name: '仓鼠骑士', tint: new Color(70, 167, 99, 255), spawnEvery: 6, unit: 'H0401', shape: [[0, 0], [1, 0], [2, 0]] },
    H1201: { id: 'H1201', name: '雷云齿轮', tint: new Color(125, 104, 231, 255), shape: [[0, 0], [0, 1]] },
    H1202: { id: 'H1202', name: '雷云齿轮 II', tint: new Color(101, 83, 210, 255), shape: [[0, 0], [0, 1]] },
    C01: { id: 'C01', name: '银币齿轮', tint: new Color(255, 190, 43, 255), shape: [[0, 0]] },
    G02: { id: 'G02', name: '横向两格', tint: new Color(84, 205, 180, 255), shape: [[0, 0], [0, 1]], gridUnlock: true },
    G03: { id: 'G03', name: '纵向两格', tint: new Color(84, 205, 180, 255), shape: [[0, 0], [1, 0]], gridUnlock: true },
};

const ROUNDS: RoundConfig[] = [
    { times: [5000], monsters: ['M02'], atkMultiple: 18100, hpMultiple: 19139 },
    {
        times: [1000, 4000, 6000, 8000, 11000, 13000, 15000],
        monsters: ['M02', 'M02', 'M02', 'M03', 'M02', 'M02', 'M02'],
        atkMultiple: 18121,
        hpMultiple: 20116,
    },
    {
        times: [1000, 4000, 6000, 9500, 10000, 11000, 11500, 12500, 13000, 13500, 14000, 14500, 15000],
        monsters: ['M02', 'M02', 'M02', 'M03', 'M02', 'M02', 'M02', 'M02', 'M03', 'M02', 'M02', 'M02', 'M03'],
        atkMultiple: 23879,
        hpMultiple: 27665,
    },
    {
        times: [1000, 4000, 6000, 9500, 10000, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000],
        monsters: ['M02', 'M02', 'M02', 'M03', 'M02', 'M02', 'M02', 'M02', 'M02', 'M03', 'M02', 'M02', 'M02', 'M03'],
        atkMultiple: 28614,
        hpMultiple: 34434,
    },
    {
        times: [1000, 3500, 5500, 8500, 9000, 10000, 10500, 11000, 11500, 12000],
        monsters: ['M02', 'M02', 'M02', 'M02', 'M03', 'M02', 'M02', 'M03', 'M02', 'Boss03'],
        atkMultiple: 34013,
        hpMultiple: 42342,
    },
];

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
const REFRESH_COST = 15;
const CANDIDATE_Y = -390;

@ccclass('CangshuGame')
export class CangshuGame extends Component {
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
    private unlocked = new Set<number>();
    private selfHp = 500;
    private gold = 0;
    private refreshIndex = 0;
    private normalRefreshTimes = 0;
    private freeRefreshUsed = false;
    private coinClock = 0;
    private speed: 1 | 2 = 1;
    private paused = false;

    private battleLayer!: Node;
    private unitLayer!: Node;
    private prepareLayer!: Node;
    private candidateLayer!: Node;
    private resultLayer!: Node;
    private gridLayer!: Node;
    private effectGraphics!: Graphics;
    private gridGraphics!: Graphics;
    private selfHomeGraphics!: Graphics;
    private phaseLabel!: Label;
    private roundLabel!: Label;
    private goldLabel!: Label;
    private selfHpLabel!: Label;
    private objectiveLabel!: Label;
    private actionLabel!: Label;
    private refreshLabel!: Label;
    private adRefreshLabel!: Label;
    private speedLabel!: Label;
    private pauseLabel!: Label;
    private resultTitleLabel!: Label;
    private resultBodyLabel!: Label;
    private tipLabel!: Label;
    private dragGear: Gear | null = null;
    private dragOrigin = { row: 0, col: 0, x: 0, y: 0, location: 'grid' as GearLocation };

    onLoad(): void {
        view.setDesignResolutionSize(DESIGN_WIDTH, DESIGN_HEIGHT, ResolutionPolicy.SHOW_ALL);
        const transform = this.node.getComponent(UITransform) || this.node.addComponent(UITransform);
        transform.setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
        this.buildScene();
        this.initGrid();
        this.addPlacedGear('P01', 2, 3);
        this.dealPreparationBatch();
        this.refreshUi();
    }

    update(dt: number): void {
        const scaled = Math.min(dt, 0.05) * this.speed;
        if (this.phase === 'battle' && !this.paused) this.stepBattle(scaled);
        this.stepEffects(scaled);
        this.drawEffects();
        this.drawHomes();
        this.refreshUi();
    }

    private buildScene(): void {
        const background = this.makeNode('OriginalForest', this.node, 0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
        const backgroundSprite = background.addComponent(Sprite);
        backgroundSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        resources.load('original/fightscene_01/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && background.isValid) backgroundSprite.spriteFrame = frame;
        });

        this.battleLayer = this.makeNode('BattleLayer', this.node, 0, BATTLE_Y, 750, 300);
        this.unitLayer = this.makeNode('Units', this.battleLayer, 0, 0, 750, 300);
        const effectNode = this.makeNode('BattleEffects', this.battleLayer, 0, 0, 750, 300);
        this.effectGraphics = effectNode.addComponent(Graphics);

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

        const topPanel = this.makeNode('TopHud', this.node, 0, 560, 726, 92);
        const topGraphics = topPanel.addComponent(Graphics);
        topGraphics.fillColor = PANEL;
        topGraphics.roundRect(-363, -46, 726, 92, 20);
        topGraphics.fill();
        this.selfHpLabel = this.makeLabel('SelfHp', topPanel, -242, 13, 220, 32, '我方兵营 500 / 500', 18, CREAM);
        this.objectiveLabel = this.makeLabel('Objective', topPanel, 242, 13, 220, 32, '目标：清除全部敌人', 17, CREAM);
        this.roundLabel = this.makeLabel('Round', topPanel, 0, 14, 130, 30, '第 1 / 5 波', 19, GOLD);
        this.phaseLabel = this.makeLabel('Phase', topPanel, 0, -20, 180, 24, '布阵阶段', 15, WHITE);

        this.prepareLayer = this.makeNode('PreparationLayer', this.node, 0, 0, 750, DESIGN_HEIGHT);
        this.gridLayer = this.makeNode('BackpackGrid', this.prepareLayer, 0, 0, 750, DESIGN_HEIGHT);
        this.gridGraphics = this.gridLayer.addComponent(Graphics);

        this.candidateLayer = this.makeNode('CandidateShop', this.prepareLayer, 0, CANDIDATE_Y, 730, 180);
        const candidateGraphics = this.candidateLayer.addComponent(Graphics);
        candidateGraphics.fillColor = new Color(30, 47, 50, 232);
        candidateGraphics.roundRect(-365, -90, 730, 180, 24);
        candidateGraphics.fill();
        candidateGraphics.strokeColor = new Color(255, 225, 145, 190);
        candidateGraphics.lineWidth = 3;
        candidateGraphics.roundRect(-362, -87, 724, 174, 21);
        candidateGraphics.stroke();
        this.makeLabel('CandidateTitle', this.candidateLayer, 0, 65, 420, 28, '候选齿轮 · 拖入背包手动摆放', 17, GOLD);

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

        this.adRefreshLabel = this.makeButton('AdRefresh', this.prepareLayer, -235.5, -598.5, 215, 70, '广告刷新 1/1', () => this.claimFreeBatch());
        this.refreshLabel = this.makeButton('Refresh', this.prepareLayer, -3, -598, 214, 70, '免费刷新', () => this.claimNextBatch(false));
        this.actionLabel = this.makeButton('Action', this.prepareLayer, 230.5, -598.5, 215, 72, '开始第 1 波', () => this.onAction());
        this.speedLabel = this.makeButton('Speed', this.node, -256.5, 476.5, 150, 54, '1× 速度', () => {
            this.speed = this.speed === 1 ? 2 : 1;
            this.speedLabel.string = `${this.speed}× 速度`;
        });
        this.pauseLabel = this.makeButton('Pause', this.node, -306, 622, 86, 48, '暂停', () => {
            if (this.phase !== 'battle') return;
            this.paused = !this.paused;
            this.pauseLabel.string = this.paused ? '继续' : '暂停';
        });
        this.goldLabel = this.makeLabel('Gold', this.prepareLayer, -270, -515, 180, 32, '金币 0', 18, GOLD);

        this.makeLabel('LevelTitle', this.node, 0, 625, 360, 36, '1001 · 宁静森林', 23, CREAM);

        this.resultLayer = this.makeNode('ResultOverlay', this.node, 0, 0, 620, 330);
        const resultGraphics = this.resultLayer.addComponent(Graphics);
        resultGraphics.fillColor = new Color(22, 38, 40, 242);
        resultGraphics.roundRect(-310, -165, 620, 330, 28);
        resultGraphics.fill();
        resultGraphics.strokeColor = new Color(239, 210, 119, 255);
        resultGraphics.lineWidth = 5;
        resultGraphics.roundRect(-307, -162, 614, 324, 25);
        resultGraphics.stroke();
        this.resultTitleLabel = this.makeLabel('ResultTitle', this.resultLayer, 0, 92, 480, 64, '关卡胜利', 38, GOLD);
        this.resultBodyLabel = this.makeLabel('ResultBody', this.resultLayer, 0, 20, 520, 70, '', 20, CREAM);
        this.makeButton('Retry', this.resultLayer, 0, -95, 230, 64, '重新挑战', () => this.restartLevel());
        this.resultLayer.active = false;
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
        g.fillColor = new Color(25, 42, 40, 205);
        g.roundRect(-365, 51.5 - 264.5, 730, 529, 26);
        g.fill();
        for (let row = 0; row < GRID_ROWS; row += 1) {
            for (let col = 0; col < GRID_COLS; col += 1) {
                const index = row * GRID_COLS + col;
                const pos = this.gridPosition(row, col);
                const open = this.unlocked.has(index);
                g.fillColor = open ? GRID_OPEN : GRID_LOCKED;
                g.roundRect(pos.x - 32, pos.y - 32, 64, 64, 12);
                g.fill();
                g.strokeColor = open ? new Color(255, 255, 255, 190) : new Color(93, 104, 117, 180);
                g.lineWidth = 2;
                g.roundRect(pos.x - 32, pos.y - 32, 64, 64, 12);
                g.stroke();
                if (!open) {
                    g.strokeColor = new Color(120, 130, 140, 155);
                    g.moveTo(pos.x - 11, pos.y - 10);
                    g.lineTo(pos.x + 11, pos.y + 10);
                    g.moveTo(pos.x + 11, pos.y - 10);
                    g.lineTo(pos.x - 11, pos.y + 10);
                    g.stroke();
                }
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
        this.clearCandidates();
        this.prepareLayer.active = false;
        this.roundClock = 0;
        this.spawnIndex = 0;
        this.clearTimer = 0;
        this.pendingHits = [];
        for (const gear of this.gears) {
            const config = GEARS[gear.id];
            if (config.unit) {
                this.spawnHero(config.unit, gear);
                gear.nextSpawn = config.spawnEvery || 10;
            }
        }
        this.tipLabel.string = '双方单位会自动索敌；伤害值按原游戏整数向下取整';
    }

    private restartLevel(): void {
        this.clearUnits();
        for (const gear of [...this.gears]) gear.node.destroy();
        for (const gear of [...this.candidates]) gear.node.destroy();
        this.gears = [];
        this.candidates = [];
        this.phase = 'deploy';
        this.roundIndex = 0;
        this.selfHp = 500;
        this.gold = 0;
        this.refreshIndex = 0;
        this.normalRefreshTimes = 0;
        this.freeRefreshUsed = false;
        this.initGrid();
        this.addPlacedGear('P01', 2, 3);
        this.dealPreparationBatch();
        this.tipLabel.string = '把候选仓鼠战士拖入背包后，再开始第 1 波';
        this.prepareLayer.active = true;
        this.resultLayer.active = false;
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
        this.replaceCandidates(this.nextCandidateBatch());
        this.tipLabel.string = cost === 0 ? '本局首次普通刷新免费；请手动拖动候选齿轮' : `已消耗 ${cost} 金币刷新；请手动摆放`;
    }

    private claimFreeBatch(): void {
        if (this.phase !== 'deploy') return;
        if (this.freeRefreshUsed) {
            this.tipLabel.string = '本准备回合的广告刷新已经使用';
            return;
        }
        this.freeRefreshUsed = true;
        this.replaceCandidates(this.nextCandidateBatch());
        this.tipLabel.string = '广告刷新完成；候选齿轮仍需手动拖入背包';
    }

    private dealPreparationBatch(): void {
        this.replaceCandidates(this.nextCandidateBatch());
    }

    private nextCandidateBatch(): GearId[] {
        const batch = STATIC_BATCHES[this.refreshIndex] || ['H0101', 'H0201', 'C01'];
        this.refreshIndex += 1;
        return [...batch];
    }

    private replaceCandidates(batch: GearId[]): void {
        for (const gear of this.candidates) {
            if (gear.node.isValid) gear.node.destroy();
        }
        this.candidates = batch.map((id, index) => this.createGear(id, -1, -1, 'candidate', index));
        this.relayoutCandidates();
    }

    private clearCandidates(): void {
        for (const gear of this.candidates) {
            if (gear.node.isValid) gear.node.destroy();
        }
        this.candidates = [];
    }

    private relayoutCandidates(): void {
        const spacing = this.candidates.length >= 4 ? 145 : 175;
        this.candidates.forEach((gear, index) => {
            gear.candidateIndex = index;
            const x = (index - (this.candidates.length - 1) / 2) * spacing;
            gear.node.setPosition(x, CANDIDATE_Y - 12);
        });
    }

    private addPlacedGear(id: GearId, row: number, col: number): Gear {
        const gear = this.createGear(id, row, col, 'grid', -1);
        this.gears.push(gear);
        return gear;
    }

    private createGear(id: GearId, row: number, col: number, location: GearLocation, candidateIndex: number): Gear {
        const config = GEARS[id];
        const pos = location === 'grid' ? this.gridPosition(row, col) : { x: 0, y: CANDIDATE_Y };
        const node = this.makeNode(`Gear_${id}_${this.serial}`, this.prepareLayer, pos.x, pos.y, 82, 82);
        const g = node.addComponent(Graphics);
        const maxRow = Math.max(...config.shape.map((cell) => cell[0]));
        const maxCol = Math.max(...config.shape.map((cell) => cell[1]));
        for (const [shapeRow, shapeCol] of config.shape) {
            const dotX = (shapeCol - maxCol / 2) * 24;
            const dotY = (maxRow / 2 - shapeRow) * 24;
            g.fillColor = new Color(config.tint.r, config.tint.g, config.tint.b, 245);
            g.circle(dotX, dotY, config.shape.length === 1 ? 28 : 18);
            g.fill();
            g.strokeColor = CREAM;
            g.lineWidth = 3;
            g.circle(dotX, dotY, config.shape.length === 1 ? 28 : 18);
            g.stroke();
        }
        if (id === 'P01') {
            g.fillColor = WHITE;
            g.circle(0, 0, 10);
            g.fill();
        }
        const shortName = id.startsWith('H01') ? '战' : id.startsWith('H02') ? '射' : id.startsWith('H04') ? '骑' : id.startsWith('H12') ? '雷' : id === 'C01' ? '币' : id.startsWith('G') ? '格' : '★';
        this.makeLabel('GearName', node, 0, 0, 40, 34, shortName, 21, id === 'P01' ? GOLD : WHITE);
        const gear: Gear = { uid: ++this.serial, id, row, col, node, nextSpawn: 0, location, candidateIndex };
        if (id !== 'P01') {
            node.on(Node.EventType.TOUCH_START, (event: EventTouch) => this.beginGearDrag(gear, event), this);
            node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => this.moveGearDrag(gear, event), this);
            node.on(Node.EventType.TOUCH_END, (event: EventTouch) => this.endGearDrag(gear, event), this);
            node.on(Node.EventType.TOUCH_CANCEL, () => this.cancelGearDrag(gear), this);
        }
        return gear;
    }

    private beginGearDrag(gear: Gear, _event: EventTouch): void {
        if (this.phase !== 'deploy') return;
        this.dragGear = gear;
        this.dragOrigin = { row: gear.row, col: gear.col, x: gear.node.position.x, y: gear.node.position.y, location: gear.location };
        gear.node.setSiblingIndex(this.prepareLayer.children.length - 1);
        gear.node.setScale(1.16, 1.16, 1);
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
        if (cell && !config.gridUnlock && this.canPlaceGear(gear.id, cell.row, cell.col, gear.location === 'grid' ? gear : null)) {
            gear.row = cell.row;
            gear.col = cell.col;
            if (gear.location === 'candidate') {
                this.candidates = this.candidates.filter((item) => item !== gear);
                this.gears.push(gear);
                gear.location = 'grid';
                gear.candidateIndex = -1;
                this.relayoutCandidates();
                this.tipLabel.string = `${config.name}已手动摆入背包`;
            }
            const target = this.gridPosition(gear.row, gear.col);
            gear.node.setPosition(target.x, target.y);
        } else if (gear.location === 'grid') {
            gear.row = this.dragOrigin.row;
            gear.col = this.dragOrigin.col;
            const target = this.gridPosition(gear.row, gear.col);
            gear.node.setPosition(target.x, target.y);
        } else {
            gear.node.setPosition(this.dragOrigin.x, this.dragOrigin.y);
            this.tipLabel.string = config.gridUnlock ? '扩展格必须完整落在未解锁区域' : '该形状无法放入此处，请换一个空位';
        }
        gear.node.setScale(1, 1, 1);
        this.dragGear = null;
    }

    private cancelGearDrag(gear: Gear): void {
        if (this.dragGear !== gear) return;
        gear.row = this.dragOrigin.row;
        gear.col = this.dragOrigin.col;
        gear.node.setPosition(this.dragOrigin.x, this.dragOrigin.y);
        gear.node.setScale(1, 1, 1);
        this.dragGear = null;
    }

    private gearCellsAt(id: GearId, row: number, col: number): Array<[number, number]> {
        return GEARS[id].shape.map(([rowOffset, colOffset]) => [row + rowOffset, col + colOffset]);
    }

    private canPlaceGear(id: GearId, row: number, col: number, ignore: Gear | null): boolean {
        return this.gearCellsAt(id, row, col).every(([cellRow, cellCol]) => {
            if (cellRow < 0 || cellRow >= GRID_ROWS || cellCol < 0 || cellCol >= GRID_COLS) return false;
            const index = cellRow * GRID_COLS + cellCol;
            if (!this.unlocked.has(index) || index === POWER_INDEX) return false;
            return !this.gears.some((gear) => gear !== ignore && this.gearCellsAt(gear.id, gear.row, gear.col).some(([usedRow, usedCol]) => usedRow === cellRow && usedCol === cellCol));
        });
    }

    private canUnlockShape(id: GearId, row: number, col: number): boolean {
        return this.gearCellsAt(id, row, col).every(([cellRow, cellCol]) => {
            if (cellRow < 0 || cellRow >= GRID_ROWS || cellCol < 0 || cellCol >= GRID_COLS) return false;
            return !this.unlocked.has(cellRow * GRID_COLS + cellCol);
        });
    }

    private stepBattle(dt: number): void {
        const round = ROUNDS[this.roundIndex];
        this.roundClock += dt;
        this.coinClock += dt;
        while (this.coinClock >= 3) {
            this.coinClock -= 3;
            const coinCount = this.gears.filter((gear) => gear.id === 'C01').length;
            this.gold += coinCount * 2;
        }

        while (this.spawnIndex < round.times.length && round.times[this.spawnIndex] * 0.001 <= this.roundClock) {
            this.spawnMonster(round.monsters[this.spawnIndex], round);
            this.spawnIndex += 1;
        }

        for (const gear of this.gears) {
            const config = GEARS[gear.id];
            if (!config.unit || !config.spawnEvery) continue;
            gear.nextSpawn -= dt;
            if (gear.nextSpawn <= 0) {
                gear.nextSpawn += config.spawnEvery;
                this.spawnHero(config.unit, gear);
            }
        }

        for (const unit of [...this.units]) {
            if (!unit.dead) this.stepUnit(unit, dt);
        }
        this.stepPendingHits(dt);

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

    private stepUnit(unit: BattleUnit, dt: number): void {
        unit.cooldown -= dt;
        const opponents = this.units.filter((candidate) => !candidate.dead && candidate.team !== unit.team);
        let target: BattleUnit | null = null;
        let targetDistance = Number.POSITIVE_INFINITY;
        for (const candidate of opponents) {
            const distance = Math.hypot(candidate.x - unit.x, candidate.y - unit.y);
            if (distance <= unit.cfg.searchRange && distance < targetDistance) {
                target = candidate;
                targetDistance = distance;
            }
        }

        const direction = unit.team === 'self' ? 1 : -1;
        const targetHome: Team | null = target ? null : unit.team === 'enemy' ? 'self' : null;
        if (!target && unit.team === 'self' && unit.x >= 70) {
            this.playAnimation(unit, 'idle', true);
            return;
        }
        const homeDistance = targetHome ? Math.abs(-HOME_X - unit.x) - 48 : Math.max(0, 70 - unit.x);
        const attackDistance = target ? targetDistance : homeDistance;
        if (attackDistance <= unit.cfg.range) {
            if (targetHome && unit.cooldown <= 0) this.beginAttack(unit, null, targetHome);
            else if (target && unit.cooldown <= 0) this.beginAttack(unit, target, null);
            this.playAnimation(unit, 'idle', true);
            return;
        }

        const speed = unit.cfg.moveSpeed * dt;
        unit.x += direction * speed;
        if (target) {
            const dy = target.y - unit.y;
            unit.y += Math.max(-speed * 0.55, Math.min(speed * 0.55, dy));
        }
        unit.x = Math.max(-HOME_X + 38, Math.min(HOME_X - 38, unit.x));
        unit.node.setPosition(unit.x, unit.y);
        this.playAnimation(unit, 'run', true);
    }

    private beginAttack(unit: BattleUnit, target: BattleUnit | null, targetHome: Team | null): void {
        const attrs = this.attrsFor(unit.cfg);
        const speedFactor = 10000 / Math.max(1000, 10000 + attrs.attackSpeed);
        unit.cooldown = unit.cfg.attackInterval * speedFactor;
        this.playAnimation(unit, 'attack', false);
        this.pendingHits.push({
            timer: 0.3,
            attacker: unit,
            target,
            targetHome,
            fromX: unit.x,
            fromY: unit.y,
        });
    }

    private stepPendingHits(dt: number): void {
        for (const hit of this.pendingHits) hit.timer -= dt;
        const ready = this.pendingHits.filter((hit) => hit.timer <= 0);
        this.pendingHits = this.pendingHits.filter((hit) => hit.timer > 0);
        for (const hit of ready) {
            if (hit.attacker.dead) continue;
            if (hit.target && !hit.target.dead) {
                const damage = this.calculateDamage(hit.attacker, hit.target.cfg);
                this.damageUnit(hit.target, damage);
                this.addTrace(hit.attacker, hit.target.x, hit.target.y);
            } else if (hit.targetHome) {
                const damage = Math.max(1, Math.floor(hit.attacker.atk));
                this.selfHp -= damage;
                const x = -HOME_X + 20;
                this.addDamageText(damage, x, -15);
                this.addTrace(hit.attacker, x, -10);
            }
        }
    }

    private calculateDamage(attacker: BattleUnit, targetConfig: UnitConfig): number {
        const source = this.attrsFor(attacker.cfg);
        const target = this.attrsFor(targetConfig);
        const hitChance = Math.max(0, Math.min(10000, 10000 + source.hit - target.dodge + source.dodgeRes));
        const missValue = Math.random() * 10000 < hitChance ? 10000 : 0;
        const isCritical = Math.random() * 10000 < Math.max(0, source.critRate);
        const critValue = isCritical ? 15000 + Math.max(0, source.critDamage) : 10000;
        let coefficient = 10000 + source.damageIncrease - target.damageResistance - target.heroResistance;
        if (targetConfig.boss) coefficient += source.bossIncrease;
        coefficient = Math.max(0, coefficient);
        const raw = attacker.atk * (10000 / 10000) * (missValue / 10000) * (critValue / 10000) * (coefficient / 10000);
        return Math.max(1, Math.floor(raw));
    }

    private attrsFor(config: UnitConfig): Attributes {
        return { ...DEFAULT_ATTRS, ...(config.attrs || {}) };
    }

    private damageUnit(target: BattleUnit, damage: number): void {
        target.hp -= damage;
        this.addDamageText(damage, target.x, target.y + 48);
        if (target.hp <= 0) this.killUnit(target);
    }

    private killUnit(unit: BattleUnit): void {
        if (unit.dead) return;
        unit.dead = true;
        this.playAnimation(unit, 'die', false);
        this.scheduleOnce(() => {
            if (unit.node.isValid) unit.node.destroy();
        }, 0.42);
        this.units = this.units.filter((item) => item.uid !== unit.uid);
        this.pendingHits = this.pendingHits.filter((hit) => hit.attacker.uid !== unit.uid && hit.target?.uid !== unit.uid);
        if (unit.team === 'enemy') this.gold += unit.cfg.gold || 5;
    }

    private spawnHero(model: ModelId, gear: Gear): void {
        const rowOffset = (gear.row - 2) * 58 + (gear.col - 3) * 12;
        const multiple = GEARS[gear.id].unitMultiple || 1;
        this.createUnit('self', UNITS[model], -HOME_X + 55, Math.max(-UNIT_Y_LIMIT, Math.min(UNIT_Y_LIMIT, rowOffset)), multiple, multiple);
    }

    private spawnMonster(model: ModelId, round: RoundConfig): void {
        const base = UNITS[model];
        const isBoss = this.roundIndex === 4 && this.spawnIndex === round.monsters.length - 1;
        const config: UnitConfig = isBoss
            ? {
                  ...base,
                  name: '首领·僵僵猫',
                  boss: true,
                  atk: 24,
                  hp: 296,
                  gold: 20,
                  spineScale: 1.2,
                  color: new Color(205, 76, 119, 255),
              }
            : base;
        const atkScale = (LEVEL_ATK_MULTIPLE / 10000) * (round.atkMultiple / 10000);
        const hpScale = (LEVEL_HP_MULTIPLE / 10000) * (round.hpMultiple / 10000);
        const y = Math.random() * UNIT_Y_LIMIT * 2 - UNIT_Y_LIMIT;
        this.createUnit('enemy', config, HOME_X - 55, y, atkScale, hpScale);
    }

    private createUnit(team: Team, cfg: UnitConfig, x: number, y: number, atkScale: number, hpScale: number): void {
        const node = this.makeNode(`${team}_${cfg.id}_${this.serial}`, this.unitLayer, x, y, 90, 110);
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
        const unit: BattleUnit = {
            uid: ++this.serial,
            team,
            cfg,
            node,
            hpGraphics,
            fallback,
            skeleton: null,
            hp: cfg.hp * hpScale,
            maxHp: cfg.hp * hpScale,
            atk: cfg.atk * atkScale,
            x,
            y,
            cooldown: 0.2 + Math.random() * 0.25,
            dead: false,
        };
        this.units.push(unit);
        this.loadSkeleton(unit);
        this.drawUnitHp(unit);
    }

    private loadSkeleton(unit: BattleUnit): void {
        resources.load(unit.cfg.spinePath, sp.SkeletonData, (error, data) => {
            if (error || unit.dead || !unit.node.isValid) return;
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

    private playAnimation(unit: BattleUnit, requested: 'idle' | 'run' | 'attack' | 'die', loop: boolean): void {
        const skeleton = unit.skeleton;
        if (!skeleton || !skeleton.isValid) return;
        const candidates: Record<string, string[]> = {
            idle: ['idle', 'daiji', 'animation'],
            run: ['move', 'run', 'walk', 'yidong', 'idle'],
            attack: ['attack', 'gongji', 'skill01', 'idle'],
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
        this.gold += ROUND_COIN_REWARDS[this.roundIndex] || 0;
        this.scheduleOnce(() => {
            if (this.roundIndex >= ROUNDS.length - 1) {
                this.finish(true);
                return;
            }
            this.roundIndex += 1;
            this.phase = 'deploy';
            this.freeRefreshUsed = false;
            this.dealPreparationBatch();
            this.tipLabel.string = `进入第 ${this.roundIndex + 1} 波准备：新候选需手动摆放`;
            this.prepareLayer.active = true;
        }, 0.7);
    }

    private finish(won: boolean): void {
        this.phase = won ? 'won' : 'lost';
        this.paused = false;
        this.clearUnits();
        this.prepareLayer.active = false;
        this.resultLayer.active = true;
        this.resultTitleLabel.string = won ? '关卡胜利' : '关卡失败';
        this.resultBodyLabel.string = won ? '五波敌人已经全部清除\n宁静森林恢复了平静' : '我方兵营已被摧毁\n调整齿轮后重新挑战';
        this.tipLabel.string = won ? '宁静森林已通关：五波敌人全部清除' : '我方兵营被摧毁，调整齿轮后重试';
    }

    private clearUnits(): void {
        for (const unit of this.units) {
            unit.dead = true;
            if (unit.node.isValid) unit.node.destroy();
        }
        this.units = [];
        this.pendingHits = [];
        this.traces = [];
    }

    private addTrace(attacker: BattleUnit, x: number, y: number): void {
        this.traces.push({
            x1: attacker.x,
            y1: attacker.y,
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
        this.drawHomeBar(this.selfHomeGraphics, this.selfHp / 500, BLUE);
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
            roundClear: '本波清理完毕',
            won: '关卡胜利',
            lost: '关卡失败',
        };
        this.phaseLabel.string = phaseText[this.phase];
        this.roundLabel.string = `第 ${Math.min(this.roundIndex + 1, 5)} / 5 波`;
        this.goldLabel.string = `金币 ${this.gold}`;
        this.selfHpLabel.string = `我方兵营 ${Math.ceil(this.selfHp)} / 500`;
        this.objectiveLabel.string = this.phase === 'battle' ? `剩余敌人 ${this.units.filter((unit) => unit.team === 'enemy' && !unit.dead).length}` : '目标：清除全部敌人';
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
        this.pauseLabel.string = this.paused ? '继续' : '暂停';
    }

    private gridPosition(row: number, col: number): { x: number; y: number } {
        return { x: GRID_LEFT + col * GRID_CELL, y: GRID_TOP - row * GRID_CELL };
    }

    private positionToGrid(x: number, y: number): { row: number; col: number } | null {
        const col = Math.round((x - GRID_LEFT) / GRID_CELL);
        const row = Math.round((GRID_TOP - y) / GRID_CELL);
        if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return null;
        const pos = this.gridPosition(row, col);
        if (Math.abs(pos.x - x) > 35 || Math.abs(pos.y - y) > 35) return null;
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
        return this.makeLabel(`${name}Label`, node, 0, 0, width - 16, height - 10, text, 17, CREAM);
    }
}
