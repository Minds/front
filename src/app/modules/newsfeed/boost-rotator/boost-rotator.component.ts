import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  QueryList,
  SkipSelf,
  ViewChildren,
} from '@angular/core';
import { first } from 'rxjs/operators';

import { ScrollService } from '../../../services/ux/scroll';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { MindsUser } from '../../../interfaces/entities';
import { Activity } from '../../../modules/legacy/components/cards/activity/activity';
import { NewsfeedService } from '../services/newsfeed.service';
import { NewsfeedBoostService } from '../newsfeed-boost.service';
import { SettingsService } from '../../settings/settings.service';
import { FeaturesService } from '../../../services/features.service';
import { BoostedContentService } from '../../../common/services/boosted-content.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';

@Component({
  moduleId: module.id,
  selector: 'm-newsfeed--boost-rotator',
  host: {
    '(window:blur)': 'inActive()',
    '(window:focus)': 'active()',
    '(mouseover)': 'mouseOver()',
    '(mouseout)': 'mouseOut()',
  },
  inputs: ['interval', 'channel'],
  providers: [ClientMetaService, FeedsService],
  templateUrl: 'boost-rotator.component.html',
})
export class NewsfeedBoostRotatorComponent {
  boosts: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;
  rotator;
  running: boolean = false;
  paused: boolean = false;
  windowFocused: boolean = true;
  interval: number = 6;
  channel: MindsUser;
  currentPosition: number = 0;
  lastTs: number = Date.now();
  minds;
  scroll_listener;

  rating: number = 2; //default to Safe Mode Off
  ratingMenuToggle: boolean = false;
  plus: boolean = false;
  disabled: boolean = false;

  subscriptions: Array<any>;

  @ViewChildren('activities') activities: QueryList<Activity>;

  constructor(
    public session: Session,
    public router: Router,
    public client: Client,
    public scroll: ScrollService,
    public newsfeedService: NewsfeedService,
    public settingsService: SettingsService,
    private storage: Storage,
    public element: ElementRef,
    public service: NewsfeedBoostService,
    private cd: ChangeDetectorRef,
    protected featuresService: FeaturesService,
    public feedsService: FeedsService,
    protected clientMetaService: ClientMetaService,
    @SkipSelf() injector: Injector
  ) {
    this.subscriptions = [
      this.settingsService.ratingChanged.subscribe(event =>
        this.onRatingChanged(event)
      ),
      this.service.enableChanged.subscribe(event =>
        this.onEnableChanged(event)
      ),
      this.service.pauseChanged.subscribe(event => this.onPauseChanged(event)),
      this.service.explicitChanged.subscribe(event =>
        this.onExplicitChanged(event)
      ),
    ];

    this.clientMetaService.inherit(injector).setMedium('boost-rotator');
  }

  ngOnInit() {
    this.rating = this.session.getLoggedInUser().boost_rating;
    this.plus = this.session.getLoggedInUser().plus;
    this.disabled = !this.service.isBoostEnabled();
    this.load();
    this.scroll_listener = this.scroll
      .listenForView()
      .subscribe(() => this.isVisible());

    this.paused = this.service.isBoostPaused();

    this.feedsService.feed.subscribe(async boosts => {
      if (!boosts.length) return;
      this.boosts = [];
      for (const boost of boosts) {
        if (boost) this.boosts.push(await boost.pipe(first()).toPromise());
      }
      if (this.currentPosition >= this.boosts.length) {
        this.currentPosition = 0;
      }
      // if (this.currentPosition === 0) {
      //   this.recordImpression(this.currentPosition, true);
      // }
    });
  }

  load() {
    try {
      this.feedsService.clear(); // Fresh each time
      this.feedsService
        .setEndpoint('api/v2/boost/feed')
        .setParams({
          rating: this.rating,
          rotator: 1,
        })
        .setLimit(12)
        .setOffset(0)
        .fetch();
    } catch (e) {
      if (e && e.message) {
        console.warn(e);
      }

      throw e;
    }

    this.inProgress = false;
    return true;
  }

  onExplicitChanged(value: boolean) {
    this.load();
  }

  onPauseChanged(value: boolean) {
    console.warn('on pause changed');
    this.paused = value;
  }

  onRatingChanged(rating) {
    this.rating = rating;
    this.boosts = [];

    this.load();
  }

  ratingMenuHandler() {
    this.ratingMenuToggle = !this.ratingMenuToggle;
  }

  start() {
    if (this.rotator) window.clearInterval(this.rotator);

    this.running = true;
    this.rotator = setInterval(e => {
      if (!this.windowFocused) {
        return;
      }
      if (this.paused) {
        return;
      }

      this.next();
      //this.recordImpression(this.currentPosition);
    }, this.interval * 1000);
  }

  isVisible() {
    const bounds = this.element.nativeElement.getBoundingClientRect();
    if (bounds.top > 0) {
      //console.log('[rotator]: in view', this.rotator);
      if (!this.running) this.start();
    } else {
      console.log('[rotator]: out of view', this.rotator);
      if (this.running) {
        this.running = false;
        window.clearInterval(this.rotator);
      }
    }
  }

  recordImpression(position: number, force: boolean) {
    //ensure was seen for at least 1 second
    if (
      (Date.now() > this.lastTs + 1000 || force) &&
      this.boosts[position] &&
      this.boosts[position].boosted_guid
    ) {
      this.newsfeedService.recordView(
        this.boosts[position],
        true,
        this.channel,
        this.clientMetaService.build({
          position: position + 1,
          campaign: this.boosts[position].urn,
        })
      );

      console.log(
        'Boost rotator recording impressions for ' +
          position +
          ' ' +
          this.boosts[position].boosted_guid,
        this.windowFocused
      );
    }
    this.lastTs = Date.now();
    if (this.boosts[position] && this.boosts[position].boosted_guid)
      window.localStorage.setItem(
        'boost-rotator-offset',
        this.boosts[position].boosted_guid
      );
  }

  active() {
    this.windowFocused = true;
    this.isVisible();
    this.next(); // Show a new boost when we open our window again
  }

  inActive() {
    this.running = false;
    this.windowFocused = false;
    window.clearInterval(this.rotator);
  }

  mouseOver() {
    this.running = false;
    window.clearInterval(this.rotator);
  }

  mouseOut() {
    this.isVisible();
  }

  prev() {
    if (this.currentPosition <= 0) {
      this.currentPosition = this.boosts.length - 1;
    } else {
      this.currentPosition--;
    }
    this.recordImpression(this.currentPosition, false);
  }

  async next() {
    //this.activities.toArray()[this.currentPosition].hide();
    if (this.currentPosition + 1 > this.boosts.length - 1) {
      //this.currentPosition = 0;
      try {
        this.load();
        this.currentPosition++;
      } catch (e) {
        this.currentPosition = 0;
      }
    } else {
      this.currentPosition++;
    }
    this.recordImpression(this.currentPosition, false);
  }

  onEnableChanged(value) {
    this.disabled = !value;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.rotator) window.clearInterval(this.rotator);
    this.scroll.unListen(this.scroll_listener);

    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
