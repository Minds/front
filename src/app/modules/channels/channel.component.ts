import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Session } from '../../services/session';
import { ScrollService } from '../../services/ux/scroll';
import { RecentService } from '../../services/ux/recent';

import { MindsActivityObject } from '../../interfaces/entities';
import { MindsUser } from '../../interfaces/entities';
import { MindsChannelResponse } from '../../interfaces/responses';
import { Poster } from '../../modules/legacy/controllers/newsfeed/poster/poster';
import { WireChannelComponent } from '../../modules/wire/channel/channel.component';
import { ContextService } from '../../services/context.service';

@Component({
  moduleId: module.id,
  selector: 'm-channel',
  templateUrl: 'channel.component.html'
})

export class ChannelComponent {

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

  //@todo make a re-usable city selection module to avoid duplication here
  cities: Array<any> = [];

  searching;

  showOnboarding: boolean = false;
  paramsSubscription: Subscription;

  @ViewChild('poster') private poster: Poster;
  @ViewChild('wire') private wire: WireChannelComponent;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    private route: ActivatedRoute,
    public title: MindsTitle,
    public scroll: ScrollService,
    private recent: RecentService,
    private context: ContextService
  ) { }

  ngOnInit() {
    this.title.setTitle('Channel');
    this.context.set('activity');
    this.onScroll();

    this.paramsSubscription = this.route.params.subscribe((params) => {
      let changed = false;
      this.editing = false;

      if (params['username']) {
        changed = this.username !== params['username'];
        this.username = params['username'];
      }

      if (params['filter']) {
        if (params['filter'] === 'wire') {
          this.openWireModal = true;
        } else {
          this.filter = params['filter'];
        }
      }

      if (params['editToggle']) {
        this.editing = true;
      }

      if (changed) {
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load() {
    this.error = '';

    this.user = null;
    this.title.setTitle(this.username);

    this.client.get('api/v1/channel/' + this.username, {})
      .then((data: MindsChannelResponse) => {
        if (data.status !== 'success') {
          this.error = data.message;
          return false;
        }
        this.user = data.channel;
        if (!(this.session.getLoggedInUser() && this.session.getLoggedInUser().guid === this.user.guid)) {
          this.editing = false;
        }
        this.title.setTitle(this.user.username);

        if (this.openWireModal) {
          setTimeout(() => {
            this.wire.sendWire();
          });
        }

        if (this.filter === 'feed')
          this.loadFeed(true);

        this.context.set('activity', { label: `@${this.user.username} posts`, nameLabel: `@${this.user.username}`, id: this.user.guid });
        if(this.session.getLoggedInUser()){
          this.addRecent();
        }
      })
      .catch((e) => {
        if (e.status === 0) {
          this.error = 'Sorry, there was a timeout error.';
        } else {
          this.error = 'Sorry, the channel couldn\'t be found';
          console.log('couldnt load channel', e);
        }
      });
  }

  loadFeed(refresh: boolean = false) {
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
          for (let activity of data.activity)
            this.feed.push(activity);
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

  toggleEditing() {
    if (this.editing) {
      this.update();
    }
    this.editing = !this.editing;
  }

  onScroll() {
    var listen = this.scroll.listen((view) => {
      if (view.top > 250)
        this.isLocked = true;
      if (view.top < 250)
        this.isLocked = false;
    });
  }

  updateCarousels(value: any) {

    if (!value.length)
      return;
    for (var banner of value) {
      var options: any = { top: banner.top };
      if (banner.guid)
        options.guid = banner.guid;
      this.upload.post('api/v1/channel/carousel', [banner.file], options)
        .then((response: any) => {
          response.index = banner.index;
          if (!this.user.carousels) {
            this.user.carousels = [];
          }
          this.user.carousels[banner.index] = response.carousel;
        });
    }

  }

  removeCarousel(value: any) {
    if (value.guid)
      this.client.delete('api/v1/channel/carousel/' + value.guid);
  }

  async update() {
    try {
      await this.client.post('api/v1/channel/info', this.user);
    } catch (e) {
      alert(e.message);
    }
    this.editing = false;
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

  upload_avatar(file) {
    var self = this;
    this.upload.post('api/v1/channel/avatar', [file], { filekey: 'file' })
      .then((response: any) => {
        self.user.icontime = Date.now();
        window.Minds.user.icontime = Date.now();
      });
  }

  findCity(q: string) {
    if (this.searching) {
      clearTimeout(this.searching);
    }
    this.searching = setTimeout(() => {
      this.client.get('api/v1/geolocation/list', { q: q })
        .then((response: any) => {
          this.cities = response.results;
        });
    }, 100);
  }

  setCity(row: any) {
    this.cities = [];
    if (row.address.city)
      window.Minds.user.city = row.address.city;
    if (row.address.town)
      window.Minds.user.city = row.address.town;
    this.user.city = window.Minds.user.city;
    this.client.post('api/v1/channel/info', {
      coordinates: row.lat + ',' + row.lon,
      city: window.Minds.user.city
    });
  }

  setSocialProfile(value: any) {
    this.user.social_profiles = value;
  }

  unBlock() {
    this.user.blocked = false;
    this.client.delete('api/v1/block/' + this.user.guid, {})
      .then((response: any) => {
        this.user.blocked = false;
      })
      .catch((e) => {
        this.user.blocked = true;
      });
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

  addRecent() {
    if (!this.user) {
      return;
    }

    this.recent
      .store('recent', this.user, (entry) => entry.guid == this.user.guid)
      .splice('recent', 50);
  }
}

export { ChannelSubscribers } from './subscribers/subscribers';
export { ChannelSubscriptions } from './subscriptions/subscriptions';
