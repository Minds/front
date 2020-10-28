import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import VotersModalService from '../../../modals/voters/service';

import { ActivityEntity, ActivityService } from '../activity.service';

@Component({
  selector: 'm-activity__engagements',
  templateUrl: 'engagements.component.html',
})
export class ActivityEngagementsComponent {
  private entitySubscription: Subscription;

  entity: any;

  constructor(
    public service: ActivityService,
    private votersModalService: VotersModalService
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
      }
    );
  }

  onUpVotesClick() {
    this.votersModalService.open({
      type: 'up',
      guid: this.entity.guid,
      // TODO: translate
      title: 'Up-votes',
    });
  }

  onDownVotesClick() {
    this.votersModalService.open({
      type: 'down',
      guid: this.entity.guid,
      // TODO: translate
      title: 'Down-votes',
    });
  }

  onRemindsClick() {
    // TODO: send to a route showing all reminds
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
  }
}
