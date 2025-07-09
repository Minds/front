// import './instrument-sentry';
// import * as Sentry from '@sentry/node';
// import { SSR_SENTRY_INTEGRATIONS } from './src/app/common/injection-tokens/common-injection-tokens';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

// import { readFileSync, existsSync } from 'fs';
import path, { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// import * as _url from 'url';

import { TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import compression from 'compression';
import cookieparser from 'cookie-parser';
import timeout from 'connect-timeout';
import dotenv from 'dotenv';

const env = dotenv.config();

// Express server
const server = express();

// Ng paths
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Timeout
server.use(timeout('6s'));

// gzip
server.use(compression());
// cookies
server.use(cookieparser());

// SSR Engine
const appEngine = new AngularNodeAppEngine();

server.set('view engine', 'html');
server.set('views', browserDistFolder);

// Server static files from dist folder
server.get('*.*', express.static(browserDistFolder));

const engineHost = env.parsed['MINDS_FRONT_ENGINE_HOST'] || 'localhost';

// Proxy the API requests to the engine
server.use(
  '/api',
  createProxyMiddleware({
    target: `https://${engineHost}/api`,
    changeOrigin: env.parsed['MINDS_FRONT_ENGINE_CHANGE_ORIGIN'] === '1', // Changes the origin of the host header to the target URL
  })
);

server.use('*', (req, res, next) => {
  // Log the request for debugging
  console.log('request', req.url);
  import('./server-polyfills');

  appEngine
    .handle(req, { server: 'express', expressRequest: req })
    .then((response) => {
      return response ? writeResponseToNodeResponse(response, res) : next();
    })
    .catch((err) => {
      const browserIndex = path.join(browserDistFolder, 'index.html');
      console.error(err);
      console.log('Skipping SSR. Loading: ' + browserIndex);

      console.log(serverDistFolder, import.meta);
      res.sendFile(browserIndex, () => next());
    });
});

// Sentry.setupExpressErrorHandler(server);

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4200;
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

console.warn('Node Express server started');

// This exposes the RequestHandler
export const reqHandler = createNodeRequestHandler(server);
