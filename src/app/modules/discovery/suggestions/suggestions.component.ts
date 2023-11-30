import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { SuggestionsService } from '../../suggestions/channel/channel-suggestions.service';
import { DiscoveryService } from '../discovery.service';
import { Location } from '@angular/common';
import { Session } from '../../../services/session';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { PermissionsService } from '../../../common/services/permissions.service';

/**
 * List of suggested groups or users.
 * For example, see it at /discovery/suggestions/groups or by clicking "Groups" in the sidebar, then "Discover Groups"
 */
@Component({
  selector: 'm-discovery__suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.ng.scss'],
  providers: [SuggestionsService],
})
export class DiscoverySuggestionsComponent extends AbstractSubscriberComponent
  implements OnInit, OnDestroy {
  type: string = 'user';
  /**
   * Whether the tabs should be hidden
   */
  hideTabs: boolean = false;
  offset: string = '';
  limit: number = 24;
  entities$ = this.service.suggestions$.pipe(
    map(suggestions => suggestions.map(suggestion => suggestion.entity))
  );
  inProgress$ = this.service.inProgress$;
  hasMoreData$ = this.service.hasMoreData$;

  /**
   * When viewed from the discovery/explore tabs,
   * don't show the back button or suggestion tabs
   * and DO show the discovery/explore tabs
   */
  exploreTabContext: boolean = false;

  siteUrl: string;

  constructor(
    private route: ActivatedRoute,
    private service: SuggestionsService,
    private discoveryService: DiscoveryService,
    public location: Location,
    private session: Session,
    private authModal: AuthModalService,
    private router: Router,
    protected isTenant: IsTenantService,
    private toaster: ToasterService,
    protected permissions: PermissionsService,
    configs: ConfigsService
  ) {
    super();
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    if (!this.session.getLoggedInUser()) {
      this.subscriptions.push(
        this.session.loggedinEmitter
          .pipe(filter(Boolean))
          .subscribe((_: boolean) => {
            this.loadMore();
          })
      );

      this.authModal.open({ formDisplay: 'login' });
      return;
    }

    this.subscriptions.push(
      combineLatest([this.route.queryParamMap, this.route.url]).subscribe(
        ([queryParamMap, segments]) => {
          const contextualUser = queryParamMap.get('u');
          this.type = segments[0].path;
          // hide tabs to only show user recommendations for the contextual user
          this.hideTabs = Boolean(contextualUser);

          this.exploreTabContext = Boolean(queryParamMap.get('explore'));

          this.service.load({
            limit: this.limit,
            refresh: true,
            type: this.type,
            user: contextualUser,
          });
        }
      )
    );
  }

  loadMore(): void {
    if (this.inProgress$.value) return;
    if (!this.hasMoreData$.value) return;
    this.service.load({
      limit: this.limit,
      refresh: false,
      type: this.type,
    });
  }

  /**
   * Copy invite link to clipboard
   */
  protected copyInviteLinkToClipboard(): void {
    const url = this.isTenant.is()
      ? this.siteUrl
      : `${this.siteUrl}?referrer=${this.session.getLoggedInUser().username}`;

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toaster.success('Link copied to clipboard');
  }

  /**
   * Redirect to group create page
   */
  protected clickedCreateGroup(): void {
    this.router.navigate(['/groups/create'], {
      queryParams: { explore: true },
    });
  }
}
