import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  GetExcludedHashtagsGQL,
  GetExcludedHashtagsQuery,
  GetExcludedHashtagsQueryVariables,
} from '../../../../../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';
import {
  ExcludedHashtag,
  ExcludedHashtagEdge,
} from '../excluded-hashtags.types';

/**
 * List of excluded hashtags.
 */
@Component({
  selector: 'm-networkAdminConsole__excludedHashtagsList',
  templateUrl: './excluded-hashtags-list.component.html',
  styleUrls: ['./excluded-hashtags-list.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkAdminConsoleExcludedHashtagsListComponent
  implements OnInit, OnDestroy
{
  /** Page size. */
  @Input() private readonly pageSize: number = 12;

  /** Whether loading is in progress. */
  public inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** Cursor for pagination. */
  public readonly hasNextPage$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Excluded hashtag edges. */
  public readonly excludedHashtagEdges$: BehaviorSubject<
    ExcludedHashtagEdge[]
  > = new BehaviorSubject<ExcludedHashtagEdge[]>([]);

  /** Get excluded hashtags query reference. */
  private getExcludedHashtagsQuery: QueryRef<
    GetExcludedHashtagsQuery,
    GetExcludedHashtagsQueryVariables
  >;

  /** Cursor for pagination. */
  private endCursor: string | null = null;

  // Subscriptions
  private getExcludedHashtagsValueChangeSubscription: Subscription;

  constructor(private getExcludedHashtagsGQL: GetExcludedHashtagsGQL) {}

  ngOnInit(): void {
    this.getExcludedHashtagsQuery = this.getExcludedHashtagsGQL.watch(
      {
        first: this.pageSize,
        after: null,
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );

    this.getExcludedHashtagsValueChangeSubscription =
      this.getExcludedHashtagsQuery.valueChanges.subscribe(
        (result: ApolloQueryResult<GetExcludedHashtagsQuery>): void => {
          if (result.loading) {
            return;
          }

          this.handleQueryResult(result);
          this.inProgress$.next(false);
        }
      );
  }

  ngOnDestroy(): void {
    this.getExcludedHashtagsValueChangeSubscription?.unsubscribe();
  }

  /**
   * Loads next elements in feed.
   * @returns { void }
   */
  public fetchMore(): void {
    this.inProgress$.next(true);

    this.getExcludedHashtagsQuery.fetchMore({
      variables: {
        after: Number(this.endCursor),
      },
    });
  }

  /**
   * Track by function for change detection.
   * @param { number } index - index in list.
   * @param { ExcludedHashtag } item - excluded hashtag.
   * @returns { string } id to track by.
   */
  public trackBy(index: number, item: ExcludedHashtag): string {
    return item.id;
  }

  /**
   * Handles receipt of a new query response.
   * @param { ApolloQueryResult<GetExcludedHashtagsQuery> } result - query result.
   * @returns { void }
   */
  private handleQueryResult(
    result: ApolloQueryResult<GetExcludedHashtagsQuery>
  ): void {
    const newExcludedHashtagEdges: ExcludedHashtagEdge[] =
      (result?.data?.hashtagExclusions?.edges as ExcludedHashtagEdge[]) ?? [];
    const excludedHashtagEdges: ExcludedHashtagEdge[] = [
      ...this.excludedHashtagEdges$.getValue(),
      ...newExcludedHashtagEdges,
    ];

    this.excludedHashtagEdges$.next(excludedHashtagEdges);

    this.hasNextPage$.next(
      result?.data?.hashtagExclusions?.pageInfo?.hasNextPage ?? false
    );
    this.endCursor =
      result?.data?.hashtagExclusions?.pageInfo?.endCursor ?? null;
  }

  /**
   * Removes a hashtag exclusion from the list on the client-side.
   * @param { string } tag - The tag to remove.
   * @returns { void }
   */
  public async removeHashtagExclusion(tag: string): Promise<void> {
    this.excludedHashtagEdges$.next(
      this.excludedHashtagEdges$
        .getValue()
        .filter((edge) => edge.node?.tag !== tag)
    );
  }
}
