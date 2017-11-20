import { run } from '../utils/run';

import { VERSION } from '../config';

export = (gulp, plugins) => cb => {
  run(`node_modules/.bin/ngc -p tsconfig-aot.json`, {}, false);
  run(`node_modules/.bin/rollup -c rollup-config.ts -o public/js/build-aot.${VERSION}.js`, {}, false);

  cb();
};
