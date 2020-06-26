import { Component, Input, OnInit } from '@angular/core';
import { PaywallType } from '../../../modules/wire/lock-screen/wire-lock-screen.component';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-paywallBadge',
  templateUrl: './paywall-badge.component.html',
})
export class PaywallBadgeComponent implements OnInit {
  @Input() entity: any;

  /**
   * Override the red background of the Minds+ badge
   */
  @Input() accentColor: boolean = true;

  /**
   * Override the top-right positioning
   */
  @Input() topRightPosition: boolean = true;

  hasPaywall: boolean = false;
  paywallType: PaywallType = 'custom';
  tierName: string;
  init: boolean = false;

  readonly plusSupportTierUrn: string;

  constructor(private config: ConfigsService) {
    this.plusSupportTierUrn = config.get('plus').support_tier_urn;
  }

  ngOnInit(): void {
    if (!this.entity) {
      return;
    }

    if (this.entity.remind_object) {
      this.entity = this.entity.remind_object;
    }

    this.hasPaywall = !!this.entity.paywall || this.entity.paywall_unlocked;

    if (this.hasPaywall) {
      // TODO determine the paywall type here

      if (
        this.entity.wire_threshold &&
        this.entity.wire_threshold.support_tier
      ) {
        this.paywallType = 'tier';
        if (
          this.entity.wire_threshold.support_tier.urn == this.plusSupportTierUrn
        ) {
          this.paywallType = 'plus';
        } else {
          this.paywallType = 'tier';
          this.tierName = this.entity.wire_threshold.support_tier.name;
        }
      }
    }

    this.init = true;
  }
}
