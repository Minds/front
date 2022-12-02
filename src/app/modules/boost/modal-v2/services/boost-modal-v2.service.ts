import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
  throwError,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';
import { ConfigsService } from '../../../../common/services/configs.service';
import {
  DEFAULT_AUDIENCE,
  DEFAULT_CASH_DURATION,
  DEFAULT_DAILY_CASH_BUDGET,
  DEFAULT_DAILY_TOKEN_BUDGET,
  DEFAULT_PAYMENT_CATEGORY,
  DEFAULT_TOKEN_DURATION,
} from '../boost-modal-v2.constants';
import {
  BoostableEntity,
  BoostAudience,
  BoostConfig,
  BoostModalPanel,
  BoostPaymentCategory,
  BoostPaymentMethod,
  BoostPaymentMethodId,
  BoostSubject,
  EstimatedReach,
} from '../boost-modal-v2.types';

/**
 * Service for creation and submission of boosts.
 */
@Injectable()
export class BoostModalV2Service implements OnDestroy {
  // selected entity for boosting.
  public readonly entity$: BehaviorSubject<
    BoostableEntity
  > = new BehaviorSubject<BoostableEntity>(null);

  // currently active modal panel.
  public readonly activePanel$: BehaviorSubject<
    BoostModalPanel
  > = new BehaviorSubject<BoostModalPanel>('audience');

  // currently selected audience.
  public readonly audience$: BehaviorSubject<
    BoostAudience
  > = new BehaviorSubject<BoostAudience>(DEFAULT_AUDIENCE);

  // currently selected payment category.
  public readonly paymentCategory$: BehaviorSubject<
    BoostPaymentCategory
  > = new BehaviorSubject<BoostPaymentCategory>(DEFAULT_PAYMENT_CATEGORY);

  // currently selected payment method.
  public readonly paymentMethod$: BehaviorSubject<
    BoostPaymentMethod
  > = new BehaviorSubject<BoostPaymentMethod>(null);

  // currently selected payment method id.
  public readonly paymentMethodId$: BehaviorSubject<
    BoostPaymentMethodId
  > = new BehaviorSubject<BoostPaymentMethodId>(null);

  // currently selected daily budget.
  public readonly dailyBudget$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);

  // currently selected duration.
  public readonly duration$: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(null);

  // derived entity type from entity selected for boosting.
  public entityType$: Observable<BoostSubject> = this.entity$.pipe(
    map(entity => {
      if (entity.type === 'user') {
        return 'channel';
      }

      return 'post';
    })
  );

  // total payment amount to be charged.
  public readonly totalPaymentAmount$: Observable<number> = combineLatest([
    this.duration$,
    this.dailyBudget$,
  ]).pipe(
    map(([duration, dailyBudget]: [number, number]) => {
      return duration * dailyBudget;
    })
  );

  // total payment amount as text, e.g. $10 or 10 tokens.
  public readonly totalPaymentAmountText$: Observable<string> = combineLatest([
    this.totalPaymentAmount$,
    this.paymentCategory$,
  ]).pipe(
    map(([totalPaymentAmount, paymentCategory]) =>
      paymentCategory === 'cash'
        ? `\$${totalPaymentAmount}.00`
        : `${totalPaymentAmount} tokens`
    )
  );

  // Estimated reach, loaded from server. Replay WILL be shared - to reload change one of the combineLatest parameters
  // whilst there is an active subscriber.
  public estimatedReach$: Observable<EstimatedReach> = combineLatest([
    this.dailyBudget$,
    this.duration$,
    this.paymentCategory$,
  ]).pipe(
    distinctUntilChanged(),
    // TODO: Play with debounceTime when adding API endpoint to make sure it feels responsive but
    // does not over-emit when sliding budget sliders.
    debounceTime(200),
    switchMap(
      ([dailyBudget, duration, paymentCategory]: [
        number,
        number,
        BoostPaymentCategory
      ]): Observable<any> => {
        /**
         * TODO: This is emulating a failing API response - we need to get the actual response
         * from API and shape it in the below commented out map statement. Note you MAY need to catchError
         * in a higher order observable as we do for throwError below, else the erroneous state passed to the
         * catchError at the bottom of this streams outer observable will terminate the stream altogether.
         */
        return throwError('Unable to calculate estimation').pipe(
          catchError(e => this.handleRequestError(e))
        );
      }
    ),
    // map((response: unknown): Observable<EstimatedReach> => {
    //   return response ? of({
    //     lower_bound: 10,
    //     upper_bound: 50
    //   }) : null;
    // }),
    catchError(e => this.handleRequestError(e)),
    shareReplay()
  );

  // subscriptions.
  private submitBoostSubscription: Subscription;
  private paymentCategoryChangeSubscription: Subscription;
  private openPreviousPanelSubscription: Subscription;

  constructor(private config: ConfigsService) {
    // set default duration and budgets on payment category change.
    this.paymentCategoryChangeSubscription = this.paymentCategory$.subscribe(
      paymentCategory => {
        this.duration$.next(
          paymentCategory === 'cash'
            ? DEFAULT_CASH_DURATION
            : DEFAULT_TOKEN_DURATION
        );
        this.dailyBudget$.next(
          paymentCategory === 'cash'
            ? DEFAULT_DAILY_CASH_BUDGET
            : DEFAULT_DAILY_TOKEN_BUDGET
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.paymentCategoryChangeSubscription?.unsubscribe();
    this.submitBoostSubscription?.unsubscribe();
    this.openPreviousPanelSubscription?.unsubscribe();
  }

  /**
   * Gets boost config.
   * @returns { BoostConfig } - boost config.
   */
  public getConfig(): BoostConfig {
    return this.config.get<BoostConfig>('boost');
  }

  /**
   * Change panel from a given panel.
   * @param { BoostModalPanel } fromPanel - panel we're changing from.
   * @returns { void }
   */
  public changePanelFrom(fromPanel: BoostModalPanel): void {
    switch (fromPanel) {
      case 'audience':
        this.switchFromAudiencePanel();
        break;
      case 'budget':
        this.switchFromBudgetPanel();
        break;
      case 'review':
        this.submitBoost();
        break;
    }
  }

  /**
   * Open previous modal panel. If on the audience panel, does nothing.
   * @returns { void }
   */
  public openPreviousPanel(): void {
    this.openPreviousPanelSubscription = this.activePanel$
      .pipe(take(1))
      .subscribe((activePanel: BoostModalPanel) => {
        switch (activePanel) {
          case 'budget':
            this.activePanel$.next('audience');
            break;
          case 'review':
            this.activePanel$.next('budget');
            break;
        }
      });
  }

  /**
   * Switch from audience panel to budget.
   * @returns { void }
   */
  private switchFromAudiencePanel(): void {
    this.activePanel$.next('budget');
  }

  /**
   * Switch from budget panel to review.
   * @returns { void }
   */
  private switchFromBudgetPanel(): void {
    this.activePanel$.next('review');
  }

  /**
   * Submit a boost to the server.
   * @returns { void }
   */
  private submitBoost(): void {
    this.submitBoostSubscription = combineLatest([
      this.paymentMethod$,
      this.paymentMethodId$,
      this.duration$,
      this.dailyBudget$,
      this.audience$,
    ])
      .pipe(take(1))
      .subscribe(
        ([paymentMethod, paymentMethodId, duration, dailyBudget, audience]) => {
          // {{host}}/api/v3/boosts

          // TODO: Implement boost submission behavior.
          console.log('paymentMethod', paymentMethod);
          console.log('paymentMethodId', paymentMethodId);
          console.log('duration', duration);
          console.log('dailyBudget', dailyBudget);
          console.log('audience', audience);

          // alert('submitted');
        }
      );
  }

  /**
   * Handle API errors.
   * @param { any } e - error from API.
   * @returns { Observable<null> } - will emit null.
   */
  private handleRequestError(e: any): Observable<null> {
    console.error(e);
    return of(null);
  }
}
