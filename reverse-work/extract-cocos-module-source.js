const fs = require("fs");
const path = require("path");
const vm = require("vm");

const inputPath = process.argv[2];
const outputDirectory = process.argv[3];
const modulePatternText = process.argv[4];

if (!inputPath || !outputDirectory || !modulePatternText) {
  console.error(
    "usage: node extract-cocos-module-source.js <game.js> <output-dir> <module-regex>",
  );
  process.exit(2);
}

function makeNullProxy(label = "proxy") {
  const fn = function () {
    return proxy;
  };
  const proxy = new Proxy(fn, {
    get(_target, property) {
      if (property === Symbol.toPrimitive) {
        return (hint) => (hint === "number" ? 0 : label);
      }
      if (property === "toString") return () => label;
      if (property === "valueOf") return () => 0;
      return proxy;
    },
    set() {
      return true;
    },
    apply() {
      return proxy;
    },
    construct() {
      return proxy;
    },
  });
  return proxy;
}

function extractOuterVariableNames(source) {
  const marker = '"use strict";var ';
  const start = source.indexOf(marker);
  if (start < 0) throw new Error("outer variable declaration was not found");
  const namesStart = start + marker.length;
  const namesEnd = source.indexOf(";", namesStart);
  if (namesEnd < 0) throw new Error("outer variable declaration is incomplete");
  return [
    ...new Set(
      source
        .slice(namesStart, namesEnd)
        .split(",")
        .map((name) => name.trim())
        .filter((name) => /^[A-Za-z_$][\w$]*$/.test(name)),
    ),
  ];
}

function injectVariableCapture(source, names) {
  const marker = '}); \trequire("subpackages/game/game.js");';
  const offset = source.lastIndexOf(marker);
  if (offset < 0) throw new Error("game package wrapper end was not found");
  const entries = names.map((name) => `${JSON.stringify(name)}:${name}`).join(",");
  return `${source.slice(0, offset)}globalThis.__fortifyVars={${entries}};\n${source.slice(offset)}`;
}

function replaceComputedProperties(functionSource, primitiveVariables) {
  return functionSource.replace(
    /\[\s*([A-Za-z_$][\w$]*)\s*\]/g,
    (whole, identifier) => {
      if (identifier.length < 2) return whole;
      if (!Object.prototype.hasOwnProperty.call(primitiveVariables, identifier)) {
        return whole;
      }
      return `[${JSON.stringify(primitiveVariables[identifier])}]`;
    },
  );
}

const originalSource = fs.readFileSync(inputPath, "utf8");
const outerVariableNames = extractOuterVariableNames(originalSource);
const source = injectVariableCapture(originalSource, outerVariableNames);
const modulePattern = new RegExp(modulePatternText, "i");
const factories = new Map();
const moduleCache = new Map();
const registrations = [];
const nullProxy = makeNullProxy();

const sandbox = {
  console: {
    log() {},
    warn() {},
    error() {},
    info() {},
    debug() {},
  },
  GameGlobal: {},
  wx: nullProxy,
  setTimeout() {
    return 0;
  },
  clearTimeout() {},
  setInterval() {
    return 0;
  },
  clearInterval() {},
};

sandbox.System = new Proxy(
  {},
  {
    get(_target, method) {
      return (...args) => {
        const name = typeof args[0] === "string" ? args[0] : null;
        if (!name || !modulePattern.test(name)) return;
        registrations.push({
          method: String(method),
          name,
          dependencies: Array.isArray(args[1]) ? args[1] : [],
          declarationSource:
            typeof args[2] === "function" ? args[2].toString() : null,
        });
      };
    },
  },
);

sandbox.define = (name, factory) => factories.set(name, factory);
sandbox.require = (name) => {
  if (!factories.has(name)) return nullProxy;
  if (moduleCache.has(name)) return moduleCache.get(name).exports;
  const module = { exports: {} };
  moduleCache.set(name, module);
  factories.get(name)(sandbox.require, module, module.exports);
  return module.exports;
};
sandbox.global = sandbox;
sandbox.globalThis = sandbox;
sandbox.window = sandbox;
sandbox.self = sandbox;

vm.runInNewContext(source, sandbox, {
  filename: inputPath,
  timeout: 15000,
  displayErrors: true,
});

const primitiveVariables = {};
for (const [name, value] of Object.entries(sandbox.__fortifyVars || {})) {
  if (
    value === null ||
    ["string", "number", "boolean"].includes(typeof value)
  ) {
    primitiveVariables[name] = value;
  }
}

fs.mkdirSync(outputDirectory, { recursive: true });
const manifest = [];
for (const registration of registrations) {
  const baseName = path
    .basename(registration.name)
    .replace(/[^A-Za-z0-9_.-]/g, "_");
  const outputPath = path.join(outputDirectory, `${baseName}.deobfuscated.js`);
  const deobfuscated = replaceComputedProperties(
    registration.declarationSource,
    primitiveVariables,
  );
  const header = [
    `// Module: ${registration.name}`,
    `// Dependencies: ${registration.dependencies.join(", ")}`,
    "",
  ].join("\n");
  fs.writeFileSync(outputPath, `${header}${deobfuscated}\n`, "utf8");
  manifest.push({
    name: registration.name,
    dependencies: registration.dependencies,
    outputPath,
    sourceBytes: Buffer.byteLength(deobfuscated),
  });
}

const variablePath = path.join(outputDirectory, "primitive-variables.json");
fs.writeFileSync(
  variablePath,
  `${JSON.stringify(primitiveVariables, null, 2)}\n`,
  "utf8",
);

process.stdout.write(
  `${JSON.stringify(
    {
      sourceBytes: Buffer.byteLength(originalSource),
      outerVariableCount: outerVariableNames.length,
      primitiveVariableCount: Object.keys(primitiveVariables).length,
      moduleCount: manifest.length,
      modules: manifest,
      variablePath,
    },
    null,
    2,
  )}\n`,
);
