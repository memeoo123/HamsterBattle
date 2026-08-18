import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [packPath, configPath, outputPath] = process.argv.slice(2);
if (!packPath || !configPath || !outputPath) {
  throw new Error('usage: node extract-quality-atlas.mjs <import-pack.json> <bundle-config.json> <output.json>');
}

const packText = readFileSync(packPath, 'utf8');
const pack = JSON.parse(packText);
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const qualityEntries = Object.entries(config.paths)
  .filter(([, value]) => value[0] === 'image/quality');
const atlasEntry = qualityEntries.find(([, value]) => config.types[value[1]] === 'cc.SpriteAtlas');
if (!atlasEntry) throw new Error('image/quality SpriteAtlas entry was not found');
const atlasUuid = config.uuids[Number(atlasEntry[0])];

const escapedUuid = atlasUuid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const aliasPattern = new RegExp(`"${escapedUuid}@[a-f0-9]+","([^"]+)"`, 'g');
const aliasNames = new Set();
for (const match of packText.matchAll(aliasPattern)) aliasNames.add(match[1]);
if (!aliasNames.size) throw new Error(`no SpriteFrame aliases found for ${atlasUuid}`);

const frames = new Map();
function walk(value) {
  if (Array.isArray(value)) {
    for (const child of value) walk(child);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value.name === 'string' && aliasNames.has(value.name)
      && value.rect && Number.isFinite(value.rect.x) && Number.isFinite(value.rect.y)) {
    frames.set(value.name, {
      name: value.name,
      rect: value.rect,
      offset: value.offset,
      originalSize: value.originalSize,
      rotated: value.rotated,
      capInsets: value.capInsets,
      pixelsToUnit: value.pixelsToUnit,
      pivot: value.pivot,
      meshType: value.meshType,
    });
  }
  for (const child of Object.values(value)) walk(child);
}
walk(pack);

const missingAliases = [...aliasNames].filter((name) => !frames.has(name));
if (missingAliases.length) throw new Error(`missing serialized SpriteFrame records: ${missingAliases.join(', ')}`);
const result = {
  schemaVersion: '1.0',
  sourceImportPack: resolve(packPath),
  sourceBundleConfig: resolve(configPath),
  logicalPath: 'image/quality',
  atlasUuid,
  imageSize: { width: 1586, height: 512 },
  frameCount: frames.size,
  frames: [...frames.values()].sort((left, right) => left.name.localeCompare(right.name)),
};
writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ output: resolve(outputPath), atlasUuid, frameCount: frames.size }, null, 2));
