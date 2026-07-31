# Cocos analysis routing

## Engine and bundle evidence

Corroborate Cocos with settings files, `cocos-js`, asset-library conventions, bundle
versions, and runtime symbols. Record the Creator version when present.

Reconstruct remote bundle URLs from loader code, not by guessing CDN paths. Preserve:

- bundle name and version;
- config/import/native base paths;
- UUID compression/decompression rules;
- import and native version maps;
- request URL and response status.

## Module extraction

Use `capture-cocos-module-registry.js` and `extract-cocos-module-source.js` only against a
copied script. The isolated VM uses inert proxies; do not add network, filesystem-write,
or host-process capabilities to the sandbox.

Retain the source module name and original file path beside every derivative.

## Compact local data

Before `analyze-cocos-localdata.ps1`, verify the input is a ZIP and inspect entry names.
The decoder targets the observed string-dictionary/columnar table family. Validate:

- row/column length agreement;
- string dictionary bounds;
- foreign-key coverage;
- at least two records for every proposed semantic field.

Run schema-specific level-model scripts only when their expected table names exist.

## UI and animation evidence

For FairyGUI, retain the compressed package, decompressed bytes, item/component names,
atlas files, and rectangle mappings. Do not infer exact layout from atlas appearance.

For Spine, record binary version, atlas texture names, model scale, animation names, and
coordinate orientation. A matching runtime major/minor version is required before
declaring import compatibility.

