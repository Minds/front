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
    private service: DiscoveryService,
    public session: Session
  ) {}
}
