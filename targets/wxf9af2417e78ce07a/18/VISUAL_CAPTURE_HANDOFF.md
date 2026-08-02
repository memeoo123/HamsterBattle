# Visual capture handoff

Updated: 2026-08-02

## Current state

- Active target: `wxf9af2417e78ce07a/18`
- Representative level: `1004 / 荒漠沙地`, 15 waves, `750 × 1334`
- Orchestration phase: `validation / in_progress`
- Formal orchestration blocker: `check:visualBaseline`
- Original and reconstruction manifests remain under `evidence/visual/`.

## Priority decision

Visual fidelity is intentionally postponed while mechanics and data remain incomplete.
Resume from `MECHANICS_DATA_HANDOFF.md`; do not spend the next work slice on exact H0905
frame speed/audio volume, typography, pixel layout, or other cosmetic differences.

## Conditions for resuming matched visual work

1. H11 and the representative-level relevant ability consumers are implemented.
2. First-core-contact, same-frame event order and RNG ordering are traceable.
3. Deploy → wave 15 → victory and defeat → retry integration flows pass without manual
   state edits.
4. A competitor save/account state is available that matches loadout, HP, wave and relevant
   hero stars.

After those conditions, compare the same state and timestamp. Fix gameplay-trace divergence
before animation, effect, audio, font or layout polish. Do not mark `visualBaseline` pass
until matched evidence is saved and cited.

