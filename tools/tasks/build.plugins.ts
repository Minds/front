import {join} from 'path';
import * as util from 'gulp-util';
import * as chalk from 'chalk';
import {readdirSync, existsSync, lstatSync} from 'fs';
import {APP_SRC, APP_DEST, PLUGINS_DIR, AUTOPREFIXER_BROWSERS} from '../config';

export = function buildPlugins(gulp, _plugins, option) {
  return function (cb) {

    if (!existsSync(PLUGINS_DIR)) {
      cb();
      return;
    }

    var plugins = readdirSync(PLUGINS_DIR);

    plugins.map((plugin, i) => {
      if (plugin.indexOf('_') === 0) {
        if(i == plugins.length -1){
          cb();
        }

        return;
      }

      var path = join(PLUGINS_DIR, plugin);

      try {
        var info = require(join('../../', path, 'plugin.json'));
        if(info.name == '{{plugin.name}}'){
          throw "Plugin not setup";
        }

        // ----------
        // Build plugins to source
        gulp.src(join(path, 'app', '**', '*'))
          .pipe(gulp.dest(join(APP_SRC, 'src', 'plugins', plugin)));

        util.log(chalk.green('[Y]'), chalk.yellow(plugin));

      } catch (error) {
        if(error.code != 'MODULE_NOT_FOUND'){
          util.log(chalk.red('[E] ' + plugin), error);
        }
      }

      if(i == plugins.length -1){
        cb();
      }
    });

  };
}
