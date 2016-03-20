# babel-plugin-transform-replace

Inline arbitrary expressions and statically evaluate them if possible

## Example

### In

```js
// assuming options are { "process.env.NODE_ENV": '"development"', "typeof window": '"object"' }
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
$ npm install babel-plugin-transform-replace
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-replace", {
    "process.env.NODE_ENV": "production",
    "typeof window": "object"
  }]
}
```

### Via CLI

```sh
$ babel --plugins transform-replace script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-replace", {
    "process.env.NODE_ENV": "production",
    "typeof window": "object"
  }]
});
```
