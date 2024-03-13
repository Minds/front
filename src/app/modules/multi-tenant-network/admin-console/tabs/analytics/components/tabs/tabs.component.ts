import { Component } from '@angular/core';

/**
 * Subtabs shown in the network admin analytics section, for selecting
 * which table type to show.
 */
@Component({
  selector: 'm-networkAdminAnalytics__tabs',
  styleUrls: ['./tabs.component.ng.scss'],
  template: `
    <div class="m-tabs__container">
      <div class="m-tabs__tab">
        <a
          [routerLink]="['./posts']"
          [routerLinkActive]="'m-tabs__tab--selected'"
          queryParamsHandling="merge"
          data-ref="network-admin-console-analytics-tab-posts"
          i18n="@@NETWORK_ADMIN_ANALYTICS__TAB_POSTS"
          >Posts</a
        >
      </div>
      <div class="m-tabs__tab">
        <a
          [routerLink]="['./groups']"
          [routerLinkActive]="'m-tabs__tab--selected'"
          queryParamsHandling="merge"
          data-ref="network-admin-console-analytics-tab-groups"
          i18n="@@NETWORK_ADMIN_ANALYTICS__TAB_GROUPS"
          >Groups</a
        >
      </div>
      <div class="m-tabs__tab">
        <a
          [routerLink]="['./channels']"
          [routerLinkActive]="'m-tabs__tab--selected'"
          queryParamsHandling="merge"
          data-ref="network-admin-console-analytics-tab-channels"
          i18n="@@NETWORK_ADMIN_ANALYTICS__TAB_CHANNELS"
          >Channels</a
        >
      </div>
    </div>
  `,
})
export class NetworkAdminAnalyticsTabsComponent {}
