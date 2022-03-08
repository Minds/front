import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Route } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { DiscoveryService } from './discovery.service';
import { Observable, Subscription } from 'rxjs';
import { FeaturesService } from '../../services/features.service';

@Component({
  selector: 'm-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.ng.scss'],
})
export class DiscoveryComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  isPlusPageSubscription: Subscription;
  isPlusPage: boolean = false;

  @HostBinding('class.m-discovery--activityV2')
  get activityV2Feature(): boolean {
    return true; // ojm todo hook this up to feature flag
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: DiscoveryService,
    private featuresService: FeaturesService
  ) {
    /**
     * Determine if on Minds+ page
     */
    this.routerSubscription = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => this.route),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        // filter(route => route.outlet === 'primary')
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        this.service.setRouteData(data);
      });
  }

  ngOnInit() {
    this.isPlusPageSubscription = this.service.isPlusPage$.subscribe(
      isPlusPage => {
        this.isPlusPage = isPlusPage;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
    if (this.isPlusPageSubscription) this.isPlusPageSubscription.unsubscribe();
  }
}
