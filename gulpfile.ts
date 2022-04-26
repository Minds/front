import * as gulp from 'gulp';
import * as autoprefixer from 'gulp-autoprefixer';
import * as gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import * as sassGlob from 'gulp-sass-glob';
import * as template from 'gulp-template';
import * as jsonModify from 'gulp-json-modify';

import { join } from 'path';
import { argv } from 'yargs';

const sass = gulpSass(dartSass);

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
  const app_cdn = argv['deployUrl'] ? argv['deployUrl'] : '';
  gulp
    .src(join(__dirname, 'src', 'stylesheets', 'main.scss'))
    .pipe(
      sassGlob({
        ignorePaths: ['**/*.ng.scss'],
      })
    )
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
        .src(join(__dirname, '.styles', 'main.css'))
        .pipe(gulp.dest(join(__dirname, 'src')))
        .on('end', done);
    });
});

// --------------
// i18n

gulp.task('generate-ngsw-appData', () => {
  return gulp
    .src(join(__dirname, 'ngsw-config.json'))
    .pipe(
      jsonModify({
        key: 'appData.commit',
        value: `${process.env.CI_COMMIT_REF_NAME}-${process.env.CI_COMMIT_SHORT_SHA}`,
      })
    )
    .pipe(gulp.dest('./'));
});

gulp.task(
  'extract.i18n',
  require(join(__dirname, 'tasks', 'extract.i18n.xlf'))(gulp)
);

gulp.task(
  'import.i18n',
  require(join(__dirname, 'tasks', 'import.i18n.xlf'))(gulp)
);
