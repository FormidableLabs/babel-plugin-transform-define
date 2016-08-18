const fs = require("fs");
const path = require("path");

const getReplacements = (configOptions) => {
  if (typeof configOptions === "object") { return configOptions; }

  // if opts are not an object, try to require the filepath
  try {
    const fullPath = path.join(process.cwd(), configOptions);
    fs.accessSync(fullPath, fs.F_OK);
    return require(fullPath);
  } catch (err) {
    console.error(`The nodePath: ${configOptions} is not valid.`); // eslint-disable-line
    throw new Error(err);
  }
};

export default function ({ types: t }) {
  return {
    visitor: {

      // process.env.NODE_ENV
      MemberExpression(nodePath, state) {
        const replacements = getReplacements(state.opts);
        const keys = Object.keys(replacements);

        for (let i = 0, len = keys.length; i < len; ++i) {
          const key = keys[i];

          if (nodePath.matchesPattern(key)) {
            nodePath.replaceWith(t.valueToNode(replacements[key]));

            if (nodePath.parentPath.isBinaryExpression()) {
              const result = nodePath.parentPath.evaluate();

              if (result.confident) {
                nodePath.parentPath.replaceWith(t.valueToNode(result.value));
              }
            }

            break;
          }
        }
      },

      Identifier(nodePath, state) {
        const replacements = getReplacements(state.opts);
        const keys = Object.keys(replacements);

        for (let i = 0, len = keys.length; i < len; ++i) {
          const key = keys[i];

          if (nodePath.node.name === key) {
            nodePath.replaceWith(t.valueToNode(replacements[key]));

            if (nodePath.parentPath.isBinaryExpression()) {
              const result = nodePath.parentPath.evaluate();

              if (result.confident) {
                nodePath.parentPath.replaceWith(t.valueToNode(result.value));
              }
            }

            break;
          }
        }
      },

      // typeof window
      UnaryExpression(nodePath, state) {
        if (nodePath.node.operator !== "typeof") {
          return;
        }
        const replacements = getReplacements(state.opts);
        const keys = Object.keys(replacements);
        const typeofValues = {};

        keys.forEach((key) => {
          if (key.substring(0, 7) === "typeof ") {
            typeofValues[key.substring(7)] = replacements[key];
          }
        });

        const argumentNames = Object.keys(typeofValues);

        for (let i = 0, len = argumentNames.length; i < len; ++i) {
          const argumentName = argumentNames[i];

          if (nodePath.node.argument.name === argumentName) {
            nodePath.replaceWith(t.valueToNode(typeofValues[argumentName]));

            if (nodePath.parentPath.isBinaryExpression()) {
              const result = nodePath.parentPath.evaluate();

              if (result.confident) {
                nodePath.parentPath.replaceWith(t.valueToNode(result.value));
              }
            }

            break;
          }
        }
      }

    }
  };
}
