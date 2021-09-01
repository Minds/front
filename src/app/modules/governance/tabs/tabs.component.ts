/**
 * Header tabs for discovery feed.
 */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'm-governance__tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.ng.scss'],
})
export class GovernanceTabsComponent {
  constructor(public route: ActivatedRoute, private router: Router) {}

  /**
   * Checks whether passed URL is the active URL
   * Disregards querystring.
   *
   * @param { string } url - url to be checked against
   * @returns { boolean } - true if link matches.
   */
  public isLinkActive(url: string): boolean {
    const currentUrl = this.router.url;
    return url === currentUrl.split('?')[0];
  }

}
