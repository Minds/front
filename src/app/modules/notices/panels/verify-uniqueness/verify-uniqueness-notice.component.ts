import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ConnectWalletModalService } from '../../../blockchain/connect-wallet/connect-wallet-modal.service';
import { PhoneVerificationService } from '../../../wallet/components/components/phone-verification/phone-verification.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

@Component({
  selector: 'm-feedNotice--verifyUniqueness',
  templateUrl: 'verify-uniqueness-notice.component.html',
})
export class VerifyUniquenessNoticeComponent extends AbstractSubscriberComponent
  implements OnInit {
  constructor(
    private feedNotice: FeedNoticeService,
    private connectWalletModal: ConnectWalletModalService,
    private phoneVerification: PhoneVerificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      // Dismiss on phone verification - because the connectWalletModal
      // completes on wallet connection AFTER verification.
      this.phoneVerification.phoneVerified$
        .pipe(filter(Boolean))
        .subscribe((isConnected: boolean) => {
          this.dismiss();
        })
    );
  }

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public async onPrimaryOptionClick($event: MouseEvent): Promise<void> {
    await this.connectWalletModal.joinRewards(() => void 0);
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.dismiss('verify-uniqueness');
  }
}
