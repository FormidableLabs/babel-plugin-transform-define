"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {

      // process.env.NODE_ENV;
      MemberExpression: function MemberExpression(nodePath, state) {
        processNode(getReplacements(state.opts), nodePath, t.valueToNode, memberExpressionComparator);
      },


      // const x = { version: VERSION };
      Identifier: function Identifier(nodePath, state) {
        processNode(getReplacements(state.opts), nodePath, t.valueToNode, identifierComparator);
      },


      // typeof window
      UnaryExpression: function UnaryExpression(nodePath, state) {
        if (nodePath.node.operator !== "typeof") {
          return;
        }

        var replacements = getReplacements(state.opts);
        var keys = Object.keys(replacements);
        var typeofValues = {};

        keys.forEach(function (key) {
          if (key.substring(0, 7) === "typeof ") {
            typeofValues[key.substring(7)] = replacements[key];
          }
        });

        processNode(typeofValues, nodePath, t.valueToNode, unaryExpressionComparator);
      }
    }
  };
};

var fs = require("fs");
var path = require("path");
var traverse = require("traverse");

var _require = require("lodash"),
    get = _require.get,
    has = _require.has,
    find = _require.find;

/**
 * Return an Array of every possible non-cyclic path in the object as a dot separated string sorted
 * by length.
 *
 * Example:
 * getSortedObjectPaths({ process: { env: { NODE_ENV: "development" } } });
 * // => [ "process.env.NODE_ENV", "process.env" "process" ]
 *
 * @param  {Object}  obj  A plain JavaScript Object
 * @return {Array}  Sorted list of non-cyclic paths into obj
 */


var getSortedObjectPaths = exports.getSortedObjectPaths = function getSortedObjectPaths(obj) {
  if (!obj) {
    return [];
  }

  return traverse(obj).paths().filter(function (arr) {
    return arr.length;
  }).map(function (arr) {
    return arr.join(".");
  }).sort(function (elem) {
    return elem.length;
  });
};

/**
 *  `babel-plugin-transfor-define` take options of two types: static config and a path to a file that
 *  can define config in any way a user sees fit. getReplacements takes the options and will either
 *  return the static config or get the dynamic config from disk
 * @param  {Object|String}  configOptions  configuration to parse
 * @return {Object}  replacement object
 */
var getReplacements = function getReplacements(configOptions) {
  if ((typeof configOptions === "undefined" ? "undefined" : _typeof(configOptions)) === "object") {
    return configOptions;
  }

  try {
    var fullPath = path.join(process.cwd(), configOptions);
    fs.accessSync(fullPath, fs.F_OK);
    return require(fullPath);
  } catch (err) {
    console.error("The nodePath: " + configOptions + " is not valid."); // eslint-disable-line
    throw new Error(err);
  }
};

/**
 * Replace a node with a given value. If the replacement results in a BinaryExpression, it will be
 * evaluated. For example, if the result of the replacement is `var x = "production" === "production"`
 * The evaluation will make a second replacement resulting in `var x = true`
 * @param  {function}   replaceFn    The function used to replace the node
 * @param  {babelNode}  nodePath     The node to evaluate
 * @param  {*}          replacement  The value the node will be replaced with
 * @return {undefined}
 */
var replaceAndEvaluateNode = function replaceAndEvaluateNode(replaceFn, nodePath, replacement) {
  nodePath.replaceWith(replaceFn(replacement));

  if (nodePath.parentPath.isBinaryExpression()) {
    var result = nodePath.parentPath.evaluate();

    if (result.confident) {
      nodePath.parentPath.replaceWith(replaceFn(result.value));
    }
  }
};

/**
 * Finds the first replacement in sorted object paths for replacements that causes comparator
 * to return true.  If one is found, replaces the node with it.
 * @param  {Object}     replacements The object to search for replacements
 * @param  {babelNode}  nodePath     The node to evaluate
 * @param  {function}   replaceFn    The function used to replace the node
 * @param  {function}   comparator   The function used to evaluate whether a node matches a value in `replacements`
 * @return {undefined}
 */
var processNode = function processNode(replacements, nodePath, replaceFn, comparator) {
  // eslint-disable-line
  var replacementKey = find(getSortedObjectPaths(replacements), function (value) {
    return comparator(nodePath, value);
  });
  if (has(replacements, replacementKey)) {
    replaceAndEvaluateNode(replaceFn, nodePath, get(replacements, replacementKey));
  }
};

var memberExpressionComparator = function memberExpressionComparator(nodePath, value) {
  return nodePath.matchesPattern(value);
};
var identifierComparator = function identifierComparator(nodePath, value) {
  return nodePath.node.name === value;
};
var unaryExpressionComparator = function unaryExpressionComparator(nodePath, value) {
  return nodePath.node.argument.name === value;
};