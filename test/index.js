"use strict";

const path = require("path");
const assert = require("assert");
const fs = require("fs");
const { EOL } = require("os");
const { promisify } = require("util");

const babel = require("@babel/core");
const jsdiff = require("diff");
const chalk = require("chalk");

const babelPluginTransformDefine = require("../lib/index.js");

const readFile = promisify(fs.readFile);
const splitLines = ({ value }, fn) => value
  .split(EOL)
  .map((line, idx, lines) => line === "" && idx === lines.length - 1 ? "" : fn(line))
  .join(EOL);

const assertTransform = async (initial, expected, opts) => {
  const transformOpts = {
    ...opts,
    // Specify filename to pick up local `.babelrc.js`
    // https://babeljs.io/docs/en/options#babelrc
    filename: initial
  };

  // Note: We trim + EOL to normalize whitespace + give readable error diffs
  const [actualCode, expectedCode] = await Promise.all([
    readFile(initial).then((code) => babel.transform(code, transformOpts).code.trim() + EOL),
    readFile(expected).then((buf) => buf.toString().trim() + EOL)
  ]);

  const diff = jsdiff.diffLines(actualCode, expectedCode);
  // Consider no diff or newline-only diff to be "the same".
  const changes = diff.filter(({ added, removed, value }) => (added || removed) && value.trim());
  if (changes.length === 0) {
    return true;
  }

  const msg = diff
    .map((obj) => {
      if (obj.added) { return splitLines(obj, (line) => chalk `{green +${line}}`); }
      if (obj.removed) { return splitLines(obj, (line) => chalk `{red -${line}}`); }
      return splitLines(obj, (line) => chalk `{grey  ${line}}`);
    })
    .join("");

  throw new Error(chalk `{white Difference found ({green actual}, {red expected}): ${EOL}}${msg}`);
};

const getBabelOps = (pluginOps) => ({
  presets: ["@babel/preset-env"],
  plugins: [
    [path.resolve(__dirname, "../lib/index.js"), pluginOps]
  ]
});

describe("babel-plugin-transform-define", () => {
  before(function () {
    // TODO: See if needed. Previously here to warm up babel for tests.
    this.timeout(10000); // eslint-disable-line
    babel.transform("const x = 1;", getBabelOps());
  });

  describe("transformation tests", () => {
    describe("Member Expressions", () => {
      it("should transform with config defined by String keys", () => {
        const babelOpts = getBabelOps({
          "process.env.NODE_ENV": "development"
        });

        return assertTransform(
          path.join(__dirname, "./member-expression/actual.js"),
          path.join(__dirname, "./member-expression/expected.js"), babelOpts);
      });

      it("should transform with config defined by an Object", () => {
        const babelOpts = getBabelOps({
          process: {
            env: {
              NODE_ENV: "development"
            }
          }
        });

        return assertTransform(
          path.join(__dirname, "./member-expression/actual.js"),
          path.join(__dirname, "./member-expression/expected.js"), babelOpts);
      });
    });

    it("should transform Unary Expressions", () => {
      const babelOpts = getBabelOps({
        "typeof window": "object"
      });

      return assertTransform(
        path.join(__dirname, "./unary-expression/actual.js"),
        path.join(__dirname, "./unary-expression/expected.js"), babelOpts);
    });

    it("should transform Identifiers", () => {
      const babelOpts = getBabelOps({
        VERSION: "1.0.0",
        PRODUCTION: true
      });

      return assertTransform(
        path.join(__dirname, "./identifier/actual.js"),
        path.join(__dirname, "./identifier/expected.js"), babelOpts);
    });

    it("should transform false", () => {
      const babelOpts = getBabelOps({
        PRODUCTION: false
      });

      return assertTransform(
        path.join(__dirname, "./false/actual.js"),
        path.join(__dirname, "./false/expected.js"), babelOpts);
    });

    it("should transform 0", () => {
      const babelOpts = getBabelOps({
        PRODUCTION: 0
      });

      return assertTransform(
        path.join(__dirname, "./0/actual.js"),
        path.join(__dirname, "./0/expected.js"), babelOpts);
    });

    it("should transform empty string", () => {
      const babelOpts = getBabelOps({
        PRODUCTION: ""
      });

      return assertTransform(
        path.join(__dirname, "./emptyString/actual.js"),
        path.join(__dirname, "./emptyString/expected.js"), babelOpts);
    });

    it("should transform null", () => {
      const babelOpts = getBabelOps({
        PRODUCTION: null
      });

      return assertTransform(
        path.join(__dirname, "./null/actual.js"),
        path.join(__dirname, "./null/expected.js"), babelOpts);
    });

    it("should transform undefined", () => {
      const babelOpts = getBabelOps({
        PRODUCTION: undefined
      });

      return assertTransform(
        path.join(__dirname, "./undefined/actual.js"),
        path.join(__dirname, "./undefined/expected.js"), babelOpts);
    });

    it("should transform code from dynamic .babelrc.js", () => assertTransform(
      path.join(__dirname, "./load-dynamic-babelrc/actual.js"),
      path.join(__dirname, "./load-dynamic-babelrc/expected.js")
    ));
  });

  describe("unit tests", () => {
    describe("getSortedObjectPaths", () => {
      it("should return an array", () => {
        let objectPaths = babelPluginTransformDefine.getSortedObjectPaths(null);
        assert(Array.isArray(objectPaths));
        objectPaths = babelPluginTransformDefine.getSortedObjectPaths(undefined);
        assert(Array.isArray(objectPaths));
        objectPaths = babelPluginTransformDefine.getSortedObjectPaths();
        assert(Array.isArray(objectPaths));
        objectPaths = babelPluginTransformDefine.getSortedObjectPaths({});
        assert(Array.isArray(objectPaths));
        objectPaths = babelPluginTransformDefine.getSortedObjectPaths({ process: "env" });
        assert(Array.isArray(objectPaths));
      });

      it("should return a complete list of paths", () => {
        const obj = { process: { env: { NODE_ENV: "development" } } };
        const objectPaths = babelPluginTransformDefine.getSortedObjectPaths(obj);
        assert.deepEqual(objectPaths, ["process.env.NODE_ENV", "process.env", "process"]);
      });

      it("should return a list sorted by length", () => {
        const obj = { process: { env: { NODE_ENV: "development" } } };
        const objectPaths = babelPluginTransformDefine.getSortedObjectPaths(obj);
        assert.deepEqual(objectPaths, objectPaths.sort((a, b) => b.length - a.length));
      });
    });
  });
});
