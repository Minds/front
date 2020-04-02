import { Component, ViewChild, SkipSelf, Injector, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client, Upload } from '../../services/api';

import { Session } from '../../services/session';
import { ScrollService } from '../../services/ux/scroll';
import { RecentService } from '../../services/ux/recent';

import { MindsUser } from '../../interfaces/entities';
import { MindsChannelResponse } from '../../interfaces/responses';
import { ContextService } from '../../services/context.service';
import { FeaturesService } from '../../services/features.service';
import { Observable } from 'rxjs';
import { DialogService } from '../../common/services/confirm-leave-dialog.service';
import { BlockListService } from '../../common/services/block-list.service';
import { ChannelSortedComponent } from './sorted/sorted.component';
import { ClientMetaService } from '../../common/services/client-meta.service';
import {
  MetaService,
  MIN_METRIC_FOR_ROBOTS,
} from '../../common/services/meta.service';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-channel',
  templateUrl: 'channel.component.html',
  providers: [ClientMetaService],
})
export class ChannelComponent {
  readonly cdnAssetsUrl: string;
  filter: any = 'feed';
  isLocked: boolean = false;

  username: string;
  @Input() user: MindsUser;
  offset: string = '';
  moreData: boolean = true;
  inProgress: boolean = false;
  editing: boolean = false;
  error: string = '';
  openWireModal: boolean = false;
  changed: boolean = false;
  paramsSubscription: Subscription;

  @ViewChild('feed', { static: false }) private feed: ChannelSortedComponent;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public router: Router,
    public metaService: MetaService,
    public scroll: ScrollService,
    public features: FeaturesService,
    private route: ActivatedRoute,
    private recent: RecentService,
    private context: ContextService,
    private dialogService: DialogService,
    private blockListService: BlockListService,
    private clientMetaService: ClientMetaService,
    private configs: ConfigsService,
    @SkipSelf() injector: Injector
  ) {
    this.clientMetaService
      .inherit(injector)
      .setSource('single')
      .setMedium('single');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.updateMeta();
    if (this.user) {
      this.clientMetaService.recordView(this.user);
    }

    this.context.set('activity');
    this.onScroll();

    this.paramsSubscription = this.route.params.subscribe(params => {
      let feedChanged = false;

      this.changed = false;
      this.editing = false;

      if (params['username']) {
        const username = this.user ? this.user.username : this.username;
        this.changed = username !== params['username'];
        this.username = params['username'];

        feedChanged = true;
      }

      if (params['filter']) {
        if (params['filter'] === 'wire') {
          this.openWireModal = true;
        } else {
          this.filter = params['filter'];
        }
      } else {
        this.filter = 'feed';
      }

      if (params['editToggle']) {
        this.editing = true;
      }

      if (this.changed) {
        this.load();
        console.log('reloading channel...');
      } else if (feedChanged) {
        console.log('reload feed with new settings');
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.updateMeta();
  }

  private updateMeta(): void {
    if (this.user) {
      const url = `/${this.user.username.toLowerCase()}`;
      this.metaService
        .setTitle(`${this.user.name} (@${this.user.username})`)
        .setDescription(
          this.user.briefdescription || `Subscribe to @${this.user.username}`
        )
        .setOgUrl(url)
        .setCanonicalUrl(url)
        .setOgImage(this.user.avatar_url.master, {
          width: 2000,
          height: 1000,
        })
        .setRobots(
          this.user['subscribers_count'] < MIN_METRIC_FOR_ROBOTS
            ? 'noindex'
            : 'all'
        );
      if (this.user.is_mature || this.user.nsfw.length) {
        this.metaService.setNsfw(true);
      }
    } else if (this.username) {
      this.metaService.setTitle(this.username);
    } else {
      this.metaService.setTitle('Channel');
    }
  }

  load() {
    this.error = '';

    this.user = null;
    this.updateMeta();

    this.client
      .get('api/v1/channel/' + this.username, {})
      .then((data: MindsChannelResponse) => {
        if (data.status !== 'success') {
          this.error = data.message;
          return false;
        }
        this.user = data.channel;
        if (
          !(
            this.session.getLoggedInUser() &&
            this.session.getLoggedInUser().guid === this.user.guid
          )
        ) {
          this.editing = false;
        }
        this.updateMeta();

        this.context.set('activity', {
          label: `@${this.user.username} posts`,
          nameLabel: `@${this.user.username}`,
          id: this.user.guid,
        });
        if (this.session.getLoggedInUser()) {
          this.addRecent();
        }

        // this.load() is only called if this.user was not previously set
        this.clientMetaService.recordView(this.user);
      })
      .catch(e => {
        if (e.status === 0) {
          this.error = 'Sorry, there was a timeout error.';
        } else {
          this.error = "Sorry, the channel couldn't be found";
          console.log('couldnt load channel', e);
        }
      });
  }

  isOwner() {
    return this.session.getLoggedInUser().guid === this.user.guid;
  }

  shouldShowFeeds() {
    return (
      ['feed', 'images', 'videos', 'blogs'].indexOf(this.filter.toLowerCase()) >
      -1
    );
  }

  getFeedType() {
    if (this.filter === 'feed') {
      return 'activities';
    }

    return this.filter;
  }

  setFeedType(type: string | null = '') {
    const route = ['/', this.user.username];
    if (type && type !== 'activities') {
      route.push(type);
    }

    this.router.navigate(route);
  }

  toggleEditing() {
    if (this.editing) {
      this.update();
    }
    this.editing = !this.editing;
  }

  onScroll() {
    var listen = this.scroll.listen(view => {
      if (view.top > 250) this.isLocked = true;
      if (view.top < 250) this.isLocked = false;
    });
  }

  updateCarousels(value: any) {
    if (!value.length) return;
    for (var banner of value) {
      var options: any = { top: banner.top };
      if (banner.guid) options.guid = banner.guid;
      this.upload
        .post('api/v1/channel/carousel', [banner.file], options)
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
    if (value.guid) this.client.delete('api/v1/channel/carousel/' + value.guid);
  }

  async update() {
    await this.client.post('api/v1/channel/info', this.user);

    this.editing = false;
  }

  unBlock() {
    this.user.blocked = false;
    this.client
      .delete('api/v1/block/' + this.user.guid, {})
      .then((response: any) => {
        this.user.blocked = false;
        this.blockListService.remove(`${this.user.guid}`);
      })
      .catch(e => {
        this.user.blocked = true;
      });
  }

  addRecent() {
    if (!this.user) {
      return;
    }

    this.recent
      .store('recent', this.user, entry => entry.guid == this.user.guid)
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
    if (this.feed && this.feed.canDeactivate && !this.feed.canDeactivate()) {
      return false;
    }

    return !this.editing || this.dialogService.confirm('Discard changes?');
  }
}

export { ChannelSubscribers } from './subscribers/subscribers';
export { ChannelSubscriptions } from './subscriptions/subscriptions';
