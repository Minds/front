import { Injectable, OnDestroy } from '@angular/core';
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

/**
 * Service handling the showing and loading of data for explainer screens.
 * Screens that show in a modal upon first navigation to a route.
 */
@Injectable({ providedIn: 'root' })
export class ExplainerScreensService extends AbstractSubscriberComponent {
  constructor(
    private getExplainerScreensGQL: GetExplainerScreensGQL,
    private explainerScreenModal: ExplainerScreenModalService,
    private dismissalV2Service: DismissalV2Service
  ) {
    super();
  }

  /**
   * Get explainer screens from server.
   */
  public getExplainerScreens$: Observable<
    ExplainerScreenWeb[]
  > = this.getExplainerScreensGQL.fetch().pipe(
    map(
      (
        result: ApolloQueryResult<GetExplainerScreensQuery>
      ): ExplainerScreenWeb[] => {
        return result.data.explainerScreensWeb.data.map(
          explainerScreen => explainerScreen.attributes
        ) as ExplainerScreenWeb[];
      }
    ),
    shareReplay(),
    catchError(
      (e: unknown): Observable<ExplainerScreenWeb[]> => {
        console.error(e);
        return of([]);
      }
    )
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
    this.subscriptions.push(
      this.triggerRoutes$
        .pipe(take(1))
        .subscribe((triggerRoutes: string[]): void => {
          // Find matched route taking into account wildcards.
          const matchedRoute: string = triggerRoutes.filter(
            (triggerRoute: string) =>
              new RegExp('^' + triggerRoute.replace('*', '.*') + '$').test(
                route
              )
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
          Dismissal[]
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
}
