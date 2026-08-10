const fs = require('fs');
const path = require('path');
const vm = require('vm');

const inputPath = process.argv[2];
const outputDirectory = process.argv[3];
const modulePatternText = process.argv[4];

if (!inputPath || !outputDirectory || !modulePatternText) {
    console.error('usage: node extract-main-asset-modules.js <main-game.js> <output-dir> <module-regex>');
    process.exit(2);
}

function makeNullProxy(label = 'proxy') {
    const fn = function () { return proxy; };
    const proxy = new Proxy(fn, {
        get(_target, property) {
            if (property === Symbol.toPrimitive) return (hint) => hint === 'number' ? 0 : label;
            if (property === 'toString') return () => label;
            if (property === 'valueOf') return () => 0;
            return proxy;
        },
        set() { return true; },
        apply() { return proxy; },
        construct() { return proxy; },
    });
    return proxy;
}

function replaceComputedProperties(functionSource, primitiveVariables) {
    return functionSource.replace(/\[\s*([A-Za-z_$][\w$]*)\s*\]/g, (whole, identifier) => {
        if (identifier.length < 2 || !Object.prototype.hasOwnProperty.call(primitiveVariables, identifier)) return whole;
        return `[${JSON.stringify(primitiveVariables[identifier])}]`;
    });
}

const originalSource = fs.readFileSync(inputPath, 'utf8');
const source = originalSource.replace(/require\("game\.js"\);\s*$/, '');
const factories = new Map();
const moduleCache = new Map();
const registrations = [];
const nullProxy = makeNullProxy();
const sandbox = {
    console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
    GameGlobal: {},
    wx: nullProxy,
    setTimeout() { return 0; },
    clearTimeout() {},
    setInterval() { return 0; },
    clearInterval() {},
};

sandbox.System = new Proxy({}, {
    get(_target, method) {
        return (...args) => {
            const named = typeof args[0] === 'string';
            const declarationIndex = named ? 2 : 1;
            registrations.push({
                method: String(method),
                name: named ? args[0] : null,
                dependencies: Array.isArray(args[named ? 1 : 0]) ? args[named ? 1 : 0] : [],
                declarationSource: typeof args[declarationIndex] === 'function' ? args[declarationIndex].toString() : null,
            });
        };
    },
});
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

vm.runInNewContext(source, sandbox, { filename: inputPath, timeout: 15000, displayErrors: true });

const assetFactoryName = [...factories.keys()].find((name) => /^assets\/main\/index\..+\.js$/.test(name));
if (!assetFactoryName) throw new Error('assets/main factory was not found');
const factorySource = factories.get(assetFactoryName).toString();
const declarationMatch = factorySource.match(/^[^{]*\{\s*["']use strict["'];var ([^;]+);/);
if (!declarationMatch) throw new Error('assets/main variable declaration was not found');
const variableNames = [...new Set(declarationMatch[1].split(',').map((part) => {
    const match = part.trim().match(/^([A-Za-z_$][\w$]*)/);
    return match ? match[1] : null;
}).filter(Boolean))];
const captureExpression = `globalThis.__mainAssetVars={};Object.defineProperties(globalThis.__mainAssetVars,{${variableNames.map((name) => `${JSON.stringify(name)}:{enumerable:true,get:()=>${name}}`).join(',')}});`;
const closingBrace = factorySource.lastIndexOf('}');
const instrumentedSource = `${factorySource.slice(0, closingBrace)}${captureExpression}${factorySource.slice(closingBrace)}`;
const instrumentedFactory = vm.runInNewContext(`(${instrumentedSource})`, sandbox, { timeout: 15000 });
instrumentedFactory(sandbox.require, { exports: {} }, {});

const primitiveVariables = {};
for (const [name, value] of Object.entries(sandbox.__mainAssetVars || {})) {
    if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) primitiveVariables[name] = value;
}

const modulePattern = new RegExp(modulePatternText, 'i');
const selected = registrations.filter((entry) => entry.name && modulePattern.test(entry.name));
fs.mkdirSync(outputDirectory, { recursive: true });
const manifest = [];
for (const registration of selected) {
    const outputPath = path.join(outputDirectory, `${path.basename(registration.name).replace(/[^A-Za-z0-9_.-]/g, '_')}.deobfuscated.js`);
    const body = replaceComputedProperties(registration.declarationSource, primitiveVariables);
    fs.writeFileSync(outputPath, `// Module: ${registration.name}\n// Dependencies: ${registration.dependencies.join(', ')}\n(${body});\n`, 'utf8');
    manifest.push({ name: registration.name, dependencies: registration.dependencies, outputPath, sourceBytes: Buffer.byteLength(body) });
}

fs.writeFileSync(path.join(outputDirectory, 'main-asset-primitive-variables.json'), `${JSON.stringify(primitiveVariables, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(outputDirectory, 'main-asset-registration-manifest.json'), `${JSON.stringify(registrations.map(({ method, name, dependencies }) => ({ method, name, dependencies })), null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ assetFactoryName, registrationCount: registrations.length, namedRegistrationCount: registrations.filter((entry) => entry.name).length, primitiveVariableCount: Object.keys(primitiveVariables).length, moduleCount: manifest.length, modules: manifest }, null, 2)}\n`);
