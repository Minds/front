import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

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

@Component({
  moduleId: module.id,
  selector: 'm-newsfeed--boost-rotator',
  host: {
    '(window:blur)': 'inActive()',
    '(window:focus)': 'active()',
    '(mouseover)': 'mouseOver()',
    '(mouseout)': 'mouseOut()'
  },
  inputs: ['interval', 'channel'],
  templateUrl: 'boost-rotator.component.html'
})

export class NewsfeedBoostRotatorComponent {

  boosts: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;
  rotator;
  running: boolean = false;
  paused: boolean = false;
  interval: number = 3;
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
    private cd: ChangeDetectorRef
  ) {

    this.subscriptions = [
      this.settingsService.ratingChanged.subscribe((event) => this.onRatingChanged(event)),
      this.service.enableChanged.subscribe((event) => this.onEnableChanged(event)),
      this.service.pauseChanged.subscribe((event) => this.onPauseChanged(event)),
      this.service.explicitChanged.subscribe((event) => this.onExplicitChanged(event))
    ];


  }

  ngOnInit() {
    this.rating = this.session.getLoggedInUser().boost_rating;
    this.plus = this.session.getLoggedInUser().plus;
    this.disabled = !this.service.isBoostEnabled();
    this.load();
    this.scroll_listener = this.scroll.listenForView().subscribe(() => this.isVisible());

    this.paused = this.service.isBoostPaused();
  }

  /**
   * Load newsfeed
   */
  load() {
    return new Promise((resolve, reject) => {
      if (this.inProgress) {
        return reject(false);
      }
      this.inProgress = true;

      if (this.storage.get('boost:offset:rotator')) {
        this.offset = this.storage.get('boost:offset:rotator');
      }

      let show = 'all';
      if (!this.channel || !this.channel.merchant) {
        show = 'points';
      }

      this.client.get('api/v1/boost/fetch/newsfeed', {
        limit: 10,
        rating: this.rating,
        offset: this.offset,
        show: show
      })
        .then((response: any) => {
          if (!response.boosts) {
            this.inProgress = false;
            return reject(false);
          }
          this.boosts = this.boosts.concat(response.boosts);
          if (this.boosts.length >= 40) {
            this.boosts.splice(0, 20);
            this.currentPosition = 0;
          }
          if (!this.running) {
            this.recordImpression(this.currentPosition, true);
            this.start();
            this.isVisible();
          }
          this.offset = response['load-next'];
          this.storage.set('boost:offset:rotator', this.offset);
          this.inProgress = false;
          return resolve(true);
        })
        .catch((e) => {
          this.inProgress = false;
          return reject();
        });
    });
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
    if (this.rotator)
      window.clearInterval(this.rotator);
    this.running = true;
    this.rotator = setInterval((e) => {
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
      if (!this.running)
        this.start();
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
    if ((Date.now() > this.lastTs + 1000 || force) && this.boosts[position].boosted_guid) {
      this.newsfeedService.recordView(this.boosts[position], true, this.channel);
    }
    this.lastTs = Date.now();
    window.localStorage.setItem('boost-rotator-offset', this.boosts[position].boosted_guid);
  }

  active() {
    this.isVisible();
  }

  inActive() {
    this.running = false;
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

  next() {
    if (this.activities.toArray()[this.currentPosition]) {
      this.activities.toArray()[this.currentPosition].hide();
    }
    if (this.currentPosition + 1 > this.boosts.length - 1) {
      //this.currentPosition = 0;
      this.load()
        .then(() => {
          this.currentPosition++;
        })
        .catch(() => {
          this.currentPosition = 0;
        });
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
    if (this.rotator)
      window.clearInterval(this.rotator);
    this.scroll.unListen(this.scroll_listener);

    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
