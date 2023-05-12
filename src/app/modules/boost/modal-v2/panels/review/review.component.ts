import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BoostAudience,
  BoostModalPanel,
  BoostPaymentCategory,
  EstimatedReach,
} from '../../boost-modal-v2.types';
import { BoostModalV2Service } from '../../services/boost-modal-v2.service';
import { BoostGoalsExperimentService } from '../../../../experiments/sub-services/boost-goals-experiment.service';
import { BoostGoal } from '../../../boost.types';

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
  // enums.
  public BoostAudience: typeof BoostAudience = BoostAudience;
  public BoostModalPanel: typeof BoostModalPanel = BoostModalPanel;
  public BoostGoal: typeof BoostGoal = BoostGoal;

  public form: UntypedFormGroup;

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
      return paymentCategory === BoostPaymentCategory.CASH
        ? `\$${dailyBudget} per day for ${durationText}`
        : `${dailyBudget} tokens per day for ${durationText}`;
    })
  );

  // estimate reach text.
  public readonly estimatedReachText$: Observable<
    string
  > = this.service.estimatedReach$.pipe(
    map((estimatedReach: EstimatedReach) => {
      return estimatedReach
        ? `${estimatedReach.views.low} - ${estimatedReach.views.high} views`
        : 'unknown';
    })
  );

  // selected boost goal
  public readonly goal$: Observable<BoostGoal> = this.service.goal$;

  // whether goal section should be shown.
  public readonly showGoalSection$: Observable<boolean> = this.service
    .canSetBoostGoal$;

  constructor(
    private service: BoostModalV2Service,
    protected boostGoalsExperiment: BoostGoalsExperimentService
  ) {}

  /**
   * Change the active panel - allows back click behavior.
   * @param { BoostModalPanel } panel - panel to set as active.
   * @returns { void }
   */
  public changePanel(panel: BoostModalPanel): void {
    this.service.activePanel$.next(panel);
  }
}
