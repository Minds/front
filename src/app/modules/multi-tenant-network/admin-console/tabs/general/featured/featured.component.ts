import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, filter, lastValueFrom } from 'rxjs';
import {
  FeaturedEntity,
  FeaturedEntityTypeEnum,
  FeaturedGroup,
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
 * Featured entities section of admin console. Allows viewing and changing
 * and opening a modal to add to the list of featured entities for the network.
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
        if (entity.type === 'user') {
          this.onUserAdd(entity as MindsUser);
        } else if (entity.type === 'group') {
          this.onGroupAdd(entity as MindsGroup);
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
  public async fetchMore(): Promise<void> {
    if (this.inProgress$.getValue()) return;
    this.inProgress$.next(true);

    await this.getFeaturedEntitiesQuery.fetchMore({
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
    return featuredEntity.id;
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
    this.addFeaturedEntityModal.open(
      this.type$.getValue() === FeaturedEntityTypeEnum.User
        ? AddFeaturedEntityModalEntityType.User
        : AddFeaturedEntityModalEntityType.Group
    );
  }

  /**
   * Handles the receipt of a new query response.
   * @param { ApolloQueryResult<GetFeaturedEntitiesQuery> } result - query result.
   * @returns { void }
   */
  private handleQueryResult(
    result: ApolloQueryResult<GetFeaturedEntitiesQuery>
  ): void {
    const featuredEntities: FeaturedEntity[] = [];

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
    if (this.isEntityAlreadyInList(user.guid)) {
      this.toaster.warn('User is already featured.');
      return;
    }

    if (await this.autoSubscribeToEntityByGuid(user.guid)) {
    }
  }

  /**
   * On a new group being added.
   * @param { MindsGroup } group - group that was added.
   * @returns { Promise<void> }
   */
  private async onGroupAdd(group: MindsGroup): Promise<void> {
    if (this.isEntityAlreadyInList(group.guid)) {
      this.toaster.warn('Group is already featured.');
      return;
    }

    if (await this.autoSubscribeToEntityByGuid(group.guid)) {
    }
  }

  /**
   * Call API to add featured entity as auto-subscribed.
   * @param { string } guid - guid of entity to add.
   * @returns { Promise<boolean> } - whether the operation was successful.
   */
  private async autoSubscribeToEntityByGuid(guid: string): Promise<boolean> {
    try {
      await lastValueFrom(
        this.storeFeaturedEntityGQL.mutate({
          entityGuid: guid,
          autoSubscribe: true,
        })
      );
      await this.getFeaturedEntitiesQuery.refetch();
      return true;
    } catch (e) {
      console.error(e);
      this.toaster.error(
        e?.message ?? 'An error occurred whilst adding user to featured list.'
      );
      return false;
    }
  }

  /**
   * Whether an entity is already in the list.
   * @param { string } guid - guid of entity to check.
   * @returns { boolean } - whether the entity is already in the list.
   */
  private isEntityAlreadyInList(guid: string): boolean {
    return this.featuredEntities$
      .getValue()
      .some((entity: FeaturedEntity) => entity.entityGuid === guid);
  }
}
