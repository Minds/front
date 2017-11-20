import { argv } from 'yargs';

import { run } from '../utils/run';

import { APP_SRC, VERSION } from '../config';
import { join } from 'path';
import * as glob from 'glob';

import { statSync } from 'fs';

export = (gulp, plugins) => cb => {
  const locales = argv.locales;

  if (locales === true || !locales) {
    return cb(Error('No locales specified. Please use --locales=XX,YY,ZZ or locales=all'));
  }

  let files: string[] = [];

  if (locales === 'all') {
    files = glob.sync(join(APP_SRC, 'locale', 'Minds.*.xliff'));
  } else {
    files = locales.split(',').map(locale => join(APP_SRC, 'locale', `Minds.${locale}.xliff`));
  }

  files.forEach(file => statSync(file));

  files.forEach(file => {
    let lang = (/Minds\.([a-z\-_]+)\.xliff/g).exec(file)[1];

    run(`gulp build --aot --locale=${lang} --v=${VERSION}`, {}, false);
  });

  cb();
};
