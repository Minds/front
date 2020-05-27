import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FeedsService } from '../../../common/services/feeds.service';
import { Session } from '../../../services/session';
import { PosterComponent } from '../../newsfeed/poster/poster.component';
import { SortedService } from './sorted.service';
import { Client } from '../../../services/api';
import { ComposerComponent } from '../../composer/composer.component';

@Component({
  selector: 'm-channel--sorted',
  providers: [SortedService, FeedsService],
  templateUrl: 'sorted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelSortedComponent implements OnInit {
  channel: any;
  @Input('channel') set _channel(channel: any) {
    if (channel === this.channel) {
      return;
    }

    this.channel = channel;

    if (this.initialized) {
      this.load(true);
    }
  }

  type: string = 'activities';
  @Input('type') set _type(type: string) {
    if (type === this.type) {
      return;
    }

    this.type = type;

    if (this.initialized) {
      this.load(true);
    }
  }

  @Output() onChangeType: EventEmitter<string | null> = new EventEmitter();

  entities: any[] = [];
  pinned: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: any = '';

  initialized: boolean = false;

  viewScheduled: boolean = false;

  @ViewChild('poster') protected poster: PosterComponent;

  @ViewChild('composer') private composer: ComposerComponent;

  scheduledCount: number = 0;

  constructor(
    public feedsService: FeedsService,
    protected service: SortedService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    public client: Client
  ) {}

  ngOnInit() {
    this.initialized = true;
    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (!refresh) {
      return;
    }

    if (refresh) {
      this.feedsService.clear();
    }

    this.detectChanges();

    let endpoint = 'api/v2/feeds/container';
    if (this.viewScheduled) {
      endpoint = 'api/v2/feeds/scheduled';
    }

    try {
      const limit = isPlatformBrowser(this.platformId) ? 12 : 2;

      this.feedsService
        .setEndpoint(`${endpoint}/${this.channel.guid}/${this.type}`)
        .setLimit(limit)
        .fetch();

      this.getScheduledCount();
    } catch (e) {
      console.error('ChannelsSortedComponent.load', e);
    }

    this.detectChanges();
  }

  loadNext() {
    if (
      this.feedsService.canFetchMore &&
      !this.feedsService.inProgress.getValue() &&
      this.feedsService.offset.getValue()
    ) {
      this.feedsService.fetch(); // load the next 150 in the background
    }
    this.feedsService.loadMore();
  }

  setFilter(type: string) {
    this.onChangeType.emit(type || null);
  }

  isOwner() {
    return (
      this.session.isLoggedIn() &&
      this.session.getLoggedInUser().guid == this.channel.guid
    );
  }

  isActivityFeed() {
    return this.type === 'activities';
  }

  prepend(activity: any) {
    if (!activity || !this.isActivityFeed()) {
      return;
    }

    if (activity.time_created > Date.now() / 1000) {
      this.scheduledCount += 1;
    }

    this.entities.unshift(activity);

    let feedItem = {
      entity: activity,
      urn: activity.urn,
      guid: activity.guid,
    };

    // Todo: Move to FeedsService
    this.feedsService.rawFeed.next([
      ...[feedItem],
      ...this.feedsService.rawFeed.getValue(),
    ]);

    this.detectChanges();
  }

  protected v1CanDeactivate(): boolean {
    if (!this.poster || !this.poster.attachment) {
      return true;
    }

    const progress = this.poster.attachment.getUploadProgress();

    if (progress > 0 && progress < 100) {
      return confirm('Your file is still uploading. Are you sure?');
    }

    return true;
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.composer) {
      return this.composer.canDeactivate();
    }

    // Check v1 Poster component
    return this.v1CanDeactivate();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  toggleScheduled() {
    this.viewScheduled = !this.viewScheduled;
    this.load(true);
  }

  async getScheduledCount() {
    const url = `api/v2/feeds/scheduled/${this.channel.guid}/count`;
    const response: any = await this.client.get(url);
    this.scheduledCount = response.count;
    this.detectChanges();
  }

  delete(activity: any) {
    this.feedsService.deleteItem(activity, (item, obj) => {
      return item.guid === obj.guid;
    });
  }
}
