import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Observable,
  Subscription,
  catchError,
  map,
  of,
  shareReplay,
  take,
} from 'rxjs';
import {
  FeaturedEntityTypeEnum,
  FeaturedGroup,
  GetFeaturedEntitiesGQL,
  GetFeaturedEntitiesQuery,
} from '../../../../../../graphql/generated.engine';
import { ApolloQueryResult } from '@apollo/client';
import { TenantCustomHomepageService } from '../../services/tenant-custom-homepage.service';

/**
 * Tenant featured group cards.
 */
@Component({
  selector: 'm-tenant__featuredGroupCards',
  templateUrl: 'featured-group-cards.component.html',
  styleUrls: ['featured-group-cards.component.ng.scss'],
})
export class TenantFeaturedGroupCardsComponent implements OnInit, OnDestroy {
  // subscription for initialization.
  private initSubscription: Subscription;

  /** Featured groups from server. */
  protected readonly featuredGroups$: Observable<FeaturedGroup[]> =
    this.getFeaturedEntitiesGQL
      .fetch({
        first: 3,
        after: 0,
        type: FeaturedEntityTypeEnum.Group,
      })
      .pipe(
        map(
          (result: ApolloQueryResult<GetFeaturedEntitiesQuery>) =>
            result?.data?.featuredEntities?.edges?.map(
              (edge) => edge.node as FeaturedGroup
            ) ?? []
        ),
        catchError((e: unknown): Observable<FeaturedGroup[]> => {
          console.error(e);
          return of([]);
        }),
        shareReplay()
      );

  constructor(
    private getFeaturedEntitiesGQL: GetFeaturedEntitiesGQL,
    private tenantCustomHomepageService: TenantCustomHomepageService
  ) {}

  ngOnInit(): void {
    this.initSubscription = this.featuredGroups$
      .pipe(take(1))
      .subscribe((val: FeaturedGroup[]): void => {
        this.tenantCustomHomepageService.isGroupsSectionLoaded$.next(true);
      });
  }

  ngOnDestroy(): void {
    this.initSubscription?.unsubscribe();
  }
}
