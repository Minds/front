/**
 * Header tabs for discovery feed.
 */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscoveryService } from '../discovery.service';
import { Observable } from 'rxjs';
import { SupermindGlobalFeedExperimentService } from '../../experiments/sub-services/supermind-global-feed-experiment.service';

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
    private supermindGlobalFeedExperimentService: SupermindGlobalFeedExperimentService
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

  public isSupermindFeedAvailable(): boolean {
    return this.supermindGlobalFeedExperimentService.isActive();
  }
}
