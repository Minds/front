import {
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { interval, Subscription } from 'rxjs';

import { GroupsService } from '../groups-service';

import { RecentService } from '../../../services/ux/recent';
import { Session } from '../../../services/session';
import { SocketsService } from '../../../services/sockets';

import { GroupsProfileLegacyFeed } from './feed/legacy';
import { ContextService } from '../../../services/context.service';
import { Client } from '../../../services/api';
import { HashtagsSelectorComponent } from '../../hashtags/selector/selector.component';
import { VideoChatService } from '../../videochat/videochat.service';
import { UpdateMarkersService } from '../../../common/services/update-markers.service';
import { filter, map, startWith, throttle } from 'rxjs/operators';
import { ActivityService } from '../../../common/services/activity.service';
import { MetaService } from '../../../common/services/meta.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { CookieService } from '../../../common/services/cookie.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'm-groups--profile',
  templateUrl: 'profile.html',
  providers: [ActivityService],
})
export class GroupsProfile {
  guid;
  filter = 'activity';
  group;
  postMeta: any = {
    message: '',
    container_guid: 0,
  };
  editing: boolean = false;
  editDone: boolean = false;
  readonly cdnAssetsUrl: string;

  showRight: boolean = true;
  activity: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;
  error: string;
  paramsSubscription: Subscription;
  childParamsSubscription: Subscription;
  queryParamsSubscripton: Subscription;

  socketRoomName: string;
  newConversationMessages: boolean = false;

  @ViewChild('feed', { static: false }) private feed: GroupsProfileLegacyFeed;
  @ViewChild('hashtagsSelector', { static: false })
  hashtagsSelector: HashtagsSelectorComponent;

  private reviewCountInterval: any;
  private socketSubscription: any;
  private videoChatActiveSubscription;
  private updateMarkersSubscription;

  private lastWidth: number;

  constructor(
    public session: Session,
    public service: GroupsService,
    public route: ActivatedRoute,
    private router: Router,
    public metaService: MetaService,
    private sockets: SocketsService,
    private context: ContextService,
    private recent: RecentService,
    private client: Client,
    public videochat: VideoChatService,
    private cd: ChangeDetectorRef,
    private updateMarkers: UpdateMarkersService,
    configs: ConfigsService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.context.set('activity');
    this.listenForNewMessages();
    this.detectWidth(true);
    this.detectConversationsState();

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        let changed = params['guid'] !== this.guid;

        this.guid = params['guid'];
        this.postMeta.container_guid = this.guid;

        if (changed) {
          this.group = void 0;

          this.load().then(async () => {
            this.filterToDefaultView();
            if (
              this.route.snapshot.queryParamMap.has('join') &&
              confirm('Are you sure you want to join this group')
            ) {
              await this.service.join(this.group);
              this.group['is:awaiting'] = true;
              this.detectChanges();
            }
          });
        }
      }

      if (params['filter']) {
        this.filter = params['filter'];

        if (this.filter == 'conversation') {
          this.newConversationMessages = false;
        }
      }
      this.filterToDefaultView();
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const url = this.router.routerState.snapshot.url;

        this.setFilter(url);
      });

    this.setFilter(this.router.routerState.snapshot.url);

    if (isPlatformBrowser(this.platformId))
      this.reviewCountInterval = setInterval(() => {
        this.reviewCountLoad();
      }, 120 * 1000);

    this.videoChatActiveSubscription = this.videochat.activate$.subscribe(
      next => window.scrollTo(0, 0)
    );
  }

  setFilter(url: string) {
    if (url.includes('/feed')) {
      if (url.includes('/image')) {
        this.filter = 'image';
      } else if (url.includes('/video')) {
        this.filter = 'video';
      } else {
        this.filter = 'activity';
      }
    }
  }

  ngOnDestroy() {
    if (this.paramsSubscription) this.paramsSubscription.unsubscribe();
    if (this.childParamsSubscription)
      this.childParamsSubscription.unsubscribe();
    if (this.queryParamsSubscripton) this.queryParamsSubscripton.unsubscribe();

    if (this.videoChatActiveSubscription)
      this.videoChatActiveSubscription.unsubscribe();

    if (this.updateMarkersSubscription)
      this.updateMarkersSubscription.unsubscribe();

    this.unlistenForNewMessages();
    this.leaveCommentsSocketRoom();

    if (this.reviewCountInterval) {
      clearInterval(this.reviewCountInterval);
    }
  }

  async load() {
    if (isPlatformBrowser(this.platformId)) {
      this.resetMarkers();
    }
    this.error = '';
    this.group = null;

    // Load group
    try {
      this.group = await this.service.load(this.guid);
    } catch (e) {
      this.error = e.message;
      return;
    }

    if (this.updateMarkersSubscription)
      this.updateMarkersSubscription.unsubscribe();

    if (isPlatformBrowser(this.platformId)) {
      this.updateMarkersSubscription = this.updateMarkers
        .getByEntityGuid(this.guid)
        .subscribe(
          (marker => {
            // this.updateMarkersSubscription = this.updateMarkers.markers.subscribe(markers => {
            if (!marker) return;

            this.group.hasGathering$ = interval(1000).pipe(
              throttle(() => interval(2000)), //only allow once per 2 seconds
              startWith(0),
              map(
                () =>
                  [marker].filter(
                    marker =>
                      marker.entity_guid == this.group.guid &&
                      marker.marker == 'gathering-heartbeat' &&
                      marker.updated_timestamp > Date.now() / 1000 - 60 //1 minute tollerance
                  ).length > 0
              )
            );

            let hasMarker =
              marker.read_timestamp < marker.updated_timestamp &&
              marker.entity_guid == this.group.guid &&
              marker.marker != 'gathering-heartbeat';

            if (hasMarker) this.resetMarkers();
          }).bind(this)
        );

      // Check for comment updates
      this.joinCommentsSocketRoom();
    }

    this.updateMeta();

    this.context.set('activity', {
      label: this.group.name,
      nameLabel: this.group.name,
      id: this.group.guid,
    });

    if (this.session.getLoggedInUser()) {
      this.addRecent();
    }
  }

  async reviewCountLoad() {
    if (!this.guid || !this.session.isLoggedIn()) {
      return;
    }

    let count = 0;

    try {
      count = await this.service.getReviewCount(this.guid);
    } catch (e) {}

    this.group['adminqueue:count'] = count;
  }

  addRecent() {
    if (!this.group) {
      return;
    }
    this.recent
      .store('recent', this.group, entry => entry.guid == this.group.guid)
      .splice('recent', 50);
  }

  filterToDefaultView() {
    if (
      !this.group ||
      (this.route.snapshot.params.filter &&
        this.route.snapshot.params.filter !== 'gathering')
    ) {
      return;
    }

    if (this.filter === 'gathering') {
      this.videochat.activate(this.group);
    }

    switch (this.group.default_view) {
      case 1:
        this.filter = 'conversation';
        break;
    }
  }

  save() {
    this.group.videoChatDisabled = parseInt(this.group.videoChatDisabled);

    this.service.save(this.group);

    this.editing = false;
    this.editDone = true;
    this.detectChanges();
  }

  toggleEdit() {
    this.editing = !this.editing;

    if (this.editing) {
      this.editDone = false;
    }
  }

  add_banner(file: any) {
    this.service.upload(
      {
        guid: this.group.guid,
        banner_position: file.top,
      },
      { banner: file.file }
    );

    this.group.banner = true;
  }

  upload_avatar(file: any) {
    this.service.upload(
      {
        guid: this.group.guid,
      },
      { avatar: file }
    );
  }

  change_membership(membership: any) {
    if (!membership.error || membership.error === 'already_a_member') {
      this.load();
    } else {
      this.error = membership.error;
    }
  }

  canDeactivate() {
    if (!this.feed) return true;
    return this.feed.canDeactivate();
  }

  joinCommentsSocketRoom(keepAlive: boolean = false) {
    if (!keepAlive && this.socketRoomName) {
      this.leaveCommentsSocketRoom();
    }

    if (!this.group || !this.group.guid || !this.group['is:member']) {
      return;
    }

    // TODO: Only join if a member

    this.socketRoomName = `comments:${this.group.guid}`;
    this.sockets.join(this.socketRoomName);
  }

  leaveCommentsSocketRoom() {
    if (!this.socketRoomName) {
      return;
    }

    this.sockets.leave(this.socketRoomName);
  }

  listenForNewMessages() {
    this.socketSubscription = this.sockets.subscribe(
      'comment',
      (parent_guid, owner_guid, guid) => {
        if (!this.group || parent_guid !== this.group.guid) {
          return;
        }

        this.group['comments:count']++;

        if (this.filter != 'conversation') {
          this.newConversationMessages = true;
        }
      }
    );
  }

  unlistenForNewMessages() {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  async findTrendingHashtags(searchText: string) {
    const response: any = await this.client.get('api/v2/search/suggest/tags', {
      q: searchText,
    });
    return response.tags
      .filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
      .slice(0, 5);
  }

  getChoiceLabel(text: string) {
    return `#${text}`;
  }

  onTagsChange(tags) {}

  onTagsAdded(tags) {
    if (!this.group.tags) this.group.tags = [];

    for (let tag of tags) {
      this.group.tags.push(tag.value);
    }
  }

  onTagsRemoved(tags) {
    for (let tag of tags) {
      for (let i in this.group.tags) {
        console.log(this.group.tags[i]);
        if (this.group.tags[i] == tag.value) {
          this.group.tags.splice(i, 1);
        }
      }
    }
  }

  onOptionsChange(options) {
    this.editing = options.editing;
    if (options.editing === false) this.save();
  }

  @HostListener('window:resize') detectWidth(force: boolean = false) {
    if (force || window.innerWidth !== this.lastWidth) {
      this.showRight = window.innerWidth > 900;
      this.lastWidth = window.innerWidth;
    }
  }

  resetMarkers() {
    this.updateMarkers.markAsRead({
      entity_guid: this.guid,
      entity_type: 'group',
      marker: 'activity',
    });

    this.updateMarkers.markAsRead({
      entity_guid: this.guid,
      entity_type: 'group',
      marker: 'conversation',
    });
  }

  detectConversationsState() {
    const state = this.cookieService.get('groups:conversations:minimized');
    this.showRight = !state || state === 'false'; // it's maximized by default
  }

  toggleConversations() {
    this.showRight = !this.showRight;
    this.cookieService.put(
      'groups:conversations:minimized',
      (!this.showRight).toString()
    );
  }

  private updateMeta(): void {
    this.metaService
      .setTitle(this.group.name)
      .setDescription(this.group.briefdescription)
      .setOgImage(this.group.banner_src);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
