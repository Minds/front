import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client, Upload } from '../../services/api';
import { Session } from '../../services/session';
import { ActivityService } from '../../common/services/activity.service';

@Component({
  selector: 'minds-admin',
  templateUrl: 'admin.component.html',
  providers: [ActivityService],
})
export class AdminComponent {
  filter: string = '';
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
        this.filter = params['filter'];
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
