import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivityV2ExperimentService } from '../../../modules/experiments/sub-services/activity-v2-experiment.service';
import { PaywallType } from '../../../modules/wire/lock-screen/wire-lock-screen.component';
import { ConfigsService } from '../../services/configs.service';

/**
 * Determine whether to display a badge for various paywalls
 * (includes minds+, custom paywalls and superminds)
 */
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

  // True when we want the badge to be displayed as a reply
  // (with purple gradient), regardless of whether it's
  // a request or reply (e.g. in composer)
  @Input() alwaysShowSupermindGradient: boolean = false;

  isSupermind: boolean = false;
  isSupermindReply: boolean = false;

  paywallType: PaywallType = 'custom';
  tierName: string;
  init: boolean = false;
  activityV2Feature: boolean = false;

  readonly plusSupportTierUrn: string;

  subscriptions: Subscription[];

  constructor(
    private config: ConfigsService,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {
    this.plusSupportTierUrn = config.get('plus')?.support_tier_urn;
  }

  ngOnInit(): void {
    this.activityV2Feature = this.activityV2Experiment.isActive();

    // Determine if we should show the supermind badge
    if (this._entity && this._entity.supermind) {
      this.isSupermind = true;
      this.isSupermindReply =
        this._entity.supermind.is_reply || this.alwaysShowSupermindGradient;
    }
  }

  load(): void {
    if (!this._entity) {
      return;
    }

    // Use the paywall status of the quoted post, not the quote wrapper
    // if (this._entity.remind_object) {
    //   this._entity = this._entity.remind_object;
    // }

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
