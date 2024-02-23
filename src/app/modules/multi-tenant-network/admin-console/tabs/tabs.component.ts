import { Component } from '@angular/core';
import { Session } from '../../../../services/session';
import { PermissionsService } from '../../../../common/services/permissions.service';

/**
 * Top-level navigation tabs for network admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__tabs',
  templateUrl: './tabs.component.html',
  styleUrls: [
    '../stylesheets/console.component.ng.scss',
    './tabs.component.ng.scss',
  ],
  host: { class: 'm-networkAdminConsole__container--noHorizontalPadding' },
})
export class NetworkAdminConsoleTabsComponent {
  constructor(
    public session: Session,
    public permissions: PermissionsService
  ) {}
}
