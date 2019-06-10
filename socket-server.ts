import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { join } from 'path';
import { readFileSync } from 'fs';

import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';

import * as express from 'express';

const domino = require('domino');
const socketEngine = require('@nguniversal/socket-engine');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4201;
const DIST_FOLDER = join(process.cwd(), 'dist/en');
const template = readFileSync(join(DIST_FOLDER, 'index.php')).toString();
const win = domino.createWindow(template);
const setGlobalVars = require('indexeddbshim');

global['window'] = win;
global['Node'] = win.Node;
global['navigator'] = win.navigator;
global['Event'] = win.Event;
global['Event']['prototype'] = win.Event.prototype;
global['document'] = win.document;
global['window']['Promise'] = global.Promise;
global['window']['Minds'] = {
  cdn_urn: '/',
  cdn_assets_url: '/en/',
  blockchain: {
    network_address: "https://www.minds.com/api/v2/blockchain/proxy/",
    token: {
      abi: [],
    }
  },
};
global['window']['localStorage'] = {
  getItem: () => { },
  setItem: () => { },
  removeItem: () => { },
};
global['localStorage'] = global['window']['localStorage'];
global['window']['scrollTo'] = (pos) => { };

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

setGlobalVars(null, {
  checkOrigin: false
});

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

socketEngine.startSocketEngine(AppServerModuleNgFactory, [ provideModuleMap(LAZY_MODULE_MAP) ]);

/*app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    // Our index.html
    document: template,
    url: options.req.url,
    // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html => {
    callback(null, html);
  });
});

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Server static files from dist folder
app.get('*.*', express.static(DIST_FOLDER));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
  });*/
