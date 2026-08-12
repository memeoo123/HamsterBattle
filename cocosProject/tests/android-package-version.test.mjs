import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

for (const relativePath of [
    '../native/engine/android/app/build.gradle',
    '../native/engine/android/instantapp/build.gradle',
]) {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    assert.match(source, /versionCode 2\b/, `${relativePath} has an unambiguous update version code`);
    assert.match(source, /versionName "1\.0\.1"/, `${relativePath} exposes the fixed package version`);
}

console.log('android package version: 4 assertions passed');
