import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  ComposerService,
  MonetizationSubjectValue,
} from '../../../services/composer.service';
import { UniqueId } from '../../../../../helpers/unique-id.helper';
import {
  SupportTier,
  SupportTiersService,
} from '../../../../wire/v2/support-tiers.service';
import { Session } from '../../../../../services/session';
import { FeaturesService } from '../../../../../services/features.service';

//ojm do we need this file? The template is just a reference to v2
interface MonetizationState {
  enabled: boolean;
  type: 'tokens' | 'money';
  amount: number;
  supportTier?: SupportTier;
}

@Component({
  selector: 'm-composer__monetize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'monetize.component.html',
  providers: [SupportTiersService],
})
export class MonetizeComponent implements OnInit {
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * ID for input/label relationships
   */
  readonly inputId: string = UniqueId.generate('m-composer__tags');

  /**
   * Monetization popup state object
   */
  state: MonetizationState = {
    enabled: false,
    type: 'tokens',
    amount: 0,
    supportTier: null,
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
    public supportTiers: SupportTiersService,
    public features: FeaturesService,
    protected session: Session
  ) {
    this.supportTiers.setEntityGuid(this.session.getLoggedInUser().guid);
  }

  /**
   * Component initialization. Set initial state.
   */
  ngOnInit(): void {
    const monetization = this.service.monetization$.getValue();

    this.state = {
      enabled: Boolean(monetization),
      type: (monetization && monetization.type) || 'tokens',
      amount: (monetization && monetization.min) || 0,
      //supportTier: (monetization && monetization.support_tier) || null,
    };
  }

  /**
   * Selects a support tier and fills state values
   * @param supportTier
   */
  selectSupportTier(supportTier: SupportTier): void {
    this.state.supportTier = supportTier;

    if (supportTier) {
      this.state.type = supportTier.has_usd
        ? 'money'
        : supportTier.has_tokens
        ? 'tokens'
        : null;
      this.state.amount =
        supportTier[
          supportTier.has_usd ? 'usd' : supportTier.has_tokens ? 'tokens' : null
        ];
    }
  }

  /**
   * Compares two variables that can be a Support Tier or null.
   * Used by <select>.
   * @param a
   * @param b
   */
  byUrn(a: SupportTier, b: SupportTier) {
    return (!a && !b) || (a && b && a.urn === b.urn);
  }

  /**
   * Emit to subject
   */
  save() {
    let payload: MonetizationSubjectValue = null;

    if (this.state.enabled) {
      payload = {
        type: this.state.type,
        min: this.state.amount,
      };

      if (this.features.has('channels-shop')) {
        payload.support_tier = this.state.supportTier || null;
      }
    }

    this.service.monetization$.next(payload);

    this.dismissIntent.emit();
  }
}
