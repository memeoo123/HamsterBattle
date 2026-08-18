import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '../../../../..');
const cacheRoot = 'C:/Users/jiachengwei/AppData/Roaming/Tencent/xwechat/radium/users/d833ae57d25e1087edac741082077974/applet/local/wxf9af2417e78ce07a/usr/gamecaches/resources3';
const evidenceRoot = join(
  projectRoot,
  'targets/wxf9af2417e78ce07a/18/evidence/assets/original/presentation-cache-2026-08-18',
);
const cocosRoot = join(projectRoot, 'cocosProject/assets/resources/spine');

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const assertHash = (path, expected) => {
  const actual = sha256(path);
  if (actual !== expected) throw new Error(`hash mismatch for ${path}: ${actual}`);
};
const ensureParent = (path) => mkdirSync(dirname(path), { recursive: true });
const verifiedCopy = (source, destination, expected) => {
  assertHash(source, expected);
  ensureParent(destination);
  copyFileSync(source, destination);
  assertHash(destination, expected);
};

const textureHash = 'fc1ebfd4b2b2b7bbd7cfb9381a549dab0edee4c18edacff6713e217f402391bc';
const entries = [
  {
    id: 'UI10025',
    sourceSkeleton: '178540547601021.bin',
    sourceTexture: '178540547499419.png',
    skeletonHash: '2d752e976b00307eec7fcf66505159ce5b228863508a0ad121d8e2811826df2b',
    resourceDirectory: 'PreparationGlowSg1',
    basename: 'zhandou_sg1',
    consumers: ['BagLikeView.adGridBtn.modelNode'],
    mappingConfidence: 'inferred-by-cache-request-order',
  },
  {
    id: 'UI10026',
    sourceSkeleton: '178540547651322.bin',
    sourceTexture: '178540548108631.png',
    skeletonHash: '42a1ab4d8fe499675642ff625ab9165a2ef5b6ce2e62c43ca0aabc030b35fdf6',
    resourceDirectory: 'PreparationGlowSg2',
    basename: 'zhandou_sg2',
    consumers: ['BagLikeView.adRefreshBtn.modelNode', 'BagLikeView.refreshBtn.modelNode'],
    mappingConfidence: 'inferred-by-cache-request-order',
  },
];

for (const entry of entries) {
  const sourceSkeleton = join(cacheRoot, entry.sourceSkeleton);
  const sourceTexture = join(cacheRoot, entry.sourceTexture);
  const atlas = `${entry.basename}.png\nsize: 164,124\nformat: RGBA8888\nfilter: Linear,Linear\nrepeat: none\nsg\n  rotate: false\n  xy: 2, 2\n  size: 160, 120\n  orig: 160, 120\n  offset: 0, 0\n  index: -1\n`;

  const evidenceDir = join(evidenceRoot, entry.resourceDirectory);
  const cocosDir = join(cocosRoot, entry.resourceDirectory);
  for (const outputDir of [evidenceDir, cocosDir]) {
    verifiedCopy(sourceSkeleton, join(outputDir, `${entry.basename}.skel`), entry.skeletonHash);
    verifiedCopy(sourceTexture, join(outputDir, `${entry.basename}.png`), textureHash);
    writeFileSync(join(outputDir, `${entry.basename}.atlas`), atlas, 'utf8');
  }
}

const manifest = {
  capturedAt: '2026-08-18',
  target: 'wxf9af2417e78ce07a/18',
  source: 'authorized xwechat resources3 cache',
  caution: 'The two skeleton-to-model mappings follow cache request order; the texture files are byte-identical.',
  textureHash,
  entries: entries.map(({ sourceSkeleton, sourceTexture, ...entry }) => ({
    ...entry,
    sourceSkeleton,
    sourceTexture,
    animation: 'idle',
    loop: true,
    atlas: { width: 164, height: 124, region: { x: 2, y: 2, width: 160, height: 120 } },
  })),
};
mkdirSync(evidenceRoot, { recursive: true });
writeFileSync(join(evidenceRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ recovered: entries.length, evidenceRoot, cocosRoot }, null, 2));
