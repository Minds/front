import { run } from '../utils/run';

import { VERSION } from '../config';

export = (gulp, plugins) => cb => {
  run(`gulp build --aot --v=${VERSION}`, {}, false);
  run(`gulp build --aot --embed --v=${VERSION}`, {}, false);
  run(`gulp build --aot --shims --v=${VERSION}`, {}, false);
  run(`gulp build --aot --locales=all --v=${VERSION}`, {}, false);

  cb();
};
