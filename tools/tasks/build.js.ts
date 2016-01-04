import {join} from 'path';
import {APP_SRC, TMP_DIR} from '../config';
import {tsProjectFn, templateLocals} from '../utils';

export = function buildJS(gulp, plugins) {
  return function () {
    let tsProject = tsProjectFn(plugins);
    let src = [
      join(APP_SRC, '**/*.ts'),
      '!' + join(APP_SRC, '**/*_spec.ts')
    ];

    let result = gulp.src(src)
      .pipe(plugins.plumber())
      .pipe(plugins.inlineNg2Template({ base: APP_SRC }))
      .pipe(plugins.typescript(tsProject));

    return result.js
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(TMP_DIR));
  };
};
