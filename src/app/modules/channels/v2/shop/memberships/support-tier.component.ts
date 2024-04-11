import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SupportTier } from '../../../../wire/v2/support-tiers.service';
import { Currency } from '../../../../../helpers/currency';

/**
 * Displays information related to a single membership tier
 */
@Component({
  selector: 'm-channelShopMemberships__supportTier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'support-tier.component.html',
  styleUrls: ['support-tier.component.ng.scss'],
})
export class ChannelShopMembershipsSupportTierComponent {
  @Input() supportTier: SupportTier;
  @Input() isOwner: boolean;
  @Input() displayCurrency: Currency | null = null;
  @Output() onSelectIntent: EventEmitter<SupportTier> =
    new EventEmitter<SupportTier>();
  @Output() onEditIntent: EventEmitter<SupportTier> =
    new EventEmitter<SupportTier>();
  @Output() onDeleteIntent: EventEmitter<SupportTier> =
    new EventEmitter<SupportTier>();

  get displayFilteredCurrency(): Currency | null {
    if (!this.supportTier) {
      return null;
    }

    // Only filter currency if non-owner
    //const displayCurrency = this.isOwner ? null : this.displayCurrency;
    const displayCurrency = null;

    // Depending on filter and availability return a specific one or the generic
    switch (displayCurrency) {
      case 'tokens':
        if (!this.supportTier.has_tokens) {
          return null;
        }

        return 'tokens';

      case 'usd':
        if (!this.supportTier.has_usd) {
          return null;
        }

        return 'usd';

      default:
        if (this.supportTier.has_usd && !this.supportTier.has_tokens) {
          return 'usd';
        } else if (this.supportTier.has_tokens && !this.supportTier.has_usd) {
          return 'tokens';
        }

        return null;
    }
  }
}
