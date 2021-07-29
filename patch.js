// patch to enable node modules needed for crypto and webtorrent
// ojm delete this file?
const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/webpack/configs/browser.js';

fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  //ojm
  // var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true, path: true, https: true, http: true}');

  // fs.writeFile(f, result, 'utf8', function (err) {
  //   if (err) return console.log(err);
  // });
});