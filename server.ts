import 'zone.js/dist/zone-node';

import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import * as _url from 'url';

import './server-polyfills';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import {
  enableProdMode,
  TRANSLATIONS,
  TRANSLATIONS_FORMAT,
  LOCALE_ID,
} from '@angular/core';
import { XhrFactory } from '@angular/common/http';
import { NgxRequest, NgxResponse } from '@gorniv/ngx-universal';
import { AppServerModule } from './src/main.server';

import * as express from 'express';
import * as compression from 'compression';
import * as cookieparser from 'cookie-parser';
import isMobileOrTablet from './src/app/helpers/is-mobile-or-tablet';

const PORT = process.env.PORT || 4200;
// Dist folder
const distFolder = join(process.cwd(), 'dist', 'browser');

export function app() {
  // Express server
  const server = express();

  // gzip
  server.use(compression());
  // cokies
  server.use(cookieparser());

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Server static files from dist folder
  server.get('*.*', express.static(distFolder));

  // Socket.io hitting wrong endpoint (dev?)
  server.get('/socket.io', (req, res) => {
    res.send('You are using the wrong domain.');
  });

  // /undefined is an issue with angular
  server.get('/undefined', (req, res) => {
    res.send('There was problem');
  });

  // cache
  const NodeCache = require('node-cache');
  const myCache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 120 });

  const cache = () => {
    return (req, res, next) => {
      const sessKey =
        Object.entries(req.cookies)
          .filter(kv => kv[0] !== 'mwa' && kv[0] !== 'XSRF-TOKEN')
          .join(':') || 'loggedout';
      const key =
        `__express__/${sessKey}/` +
        `${req.get('host')}` +
        (req.originalUrl || req.url) +
        `/${req.headers['x-minds-locale']}` +
        (isMobileOrTablet() ? '/mobile' : '/desktop');
      const exists = myCache.has(key);
      if (exists) {
        console.log(`from cache: ${key}`);
        const cachedBody = myCache.get(key);
        res.send(cachedBody);
        return;
      } else {
        res.sendResponse = res.send;
        res.send = body => {
          myCache.set(key, body);
          res.sendResponse(body);
        };
        next();
      }
    };
  };

  // All regular routes use the Universal engine
  server.get('*', cache(), (req, res) => {
    const http =
      req.headers['x-forwarded-proto'] === undefined
        ? 'http'
        : req.headers['x-forwarded-proto'];

    const url = req.originalUrl;
    const locale = getLocale(req);

    // tslint:disable-next-line:no-console
    console.time(`GET: ${url}`);
    res.render(
      `${locale}/index`,
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
            provide: NgxResponse,
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
          {
            provide: TRANSLATIONS,
            useValue: getLocaleTranslations(locale),
          },
          { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
          // { provide: LOCALE_ID, useValue: locale },
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

  return server;
}

/**
 * Return a valid i18n locale
 */
function getLocale(req): string {
  const defaultLocale = 'en';

  // Nginx should pass through Minds-Locale Header
  const hostLanguage = req.headers['x-minds-locale'] || defaultLocale;

  if (hostLanguage && hostLanguage.length === 2) {
    const path = join(distFolder, hostLanguage);
    if (existsSync(path)) {
      return hostLanguage;
    }
  }

  return defaultLocale;
}

function getLocaleTranslations(locale: string): string {
  let fileName: string;
  if (locale === 'en') {
    fileName = 'Base.xliff';
  } else {
    fileName = `Minds.${locale}.xliff`;
  }
  return require(`raw-loader!./src/locale/${fileName}`);
}

function run() {
  // Start up the Node server
  const server = app();

  server.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
