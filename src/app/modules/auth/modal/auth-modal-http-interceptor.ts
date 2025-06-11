import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthModalHttpInterceptorService implements HttpInterceptor {
  constructor() {}

  /**
   * This function will detect if a 401 error was thrown and open the auth modal
   */
  handleResponseError(
    err: HttpErrorResponse,
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    if (err.status === 401) {
      if (
        [
          'Minds::Core::Security::TwoFactor::TwoFactorRequiredException',
          'Minds::Core::Security::TwoFactor::TwoFactorInvalidCodeException',
          'Minds::Core::Authentication::InvalidCredentialsException',
        ].indexOf(err?.error?.errorId) < 0
      ) {
        // Reload the app
        window.location.reload();
      }
    }

    return throwError(() => err);
  }

  /**
   * This intercepts the http requests across the app
   * We use it to catch any errors and pass to handleResponseError above
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        return this.handleResponseError(err, req, next);
      })
    );
  }
}
