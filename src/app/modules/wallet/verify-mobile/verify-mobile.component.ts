import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-verify-mobile',
  templateUrl: 'verify-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyMobileComponent {
  phoneNumber: string = '';
  confirming: boolean = false;
  number: number;
  code: number;
  secret: string;
  inProgress: boolean = false;
  error: string;
  plusPrompt: boolean = false;
  resent: boolean = false;

  @ViewChild('input1', { static: false }) input1: ElementRef;
  @ViewChild('input2', { static: false }) input2: ElementRef;
  @ViewChild('input3', { static: false }) input3: ElementRef;
  @ViewChild('input4', { static: false }) input4: ElementRef;
  @ViewChild('input5', { static: false }) input5: ElementRef;
  @ViewChild('input6', { static: false }) input6: ElementRef;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
  ) { 

  }

  ngOnInit() {
    if (this.session.getLoggedInUser().tel_no_hash) {
      //this.router.navigate(['/wallet/tokens/contributions']);
    }
  }

  async verify() {
    if (!this.resent && this.confirming) {
      this.resent = true;
    }

    this.plusPrompt = true;
    this.inProgress = true;
    this.error = null;
    try {
      let response: any = await this.client.post('api/v2/blockchain/rewards/verify', {
        number: this.number,
      });
      this.secret = response.secret;
      this.confirming = true;
      this.plusPrompt = true;
    } catch (e) {
      this.confirming = false;
      this.error = e.message;
    }
    this.inProgress = false;

    this.detectChange();
  }

  cancel() {
    this.confirming = false;
    this.code = null;
    this.secret = null;
    this.inProgress = false;
    this.error = null;
    this.detectChange();
  }

  onKeyup(e) {
    let nextControl: any = (e.key === 'Backspace')
      ? e.srcElement.previousElementSibling
      : e.srcElement.nextElementSibling;

    // Searching for next similar control to set it focus
    while (true) {
      if (nextControl) {
          if (nextControl.type === e.srcElement.type) {
              nextControl.focus();
              return;
          }
          else {
              nextControl = nextControl.nextElementSibling;
          }
      } 
      return;
    }
  }

  async confirm() {
    this.inProgress = true;
    this.error = null;
    try {
      await this.client.post('api/v2/blockchain/rewards/confirm', {
        number: this.number,
        code: this.getCodeValue(),
        secret: this.secret,
      });
      window.Minds.user.rewards = true;
      this.join();
    } catch (e) {
      this.error = e.message;
    }
    this.inProgress = false;
    this.detectChange();
  }

  getCodeValue(): string {
    return this.input1.nativeElement.value
     + this.input2.nativeElement.value
     + this.input3.nativeElement.value
     + this.input4.nativeElement.value
     + this.input5.nativeElement.value
     + this.input6.nativeElement.value;
  }
  join() {
    this.router.navigate(['/wallet/tokens/contributions']);
  }

  detectChange() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
