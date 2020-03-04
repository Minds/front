import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-activity__toolbar',
  templateUrl: 'toolbar.component.html',
})
export class ActivityToolbarComponent {
  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(public service: ActivityService, public session: Session) {}

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

  toggleComments(): void {
    this.service.displayOptions.showComments = !this.service.displayOptions
      .showComments;
    this.service.displayOptions.showOnlyCommentsInput = false;
  }
}
