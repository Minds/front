import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../../services/api';
import { MindsActivityObject } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { ContextService } from '../../../services/context.service';

@Component({
  selector: 'm-newsfeed--single',
  templateUrl: 'single.component.html'
})

export class NewsfeedSingleComponent {

  minds;
  inProgress: boolean = false;
  activity: any;
  error: string = '';
  paramsSubscription: Subscription;

  constructor(
    public client: Client,
    public upload: Upload,
    public router: Router,
    public route: ActivatedRoute,
    public context: ContextService,
    public session: Session
  ) {
  }

  ngOnInit() {
    this.context.set('activity');

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.activity = void 0;
        this.load(params['guid']);
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

	/**
	 * Load newsfeed
	 */
  load(guid: string) {
    this.context.set('activity');

    this.client.get('api/v1/newsfeed/single/' + guid, {}, { cache: true })
      .then((data: any) => {

        this.activity = data.activity;

        switch (this.activity.subtype) {
          case 'image':
          case 'video':
          case 'album':
            this.router.navigate(['/media', this.activity.guid], { replaceUrl: true });
            break;
          case 'blog':
            this.router.navigate(['/blog/view', this.activity.guid], { replaceUrl: true });
            break;
        }

        if (this.activity.ownerObj) {
          this.context.set('activity', {
            label: `@${this.activity.ownerObj.username} posts`,
            nameLabel: `@${this.activity.ownerObj.username}`,
            id: this.activity.ownerObj.guid
          });
        } else if (this.activity.owner_guid) {
          this.context.set('activity', {
            label: `this user's posts`,
            id: this.activity.owner_guid
          });
        } else {
          this.context.reset();
        }
      })
      .catch(e => {
        if (e.status === 0) {
          this.error = 'Sorry, there was a timeout error.';
        } else {
          this.error = 'Sorry, we couldn\'t load the activity';
        }
        this.inProgress = false;
      });
  }

  delete(activity) {
    this.router.navigate(['/newsfeed']);
  }
}
