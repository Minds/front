import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  EntitiesService,
  EntityObservable,
} from '../../../../common/services/entities.service';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { FastFadeAnimation } from '../../../../animations';
import { DiscoveryService } from '../../discovery.service';
import { PaywallService } from '../../../wire/v2/paywall.service';
import { MetaService } from '../../../../common/services/meta.service';
import { Session } from '../../../../services/session';
import { GuestModeExperimentService } from '../../../experiments/sub-services/guest-mode-experiment.service';
import { RouterHistoryService } from '../../../../common/services/router-history.service';

/**
 * A single activity page that has a back button
 * so users can navigate back to the page of trends
 * whence they came
 */
@Component({
  selector: 'm-discovery__trend',
  templateUrl: './trend.component.html',
  animations: [FastFadeAnimation],
  providers: [PaywallService],
})
export class DiscoveryTrendComponent implements OnInit {
  entity$: Observable<Object> = of(null);
  paramSubscription: Subscription;
  entitySubscription: Subscription;

  constructor(
    private entitiesService: EntitiesService,
    private route: ActivatedRoute,
    private discoveryService: DiscoveryService,
    private paywallService: PaywallService,
    private metaService: MetaService,
    private session: Session,
    private routerHistory: RouterHistoryService,
    private guestModeExperiment: GuestModeExperimentService
  ) {}

  ngOnInit() {
    this.paramSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.loadEntity(params.get('guid'));
      }
    );
    this.entitySubscription = this.entity$.subscribe((entity: any) => {
      if (entity) this.metaService.setCanonicalUrl(`/newsfeed/${entity.guid}`);
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
    this.entitySubscription.unsubscribe();
  }

  loadEntity(guid: string): void {
    if (this.discoveryService.isPlusPage$.getValue() === true) {
      // Auto unlock
      this.entity$ = this.paywallService.unlock(guid).pipe(
        catchError(err => {
          // Fallback to the raw entity if we have an error (eg. not subscribed to plus)
          return this.loadEntityFromEntitiesService(guid);
        })
      );
    } else {
      this.entity$ = this.loadEntityFromEntitiesService(guid);
    }
  }

  loadEntityFromEntitiesService(guid: string): EntityObservable {
    return this.entitiesService.single(`urn:entity:${guid}`);
  }

  /**
   * Returns if "back" link should be to discovery homepage
   * @returns { boolean } true if link should be '/'.
   */
  public shouldBeDiscoveryHomepage(): boolean {
    return (
      this.guestModeExperiment.isActive() && !this.session.getLoggedInUser()
    ); // logged out
  }

  /**
   * Get navigation path for back button press.
   * @returns { string } - navigation path for back button press.
   */
  public getBackNavigationPath(): string {
    if (this.shouldBeDiscoveryHomepage()) {
      return '/';
    }

    let previousUrl = this.routerHistory.getPreviousUrl();
    if (previousUrl) {
      return previousUrl.split('?')[0];
    }

    return '../..';
  }
}
