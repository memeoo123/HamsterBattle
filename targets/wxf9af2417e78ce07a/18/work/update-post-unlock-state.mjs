import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const target = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const path = resolve(target, 'BATTLEFIELD_RESTORE_STATE.json');
const state = JSON.parse(readFileSync(path, 'utf8'));
const presentation = state.subsystems['presentation-and-feedback'];

for (const evidence of [
  'evidence/assets/original/post-unlock-cache-2026-08-18/manifest.json',
  'evidence/runtime/post-unlock-resource-integration-2026-08-18.md',
]) {
  if (!presentation.evidence.includes(evidence)) presentation.evidence.push(evidence);
}

const test = 'Post-unlock resource integration: exact hashes, two byte-identical reuses, three Spine triplets, role background, P04 list model, and HeroUpAniComp upgrade-glow linkage';
if (!presentation.tests.includes(test)) presentation.tests.push(test);
presentation.tests = presentation.tests.map((entry) =>
  entry.startsWith('Full regression 54/54,')
    ? 'Full regression 55/55, golden cases 47/47, Creator TypeScript pass, Cocos project 266 assets / 0 missing meta'
    : entry);

const addition = ' The 2026-08-18 post-unlock cache closes the out-of-battle role background, P04 list-model and role-upgrade-glow resource gaps; the FairyGUI package, quality atlas and snow-scene Spine remain preserved for exact future consumers.';
if (!presentation.notes.includes('post-unlock cache closes')) {
  presentation.notes = presentation.notes.replace(
    ' Fresh Creator 3.8.8 web-mobile captures have clean project consoles.',
    `${addition} Fresh Creator 3.8.8 web-mobile builds have clean project consoles.`,
  );
}
presentation.notes = presentation.notes.replace(
  'remaining gear glow, status/result feedback and H08/H0905 matched timing remain pending.',
  'the level-1004 battle gear glow, remaining status/result feedback and H08/H0905 matched timing remain pending.',
);

writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ evidence: presentation.evidence.length, tests: presentation.tests.length }, null, 2));
