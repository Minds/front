import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'minds-paywall',
  templateUrl: 'paywall.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayWall {
  readonly cdnUrl: string;

  inProgress: boolean = false;
  error: string;
  showCheckout: boolean = false;
  amount: number;
  nonce: string = '';
  showSignupModal: boolean = false;

  @Output('entityChange') update: EventEmitter<any> = new EventEmitter();

  @Input() entity;

  constructor(
    public session: Session,
    public client: Client,
    public cd: ChangeDetectorRef,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  checkout() {
    if (!this.session.isLoggedIn()) {
      this.showSignupModal = true;
      this.detectChanges();
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    this.client
      .get('api/v1/payments/plans/exclusive/' + this.entity.guid)
      .then((response: any) => {
        this.inProgress = false;
        if (response.subscribed) {
          this.update.next(response.entity);
          this.detectChanges();
          return;
        }
        this.showCheckout = true;
        this.amount = response.amount;
        this.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.error = 'Sorry, there was an error.';
        this.detectChanges();
      });
  }

  subscribe(nonce) {
    this.showCheckout = false;
    this.inProgress = true;
    this.detectChanges();
    console.log('nonce: ' + nonce);
    this.client
      .post(
        'api/v1/payments/plans/subscribe/' +
          this.entity.owner_guid +
          '/exclusive',
        {
          nonce: nonce,
        }
      )
      .then(response => setTimeout(() => this.checkout(), 0))
      .catch(e => {
        this.inProgress = false;
        this.error = "Sorry, we couldn't complete the transaction.";
        this.detectChanges();
      });
  }

  private detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
