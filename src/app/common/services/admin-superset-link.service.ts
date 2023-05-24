import { Injectable } from '@angular/core';

/**
 * Central service for external links to Superset.
 */
@Injectable({ providedIn: 'root' })
export class AdminSupersetLinkService {
  /**
   * Get URL for user overview.
   * @param { string } guid - user guid.
   * @returns { string } URL pointing to Superset user overview page.
   */
  public getUserOverviewUrl(guid: string): string {
    return `https://superset.minds.com/superset/dashboard/AUserOverview/?preselect_filters={%2232%22:{%22USER_GUID%22:%22${guid}%22}}`;
  }
}
