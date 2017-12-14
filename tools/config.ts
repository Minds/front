import {readFileSync} from 'fs';
import {argv} from 'yargs';
import {normalize, join, sep} from 'path';
import { getCommitHash } from './utils/commit_hash';

// --------------
// Configuration.

const ENVIRONMENTS = {
  DEVELOPMENT: 'dev',
  PRODUCTION: 'prod'
};

let DEFAULT_ENV = ENVIRONMENTS.DEVELOPMENT;

if (argv.aot) {
  DEFAULT_ENV = ENVIRONMENTS.PRODUCTION;
}

export const PROJECT_ROOT         = normalize(join(__dirname, '..'));
export const ENV                  = argv['env']         || DEFAULT_ENV;
export const DEBUG                = argv['debug']       || false;
export const PORT                 = argv['port']        || 5555;
export const LIVE_RELOAD_PORT     = argv['reload-port'] || 4002;
export const DOCS_PORT            = argv['docs-port']   || 4003;
export const APP_BASE             = argv['base']        || '/';
export const VERSION              = argv['v']           || (ENV !== ENVIRONMENTS.PRODUCTION ? Date.now() : getCommitHash());

export const BOOTSTRAP_MODULE     = 'bootstrap';

export const APP_TITLE            = 'Minds App';

export const APP_SRC              = 'app';
export const APP_CDN              = argv['useCdn'] ? '//d15u56mvtglc6v.cloudfront.net/front/public' : '';
export const ASSETS_SRC           = `${APP_SRC}/assets_`;

export const TOOLS_DIR            = 'tools';
export const PLUGINS_DIR          = '../plugins';
export const TMP_DIR              = '.tmp';
export const TEST_DEST            = 'test';
export const APP_DEST             = `public`;
export const CSS_DEST             = `${APP_DEST}/stylesheets`;
export const JS_DEST              = `${APP_DEST}/js`;
export const APP_ROOT             = `${APP_BASE}`;

export const CSS_PROD_BUNDLE      = 'main.css';
export const JS_PROD_SHIMS_BUNDLE = 'shims.js';
export const JS_PROD_APP_BUNDLE   = 'app.js';

export const VERSION_NPM          = '2.14.7';
export const VERSION_NODE         = '4.0.0';

export const LOCALE                      = argv['locale']                     || '';
export const LOCALE_AOT_INDEX_FILE_NAME  = argv['locale-aot-index-file-name'] || 'index-aot';

interface InjectableDependency {
  src: string;
  inject: string | boolean;
  dest?: string;
}

// Declare NPM dependencies (Note that globs should not be injected).
export const DEV_NPM_DEPENDENCIES: InjectableDependency[] = normalizeDependencies([
  { src: 'systemjs/dist/system-polyfills.js', inject: 'shims', dest: JS_DEST },

  { src: 'core-js/client/shim.min.js', inject: 'shims', dest: JS_DEST },
  { src: 'reflect-metadata/Reflect.js', inject: 'shims', dest: JS_DEST },
  { src: 'zone.js/dist/zone.min.js', inject: 'shims', dest: JS_DEST },
  { src: 'systemjs/dist/system.src.js', inject: 'shims', dest: JS_DEST },
  // { src: 'angular2/bundles/angular2-polyfills.min.js', inject: 'shims', dest: JS_DEST },
  //{ src: 'intl/dist/Intl.min.js', inject: 'shims', dest: JS_DEST },
  //{ src: 'intl/locale-data/jsonp/en.js', inject: 'shims', dest: JS_DEST },

  // Faster dev page load
  { src: 'rxjs/bundles/Rx.min.js', inject: 'libs', dest: JS_DEST },
  // { src: 'angular2/bundles/angular2.min.js', inject: 'libs', dest: JS_DEST },
  // { src: 'angular2/bundles/router.min.js', inject: 'libs', dest: JS_DEST }, // use router.min.js with alpha47
  // { src: 'angular2/bundles/http.min.js', inject: 'libs', dest: JS_DEST },
  // -ng-rc- { src: '@angular/core/bundles/core.umd.min.js', inject: 'libs', dest: JS_DEST },
  // -ng-rc- { src: '@angular/common/bundles/common.umd.min.js', inject: 'libs', dest: JS_DEST },
  // -ng-rc- { src: '@angular/compiler/bundles/compiler.umd.min.js', inject: 'libs', dest: JS_DEST },
  // -ng-rc- { src: '@angular/http/bundles/http.umd.min.js', inject: 'libs', dest: JS_DEST },
  // -ng-rc- { src: '@angular/platform-browser/bundles/platform-browser.umd.min.js', inject: 'libs', dest: JS_DEST },
  // -ng-rc- { src: '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js', inject: 'libs', dest: JS_DEST },
  // -ng-rc- { src: '@angular/router/bundles/router.umd.min.js', inject: 'libs', dest: JS_DEST },
  // -ng-rc- { src: '@angular/router-deprecated/bundles/router-deprecated.umd.min.js', inject: 'libs', dest: JS_DEST },
  { src: 'socket.io-client/dist/socket.io.js', inject: 'libs', dest: JS_DEST },
  { src: 'rome/dist/rome.js', inject: 'libs', dest: JS_DEST },
  { src: 'moment/min/moment.min.js', inject: 'libs', dest: JS_DEST },
  { src: 'material-datetime-picker/dist/material-datetime-picker.js', inject: 'libs', dest: JS_DEST },

  // async
  { src: 'tinymce/tinymce.min.js', inject: 'async', dest: JS_DEST },
  { src: 'braintree-web/dist/braintree.js', inject: 'async', dest: JS_DEST }

]);

export const PROD_NPM_DEPENDENCIES: InjectableDependency[] = normalizeDependencies([
  { src: 'rome/dist/rome.js', inject: 'libs', dest: JS_DEST },
  { src: 'moment/min/moment.min.js', inject: 'libs', dest: JS_DEST },
  { src: 'material-datetime-picker/dist/material-datetime-picker.js', inject: 'libs', dest: JS_DEST },
  { src: 'medium-editor/dist/js/medium-editor.min.js', inject: 'libs', dest: JS_DEST },

  { src: 'systemjs/dist/system-polyfills.src.js', inject: 'shims' },
  { src: 'core-js/client/shim.min.js', inject: 'shims' },
  { src: 'reflect-metadata/Reflect.js', inject: 'shims' },
  { src: 'zone.js/dist/zone.min.js', inject: 'shims' },
  { src: 'systemjs/dist/system.js', inject: 'shims' },
  // { src: 'angular2/bundles/angular2-polyfills.min.js', inject: 'libs' },
  { src: 'socket.io-client/dist/socket.io.js', inject: 'libs' },
  // { src: 'angular2/es6/dev/src/testing/shims_for_IE.js', inject: 'shims' },
  { src: 'intl/dist/Intl.min.js', inject: 'shims' },
  { src: 'intl/locale-data/jsonp/en.js', inject: 'shims' },
]);

// Declare local files that needs to be injected
export const APP_ASSETS: InjectableDependency[] = [
  { src: `${PROJECT_ROOT}/app/shims/fontawesome.js`, inject: 'shims', dest: 'JS_DEST' },
  { src: `${CSS_DEST}/main.css`, inject: true, dest: CSS_DEST },
];

export const DEV_DEPENDENCIES = DEV_NPM_DEPENDENCIES.concat(APP_ASSETS);
export const PROD_DEPENDENCIES = PROD_NPM_DEPENDENCIES.concat(APP_ASSETS);

export const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// ----------------
// SystemsJS Configuration.

const SYSTEM_PACKAGES = {
  '@angular/animations/browser': { main: '../bundles/animations-browser.umd.js', defaultExtension: 'js' },
  '@angular/animations': { main: 'bundles/animations.umd.js', defaultExtension: 'js' },
  '@angular/common': { main: 'bundles/common.umd.js', defaultExtension: 'js' },
  '@angular/compiler': { main: 'bundles/compiler.umd.js', defaultExtension: 'js' },
  '@angular/core': { main: 'bundles/core.umd.js', defaultExtension: 'js' },
  '@angular/forms': { main: 'bundles/forms.umd.js', defaultExtension: 'js' },
  '@angular/http': { main: 'bundles/http.umd.js', defaultExtension: 'js' },
  '@angular/platform-browser/animations': { main: '../bundles/platform-browser-animations.umd.js', defaultExtension: 'js' },
  '@angular/platform-browser': { main: 'bundles/platform-browser.umd.js', defaultExtension: 'js' },
  '@angular/platform-browser-dynamic': { main: 'bundles/platform-browser-dynamic.umd.js', defaultExtension: 'js' },
  '@angular/platform-server': { main: 'bundles/platform-server.umd.js', defaultExtension: 'js' },
  '@angular/router': { main: 'bundles/router.umd.js', defaultExtension: 'js' },
  'symbol-observable': { main: 'index.js', defaultExtension: 'js' }
};

const SYSTEM_CONFIG_DEV = {
  defaultJSExtensions: true,
  paths: {
    [BOOTSTRAP_MODULE]: `${APP_BASE}${BOOTSTRAP_MODULE}`,
    // '@angular/*': `${APP_BASE}@angular/*`,
    // 'rxjs/*': `${APP_BASE}node_modules/rxjs/*`,
    '*': `${APP_BASE}node_modules/*`
  },
  packages: SYSTEM_PACKAGES
};

export const SYSTEM_CONFIG = SYSTEM_CONFIG_DEV;

export const SYSTEM_BUILDER_CONFIG = {
  defaultJSExtensions: true,
  paths: {
    [`${TMP_DIR}/*`]: `${TMP_DIR}/*`,
    '*': 'node_modules/*'
  },
  packages: SYSTEM_PACKAGES
};

// --------------
// Private.

function normalizeDependencies(deps: InjectableDependency[]) {
  deps
    .filter((d:InjectableDependency) => !/\*/.test(d.src)) // Skip globs
    .forEach((d:InjectableDependency) => d.src = require.resolve(d.src));
  return deps;
}

function appVersion(): number|string {
  var pkg = JSON.parse(readFileSync('package.json').toString());
  return pkg.version;
}
