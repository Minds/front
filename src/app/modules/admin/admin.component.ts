import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Session } from '../../services/session';
import { ActivityService } from '../../common/services/activity.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { DynamicBoostExperimentService } from '../experiments/sub-services/dynamic-boost-experiment.service';

export type Filter =
  | ''
  | 'interactions'
  | 'boosts'
  | 'firehose'
  | 'reports'
  | 'appeals'
  | 'withdrawals'
  | 'tagcloud'
  | 'verify'
  | 'features'
  | 'push-notifications'
  | 'liquidity-providers';

@Component({
  selector: 'minds-admin',
  templateUrl: 'admin.component.html',
  providers: [ActivityService],
})
export class AdminComponent {
  filter: Filter = '';
  paramsSubscription: Subscription;

  constructor(
    public session: Session,
    private route: ActivatedRoute,
    public router: Router,
    public dynamicBoostExperiment: DynamicBoostExperimentService
  ) {}

  ngOnInit() {
    if (!this.session.isAdmin()) {
      this.router.navigate(['/']);
    }

    this.paramsSubscription = this.route.params.subscribe((params: any) => {
      if (params['filter']) {
        console.log(params['filter']);
        this.filter = params['filter'];
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
