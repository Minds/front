import { Component } from '@angular/core';
import { Session } from '../../../../../services/session';
import { PermissionsService } from '../../../../../common/services/permissions.service';

/**
 * Network admin console moderation section. Contains sub-tabs
 * for sections involving moderation.
 */
@Component({
  selector: 'm-networkAdminConsole__moderation',
  templateUrl: './moderation.component.html',
  styleUrls: [
    './moderation.component.ng.scss',
    '../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleModerationComponent {
  constructor(
    public session: Session,
    public permissions: PermissionsService
  ) {}
}
