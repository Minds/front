import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  PASSWORD_VALIDATOR_LENGTH_CHECK,
  PASSWORD_VALIDATOR_MIXED_CASE_CHECK,
  PASSWORD_VALIDATOR_NUMBERS_CHECK,
  PASSWORD_VALIDATOR_SPACES_CHECK,
  PASSWORD_VALIDATOR_SPECIAL_CHAR_CHECK,
} from '../password.validator';
import { Client } from '../../../services/api';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';

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

  public closingInProgress: boolean = false;

  private _password: string;
  @Input() set password(value: string) {
    this._password = value;
    if (value && value.length > 0) {
      this.checkSynchronousValidators();
    }
  }

  @Input() set riskCheckStatus(value: string) {
    if (value) {
      switch (value) {
        case 'PENDING':
          this.riskCheck = false;
          this.riskCheckInProgress = true;
          break;
        case 'VALID':
          this.riskCheck = true;
          this.riskCheckInProgress = false;
          break;
        default:
          // INVALID
          this.riskCheck = false;
          this.riskCheckInProgress = false;
          break;
      }
    } else {
      this.riskCheck = false;
      this.riskCheckInProgress = false;
    }

    this.detectChanges();
  }

  constructor(
    protected cd: ChangeDetectorRef,
    protected client: Client
  ) {}

  show(): void {
    if (this._password.length > 0) {
      this.content.nativeElement.classList.add('m-popover__content--visible');
      this.detectChanges();
    }
  }

  hide(): void {
    this.content.nativeElement.classList.remove('m-popover__content--visible');
    this.detectChanges();
  }

  /**
   * Hide popover with delay and loading spinner during close state.
   * @returns { void }
   */
  public hideWithDelay(): void {
    setTimeout(() => {
      this.closingInProgress = true;

      setTimeout(() => {
        this.hide();
        this.closingInProgress = false;
        this.detectChanges();
      }, 350);

      this.detectChanges();
    }, 300);
  }

  checkSynchronousValidators(): void {
    this.lengthCheck = PASSWORD_VALIDATOR_LENGTH_CHECK(this._password);
    this.specialCharCheck = PASSWORD_VALIDATOR_SPECIAL_CHAR_CHECK(
      this._password
    );
    this.mixedCaseCheck = PASSWORD_VALIDATOR_MIXED_CASE_CHECK(this._password);
    this.numbersCheck = PASSWORD_VALIDATOR_NUMBERS_CHECK(this._password);
    this.spacesCheck = PASSWORD_VALIDATOR_SPACES_CHECK(this._password);
    this.detectChanges();
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
