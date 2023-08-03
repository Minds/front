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
   *
   * @param { string } url - url to be checked against
   * @param { boolean } paramsIncluded - whether params are included in the url to be tested
   * @returns { boolean } - true if link matches.
   */
  public isLinkActive(url: string, paramsIncluded: boolean = false): boolean {
    const currentUrl = paramsIncluded
      ? this.router.url
      : this.router.url.split('?')[0];

    return url === currentUrl;
  }
}
