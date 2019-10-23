"use strict";

/**
 * Dynamic example.
 *
 * Can use any of available `.babelrc.js` functionality to afford dynamic
 * behavior and overrides.
 */

const path = require("path");
const plugin = path.resolve(__dirname, "../../lib/index.js")

module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    [plugin, {
      "process.env.NODE_ENV": "development"
    }]
  ]
};
