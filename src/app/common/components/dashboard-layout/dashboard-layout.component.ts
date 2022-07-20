import { Component } from '@angular/core';

/**
 * Layout component for dashboard.
 * Uses content projection to organize a header and body of a dashboard
 * (for example, a header of tabs that switch between chart bodies)
 *
 * See it in analytics
 */
@Component({
  selector: 'm-dashboardLayout',
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent {
  constructor() {}
}
