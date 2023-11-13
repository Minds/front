import { Component } from '@angular/core';

/**
 * Top-level navigation tabs for network admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['../stylesheets/console.component.ng.scss'],
  host: { class: 'm-networkAdminConsole__container--noHorizontalPadding' },
})
export class NetworkAdminConsoleTabsComponent {}
