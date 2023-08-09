import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GroupsService } from '../../groups.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EventEmitter } from 'stream';

/**
 * Container for <m-group-profile-feed__sorted> component
 */
@Component({
  selector: 'm-group-profile__feed',
  templateUrl: 'feed.component.html',
})
export class GroupProfileFeedComponent implements OnInit, OnDestroy {
  group: any;
  type: string = 'activities';

  subscriptions: Subscription[] = [];
  group$: Subscription;
  param$: Subscription;

  constructor(
    protected service: GroupsService,
    protected route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.service.$group.subscribe(group => {
        this.group = group;
      }),

      this.route.queryParams.subscribe(params => {
        this.type = params['filter'] || 'activities';
      })
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
