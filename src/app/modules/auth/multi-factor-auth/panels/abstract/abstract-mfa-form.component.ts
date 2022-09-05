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
  /**
   * The code a user enters
   */
  code: string = '';

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

  constructor(public service: MultiFactorAuthService) {}

  ngOnDestroy(): void {
    this.inProgress$?.next(false);
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
