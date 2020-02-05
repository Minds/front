import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';

@Component({
  selector: 'm-activity__toolbar',
  templateUrl: 'toolbar.component.html',
})
export class ActivityToolbarComponent {
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(public service: ActivityService) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
      }
    );
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
  }
}
