import { Component, ViewChild } from '@angular/core';

import { GroupsService } from '../../groups-service';

import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { PosterComponent } from '../../../newsfeed/poster/poster.component';
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

interface MindsGroupResponse {
  group: MindsGroup;
}
interface MindsGroup {
  guid: string;
  name: string;
  banner: boolean;
  members: Array<any>;
}

@Component({
  moduleId: module.id,
  selector: 'minds-groups-profile-feed',
  templateUrl: 'feed.html'
})

export class GroupsProfileFeed {

  guid;
  group: any;
  $group;

  filter: 'activity' | 'review' | 'image' | 'video' = 'activity';

  activity: Array<any> = [];
  pinned: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;

  pollingTimer: any;
  pollingOffset: string = '';
  pollingNewPosts: number = 0;

  kickPrompt: boolean = false;
  kickBan: boolean = false;
  kickSuccess: boolean = false;
  kickUser: any;
  paramsSubscription: Subscription;

  @ViewChild('poster') private poster: PosterComponent;

  constructor(public session: Session, public client: Client, public service: GroupsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.$group = this.service.$group.subscribe((group) => {
      this.group = group;
      if (this.group)
        this.guid = group.guid;
    });

    this.paramsSubscription = this.route.params.subscribe(params => {
      this.filter = params['filter'] ? params['filter'] : 'activity';

      this.load(true);
      this.setUpPoll();
    });
  }

  setUpPoll() {
    this.pollingTimer = setInterval(() => {
      this.client.get('api/v1/newsfeed/container/' + this.guid, { offset: this.pollingOffset, count: true }, { cache: true })
        .then((response: any) => {
          if (typeof response.count === 'undefined') {
            return;
          }

          this.pollingNewPosts = response.count;
          this.pollingOffset = response['load-previous'];
        })
        .catch(e => { console.error('Newsfeed polling', e); });
    }, 60000);
  }

  pollingLoadNew() {
    this.load(true);
  }

  ngOnDestroy() {
    this.$group.unsubscribe();
    clearInterval(this.pollingTimer);
    this.paramsSubscription.unsubscribe();
  }

  prepend(activity: any) {
    this.activity.unshift(activity);
    this.pollingOffset = activity.guid;
  }

  loadActivities(refresh: boolean = false) {
    this.inProgress = true;

    let endpoint = `api/v1/newsfeed/container/${this.guid}`;

    if (this.filter == 'review') {
      endpoint = `api/v1/groups/review/${this.guid}`;
    }

    const currentFilter = this.filter;

    let opts:any = {
      limit: 12,
      offset: this.offset,
    };

    if (!this.offset && this.group && this.group.pinned_posts && this.group.pinned_posts.length > 0){
      opts.pinned = this.group.pinned_posts;
    }

    this.client.get(endpoint, opts)
      .then((response: any) => {
        if (this.filter !== currentFilter) {
          return; // Prevents race condition
        }

        this.inProgress = false;

        if (refresh) {
          this.activity = [];
        }

        if (typeof response['adminqueue:count'] !== 'undefined') {
          this.group['adminqueue:count'] = response['adminqueue:count'];
        }

        if (!response.activity) {
          this.moreData = false;
          return false;
        }

        this.pinned = response.pinned;

        response.activity = response.activity
          .map(entity => { 
            if (this.group.pinned_posts && this.group.pinned_posts.indexOf(entity.guid) >= 0) {
              entity.pinned = true;
            }
            if (!(this.group['is:moderator'] || this.group['is:owner'])) {
              entity.dontPin = true;
            }
            return entity;
          })
          .filter(entity => !entity.pinned);
        
        this.activity.push(...(response.activity || []));

        if (typeof this.activity[0] !== 'undefined') {
          this.pollingOffset = response.activity[0].guid;
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }
      });
  }

  loadMedia(refresh: boolean = false) {
    this.inProgress = true;
    let endpoint = `api/v1/entities/container/${this.filter}/${this.guid}`;

    const currentFilter = this.filter;

    this.client.get(endpoint, { limit: 12, offset: this.offset })
      .then((response: any) => {
        if (this.filter !== currentFilter) {
          return; // Prevents race condition
        }

        this.inProgress = false;

        if (refresh) {
          this.activity = [];
        }

        if (typeof response['adminqueue:count'] !== 'undefined') {
          this.group['adminqueue:count'] = response['adminqueue:count'];
        }

        if (!response.entities || response.entities.length === 0) {
          this.moreData = false;
          return false;
        }

        for(let entity of response.entities) {
          let fakeActivity = {
            custom_type: this.filter === 'image' ? 'batch' : 'video',
            custom_data: this.filter === 'image' ? [{src: entity.thumbnail_src}]: entity,
            guid: entity.guid,
            entity_guid: entity.guid,
            ownerObj: entity.ownerObj,
            owner_guid: entity.owner_guid,
            time_created: entity.time_created,
            time_updated: entity.time_updated,
            container_guid: entity.container_guid,
            containerObj: entity.containerObj,
            access_id: entity.access_id,
            'thumbs:up:count': entity['thumbs:up:count'],
            'thumbs:up:user_guids': entity['thumbs:up:user_guids'],
            'thumbs:down:count': entity['thumbs:down:count'],
            'thumbs:down:user_guids': entity['thumbs:down:user_guids'],
            wire_totals: entity.wire_totals,
            title: entity.title,
            message: entity.message,
          };
          this.activity.push(fakeActivity);
        };

        if (typeof this.activity[0] !== 'undefined') {
          this.pollingOffset = response.entities[0].guid;
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }
      });
  }

  /**
   * Load a groups newsfeed
   */
  load(refresh: boolean = false) {

    if (!this.group)
      return;

    if (this.inProgress && !refresh) {
      return false;
    }

    if (refresh) {
      this.offset = '';
      this.pollingOffset = '';
      this.pollingNewPosts = 0;
      this.activity = [];
    }

    switch(this.filter) {
      case 'activity':
      case 'review':
        return this.loadActivities(refresh);
      case 'image':
      case 'video':
        return this.loadMedia(refresh);
    }
  }

  delete(activity) {
    let i: any;
    for (i in this.activity) {
      if (this.activity[i] === activity) {
        this.activity.splice(i, 1);
        break;
      }
    }
  }

  canDeactivate() {
    if (!this.poster || !this.poster.attachment)
      return true;
    const progress = this.poster.attachment.getUploadProgress();
    if (progress > 0 && progress < 100) {
      return confirm('Your file is still uploading. Are you sure?');
    }
    return true;
  }

  // admin queue

  async approve(activity, index: number) {
    if (!activity) {
      return;
    }

    this.activity.splice(index, 1);

    try {
      await this.client.put(`api/v1/groups/review/${this.group.guid}/${activity.guid}`);

      this.group['adminqueue:count'] = this.group['adminqueue:count'] - 1;
    } catch (e) {
      alert((e && e.message) || 'Internal server error');
    }
  }

  async reject(activity, index: number) {
    if (!activity) {
      return;
    }

    this.activity.splice(index, 1);

    try {
      await this.client.delete(`api/v1/groups/review/${this.group.guid}/${activity.guid}`);

      this.group['adminqueue:count'] = this.group['adminqueue:count'] - 1;
    } catch (e) {
      alert((e && e.message) || 'Internal server error');
    }
  }

  // kick & ban

  removePrompt(user: any) {
    if (!user) {
      console.error(user);
      return;
    }

    this.kickSuccess = false;
    this.kickPrompt = true;
    this.kickBan = false;
    this.kickUser = user;
  }

  cancelRemove() {
    this.kickSuccess = false;
    this.kickPrompt = false;
    this.kickBan = false;
    this.kickUser = void 0;
  }

  kick(ban: boolean = false) {
    if (!this.kickUser) {
      return;
    }

    let action;

    this.kickPrompt = false;

    if (ban) {
      action = this.service.ban(this.group, this.kickUser.guid);
    } else {
      action = this.service.kick(this.group, this.kickUser.guid);
    }

    this.kickUser = void 0;

    action.then(() => {
      this.kickPrompt = false;
      this.kickBan = false;
      this.kickSuccess = true;
    });
  }

}
