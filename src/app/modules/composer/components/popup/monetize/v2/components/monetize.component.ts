import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../../../services/composer.service';
import { SupportTiersService } from '../../../../../../wire/v2/support-tiers.service';
import { Session } from '../../../../../../../services/session';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { ComposerMonetizeV2Service } from './monetize.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type MonetizationTabType = 'plus' | 'membership' | 'custom';

/**
 * Container for forms users may use to monetize their post BEFORE it is published
 * (e.g. with Minds+ pool or a membership tier)
 */
@Component({
  selector: 'm-composer__monetizeV2',
  templateUrl: 'monetize.component.html',
  providers: [SupportTiersService, ComposerMonetizeV2Service],
})
export class ComposerMonetizeV2Component implements OnInit {
  type: MonetizationTabType = 'plus';
  hasSupportTiers$: Observable<
    boolean
  > = this.monetizeService.supportTiers$.pipe(
    map(supportTiers => {
      return supportTiers.length > 0;
    })
  );

  isEditingPlus: boolean = false;

  isGroupPost: boolean = false;

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
   */
  constructor(
    public service: ComposerService,
    protected session: Session,
    configs: ConfigsService,
    protected monetizeService: ComposerMonetizeV2Service
  ) {
    this.plusTierUrn = configs.get('plus').support_tier_urn;
  }

  /**
   * Component initialization. Set initial state.
   */
  ngOnInit(): void {
    this.monetizeService.loadSupportTiers(this.session.getLoggedInUser().guid);

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

    this.service.isGroupPost$.subscribe(is => {
      this.isGroupPost = is;
      this.type = is ? 'membership' : 'plus';
    });
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
