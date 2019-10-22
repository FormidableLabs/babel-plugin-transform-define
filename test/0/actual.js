"use strict";

const x = PRODUCTION;

if (!PRODUCTION) {
  console.log("Debug info");
}

if (PRODUCTION) {
  console.log("Production log");
}
