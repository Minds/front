import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProService } from '../../../../../../../pro/pro.service';
import { WirePaymentHandlersService } from '../../../../../../../wire/wire-payment-handlers.service';
import { WireModalService } from '../../../../../../../wire/wire-modal.service';
import { WireEventType } from '../../../../../../../wire/v2/wire-v2.service';
import { Session } from '../../../../../../../../services/session';
import { PopupService } from '../../../../popup.service';
import { WireCreatorComponent } from '../../../../../../../wire/v2/creator/wire-creator.component';
import {
  StackableModalService,
  StackableModalState,
  StackableModalEvent,
} from '../../../../../../../../services/ux/stackable-modal.service';
import { ComposerService } from '../../../../../../services/composer.service';
import { ConfigsService } from '../../../../../../../../common/services/configs.service';

@Component({
  selector: 'm-composer__monetizeV2__plus',
  templateUrl: './plus.component.html',
})
export class ComposerMonetizeV2PlusComponent implements OnInit {
  readonly plusSupportTierUrn: string;
  isPro;

  constructor(
    private service: ComposerService,
    private configs: ConfigsService,
    private proService: ProService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    private cd: ChangeDetectorRef,
    private stackableModal: StackableModalService,
    private session: Session
  ) {
    this.plusSupportTierUrn =
      configs.get('plus').support_tier_urn || 'urn:support-tier:plus';
  }

  ngOnInit(): void {
    this.setup();
  }

  async setup(): Promise<void> {
    this.isPro = this.session.getLoggedInUser().pro;
    this.isPro = await this.proService.isActive();
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  async openProUpgradeModal(): Promise<void> {
    const plusGuid = await this.wirePaymentHandlers.get('pro');
    let completed = false;

    const stackableModalEvent: StackableModalEvent = await this.stackableModal
      .present(WireCreatorComponent, plusGuid, {
        wrapperClass: 'm-modalV2__wrapper',
        default: {
          type: 'money',
          upgradeType: 'plus',
        },
        onComplete: wire => {
          completed = true;
          this.isPro = true;
        },
      })
      .toPromise();
    if (stackableModalEvent.state === StackableModalState.Dismissed) {
      this.isPro = completed;
    }
  }

  get termsAccepted(): boolean {
    const monetization = this.service.monetization$.value;
    return (
      monetization && monetization.support_tier.urn === this.plusSupportTierUrn
    );
  }

  onTermsChange(value): void {
    if (value) {
      this.service.monetization$.next({
        support_tier: {
          urn: this.plusSupportTierUrn,
        },
      });
    } else {
      this.service.monetization$.next(null);
    }
  }
}
