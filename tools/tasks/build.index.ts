import {join, sep} from 'path';
import {APP_SRC, APP_DEST, DEPENDENCIES, VERSION, ENV} from '../config';
import {transformPath, templateLocals} from '../utils';

export = function buildIndex(gulp, plugins) {
  return function () {
    DEPENDENCIES.push({
      src: 'bundles/app.js', dest: join(APP_DEST, 'bundles'), inject: 'shims',
    });
    return gulp.src(join(APP_SRC, 'index.php'))
      // NOTE: There might be a way to pipe in loop.
      .pipe(inject('shims'))
      .pipe(inject('libs'))
      .pipe(inject())
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(APP_DEST));
  };


  function inject(name?: string) {
    return plugins.inject(gulp.src(getInjectablesDependenciesRef(name), { read: false }), {
      name,
      transform: transformPath(plugins, 'dev')
    });
  }

  function getInjectablesDependenciesRef(name?: string) {
    return DEPENDENCIES
      .filter(dep => dep['inject'] && dep['inject'] === (name || true))
      .map(mapPath);
  }

  function mapPath(dep) {
    return join(dep.dest, dep.src.split(sep).pop());
  }
};
