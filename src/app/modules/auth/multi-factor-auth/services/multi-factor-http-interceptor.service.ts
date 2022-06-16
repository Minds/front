import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { from, Observable, combineLatest, throwError, race } from 'rxjs';
import {
  catchError,
  finalize,
  first,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { MultiFactorLazyService } from './multi-factor-auth-lazy.service';
import {
  MultiFactorAuthService,
  MultiFactorRootPanel,
} from './multi-factor-auth-service';
import { FormToastService } from '../../../../common/services/form-toast.service';

@Injectable()
export class MultiFactorHttpInterceptorService implements HttpInterceptor {
  constructor(
    private multiFactorModalService: MultiFactorLazyService,
    private multiFactorAuthService: MultiFactorAuthService,
    private toastService: FormToastService
  ) {}

  /**
   * Add our two factor headers
   */
  addHeaders(request: HttpRequest<any>, payload): HttpRequest<any> {
    let headers = request.headers;

    if (payload.code) {
      headers = headers.set('X-MINDS-2FA-CODE', payload.code);
    }

    if (payload.smsSecretKey) {
      headers = headers.set('X-MINDS-SMS-2FA-KEY', payload.smsSecretKey);
    }

    if (payload.emailSecretKey) {
      headers = headers.set('X-MINDS-EMAIL-2FA-KEY', payload.emailSecretKey);
    }

    return request.clone({ headers });
  }

  /**
   * This function will detect if TwoFactor is required, open the two factor
   * modal, apply headers to request and retry
   */
  handleResponseError(
    err: any,
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    if (
      [
        'Minds::Core::Security::TwoFactor::TwoFactorRequiredException',
        'Minds::Core::Security::TwoFactor::TwoFactorInvalidCodeException',
      ].indexOf(err?.error?.errorId) > -1
    ) {
      // Only 2fa exceptions has all our headers
      if (
        err?.error.errorId ===
        'Minds::Core::Security::TwoFactor::TwoFactorRequiredException'
      ) {
        const smsKey = err.headers.get('X-MINDS-SMS-2FA-KEY');
        const emailKey = err.headers.get('X-MINDS-EMAIL-2FA-KEY');

        let mfaType: MultiFactorRootPanel = 'email';

        if (smsKey) {
          mfaType = 'sms';
        } else if (emailKey) {
          // already set above
        } else {
          mfaType = 'totp';
        }

        this.multiFactorAuthService.originalRequest$.next(req);
        this.multiFactorAuthService.mfaType$.next(mfaType);
        this.multiFactorAuthService.mfaSecretKey$.next(smsKey || emailKey);
      }

      // if (
      //   err?.error.errorId ===
      //   'Minds::Core::Security::TwoFactor::TwoFactorInvalidCodeException'
      // ) {
      //   this.multiFactorAuthService.inProgress$.next(false);
      // }

      return race([
        this.multiFactorAuthService.mfaPayload$,
        from(
          this.multiFactorModalService.open({
            authType: this.multiFactorAuthService.mfaType$.getValue(),
          })
        ),
        // this.multiFactorModalService.isOpen()
        //   ? this.multiFactorModalService.dismissed
        //   : from(
        //       this.multiFactorModalService.open({
        //         authType: this.multiFactorAuthService.mfaType$.getValue(),
        //       })
        //     ),
      ]).pipe(
        first(),
        switchMap(payload => {
          if (!payload) {
            throw 'Front::TwoFactorAborted';
          }
          req = this.addHeaders(req, payload);
          return next.handle(req).pipe(
            catchError(err => {
              if (
                err !== 'Front::TwoFactorAborted' &&
                err?.error?.errorId !==
                  'Minds::Core::Security::TwoFactor::TwoFactorRequiredException'
              ) {
                this.toastService.error(
                  err?.error?.message ?? `An unknown error has occurred`
                );
              }
              return this.handleResponseError(err, req, next);
            }),
            finalize(() => {
              this.multiFactorModalService.dismiss({ success: true });
            })
          );
        })
      );
    }
    return throwError(err);
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
      catchError(err => {
        return this.handleResponseError(err, req, next);
      })
    );
  }
}
