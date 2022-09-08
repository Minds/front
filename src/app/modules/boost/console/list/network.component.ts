import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoostConsoleType } from '../console.component';

import { BoostService } from '../../boost.service';
import { ActivityV2ExperimentService } from '../../../experiments/sub-services/activity-v2-experiment.service';

/**
 * Boosts made on the Minds network (aka NOT p2p boost offers). Used in the history section of the boost console.
 */
@Component({
  moduleId: module.id,
  providers: [BoostService],
  selector: 'm-boost-console-network',
  templateUrl: 'network.component.html',
})
export class BoostConsoleNetworkListComponent {
  initialized: boolean = false;
  inProgress: boolean = false;

  type: string = '';
  boosts: any[] = [];
  offset = '';
  moreData = true;

  error: string = '';

  private remote: string = '';

  activityV2Feature: boolean = false;

  constructor(
    public service: BoostService,
    private router: Router,
    private route: ActivatedRoute,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {
    this.route.params.subscribe(params => {
      this.remote = params['remote'] || '';
    });
  }

  @Input('type') set _type(type: BoostConsoleType) {
    this.type = type;

    if (this.initialized) {
      this.load(true);
    }
  }

  ngOnInit() {
    this.load(true);
    this.activityV2Feature = this.activityV2Experiment.isActive();
    this.initialized = true;
  }

  load(refresh?: boolean) {
    if ((this.inProgress && !refresh) || !this.type) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.boosts = [];
      this.offset = '';
      this.moreData = true;
    }

    const type: string = this.type === 'offers' ? 'peer' : this.type;

    this.service
      .load(type, '', {
        offset: this.offset,
        remote: this.remote,
      })
      .then(({ boosts, loadNext }) => {
        this.inProgress = false;

        if (!boosts.length) {
          this.moreData = false;
          if (this.boosts.length == 0 && type == 'content') {
            this.router.navigate(['/boost/console/content/create']);
          } else {
            this.router.navigate(['/boost/console/newsfeed/create']);
          }
          return;
        }

        this.boosts.push(...boosts);
        this.offset = loadNext;
        this.moreData = !!loadNext;
      })
      .catch(e => {
        this.inProgress = false;
        this.moreData = false;
        this.error = (e && e.message) || '';
      });
  }
}
