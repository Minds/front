import {join} from 'path';
import {APP_SRC, APP_DEST} from '../config';

export = function buildAssets(gulp, plugins) {
  return function () {
    return gulp.src([
        join(APP_SRC, '**'),
        '!' + join(APP_SRC, '**', '*.ts'),
        '!' + join(APP_SRC, '**', '*.css'),
        '!' + join(APP_SRC, '**', '*.html'),
        '!' + join(APP_SRC, '**', '*.php'),
      ])
      .pipe(gulp.dest(APP_DEST));
  };
}
