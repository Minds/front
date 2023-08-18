import { Inject, Injectable, OnInit } from '@angular/core';
import {
  ValuePropCard,
  GetValuePropCardsGQL,
  GetValuePropCardsQuery,
} from '../../../../graphql/generated.strapi';
import {
  Observable,
  Subscription,
  catchError,
  map,
  of,
  shareReplay,
} from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { PresentableValuePropCard } from '../value-prop.types';

/**
 * Service handling the showing and loading of data for value propositions.
 * Cards are inserted into the guest mode feed
 */
@Injectable({ providedIn: 'root' })
export class ValuePropService implements OnInit {
  private subscriptions: Subscription[] = [];

  constructor(
    private getValuePropCardsGQL: GetValuePropCardsGQL,
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(this.getRawValuePropCards$.subscribe());
  }
  /**
   * Get raw value prop cards from server.
   */
  public getRawValuePropCards$: Observable<
    ValuePropCard[]
  > = this.getValuePropCardsGQL.fetch().pipe(
    map(
      (result: ApolloQueryResult<GetValuePropCardsQuery>): ValuePropCard[] => {
        return result.data.valuePropCards.data.map(
          rawCard => rawCard.attributes
        ) as ValuePropCard[];
      }
    ),
    shareReplay(),
    catchError(
      (e: unknown): Observable<ValuePropCard[]> => {
        console.error(e);
        return of([]);
      }
    )
  );

  public valuePropCards$: Observable<
    PresentableValuePropCard[]
  > = this.getRawValuePropCards$.pipe(
    map((rawCards: ValuePropCard[]): PresentableValuePropCard[] => {
      return rawCards.map(rawCard =>
        this.getPresentableCard(rawCard)
      ) as PresentableValuePropCard[];
    }),
    shareReplay(),
    catchError(
      (e: unknown): Observable<PresentableValuePropCard[]> => {
        console.error(e);
        return of([]);
      }
    )
  );

  private getPresentableCard(rawCard: ValuePropCard): PresentableValuePropCard {
    return {
      title: rawCard.title,
      imageUrl: this.getImageUrl(rawCard),
      altText: this.getAltText(rawCard),
    };
  }

  private getImageUrl(rawCard: ValuePropCard): string {
    const media = rawCard?.media?.data?.attributes;
    if (!media?.mime.includes('image')) {
      return null;
    }

    return this.strapiUrl + media?.url;
  }

  private getAltText(rawCard: ValuePropCard): string {
    return rawCard?.media?.data?.attributes?.alternativeText ?? rawCard?.title;
  }

  // public readonly valuePropCards$: Observable<
  //   PresentableValuePropCard[]
  // > = this.getValuePropCards$.pipe(
  //   distinctUntilChanged(),
  //   map((rawValuePropCards: ValuePropCard[]) => {
  //     if (!rawValuePropCards.length) {
  //       return [];
  //     }
  //     return stepData?.data?.carousel.map(
  //       (carouselItem: ComponentOnboardingV5CarouselItem): CarouselItem => {
  //         return {
  //           title: carouselItem.title,
  //           media: {
  //             fullUrl:
  //               this.strapiUrl + carouselItem?.media?.data?.attributes?.url,
  //             altText:
  //               carouselItem?.media?.data?.attributes?.alternativeText ??
  //               'Onboarding carousel image',
  //           },
  //         };
  //       }
  //     );
  //   })
  // );

  //   /**
  //    * Trigger routes from server.
  //    */
  //   public triggerRoutes$: Observable<string[]> = this.getExplainerScreens$.pipe(
  //     map((explainerScreens: ExplainerScreenWeb[]) => {
  //       return explainerScreens.map(
  //         (explainerScreen: ExplainerScreenWeb) => explainerScreen.triggerRoute
  //       );
  //     })
  //   );

  //   /**
  //    * Handles route change.
  //    * @param { string } route - route that was changed to.
  //    * @returns { void }
  //    */
  //   public handleRouteChange(route: string): void {
  //     this.subscriptions.push(
  //       this.triggerRoutes$
  //         .pipe(take(1))
  //         .subscribe((triggerRoutes: string[]): void => {
  //           // Find matched route taking into account wildcards.
  //           const matchedRoute: string = triggerRoutes.filter(
  //             (triggerRoute: string) =>
  //               new RegExp('^' + triggerRoute.replace('*', '.*') + '$').test(
  //                 route
  //               )
  //           )?.[0];

  //           if (matchedRoute) {
  //             this.handleMatchingTriggerRoute(matchedRoute);
  //           }
  //         })
  //     );
  //   }

  //   /**
  //    * Handles a matching trigger route, checking whether it has already been dismissed
  //    * and opening the explainer screen if it has not.
  //    * @param { string } route - route that was matched.
  //    * @returns { void }
  //    */
  //   private handleMatchingTriggerRoute(route: string): void {
  //     this.subscriptions.push(
  //       // get both in parallel.
  //       forkJoin([
  //         this.getExplainerScreens$,
  //         this.dismissalV2Service.getDismissals(),
  //       ]).subscribe(
  //         ([explainerScreens, dismissals]: [
  //           ExplainerScreenWeb[],
  //           Dismissal[]
  //         ]): void => {
  //           // get matching explainer screen for passed route
  //           const explainerScreen: ExplainerScreenWeb = explainerScreens.filter(
  //             (explainerScreen: ExplainerScreenWeb) => {
  //               return explainerScreen.triggerRoute === route;
  //             }
  //           )?.[0];

  //           if (!explainerScreen) {
  //             console.error(`No explainer screen found for route: ${route}`);
  //             return;
  //           }

  //           // check if explainer screen has already been dismissed.
  //           if (
  //             dismissals.some(
  //               (dismissal: Dismissal): boolean =>
  //                 dismissal.key === explainerScreen.key
  //             )
  //           ) {
  //             return;
  //           }

  //           // open explainer screen modal.
  //           this.explainerScreenModal.open(explainerScreen);
  //         }
  //       )
  //     );
  //   }
}
