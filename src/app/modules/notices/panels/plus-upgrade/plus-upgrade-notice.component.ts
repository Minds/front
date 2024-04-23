import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/ux/modal.service';
import { WireCreatorComponent } from '../../../wire/v2/creator/wire-creator.component';
import { WirePaymentHandlersService } from '../../../wire/wire-payment-handlers.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Feed notice showing users that they can upgrade to Plus.
 */
@Component({
  selector: 'm-feedNotice--plusUpgrade',
  templateUrl: 'plus-upgrade-notice.component.html',
})
export class PlusUpgradeNoticeComponent {
  @Input() public dismissible: boolean = true;

  constructor(
    private feedNotice: FeedNoticeService,
    private modalService: ModalService,
    private wirePaymentHandlers: WirePaymentHandlersService
  ) {}

  /**
   * Called on primary option click. Opens modal for Minds+ payment.
   * @return { Promise<void> }
   */
  public async onPrimaryOptionClick(): Promise<void> {
    const modal = this.modalService.present(WireCreatorComponent, {
      size: 'lg',
      data: {
        entity: await this.wirePaymentHandlers.get('plus'),
        default: {
          type: 'money',
          upgradeType: 'plus',
          upgradeInterval: 'monthly',
        },
        onComplete: () => {
          this.onDismissClick();
          modal.close();
        },
      },
    });
  }

  /**
   * Called on secondary option click. Opens plus marketing page in a new tab.
   * @return { void }
   */
  public onSecondaryOptionClick(): void {
    window.open('/plus', '_blank');
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public onDismissClick(): void {
    this.feedNotice.dismiss('plus-upgrade');
  }
}
