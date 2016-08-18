VERSION;

var x = {
  "version": VERSION
}

if (!PRODUCTION) {
  console.log('Debug info');
}
if (PRODUCTION) {
  console.log('Production log');
}
