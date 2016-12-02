'use strict';

var x = undefined;

if (!undefined) {
  console.log('Debug info');
}
if (undefined) {
  console.log('Production log');
}
