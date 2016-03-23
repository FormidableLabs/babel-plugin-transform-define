# babel-plugin-transform-define

Replace member expressions and typeof statements with strings and statically evaluate them if possible, like [webpack's `DefinePlugin`](https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin) for Babel.

## Example

### In

```js
// assuming options are { "process.env.NODE_ENV": "development", "typeof window": "object" }
process.env.NODE_ENV;
process.env.NODE_ENV === "development";
typeof window;
typeof window === "object";
```

### Out

```js
'development';
true;
'object';
true;
```

## Installation

```sh
$ npm install babel-plugin-transform-define
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-define", {
    "process.env.NODE_ENV": "production",
    "typeof window": "object"
  }]
}
```

You can also declare your defines via a module:

```json
{
  "plugins": ["transform-define", "./path/to/defines"]
}
```

The plugin will load the module at that path and use any values exported by it as replacements.

### Via CLI

```sh
$ babel --plugins transform-define script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-define", {
    "process.env.NODE_ENV": "production",
    "typeof window": "object"
  }]
});
```
