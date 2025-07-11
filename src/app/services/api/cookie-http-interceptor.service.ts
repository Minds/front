import {
  inject,
  Injectable,
  REQUEST,
  REQUEST_CONTEXT,
  RESPONSE_INIT,
} from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class CookieHttpInterceptorService implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!isPlatformBrowser(this.platformId)) {
      request = request.clone({ withCredentials: true });

      const expressRequest = (inject(REQUEST_CONTEXT) as any)?.expressRequest;

      if (expressRequest) {
        const cookies = expressRequest.cookies;
        const hostname = expressRequest.hostname;

        let rootDomain = hostname.split('.').slice(-2).join('.');
        const matches = request.url.match(/^https?:\/\/([^/:]+)/);
        if (matches && matches[1].endsWith(rootDomain)) {
          let cookieString = Object.keys(cookies).reduce(
            (accumulator, cookieName) => {
              accumulator += cookieName + '=' + cookies[cookieName] + ';';
              return accumulator;
            },
            ''
          );
          request = request.clone({
            headers: request.headers.set('Cookie', cookieString),
          });
        }
      }
    }
    return next.handle(request);
  }
}
