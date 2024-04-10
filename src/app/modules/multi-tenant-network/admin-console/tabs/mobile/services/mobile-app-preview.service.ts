import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  finalize,
  of,
  take,
} from 'rxjs';
import {
  GetMobileConfigGQL,
  GetMobileConfigPreviewStateGQL,
  GetMobileConfigPreviewStateQuery,
  GetMobileConfigQuery,
  MobilePreviewStatusEnum,
  MobileSplashScreenTypeEnum,
  MobileWelcomeScreenLogoTypeEnum,
  SetMobileConfigGQL,
  SetMobileConfigMutation,
  SetMobileConfigMutationVariables,
} from '../../../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { ApolloQueryResult } from '@apollo/client';

/**
 * Mobile app preview config service. Allows configuration of mobile app builds.
 */
@Injectable({ providedIn: 'root' })
export class MobileAppPreviewService implements OnDestroy {
  /** Splash screen type. */
  public readonly splashScreenType$: BehaviorSubject<MobileSplashScreenTypeEnum> =
    new BehaviorSubject<MobileSplashScreenTypeEnum>(null);

  /** Welcome screen type. */
  public readonly welcomeScreenLogoType$: BehaviorSubject<MobileWelcomeScreenLogoTypeEnum> =
    new BehaviorSubject<MobileWelcomeScreenLogoTypeEnum>(null);

  /** Status of the build preview. */
  public readonly previewStatus$: BehaviorSubject<MobilePreviewStatusEnum> =
    new BehaviorSubject<MobilePreviewStatusEnum>(null);

  /** QR code for a built preview app. */
  public readonly previewQRCode$: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);

  /** Whether init is in progress. */
  public readonly initInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Whether set mobile config request is in progress. */
  public readonly setMobileConfigInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // subscriptions.
  private subscriptions: Subscription[] = [];
  private pollingPreviewStateSubscription: Subscription;

  constructor(
    private getMobileConfigGql: GetMobileConfigGQL,
    private getMobilePreviewStateGql: GetMobileConfigPreviewStateGQL,
    private setMobileConfigGql: SetMobileConfigGQL,
    private toaster: ToasterService
  ) {}

  ngOnDestroy(): void {
    this.pollingPreviewStateSubscription?.unsubscribe();
    this.subscriptions.forEach((subscription: Subscription): void =>
      subscription?.unsubscribe()
    );
  }

  /**
   * Init service, fetches mobile app build config.
   */
  public init(): void {
    this.initInProgress$.next(true);
    this.fetch(true);
  }

  /**
   * Set mobile config.
   * @param { Partial<SetMobileConfigMutationVariables> } mobileConfig - mobile app build config.
   * @param { string } sucessToastMessage - toast message to show on success.
   * @returns { void }
   */
  public setMobileConfig(
    mobileConfig: Partial<SetMobileConfigMutationVariables>,
    sucessToastMessage: string = 'Updated successfully'
  ): void {
    this.setMobileConfigInProgress$.next(true);

    this.subscriptions.push(
      this.setMobileConfigGql
        .mutate(mobileConfig)
        .pipe(
          take(1),
          catchError((e: any): Observable<null> => this.handleError(e)),
          finalize((): void => {
            this.setMobileConfigInProgress$.next(false);
          })
        )
        .subscribe(
          (response: ApolloQueryResult<SetMobileConfigMutation>): void => {
            if (!response) return;
            this.toaster.success(sucessToastMessage);

            if (mobileConfig.mobileSplashScreenType) {
              this.splashScreenType$.next(mobileConfig.mobileSplashScreenType);
            }

            if (mobileConfig.mobileWelcomeScreenLogoType) {
              this.welcomeScreenLogoType$.next(
                mobileConfig.mobileWelcomeScreenLogoType
              );
            }

            if (mobileConfig.mobilePreviewStatus) {
              this.previewStatus$.next(mobileConfig.mobilePreviewStatus);
            }
          }
        )
    );
  }

  /**
   * Build preview app.
   * @returns { void }
   */
  public buildPreview(): void {
    this.setMobileConfig(
      {
        mobilePreviewStatus: MobilePreviewStatusEnum.Pending,
        mobileWelcomeScreenLogoType: this.welcomeScreenLogoType$.getValue(),
        mobileSplashScreenType: this.splashScreenType$.getValue(),
      },
      'Your preview is being built'
    );
  }

  /**
   * Fetch mobile app build config.
   * @param { boolean } setupPreviewStatePolling - whether to setup polling for preview state.
   */
  private fetch(setupPreviewStatePolling: boolean = false): void {
    this.subscriptions.push(
      this.getMobileConfigGql
        .fetch()
        .pipe(
          take(1),
          catchError((e: any): Observable<null> => this.handleError(e))
        )
        .subscribe(
          (response: ApolloQueryResult<GetMobileConfigQuery>): void => {
            if (!response) return;
            this.splashScreenType$.next(
              response.data?.mobileConfig?.splashScreenType
            );
            this.welcomeScreenLogoType$.next(
              response.data?.mobileConfig?.welcomeScreenLogoType
            );
            this.previewStatus$.next(
              response.data?.mobileConfig?.previewStatus
            );
            this.previewQRCode$.next(
              response.data?.mobileConfig?.previewQRCode
            );

            if (
              setupPreviewStatePolling &&
              !this.pollingPreviewStateSubscription
            ) {
              this.pollPreviewState();
            }

            if (this.initInProgress$.getValue()) {
              this.initInProgress$.next(false);
            }
          }
        )
    );
  }

  /**
   * Setup polling for changes to preview state.
   * @returns { void }
   */
  private pollPreviewState(): void {
    this.pollingPreviewStateSubscription = this.getMobilePreviewStateGql
      .watch(null, {
        pollInterval: 30000,
      })
      .valueChanges.pipe(
        catchError((e: any): Observable<null> => this.handleError(e))
      )
      .subscribe(
        (
          response: ApolloQueryResult<GetMobileConfigPreviewStateQuery>
        ): void => {
          if (!response) return;

          const previewStatus: MobilePreviewStatusEnum =
            response.data?.mobileConfig?.previewStatus;
          const previewQRCode: string =
            response.data?.mobileConfig?.previewQRCode;

          if (previewStatus) {
            this.previewStatus$.next(previewStatus);
          }

          if (previewQRCode) {
            this.previewQRCode$.next(previewQRCode);
          }
        }
      );
  }

  /**
   * Handler for RXJS request errors.
   * @param { any } e - error object.
   * @returns { Observable<null> }
   */
  private handleError(e: any): Observable<null> {
    console.error(e);
    this.toaster.error(e?.error?.message ?? 'An unknown error has occurred.');
    return of(null);
  }
}
