import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  GetReportsGQL,
  GetReportsQuery,
  GetReportsQueryVariables,
  Report,
  ReportEdge,
  ReportStatusEnum,
} from '../../../../../../../graphql/generated.engine';
import { QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client';

/**
 * List of reports.
 */
@Component({
  selector: 'm-networkAdminConsole__reportsList',
  templateUrl: './reports-list.component.html',
  styleUrls: [
    './reports-list.component.ng.scss',
    '../../../stylesheets/console.component.ng.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkAdminConsoleReportsListComponent
  implements OnInit, OnDestroy
{
  /** Page size. */
  private readonly pageSize: number = 12;

  /** Whether loading is in progress. */
  public inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /** Cursor for pagination. */
  public readonly hasNextPage$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /** Report edges. */
  public readonly reportEdges$: BehaviorSubject<ReportEdge[]> =
    new BehaviorSubject<ReportEdge[]>([]);

  /** Get reports query reference. */
  private getReportsQuery: QueryRef<GetReportsQuery, GetReportsQueryVariables>;

  /** Cursor for pagination. */
  private endCursor: number = 0;

  // Subscriptions
  private getReportsValueChangeSubscription: Subscription;

  constructor(
    private getReportsGQL: GetReportsGQL,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getReportsQuery = this.getReportsGQL.watch(
      {
        status: ReportStatusEnum.Pending,
        first: this.pageSize,
        after: 0,
      },
      {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
        useInitialLoading: true,
      }
    );

    this.getReportsValueChangeSubscription =
      this.getReportsQuery.valueChanges.subscribe(
        (result: ApolloQueryResult<GetReportsQuery>): void => {
          if (result.loading) {
            return;
          }

          this.handleQueryResult(result);
          this.inProgress$.next(false);
        }
      );
  }

  ngOnDestroy(): void {
    this.getReportsValueChangeSubscription?.unsubscribe();
  }

  /**
   * Loads next elements in feed.
   * @returns { void }
   */
  public fetchMore(): void {
    this.inProgress$.next(true);

    this.getReportsQuery.fetchMore({
      variables: {
        after: this.endCursor,
      },
    });
  }

  /**
   * Track by function for change detection.
   * @param { number } index - index in list.
   * @param { Report } item - report.
   * @returns { string } id to track by.
   */
  public trackBy(index: number, item: Report): string {
    return item.id + item.reportGuid;
  }

  /**
   * Called when a verdict is provided. Will pop the report from a list
   * and if its the last report and more can be loaded, load the next batch.
   * @returns { void }
   */
  public onVerdictProvided(reportEdge: ReportEdge): void {
    this.reportEdges$.next(
      this.reportEdges$
        .getValue()
        .filter((edge: ReportEdge) => edge.node.id !== reportEdge.node.id)
    );

    // if we are out of entities but there are more pages, load next batch.
    if (
      this.hasNextPage$.getValue() &&
      this.reportEdges$.getValue().length === 0
    ) {
      this.fetchMore();
    }
    this.detectChanges();
  }

  /**
   * Handles receipt of a new query response.
   * @param { ApolloQueryResult<GetReportsQuery> } result - query result.
   * @returns { void }
   */
  private handleQueryResult(result: ApolloQueryResult<GetReportsQuery>): void {
    const newReportEdges: ReportEdge[] =
      (result?.data?.reports?.edges as ReportEdge[]) ?? [];
    const reportEdges: ReportEdge[] = [
      ...this.reportEdges$.getValue(),
      ...newReportEdges.filter((edge: ReportEdge) => {
        return (
          edge?.node?.entityEdge?.__typename === 'ChatMessageEdge' ||
          Boolean(edge?.node?.entityEdge?.node?.legacy)
        );
      }),
    ];

    this.reportEdges$.next(reportEdges);

    this.hasNextPage$.next(
      result?.data?.reports?.pageInfo?.hasNextPage ?? false
    );
    this.endCursor = Number(result?.data?.reports?.pageInfo?.endCursor ?? null);
    this.detectChanges();
  }

  /**
   * Run change detection.
   * @returns { void }
   */
  private detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
