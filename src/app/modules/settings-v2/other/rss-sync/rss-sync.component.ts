import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import {
  CreateRssFeedGQL,
  CreateRssFeedMutation,
  FetchRssFeedsGQL,
  FetchRssFeedsQuery,
  FetchRssFeedsQueryVariables,
  RefreshRssFeedGQL,
  RefreshRssFeedMutation,
  RemoveRssFeedGQL,
  RemoveRssFeedMutation,
} from '../../../../../graphql/generated.engine';
import { catchError, map, take, tap } from 'rxjs/operators';
import { MutationResult, QueryRef } from 'apollo-angular';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { ApolloError } from '@apollo/client';

/**
 * Wallet settings component.
 *
 * Controls whether wallet balance appears in topbar
 * (e.g. for privacy during screenshares and screencasts)
 */
@Component({
  selector: 'm-settingsV2__rss-sync',
  templateUrl: 'rss-sync.component.html',
  styleUrls: ['rss-sync.component.ng.scss'],
})
export class SettingsV2RssSyncComponent implements OnInit, OnDestroy {
  // user form.
  public form: UntypedFormGroup;

  // true when load in progress.
  public inProgress = true;

  private subscriptions: Subscription[] = [];
  private fetchRssFeedsQueryWatcher: QueryRef<
    FetchRssFeedsQuery,
    FetchRssFeedsQueryVariables
  >;
  public rssFeeds$: Observable<FetchRssFeedsQuery['rssFeeds']>;

  constructor(
    private session: Session,
    private router: Router,
    private toast: ToasterService,
    protected fb: UntypedFormBuilder,
    private createRssFeedMutation: CreateRssFeedGQL,
    private fetchRssFeedsQuery: FetchRssFeedsGQL,
    private refreshRssFeedMutation: RefreshRssFeedGQL,
    private removeRssFeedMutation: RemoveRssFeedGQL,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  ngOnInit(): void {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    if (
      !this.session.getLoggedInUser().plus &&
      !this.session.getLoggedInUser().pro &&
      !this.isTenantNetwork
    ) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      rssFeedUrl: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.fetchRssFeedsQueryWatcher = this.fetchRssFeedsQuery.watch();

    this.rssFeeds$ = this.fetchRssFeedsQueryWatcher.valueChanges.pipe(
      map(
        (result: ApolloQueryResult<FetchRssFeedsQuery>) => result.data.rssFeeds
      )
    );

    this.inProgress = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe());
  }

  /**
   * On submit button click, sets value to match the value indicated by the form.
   * @returns { void }
   */
  public createRssFeed(): void {
    if (!this.form.valid) {
      return;
    }
    this.inProgress = true;

    const rssFeedUrl = this.form.get('rssFeedUrl').value;

    this.subscriptions.push(
      this.createRssFeedMutation
        .mutate({ input: { url: rssFeedUrl } })
        .pipe(
          take(1),
          tap((result: MutationResult<CreateRssFeedMutation>) => {
            if (result.data.createRssFeed) {
              this.toast.success('Successfully added RSS feed.');
              this.form.reset();
            }
            this.inProgress = false;

            this.fetchRssFeedsQueryWatcher.refetch();
          }),
          catchError((e: ApolloError) => this.handleError(e))
        )
        .subscribe()
    );
  }

  public refreshRssFeed(rssFeedId: string): void {
    this.subscriptions.push(
      this.refreshRssFeedMutation
        .mutate({ feedId: rssFeedId })
        .pipe(
          take(1),
          tap((result: MutationResult<RefreshRssFeedMutation>) => {
            if (result.data.refreshRssFeed) {
              this.toast.success('Successfully refreshed RSS feed.');
            }
            this.inProgress = false;

            this.fetchRssFeedsQueryWatcher.refetch();
          }),
          catchError((e: ApolloError) => this.handleError(e))
        )
        .subscribe()
    );
  }

  public removeRssFeed(rssFeedId: string): void {
    this.subscriptions.push(
      this.removeRssFeedMutation
        .mutate({ feedId: rssFeedId })
        .pipe(
          take(1),
          tap((result: MutationResult<RemoveRssFeedMutation>) => {
            this.toast.success('Successfully removed RSS feed.');
            this.inProgress = false;

            this.fetchRssFeedsQueryWatcher.refetch();
          }),
          catchError((e: ApolloError) => this.handleError(e))
        )
        .subscribe()
    );
  }

  private handleError(e: ApolloError): Observable<never> {
    this.toast.error(e.message);
    this.inProgress = false;
    return EMPTY;
  }
}
