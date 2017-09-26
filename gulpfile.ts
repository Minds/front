import * as gulp from 'gulp';
import {runSequence, task} from './tools/utils';

// --------------
// Prepare (AoT - Production)
gulp.task('prepare.prod', done =>
  runSequence(
    'build.plugins',
    'build.sass',
    'build.assets',
    done));

// --------------
// Build
gulp.task('build', done =>
  runSequence(
    //'clean.dist',
    //'tslint',
    'build.plugins',
    'build.sass',
    'build.assets',
    'build.js',
    'build.bundles',
    'build.bundles.app',
    //'build.index',
    done));

// --------------
// Build bundle (AoT - Production)
gulp.task('build.bundle.prod', done =>
  runSequence(
    'build.bundles',
    done));

// --------------
// Build bundle
gulp.task('build.bundle', done =>
  runSequence(
    'build.bundles',
    'build.bundles.app',
    done));

// --------------
// Build (SASS only)
gulp.task('build.sass', done =>
  runSequence(
    'build.plugins',
    'build.sass',
    'build.assets',
    done));

// --------------
// Build Index
gulp.task('build.index', done =>
  runSequence(
    'build.index',
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
// Beautify XLF
gulp.task('beautify.xlf', done =>
  runSequence(
    'beautify.xlf',
    done));
