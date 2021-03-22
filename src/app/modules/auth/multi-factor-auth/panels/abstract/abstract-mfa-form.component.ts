import { Directive, EventEmitter, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  MultiFactorAuthService,
  MultiFactorPanel,
} from '../../services/multi-factor-auth-service';

/**
 * Abstract class for MFA input forms.
 */
@Directive()
export abstract class AbstractMFAFormComponent implements OnDestroy {
  // subscriptions within host.
  protected subscriptions: Subscription[] = [];

  // code or recovery code.
  public readonly code$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  // to be fired on code verify
  @Output('onVerify') onVerify: EventEmitter<any> = new EventEmitter();

  // to be fired for a manual dismissal.
  @Output('onDismiss') onDismiss: EventEmitter<any> = new EventEmitter();

  /**
   * Whether request is in progress.
   * @returns { BehaviorSubject<boolean> } - true if request in progress.
   */
  get inProgress$(): BehaviorSubject<boolean> {
    return this.service.inProgress$;
  }

  /**
   * Active panel from service.
   * @returns { BehaviorSubject<MultiFactorPanel> } - currently active panel.
   */
  get activePanel$(): BehaviorSubject<MultiFactorPanel> {
    return this.service.activePanel$;
  }

  /**
   * Should be disabled.
   * @returns { Observable<boolean> } - true if should be disabled.
   */
  get disabled$(): Observable<boolean> {
    return this.code$.pipe(map((code: string) => code.length !== 6));
  }

  constructor(public service: MultiFactorAuthService) {}

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      try {
        subscription.unsubscribe();
      } catch (e) {}
    }

    this.code$.next('');
    this.inProgress$.next(false);
  }

  /**
   * Fired on code change.
   * @param { string } $event - string of new value for code.
   */
  public onCodeChange($event: string): void {
    this.code$.next($event);
  }

  /**
   * Abstract function that MUST be overridden.
   * To be fired on verify button click.
   * @returns { void }
   */
  public onVerifyClick(): void {
    throw new Error('MFA forms must provide onVerifyClick() function');
  }
}
