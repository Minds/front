import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { ScrollService } from '../../../services/ux/scroll';

import { MindsActivityObject } from '../../../interfaces/entities';
import { MindsUser } from '../../../interfaces/entities';
import { MindsChannelResponse } from '../../../interfaces/responses';
import { PosterComponent } from '../../../modules/newsfeed/poster/poster.component';
import { WireChannelComponent } from '../../../modules/wire/channel/channel.component';

@Component({
  moduleId: module.id,
  selector: 'm-channel--feed',
  inputs: ['user', 'openWireModal'],
  templateUrl: 'feed.html'
})

export class ChannelFeedComponent {

  minds = window.Minds;
  filter: any = 'feed';
  isLocked: boolean = false;

  username: string;
  user: MindsUser;
  feed: Array<Object> = [];
  pinned: Array<Object> = [];
  offset: string = '';
  moreData: boolean = true;
  inProgress: boolean = false;
  editing: boolean = false;
  error: string = '';
  openWireModal: boolean = false;

  showOnboarding: boolean = false;
  paramsSubscription: Subscription;

  @ViewChild('poster') private poster: PosterComponent;
  @ViewChild('wire') private wire: WireChannelComponent;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public scroll: ScrollService,
  ) { }

  ngOnInit() {
    this.loadFeed(true);
    this.onScroll();
  }

  loadFeed(refresh: boolean = false) {

    if (this.openWireModal) {
      setTimeout(() => {
        this.wire.sendWire();
      });
    }

    if (this.inProgress) {
      return false;
    }

    if (refresh) {
      this.feed = [];
      this.offset = '';
    }

    let params: any = {
      limit: 12,
      offset: ''
    }

    if(!this.offset && this.user.pinned_posts.length > 0){
      params.pinned = this.user.pinned_posts;
    }

    this.inProgress = true;

    params.offset = this.offset;
    
    this.client.get('api/v1/newsfeed/personal/' + this.user.guid, params, { cache: true })
      .then((data: MindsActivityObject) => {
        if (!data.activity) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }
        if (this.feed && !refresh) {
          for (let activity of data.activity) {
            this.feed.push(activity);
          }
        } else {
          this.feed = this.filterPinned(data.activity);
          this.pinned = data.pinned;
        }
        this.offset = data['load-next'];
        this.inProgress = false;
      })
      .catch(function (e) {
        this.inProgress = false;
      });
  }

  isOwner() {
    return this.session.getLoggedInUser().guid === this.user.guid;
  }

  filterPinned(activities){
    return activities.filter( (activity) => {
      if (this.user.pinned_posts.indexOf(activity.guid) >= 0) {
        activity.pinned = true;
      } else {
        return activity;
      }
    }).filter(x=>!!x);
  }

  onScroll() {
    var listen = this.scroll.listen((view) => {
      if (view.top > 250)
        this.isLocked = true;
      if (view.top < 250)
        this.isLocked = false;
    });
  }

  delete(activity) {
    let i: any;
    for (i in this.feed) {
      if (this.feed[i] === activity) {
        this.feed.splice(i, 1);
        break;
      }
    }
  }

  prepend(activity: any) {
    activity.boostToggle = true;
    this.feed.unshift(activity);
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
}
