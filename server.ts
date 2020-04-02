import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { join } from 'path';
import { readFileSync } from 'fs';
import * as _url from 'url';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { enableProdMode } from '@angular/core';
import { XhrFactory } from '@angular/common/http';
import { NgxRequest, NgxResponce } from '@gorniv/ngx-universal';

import * as express from 'express';
import * as compression from 'compression';
import * as cookieparser from 'cookie-parser';
import isMobileOrTablet from './src/app/helpers/is-mobile-or-tablet';

const domino = require('domino');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

// gzip
app.use(compression());
// cokies
app.use(cookieparser());

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist/en');
const template = readFileSync(join(DIST_FOLDER, 'index.html')).toString();
const win = domino.createWindow(template);

global['window'] = win;
global['Node'] = win.Node;
global['navigator'] = win.navigator;
global['screen'] = { width: 0, height: 0 };
global['Event'] = win.Event;
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

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
} = require('./dist/server/main');

const {
  provideModuleMap,
} = require('@nguniversal/module-map-ngfactory-loader');

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)],
  })
);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Server static files from dist folder
app.get('*.*', express.static(DIST_FOLDER));

// Socket.io hitting wrong endpoint (dev?)
app.get('/socket.io', (req, res) => {
  res.send('You are using the wrong domain.');
});

// /undefined is an issue with angular
app.get('/undefined', (req, res) => {
  res.send('There was problem');
});

// cache
const NodeCache = require('node-cache');
const myCache = new NodeCache({
  stdTTL: 2 * 60, // 2 minute cache
  checkperiod: 60, // Check every minute
});

const cache = () => {
  return (req, res, next) => {
    const sessKey =
      Object.entries(req.cookies)
        .filter(kv => kv[0] !== 'mwa' && kv[0] !== 'XSRF-TOKEN')
        .join(':') || 'loggedout';
    const key =
      `__express__/${req.headers.host}/${sessKey}/` +
      (req.originalUrl || req.url) +
      (isMobileOrTablet() ? '/mobile' : '/desktop');
    const exists = myCache.has(key);
    if (exists) {
      const cachedBody = myCache.get(key);
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        if (res.finished) return;
        myCache.set(key, body);
        res.sendResponse(body);
      };
      next();
    }
  };
};

app.get('/node-cache-stats', (req, res) => {
  res.send(myCache.getStats());
});

// All regular routes use the Universal engine
app.get('*', cache(), (req, res) => {
  const http =
    req.headers['x-forwarded-proto'] === undefined
      ? 'http'
      : req.headers['x-forwarded-proto'];

  const url = req.originalUrl;
  // tslint:disable-next-line:no-console
  console.time(`GET: ${url}`);
  res.render(
    'index',
    {
      req: req,
      res: res,
      // provers from server
      providers: [
        // for http and cookies
        {
          provide: REQUEST,
          useValue: req,
        },
        {
          provide: RESPONSE,
          useValue: res,
        },
        // for cookie
        {
          provide: NgxRequest,
          useValue: req,
        },
        {
          provide: NgxResponce,
          useValue: res,
        },
        // for absolute path
        {
          provide: 'ORIGIN_URL',
          useValue: `${http}://${req.headers.host}`,
        },
        // for initial query params before router loads
        {
          provide: 'QUERY_STRING',
          useFactory: () => {
            return _url.parse(req.url, true).search || '';
          },
          deps: [],
        },
      ],
    },
    (err, html) => {
      if (!!err) {
        throw err;
      }

      // tslint:disable-next-line:no-console
      console.timeEnd(`GET: ${url}`);
      res.send(html);
    }
  );
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

app.keepAliveTimeout = 65000;
