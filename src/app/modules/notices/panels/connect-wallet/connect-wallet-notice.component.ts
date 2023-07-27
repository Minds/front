import { Component, Input, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ConnectWalletModalService } from '../../../blockchain/connect-wallet/connect-wallet-modal.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Notice to prompt the user to connect wallet.
 */
@Component({
  selector: 'm-feedNotice--connectWallet',
  templateUrl: 'connect-wallet-notice.component.html',
})
export class ConnectWalletNoticeComponent extends AbstractSubscriberComponent
  implements OnInit {
  @Input() public dismissible: boolean = true;

  constructor(
    private feedNotice: FeedNoticeService,
    private connectWallet: ConnectWalletModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.connectWallet.isConnected$
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
    await this.connectWallet.joinRewards(() => {
      this.dismiss();
    });
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.dismiss('connect-wallet');
  }
}
