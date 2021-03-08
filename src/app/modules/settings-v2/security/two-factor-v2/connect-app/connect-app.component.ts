import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { SettingsTwoFactorV2Service } from '../two-factor-v2.service';

/**
 * Connect app panel - used so the user can scan their QR and verify the code given
 * by their auth app.
 */
@Component({
  selector: 'm-twoFactor__connectApp',
  templateUrl: './connect-app.component.html',
  styleUrls: ['./connect-app.component.ng.scss'],
})
export class SettingsTwoFactorConnectAppComponent extends AbstractSubscriberComponent {
  /**
   * User entered code from auth app.
   */
  public code$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Recovery code from service.
   * @returns { BehaviorSubject<string> } - recovery code.
   */
  get recoveryCode$(): BehaviorSubject<string> {
    return this.service.recoveryCode$;
  }

  /**
   * Disable progress if the length of the user inputted code is not 6.
   * @returns { Observable<boolean> } - true if progress should be blocked.
   */
  get disabled$(): Observable<boolean> {
    return this.code$.pipe(
      map((code: string) => {
        return code.length !== 6;
      })
    );
  }

  constructor(
    private service: SettingsTwoFactorV2Service,
    private toast: FormToastService
  ) {
    super();
  }

  /**
   * Called on 'Enable' button click.
   * @returns { void }
   */
  public enableButtonClick(): void {
    this.subscriptions.push(
      this.service.passwordConfirmed$.pipe(take(1)).subscribe(confirmed => {
        if (confirmed) {
          // TODO: Send code to server - let settings reload and display updated state.
          this.service.activePanel$.next({ panel: 'root' });
          this.toast.success('Two-factor authentication enabled');
          return;
        }

        this.service.activePanel$.next({
          panel: 'password',
          intent: 'setup-app',
        });
      })
    );
  }

  /**
   * Called on 'Back' button click. Goes back to recovery code panel.
   * @returns { void }
   */
  public backButtonClick(): void {
    this.service.activePanel$.next({ panel: 'recovery-code' });
  }

  /**
   * Called on code value change.
   * @param { string } $event - the new value for code.
   * @returns { void }
   */
  public codeValueChanged($event: string) {
    this.code$.next($event);
  }
}
