# Cocos import and build validation

## Before opening Creator

1. Read `package.json` and record the project Creator version.
2. Check whether the same project is already open.
3. Run the bundled static project checker.
4. Back up or commit a known project state when the repository is initialized.

## Import

Allow Creator to generate `.meta` files for new images, atlases, Spine files, and scenes.
Verify that each Spine triplet has matching base names and atlas texture references.

Do not copy a generated `library/`, `temp/`, or `build/` directory between machines as the
source of truth.

## TypeScript

Use the project's generated `temp/tsconfig.cocos.json`. When engine declarations contain
known environment-only failures, rerun with `--skipLibCheck true` and report that scope;
do not suppress errors from project scripts.

## Bounded build

Record the exact Creator executable, arguments, PID, start time, output directory, and
file activity. If a headless process stalls without logs or asset activity:

- confirm it is the process started by the task;
- stop only that PID and its orphaned children;
- keep pre-existing editor processes untouched;
- report static-check success separately from build success.
