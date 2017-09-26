import {join} from 'path';
import {APP_SRC, TMP_DIR} from '../config';
import {tsProjectFn, templateLocals} from '../utils';

export = function buildJS(gulp, plugins) {
  return function () {
    let tsProject = tsProjectFn(plugins);
    let src = [
      // 'typings/browser.d.ts',
      '!' + join(APP_SRC, '**/bootstrap-aot.ts'),
      '!' + join(APP_SRC, '**/bootstrap-embed-aot.ts'),
      'tools/manual_typings/**/*.d.ts',
      'tools/typings/tsd/index.d.ts',
      join(APP_SRC, '**/*.ts'),
      '!' + join(APP_SRC, '**/*_spec.ts')
    ];

    let result = gulp.src(src)
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.inlineNg2Template({
        useRelativePaths: true
      }))
      .pipe(plugins.typescript(tsProject));

    return result.js
      .pipe(plugins.sourcemaps.write())
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(TMP_DIR));
  };
};
