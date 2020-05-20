import { join } from 'path';
import { readFileSync } from 'fs';

const domino = require('domino');
const distFolder = join(process.cwd(), 'dist/browser');
const template = readFileSync(join(distFolder, 'index.html')).toString();
const win = domino.createWindow(template);

global['window'] = win;
global['Node'] = win.Node;
global['navigator'] = win.navigator;
global['screen'] = { width: 0, height: 0 };
global['Event'] = {};
global['Event']['prototype'] = win.Event.prototype;
global['KeyboardEvent'] = global['Event'];
global['document'] = win.document;
global['window']['Promise'] = global.Promise;

global['window']['localStorage'] = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
global['localStorage'] = global['window']['localStorage'];
global['window']['scrollTo'] = pos => {};

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
