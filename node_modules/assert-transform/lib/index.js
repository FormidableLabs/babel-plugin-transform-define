"use strict";

var _ = require("lodash");
var babel = require("babel-core");
var colors = require("colors/safe");
var jsdiff = require("diff");
var Promise = require("bluebird");

var fs = Promise.promisifyAll(require("fs"));

var getDiff = function getDiff(obj) {
  return jsdiff.diffTrimmedLines(obj.actual, obj.expected);
};

var generateErrorMessage = function generateError(diff) {
  return diff.map(function (part) {
    var color = "grey";
    if (part.added) {
      color = "green";
    }
    if (part.removed) {
      color = "red";
    }

    return colors[color](part.value);
  }).reduce(function (previousValue, currentValue) {
    previousValue += currentValue;
    return previousValue;
  }, "");
};

// TODO: Allow initial / expected to be Strings
module.exports = function (initial, expected, babelConfig) {
  var config = _.extend({}, babelConfig, {
    filename: initial
  });

  return Promise.props({
    actual: fs.readFileAsync(initial, "utf8").then(_.partialRight(babel.transform, config)).then(function (result) {
      return result.code;
    }).then(_.trim),
    expected: fs.readFileAsync(expected, "utf8").then(_.trim)
  }).then(getDiff).then(function (diff) {
    if (diff.length === 1) {
      return true;
    } else {
      throw new Error(generateErrorMessage(diff));
    }
  });
};