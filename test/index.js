const assertTransform = require("assert-transform");
const babel = require("babel-core");
const path = require("path");

const getBabelOps = (pluginOps) => {
  return {
    "presets": ["es2015"],
    "plugins": [
      [path.resolve(__dirname, "../lib/index.js"), pluginOps || {
        // TODO: get rid of this when you fix the bug that prevents this from running with no config
        "test": true
      }]
    ]
  };
};

describe("babel-plugin-transform-define", () => {
  before(function () {
    // TODO: WTF babel needs to warm up! This is Bullshit!
    this.timeout(10000); // eslint-disable-line
    babel.transform("const x = 1;", getBabelOps());
  });

  it("should transform Member Expressions", () => {
    const babelOpts = getBabelOps({
      "process.env.NODE_ENV": "development"
    });

    return assertTransform(
      path.join(__dirname, "./member-expression/actual.js"),
      path.join(__dirname, "./member-expression/expected.js"), babelOpts);
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

  it("should transform code from config in a file", () => {
    const babelOpts = getBabelOps("./test/load-config-file/config.js");

    return assertTransform(
      path.join(__dirname, "./load-config-file/actual.js"),
      path.join(__dirname, "./load-config-file/expected.js"), babelOpts);
  });
});
