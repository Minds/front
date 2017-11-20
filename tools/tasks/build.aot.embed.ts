import { run } from '../utils/run';

import { VERSION } from '../config';

export = (gulp, plugins) => cb => {
  run(`node_modules/.bin/ngc -p tsconfig-embed-aot.json`, {}, false);
  run(`node_modules/.bin/rollup -c rollup-config-embed.ts -o public/js/build-embed-aot.${VERSION}.js`, {}, false);

  cb();
};
