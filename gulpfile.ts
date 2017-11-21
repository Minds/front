import * as gulp from 'gulp';
import { runSequence } from './tools/utils';
import { argv } from 'yargs';

// --------------
// Build
gulp.task('build', done => {
  if (argv.aot && argv.all) {
    // [Wrapper] Batch app, embed and locale production build --aot --all
    return runSequence('build.aot.all', done);
  } else if (argv.aot && argv.locales) {
    // [Wrapper] Batch locale production build --aot --locales=XX,YY,ZZ
    return runSequence('build.aot.locales', done);
  } else if (argv.aot && argv.shims) {
    // Production vendor bundles (--aot --shims)
    return runSequence('build.bundles', done);
  } else if (argv.aot && argv.index) {
    // Production indexes only (--aot --index)
    return runSequence('build.index', done);
  } else if (argv.aot) {
    // Production build (--aot)
    let tasks = [
      'clean.tmp',
      'prepare.prod'
    ];

    let buildIndex = !argv['ignore-index'];

    if (argv.locale) {
      // Locale production build --aot --locale=XX
      tasks.push('build.aot.locale');
    } else if (argv.embed) {
      // Embed module production build --aot --embed
      tasks.push('build.aot.embed');
      buildIndex = false;
    } else {
      // App module production build --aot
      tasks.push('build.aot');
    }

    if (buildIndex) {
      tasks.push('build.index');
    }

    return runSequence(...tasks, 'clean.tmp', done);
  } else if (argv.dev) {
    // Development build (--dev)

    let tasks = [
      'build.plugins',
      [
        'build.assets',
        'build.sass',
        'build.js'
      ],
      [
        'build.bundles',
        'build.bundles.app'
      ]
    ];

    if (!argv['ignore-index']) {
      tasks.push('build.index');
    }

    return runSequence(...tasks, 'clean.tmp', done);
  } else {
    done(Error('Unknown build mode: use --aot or --dev'));
  }
});

// --------------
// Prepare (AoT - Production and extractions)
gulp.task('prepare.prod', done =>
  runSequence(
    'build.plugins',
    [
      'build.sass',
      'build.assets'
    ],
    done));

// --------------
// Test.
gulp.task('test', done =>
  runSequence(
    //'clean.test',
    'tslint',
    //'build.test',
    //'karma.start',
    done));

// --------------
// Extract to XLF
gulp.task('extract.i18n', done =>
  runSequence(
    'prepare.prod',
    'extract.i18n.xlf',
    'clean.tmp',
    done));

// --------------
// Import XLF
gulp.task('import.i18n', done =>
  runSequence(
    'import.i18n.xlf',
    done));

// --------------
// Lint Source XLF
gulp.task('lint.i18n', done =>
  runSequence(
    'lint.i18n.xlf',
    done));
