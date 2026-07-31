# Unity analysis routing

## Establish the runtime

Corroborate Unity WebGL with loader/framework scripts, `.wasm`, data package names,
UnityPlugin configuration, or AssetBundle signatures. Record plugin and engine versions
separately.

## Reconstruct package paths

Trace values from configuration through:

1. package/subpackage selection;
2. compressed/uncompressed filename construction;
3. cache lookup;
4. CDN or plugin path mapping;
5. Unity loader invocation.

An HTTP 404 from a naïvely concatenated path disproves that URL only; it does not prove
the artifact is absent.

## Data and AssetBundles

Before assigning business meaning, identify the container and parse it with a pinned,
reviewed tool. Preserve bundle names, object/path IDs, type trees, dependencies, and
scene/prefab references.

Do not begin level-schema recovery until the data package or relevant AssetBundle has
been obtained and validated.

