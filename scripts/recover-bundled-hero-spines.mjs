import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(projectRoot,
    'targets/wxf9af2417e78ce07a/18/evidence/assets/original/item-ui/resources3.config.cce0e.json');
const evidenceRoot = resolve(projectRoot,
    'targets/wxf9af2417e78ce07a/18/evidence/assets/original/hero-spines');
const implementationRoot = resolve(projectRoot, 'cocosProject/assets/resources/spine');
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

const familyDirectories = {
    lieren: 'H05',
    feixingyuan: 'H06',
    konglong: 'H16',
};
const nativeExtensions = { 4: 'png', 8: 'atlas', 9: 'bin' };
const config = JSON.parse(await readFile(configPath, 'utf8'));
const nativeVersions = new Map();
for (let index = 0; index < config.versions.native.length; index += 2) {
    nativeVersions.set(config.versions.native[index], config.versions.native[index + 1]);
}

const records = [];
for (const [pathIndexText, pathRecord] of Object.entries(config.paths)) {
    const match = pathRecord[0].match(/^spine\/hero\/js_(lieren|feixingyuan|konglong)_([1-4])\/js_\1_\2$/);
    if (!match) continue;
    const pathIndex = Number(pathIndexText);
    const extension = nativeExtensions[pathRecord[1]];
    const uuid = decompressUuid(config.uuids[pathIndex]);
    const nativeVersion = nativeVersions.get(pathIndex);
    if (!extension || !nativeVersion) throw new Error(`Incomplete resources3 record at path ${pathIndex}`);
    const modelName = `js_${match[1]}_${match[2]}`;
    const targetDirectory = `${familyDirectories[match[1]]}0${match[2]}`;
    const sourceUrl = `${remoteBase}/resources3/native/${uuid.slice(0, 2)}/${uuid}.${nativeVersion}.${extension}`;
    records.push({ modelName, targetDirectory, extension, uuid, nativeVersion, sourceUrl });
}
records.sort((left, right) => left.targetDirectory.localeCompare(right.targetDirectory)
    || left.extension.localeCompare(right.extension));
if (records.length !== 36) throw new Error(`Expected 36 native files, found ${records.length}`);

for (const record of records) {
    const response = await fetch(record.sourceUrl);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${record.sourceUrl}`);
    const data = Buffer.from(await response.arrayBuffer());
    const outputExtension = record.extension === 'bin' ? 'skel' : record.extension;
    const relativeFile = `${record.targetDirectory}/${record.modelName}.${outputExtension}`;
    for (const root of [evidenceRoot, implementationRoot]) {
        const destination = resolve(root, relativeFile);
        await mkdir(dirname(destination), { recursive: true });
        await writeFile(destination, data, { flag: 'wx' }).catch(async (error) => {
            if (error.code !== 'EEXIST') throw error;
            const current = await readFile(destination);
            if (!current.equals(data)) throw new Error(`Refusing to overwrite different file: ${destination}`);
        });
    }
    record.file = relativeFile.replaceAll('\\', '/');
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
    modelCount: 12,
    fileCount: records.length,
    files: records,
    provenance: 'Exact Spine native files resolved from the authorized v18 resources3 logical paths, compressed UUIDs, native versions, and official remote-native layout.',
};
await mkdir(evidenceRoot, { recursive: true });
await writeFile(resolve(evidenceRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Recovered ${manifest.modelCount} hero models / ${manifest.fileCount} files`);
