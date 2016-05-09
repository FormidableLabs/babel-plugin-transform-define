import * as fs from 'fs';
import * as path from 'path';
import childProcess from 'child_process';

let projectRoot;
const cachedReplacements = {};

/**
 * opts can either be an object of expressions and values to replace them with,
 * or it can be a path of a module to load that exports expressions and values.
 */
export function expandReplacements(replacementsOrModulePath) {
  if (typeof replacementsOrModulePath !== 'string') {
    return replacementsOrModulePath;
  }
  const modulePath = replacementsOrModulePath;
  if (cachedReplacements[modulePath]) {
    return cachedReplacements[modulePath];
  }
  if (!projectRoot) {
    projectRoot = findProjectRoot();
  }

  // Allow Babel-parsed modules.
  require('babel-register')

  let replacements = require(path.resolve(projectRoot, modulePath))
  // Support es6 style modules with default exports.
  if (replacements.__esModule && replacements.default) {
    replacements = replacements.default;
  }

  cachedReplacements[modulePath] = replacements;
  return cachedReplacements[modulePath];
}

/**
 * Unfortunately, Babel doesn't give us anything like a project root, so we have
 * to guess it as best we can by searching up from the current directory.
 *
 * This follows Babel's logic for finding 'em:
 * https://github.com/babel/babel/blob/v6.7.4/packages/babel-core/src/transformation/file/options/option-manager.js#L355-L389
 */
function findProjectRoot() {
  let loc = path.join(process.cwd(), 'temp');
  while (loc !== (loc = path.dirname(loc))) {
    const configLoc = path.join(loc, '.babelrc');
    if (fs.statSync(configLoc).isFile()) {
      return path.dirname(configLoc);
    }

    const pkgLoc = path.join(loc, 'package.json');
    if (fs.statSync(pkgLoc).isFile()) {
      try {
        if ('babel' in require(pkgLoc)) {
          return path.dirname(pkgLoc)
        }
      } catch (error) {
        // silent.
      }
    }
  }

  // We shouldn't be able to get here; but just in case:
  console.warn('Unable to determine project root; assuming it is the current dir');
  return process.cwd();
}
