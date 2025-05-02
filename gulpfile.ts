const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const gulpSass = require('gulp-sass');
const dartSass = require('sass');
const sassGlob = require('gulp-sass-glob');
const template = require('gulp-template');

const { join } = require('path');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;

const sass = gulpSass(dartSass);

// const __dirname = './';

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
gulp.task('build.sass', (done) => {
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

gulp.task('extract.i18n', async function () {
  const mod = await import(join(__dirname, 'tasks', 'extract.i18n.xlf'));
  return mod.default(gulp);
});

gulp.task('import.i18n', async function () {
  const mod = await import(join(__dirname, 'tasks', 'import.i18n.xlf'));
  return mod.default(gulp);
});
