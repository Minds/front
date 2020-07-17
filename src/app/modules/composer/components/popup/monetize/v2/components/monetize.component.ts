import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../../../services/composer.service';
import {
  SupportTier,
  SupportTiersService,
} from '../../../../../../wire/v2/support-tiers.service';
import { Session } from '../../../../../../../services/session';
import { FeaturesService } from '../../../../../../../services/features.service';
import { ConfigsService } from '../../../../../../../common/services/configs.service';

export type MonetizationTabType = 'plus' | 'membership' | 'custom';

@Component({
  selector: 'm-composer__monetizeV2',
  templateUrl: 'monetize.component.html',
  providers: [SupportTiersService],
})
export class ComposerMonetizeV2Component implements OnInit {
  type: MonetizationTabType = 'plus';

  isEditingPlus: boolean = false;

  plusTierUrn: string = '';

  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Constructor
   * @param service
   * @param supportTiers
   * @param session
   * @param features
   */
  constructor(
    public service: ComposerService,
    public features: FeaturesService,
    protected session: Session,
    configs: ConfigsService
  ) {
    this.plusTierUrn = configs.get('plus').support_tier_urn;
  }

  /**
   * Component initialization. Set initial state.
   */
  ngOnInit(): void {
    const monetization = this.service.monetization$.getValue();
    const pendingMonetization = this.service.pendingMonetization$.getValue();

    /**
     * Go to the tab of most recent monetization
     */

    if (monetization && monetization.support_tier) {
      this.setType(monetization.support_tier);
    }
    if (pendingMonetization) {
      this.type = pendingMonetization.type || 'plus';
      return;
    }
  }

  setType(tier) {
    if (!tier.public) {
      this.type = 'custom';
    } else if (tier.urn === this.plusTierUrn) {
      this.type = 'plus';
      const savedState = this.service.entity;
      if (
        savedState &&
        savedState.wire_threshold &&
        savedState.wire_threshold.support_tier
      ) {
        if (savedState.wire_threshold.support_tier.urn === this.plusTierUrn) {
          this.isEditingPlus = true;
        }
      }
    } else {
      this.type = 'membership';
    }
  }
}
