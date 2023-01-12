import { Component, Injector, OnInit } from '@angular/core';
import { PlusService } from '../../plus/plus.service';
import { WireModalService } from '../../wire/wire-modal.service';
import { WireEventType } from '../../wire/v2/wire-v2.service';
import { WirePaymentHandlersService } from '../../wire/wire-payment-handlers.service';
import { Session } from '../../../services/session';
import { ComposerService } from '../../composer/services/composer.service';
import { ComposerModalService } from '../../composer/components/modal/modal.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-discovery__plusUpgrade',
  templateUrl: './plus-upgrade.component.html',
  styleUrls: ['./plus-upgrade.component.ng.scss'],
})
export class DiscoveryPlusUpgradeComponent implements OnInit {
  isPlus: boolean = false;

  constructor(
    private plusService: PlusService,
    private wireModal: WireModalService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    public session: Session,
    private configs: ConfigsService,
    private composerService: ComposerService,
    private composerModal: ComposerModalService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.setup();
  }

  async setup(): Promise<void> {
    this.isPlus = this.session.getLoggedInUser().plus;
    this.isPlus = await this.plusService.isActive();
  }

  async showUpgradeModal(): Promise<void> {
    const plusGuid = await this.wirePaymentHandlers.get('plus');
    const wireEvent = await this.wireModal.present(plusGuid, {
      default: {
        type: 'money',
        upgradeType: 'plus',
      },
    });
    if (wireEvent.type === WireEventType.Completed) {
      this.isPlus = true;
    }
  }

  async openComposerWithPlus(): Promise<void> {
    const plusSupportTierUrn: string =
      this.configs.get('plus').support_tier_urn || 'urn:support-tier:plus';

    const support_tier: any = {
      urn: plusSupportTierUrn,
    };

    // Clean before we open
    this.composerService.reset();

    this.composerService.pendingMonetization$.next({
      type: 'plus',
      support_tier: support_tier,
    });

    await this.composerModal.setInjector(this.injector).present();

    // Resest on close
    this.composerService.reset();
  }
}
