import { Component } from '@angular/core';
import { Session } from '../../../../../services/session';
import { PermissionsService } from '../../../../../common/services/permissions.service';
import { ConfigsService } from '../../../../../common/services/configs.service';

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
  /** Whether boosting is enabled. */
  protected readonly isBoostEnabled: boolean;

  constructor(
    public session: Session,
    public permissions: PermissionsService,
    private configs: ConfigsService
  ) {
    this.isBoostEnabled =
      this.configs.get('tenant')?.['boost_enabled'] ?? false;
  }
}
