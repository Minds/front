import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  SkipSelf, Injector
} from "@angular/core";
import { FeedsService } from "../../../common/services/feeds.service";
import { Session } from "../../../services/session";
import { PosterComponent } from "../../newsfeed/poster/poster.component";
import { SortedService } from "./sorted.service";
import { ClientMetaService } from "../../../common/services/client-meta.service";

@Component({
  selector: 'm-channel--sorted',
  providers: [SortedService, ClientMetaService],
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

  type: string = 'activities'
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

  @ViewChild('poster') protected poster: PosterComponent;

  constructor(
    protected feedsService: FeedsService,
    protected service: SortedService,
    protected session: Session,
    protected clientMetaService: ClientMetaService,
    @SkipSelf() injector: Injector,
    protected cd: ChangeDetectorRef,
  ) {
    this.clientMetaService
      .inherit(injector)
      .setSource('feed/channel')
      .setMedium('feed');
  }

  ngOnInit() {
    this.initialized = true;
    this.load(true);
  }

  getAllEntities() {
    const pinned = this.channel.pinned_posts || [];

    return [
      ...this.pinned,
      ...this.entities.filter(entity => pinned.indexOf(entity.guid) === -1),
    ];
  }

  async load(refresh: boolean = false) {
    if (!refresh && this.inProgress) {
      return;
    }

    if (refresh) {
      this.entities = [];
      this.moreData = true;
      this.offset = '';
    }

    this.inProgress = true;

    this.detectChanges();

    if (!this.offset) {
      // Load Pinned posts in parallel
      this.loadPinned();
    }

    try {
      const limit = 12;

      const { entities, next } = await this.feedsService.get({
        endpoint: `api/v2/feeds/container/${this.channel.guid}/${this.type}`,
        timebased: true,
        limit,
        offset: this.offset,
        syncPageSize: limit * 20,
      });

      if (!entities || !entities.length) {
        this.moreData = false;
        this.inProgress = false;
        this.detectChanges();

        return false;
      }

      if (this.entities && !refresh) {
        this.entities.push(...entities);
      } else {
        this.entities = entities;
      }

      if (!next) {
        this.moreData = false;
      }

      this.offset = next;
    } catch (e) {
      console.error('ChannelsSortedComponent.load', e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  async loadPinned() {
    this.pinned = [];

    if (!this.isActivityFeed()) {
      this.detectChanges();
      return;
    }

    try {
      this.pinned = (await this.service.getPinnedPosts(this.channel)) || [];
    } catch (e) {
      console.error('ChannelsSortedComponent.loadPinned', e);
    }

    this.detectChanges();
  }

  setFilter(type: string) {
    this.onChangeType.emit(type || null);
  }

  isOwner() {
    return this.session.isLoggedIn() &&
      this.session.getLoggedInUser().guid == this.channel.guid;
  }

  isActivityFeed() {
    return this.type === 'activities';
  }

  prepend(activity: any) {
    if (!activity || !this.isActivityFeed()) {
      return;
    }

    this.entities.unshift(activity);
    this.detectChanges();
  }

  canDeactivate() {
    if (!this.poster || !this.poster.attachment) {
      return true;
    }

    const progress = this.poster.attachment.getUploadProgress();

    if (progress > 0 && progress < 100) {
      return confirm('Your file is still uploading. Are you sure?');
    }

    return true;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
