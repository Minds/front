import { Component, Input, OnInit } from '@angular/core';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { PaywallType } from '../../../modules/wire/lock-screen/wire-lock-screen.component';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-paywallBadge',
  templateUrl: './paywall-badge.component.html',
  styleUrls: ['./paywall-badge.component.ng.scss'],
})
export class PaywallBadgeComponent implements OnInit {
  private _entity: any;
  @Input() set entity(value: any) {
    this._entity = value;
    this.load();
  }

  /**
   * Override the top-right positioning
   */
  @Input() topRightPosition: boolean = true;
  @Input() showTierName: boolean = true;

  hasPaywall: boolean = false;
  paywallType: PaywallType = 'custom';
  tierName: string;
  init: boolean = false;
  activityV2Feature: boolean = false;

  readonly plusSupportTierUrn: string;

  constructor(
    private config: ConfigsService,
    private experiments: ExperimentsService
  ) {
    this.plusSupportTierUrn = config.get('plus')?.support_tier_urn;
  }

  ngOnInit(): void {
    this.activityV2Feature = this.experiments.hasVariation(
      'front-5229-activities',
      true
    );
  }

  load(): void {
    // this.init = false;

    if (!this._entity) {
      return;
    }

    if (this._entity.remind_object) {
      this._entity = this._entity.remind_object;
    }

    this.hasPaywall = !!this._entity.paywall || this._entity.paywall_unlocked;

    /**
     * Determine paywall type
     * (All legacy paywalls are treated as custom paywalls)
     */
    if (
      this.hasPaywall &&
      this._entity.wire_threshold &&
      this._entity.wire_threshold.support_tier
    ) {
      const tier = this._entity.wire_threshold.support_tier;

      if (tier.urn === this.plusSupportTierUrn) {
        this.paywallType = 'plus';
      } else if (!tier.public) {
        this.paywallType = 'custom';
      } else {
        this.paywallType = 'tier';
        this.tierName = tier.name;
      }
    }

    this.init = true;
  }
}
