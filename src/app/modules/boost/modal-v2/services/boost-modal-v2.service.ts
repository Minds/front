import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subject,
  Subscription,
  throwError,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';
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
  BoostLocation,
  BoostModalPanel,
  BoostPaymentCategory,
  BoostPaymentMethod,
  BoostPaymentMethodId,
  BoostSubject,
  BoostSubmitRequest,
  BoostSubmitResponse,
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
  > = new BehaviorSubject<BoostModalPanel>(BoostModalPanel.AUDIENCE);

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

  // whether boost submission is in progress.
  public readonly boostSubmissionInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  // Emit to call modal save intent.
  public readonly callSaveIntent$: Subject<boolean> = new Subject<boolean>();

  // derived entity type from entity selected for boosting.
  public entityType$: Observable<BoostSubject> = this.entity$.pipe(
    map(entity => {
      return entity?.type === 'user' ? BoostSubject.CHANNEL : BoostSubject.POST;
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
      paymentCategory === BoostPaymentCategory.CASH
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
         * Be sure to unit test.
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

  constructor(
    private api: ApiService,
    private toast: ToasterService,
    private config: ConfigsService
  ) {
    // set default duration and budgets on payment category change.
    this.paymentCategoryChangeSubscription = this.paymentCategory$.subscribe(
      paymentCategory => {
        this.duration$.next(
          paymentCategory === BoostPaymentCategory.CASH
            ? DEFAULT_CASH_DURATION
            : DEFAULT_TOKEN_DURATION
        );
        this.dailyBudget$.next(
          paymentCategory === BoostPaymentCategory.TOKENS
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
      case BoostModalPanel.AUDIENCE:
        this.switchFromAudiencePanel();
        break;
      case BoostModalPanel.BUDGET:
        this.switchFromBudgetPanel();
        break;
      case BoostModalPanel.REVIEW:
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
          case BoostModalPanel.BUDGET:
            this.activePanel$.next(BoostModalPanel.AUDIENCE);
            break;
          case BoostModalPanel.REVIEW:
            this.activePanel$.next(BoostModalPanel.BUDGET);
            break;
        }
      });
  }

  /**
   * Switch from audience panel to budget.
   * @returns { void }
   */
  private switchFromAudiencePanel(): void {
    this.activePanel$.next(BoostModalPanel.BUDGET);
  }

  /**
   * Switch from budget panel to review.
   * @returns { void }
   */
  private switchFromBudgetPanel(): void {
    this.activePanel$.next(BoostModalPanel.REVIEW);
  }

  /**
   * Submit a boost to the server.
   * @returns { void }
   */
  private submitBoost(): void {
    this.submitBoostSubscription = combineLatest([
      this.entity$,
      this.entityType$,
      this.paymentMethod$,
      this.paymentMethodId$,
      this.duration$,
      this.dailyBudget$,
      this.audience$,
    ])
      .pipe(
        take(1),
        tap(_ => this.boostSubmissionInProgress$.next(true)),
        map(
          ([
            entity,
            entityType,
            paymentMethod,
            paymentMethodId,
            duration,
            dailyBudget,
            audience,
          ]: [
            BoostableEntity,
            BoostSubject,
            BoostPaymentMethod,
            BoostPaymentMethodId,
            number,
            number,
            BoostAudience
          ]): BoostSubmitRequest => {
            return {
              entity_guid: entity.guid,
              target_suitability: audience,
              target_location:
                entityType === BoostSubject.CHANNEL
                  ? BoostLocation.SIDEBAR
                  : BoostLocation.NEWSFEED,
              payment_method: paymentMethod,
              payment_method_id: paymentMethodId,
              daily_bid: dailyBudget,
              duration_days: duration,
            };
          }
        ),
        switchMap(
          (
            boostSubmitRequest: BoostSubmitRequest
          ): Observable<BoostSubmitResponse> => {
            return this.api.post<BoostSubmitResponse>(
              'api/v3/boosts',
              boostSubmitRequest
            );
          }
        ),
        tap(_ => {
          this.toast.success('Success! Your boost request is being processed.');
          this.callSaveIntent$.next(true);
        }),
        finalize(() => this.boostSubmissionInProgress$.next(false)),
        catchError((e: any) => this.handleRequestError(e, true))
      )
      .subscribe();
  }

  /**
   * Handle API errors.
   * @param { any } e - error from API.
   * @param { boolean } toast - whether to display error toasts.
   * @returns { Observable<null> } - will emit null.
   */
  private handleRequestError(e: any, toast: boolean = false): Observable<null> {
    if (toast) {
      console.error(e);
      if (e.error?.errors?.length) {
        this.toast.error(e.error.errors[0].message);
      } else {
        this.toast.error(e.error?.message ?? 'An unknown error has occurred');
      }
    }
    console.error(e);
    return of(null);
  }
}
