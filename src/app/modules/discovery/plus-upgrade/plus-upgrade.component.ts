import { Component, OnInit } from '@angular/core';
import { PlusService } from '../../plus/plus.service';
import { WireModalService } from '../../wire/wire-modal.service';
import { WireEventType } from '../../wire/v2/wire-v2.service';
import { WirePaymentHandlersService } from '../../wire/wire-payment-handlers.service';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-discovery__plusUpgrade',
  templateUrl: './plus-upgrade.component.html',
})
export class DiscoveryPlusUpgradeComponent implements OnInit {
  isPlus: boolean = false;

  constructor(
    private plusService: PlusService,
    private wireModal: WireModalService,
    private wirePaymentHandlers: WirePaymentHandlersService,
    private session: Session
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
    const wireEvent = await this.wireModal
      .present(plusGuid, {
        default: {
          type: 'money',
          upgradeType: 'plus',
        },
      })
      .toPromise();
    if (wireEvent.type === WireEventType.Completed) {
      this.isPlus = true;
    }
  }
}
