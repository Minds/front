import { Component } from '@angular/core';

/**
 * Component for showing the last update timestamp for analytics.
 * Note the value is currently intentionally hardcoded. For future
 * development we should have this value be dynamic and come from
 * the server.
 */
@Component({
  selector: 'm-networkAdminAnalytics__updateTimestamp',
  styleUrls: ['./update-timestamp.component.ng.scss'],
  template: `
    <div class="m-networkAdminAnalytics__updateTimestampMarker"></div>
    <span class="m-networkAdminAnalytics__updateTimestampSpan" i18n
      >Analytics are up to date as of 8:00 AM (UTC)</span
    >
  `,
})
export class NetworkAdminAnalyticsUpdateTimestampComponent {}
