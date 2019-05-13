import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild
} from "@angular/core";
import { Router } from "@angular/router";
import { PosterComponent } from "../../../newsfeed/poster/poster.component";
import { FeedsService } from "../../../../common/services/feeds.service";
import { Session } from "../../../../services/session";
import { SortedService } from "./sorted.service";
import { Client } from "../../../../services/api/client";
import { GroupsService } from "../../groups-service";

@Component({
  selector: 'm-group-profile-feed__sorted',
  providers: [SortedService],
  templateUrl: 'sorted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupProfileFeedSortedComponent {
  group: any;
  @Input('group') set _group(group: any) {
    if (group === this.group) {
      return;
    }

    this.group = group;

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

  entities: any[] = [];
  pinned: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: any = '';

  initialized: boolean = false;

  kicking: any;

  @ViewChild('poster') protected poster: PosterComponent;

  constructor(
    protected service: GroupsService,
    protected feedsService: FeedsService,
    protected sortedService: SortedService,
    protected session: Session,
    protected router: Router,
    protected client: Client,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.initialized = true;
    this.load(true);
  }

  getAllEntities() {
    const pinned = this.group.pinned_posts || [];

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
        endpoint: `api/v2/feeds/container/${this.group.guid}/${this.type}`,
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
      console.error('GroupProfileFeedSortedComponent.loadFeed', e);
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
      this.pinned = (await this.sortedService.getPinnedPosts(this.group)) || [];
    } catch (e) {
      console.error('ChannelsSortedComponent.loadPinned', e);
    }

    this.detectChanges();
  }

  setFilter(type: string) {
    const route = ['/groups/profile', this.group.guid, 'feed'];

    if (type !== 'activities') {
      route.push(type);
    }

    this.router.navigate(route);
  }

  isMember() {
    return this.session.isLoggedIn() &&
      this.group['is:member'];
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

  delete(activity) {
    let i: any;

    for (i in this.entities) {
      if (this.entities[i] === activity) {
        this.entities.splice(i, 1);
        break;
      }
    }

    for (i in this.pinned) {
      if (this.pinned[i] === activity) {
        this.pinned.splice(i, 1);
        break;
      }
    }
  }

  //

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

  kick(user: any) {
    this.kicking = user;
  }

  //

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
