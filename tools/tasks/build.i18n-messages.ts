import * as util from 'gulp-util';
import * as rimraf from 'rimraf';

import { exec } from 'child_process';

export = function buildI18nMessages(gulp, plugins, option) {
  return function () {
    return new Promise(function (resolve, reject) {
      exec('./node_modules/.bin/ng-xi18n -p angular-tsconfig.json', function (err, stdout, stderr) {
        if (err || (stderr && stderr.length > 1)) {
          reject(err || stderr);
        }

        rimraf('.ngcli-build/', function () {
          resolve(stdout);
        });
      });
    });
  }
}
