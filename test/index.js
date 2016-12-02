"use strict";

const assertTransform = require("assert-transform");
const babel = require("babel-core");
const path = require("path");
const assert = require("assert");

const babelPluginTransformDefine = require("../lib/index.js");

const getBabelOps = (pluginOps) => {
  return {
    "presets": ["es2015"],
    "plugins": [
      [path.resolve(__dirname, "../lib/index.js"), pluginOps]
    ]
  };
};

describe("babel-plugin-transform-define", () => {
  before(function () {
    // TODO: WTF babel needs to warm up! This is Bullshit!
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
          "process": {
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
        "VERSION": "1.0.0",
        "PRODUCTION": true
      });

      return assertTransform(
        path.join(__dirname, "./identifier/actual.js"),
        path.join(__dirname, "./identifier/expected.js"), babelOpts);
    });

    it("should transform false", () => {
      const babelOpts = getBabelOps({
        "PRODUCTION": false
      });

      return assertTransform(
        path.join(__dirname, "./false/actual.js"),
        path.join(__dirname, "./false/expected.js"), babelOpts);
    })

    it("should transform 0", () => {
      const babelOpts = getBabelOps({
        "PRODUCTION": 0
      });

      return assertTransform(
        path.join(__dirname, "./0/actual.js"),
        path.join(__dirname, "./0/expected.js"), babelOpts);
    })

    it("should transform empty string", () => {
      const babelOpts = getBabelOps({
        "PRODUCTION": ''
      });

      return assertTransform(
        path.join(__dirname, "./emptyString/actual.js"),
        path.join(__dirname, "./emptyString/expected.js"), babelOpts);
    })

    it("should transform null", () => {
      const babelOpts = getBabelOps({
        "PRODUCTION": null
      });

      return assertTransform(
        path.join(__dirname, "./null/actual.js"),
        path.join(__dirname, "./null/expected.js"), babelOpts);
    })

    it("should transform undefined", () => {
      const babelOpts = getBabelOps({
        "PRODUCTION": undefined
      });

      return assertTransform(
        path.join(__dirname, "./undefined/actual.js"),
        path.join(__dirname, "./undefined/expected.js"), babelOpts);
    })

    it("should transform code from config in a file", () => {
      const babelOpts = getBabelOps("./test/load-config-file/config.js");

      return assertTransform(
        path.join(__dirname, "./load-config-file/actual.js"),
        path.join(__dirname, "./load-config-file/expected.js"), babelOpts);
    });
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
        assert.deepEqual(objectPaths, [ "process.env.NODE_ENV", "process.env", "process" ]);
      });
      it("should return a list sorted by length", () => {
        const obj = { process: { env: { NODE_ENV: "development" } } };
        const objectPaths = babelPluginTransformDefine.getSortedObjectPaths(obj);
        assert.deepEqual(objectPaths, objectPaths.sort((elem) => elem.length));
      });
    });
  });
});
