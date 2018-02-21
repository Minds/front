import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--join',
  templateUrl: 'join.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletTokenJoinComponent {

  confirming: boolean = false;
  number: number;
  code: number;
  secret: string;
  inProgress: boolean = false;
  error: string;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
  ) { 

  }

  ngOnInit() {
    if (this.session.getLoggedInUser().tel_no_hash) {
      console.log('sticking around!');
      //this.router.navigate(['/wallet/tokens/contributions']);
    }
  }

  async verify() {
    this.inProgress = true;
    this.error = null;
    try {
      let response: any = await this.client.post('api/v2/blockchain/rewards/verify', {
          number: this.number,
        });
      this.secret = response.secret;
      this.confirming = true;
    } catch (e) {
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

  async confirm() {
    this.inProgress = true;
    this.error = null;
    try {
      let response: any = await this.client.post('api/v2/blockchain/rewards/confirm', {
          number: this.number,
          code: this.code,
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

  join() {
    this.router.navigate(['/wallet/tokens/contributions']);
  }

  detectChange() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
