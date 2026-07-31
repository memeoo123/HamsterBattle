const fs = require('fs');
const zlib = require('zlib');

class Reader {
  constructor(buffer, start = 0, end = buffer.length) {
    this.buffer = buffer;
    this.pos = start;
    this.end = end;
  }
  ensure(count) {
    if (this.pos + count > this.end) throw new Error(`out of bounds at ${this.pos} + ${count}`);
  }
  u8() { this.ensure(1); return this.buffer.readUInt8(this.pos++); }
  u16() { this.ensure(2); const value = this.buffer.readUInt16BE(this.pos); this.pos += 2; return value; }
  u32() { this.ensure(4); const value = this.buffer.readUInt32BE(this.pos); this.pos += 4; return value; }
  i32() { this.ensure(4); const value = this.buffer.readInt32BE(this.pos); this.pos += 4; return value; }
  f32() { this.ensure(4); const value = this.buffer.readFloatBE(this.pos); this.pos += 4; return value; }
  string() {
    const length = this.u16();
    if (length === 0xffff) return null;
    this.ensure(length);
    const value = this.buffer.toString('utf8', this.pos, this.pos + length);
    this.pos += length;
    return value;
  }
  skip(count) { this.ensure(count); this.pos += count; }
}

function parseChild(reader, itemsById, strict = false) {
  const start = reader.pos;
  const objectType = reader.u8();
  const sourceId = reader.string();
  const sourcePackageId = reader.string();
  const constructedRaw = reader.u8();
  if (strict && constructedRaw > 1) throw new Error('invalid constructed flag');
  const constructed = constructedRaw === 1;
  const instanceId = reader.string();
  const name = reader.string();
  const x = reader.i32();
  const y = reader.i32();
  let width = null;
  let height = null;
  const sizeRaw = reader.u8();
  if (strict && sizeRaw > 1) throw new Error('invalid size flag');
  if (sizeRaw === 1) {
    width = reader.i32();
    height = reader.i32();
  }
  let minMax = null;
  const minMaxRaw = reader.u8();
  if (strict && minMaxRaw > 1) throw new Error('invalid min/max flag');
  if (minMaxRaw === 1) {
    minMax = {
      minWidth: reader.i32(), maxWidth: reader.i32(),
      minHeight: reader.i32(), maxHeight: reader.i32(),
    };
  }
  let scale = null;
  const scaleRaw = reader.u8();
  if (strict && scaleRaw > 1) throw new Error('invalid scale flag');
  if (scaleRaw === 1) scale = { x: reader.f32(), y: reader.f32() };
  let skew = null;
  const skewRaw = reader.u8();
  if (strict && skewRaw > 1) throw new Error('invalid skew flag');
  if (skewRaw === 1) skew = { x: reader.f32(), y: reader.f32() };
  let pivot = null;
  const pivotRaw = reader.u8();
  if (strict && pivotRaw > 1) throw new Error('invalid pivot flag');
  if (pivotRaw === 1) pivot = { x: reader.f32(), y: reader.f32(), asAnchor: reader.u8() === 1 };
  const alpha = reader.f32();
  const rotation = reader.f32();
  const visibleRaw = reader.u8();
  const touchableRaw = reader.u8();
  const grayedRaw = reader.u8();
  if (strict && (visibleRaw > 1 || touchableRaw > 1 || grayedRaw > 1)) throw new Error('invalid visibility flag');
  const visible = visibleRaw === 1;
  const touchable = touchableRaw === 1;
  const grayed = grayedRaw === 1;
  const blendMode = reader.u8();
  const filter = reader.u8();
  const data = reader.string();
  const source = sourceId ? itemsById.get(sourceId) : null;
  return {
    start,
    end: reader.pos,
    objectType,
    sourceId,
    sourcePackageId,
    sourceName: source?.name ?? null,
    constructed,
    instanceId,
    name,
    x,
    y,
    width: width ?? source?.width ?? null,
    height: height ?? source?.height ?? null,
    explicitSize: width !== null,
    minMax,
    scale,
    skew,
    pivot,
    alpha,
    rotation,
    visible,
    touchable,
    grayed,
    blendMode,
    filter,
    data,
  };
}

function isPlainString(value, maxLength = 80) {
  return value === null || (value.length <= maxLength && /^[\x20-\x7e]*$/.test(value));
}

function scanComponentChildren(raw, item, itemsById) {
  const candidates = [];
  const end = item.rawStart + item.rawLength;
  for (let start = item.rawStart; start < end; start++) {
    try {
      const reader = new Reader(raw, start, end);
      const child = parseChild(reader, itemsById, true);
      if (child.objectType > 18) continue;
      if (!isPlainString(child.sourceId, 40) || !isPlainString(child.sourcePackageId, 40)) continue;
      if (!isPlainString(child.instanceId, 80) || !isPlainString(child.name, 80)) continue;
      if (!child.name && !child.sourceId) continue;
      if (Math.abs(child.x) > 10000 || Math.abs(child.y) > 10000) continue;
      if (child.width !== null && (child.width < 0 || child.width > 10000)) continue;
      if (child.height !== null && (child.height < 0 || child.height > 10000)) continue;
      if (!Number.isFinite(child.alpha) || child.alpha < 0 || child.alpha > 10) continue;
      if (!Number.isFinite(child.rotation) || Math.abs(child.rotation) > 3600) continue;
      candidates.push(child);
      start = reader.pos - 1;
    } catch (_) {
      // Not a setup_beforeAdd record at this byte.
    }
  }
  return candidates;
}

function parseComponentLayout(raw, item, itemsById) {
  const reader = new Reader(raw, item.rawStart, item.rawStart + item.rawLength);
  const header = {
    value0: reader.u16(),
    value1: reader.u16(),
    value2: reader.u16(),
    childCount: reader.u16(),
  };
  const children = [];
  for (let i = 0; i < header.childCount; i++) children.push(parseChild(reader, itemsById));
  return {
    header,
    children,
    parsedBytes: reader.pos - item.rawStart,
    rawBytes: item.rawLength,
    trailingBytes: item.rawStart + item.rawLength - reader.pos,
  };
}

function main() {
  const source = process.argv[2];
  const output = process.argv[3];
  if (!source || !output) throw new Error('usage: node fgui_layout_extract.js <package.bin> <output.json>');
  const packed = fs.readFileSync(source);
  const raw = zlib.inflateSync(packed);
  const reader = new Reader(raw);
  const packageId = reader.string();
  const packageName = reader.string();
  const itemCount = reader.u16();
  const items = [];
  for (let index = 0; index < itemCount; index++) {
    const start = reader.pos;
    const type = reader.u8();
    const id = reader.string();
    const name = reader.string();
    if (type !== 3) break;
    const width = reader.i32();
    const height = reader.i32();
    const extension = reader.u8();
    const branchCount = reader.u8();
    const branches = [];
    for (let i = 0; i < branchCount; i++) branches.push(reader.string());
    const highResolutionCount = reader.u8();
    const highResolution = [];
    for (let i = 0; i < highResolutionCount; i++) highResolution.push(reader.string());
    const rawLength = reader.u32();
    const rawStart = reader.pos;
    reader.skip(rawLength);
    items.push({ index, start, type, id, name, width, height, extension, branches, highResolution, rawStart, rawLength });
  }
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const components = items.map((item) => ({
    ...item,
    layout: (() => {
      try {
        return parseComponentLayout(raw, item, itemsById);
      } catch (error) {
        return { parseError: error.message };
      }
    })(),
    scannedChildren: scanComponentChildren(raw, item, itemsById),
  }));
  const result = {
    source,
    compression: 'zlib',
    packedBytes: packed.length,
    rawBytes: raw.length,
    packageId,
    packageName,
    declaredItemCount: itemCount,
    parsedComponentCount: components.length,
    limitation: 'Parses the compact package component header and setup_beforeAdd child geometry. Controller, relation, gear, and transition tails remain unparsed.',
    components,
  };
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ output, packageId, packageName, itemCount, components: components.length }, null, 2));
}

main();
