import { Component, Input, ViewChild } from '@angular/core';

import { GroupsService } from '../../groups-service';

import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { Poster } from '../../../legacy/controllers/newsfeed/poster/poster';

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

  filter: 'activity' | 'review' = 'activity';

  activity: Array<any> = [];
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

  @ViewChild('poster') private poster: Poster;

  constructor(public session: Session, public client: Client, public service: GroupsService) { }

  @Input('group') set _group(value: any) {
    this.group = value;
    this.guid = value.guid;
    this.load(true);
    this.setUpPoll();
  }

  @Input('filter') set _filter(value: 'activity' | 'review') {
    const oldFilter = this.filter;
    this.filter = value;

    if (this.group && oldFilter != this.filter) {
      this.load(true);
    }
  }

  setUpPoll() {
    this.pollingTimer = setInterval(() => {
      this.client.get('api/v1/newsfeed/container/' + this.guid, { offset: this.pollingOffset, count: true }, { cache: true })
        .then((response: any) => {
          if (typeof response.count === 'undefined') {
            return;
          }

          this.pollingNewPosts += response.count;
          this.pollingOffset = response['load-previous'];
        })
        .catch(e => { console.error('Newsfeed polling', e); });
    }, 60000);
  }

  pollingLoadNew() {
    this.load(true);
  }

  ngOnDestroy() {
    clearInterval(this.pollingTimer);
  }

  prepend(activity: any) {
    this.activity.unshift(activity);
    this.pollingOffset = activity.guid;
  }

  /**
   * Load a groups newsfeed
   */
  load(refresh: boolean = false) {
    if (this.inProgress && !refresh) {
      return false;
    }

    this.inProgress = true;

    if (refresh) {
      this.offset = '';
      this.pollingOffset = '';
      this.pollingNewPosts = 0;
      this.activity = [];
    }

    let endpoint = `api/v1/newsfeed/container/${this.guid}`;

    if (this.filter == 'review') {
      endpoint = `api/v1/groups/review/${this.guid}`;
    }

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

        if (!response.activity) {
          this.moreData = false;
          return false;
        }

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
