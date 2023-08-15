import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/ux/modal.service';
import { PlusUpgradeNoticeExperimentService } from '../../../experiments/sub-services/plus-upgrade-notice-experiment.service';
import { WireCreatorComponent } from '../../../wire/v2/creator/wire-creator.component';
import { WirePaymentHandlersService } from '../../../wire/wire-payment-handlers.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Feed notice showing users that they can upgrade to Plus.
 */
@Component({
  selector: 'm-feedNotice--proUpgrade',
  templateUrl: 'pro-upgrade-notice.component.html',
})
export class ProUpgradeNoticeComponent implements OnInit {
  @Input() public dismissible: boolean = true;

  constructor(
    private feedNotice: FeedNoticeService,
    private modalService: ModalService,
    private wirePaymentHandlers: WirePaymentHandlersService
  ) {}

  ngOnInit(): void {}

  /**
   * Called on primary option click. Opens modal for Minds+ payment.
   * @return { Promise<void> }
   */
  public async onPrimaryOptionClick(): Promise<void> {
    const modal = this.modalService.present(WireCreatorComponent, {
      size: 'lg',
      data: {
        entity: await this.wirePaymentHandlers.get('pro'),
        default: {
          type: 'money',
          upgradeType: 'pro',
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
    window.open('/pro', '_blank');
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public onDismissClick(): void {
    this.feedNotice.dismiss('pro-upgrade');
  }
}
