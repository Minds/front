// @ts-nocheck
import { join } from 'path';
import { readFileSync } from 'fs';

const domino = require('domino-ext');
const distFolder = join(process.cwd(), 'dist/browser/en');
const template = readFileSync(join(distFolder, 'index.html')).toString();
const win = domino.createWindow(template);

function defineGlobalProperty(key: string, value: any) {
  try {
    Object.defineProperty(global, key, {
      value,
      configurable: true,
      writable: true,
    });
  } catch (e) {
    console.warn(`Cannot redefine global property: ${key}`);
  }
}

global['window'] = win;
global['Node'] = win.Node;

// global['navigator'] = win.navigator;
defineGlobalProperty('navigator', win.navigator);

global['screen'] = {
  width: 0,
  height: 0,
  availHeight: 0,
  availWidth: 0,
  colorDepth: 0,
  pixelDepth: 0,
  orientation: null,
};
global['Event'] = win.Event;
global['Event']['prototype'] = win.Event.prototype;
global['KeyboardEvent'] = win.KeyboardEvent;
global['document'] = win.document;
global['window']['Promise'] = global.Promise;
global['localStorage'] = global['window']['localStorage'];
global['window']['scrollTo'] = (pos) => {};
global['fetch'] = win.fetch;

Object.defineProperty(window.document, 'cookie', {
  writable: true,
  value: 'myCookie=omnomnom',
});

Object.defineProperty(window.document, 'referrer', {
  writable: true,
  value: '',
});

Object.defineProperty(window.document, 'localStorage', {
  writable: true,
  value: global['window']['localStorage'],
});
