import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, '..');
const workspace = resolve(target, '..', '..', '..');
const source = resolve(target, 'evidence/assets/original/post-unlock-cache-2026-08-18');
const project = resolve(workspace, 'cocosProject');
const importPack = resolve(target, 'evidence/assets/original/item-ui/resources3.import.0de4fdaf8.fe248.json');

const expected = {
  'bg1.jpg': '481b10e0f2be897d72039f23477ebfe1f9410972d91db0ae38fe1a00c4721d8c',
  'ui_hero.atlas.png': '199424c6486a57cd89da744f5ed6dcc1d3ed49fa1a59f9579ecbccc43fedbcf9',
  'ui_hero.package.bin': '2b784d74562e6b5f5a71c9a7addc7abc2d9ab861a16c89cd921c2a0331ec2d71',
  'ui_hero.layout.json': '6119df8c71191097729bb6e0567342833c9a73f86dc864836569f6b8988210b2',
  'image_quality.png': 'bc86ac7d8cbf40bfc1f4995e543655f1ffa0e0a01f0b80badc5a93d1eff214ec',
  'image_quality.frames.json': 'd785906fcbb32865d0ea798ab69fd4a7288a0fcb18e6b6525a6c39ded6f6ddd0',
  'pao_kakaxi.skel': '7d1a07959d88c210929ae08e9e55490a80af96144bb72b7dc23e4baab43428f7',
  'pao_kakaxi.png': 'c10c69caf02f7b644fd9e942259487aeb7d4c34b16c9915466c8fe445d660686',
  'pao_kakaxi.full.skel': '1914bd320a22a9cd19b202e6b29ecca92eee0b24f806dde5dc1e26996376264e',
  'pao_kakaxi.full.png': '6c82bdc91f7b38341c12e7fb0f5a80a9b94a38ccf35f2a85c517c3ba1f1306d3',
  'pao_paopaoshu.full.skel': '4aeafaf343f227a1ceceaa5cb8df7d6027e42e3c1a7d42f35714a6ffe4926a3c',
  'pao_paopaoshu.full.png': 'fc02bb82fc7c2a02df2a3c92b81ddf42569f753b579129ba7fa30fc18b1a898d',
  'pao_paopaoshu.075.skel': 'b134e62130a95113e83c146324d1e9f1595daa74e4106c8a4c360badec305651',
  'pao_paopaoshu.075.png': 'ce8d8545946c53bd462f0d9a0a9b6df4d612071a67e1882aef51a698228945a7',
  'cj_xuedi.skel': '2e0ea059d17571f63ff16c46f8d9ee5c86ddd9d60fdd938035c360f9cbdc2a4f',
  'cj_xuedi.png': '9545709191e84c1ff9482a36e63bdd6607436325cea2e011b834063bf16d74f4',
  'chilunpy_shengjishanguang.skel': '5e940dda36d6d1d9f4923c1ad96c79956a29e99d0fc568c8bbf7909351508ca6',
  'chilunpy_shengjishanguang.png': '7cda98ce70e3878cf85e1862964b824c3ab772b1d61b6d69a90905e0e3ca3985',
};

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function verifiedCopy(name, destination) {
  const from = resolve(source, name);
  const actual = sha256(from);
  if (actual !== expected[name]) throw new Error(`${name}: expected ${expected[name]}, got ${actual}`);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(from, destination);
  if (sha256(destination) !== actual) throw new Error(`${name}: destination hash mismatch`);
  return { source: name, destination: destination.slice(project.length + 1).replaceAll('\\', '/'), sha256: actual };
}

const copied = [
  verifiedCopy('bg1.jpg', resolve(project, 'assets/resources/original/post-unlock/bg1.jpg')),
  verifiedCopy('ui_hero.atlas.png', resolve(project, 'assets/resources/original/post-unlock/ui_hero.atlas.png')),
  verifiedCopy('ui_hero.package.bin', resolve(project, 'assets/resources/original/post-unlock/ui_hero.package.bin')),
  verifiedCopy('ui_hero.layout.json', resolve(project, 'assets/resources/data/post-unlock-hero-layout.json')),
  verifiedCopy('image_quality.png', resolve(project, 'assets/resources/original/post-unlock/image_quality.png')),
  verifiedCopy('image_quality.frames.json', resolve(project, 'assets/resources/data/image-quality-frames.json')),
  verifiedCopy('pao_kakaxi.skel', resolve(project, 'assets/resources/spine/PowerRoleP04/pao_kakaxi.skel')),
  verifiedCopy('pao_kakaxi.png', resolve(project, 'assets/resources/spine/PowerRoleP04/pao_kakaxi.png')),
  verifiedCopy('pao_kakaxi.full.skel', resolve(project, 'assets/resources/spine/PowerRoleP04Full/pao_kakaxi.skel')),
  verifiedCopy('pao_kakaxi.full.png', resolve(project, 'assets/resources/spine/PowerRoleP04Full/pao_kakaxi.png')),
  verifiedCopy('pao_paopaoshu.full.skel', resolve(project, 'assets/resources/spine/PowerRoleP01Full/pao_paopaoshu.skel')),
  verifiedCopy('pao_paopaoshu.full.png', resolve(project, 'assets/resources/spine/PowerRoleP01Full/pao_paopaoshu.png')),
  verifiedCopy('pao_paopaoshu.075.skel', resolve(project, 'assets/resources/spine/PowerRoleP01Card/pao_paopaoshu.skel')),
  verifiedCopy('pao_paopaoshu.075.png', resolve(project, 'assets/resources/spine/PowerRoleP01Card/pao_paopaoshu.png')),
  verifiedCopy('cj_xuedi.skel', resolve(project, 'assets/resources/spine/DailySnowScene/cj_xuedi.skel')),
  verifiedCopy('cj_xuedi.png', resolve(project, 'assets/resources/spine/DailySnowScene/cj_xuedi.png')),
  verifiedCopy('chilunpy_shengjishanguang.skel', resolve(project, 'assets/resources/spine/PowerRoleUpgradeGlow/chilunpy_shengjishanguang.skel')),
  verifiedCopy('chilunpy_shengjishanguang.png', resolve(project, 'assets/resources/spine/PowerRoleUpgradeGlow/chilunpy_shengjishanguang.png')),
];

const pack = JSON.parse(readFileSync(importPack, 'utf8'));
const atlasCandidates = [];
function walk(value) {
  if (Array.isArray(value)) {
    if (value[0] === 1 && value[2] === '.bin' && typeof value[3] === 'string') atlasCandidates.push(value);
    for (const child of value) walk(child);
  } else if (value && typeof value === 'object') {
    for (const child of Object.values(value)) walk(child);
  }
}
walk(pack);

for (const spec of [
  { name: 'pao_kakaxi', size: '800,503', folder: 'PowerRoleP04' },
  { name: 'pao_kakaxi', size: '191,145', folder: 'PowerRoleP04Full' },
  { name: 'pao_paopaoshu', size: '199,135', folder: 'PowerRoleP01Full' },
  { name: 'pao_paopaoshu', size: '692,613', folder: 'PowerRoleP01Card' },
  { name: 'cj_xuedi', size: '570,398', folder: 'DailySnowScene' },
  { name: 'chilunpy_shengjishanguang', size: '889,212', folder: 'PowerRoleUpgradeGlow' },
]) {
  const record = atlasCandidates.find((candidate) => candidate[1] === spec.name && candidate[3].includes(`size: ${spec.size}`));
  if (!record) throw new Error(`atlas not found for ${spec.name} (${spec.size})`);
  const destination = resolve(project, `assets/resources/spine/${spec.folder}/${spec.name}.atlas`);
  writeFileSync(destination, record[3].replace(/^\n/, ''), 'utf8');
  copied.push({
    source: 'resources3.import.0de4fdaf8.fe248.json',
    destination: destination.slice(project.length + 1).replaceAll('\\', '/'),
    derived: 'exact serialized atlas text',
    texture: `${spec.name}.png`,
  });
}

const map = {
  schemaVersion: '1.0',
  target: { appId: 'wxf9af2417e78ce07a', version: '18' },
  importedAt: new Date().toISOString(),
  sourceEvidence: '../targets/wxf9af2417e78ce07a/18/evidence/assets/original/post-unlock-cache-2026-08-18/manifest.json',
  copied,
  reusedByteIdentical: [
    {
      logicalPath: 'image/effect',
      projectPath: 'assets/resources/original/effect.png',
      sha256: 'da0f386f4f2202cb0eef59dc7517716e6d5a580a9ce6b6be859b6b4cb599a3d6',
    },
    {
      logicalPath: 'image/shape',
      projectPath: 'assets/resources/original/shape.png',
      sha256: 'ca7bbc1fa5787a238c3fe2d5bdc92097bebb96623f806b69f043c2e17430ffed',
    },
  ],
  consumers: {
    roleBackground: 'original/post-unlock/bg1/spriteFrame',
    powerRoleP01Card: 'spine/PowerRoleP01Card/pao_paopaoshu',
    powerRoleP04: 'spine/PowerRoleP04/pao_kakaxi',
    powerRoleQualityAtlas: 'original/post-unlock/image_quality/spriteFrame + data/image-quality-frames.json',
    heroFairyGuiLayout: 'data/post-unlock-hero-layout.json',
    powerCoreP01: 'spine/PowerRoleP01Full/pao_paopaoshu',
    powerCoreP04: 'spine/PowerRoleP04Full/pao_kakaxi',
    powerRoleUpgradeGlow: 'spine/PowerRoleUpgradeGlow/chilunpy_shengjishanguang',
  },
  pendingBindings: [
    'spine/PowerRoleP02/P03 full and 0.75 models: configured paths are known but their lazy cache files have not been downloaded',
    'cj_xuedi: exact daily-snow-scene consumer is outside the current representative level',
  ],
};
const mapPath = resolve(project, 'assets/resources/data/post-unlock-resource-map.json');
writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ copied: copied.length, reused: map.reusedByteIdentical.length, mapPath }, null, 2));
