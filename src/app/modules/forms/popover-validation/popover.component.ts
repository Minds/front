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
      await this.assessRisk(str);
    } else {
      this.riskCheckInProgress = false;
      this.riskCheck = false;
      this.change.emit(false);
    }
    this.detectChanges();
  }

  hideBecauseValid() {
    // if everything is right, wait a bit and hide
    this.change.emit(true);
    setTimeout(() => this.hide(true), 500);
  }

  async assessRisk(password: string): Promise<void> {
    this.riskAssessed = true;
    this.riskCheckInProgress = true;
    this.detectChanges();

    const response = <any>await this.client.post(
      'api/v3/security/password/risk',
      {
        password: password,
      }
    );

    if (response && response.risk) {
      this.riskCheck = !response.risk;
    } else {
      this.riskCheck = true;
    }

    this.riskCheckInProgress = false;
    this.detectChanges();

    if (this.riskCheck) {
      this.hideBecauseValid();
    }
  }

  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
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
