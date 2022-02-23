import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Client } from '../../../services/api';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';
import {
  PASSWORD_VALIDATOR_LENGTH_CHECK,
  PASSWORD_VALIDATOR_MIXED_CASE_CHECK,
  PASSWORD_VALIDATOR_NUMBERS_CHECK,
  PASSWORD_VALIDATOR_SPACES_CHECK,
  PASSWORD_VALIDATOR_SPECIAL_CHAR_CHECK,
} from '../password.validator';

// key for security validation state.
export type SecurityValidationStateKey = 'PENDING' | 'FAILED' | 'SUCCESS';

// value for security validation state.
export type SecurityValidationStateValue = 'pending' | 'failed' | 'success';

/**
 * Different states of security validation.
 */
export const SecurityValidationState: {
  [key in SecurityValidationStateKey]: SecurityValidationStateValue;
} = {
  PENDING: 'pending',
  FAILED: 'failed',
  SUCCESS: 'success',
};

@Component({
  selector: 'm-popover',
  templateUrl: 'popover.component.html',
  styleUrls: ['popover.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  @ViewChild('content', { static: true }) content: ElementRef;

  lengthCheck: boolean = false;
  specialCharCheck: boolean = false;
  mixedCaseCheck: boolean = false;
  numbersCheck: boolean = false;
  spacesCheck: boolean = false;
  riskCheck: boolean = false;

  riskCheckInProgress: boolean = false;
  riskAssessed: boolean = false;
  riskModalOpen: boolean = false;

  hidden: boolean = false;

  /**
   * Emits the security validation state on state change.
   */
  @Output() change: EventEmitter<
    SecurityValidationStateValue
  > = new EventEmitter<SecurityValidationStateValue>();

  constructor(protected cd: ChangeDetectorRef, protected client: Client) {}

  show(): void {
    if (!this.hidden) {
      this.content.nativeElement.classList.add('m-popover__content--visible');
      this.detectChanges();
    }
  }

  hide(keepHidden: boolean = false): void {
    this.content.nativeElement.classList.remove('m-popover__content--visible');
    this.hidden = keepHidden;
    this.detectChanges();
  }

  async checkRules(str: string): Promise<void> {
    if (!this.allChecksValid) {
      this.show();
    }
    this.lengthCheck = PASSWORD_VALIDATOR_LENGTH_CHECK(str);
    this.specialCharCheck = PASSWORD_VALIDATOR_SPECIAL_CHAR_CHECK(str);
    this.mixedCaseCheck = PASSWORD_VALIDATOR_MIXED_CASE_CHECK(str);
    this.numbersCheck = PASSWORD_VALIDATOR_NUMBERS_CHECK(str);
    this.spacesCheck = PASSWORD_VALIDATOR_SPACES_CHECK(str);
    this.detectChanges();

    if (this.synchronousChecksValid) {
      // assess risk whenever all the other checks pass,
      // even if risk was previously valid
      this.change.emit(SecurityValidationState.PENDING);
      this.riskCheck = await this.assessRisk(str);

      if (!this.allChecksValid) {
        this.change.emit(SecurityValidationState.FAILED);
      } else {
        // if everything is right, wait a bit and hide
        setTimeout(() => this.hide(true), 500);
        this.change.emit(SecurityValidationState.SUCCESS);
      }
    }
    this.detectChanges();
  }

  async assessRisk(password: string): Promise<boolean> {
    /**
     * Don't show the check/cross until at least assessment has been made
     * */
    this.riskAssessed = true;

    this.riskCheckInProgress = true;
    this.detectChanges();

    const response = <any>await this.client.post(
      'api/v3/security/password/risk',
      {
        password: password,
      }
    );

    const riskCheck = response && response.risk ? !response.risk : true;
    this.riskCheckInProgress = false;
    this.detectChanges();

    return riskCheck;
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get isMobileOrTablet(): boolean {
    return isMobileOrTablet();
  }

  get synchronousChecksValid(): boolean {
    return (
      this.lengthCheck &&
      this.specialCharCheck &&
      this.mixedCaseCheck &&
      this.numbersCheck &&
      this.spacesCheck
    );
  }

  get allChecksValid(): boolean {
    return this.synchronousChecksValid && this.riskCheck;
  }
}
