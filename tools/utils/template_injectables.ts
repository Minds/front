import * as slash from 'slash';
import {join} from 'path';
import {APP_BASE, APP_DEST, APP_CDN, VERSION, ENV} from '../config';

let injectables: string[] = [];

export function injectableAssetsRef() {
  return injectables;
}

export function registerInjectableAssetsRef(paths: string[], target: string = '') {
  injectables = injectables.concat(
    paths
      .filter(path => !/(\.map)$/.test(path))
      .map(path => join(target, slash(path).split('/').pop()))
  );
}

export function transformPath(plugins, env) {
  return function (filepath) {
    console.log('[filepath]', filepath);
    filepath = filepath.replace(`/${APP_DEST}`, '');
    arguments[0] = APP_CDN + filepath + '?v=' + VERSION;
    return slash(plugins.inject.transform.apply(plugins.inject.transform, arguments));
  };
}
