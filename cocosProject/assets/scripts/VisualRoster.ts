export type VisualEnemyEntry = {
    id: string;
    name: string;
    kind: 'NORMAL' | 'ELITE' | 'BOSS';
    spinePath: string;
    spineScale: number;
};

export type VisualGearEntry = {
    id: string;
    name: string;
    level: number;
    shapeId: number;
    headKey: string;
};

// Exact BagLikeShapeConfig.shapeArr coordinates from wxf9af2417e78ce07a/18.
export const VISUAL_GEAR_SHAPES: Readonly<Record<number, ReadonlyArray<readonly [number, number]>>> = {
    1: [[0, 0]],
    2: [[0, 0], [0, 1]],
    3: [[0, 0], [1, 0]],
    4: [[0, 0], [0, 1], [0, 2]],
    5: [[0, 0], [1, 0], [2, 0]],
    6: [[0, 0], [1, 0], [1, 1]],
    7: [[0, 0], [0, 1], [1, 0]],
    8: [[0, 1], [1, 0], [1, 1]],
    9: [[0, 0], [0, 1], [1, 1]],
    10: [[0, 0], [0, 1], [1, 0], [1, 1]],
};

// Every enemy identity referenced by the 200 normal levels (2978 rounds).
// Boss variants intentionally share the same recovered model with their base family.
export const VISUAL_ENEMY_ROSTER: readonly VisualEnemyEntry[] = [
    { id: 'B01', name: '大恶魔', kind: 'BOSS', spinePath: 'spine/B01/boss_1', spineScale: 0.9 },
    { id: 'B02', name: '惊乍怪', kind: 'BOSS', spinePath: 'spine/B02/boss_2', spineScale: 0.9 },
    { id: 'B03', name: '冰岩国王', kind: 'BOSS', spinePath: 'spine/B03/boss_3', spineScale: 0.9 },
    { id: 'Boss01', name: '巨型莱莱姆', kind: 'BOSS', spinePath: 'spine/M01/gw_01', spineScale: 1.2 },
    { id: 'Boss02', name: '精英云云猪', kind: 'BOSS', spinePath: 'spine/M02/gw_02', spineScale: 1.2 },
    { id: 'Boss03', name: '精英僵僵猫', kind: 'BOSS', spinePath: 'spine/M03/gw_03', spineScale: 1.2 },
    { id: 'Boss06', name: '精英冰冰狗', kind: 'BOSS', spinePath: 'spine/M06/gw_06', spineScale: 1.2 },
    { id: 'Boss07', name: '精英鬼鬼羊', kind: 'BOSS', spinePath: 'spine/M07/gw_07', spineScale: 1.1 },
    { id: 'Boss09', name: '巨型恶魔犬', kind: 'BOSS', spinePath: 'spine/M09/gw_09', spineScale: 1.2 },
    { id: 'Boss10', name: '精英脏脏蛇', kind: 'BOSS', spinePath: 'spine/M10/gw_10', spineScale: 1.2 },
    { id: 'Boss11', name: '精英海马狼', kind: 'BOSS', spinePath: 'spine/M11/gw_11', spineScale: 1.2 },
    { id: 'Boss14', name: '巨型厄厄怪', kind: 'BOSS', spinePath: 'spine/M14/gw_14', spineScale: 1.2 },
    { id: 'M01', name: '莱莱姆', kind: 'NORMAL', spinePath: 'spine/M01/gw_01', spineScale: 0.6 },
    { id: 'M02', name: '云云猪', kind: 'NORMAL', spinePath: 'spine/M02/gw_02', spineScale: 0.6 },
    { id: 'M03', name: '僵僵猫', kind: 'NORMAL', spinePath: 'spine/M03/gw_03', spineScale: 0.6 },
    { id: 'M04', name: '冰坨坨', kind: 'ELITE', spinePath: 'spine/M04/gw_04', spineScale: 0.9 },
    { id: 'M05', name: '火火炉', kind: 'NORMAL', spinePath: 'spine/M05/gw_05', spineScale: 0.6 },
    { id: 'M06', name: '冰冰狗', kind: 'NORMAL', spinePath: 'spine/M06/gw_06', spineScale: 0.6 },
    { id: 'M07', name: '鬼鬼羊', kind: 'NORMAL', spinePath: 'spine/M07/gw_07', spineScale: 0.7 },
    { id: 'M09', name: '恶魔犬', kind: 'NORMAL', spinePath: 'spine/M09/gw_09', spineScale: 0.6 },
    { id: 'M10', name: '脏脏蛇', kind: 'NORMAL', spinePath: 'spine/M10/gw_10', spineScale: 0.6 },
    { id: 'M11', name: '海马狼', kind: 'NORMAL', spinePath: 'spine/M11/gw_11', spineScale: 0.6 },
    { id: 'M12', name: '先锋狼', kind: 'NORMAL', spinePath: 'spine/M12/gw_12', spineScale: 0.6 },
    { id: 'M13', name: '爆爆虫', kind: 'NORMAL', spinePath: 'spine/M13/gw_13', spineScale: 0.6 },
    { id: 'M14', name: '厄厄怪', kind: 'NORMAL', spinePath: 'spine/M14/gw_14', spineScale: 0.6 },
];

const gear = (id: string, name: string, level: number, shapeId: number, headKey = id): VisualGearEntry =>
    ({ id, name, level, shapeId, headKey });

// Every HERO/COIN item from BagLikeItemConfig. Repeated tower heads are deliberate:
// the original table points all four merge levels at the same portrait frame.
export const VISUAL_GEAR_ROSTER: readonly VisualGearEntry[] = [
    gear('H0101', '仓鼠战士', 1, 1), gear('H0102', '仓鼠战士', 2, 1), gear('H0103', '仓鼠战士', 3, 1), gear('H0104', '仓鼠战士', 4, 1),
    gear('H0201', '仓鼠射手', 1, 2), gear('H0202', '仓鼠射手', 2, 2), gear('H0203', '仓鼠射手', 3, 2), gear('H0204', '仓鼠射手', 4, 2),
    gear('H0301', '仓鼠法师', 1, 3), gear('H0302', '仓鼠法师', 2, 3), gear('H0303', '仓鼠法师', 3, 3), gear('H0304', '仓鼠法师', 4, 3),
    gear('H0401', '仓鼠骑士', 1, 5), gear('H0402', '仓鼠骑士', 2, 5), gear('H0403', '仓鼠骑士', 3, 5), gear('H0404', '仓鼠骑士', 4, 5),
    gear('H0501', '仓鼠召唤师', 1, 6), gear('H0502', '仓鼠召唤师', 2, 6), gear('H0503', '仓鼠召唤师', 3, 6), gear('H0504', '仓鼠召唤师', 4, 6),
    gear('H0601', '仓鼠飞行员', 1, 10), gear('H0602', '仓鼠飞行员', 2, 10), gear('H0603', '仓鼠飞行员', 3, 10), gear('H0604', '仓鼠飞行员', 4, 10),
    gear('H0705', '仓鼠铁铁侠', 5, 2), gear('H0805', '仓鼠凹凸曼', 5, 3), gear('H0905', '仓鼠战车', 5, 7), gear('H1005', '仓鼠飞碟', 5, 10),
    gear('H1101', '治疗齿轮', 1, 3), gear('H1102', '治疗齿轮', 2, 3, 'H1101'), gear('H1103', '治疗齿轮', 3, 3, 'H1101'), gear('H1104', '治疗齿轮', 4, 3, 'H1101'),
    gear('H1201', '雷云齿轮', 1, 2), gear('H1202', '雷云齿轮', 2, 2, 'H1201'), gear('H1203', '雷云齿轮', 3, 2, 'H1201'), gear('H1204', '雷云齿轮', 4, 2, 'H1201'),
    gear('H1301', '火炮齿轮', 1, 7), gear('H1302', '火炮齿轮', 2, 7, 'H1301'), gear('H1303', '火炮齿轮', 3, 7, 'H1301'), gear('H1304', '火炮齿轮', 4, 7, 'H1301'),
    gear('H1401', '鲨鱼齿轮', 1, 8), gear('H1402', '鲨鱼齿轮', 2, 8, 'H1401'), gear('H1403', '鲨鱼齿轮', 3, 8, 'H1401'), gear('H1404', '鲨鱼齿轮', 4, 8, 'H1401'), gear('H1505', '吞宝鲨', 5, 8),
    gear('C01', '银币齿轮', 1, 1, 'coin'), gear('C02', '银币齿轮', 2, 1, 'coin'), gear('C03', '银币齿轮', 3, 1, 'coin'), gear('C04', '银币齿轮', 4, 1, 'coin'),
    gear('H1601', '仓鼠怪兽', 1, 9), gear('H1602', '仓鼠怪兽', 2, 9), gear('H1603', '仓鼠怪兽', 3, 9), gear('H1604', '仓鼠怪兽', 4, 9),
    gear('H1701', '镭射齿轮', 1, 4), gear('H1702', '镭射齿轮', 2, 4, 'H1701'), gear('H1703', '镭射齿轮', 3, 4, 'H1701'), gear('H1704', '镭射齿轮', 4, 4, 'H1701'), gear('H1805', '仓鼠哥吱拉', 5, 9),
];
