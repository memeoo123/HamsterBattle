const fs = require("fs");
const path = require("path");

const targetRoot = process.argv[2];
if (!targetRoot) {
  console.error("usage: node analyze-cocos-static.js <unpacked-target-root>");
  process.exit(2);
}

const files = [
  path.join(targetRoot, "main", "game.js"),
  path.join(
    targetRoot,
    "subpackages-game",
    "subpackages",
    "game",
    "game.js",
  ),
];

const keywordGroups = {
  level: [
    "level",
    "stage",
    "chapter",
    "checkpoint",
    "guanqia",
    "guanka",
    "关卡",
    "章节",
  ],
  map: ["map", "tile", "scene", "world", "地图"],
  config: ["config", "table", "json", "csv", "excel", "schema"],
  gameplay: [
    "player",
    "monster",
    "enemy",
    "role",
    "hero",
    "battle",
    "fight",
    "reward",
    "task",
    "quest",
  ],
  network: ["http://", "https://", "wss://", "/api/", "login", "server"],
};

function uniqueMatches(text, regex, groupIndex = 1) {
  const found = new Set();
  for (const match of text.matchAll(regex)) {
    const value = match[groupIndex];
    if (value) found.add(value);
  }
  return [...found].sort();
}

function extractStrings(text) {
  const values = new Set();
  const patterns = [
    /"((?:\\.|[^"\\]){3,240})"/g,
    /'((?:\\.|[^'\\]){3,240})'/g,
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      let value = match[1];
      value = value
        .replace(/\\(["'\\/bfnrt])/g, "$1")
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16)),
        );
      if (!/[\r\n]/.test(value)) values.add(value);
    }
  }
  return [...values];
}

const report = {};
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const strings = extractStrings(text);
  const keywordStrings = {};
  for (const [group, keywords] of Object.entries(keywordGroups)) {
    keywordStrings[group] = strings
      .filter((value) => {
        const lower = value.toLowerCase();
        return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
      })
      .filter((value) => value.length <= 180)
      .sort()
      .slice(0, 250);
  }

  report[path.relative(targetRoot, file)] = {
    bytes: Buffer.byteLength(text),
    systemRegisterNames: uniqueMatches(
      text,
      /System\.register\s*\(\s*["']([^"']+)["']/g,
    ),
    defineNames: uniqueMatches(text, /\bdefine\s*\(\s*["']([^"']+)["']/g),
    requirePaths: uniqueMatches(text, /\brequire\s*\(\s*["']([^"']+)["']/g),
    urlStrings: strings
      .filter((value) => /^(?:https?|wss):\/\//i.test(value))
      .sort(),
    keywordStrings,
  };
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
