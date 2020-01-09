import { Injectable } from '@angular/core';
import { PLATFORM_ID, Inject, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as xhr2 from 'xhr2';

import * as express from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable()
export class CookieHttpInterceptorService implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private injector: Injector
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({ withCredentials: true });
    if (!isPlatformBrowser(this.platformId)) {
      // Be careful! This should only be done on the server side!!
      // hrow xhr2.prototype;
      // xhr2.prototype._restrictedHeaders = {};
      let req: express.Request = this.injector.get(REQUEST);
      let rootDomain = req.hostname
        .split('.')
        .slice(-2)
        .join('.');
      if (request.url.match(/^https?:\/\/([^/:]+)/)[1].endsWith(rootDomain)) {
        let cookieString = Object.keys(req.cookies).reduce(
          (accumulator, cookieName) => {
            accumulator += cookieName + '=' + req.cookies[cookieName] + ';';
            return accumulator;
          },
          ''
        );
        console.log(cookieString);
        // throw xhr2.prototype;
        request = request.clone({
          headers: request.headers.set('Cookie', cookieString),
        });
      }
    }
    return next.handle(request);
  }
}
