import './instrument-sentry';
import * as Sentry from '@sentry/node';
import { SSR_SENTRY_INTEGRATIONS } from './src/app/common/injection-tokens/common-injection-tokens';

/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import 'zone.js/node';
import { renderModule } from '@angular/platform-server';

import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import * as _url from 'url';

import './server-polyfills';

import { TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { EmbedServerModule } from './src/app/modules/embed/embed.server.module';
import { AppServerModule } from './src/main.server';
import * as express from 'express';
import * as compression from 'compression';
import * as cookieparser from 'cookie-parser';
import isMobileOrTablet from './src/app/helpers/is-mobile-or-tablet';
import * as timeout from 'connect-timeout';
import { REQUEST, RESPONSE } from './src/express.tokens';
import { APP_BASE_HREF } from '@angular/common';

const browserDistFolder = join(process.cwd(), 'dist', 'browser');
const embedDistFolder = join(process.cwd(), 'dist', 'embed');
const PORT = process.env.PORT || 4200;

export function app() {
  // Express server
  const server = express();

  // Timeout
  server.use(timeout('6s'));

  // gzip
  server.use(compression());
  // cookies
  server.use(cookieparser());

  // Server static files from dist folder
  server.use('/embed-static', express.static(embedDistFolder));
  server.get('*.*', express.static(browserDistFolder));

  // Socket.io hitting wrong endpoint (dev?)
  server.get('/socket.io', (req, res) => {
    res.send('You are using the wrong domain.');
  });

  // /undefined is an issue with angular
  server.get('/undefined', (req, res) => {
    res.send('There was problem');
  });

  // /api should not be getting called
  server.get('/api/*', (req, res) => {
    res.send('There was problem');
    res.end();
  });

  const render =
    (bootstrap: any, getDocument?: (locale: string) => string) =>
    async (req: any, res: any) => {
      const http =
        req.headers['x-forwarded-proto'] === undefined
          ? 'http'
          : req.headers['x-forwarded-proto'];

      const url = req.originalUrl;
      const locale = getLocale(req);

      // tslint:disable-next-line:no-console
      console.time(`GET: ${url}`);

      let html: string;

      try {
        html = await renderModule(bootstrap, {
          url: `${req.protocol}://${req.get('host') || ''}${req.originalUrl}`,
          document: getDocument(locale),
          extraProviders: [
            // for http and cookies
            {
              provide: REQUEST,
              useValue: req,
            },
            {
              provide: RESPONSE,
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
              useFactory: () => _url.parse(req.url, true).search || '',
              deps: [],
            },
            {
              provide: TRANSLATIONS,
              useValue: getLocaleTranslations(locale),
            },
            { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
            {
              provide: SSR_SENTRY_INTEGRATIONS,
              useValue: [
                Sentry.requestDataIntegration(),
                Sentry.nodeContextIntegration(),
              ],
            },
            // { provide: LOCALE_ID, useValue: locale },
          ],
        });
      } catch (err) {
        html = err.toString();
      } finally {
        res.send(html);
        console.timeEnd(`GET: ${url}`);
        res.end();
      }
    };

  // embed route loads its own module
  server.get(
    `/embed/*`,
    //cache(),
    render(EmbedServerModule, (locale) =>
      readFileSync(join(embedDistFolder, `${locale}/embed.html`)).toString()
    )
  );

  // All regular routes use the Universal engine
  server.get(
    '*',
    //cache(),
    render(AppServerModule, (locale) =>
      readFileSync(join(browserDistFolder, `${locale}/index.html`)).toString()
    )
  );

  Sentry.setupExpressErrorHandler(server);

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
    const path = join(browserDistFolder, hostLanguage);
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
    console.log(
      `Node Express server listening on http://localhost:${PORT} for the sole benefit of nginx and not your browser! Access on port 8080.`
    );
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
