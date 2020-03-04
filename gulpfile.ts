import * as gulp from 'gulp';
import * as autoprefixer from 'gulp-autoprefixer';
import * as cssGlobbing from 'gulp-css-globbing';
import * as sass from 'gulp-sass';
import * as template from 'gulp-template';

import { join } from 'path';
import { argv } from 'yargs';

const AUTOPREFIXER_BROWSERS = [
  'ie >= 11',
  'ie_mob >= 11',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10',
];

// --------------
// Build SASS
gulp.task('build.sass', done => {
  const app_cdn = argv.deployUrl ? argv.deployUrl : '';
  gulp
    .src(join(__dirname, 'src', '**', '*.scss'))
    .pipe(cssGlobbing({ extensions: ['.scss'] }))
    .pipe(
      sass({
        includePaths: [join(__dirname, 'src', 'stylesheets')],
        style: 'compressed',
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(
      template({
        APP_CDN: app_cdn,
      })
    )
    .pipe(gulp.dest(join(__dirname, '.styles')))
    .on('end', () => {
      gulp
        .src(join(__dirname, '.styles', 'stylesheets', 'main.css'))
        .pipe(gulp.dest(join(__dirname, 'src')))
        .on('end', done);
    });
});

// --------------
// i18n
gulp.task(
  'extract.i18n',
  require(join(__dirname, 'tasks', 'extract.i18n.xlf'))(gulp)
);
gulp.task(
  'import.i18n',
  require(join(__dirname, 'tasks', 'import.i18n.xlf'))(gulp)
);
