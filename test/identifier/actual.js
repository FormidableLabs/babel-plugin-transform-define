VERSION;

var x = {
  "version": VERSION
}

console.log(VERSION);

if (!PRODUCTION) {
  console.log('Debug info');
}
if (PRODUCTION) {
  console.log('Production log');
}
