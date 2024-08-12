import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ExplainerScreenWeb,
  GetExplainerScreensGQL,
  GetExplainerScreensQuery,
} from '../../../../graphql/generated.strapi';
import {
  Observable,
  catchError,
  forkJoin,
  map,
  of,
  shareReplay,
  take,
} from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { ExplainerScreenModalService } from './explainer-screen-lazy-modal.service';
import { DismissalV2Service } from '../../../common/services/dismissal-v2.service';
import { Dismissal } from '../../../../graphql/generated.engine';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { isPlatformServer } from '@angular/common';
import { Session } from '../../../services/session';

/**
 * Service handling the showing and loading of data for explainer screens.
 * Screens that show in a modal upon first navigation to a route.
 */
@Injectable({ providedIn: 'root' })
export class ExplainerScreensService extends AbstractSubscriberComponent {
  constructor(
    private getExplainerScreensGQL: GetExplainerScreensGQL,
    private explainerScreenModal: ExplainerScreenModalService,
    private dismissalV2Service: DismissalV2Service,
    private session: Session,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super();
  }

  /**
   * Get explainer screens from server.
   */
  public getExplainerScreens$: Observable<ExplainerScreenWeb[]> =
    this.getExplainerScreensGQL.fetch().pipe(
      map(
        (
          result: ApolloQueryResult<GetExplainerScreensQuery>
        ): ExplainerScreenWeb[] => {
          return result.data.explainerScreensWeb.data.map(
            (explainerScreen) => explainerScreen.attributes
          ) as ExplainerScreenWeb[];
        }
      ),
      shareReplay(),
      catchError((e: unknown): Observable<ExplainerScreenWeb[]> => {
        console.error(e);
        return of([]);
      })
    );

  /**
   * Trigger routes from server.
   */
  public triggerRoutes$: Observable<string[]> = this.getExplainerScreens$.pipe(
    map((explainerScreens: ExplainerScreenWeb[]) => {
      return explainerScreens.map(
        (explainerScreen: ExplainerScreenWeb) => explainerScreen.triggerRoute
      );
    })
  );

  /**
   * Handles route change.
   * @param { string } route - route that was changed to.
   * @returns { void }
   */
  public handleRouteChange(route: string): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    /**
     * Do not show if logged in and email is not yet confirmed,
     * so that we don't show over the onboarding modal.
     */
    if (
      this.session.isLoggedIn() &&
      !this.session.getLoggedInUser()?.email_confirmed
    ) {
      return;
    }

    this.subscriptions.push(
      this.triggerRoutes$
        .pipe(take(1))
        .subscribe((triggerRoutes: string[]): void => {
          // Find matched route taking into account wildcards.
          const matchedRoute: string = triggerRoutes.filter(
            (triggerRoute: string) => {
              if (triggerRoute) {
                return new RegExp(
                  '^' + triggerRoute.replace('*', '.*') + '$'
                ).test(route);
              }
            }
          )?.[0];

          if (matchedRoute) {
            this.handleMatchingTriggerRoute(matchedRoute);
          }
        })
    );
  }

  /**
   * Handles a matching trigger route, checking whether it has already been dismissed
   * and opening the explainer screen if it has not.
   * @param { string } route - route that was matched.
   * @returns { void }
   */
  private handleMatchingTriggerRoute(route: string): void {
    this.subscriptions.push(
      // get both in parallel.
      forkJoin([
        this.getExplainerScreens$,
        this.dismissalV2Service.getDismissals(),
      ]).subscribe(
        ([explainerScreens, dismissals]: [
          ExplainerScreenWeb[],
          Dismissal[],
        ]): void => {
          // get matching explainer screen for passed route
          const explainerScreen: ExplainerScreenWeb = explainerScreens.filter(
            (explainerScreen: ExplainerScreenWeb) => {
              return explainerScreen.triggerRoute === route;
            }
          )?.[0];

          if (!explainerScreen) {
            console.error(`No explainer screen found for route: ${route}`);
            return;
          }

          // check if explainer screen has already been dismissed.
          if (
            dismissals.some(
              (dismissal: Dismissal): boolean =>
                dismissal.key === explainerScreen.key
            )
          ) {
            return;
          }

          // open explainer screen modal.
          this.explainerScreenModal.open(explainerScreen);
        }
      )
    );
  }

  /**
   * Handles manual triggering of an explainer modal - will trigger a modal for the passed key
   * if a matching explainer screen is found and it has not already been dismissed.
   * @param { string } key - key of explainer screen to trigger.
   * @returns { void }
   */
  public handleManualTriggerByKey(key: string): void {
    this.subscriptions.push(
      // get both in parallel.
      forkJoin([
        this.getExplainerScreens$,
        this.dismissalV2Service.getDismissals(),
      ]).subscribe(
        ([explainerScreens, dismissals]: [
          ExplainerScreenWeb[],
          Dismissal[],
        ]): void => {
          // get matching explainer screen for passed key
          const explainerScreen: ExplainerScreenWeb = explainerScreens.filter(
            (explainerScreen: ExplainerScreenWeb) => {
              return explainerScreen.key === key;
            }
          )?.[0];

          if (!explainerScreen) {
            console.error(`No explainer screen found for key: ${key}`);
            return;
          }

          // check if explainer screen has already been dismissed.
          if (
            dismissals.some(
              (dismissal: Dismissal): boolean =>
                dismissal.key === explainerScreen.key
            )
          ) {
            return;
          }

          // open explainer screen modal.
          this.explainerScreenModal.open(explainerScreen);
        }
      )
    );
  }
}
