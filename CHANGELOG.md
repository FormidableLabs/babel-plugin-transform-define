# Changelog

## 2.1.4

### Patch Changes

- follow-up to last release, also prevent object properties from being replaced ([#88](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/88))

## 2.1.3

### Patch Changes

- Addresses #85, avoids replacing object keys. ([#86](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/86))

## 2.1.2

### Patch Changes

- Adding GitHub release workflow ([#83](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/83))

## 2.1.1

- Avoid replacements for variable bindings via [#82](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/82).

## 2.1.0

- Add memoization to `getSortedObjectPaths` utility for better performance under certain circumstances.

## 2.0.1

- _Bug_: Support ES module identifiers [#69](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/69), [#70](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/70) (_[@jdlm-stripe][]_)

## 2.0.0 (2019-10-23)

#### Breaking Changes

- Change plugin options to **only** be a real JS object. Removes string configuration path option as now this is all possible with dynamic `.babelrc.js` or `babel.config.js` files.
- Update to `@babel/core` / Babel 7+.
- Update `package.json:engines` to minimum Node 8.

#### Internal

- Lint all `test` code.

## 1.3.2 (2019-10-22)

- Various infrastructure updates [#54](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/54)
  - Add `CONTRIBUTING.md`, `yarn.lock`, `.npmignore`, update `.gitignore`.
  - Switch to `yarn` for workflows and `npm version` for release workflow.
- _Bug_: Fix sort comparator [#48](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/48)
- Add test for CallExpression identifiers [#35](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/35)
- Fixed Markdown headings [#42](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/42)

## 1.3.1 (2019-01-01)

- Update lodash to fix vulnerabilities

## 1.3.0 (2017-05-15)

#### User Facing Changes

- Support falsy replacement values [https://github.com/FormidableLabs/babel-plugin-transform-define/pull/33]

#### Internal

- Update eslint config and packages
- Update lodash version

## 1.2.0 (2016-08-25)

#### User Facing Changes

- Add the ability define config as a deep object
- Add a Code of Conduct

#### Internal

- Remove release scripts
- Rename `./modules` to `./src`
- Add keywords and contributors to `package.json`
- Remove author from `package.json` in favor of contributors
- Expand test coverage

## 1.1.0 (2016-08-19)

#### User Facing Changes

- Add the ability to get config from a file
- Add support for Identifiers
- Major improvements to the README.md

#### Internal

- Add tests
- Add lint
- Add JSDoc
- Add CI
- Add explicit LICENSE file
- Move dependencies into devDependencies
- Major refactors to DRY the code

## 1.0.0 (2016-03-21)

#### User Facing Changes

- Update README.md to reference Webpack's Define Plugin

## 1.0.0 (2016-03-21)

Initial Release

[@jdlm-stripe]: https://github.com/jdlm-stripe
