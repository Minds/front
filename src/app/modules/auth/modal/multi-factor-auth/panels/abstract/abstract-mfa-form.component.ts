import { Directive, EventEmitter, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

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

  // request is in progress
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // to be fired on code verify
  @Output('onVerify') onVerify: EventEmitter<any> = new EventEmitter();

  // to be fired for a manual dismissal.
  @Output('onDismiss') onDismiss: EventEmitter<any> = new EventEmitter();

  /**
   * Fired on code change.
   * @param { string } $event - string of new value for code.
   */
  public onCodeChange($event: string): void {
    this.code$.next($event);
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.code$.next('');
    this.inProgress$.next(false);
  }

  /**
   * Should be disabled.
   * @returns { Observable<boolean> } - true if should be disabled.
   */
  get disabled$(): Observable<boolean> {
    return this.code$.pipe(map((code: string) => code.length !== 6));
  }

  /**
   * Abstract function that MUST be overridden. To be fired on verify button click.
   * @returns { void }
   */
  public onVerifyClick(): void {
    throw new Error('MFA forms must provide onVerifyClick() function');
  }
}
