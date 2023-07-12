/**
 * Header tabs for discovery feed.
 */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscoveryService } from '../discovery.service';
import { Observable } from 'rxjs';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-discovery__tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.ng.scss'],
})
export class DiscoveryTabsComponent {
  /**
   * If plus or not
   */
  isPlusPage$: Observable<boolean> = this.service.isPlusPage$;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private service: DiscoveryService,
    public session: Session
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
