import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ConnectWalletModalService } from '../../../blockchain/connect-wallet/connect-wallet-modal.service';
import { PhoneVerificationService } from '../../../wallet/components/components/phone-verification/phone-verification.service';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { InAppVerificationExperimentService } from '../../../experiments/sub-services/in-app-verification-experiment.service';
import { VerifyUniquenessModalLazyService } from '../../../verify-uniqueness/modal/services/verify-uniqueness-modal.service';

@Component({
  selector: 'm-feedNotice--verifyUniqueness',
  templateUrl: 'verify-uniqueness-notice.component.html',
})
export class VerifyUniquenessNoticeComponent extends AbstractSubscriberComponent
  implements OnInit {
  constructor(
    private feedNotice: FeedNoticeService,

    private verifyUniquenessModal: VerifyUniquenessModalLazyService,
    private connectWalletModal: ConnectWalletModalService,
    private phoneVerification: PhoneVerificationService,
    private inAppVerificationExperimentService: InAppVerificationExperimentService
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.isInAppVerificationExperimentActive()) {
      this.subscriptions.push(
        /**
         * Dismiss on phone verification - because connectWalletModal.joinRewards
         * fires connect your wallet modal and then only after
         * connection calls callback fn.
         */
        this.phoneVerification.phoneVerified$
          .pipe(filter(Boolean))
          .subscribe((isConnected: boolean) => {
            this.dismiss();
          })
      );
    }
  }

  public isInAppVerificationExperimentActive(): boolean {
    return this.inAppVerificationExperimentService.isActive();
  }

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public async onPrimaryOptionClick($event: MouseEvent): Promise<void> {
    if (this.isInAppVerificationExperimentActive()) {
      await this.verifyUniquenessModal.open();
      return;
    }

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
