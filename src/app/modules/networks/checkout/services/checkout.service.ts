import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  switchMap,
  take,
} from 'rxjs';
import {
  AddOn,
  CheckoutPage,
  CheckoutPageKeyEnum,
  CheckoutTimePeriodEnum,
  GetCheckoutLinkGQL,
  GetCheckoutPageGQL,
  GetCheckoutPageQuery,
  GetCheckoutPageQueryVariables,
  Plan,
  Summary,
} from '../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ApolloQueryResult } from '@apollo/client';
import { QueryRef } from 'apollo-angular';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

/**
 * Service for networks checkout flow.
 */
@Injectable()
export class NetworksCheckoutService implements OnDestroy {
  /** Whether a summary change is in progress. */
  public readonly summaryChangeInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether navigation to payment URL is in progress. */
  public readonly navToPaymentUrlInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether data is loaded. */
  public readonly loaded$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /** Currently active page. */
  public readonly activePage$: BehaviorSubject<
    CheckoutPageKeyEnum
  > = new BehaviorSubject<CheckoutPageKeyEnum>(CheckoutPageKeyEnum.Addons);

  /** Checkout page data. */
  private readonly checkoutPage$: BehaviorSubject<
    CheckoutPage
  > = new BehaviorSubject<CheckoutPage>(null);

  /** AddOns for display. */
  public readonly addOns$: Observable<AddOn[]> = this.checkoutPage$.pipe(
    distinctUntilChanged(),
    map((checkoutPage: CheckoutPage): AddOn[] => checkoutPage?.addOns ?? [])
  );

  /** Page title. */
  public readonly pageTitle$: Observable<string> = this.checkoutPage$.pipe(
    distinctUntilChanged(),
    map((checkoutPage: CheckoutPage): string => checkoutPage?.title ?? '')
  );

  /** Page description. */
  public readonly pageDescription$: Observable<
    string
  > = this.checkoutPage$.pipe(
    distinctUntilChanged(),
    map((checkoutPage: CheckoutPage): string => checkoutPage?.description ?? '')
  );

  /** Selected plan. */
  public readonly plan$: Observable<Plan> = this.checkoutPage$.pipe(
    distinctUntilChanged(),
    map((checkoutPage: CheckoutPage): Plan => checkoutPage?.plan ?? null)
  );

  /** Summary data. */
  public readonly summary$: Observable<Summary> = this.checkoutPage$.pipe(
    distinctUntilChanged(),
    map((checkoutPage: CheckoutPage): Summary => checkoutPage?.summary ?? null)
  );

  /** Selected time period. */
  public readonly selectedTimePeriod$: Observable<
    CheckoutTimePeriodEnum
  > = this.checkoutPage$.pipe(
    distinctUntilChanged(),
    map(
      (checkoutPage: CheckoutPage): CheckoutTimePeriodEnum =>
        checkoutPage?.timePeriod ?? null
    )
  );

  /** Total annual savings in cents. */
  public readonly totalAnnualSavingsCents$: Observable<
    number
  > = this.checkoutPage$.pipe(
    distinctUntilChanged(),
    map(
      (checkoutPage: CheckoutPage): number =>
        checkoutPage?.totalAnnualSavingsCents ?? null
    )
  );

  /** Terms markdown. */
  public readonly termsMarkdown$: Observable<string> = this.checkoutPage$.pipe(
    distinctUntilChanged(),
    map(
      (checkoutPage: CheckoutPage): string =>
        checkoutPage?.termsMarkdown ?? null
    )
  );

  /** QueryRef for checkout page query. */
  private getCheckoutPageQuery: QueryRef<GetCheckoutPageQuery>;

  /** Array of subscriptions. */
  private subscriptions: Subscription[] = [];

  constructor(
    private getCheckoutPageGQL: GetCheckoutPageGQL,
    private getCheckoutLinkGQL: GetCheckoutLinkGQL,
    private toasterService: ToasterService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe());
    this.getCheckoutPageQuery = null;
    this.loaded$.next(false);
  }

  /**
   * Init the networks checkout service, loading data from server.
   * @param { GetCheckoutPageQueryVariables } variables - variables to load data with.
   * @returns { void }
   */
  public init(variables: GetCheckoutPageQueryVariables): void {
    if (this.getCheckoutPageQuery) {
      console.warn(
        'Multiple calls were made to init the networks checkout service'
      );
      return;
    }

    this.getCheckoutPageQuery = this.getCheckoutPageGQL.watch(variables, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
    });

    this.subscriptions.push(
      this.getCheckoutPageQuery.valueChanges.subscribe(
        (result: ApolloQueryResult<GetCheckoutPageQuery>): void => {
          if (result.loading) return;

          if (result.errors?.length) {
            for (let error of result.errors) {
              this.toasterService.error(error.message);
              console.error(error);
            }
            this.router.navigateByUrl('/about/networks');
            return;
          }

          const checkoutPage: CheckoutPage = result?.data
            ?.checkoutPage as CheckoutPage;

          if (checkoutPage) {
            this.checkoutPage$.next(checkoutPage);
            this.activePage$.next(checkoutPage.id as CheckoutPageKeyEnum);
          }

          if (!this.loaded$.getValue()) {
            this.loaded$.next(true);
          }

          if (this.summaryChangeInProgress$.getValue()) {
            this.summaryChangeInProgress$.next(false);
          }
        }
      )
    );
  }

  /**
   * Select a time period - refetch from server for summary update.
   * @returns { void }
   */
  public selectTimePeriod(timePeriod: CheckoutTimePeriodEnum): void {
    this.summaryChangeInProgress$.next(true);

    this.getCheckoutPageQuery.refetch({
      timePeriod: timePeriod,
    });
  }

  /**
   * Add an AddOn by key - refetch from the server for summary update.
   * @param { string } addOnKey - AddOn key to add.
   * @returns { void }
   */
  public addAddOn(addOnKey: string): void {
    this.summaryChangeInProgress$.next(true);

    this.subscriptions.push(
      this.addOns$.pipe(take(1)).subscribe((addOns: AddOn[]): void => {
        const currentAddonKeys: string[] = this.getCurrentAddOnKeysFromAddons(
          addOns
        );

        if (currentAddonKeys.includes(addOnKey)) {
          console.warn(`AddOn with key ${addOnKey} is alread added`);
          this.summaryChangeInProgress$.next(false);
          return;
        }

        this.getCheckoutPageQuery.refetch({
          addOnIds: [...currentAddonKeys, addOnKey],
        });
      })
    );
  }

  /**
   * Remove an AddOn by key - refetch from the server for summary update.
   * @param { string } addOnKey - AddOn key to remove.
   * @returns { void }
   */
  public removeAddOn(addOnKey: string): void {
    this.summaryChangeInProgress$.next(true);

    this.subscriptions.push(
      this.addOns$.pipe(take(1)).subscribe((addOns: AddOn[]): void => {
        const currentAddonKeys: string[] = this.getCurrentAddOnKeysFromAddons(
          addOns
        );

        if (!currentAddonKeys.includes(addOnKey)) {
          console.warn(
            `Tried to remove addon: ${addOnKey} that is not in the basket`
          );
          this.summaryChangeInProgress$.next(false);
          return;
        }

        this.getCheckoutPageQuery.refetch({
          addOnIds: currentAddonKeys.filter(
            (currentAddOnKey: string): boolean => currentAddOnKey !== addOnKey
          ),
        });
      })
    );
  }

  /**
   * Checkout - call server to check-out. Will navigate to Stripe.
   * @returns { void }
   */
  public navigateToPaymentUrl(): void {
    this.navToPaymentUrlInProgress$.next(true);

    this.subscriptions.push(
      combineLatest([this.summary$, this.selectedTimePeriod$])
        .pipe(
          take(1),
          switchMap(
            ([summary, selectedTimePeriod]: [
              Summary,
              CheckoutTimePeriodEnum
            ]) => {
              return this.getCheckoutLinkGQL.fetch(
                {
                  planId: summary.planSummary.id,
                  addOnIds: summary.addonsSummary.map(
                    (addOn: AddOn): string => addOn.id
                  ),
                  timePeriod: selectedTimePeriod,
                },
                { fetchPolicy: 'no-cache', errorPolicy: 'all' }
              );
            }
          )
        )
        .subscribe(
          (result: ApolloQueryResult<{ checkoutLink: string }>): void => {
            if (result.loading) return;

            if (result.errors?.length) {
              for (let error of result.errors) {
                this.toasterService.error(error.message);
                console.error(error);
              }
              this.navToPaymentUrlInProgress$.next(false);
              return;
            }

            const checkoutUrl: string = result.data?.checkoutLink;
            if (!checkoutUrl) {
              this.toasterService.error(
                'An unknown error has occurred retrieving the checkout URL.'
              );
              this.navToPaymentUrlInProgress$.next(false);
              return;
            }

            this.document.defaultView.location.replace(checkoutUrl);
          }
        )
    );
  }

  /**
   * Get currently in-basket add-on keys from add-ons.
   * @returns { string[] } - Array of add-on keys.
   */
  private getCurrentAddOnKeysFromAddons(addOns: AddOn[]): string[] {
    return addOns
      .filter((addOn: AddOn): boolean => addOn.inBasket)
      .map((addOn: AddOn): string => addOn.id);
  }
}
