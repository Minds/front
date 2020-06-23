import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'm-composer__monetizeV2__plus',
  templateUrl: './plus.component.html',
})
export class ComposerMonetizeV2PlusComponent implements OnInit {
  isPro;

  constructor(
    private proService: ProService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    private wireModal: WireModalService,
    private session: Session,
    private popup: PopupService,
    private stackableModal: StackableModalService
  ) {}

  ngOnInit(): void {
    this.setup();
  }

  async setup(): Promise<void> {
    this.isPro = await this.proService.isActive();
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
}
