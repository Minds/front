import { Component } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import {
  FeaturedEntityTypeEnum,
  FeaturedGroup,
  GetFeaturedEntitiesGQL,
  GetFeaturedEntitiesQuery,
} from '../../../../../../graphql/generated.engine';
import { ApolloQueryResult } from '@apollo/client';

/**
 * Tenant featured group cards.
 */
@Component({
  selector: 'm-tenant__featuredGroupCards',
  templateUrl: 'featured-group-cards.component.html',
  styleUrls: ['featured-group-cards.component.ng.scss'],
})
export class TenantFeaturedGroupCardsComponent {
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

  constructor(private getFeaturedEntitiesGQL: GetFeaturedEntitiesGQL) {}
}
