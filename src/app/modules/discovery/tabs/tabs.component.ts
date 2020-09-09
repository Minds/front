/**
 * Header tabs for discovery feed.
 */
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscoveryService } from '../discovery.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'm-discovery__tabs',
  templateUrl: './tabs.component.html',
})
export class DiscoveryTabsComponent {
  /**
   * Set to true to show settings button.
   */
  @Input() showSettingsButton = true;

  /**
   * If plus or not
   */
  isPlusPage$: Observable<boolean> = this.service.isPlusPage$;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private service: DiscoveryService
  ) {}

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
