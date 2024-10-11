import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  interval,
  Observable,
  Subscription,
} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../../../../../common/api/api.service';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';

/** Bootstrap step progress type. */
type BootstrapStepProgress = {
  tenantId: number;
  stepName: string;
  stepLoadingLabel: string;
  success: boolean;
  lastRunTimestamp: number;
};

/**
 * Service for the checking of Bootstrap progress state.
 */
@Injectable({ providedIn: 'root' })
export class BootstrapProgressSplashService implements OnDestroy {
  /** Polling interval in ms. */
  private readonly pollingIntervalMs: number = 5000;

  /** Max time taht should be polled for in ms. */
  private readonly maxPollingTimeMs: number = 120000;

  /** Redirect URL for network admin panel. */
  private readonly networkAdminRedirectUrl: string =
    '/network/admin/general?awaitContentGeneration=true';

  /** Current progress. */
  private readonly bootstrapStepProgress$: BehaviorSubject<
    BootstrapStepProgress[]
  > = new BehaviorSubject<BootstrapStepProgress[]>([]);

  /** The loading text for the currently in progress step. */
  public readonly currentStepLoadingLabel$: Observable<string> =
    this.bootstrapStepProgress$.pipe(
      map((steps: BootstrapStepProgress[]): string => {
        return (
          steps.find(
            (step: BootstrapStepProgress): boolean =>
              step.lastRunTimestamp === null
          )?.stepLoadingLabel ?? 'Loading...'
        );
      })
    );

  /**
   * Whether the bootstrapping process can be considered completed, and the user can progress.
   * This does not neccesarily indicate that all steps are completed, just that at minimum,
   * the ones that a user is being held here to wait for completion of are.
   */
  public readonly completed$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // subscriptions.
  private pollingProgressSubscription: Subscription;

  constructor(
    private readonly api: ApiService,
    @Inject(WINDOW) private readonly window: Window
  ) {}

  ngOnDestroy() {
    this.pollingProgressSubscription?.unsubscribe();
  }

  /**
   * Start the polling for Bootstrap step progress.
   * @return { void }
   */
  public startPolling(): void {
    // If we are already polling, log to info, but unsubscribe / resubscribe.
    if (this.pollingProgressSubscription) {
      console.info('Reinitialising polling for bootstrapping progress state');
      this.pollingProgressSubscription?.unsubscribe();
    }

    // Time to stop polling and navigate regardless of progress.
    const pollingEndTime = Date.now() + this.maxPollingTimeMs;

    this.pollingProgressSubscription = interval(this.pollingIntervalMs)
      .pipe(
        // switchmap into API request.
        switchMap(
          (): Observable<BootstrapStepProgress[]> =>
            this.api.get<BootstrapStepProgress[]>(
              '/api/v3/tenant-bootstrap/progress'
            )
        ),
        // handle response.
        tap((response: BootstrapStepProgress[]): void => {
          this.bootstrapStepProgress$.next(response ?? []);

          if (Date.now() > pollingEndTime) {
            throw new Error('Exceeded maximum polling time.');
          }

          // we want to navigate while the content step is still in progress.
          const contentStepIndex = response.findIndex(
            (step: BootstrapStepProgress): boolean =>
              step.stepName === 'CONTENT_STEP'
          );
          if (
            contentStepIndex > 0 &&
            Boolean(response[contentStepIndex - 1]?.lastRunTimestamp)
          ) {
            this.onBootstrapFinished();
          }
        }),
        catchError((): Observable<never> => {
          this.onBootstrapError();
          return EMPTY;
        })
      )
      .subscribe();
  }

  /**
   * Stop polling.
   * @returns { void }
   */
  public stopPolling(): void {
    this.pollingProgressSubscription?.unsubscribe();
  }

  /**
   * Redirect away from Bootstrap screen. We do this in such a way that we force
   * a page reload, so that configs, theme and logo are all updates.
   * @returns { void }
   */
  public redirectToNetwork(): void {
    this.window.location.href = this.networkAdminRedirectUrl;
  }

  /**
   * Handle bootstrap finished.
   * @returns { void }
   */
  private onBootstrapFinished(): void {
    this.stopPolling();
    this.completed$.next(true);
  }

  /**
   * Handle bootstrap error. We will still treat this as completed, as we do not
   * want to leave a user stuck here indefinitely.
   */
  private onBootstrapError(): void {
    this.stopPolling();
    this.completed$.next(true);
  }
}
