import { argv } from 'yargs';

import { run } from '../utils/run';

import { APP_SRC, VERSION } from '../config';
import { join } from 'path';
import { statSync } from 'fs';

export = (gulp, plugins) => cb => {
  const locale = argv.locale;

  if (locale === true || !locale) {
    return cb(Error('No locale specified. Please use --locale=XX'));
  }

  statSync(join(APP_SRC, 'locale', `Minds.${locale}.xliff`));

  run(`node_modules/.bin/ngc -p tsconfig-aot.json --i18nFile=./app/locale/Minds.${locale}.xliff --locale=${locale} --i18nFormat=xlf`, {}, false);
  run(`node_modules/.bin/rollup -c rollup-config.ts -o public/js/build-aot.${locale}.${VERSION}.js`, {}, false);

  cb();
};
