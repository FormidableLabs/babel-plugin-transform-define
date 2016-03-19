# babel-plugin-transform-define

Inline arbitrary expressions and statically evaluate them if possible

## Example

### In

```js
// assuming { "process.env.NODE_ENV": "development" } is given in plugin options
process.env.NODE_ENV;
```

### Out

```js
"development";
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
