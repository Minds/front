import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Session } from '../../services/session';
import { ScrollService } from '../../services/ux/scroll';
import { RecentService } from '../../services/ux/recent';

import { MindsUser } from '../../interfaces/entities';
import { MindsChannelResponse } from '../../interfaces/responses';
import { ChannelFeedComponent } from './feed/feed'
import { ContextService } from '../../services/context.service';
import { FeaturesService } from "../../services/features.service";
import { PosterComponent } from '../newsfeed/poster/poster.component';
import { Observable } from 'rxjs';
import { DialogService } from  '../../common/services/confirm-leave-dialog.service'
import { BlockListService } from "../../common/services/block-list.service";

@Component({
  moduleId: module.id,
  selector: 'm-channel',
  templateUrl: 'channel.component.html'
})

export class ChannelComponent {

  minds = window.Minds;
  filter: any = 'feed';
  isLocked: boolean = false;

  username: string;
  user: MindsUser;
  offset: string = '';
  moreData: boolean = true;
  inProgress: boolean = false;
  editing: boolean = false;
  error: string = '';
  openWireModal: boolean = false;
  changed: boolean = false;
  paramsSubscription: Subscription;

  isLegacySorting: boolean = false;
  isSorting: boolean = false;
  algorithm: string;
  period: string;
  customType: string;

  @ViewChild('feed') private feed: ChannelFeedComponent;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public router: Router,
    public title: MindsTitle,
    public scroll: ScrollService,
    public features: FeaturesService,
    private route: ActivatedRoute,
    private recent: RecentService,
    private context: ContextService,
    private dialogService: DialogService,
    private blockListService: BlockListService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Channel');
    this.context.set('activity');
    this.onScroll();

    this.isLegacySorting = !this.features.has('top-feeds');

    this.paramsSubscription = this.route.params.subscribe(params => {
      let feedChanged = false;

      this.changed = false;
      this.editing = false;

      if (params['username']) {
        this.changed = this.username !== params['username'];
        this.username = params['username'];

        feedChanged = true;
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

      this.isSorting = Boolean(params['algorithm']);

      if (this.isSorting) {
        feedChanged = this.changed ||
          this.algorithm !== params['algorithm'] ||
          this.period !== params['period'] ||
          this.customType !== (params['type'] || 'activities');

        this.filter = 'feed';
        this.algorithm = params['algorithm'] || 'top';
        this.period = params['period'] || '7d';
        this.customType = params['type'] || 'activities';
      } else {
        if (!this.algorithm) {
          this.algorithm = 'latest';
        }

        if (!this.period) {
          this.period = '7d';
        }

        if (!this.customType) {
          this.customType = 'activities';
        }
      }

      if (this.changed) {
        this.load();
      } else if (feedChanged) {
        console.log('reload feed with new settings')
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

        this.context.set('activity', { label: `@${this.user.username} posts`, nameLabel: `@${this.user.username}`, id: this.user.guid });
        if (this.session.getLoggedInUser()) {
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

  isOwner() {
    return this.session.getLoggedInUser().guid === this.user.guid;
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
    await this.client.post('api/v1/channel/info', this.user);
   
    this.editing = false;
  }

  unBlock() {
    this.user.blocked = false;
    this.client.delete('api/v1/block/' + this.user.guid, {})
      .then((response: any) => {
        this.user.blocked = false;
        this.blockListService.remove(`${this.user.guid}`);
      })
      .catch((e) => {
        this.user.blocked = true;
      });
  }

  addRecent() {
    if (!this.user) {
      return;
    }

    this.recent
      .store('recent', this.user, (entry) => entry.guid == this.user.guid)
      .splice('recent', 50);
  }

  /**
    * canDeactivate() 
    * Determines whether a page can be deactivated.
    * In this instance, a confirmation is needed  from the user 
    * when requesting a new page if editing === true
    *   
    * @returns { Observable<boolean> | boolean }    
    */
  canDeactivate(): Observable<boolean> | boolean {
    if (!this.editing) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  setSort(algorithm: string, period: string | null, customType: string | null) {
    if (algorithm === 'latest') {
      // Cassandra listing.
      // TODO: Remove when ElasticSearch is fully implemented
      this.algorithm = algorithm;
      this.period = null;
      this.customType = null;

      this.router.navigate(['/', this.username]);
      return;
    }

    this.algorithm = algorithm;
    this.period = period;
    this.customType = customType;

    let route: any[] = [ '/', this.username, 'sort', algorithm ];
    const params: any = {};

    if (period) {
      params.period = period;
    }

    if (customType && customType !== 'activities') {
      params.type = customType;
    }

    route.push(params);
    this.router.navigate(route);
  }

}

export { ChannelSubscribers } from './subscribers/subscribers';
export { ChannelSubscriptions } from './subscriptions/subscriptions';
