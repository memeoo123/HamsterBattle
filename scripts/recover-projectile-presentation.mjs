import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(projectRoot,
    'targets/wxf9af2417e78ce07a/18/evidence/assets/original/item-ui/resources3.config.cce0e.json');
const evidenceRoot = resolve(projectRoot,
    'targets/wxf9af2417e78ce07a/18/evidence/assets/original/projectile-presentation');
const resourcesRoot = resolve(projectRoot, 'cocosProject/assets/resources');
const remoteBase = 'https://kxmnrs-res.chuxinhd.com/cangshu/wx_xylxs/res/remote';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function decompressUuid(compressed) {
    let hex = compressed.slice(0, 2);
    for (let index = 2; index < 22; index += 2) {
        const left = alphabet.indexOf(compressed[index]);
        const right = alphabet.indexOf(compressed[index + 1]);
        hex += (left >> 2).toString(16);
        hex += (((left & 3) << 2) | (right >> 4)).toString(16);
        hex += (right & 15).toString(16);
    }
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const requestedAssets = [
    {
        logicalPath: 'spriteFrame/skill/js_feixingyuan_dandao2',
        type: 4,
        evidenceFile: 'sprites/js_feixingyuan_dandao2.png',
        implementationFile: 'original/projectile-matrix/js_feixingyuan_dandao2.png',
        purpose: 'H0601 / M_FXY_6001 five-frame throw projectile (H19_S1)',
    },
    {
        logicalPath: 'spriteFrame/skill/chilun_haidaosha',
        type: 4,
        evidenceFile: 'sprites/chilun_haidaosha.png',
        implementationFile: 'original/projectile-matrix/chilun_haidaosha.png',
        purpose: 'H1401 / M_SY_1401 sixteen-frame target bomb (H14_S1)',
    },
    {
        logicalPath: 'spriteFrame/skill/yugutou_dandao',
        type: 4,
        evidenceFile: 'sprites/yugutou_dandao.png',
        implementationFile: 'original/projectile-matrix/yugutou_dandao.png',
        purpose: 'M03 and Boss03 / M_YGT_50002 throw projectile (H31_S1)',
    },
    {
        logicalPath: 'spriteFrame/skill/boss_1_dandao',
        type: 4,
        evidenceFile: 'sprites/boss_1_dandao.png',
        implementationFile: 'original/projectile-matrix/boss_1_dandao.png',
        purpose: 'M09 and Boss09 / M_HS_50001 normal projectile (H30_S1)',
    },
    {
        logicalPath: 'spine/skill/chilun_shexian1/chilun_shexian1',
        type: 9,
        evidenceFile: 'spine/H17/chilun_shexian1.skel',
        implementationFile: 'spine/ProjectileMatrix/H17/chilun_shexian1.skel',
        purpose: 'H1701 / M_LS_1501 ray skeleton (H32_S1)',
    },
    {
        logicalPath: 'spine/skill/chilun_shexian1/chilun_shexian1',
        type: 8,
        evidenceFile: 'spine/H17/chilun_shexian1.atlas',
        implementationFile: 'spine/ProjectileMatrix/H17/chilun_shexian1.atlas',
        purpose: 'H1701 / M_LS_1501 ray atlas (H32_S1)',
    },
    {
        logicalPath: 'spine/skill/chilun_shexian1/chilun_shexian1',
        type: 4,
        evidenceFile: 'spine/H17/chilun_shexian1.png',
        implementationFile: 'spine/ProjectileMatrix/H17/chilun_shexian1.png',
        purpose: 'H1701 / M_LS_1501 ray texture (H32_S1)',
    },
    {
        logicalPath: 'spine/moster/gw_10/gw_10_zidan',
        type: 9,
        evidenceFile: 'spine/M10/gw_10_zidan.skel',
        implementationFile: 'spine/ProjectileMatrix/M10/gw_10_zidan.skel',
        purpose: 'M10 and Boss10 / M10_attack_M throw skeleton (M10_S1)',
    },
    {
        logicalPath: 'spine/moster/gw_10/gw_10_zidan',
        type: 8,
        evidenceFile: 'spine/M10/gw_10_zidan.atlas',
        implementationFile: 'spine/ProjectileMatrix/M10/gw_10_zidan.atlas',
        purpose: 'M10 and Boss10 / M10_attack_M throw atlas (M10_S1)',
    },
    {
        logicalPath: 'spine/moster/gw_10/gw_10_zidan',
        type: 4,
        evidenceFile: 'spine/M10/gw_10_zidan.png',
        implementationFile: 'spine/ProjectileMatrix/M10/gw_10_zidan.png',
        purpose: 'M10 and Boss10 / M10_attack_M throw texture (M10_S1)',
    },
    {
        logicalPath: 'audio/sound/bullet/bullet_shayu',
        type: 7,
        evidenceFile: 'audio/bullet_shayu.mp3',
        implementationFile: 'original/projectile-matrix/bullet_shayu.mp3',
        purpose: 'M_SY_1401 delayed behavior hit sound',
    },
];

const nativeExtensions = { 4: 'png', 7: 'mp3', 8: 'atlas', 9: 'bin' };
const config = JSON.parse(await readFile(configPath, 'utf8'));
const nativeVersions = new Map();
for (let index = 0; index < config.versions.native.length; index += 2) {
    nativeVersions.set(config.versions.native[index], config.versions.native[index + 1]);
}

const records = requestedAssets.map((request) => {
    const entry = Object.entries(config.paths).find(([, value]) => (
        value[0] === request.logicalPath && value[1] === request.type
    ));
    if (!entry) throw new Error(`Missing resources3 path: ${request.logicalPath} type ${request.type}`);
    const pathIndex = Number(entry[0]);
    const uuid = decompressUuid(config.uuids[pathIndex]);
    const nativeVersion = nativeVersions.get(pathIndex);
    const extension = nativeExtensions[request.type];
    if (!nativeVersion || !extension) throw new Error(`Incomplete native record at path ${pathIndex}`);
    const sourceUrl = `${remoteBase}/resources3/native/${uuid.slice(0, 2)}/${uuid}.${nativeVersion}.${extension}`;
    return { ...request, pathIndex, uuid, nativeVersion, extension, sourceUrl };
});

for (const record of records) {
    const response = await fetch(record.sourceUrl);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${record.sourceUrl}`);
    const data = Buffer.from(await response.arrayBuffer());
    for (const [root, relativeFile] of [
        [evidenceRoot, record.evidenceFile],
        [resourcesRoot, record.implementationFile],
    ]) {
        const destination = resolve(root, relativeFile);
        await mkdir(dirname(destination), { recursive: true });
        await writeFile(destination, data, { flag: 'wx' }).catch(async (error) => {
            if (error.code !== 'EEXIST') throw error;
            const current = await readFile(destination);
            if (!current.equals(data)) throw new Error(`Refusing to overwrite different file: ${destination}`);
        });
    }
    record.sha256 = createHash('sha256').update(data).digest('hex');
    record.bytes = data.length;
}

const manifest = {
    schemaVersion: '1.0',
    appId: 'wxf9af2417e78ce07a',
    packageVersion: '18',
    bundle: 'resources3',
    config: '../item-ui/resources3.config.cce0e.json',
    remoteBase,
    fileCount: records.length,
    files: records,
    unresolved: [{
        modelId: 'H18_S1',
        logicalPath: 'spriteFrame/skill/js_fashi_dandao',
        reason: 'The model table references this path, but resources3.config contains no matching native asset record.',
    }],
    provenance: 'Exact native files resolved from authorized v18 logical paths, compressed UUIDs, native versions, and the official resources3 remote-native layout.',
};
await mkdir(evidenceRoot, { recursive: true });
await writeFile(resolve(evidenceRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Recovered ${manifest.fileCount} projectile-presentation files`);
