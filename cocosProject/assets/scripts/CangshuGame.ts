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
type ModelId = 'H0101' | 'H0201' | 'M02' | 'M03';
type GearId = 'P01' | 'H0101' | 'H0201' | 'C01';

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
};

type Gear = {
    uid: number;
    id: GearId;
    row: number;
    col: number;
    node: Node;
    nextSpawn: number;
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
const DESIGN_HEIGHT = 1000;
const BATTLE_Y = 185;
const HOME_X = 300;
const UNIT_Y_LIMIT = 150;
const GRID_CELL = 72;
const GRID_TOP = -100;
const GRID_LEFT = -216;
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
};

const GEARS: Record<GearId, GearConfig> = {
    P01: { id: 'P01', name: '能量核心', tint: new Color(255, 193, 52, 255) },
    H0101: { id: 'H0101', name: '战士齿轮', tint: new Color(225, 84, 64, 255), spawnEvery: 10, unit: 'H0101' },
    H0201: { id: 'H0201', name: '射手齿轮', tint: new Color(74, 157, 229, 255), spawnEvery: 8, unit: 'H0201' },
    C01: { id: 'C01', name: '金币齿轮', tint: new Color(255, 190, 43, 255) },
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
        monsters: ['M02', 'M02', 'M02', 'M02', 'M03', 'M02', 'M02', 'M03', 'M02', 'M03'],
        atkMultiple: 34013,
        hpMultiple: 42342,
    },
];

const STATIC_BATCHES: GearId[][] = [
    ['H0101'],
    ['H0201', 'C01'],
    [],
    ['H0101', 'H0201'],
    ['H0101'],
];

@ccclass('CangshuGame')
export class CangshuGame extends Component {
    private phase: Phase = 'deploy';
    private roundIndex = 0;
    private roundClock = 0;
    private spawnIndex = 0;
    private clearTimer = 0;
    private serial = 0;
    private gears: Gear[] = [];
    private units: BattleUnit[] = [];
    private pendingHits: PendingHit[] = [];
    private traces: Trace[] = [];
    private floatingTexts: FloatingText[] = [];
    private unlocked = new Set<number>();
    private selfHp = 500;
    private enemyHp = 4000;
    private gold = 60;
    private refreshIndex = 0;
    private coinClock = 0;
    private speed: 1 | 2 = 1;

    private battleLayer!: Node;
    private unitLayer!: Node;
    private gridLayer!: Node;
    private effectGraphics!: Graphics;
    private gridGraphics!: Graphics;
    private selfHomeGraphics!: Graphics;
    private enemyHomeGraphics!: Graphics;
    private phaseLabel!: Label;
    private roundLabel!: Label;
    private goldLabel!: Label;
    private selfHpLabel!: Label;
    private enemyHpLabel!: Label;
    private actionLabel!: Label;
    private refreshLabel!: Label;
    private speedLabel!: Label;
    private tipLabel!: Label;
    private dragGear: Gear | null = null;
    private dragOrigin = { row: 0, col: 0 };

    onLoad(): void {
        view.setDesignResolutionSize(DESIGN_WIDTH, DESIGN_HEIGHT, ResolutionPolicy.SHOW_ALL);
        const transform = this.node.getComponent(UITransform) || this.node.addComponent(UITransform);
        transform.setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);
        this.buildScene();
        this.initGrid();
        this.addGear('P01', 2, 3);
        this.claimNextBatch(true);
        this.refreshUi();
    }

    update(dt: number): void {
        const scaled = Math.min(dt, 0.05) * this.speed;
        if (this.phase === 'battle') this.stepBattle(scaled);
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

        const shade = this.makeNode('LowerShade', this.node, 0, -285, 750, 430);
        const shadeGraphics = shade.addComponent(Graphics);
        shadeGraphics.fillColor = new Color(25, 42, 40, 164);
        shadeGraphics.roundRect(-370, -210, 740, 420, 26);
        shadeGraphics.fill();

        this.battleLayer = this.makeNode('BattleLayer', this.node, 0, BATTLE_Y, 750, 440);
        this.unitLayer = this.makeNode('Units', this.battleLayer, 0, 0, 750, 440);
        const effectNode = this.makeNode('BattleEffects', this.battleLayer, 0, 0, 750, 440);
        this.effectGraphics = effectNode.addComponent(Graphics);

        const selfHome = this.makeNode('SelfCamp', this.battleLayer, -HOME_X, -18, 145, 150);
        const selfSprite = selfHome.addComponent(Sprite);
        selfSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        resources.load('original/blue_base/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && selfHome.isValid) selfSprite.spriteFrame = frame;
        });
        this.selfHomeGraphics = selfHome.addComponent(Graphics);

        const enemyHome = this.makeNode('EnemyCamp', this.battleLayer, HOME_X, -18, 145, 150);
        const enemySprite = enemyHome.addComponent(Sprite);
        enemySprite.sizeMode = Sprite.SizeMode.CUSTOM;
        enemyHome.setScale(-1, 1, 1);
        resources.load('original/red_base/spriteFrame', SpriteFrame, (error, frame) => {
            if (!error && enemyHome.isValid) enemySprite.spriteFrame = frame;
        });
        this.enemyHomeGraphics = enemyHome.addComponent(Graphics);

        const topPanel = this.makeNode('TopHud', this.node, 0, 458, 726, 66);
        const topGraphics = topPanel.addComponent(Graphics);
        topGraphics.fillColor = PANEL;
        topGraphics.roundRect(-363, -33, 726, 66, 20);
        topGraphics.fill();
        this.selfHpLabel = this.makeLabel('SelfHp', topPanel, -250, 8, 210, 30, '我方兵营 500 / 500', 18, CREAM);
        this.enemyHpLabel = this.makeLabel('EnemyHp', topPanel, 250, 8, 210, 30, '敌方兵营 4000 / 4000', 18, CREAM);
        this.roundLabel = this.makeLabel('Round', topPanel, 0, 9, 130, 30, '第 1 / 5 波', 19, GOLD);
        this.phaseLabel = this.makeLabel('Phase', topPanel, 0, -18, 160, 24, '布阵阶段', 15, WHITE);

        this.gridLayer = this.makeNode('BackpackGrid', this.node, 0, 0, 750, 1000);
        this.gridGraphics = this.gridLayer.addComponent(Graphics);

        this.tipLabel = this.makeLabel(
            'Tip',
            this.node,
            0,
            -70,
            650,
            34,
            '拖动齿轮调整位置；开始后英雄会从左侧兵营自动出战',
            15,
            CREAM,
        );

        this.refreshLabel = this.makeButton('Refresh', this.node, -255, -468, 170, 54, '刷新 15', () => this.claimNextBatch(false));
        this.actionLabel = this.makeButton('Action', this.node, 0, -468, 210, 58, '开始第 1 波', () => this.onAction());
        this.speedLabel = this.makeButton('Speed', this.node, 255, -468, 150, 54, '1× 速度', () => {
            this.speed = this.speed === 1 ? 2 : 1;
            this.speedLabel.string = `${this.speed}× 速度`;
        });
        this.goldLabel = this.makeLabel('Gold', this.node, -262, -80, 180, 32, '金币 60', 18, GOLD);

        const title = this.makeLabel('LevelTitle', this.node, 0, 405, 360, 36, '1001 · 宁静森林', 23, CREAM);
        const outline = title.node.addComponent(Graphics);
        outline.strokeColor = new Color(33, 60, 49, 140);
    }

    private initGrid(): void {
        for (let row = 1; row <= 3; row += 1) {
            for (let col = 2; col <= 4; col += 1) this.unlocked.add(row * GRID_COLS + col);
        }
        this.drawGrid();
    }

    private drawGrid(): void {
        const g = this.gridGraphics;
        g.clear();
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
            this.tipLabel.string = '至少需要一个英雄齿轮才能开战';
            return;
        }
        this.phase = 'battle';
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
        this.gears = [];
        this.phase = 'deploy';
        this.roundIndex = 0;
        this.selfHp = 500;
        this.enemyHp = 4000;
        this.gold = 60;
        this.refreshIndex = 0;
        this.addGear('P01', 2, 3);
        this.claimNextBatch(true);
        this.tipLabel.string = '拖动齿轮调整位置；开始后英雄会从左侧兵营自动出战';
    }

    private claimNextBatch(free: boolean): void {
        if (this.phase !== 'deploy') return;
        if (!free && this.gold < 15) {
            this.tipLabel.string = '金币不足，刷新需要 15';
            return;
        }
        const batch = STATIC_BATCHES[this.refreshIndex] || [];
        if (!free) this.gold -= 15;
        if (batch.length === 0) {
            this.unlockNextCell();
            this.tipLabel.string = '获得扩展齿轮：已解锁一个背包格';
        } else {
            for (const id of batch) {
                const cell = this.firstFreeCell();
                if (cell) this.addGear(id, cell.row, cell.col);
            }
            this.tipLabel.string = `获得：${batch.map((id) => GEARS[id].name).join('、')}`;
        }
        this.refreshIndex = Math.min(this.refreshIndex + 1, STATIC_BATCHES.length);
    }

    private unlockNextCell(): void {
        const preferred = [10, 11, 12, 9, 13, 3, 24, 2, 4, 23, 25];
        const index = preferred.find((value) => !this.unlocked.has(value));
        if (index === undefined) return;
        this.unlocked.add(index);
        this.drawGrid();
    }

    private firstFreeCell(): { row: number; col: number } | null {
        for (const index of this.unlocked) {
            if (index === POWER_INDEX) continue;
            const row = Math.floor(index / GRID_COLS);
            const col = index % GRID_COLS;
            if (!this.gears.some((gear) => gear.row === row && gear.col === col)) return { row, col };
        }
        return null;
    }

    private addGear(id: GearId, row: number, col: number): void {
        const config = GEARS[id];
        const pos = this.gridPosition(row, col);
        const node = this.makeNode(`Gear_${id}_${this.serial}`, this.node, pos.x, pos.y, 62, 62);
        const g = node.addComponent(Graphics);
        g.fillColor = new Color(config.tint.r, config.tint.g, config.tint.b, 245);
        g.circle(0, 0, 28);
        g.fill();
        g.strokeColor = CREAM;
        g.lineWidth = 4;
        for (let i = 0; i < 8; i += 1) {
            const angle = (Math.PI * 2 * i) / 8;
            g.moveTo(Math.cos(angle) * 25, Math.sin(angle) * 25);
            g.lineTo(Math.cos(angle) * 31, Math.sin(angle) * 31);
        }
        g.stroke();
        if (id === 'P01') {
            g.fillColor = WHITE;
            g.circle(0, 0, 10);
            g.fill();
        }
        const shortName = id === 'H0101' ? '战' : id === 'H0201' ? '射' : id === 'C01' ? '金' : '★';
        this.makeLabel('GearName', node, 0, 0, 40, 34, shortName, 21, id === 'P01' ? GOLD : WHITE);
        const gear: Gear = { uid: ++this.serial, id, row, col, node, nextSpawn: 0 };
        this.gears.push(gear);
        if (id !== 'P01') {
            node.on(Node.EventType.TOUCH_START, (event: EventTouch) => this.beginGearDrag(gear, event), this);
            node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => this.moveGearDrag(gear, event), this);
            node.on(Node.EventType.TOUCH_END, (event: EventTouch) => this.endGearDrag(gear, event), this);
            node.on(Node.EventType.TOUCH_CANCEL, () => this.cancelGearDrag(gear), this);
        }
    }

    private beginGearDrag(gear: Gear, _event: EventTouch): void {
        if (this.phase !== 'deploy') return;
        this.dragGear = gear;
        this.dragOrigin = { row: gear.row, col: gear.col };
        gear.node.setSiblingIndex(this.node.children.length - 1);
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
        if (
            cell &&
            this.unlocked.has(cell.row * GRID_COLS + cell.col) &&
            cell.row * GRID_COLS + cell.col !== POWER_INDEX &&
            !this.gears.some((item) => item !== gear && item.row === cell.row && item.col === cell.col)
        ) {
            gear.row = cell.row;
            gear.col = cell.col;
        } else {
            gear.row = this.dragOrigin.row;
            gear.col = this.dragOrigin.col;
        }
        const target = this.gridPosition(gear.row, gear.col);
        gear.node.setPosition(target.x, target.y);
        gear.node.setScale(1, 1, 1);
        this.dragGear = null;
    }

    private cancelGearDrag(gear: Gear): void {
        if (this.dragGear !== gear) return;
        const target = this.gridPosition(this.dragOrigin.row, this.dragOrigin.col);
        gear.row = this.dragOrigin.row;
        gear.col = this.dragOrigin.col;
        gear.node.setPosition(target.x, target.y);
        gear.node.setScale(1, 1, 1);
        this.dragGear = null;
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
        if (this.enemyHp <= 0) {
            this.enemyHp = 0;
            this.finish(true);
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
        const targetHome: Team = unit.team === 'self' ? 'enemy' : 'self';
        const homeDistance = Math.abs((targetHome === 'enemy' ? HOME_X : -HOME_X) - unit.x) - 48;
        const attackDistance = target ? targetDistance : homeDistance;
        if (attackDistance <= unit.cfg.range) {
            if (unit.cooldown <= 0) this.beginAttack(unit, target, target ? null : targetHome);
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
                if (hit.targetHome === 'self') this.selfHp -= damage;
                else this.enemyHp -= damage;
                const x = hit.targetHome === 'self' ? -HOME_X + 20 : HOME_X - 20;
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
        this.createUnit('self', UNITS[model], -HOME_X + 55, Math.max(-UNIT_Y_LIMIT, Math.min(UNIT_Y_LIMIT, rowOffset)), 1, 1);
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
        this.scheduleOnce(() => {
            if (this.roundIndex >= ROUNDS.length - 1) {
                this.finish(true);
                return;
            }
            this.roundIndex += 1;
            this.phase = 'deploy';
            this.gold += 15;
            this.tipLabel.string = `第 ${this.roundIndex} 波完成，整理背包后继续`;
            this.claimNextBatch(true);
        }, 0.7);
    }

    private finish(won: boolean): void {
        this.phase = won ? 'won' : 'lost';
        this.clearUnits();
        this.tipLabel.string = won ? '宁静森林已通关：敌方兵营被摧毁' : '我方兵营被摧毁，调整齿轮后重试';
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
        this.drawHomeBar(this.enemyHomeGraphics, this.enemyHp / 4000, RED);
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
        this.enemyHpLabel.string = `敌方兵营 ${Math.ceil(this.enemyHp)} / 4000`;
        this.actionLabel.string =
            this.phase === 'deploy'
                ? `开始第 ${this.roundIndex + 1} 波`
                : this.phase === 'won' || this.phase === 'lost'
                  ? '重新挑战'
                  : '战斗进行中';
        this.refreshLabel.color = this.phase === 'deploy' ? CREAM : new Color(170, 170, 170, 255);
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
