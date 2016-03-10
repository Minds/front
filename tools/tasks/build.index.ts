import {join, sep, normalize} from 'path';
import {transformPath, templateLocals} from '../utils';
import {
  APP_SRC,
  APP_DEST,
  CSS_DEST,
  JS_DEST,
  CSS_PROD_BUNDLE,
  JS_PROD_APP_BUNDLE,
  JS_PROD_SHIMS_BUNDLE
} from '../config';

export = function buildIndex(gulp, plugins) {
  return function () {
    return gulp.src(join(APP_SRC, 'index.php'))
      .pipe(injectJs())
      .pipe(injectCss())
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(APP_DEST));
  };

  function inject(...files) {
    return plugins.inject(
      gulp.src(files, {
        read: false
      }), {
        transform: transformPath(plugins, 'dev')
      });
  }

  function injectJs() {
    return inject(join(JS_DEST, JS_PROD_SHIMS_BUNDLE),
      join(JS_DEST, JS_PROD_APP_BUNDLE));
  }

  function injectCss() {
    return inject(join(CSS_DEST, CSS_PROD_BUNDLE));
  }

};
