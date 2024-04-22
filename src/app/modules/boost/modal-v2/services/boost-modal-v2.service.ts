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
import { BoostContractService } from '../../../blockchain/contracts/boost-contract.service';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import {
  DEFAULT_AUDIENCE,
  DEFAULT_BUTTON_TEXT_FOR_CLICKS_GOAL,
  DEFAULT_BUTTON_TEXT_FOR_SUBSCRIBER_GOAL,
  DEFAULT_CASH_DURATION,
  DEFAULT_DAILY_CASH_BUDGET,
  DEFAULT_DAILY_TOKEN_BUDGET,
  DEFAULT_GOAL,
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
  BoostSubmissionPayload,
  BoostSubmitResponse,
  BoostTargetPlatformLabel,
  EstimatedReach,
  PrepareResponse,
} from '../boost-modal-v2.types';
import { BoostGoal, BoostGoalButtonText } from '../../boost.types';
import { Session } from '../../../../services/session';
import { BoostTargetExperimentService } from '../../../experiments/sub-services/boost-target-experiment.service';

/**
 * Service for creation and submission of boosts.
 */
@Injectable()
export class BoostModalV2Service implements OnDestroy {
  // selected entity for boosting.
  public readonly entity$: BehaviorSubject<BoostableEntity> =
    new BehaviorSubject<BoostableEntity>(null);

  // currently active modal panel.
  public readonly activePanel$: BehaviorSubject<BoostModalPanel> =
    new BehaviorSubject<BoostModalPanel>(BoostModalPanel.AUDIENCE);

  // currently selected goal.
  public readonly goal$: BehaviorSubject<BoostGoal> =
    new BehaviorSubject<BoostGoal>(DEFAULT_GOAL);

  // currently selected goal button text.
  public readonly goalButtonText$: BehaviorSubject<BoostGoalButtonText> =
    new BehaviorSubject<BoostGoalButtonText>(null);

  // currently selected goal button url.
  public readonly goalButtonUrl$: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  // currently selected audience.
  public readonly audience$: BehaviorSubject<BoostAudience> =
    new BehaviorSubject<BoostAudience>(DEFAULT_AUDIENCE);

  // current selection for whether to target users on the web
  public readonly targetPlatformWeb$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  // current selection for whether to target android users
  public readonly targetPlatformAndroid$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  // current selection for target iOS users
  public readonly targetPlatformIos$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  // currently selected payment category.
  public readonly paymentCategory$: BehaviorSubject<BoostPaymentCategory> =
    new BehaviorSubject<BoostPaymentCategory>(DEFAULT_PAYMENT_CATEGORY);

  // currently selected payment method.
  public readonly paymentMethod$: BehaviorSubject<BoostPaymentMethod> =
    new BehaviorSubject<BoostPaymentMethod>(null);

  // currently selected payment method id.
  public readonly paymentMethodId$: BehaviorSubject<BoostPaymentMethodId> =
    new BehaviorSubject<BoostPaymentMethodId>(null);

  // currently selected daily budget.
  public readonly dailyBudget$: BehaviorSubject<number> =
    new BehaviorSubject<number>(null);

  // currently selected duration.
  public readonly duration$: BehaviorSubject<number> =
    new BehaviorSubject<number>(null);

  // disable safe boost audience.
  public readonly disabledSafeAudience$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // whether boost submission is in progress.
  public readonly boostSubmissionInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // Emit to call modal save intent.
  public readonly callSaveIntent$: Subject<boolean> = new Subject<boolean>();

  // derived entity type from entity selected for boosting.
  public entityType$: Observable<BoostSubject> = this.entity$.pipe(
    map((entity) => {
      switch (entity?.type) {
        case 'user':
          return BoostSubject.CHANNEL;
        case 'group':
          return BoostSubject.GROUP;
        default:
          return BoostSubject.POST;
      }
    })
  );

  // A comma-separated list of the selected target platforms (web/android/iOS)
  // (or 'None', if nothing is selected)
  public readonly targetPlatformSummaryText$: Observable<string> =
    combineLatest([
      this.targetPlatformWeb$,
      this.targetPlatformAndroid$,
      this.targetPlatformIos$,
    ]).pipe(
      map(([web, android, ios]: [boolean, boolean, boolean]) => {
        let text,
          platforms: BoostTargetPlatformLabel[] = [];

        if (web) {
          platforms.push('Web');
        }
        if (android) {
          platforms.push('Android');
        }
        if (ios) {
          platforms.push('iOS');
        }
        if (platforms.length > 0) {
          text = platforms.join(', ');
        } else {
          text = 'None';
        }

        return text;
      })
    );

  /**
   * Whether any of the default target platform values have changed
   * (e.g. web/android/iOS, all enabled by default)
   *
   * This determines whether we display platform info in the review panel
   */
  public readonly targetPlatformChanged$: Observable<boolean> = combineLatest([
    this.targetPlatformWeb$,
    this.targetPlatformAndroid$,
    this.targetPlatformIos$,
  ]).pipe(
    map(([web, android, ios]: [boolean, boolean, boolean]) => {
      return !web || !android || !ios;
    })
  );

  // Whether or not the selected goal comes with a custom CTA button
  public readonly goalRequiresButton$: Observable<boolean> = this.goal$.pipe(
    map((goal) => {
      return goal === BoostGoal.SUBSCRIBERS || goal === BoostGoal.CLICKS;
    })
  );

  // Whether a Boost goal can be set
  public canSetBoostGoal$: Observable<boolean> = combineLatest([
    this.entity$,
    this.entityType$,
  ]).pipe(
    map(([entity, entityType]: [BoostableEntity, BoostSubject]) => {
      return (
        entityType === BoostSubject.POST &&
        entity?.owner_guid === this.session.getLoggedInUser().guid
      );
    })
  );

  // first panel that should be shown, depending on entityType and goal experiment
  public readonly firstPanel$: Observable<BoostModalPanel> =
    this.canSetBoostGoal$.pipe(
      map((canSetBoostGoal: boolean) => {
        if (canSetBoostGoal) {
          return BoostModalPanel.GOAL;
        } else {
          return BoostModalPanel.AUDIENCE;
        }
      })
    );

  // Whether the NEXT button should be disabled.
  public readonly disableSubmitButton$: Observable<boolean> = combineLatest([
    this.activePanel$,
    this.goal$,
    this.goalButtonUrl$,
    this.targetPlatformWeb$,
    this.targetPlatformAndroid$,
    this.targetPlatformIos$,
    this.boostSubmissionInProgress$,
  ]).pipe(
    map(
      ([
        activePanel,
        goal,
        goalButtonUrl,
        targetPlatformWeb,
        targetPlatformAndroid,
        targetPlatformIos,
        submissionInProgress,
      ]: [
        BoostModalPanel,
        BoostGoal,
        string,
        boolean,
        boolean,
        boolean,
        boolean,
      ]) => {
        let panelRequirementsAreMet = true;

        switch (activePanel) {
          case BoostModalPanel.GOAL_BUTTON:
            if (goal === BoostGoal.CLICKS) {
              // Still need button URL
              panelRequirementsAreMet = !!goalButtonUrl;
            }
            break;
          case BoostModalPanel.AUDIENCE:
            if (this.boostTargetExperiment.isActive()) {
              // Still need a target platform
              panelRequirementsAreMet =
                targetPlatformWeb || targetPlatformAndroid || targetPlatformIos;
            }
            break;
        }

        return !panelRequirementsAreMet || submissionInProgress;
      }
    )
  );

  /**
   * The panel you would go to if you clicked 'back' on the activePanel
   */
  public readonly previousPanel$: Observable<BoostModalPanel> = combineLatest([
    this.activePanel$,
    this.firstPanel$,
    this.goalRequiresButton$,
  ]).pipe(
    map(
      ([activePanel, firstPanel, goalRequiresButton]: [
        BoostModalPanel,
        BoostModalPanel,
        boolean,
      ]) => {
        switch (activePanel) {
          case BoostModalPanel.GOAL:
            return null;
          case BoostModalPanel.GOAL_BUTTON:
            return BoostModalPanel.GOAL;
          case BoostModalPanel.AUDIENCE:
            if (firstPanel === BoostModalPanel.AUDIENCE) {
              return null;
            } else if (goalRequiresButton) {
              return BoostModalPanel.GOAL_BUTTON;
            } else {
              return BoostModalPanel.GOAL;
            }
          case BoostModalPanel.BUDGET:
            return BoostModalPanel.AUDIENCE;
          case BoostModalPanel.REVIEW:
            return BoostModalPanel.BUDGET;
        }
      }
    )
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
    this.audience$,
  ]).pipe(
    distinctUntilChanged(),
    // TODO: Play with debounceTime when adding API endpoint to make sure it feels responsive but
    // does not over-emit when sliding budget sliders.
    debounceTime(200),
    switchMap(
      ([dailyBudget, duration, paymentCategory, audience]: [
        number,
        number,
        BoostPaymentCategory,
        BoostAudience,
      ]): Observable<any> => {
        return this.api.get('api/v3/boosts/insights/estimate', {
          daily_bid: dailyBudget,
          duration: duration,
          payment_method: paymentCategory,
          audience: audience,
        });
      }
    ),
    catchError((e) => this.handleRequestError(e)),
    shareReplay()
  );

  // payload for boost submission. Has available snapshot.
  private readonly boostSubmissionPayload$: Observable<BoostSubmissionPayload> =
    combineLatest([
      this.entity$,
      this.entityType$,
      this.paymentMethod$,
      this.paymentMethodId$,
      this.duration$,
      this.dailyBudget$,
      this.audience$,
      this.targetPlatformWeb$,
      this.targetPlatformAndroid$,
      this.targetPlatformIos$,
      this.goal$,
      this.goalButtonText$,
      this.goalButtonUrl$,
      this.canSetBoostGoal$,
    ]).pipe(
      map(
        ([
          entity,
          entityType,
          paymentMethod,
          paymentMethodId,
          duration,
          dailyBudget,
          audience,
          targetPlatformWeb,
          targetPlatformAndroid,
          targetPlatformIos,
          goal,
          goalButtonText,
          goalButtonUrl,
          canSetBoostGoal,
        ]: [
          BoostableEntity,
          BoostSubject,
          BoostPaymentMethod,
          BoostPaymentMethodId,
          number,
          number,
          BoostAudience,
          boolean,
          boolean,
          boolean,
          BoostGoal,
          BoostGoalButtonText,
          string,
          boolean,
        ]): BoostSubmissionPayload => {
          let payload: BoostSubmissionPayload = {
            entity_guid: entity?.guid,
            target_suitability: audience,
            target_location: [
              BoostSubject.CHANNEL,
              BoostSubject.GROUP,
            ].includes(entityType)
              ? BoostLocation.SIDEBAR
              : BoostLocation.NEWSFEED,
            payment_method: Number(paymentMethod),
            payment_method_id: paymentMethodId,
            daily_bid: dailyBudget,
            duration_days: duration,
          };

          if (this.boostTargetExperiment.isActive()) {
            payload = {
              ...payload,
              target_platform_web: targetPlatformWeb,
              target_platform_android: targetPlatformAndroid,
              target_platform_ios: targetPlatformIos,
            };
          }

          if (canSetBoostGoal) {
            payload = {
              ...payload,
              goal: goal,
              goal_button_text: goalButtonText,
              goal_button_url: goalButtonUrl,
            };
          }

          return payload;
        }
      )
    );

  // snapshot of boost payload for boost submission.
  private boostSubmissionPayloadSnapshot: BoostSubmissionPayload;

  // subscriptions.
  private submitBoostSubscription: Subscription;
  private submitBoostOnchainSubscription: Subscription;
  private paymentCategoryChangeSubscription: Subscription;
  private boostSubmissionPayloadSnapshotSubscription: Subscription;
  private goalSubscription: Subscription;
  private previousPanelSubscription: Subscription;
  private goalRequiresButtonSubscription: Subscription;

  constructor(
    private api: ApiService,
    private session: Session,
    private toast: ToasterService,
    private config: ConfigsService,
    private web3Wallet: Web3WalletService,
    private boostContract: BoostContractService,
    private boostTargetExperiment: BoostTargetExperimentService
  ) {
    // set default duration and budgets on payment category change.
    this.paymentCategoryChangeSubscription = this.paymentCategory$.subscribe(
      (paymentCategory) => {
        this.duration$.next(
          paymentCategory === BoostPaymentCategory.CASH
            ? DEFAULT_CASH_DURATION
            : DEFAULT_TOKEN_DURATION
        );
        this.dailyBudget$.next(
          paymentCategory === BoostPaymentCategory.TOKENS
            ? DEFAULT_DAILY_TOKEN_BUDGET
            : DEFAULT_DAILY_CASH_BUDGET
        );
      }
    );

    // When the goal changes, set defaults for goal-related fields
    this.goalSubscription = this.goal$.subscribe((goal) => {
      switch (goal) {
        case BoostGoal.SUBSCRIBERS:
          this.goalButtonText$.next(DEFAULT_BUTTON_TEXT_FOR_SUBSCRIBER_GOAL);
          this.goalButtonUrl$.next(null);

          break;
        case BoostGoal.CLICKS:
          this.goalButtonText$.next(DEFAULT_BUTTON_TEXT_FOR_CLICKS_GOAL);
          break;
        case BoostGoal.ENGAGEMENT:
        case BoostGoal.VIEWS:
          this.goalButtonText$.next(null);
          this.goalButtonUrl$.next(null);
          break;
      }
    });

    // store a snapshot of payload for subscriptionless reference.
    this.boostSubmissionPayloadSnapshotSubscription =
      this.boostSubmissionPayload$.subscribe(
        (boostSubmissionPayload: BoostSubmissionPayload) =>
          (this.boostSubmissionPayloadSnapshot = boostSubmissionPayload)
      );
  }

  ngOnDestroy(): void {
    this.paymentCategoryChangeSubscription?.unsubscribe();
    this.submitBoostSubscription?.unsubscribe();
    this.submitBoostOnchainSubscription?.unsubscribe();
    this.boostSubmissionPayloadSnapshotSubscription?.unsubscribe();
    this.goalSubscription?.unsubscribe();
    this.previousPanelSubscription?.unsubscribe();
    this.goalRequiresButtonSubscription?.unsubscribe();
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
      case BoostModalPanel.GOAL:
        this.switchFromGoalPanel();
        break;
      case BoostModalPanel.GOAL_BUTTON:
        this.switchFromGoalButtonPanel();
        break;
      case BoostModalPanel.AUDIENCE:
        this.switchFromAudiencePanel();
        break;
      case BoostModalPanel.BUDGET:
        this.switchFromBudgetPanel();
        break;
      case BoostModalPanel.REVIEW:
        if (
          Number(this.paymentMethod$.getValue()) ===
          BoostPaymentMethod.ONCHAIN_TOKENS
        ) {
          this.submitOnchainBoost();
          break;
        }
        this.submitBoost();
        break;
    }
  }

  /**
   * Open previous modal panel. If on the first panel, does nothing.
   * @returns { void }
   */
  public openPreviousPanel(): void {
    this.previousPanelSubscription = this.previousPanel$
      .pipe(take(1))
      .subscribe((previousPanel: BoostModalPanel) => {
        if (previousPanel) {
          this.activePanel$.next(previousPanel);
        }
      });
  }

  /**
   * Switch from goal panel to goal button.
   * @returns { void }
   */
  private switchFromGoalPanel(): void {
    this.goalRequiresButtonSubscription = this.goalRequiresButton$
      .pipe(take(1))
      .subscribe((goalRequiresButton) => {
        this.activePanel$.next(
          goalRequiresButton
            ? BoostModalPanel.GOAL_BUTTON
            : BoostModalPanel.AUDIENCE
        );
      });
  }

  /**
   * Switch from goal button panel to audience.
   * @returns { void }
   */
  private switchFromGoalButtonPanel(): void {
    this.activePanel$.next(BoostModalPanel.AUDIENCE);
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
    this.submitBoostSubscription = this.boostSubmissionPayload$
      .pipe(
        take(1),
        tap((_) => this.boostSubmissionInProgress$.next(true)),
        switchMap(
          (
            boostSubmissionPayload: BoostSubmissionPayload
          ): Observable<BoostSubmitResponse> => {
            return this.api.post<BoostSubmitResponse>(
              'api/v3/boosts',
              boostSubmissionPayload
            );
          }
        ),
        tap((_) => {
          this.toast.success('Success! Your boost request is being processed.');
          this.callSaveIntent$.next(true);
        }),
        finalize(() => this.boostSubmissionInProgress$.next(false)),
        catchError((e: any) => this.handleRequestError(e, true))
      )
      .subscribe();
  }

  /**
   * Submit an onchain boost. Will prompt for transaction via client wallet (e.g. Metamask).
   * @returns { Promise<void> }
   */
  private async submitOnchainBoost(): Promise<void> {
    const boostSubmissionPayload: BoostSubmissionPayload =
      this.boostSubmissionPayloadSnapshot;
    this.boostSubmissionInProgress$.next(true);

    try {
      const prepareResponse: PrepareResponse = await this.api
        .post<PrepareResponse>(
          `api/v3/boosts/prepare-onchain/${boostSubmissionPayload.entity_guid}`
        )
        .toPromise();

      const txId = await this.createOnchainBoostTransaction(
        prepareResponse.guid,
        boostSubmissionPayload.daily_bid * boostSubmissionPayload.duration_days,
        prepareResponse.checksum
      );

      await this.api
        .post<BoostSubmitResponse>('api/v3/boosts', {
          ...boostSubmissionPayload,
          guid: prepareResponse.guid,
          payment_tx_id: txId,
        })
        .toPromise();

      this.toast.success('Success! Your boost request is being processed.');
      this.callSaveIntent$.next(true);
    } catch (e) {
      console.error(e);
      if (e.error?.errors?.length) {
        this.toast.error(e.error.errors[0].message);
      } else {
        this.toast.error(
          e.error?.message ?? e.message ?? 'An unknown error has occurred'
        );
      }
    } finally {
      this.boostSubmissionInProgress$.next(false);
    }
  }

  /**
   * Create an onchain boost transaction.
   * @param { string } boostGuid - guid to use for boost.
   * @param { string } currencyAmount - amount in tokens.
   * @param { string } checksum - checksum of post from prepare endpoint.
   * @throws { Error } on error.
   * @returns { Promise<string> } - transaction id.
   */
  private async createOnchainBoostTransaction(
    boostGuid: string,
    currencyAmount: number,
    checksum: string
  ): Promise<string> {
    if (!this.web3Wallet.checkDeviceIsSupported()) {
      throw new Error('Currently not supported on this device.');
    }

    if (this.web3Wallet.isUnavailable()) {
      throw new Error('No Ethereum wallets available on your browser.');
    }

    if (!(await this.web3Wallet.unlock())) {
      throw new Error(
        'Your Ethereum wallet is locked or connected to another network.'
      );
    }

    return this.boostContract.create(boostGuid, currencyAmount, checksum);
  }

  /**
   * Handle API errors.
   * @param { any } e - error from API.
   * @param { boolean } toast - whether to display error toasts.
   * @returns { Observable<null> } - will emit null.
   */
  private handleRequestError(e: any, toast: boolean = false): Observable<null> {
    if (toast) {
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
