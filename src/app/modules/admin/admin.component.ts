import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Session } from '../../services/session';
import { ActivityService } from '../../common/services/activity.service';

export type Filter =
  | ''
  | 'interactions'
  | 'boosts-v1' // remove this when fully transitioned to dynamic boosts
  | 'boosts'
  | 'firehose'
  | 'reports'
  | 'appeals'
  | 'withdrawals'
  | 'tagcloud'
  | 'verify'
  | 'features'
  | 'push-notifications'
  | 'accounts'
  | 'liquidity-providers'
  | 'hashtags';

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
    public router: Router
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
