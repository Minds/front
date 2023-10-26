import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, filter, lastValueFrom } from 'rxjs';
import {
  FeaturedEntity,
  FeaturedEntityTypeEnum,
  FeaturedUser,
  GetFeaturedEntitiesGQL,
  GetFeaturedEntitiesQuery,
  GetFeaturedEntitiesQueryVariables,
  StoreFeaturedEntityGQL,
} from '../../../../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { AddFeaturedEntityModalLazyService } from './add-user-modal/add-featured-entity-modal-lazy.service';
import { MindsGroup, MindsUser } from '../../../../../../interfaces/entities';
import { AddFeaturedEntityModalEntityType } from './add-user-modal/add-featured-entity-modal.types';

/**
 * Featured entities section of admin console. Allows viewing and changing the list
 * of featured entities for the network.
 */
@Component({
  selector: 'm-networkAdminConsole__featured',
  templateUrl: './featured.component.html',
  styleUrls: [
    './featured.component.ng.scss',
    '../../../stylesheets/console.component.ng.scss',
  ],
  host: { class: 'm-networkAdminConsole__container--noHorizontalPadding' },
})
export class NetworkAdminConsoleFeaturedComponent implements OnInit, OnDestroy {
  /** Whether loading is in progress. */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** List of featured entities to be displayed. */
  public readonly featuredEntities$: BehaviorSubject<
    FeaturedEntity[]
  > = new BehaviorSubject<FeaturedEntity[]>([]);

  /** Query reference for featured entities query. */
  private getFeaturedEntitiesQuery: QueryRef<
    GetFeaturedEntitiesQuery,
    GetFeaturedEntitiesQueryVariables
  >;

  /** Whether pagination has next page. */
  public readonly hasNextPage$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** Type of entity to be displayed */
  public readonly type$: BehaviorSubject<
    FeaturedEntityTypeEnum
  > = new BehaviorSubject<FeaturedEntityTypeEnum>(FeaturedEntityTypeEnum.User);

  /** Enum for display in component. */
  public readonly FeaturedEntityTypeEnum: typeof FeaturedEntityTypeEnum = FeaturedEntityTypeEnum;

  /** Cursor for pagination. */
  private endCursor: number = 0;

  /** Limit of entities to load per call. */
  private readonly limit: number = 12;

  // Subscriptions.
  private featuredEntitiesValueChangeSubscription: Subscription;
  private topbarAlertSubscription: Subscription;
  private entityAddedSubscription: Subscription;

  constructor(
    private getFeaturedEntitiesGQL: GetFeaturedEntitiesGQL,
    private storeFeaturedEntityGQL: StoreFeaturedEntityGQL,
    private toaster: ToasterService,
    private addFeaturedEntityModal: AddFeaturedEntityModalLazyService
  ) {}

  ngOnInit(): void {
    // Set up query.
    this.getFeaturedEntitiesQuery = this.getFeaturedEntitiesGQL.watch(
      {
        first: this.limit,
        after: 0,
        type: this.type$.getValue(),
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );

    // Respond to value changes.
    this.featuredEntitiesValueChangeSubscription = this.getFeaturedEntitiesQuery.valueChanges.subscribe(
      (result: ApolloQueryResult<GetFeaturedEntitiesQuery>): void => {
        if (result.loading) {
          return;
        }
        this.handleQueryResult(result);
        this.inProgress$.next(false);
      }
    );

    // Respond to entities being added.
    this.entityAddedSubscription = this.addFeaturedEntityModal.entity$
      .pipe(filter(Boolean))
      .subscribe((entity: MindsUser | MindsGroup): void => {
        if ((entity.type = 'user')) {
          this.onUserAdd(entity as MindsUser);
        }
      });
  }

  ngOnDestroy(): void {
    this.featuredEntitiesValueChangeSubscription?.unsubscribe();
    this.topbarAlertSubscription?.unsubscribe();
    this.entityAddedSubscription?.unsubscribe();
  }

  /**
   * Loads next entities.
   * @returns { void }
   */
  public fetchMore(): void {
    this.inProgress$.next(true);

    this.getFeaturedEntitiesQuery.fetchMore({
      variables: {
        after: this.endCursor,
      },
    });
  }

  /**
   * Provide trackBy function for for-loop.
   * @returns { string } Unique track by key.
   */
  public trackBy(featuredEntity: FeaturedEntity): string {
    return featuredEntity.entityGuid;
  }

  /**
   * Called on tab click. Will switch entity types being displayed.
   * @param { FeaturedEntityTypeEnum } type - type for the tab clicked.
   * @returns { void }
   */
  public onTabClick(type: FeaturedEntityTypeEnum): void {
    if (this.inProgress$.getValue()) {
      console.warn('Attempted to switch tabs whilst loading is in progress.');
      return;
    }

    this.type$.next(type);
    this.inProgress$.next(true);

    // reset list
    this.featuredEntities$.next([]);
    this.endCursor = 0;
    this.hasNextPage$.next(true);

    this.getFeaturedEntitiesQuery.refetch({
      first: this.limit,
      after: 0,
      type: this.type$.getValue(),
    });
  }

  /**
   * Called on entity deletion from within row.
   * @param { string } entityGuid - guid of entity that has been deleted.
   * @returns { Promise<void> }
   */
  public async onRowDeletion(entityGuid: string): Promise<void> {
    this.featuredEntities$.next(
      this.featuredEntities$
        .getValue()
        .filter((entity: FeaturedEntity) => entity.entityGuid !== entityGuid)
    );
  }

  /**
   * Called on add featured entity click. Will open modal
   * to allow the user to add a featured entity.
   * @returns { void }
   */
  public onAddFeaturedEntityClick(): void {
    this.addFeaturedEntityModal.open(AddFeaturedEntityModalEntityType.User);
  }

  /**
   * Handles the receipt of a new query response.
   * @param { ApolloQueryResult<GetFeaturedEntitiesQuery> } result - query result.
   * @returns { void }
   */
  private handleQueryResult(
    result: ApolloQueryResult<GetFeaturedEntitiesQuery>
  ): void {
    const featuredEntities: FeaturedEntity[] = this.featuredEntities$.getValue();

    for (let edge of result?.data?.featuredEntities?.edges ?? []) {
      featuredEntities.push(edge.node as FeaturedEntity);
    }

    this.featuredEntities$.next(featuredEntities);
    this.hasNextPage$.next(
      result?.data?.featuredEntities?.pageInfo?.hasNextPage ?? false
    );
    this.endCursor = Number(
      result?.data?.featuredEntities?.pageInfo?.endCursor ?? null
    );
  }

  /**
   * On a new user being added.
   * @param { MindsUser } user - user that was added.
   * @returns { Promise<void> }
   */
  private async onUserAdd(user: MindsUser): Promise<void> {
    const featuredUser: FeaturedUser = {
      __typename: 'FeaturedUser',
      id: user.guid,
      entityGuid: user.guid,
      username: user.username,
      name: user.name,
      autoSubscribe: true,
      recommended: false,
      tenantId: null,
    };

    try {
      await lastValueFrom(
        this.storeFeaturedEntityGQL.mutate({
          entityGuid: user.guid,
          autoSubscribe: true,
        })
      );
    } catch (e) {
      console.error(e);
      this.toaster.error(
        e?.message ?? 'An error occurred whilst adding user to featured list.'
      );
      return;
    }

    if (
      this.featuredEntities$
        .getValue()
        .some((entity: FeaturedEntity) => entity.entityGuid === user.guid)
    ) {
      this.toaster.warn('User is already featured.');
      return;
    }

    this.featuredEntities$.next([
      featuredUser as any,
      ...this.featuredEntities$.getValue(),
    ]);
  }
}
