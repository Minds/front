import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../services/configs.service';
import { Observable, Subscription, of } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { IS_TENANT_NETWORK } from '../../../injection-tokens/tenant-injection-tokens';
import { PermissionsService } from '../../../services/permissions.service';
import { SiteMembershipsCountService } from '../../../../modules/site-memberships/services/site-membership-count.service';
import { NavigationItem } from '../../../../../graphql/generated.engine';

export type NavigationItemExtended = NavigationItem & {
  mustBeLoggedIn?: boolean;
  routerLinkActiveExact?: boolean;
};
import { MindsUser } from '../../../../interfaces/entities';
import { ChatReceiptService } from '../../../../modules/chat/services/chat-receipt.service';

/**
 * Custom navigation items for tenants
 * To be inserted into navigation-v2
 */
@Component({
  selector: 'm-sidebar__customNavigationItems',
  templateUrl: 'custom-navigation-items.component.html',
  styleUrls: ['../navigation-v2/navigation-v2.component.ng.scss'],
})
export class CustomNavigationItemsComponent implements OnInit, OnDestroy {
  readonly cdnUrl: string;
  readonly cdnAssetsUrl: string;

  @HostBinding('hidden')
  hidden: boolean = false;

  @Output('itemClicked') clickedEmitter: EventEmitter<any> = new EventEmitter();

  user: MindsUser;

  subscriptions: Subscription[] = [];

  /** Processed custom nav items for display */
  public customNavItems: NavigationItem[];

  /**
   * Custom nav items from configs
   */
  rawCustomNavItems: NavigationItem[];

  /**
   * Ids of custom nav items for which
   * routerLinkActiveOptions.exact should be true
   */
  public customNavItemsRequiringExactRouteMatchIds: string[];

  /** Ids of custom nav items that should not be shown to this user */
  public hiddenCustomNavItemsIds: Set<string> = new Set();

  /** Whether memberships link should be shown. */
  public readonly shouldShowMembershipsLink$: Observable<boolean> =
    this.siteMembershipsCountService.count$.pipe(
      distinctUntilChanged(),
      map((count: number) => {
        return count > 0;
      })
    );

  /** Count of a users unread messages. */
  protected unreadChatMessageCount$: Observable<number> =
    this.chatReceiptService.unreadCount$;

  constructor(
    public session: Session,
    protected configs: ConfigsService,
    private siteMembershipsCountService: SiteMembershipsCountService,
    protected permissions: PermissionsService,
    private chatReceiptService: ChatReceiptService,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
  ) {
    this.cdnUrl = this.configs.get('cdn_url');
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
    this.getUser();

    this.rawCustomNavItems = this.configs.get('custom')?.navigation;
  }

  ngOnInit() {
    if (!this.isTenantNetwork) {
      return;
    }
    this.prepareCustomNavItems();

    this.subscriptions.push(
      this.session.loggedinEmitter?.subscribe(() => {
        this.prepareCustomNavItems();
      }),
      this.shouldShowMembershipsLink$.subscribe((should) => {
        // Only show the memberships link when the site has memberships
        should
          ? this.hiddenCustomNavItemsIds.delete('memberships')
          : this.hiddenCustomNavItemsIds.add('memberships');
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Perform various tasks that adjust the behavior
   * and visibility of finicky custom nav items
   */
  prepareCustomNavItems() {
    if (!this.isTenantNetwork) {
      return;
    }

    this.setHiddenCustomNavItems();
    this.customNavItemsRequiringExactRouteMatchIds =
      this.getActiveRouteMatchIds();
    this.customNavItems = this.getCustomNavItemsWithUpdatedPaths();
  }

  /**
   * Get active route match options for links that require it
   */
  getActiveRouteMatchIds(): string[] {
    let ids = ['memberships', 'groups'];
    if (!this.isLoggedIn()) {
      ids.push('explore');
    }

    return ids;
  }

  /**
   * Show or hide custom links based on user state/role
   */
  setHiddenCustomNavItems(): void {
    const conditions = [
      {
        test: () => !this.isLoggedIn(),
        add: ['newsfeed', 'channel'], // add to hidden items.
        remove: [], // remove from hidden items.
      },
      {
        test: () => this.isLoggedIn(),
        add: [],
        remove: ['newsfeed', 'channel'],
      },
      {
        test: () => !this.isAdmin() && !this.permissions.canModerateContent(),
        add: ['admin'],
        remove: [],
      },
      {
        test: () => this.isAdmin() || this.permissions.canModerateContent(),
        add: [],
        remove: ['admin'],
      },
      {
        test: () => !this.isLoggedIn() || !this.permissions.canBoost(),
        add: ['boost'],
        remove: [],
      },
      {
        test: () => this.isLoggedIn() && this.permissions.canBoost(),
        add: [],
        remove: ['boost'],
      },
    ];

    // Process conditions to update hiddenCustomNavItemsIds
    conditions.forEach(({ test, add, remove }) => {
      if (test()) {
        add.forEach((id) => this.hiddenCustomNavItemsIds.add(id));
        remove.forEach((id) => this.hiddenCustomNavItemsIds.delete(id));
      }
    });
  }

  /**
   * @param {Array} rawCustomNavItems - The original list of custom navigation items.
   * @return {Array} The adjusted list of custom navigation items.
   */
  getCustomNavItemsWithUpdatedPaths(): NavigationItem[] {
    return this.rawCustomNavItems.map((item) =>
      //  The 'explore' item path is different in guest mode
      item.id === 'explore' && !this.isLoggedIn()
        ? { ...item, path: '/' }
        : item
    );
  }

  /**
   * Gets user and sets it to class variable.
   * @returns { void }
   */
  public getUser(): void {
    this.user = this.session.getLoggedInUser((user) => {
      this.user = user;
    });
  }

  /**
   * Whether session logged in user is an admin.
   * @returns { boolean } true if user is an admin.
   */
  public isAdmin(): boolean {
    return this.session.isAdmin();
  }

  /**
   * Whether the user is logged in
   * @returns { boolean } true if logged in
   */
  public isLoggedIn(): boolean {
    return this.session.isLoggedIn();
  }
}
