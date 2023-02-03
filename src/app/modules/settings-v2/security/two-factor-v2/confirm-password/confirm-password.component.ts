import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, throttleTime } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { SettingsTwoFactorV2Service } from '../two-factor-v2.service';

/**
 * Password confirm component - force a user to verify their password before enabling or removing 2fa
 */
@Component({
  selector: 'm-twoFactor__passwordConfirm',
  template: `
    <form class="m-twoFactor_passwordConfirmationForm" [formGroup]="form">
      <label i18n="@@2FA_PASSWORD_CONFIRM__PASSWORD">Password</label>
      <input
        type="password"
        name="password"
        formControlName="password"
        [ngModel]="password$ | async"
        (ngModelChange)="passwordValueChanged($event)"
      />

      <m-button
        [color]="'blue'"
        (onAction)="onConfirmClick()"
        [saving]="inProgress$ | async"
      >
        <ng-container i18n="@@2FA_PASSWORD_CONFIRM__CONFIRM"
          >Confirm</ng-container
        >
      </m-button>
    </form>
  `,
  styleUrls: ['./confirm-password.component.ng.scss'],
})
export class SettingsTwoFactorPasswordComponent
  extends AbstractSubscriberComponent
  implements OnInit {
  // amount input form
  public form: UntypedFormGroup;

  // password string from user
  public readonly password$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('');

  // is in progress
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Should progress be disabled?
   * @returns { Observable<boolean> } - true if should be disabled.
   */
  get disabled$(): Observable<boolean> {
    return this.password$.pipe(
      map((password: string) => !password || password.length < 6)
    );
  }

  constructor(
    private service: SettingsTwoFactorV2Service,
    private api: ApiService,
    private toast: ToasterService
  ) {
    super();
  }

  ngOnInit(): void {
    // init form group.
    this.form = new UntypedFormGroup({
      password: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  /**
   * Called on confirm click.
   * @returns { void }
   */
  public onConfirmClick(): void {
    this.inProgress$.next(true);

    this.subscriptions.push(
      this.password$
        .pipe(
          take(1), // call once
          throttleTime(2000), // disallow more than 1 request every 2s
          switchMap((password: string) => {
            // switch outer observable to api req.
            return this.api.post('api/v2/settings/password/validate', {
              password: password,
            });
          }),
          catchError(e => {
            this.inProgress$.next(false);
            this.toast.error('Incorrect password. Please try again.');
            return of(null);
          })
        )
        .subscribe(response => {
          this.inProgress$.next(false);
          if (response && response.status === 'success') {
            this.onSuccess();
            return;
          }
          this.password$.next(''); // clear password.
        })
    );
  }

  /**
   * Called on password change - updates password value.
   * @param { string } $event - new password value.
   */
  public passwordValueChanged($event: string) {
    this.password$.next($event);
  }

  /**
   * Called on success. Sets up next panel.
   * @returns { void }
   */
  private onSuccess(): void {
    this.subscriptions.push(
      this.service.activePanel$.pipe(take(1)).subscribe(activePanel => {
        this.service.passwordConfirmed$.next(true);
        this.password$.next('');
        switch (activePanel?.intent) {
          case 'setup-app':
            this.service.activePanel$.next({ panel: 'app-connect' });
            break;
          case 'disable':
            this.service.activePanel$.next({ panel: 'disable' });
            break;
          case 'sms':
            this.service.activePanel$.next({ panel: 'sms' });
            break;
        }
      })
    );
  }
}
