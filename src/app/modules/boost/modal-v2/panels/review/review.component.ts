import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { ThemeService } from '../../../../../common/services/theme.service';
import {
  BoostAudience,
  BoostModalPanel,
  BoostPaymentCategory,
  EstimatedReach,
} from '../../boost-modal-v2.types';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';

/**
 * Boost modal review section - allows users to see what they have opted into
 * and submit the boost after review.
 */
@Component({
  selector: 'm-boostModalV2__review',
  templateUrl: './review.component.html',
  styleUrls: ['review.component.ng.scss'],
})
export class BoostModalV2ReviewComponent {
  public BoostAudience: typeof BoostAudience = BoostAudience;

  public form: FormGroup;

  // selected payment category - this is separate to payment method because tokens is a payment category
  // but does not distinguish between offchain and onchain.
  public readonly paymentCategory$: Observable<BoostPaymentCategory> = this
    .service.paymentCategory$;

  // selected audience.
  public readonly audience$: Observable<BoostAudience> = this.service.audience$;

  // selected duration.
  public readonly duration$: Observable<number> = this.service.duration$;

  // selected daily budget.
  public readonly dailyBudget$: Observable<number> = this.service.dailyBudget$;

  // total payment amount to be charged.
  public readonly totalPaymentAmountText$: Observable<string> = this.service
    .totalPaymentAmountText$;

  // text for budget and duration section.
  public readonly budgetAndDurationText$: Observable<string> = combineLatest([
    this.paymentCategory$,
    this.duration$,
    this.dailyBudget$,
  ]).pipe(
    map(([paymentCategory, duration, dailyBudget]): string => {
      const durationText: string =
        duration > 1 ? `${duration} days` : `${duration} day`;
      return paymentCategory === 'cash'
        ? `\$${dailyBudget} per day for ${durationText}`
        : `${dailyBudget} tokens per day for ${durationText}`;
    })
  );

  // background for select box.
  public selectBackground$: Observable<{
    background: string;
  }> = this.theme.isDark$.pipe(
    map(isDark => {
      return {
        background: `url('${this.cdnAssetsUrl}assets/icons/arrow-drop-down-${
          isDark ? 'white' : 'black'
        }.svg') 98% center no-repeat`,
      };
    })
  );

  // estimate reach text.
  public readonly estimatedReachText$: Observable<
    string
  > = this.service.estimatedReach$.pipe(
    map((estimatedReach: EstimatedReach) => {
      return estimatedReach
        ? `${estimatedReach.lower_bound} - ${estimatedReach.upper_bound} people`
        : 'unknown';
    })
  );

  // CDN assets URL.
  private readonly cdnAssetsUrl: string;

  constructor(
    private service: BoostModalV2Service,
    private theme: ThemeService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  /**
   * Change the active panel - allows back click behavior.
   * @param { BoostModalPanel } panel - panel to set as active.
   * @returns { void }
   */
  public changePanel(panel: BoostModalPanel): void {
    this.service.activePanel$.next(panel);
  }
}
