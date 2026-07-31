const fs = require("fs");
const vm = require("vm");

const inputPath = process.argv[2];
const filterText = process.argv[3];
if (!inputPath) {
  console.error("usage: node capture-cocos-module-registry.js <game.js> [name-regex]");
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

const source = fs.readFileSync(inputPath, "utf8");
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
        registrations.push({
          method: String(method),
          name: typeof args[0] === "string" ? args[0] : null,
          dependencies: Array.isArray(args[1]) ? args[1] : [],
          argumentTypes: args.map((value) =>
            Array.isArray(value) ? "array" : typeof value,
          ),
        });
      };
    },
  },
);

sandbox.define = (name, factory) => {
  factories.set(name, factory);
};

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

const named = registrations.filter((entry) => entry.name);
const keywordPattern =
  /battle|fight|monster|enemy|trunk|instance|round|level|stage|config|table|hero|reward/i;
const requestedPattern = filterText ? new RegExp(filterText, "i") : keywordPattern;
const selected = named.filter(
  (entry) =>
    requestedPattern.test(entry.name) ||
    entry.dependencies.some((dependency) =>
      requestedPattern.test(String(dependency)),
    ),
);

process.stdout.write(
  `${JSON.stringify(
    {
      sourceBytes: Buffer.byteLength(source),
      registrationCount: registrations.length,
      namedRegistrationCount: named.length,
      methods: [...new Set(registrations.map((entry) => entry.method))].sort(),
      selectedRegistrationCount: selected.length,
      selectedRegistrations: selected,
      registrations: filterText ? undefined : named,
    },
    null,
    2,
  )}\n`,
);


