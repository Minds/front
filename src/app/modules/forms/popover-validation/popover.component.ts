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

  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    this.lengthCheck = str.length >= 8;
    this.specialCharCheck = /[^a-zA-Z\d]/.exec(str) !== null;
    this.mixedCaseCheck =
      /[a-z]/.exec(str) !== null && /[A-Z]/.exec(str) !== null;
    this.numbersCheck = /\d/.exec(str) !== null;
    this.spacesCheck = /\s/.exec(str) === null;
    this.detectChanges();

    if (this.synchronousChecksValid) {
      // assess risk whenever all the other checks pass,
      // even if risk was previously valid
      this.riskCheck = await this.assessRisk(str);

      if (!this.allChecksValid) {
        this.change.emit(false);
      } else {
        // if everything is right, wait a bit and hide
        setTimeout(() => this.hide(true), 500);
        this.change.emit(true);
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
