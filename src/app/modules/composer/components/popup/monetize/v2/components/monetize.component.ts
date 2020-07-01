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
interface MonetizationState {
  type: MonetizationTabType;
  urn?: string;
  has_tokens?: boolean;
  usd?: number;
  expires?: number;
}

@Component({
  selector: 'm-composer__monetizeV2',
  templateUrl: 'monetize.component.html',
  providers: [SupportTiersService],
})
export class ComposerMonetizeV2Component implements OnInit {
  isEditing: boolean = false;
  isEditingPlus: boolean = false;

  plusTierUrn: string = '';

  /**
   * Signal event emitter to parent's popup service
   */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Monetization popup state object
   */
  state: MonetizationState = {
    type: 'plus',
  };

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
    this.isEditing = this.service.isEditing$.getValue();
    const monetization = this.service.monetization$.getValue();

    /**
     * Go to the tab of current monetization
     */
    if (this.isEditing && monetization) {
      const tier = this.service.entity.wire_threshold;
      if (tier) {
        this.setType(tier);
      }
    }
  }

  setType(tier: SupportTier) {
    if (!tier.public) {
      this.state.type = 'custom';
    } else if (tier.urn === this.plusTierUrn) {
      this.isEditingPlus = true;
      this.state.type = 'plus';
    } else {
      this.state.type = 'membership';
    }
  }
}
