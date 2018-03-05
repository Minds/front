import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { GroupsService } from '../groups-service';

import { RecentService } from '../../../services/ux/recent';
import { MindsTitle } from '../../../services/ux/title';
import { Session } from '../../../services/session';
import { SocketsService } from '../../../services/sockets';

import { GroupsProfileFeed } from './feed/feed';
import { ContextService } from '../../../services/context.service';

@Component({
  moduleId: module.id,
  selector: 'minds-groups-profile',
  templateUrl: 'profile.html'
})

export class GroupsProfile {

  guid;
  filter = 'activity';
  group;
  postMeta: any = {
    message: '',
    container_guid: 0
  };
  editing: boolean = false;
  editDone: boolean = false;
  minds = window.Minds;

  activity: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;
  paramsSubscription: Subscription;

  socketRoomName: string;
  newConversationMessages: boolean = false;

  @ViewChild('feed') private feed: GroupsProfileFeed;

  private reviewCountInterval: any;
  private socketSubscription: any;

  constructor(
    public session: Session,
    public service: GroupsService, 
    public route: ActivatedRoute, 
    public title: MindsTitle, 
    private sockets: SocketsService,
    private context: ContextService,
    private recent: RecentService
  ) { }

  ngOnInit() {
    this.context.set('activity');
    this.listenForNewMessages();

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        let changed = params['guid'] !== this.guid;

        this.guid = params['guid'];
        this.postMeta.container_guid = this.guid;

        if (changed) {
          this.group = void 0;

          this.load()
            .then(() => {
              this.filterToDefaultView();
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

    this.reviewCountInterval = setInterval(() => {
      this.reviewCountLoad();
    }, 120 * 1000);
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.unlistenForNewMessages();
    this.leaveCommentsSocketRoom();

    if (this.reviewCountInterval) {
      clearInterval(this.reviewCountInterval);
    }
  }

  load() {
    return this.service.load(this.guid)
      .then((group) => {
        this.group = group;
        this.joinCommentsSocketRoom();
        this.title.setTitle(this.group.name);
        this.context.set('activity', { label: this.group.name, nameLabel: this.group.name, id: this.group.guid });
        if(this.session.getLoggedInUser()){
          this.addRecent();
        }
      });
  }

  async reviewCountLoad() {
    if (!this.guid) {
      return;
    }

    let count = 0;

    try {
      count = await this.service.getReviewCount(this.guid);
    } catch (e) { }

    this.group['adminqueue:count'] = count;
  }

  addRecent() {
    if (!this.group) {
      return;
    }
    this.recent
      .store('recent', this.group, (entry) => entry.guid == this.group.guid)
      .splice('recent', 50);
  }

  filterToDefaultView() {
    if (!this.group || this.route.snapshot.params.filter) {
      return;
    }

    this.filter = 'activity';

    switch (this.group.default_view) {
      case 1:
        this.filter = 'conversation';
        break;
    }
  }

  save() {
    this.service.save({
      guid: this.group.guid,
      name: this.group.name,
      briefdescription: this.group.briefdescription,
      tags: this.group.tags,
      membership: this.group.membership,
      moderated: this.group.moderated,
      default_view: this.group.default_view
    });

    this.editing = false;
    this.editDone = true;
  }

  toggleEdit() {
    this.editing = !this.editing;

    if (this.editing) {
      this.editDone = false;
    }
  }

  add_banner(file: any) {
    this.service.upload({
      guid: this.group.guid,
      banner_position: file.top
    }, { banner: file.file });

    this.group.banner = true;
  }

  upload_avatar(file: any) {
    this.service.upload({
      guid: this.group.guid
    }, { avatar: file });
  }

  change_membership(membership: any) {
    this.load();
  }

  canDeactivate() {
    if (!this.feed)
      return true;
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
    this.socketSubscription = this.sockets.subscribe('comment', (parent_guid, owner_guid, guid) => {
      if (!this.group || parent_guid !== this.group.guid) {
        return;
      }

      this.group['comments:count']++;

      if (this.filter != 'conversation') {
        this.newConversationMessages = true;
      }
    });
  }

  unlistenForNewMessages() {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }
}
