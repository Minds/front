import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WireUpgradeType } from '../../../wire/v2/wire-v2.service';
import { ConfigsService } from '../../../../common/services/configs.service';

@Component({
  selector: 'm-upsellButton',
  templateUrl: './upsell-button.component.html',
  styleUrls: ['./upsell-button.component.ng.scss'],
})
export class UpsellButtonComponent {
  readonly upgrades;

  constructor(configs: ConfigsService) {
    this.upgrades = configs.get('upgrades');
  }
  @Input() upgradeType: WireUpgradeType;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  get monthlyBoostCredits(): string {
    return this.upgrades[this.upgradeType].monthly.usd;
  }

  get yearlyBoostCredits(): number {
    return this.upgrades[this.upgradeType].yearly.usd;
  }

  get isPlus(): boolean {
    return this.upgradeType === 'plus';
  }
}
