import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MetaService } from '../../../common/services/meta.service';
import { DynamicBoostExperimentService } from '../../experiments/sub-services/dynamic-boost-experiment.service';

export type BoostConsoleType = 'newsfeed' | 'content' | 'offers' | 'publisher';
export type BoostConsoleFilter =
  | 'create'
  | 'history'
  | 'earnings'
  | 'payouts'
  | 'settings'
  | 'inbox'
  | 'outbox';

/**
 * Base component for the boost console
 *
 * NOTE: When the dynamicBoostExperiment is complete, we can remove this component and
 * point the boost module routes to go to BoostConsoleV2Component instead
 */
@Component({
  selector: 'm-boost-console',
  templateUrl: 'console.component.html',
})
export class BoostConsoleComponent implements OnInit, OnDestroy {
  type: BoostConsoleType;
  splitToolbar: boolean = false;
  routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private metaService: MetaService,
    public dynamicBoostExperiment: DynamicBoostExperimentService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.firstChild.url.subscribe(segments => {
      this.type = <BoostConsoleType>segments[0].path;
    });

    this.metaService.setTitle('Boost Console');

    this.detectWidth();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize') detectWidth() {
    this.splitToolbar = window.innerWidth < 480;
  }
}
