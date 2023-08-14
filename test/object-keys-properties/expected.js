"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var obj = {
  __DEV__: true
};
var obj1 = {
  __DEV__: "test"
};
var obj2 = {
  __DEV__: true
};
var obj3 = {
  "__DEV__": true
};

var obj4 = _defineProperty({}, "__DEV__", true);

var obj5 = _defineProperty({}, true, true);

var obj6 = _defineProperty({}, "true", "true");

var access = obj.__DEV__;
var access1 = obj["true"];
var access2 = obj["__DEV__"];