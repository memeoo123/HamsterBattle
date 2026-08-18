import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const directory = process.argv[2];
if (!directory) throw new Error('usage: node inspect-mp3-durations.mjs <cache-directory>');

const mpeg1Layer3Rates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
const mpeg2Layer3Rates = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
const sampleRates = {
  3: [44100, 48000, 32000],
  2: [22050, 24000, 16000],
  0: [11025, 12000, 8000],
};

function inspectMp3(path) {
  const bytes = readFileSync(path);
  let offset = 0;
  if (bytes.subarray(0, 3).toString('ascii') === 'ID3' && bytes.length >= 10) {
    const size = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14)
      | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
    offset = 10 + size;
  }
  let duration = 0;
  let frames = 0;
  let payloadBytes = 0;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff || (bytes[offset + 1] & 0xe0) !== 0xe0) {
      if (frames > 0) break;
      offset++;
      continue;
    }
    const version = (bytes[offset + 1] >> 3) & 0x03;
    const layer = (bytes[offset + 1] >> 1) & 0x03;
    const bitrateIndex = (bytes[offset + 2] >> 4) & 0x0f;
    const sampleIndex = (bytes[offset + 2] >> 2) & 0x03;
    const padding = (bytes[offset + 2] >> 1) & 0x01;
    if (version === 1 || layer !== 1 || bitrateIndex === 0 || bitrateIndex === 15 || sampleIndex === 3) {
      if (frames > 0) break;
      offset++;
      continue;
    }
    const rate = (version === 3 ? mpeg1Layer3Rates : mpeg2Layer3Rates)[bitrateIndex];
    const sampleRate = sampleRates[version][sampleIndex];
    const samples = version === 3 ? 1152 : 576;
    const frameLength = Math.floor((version === 3 ? 144000 : 72000) * rate / sampleRate) + padding;
    if (offset + frameLength > bytes.length) break;
    duration += samples / sampleRate;
    frames++;
    payloadBytes += frameLength;
    offset += frameLength;
  }
  return {
    bytes: bytes.length,
    frames,
    durationSeconds: Number(duration.toFixed(6)),
    averageKbps: duration > 0 ? Number((payloadBytes * 8 / duration / 1000).toFixed(2)) : 0,
  };
}

const results = readdirSync(directory)
  .filter((name) => name.toLowerCase().endsWith('.mp3'))
  .sort()
  .map((name) => ({ name, ...inspectMp3(resolve(directory, name)) }));
console.log(JSON.stringify(results, null, 2));
