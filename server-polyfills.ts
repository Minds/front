// @ts-nocheck
// CRITICAL: Set up DOM polyfills immediately for SSR chunks
// This must happen before ANY other code runs

import * as domino from '@mixmark-io/domino';

// Use a minimal template for faster initialization
const template = '<!DOCTYPE html><html><head></head><body></body></html>';
const win = domino.createWindow(template);

function defineGlobalProperty(key: string, value: any) {
  try {
    Object.defineProperty(globalThis, key, {
      value,
      configurable: true,
      writable: true,
    });
  } catch (e) {
    console.warn(`Cannot define global property: ${key}`);
  }
}

// Set up global DOM objects using globalThis for better ESM compatibility
defineGlobalProperty('window', win);
defineGlobalProperty('document', win.document);
defineGlobalProperty('Node', win.Node);
defineGlobalProperty('navigator', win.navigator);
defineGlobalProperty('Event', win.Event);
defineGlobalProperty('KeyboardEvent', win.KeyboardEvent);
defineGlobalProperty('localStorage', win.localStorage);
defineGlobalProperty('sessionStorage', win.sessionStorage);
defineGlobalProperty(
  'fetch',
  win.fetch || (() => Promise.reject('Fetch not available'))
);
defineGlobalProperty('self', {});

// Also set on global for backward compatibility
global['window'] = win;
global['document'] = win.document;
global['Node'] = win.Node;
global['navigator'] = win.navigator;
global['Event'] = win.Event;
global['Event']['prototype'] = win.Event.prototype;
global['KeyboardEvent'] = win.KeyboardEvent;
global['localStorage'] = win.localStorage;
global['window']['Promise'] = global.Promise;
global['window']['scrollTo'] = () => {};
global['self'] = {};

defineGlobalProperty('screen', {
  width: 1024,
  height: 768,
  availHeight: 768,
  availWidth: 1024,
  colorDepth: 24,
  pixelDepth: 24,
  orientation: null,
});

global['screen'] = globalThis['screen'];

Object.defineProperty(window.document, 'cookie', {
  writable: true,
  value: '',
});

Object.defineProperty(window.document, 'referrer', {
  writable: true,
  value: '',
});

Object.defineProperty(window.document, 'localStorage', {
  writable: true,
  value: global['window']['localStorage'],
});

// Verify polyfills are loaded
if (
  typeof globalThis['window'] === 'undefined' ||
  typeof globalThis['document'] === 'undefined'
) {
  throw new Error('DOM polyfills failed to load properly');
}

console.log('[SSR] DOM polyfills loaded successfully');
