import {join} from 'path';
import {APP_SRC, APP_DEST, AUTOPREFIXER_BROWSERS} from '../config';

export = function buildSass(gulp, plugins, option) {
  return function () {
    return gulp.src(join(APP_SRC, '**', '*.scss'))
      .pipe(plugins.cssGlobbing({  extensions: ['.scss'] }))
      .pipe(plugins.sass({
        includePaths:[join(APP_SRC, 'stylesheets')],
        style: 'compressed'
      }).on('error', plugins.sass.logError))
      .pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(gulp.dest(APP_DEST));
  };
}
