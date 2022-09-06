import { Component, Input, OnInit } from '@angular/core';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { ActivityV2ExperimentService } from '../../../modules/experiments/sub-services/activity-v2-experiment.service';
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
  isSupermind: boolean = false;

  paywallType: PaywallType = 'custom';
  tierName: string;
  init: boolean = false;
  activityV2Feature: boolean = false;

  readonly plusSupportTierUrn: string;

  constructor(
    private config: ConfigsService,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {
    this.plusSupportTierUrn = config.get('plus')?.support_tier_urn;
  }

  ngOnInit(): void {
    this.activityV2Feature = this.activityV2Experiment.isActive();
  }

  load(): void {
    if (!this._entity) {
      return;
    }

    if (this._entity.remind_object) {
      this._entity = this._entity.remind_object;
    }

    this.hasPaywall = !!this._entity.paywall || this._entity.paywall_unlocked;
    // ojm fausto
    this.isSupermind = true;
    // this.isSupermind = this.entity.supermind && this.entity.supermind.is_reply;

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
