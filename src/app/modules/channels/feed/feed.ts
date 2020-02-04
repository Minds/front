import {
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  SkipSelf,
  ViewChild,
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { Client, Upload } from '../../../services/api';
import { Session } from '../../../services/session';
import { ScrollService } from '../../../services/ux/scroll';

import { MindsActivityObject } from '../../../interfaces/entities';
import { MindsUser } from '../../../interfaces/entities';
import { PosterComponent } from '../../../modules/newsfeed/poster/poster.component';
import { WireChannelComponent } from '../../../modules/wire/channel/channel.component';
import { debounceTime } from 'rxjs/operators';
import { ClientMetaService } from '../../../common/services/client-meta.service';

@Component({
  moduleId: module.id,
  selector: 'm-channel--feed',
  providers: [ClientMetaService],
  templateUrl: 'feed.html',
})
export class ChannelFeedComponent implements OnInit, OnDestroy {
  @Input() user: MindsUser;
  @Input() openWireModal: boolean = false;

  filter: any = 'feed';
  isLocked: boolean = false;
  username: string;
  feed: Array<Object> = [];
  pinned: Array<Object> = [];
  offset: string | number = '';
  moreData: boolean = true;
  inProgress: boolean = false;
  editing: boolean = false;
  error: string = '';

  paramsSubscription: Subscription;

  @ViewChild('poster', { static: false }) private poster: PosterComponent;
  @ViewChild('wire', { static: false }) private wire: WireChannelComponent;

  protected loadFeedObservable: Subject<any> = new Subject();
  protected loadFeedObservableSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    public scroll: ScrollService,
    protected clientMetaService: ClientMetaService,
    @SkipSelf() injector: Injector
  ) {
    this.clientMetaService
      .inherit(injector)
      .setSource('feed/channel')
      .setMedium('feed');
  }

  ngOnInit() {
    this.loadFeedObservableSubscription = this.loadFeedObservable
      .pipe(debounceTime(250))
      .subscribe(() => this.loadFeed(true));

    this.loadFeed(true);
    this.onScroll();
  }

  ngOnDestroy() {
    this.loadFeedObservableSubscription.unsubscribe();
  }

  loadFeed(refresh: boolean = false) {
    if (this.openWireModal) {
      setTimeout(() => {
        this.wire.sendWire();
      });
    }

    if (this.inProgress && !refresh) {
      return false;
    }

    if (refresh) {
      this.feed = [];
      this.offset = '';
    }

    let params: any = {
      limit: 12,
      offset: '',
    };

    if (!this.offset && this.user.pinned_posts.length > 0) {
      params.pinned = this.user.pinned_posts;
    }

    this.inProgress = true;

    params.offset = this.offset;

    this.client
      .get('api/v1/newsfeed/personal/' + this.user.guid, params, {
        cache: true,
      })
      .then((data: MindsActivityObject) => {
        if (!data.activity || !data.activity.length) {
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
      .catch(e => {
        this.inProgress = false;
      });
  }

  isOwner() {
    return this.session.getLoggedInUser().guid === this.user.guid;
  }

  filterPinned(activities) {
    return activities
      .filter(activity => {
        if (this.user.pinned_posts.indexOf(activity.guid) >= 0) {
          activity.pinned = true;
        } else {
          return activity;
        }
      })
      .filter(x => !!x);
  }

  onScroll() {
    var listen = this.scroll.listen(view => {
      if (view.top > 250) this.isLocked = true;
      if (view.top < 250) this.isLocked = false;
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
    if (!this.poster || !this.poster.attachment) return true;
    const progress = this.poster.attachment.getUploadProgress();
    if (progress > 0 && progress < 100) {
      return confirm('Your file is still uploading. Are you sure?');
    }

    return true;
  }
}
