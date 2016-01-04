import * as gulp from 'gulp';
import {runSequence, task} from './tools/utils';

// --------------
// Build
gulp.task('build', done =>
  runSequence(
    //'clean.dist',
    //'tslint',
    'build.plugins',
    'build.sass',
    'build.assets',
    'build.deps',
    'build.js',
    'build.bundles',
    //'build.index',
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
