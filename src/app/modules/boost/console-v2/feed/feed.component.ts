import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BoostLocation } from '../../../boost/modal-v2/boost-modal-v2.types';
import {
  BoostEdge,
  GetBoostFeedGQL,
  GetBoostFeedQuery,
  GetBoostFeedQueryVariables,
} from '../../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';

/**
 * Object holding displayable Boosts. We use a new object for this so that we can
 * parse the legacy activity JSON before we start trying to render the linked template.
 */
export type DisplayableBoost = {
  guid: string;
  activity: Object;
};

/**
 * Presents a feed of boosts under the "explore" tab in the boost console.
 */
@Component({
  selector: 'm-boostConsole__feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.ng.scss'],
})
export class BoostConsoleFeedComponent implements OnInit, OnDestroy {
  /** Page size */
  private readonly pageSize: number = 12;

  /** Query reference for boost feed query. */
  private getBoostFeedQuery: QueryRef<
    GetBoostFeedQuery,
    GetBoostFeedQueryVariables
  >;

  /** Whether fetching more is currently in progress. */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** Displayable Boosts */
  public readonly boosts$: BehaviorSubject<
    DisplayableBoost[]
  > = new BehaviorSubject<DisplayableBoost[]>([]);

  /** Cursor for pagination. */
  public readonly hasNextPage$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  /** Cursor for pagination. */
  private endCursor: number = 0;

  /** Subscription to Boost feed value changes. */
  private boostFeedValueChangeSubscription: Subscription;

  constructor(private getBoostFeedGQL: GetBoostFeedGQL) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.boostFeedValueChangeSubscription?.unsubscribe();
  }

  /**
   * Loads next elements in feed.
   * @returns { void }
   */
  public fetchMore(): void {
    this.inProgress$.next(true);

    this.getBoostFeedQuery.fetchMore({
      variables: {
        after: this.endCursor,
      },
    });
  }

  /**
   * Provide trackBy function for feeds for loop.
   * @param { DisplayableBoost } boost - boost to get track by key for.
   * @returns { string } Unique track by key.
   */
  public trackBy(boost: DisplayableBoost): string {
    return boost.guid;
  }

  /**
   * Load feed and init subscription to value changes.
   */
  private load(): void {
    this.getBoostFeedQuery = this.getBoostFeedGQL.watch(
      {
        first: this.pageSize,
        after: 0,
        targetLocation: BoostLocation.NEWSFEED,
        source: 'feed/boosts',
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );

    this.boostFeedValueChangeSubscription = this.getBoostFeedQuery.valueChanges.subscribe(
      (result: ApolloQueryResult<GetBoostFeedQuery>): void => {
        if (result.loading) {
          return;
        }

        this.handleQueryResult(result);
        this.inProgress$.next(false);
      }
    );
  }

  /**
   * Handles receipt of a new query response.
   * @param { ApolloQueryResult<GetBoostFeedQuery> } result - query result.
   * @returns { void }
   */
  private handleQueryResult(
    result: ApolloQueryResult<GetBoostFeedQuery>
  ): void {
    const boosts: DisplayableBoost[] = this.boosts$.getValue();
    const edges: BoostEdge[] = (result.data.boosts.edges as BoostEdge[]) ?? [];

    try {
      for (let edge of edges) {
        // If we've already got this activity, no need to reparse and add it again.
        // this will result in deduplication if the engine supplies duplicate Boosts.
        if (boosts.some(boost => boost.guid === edge.node.guid)) {
          continue;
        }
        boosts.push({
          guid: edge.node.guid,
          activity: this.formatLegacyActivity(
            edge?.node?.activity?.legacy ?? null
          ),
        });
      }

      this.boosts$.next(boosts);

      this.hasNextPage$.next(
        result?.data?.boosts?.pageInfo?.hasNextPage ?? false
      );
      this.endCursor = Number(
        result?.data?.boosts?.pageInfo?.endCursor ?? null
      );
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Parse legacy activity JSON string into an object.
   * @param { string } legacyActivityJson - json representation of activity.
   * @returns { Object } parsed activity object or null if not parsable.
   */
  private formatLegacyActivity(legacyActivityJson: string): Object {
    try {
      const activity = JSON.parse(legacyActivityJson) ?? null;

      if (activity) {
        activity.boosted = true;
      }

      return activity;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
