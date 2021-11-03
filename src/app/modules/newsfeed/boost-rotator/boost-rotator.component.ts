import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  HostBinding,
  ViewChild,
} from '@angular/core';
import {
  first,
  throttleTime,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/operators';

import { ScrollService } from '../../../services/ux/scroll';
import { Client } from '../../../services/api';
import { Storage } from '../../../services/storage';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { MindsUser } from '../../../interfaces/entities';
import { NewsfeedService } from '../services/newsfeed.service';
import { FeaturesService } from '../../../services/features.service';
import { FeedsService } from '../../../common/services/feeds.service';
import { ACTIVITY_FIXED_HEIGHT_RATIO } from '../activity/activity.service';
import {
  trigger,
  transition,
  animate,
  keyframes,
  style,
} from '@angular/animations';
import { ConfigsService } from '../../../common/services/configs.service';
import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { SettingsV2Service } from '../../settings-v2/settings-v2.service';

const BOOST_VIEW_THRESHOLD = 1000;

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
  providers: [FeedsService],
  templateUrl: 'boost-rotator.component.html',
  styleUrls: ['boost-rotator.component.ng.scss'],
  animations: [
    trigger('fastFade', [
      transition(':enter', [
        animate(
          '400ms',
          keyframes([style({ opacity: 0 }), style({ opacity: 1 })])
        ),
      ]),
      transition(':leave', [
        animate(
          '400ms',
          keyframes([style({ opacity: 1 }), style({ opacity: 0 })])
        ),
      ]),
    ]),
  ],
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
  plus: boolean = false;
  disabled: boolean = false;

  height: number;

  subscriptions: Subscription[] = [];

  @ViewChild('rotatorEl')
  rotatorEl: ElementRef;

  viewsCollector$: Subject<number> = new Subject();

  @ViewChild(ClientMetaDirective) protected clientMeta: ClientMetaDirective;

  constructor(
    public session: Session,
    public router: Router,
    public client: Client,
    public scroll: ScrollService,
    public newsfeedService: NewsfeedService,
    public settingsService: SettingsV2Service,
    private storage: Storage,
    public element: ElementRef,
    private cd: ChangeDetectorRef,
    protected featuresService: FeaturesService,
    public feedsService: FeedsService,
    configs: ConfigsService
  ) {
    this.interval = configs.get('boost_rotator_interval') || 5;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.viewsCollector$
        .pipe(distinctUntilChanged(), debounceTime(BOOST_VIEW_THRESHOLD))
        .subscribe(position => {
          if (this.boosts[position] && this.boosts[position].boosted_guid) {
            this.newsfeedService.recordView(
              this.boosts[position],
              true,
              this.channel,
              this.clientMeta.build({
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
        })
    );

    const user = this.session.getLoggedInUser();

    this.plus = user.plus;

    this.rating = user.boost_rating;
    this.disabled = user.disabled_boost;

    this.load();

    this.subscriptions.push(
      (this.scroll_listener = this.scroll
        .listenForView()
        .subscribe(() => this.isVisible()))
    );
    this.isVisible();

    this.paused = !user.boost_autorotate;

    this.subscriptions.push(
      this.feedsService.feed.subscribe(async boosts => {
        if (!boosts.length) return;
        this.boosts = [];
        for (const boost of boosts) {
          if (boost) this.boosts.push(await boost.pipe(first()).toPromise());
        }
        if (this.currentPosition >= this.boosts.length) {
          this.currentPosition = 0;
        }
        // Recalculate height because it may have been empty
        setTimeout(() => this.calculateHeight());
        // distinctuntilchange is now safe
        this.viewsCollector$.next(this.currentPosition);
      })
    );
  }

  ngAfterViewInit() {
    setTimeout(() => this.calculateHeight()); // will only run for new nav
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
    }, this.interval * 1000);
  }

  get bounds() {
    const bounds = this.element.nativeElement.parentElement.getBoundingClientRect();
    return bounds;
  }

  isVisible() {
    if (this.bounds.top > 0) {
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

  active() {
    this.windowFocused = true;
    this.isVisible();
    if (this.bounds.top > 0) this.next(); // Show a new boost when we open our window again
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
    this.viewsCollector$.next(this.currentPosition);
  }

  async next() {
    if (this.currentPosition + 1 > this.boosts.length - 1) {
      try {
        this.load();
        this.currentPosition++;
      } catch (e) {
        this.currentPosition = 0;
      }
    } else {
      this.currentPosition++;
    }
    this.viewsCollector$.next(this.currentPosition);
  }

  shouldRender(index: number) {
    const lastBoostIndex = this.boosts.length - 1;

    const previousBoostIndex = index - 1 < 0 ? lastBoostIndex : index - 1;
    const currentBoostIndex = index;
    const nextBoostIndex = index + 1;

    // show the current boost and an additional boost
    // on each side to pre-render the entities and their video
    // and improve user experience and plyr initial render issues
    switch (index) {
      case previousBoostIndex:
      case currentBoostIndex:
      case nextBoostIndex:
        return true;
      default:
        return false;
    }
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

  calculateHeight(): void {
    if (!this.rotatorEl) return;
    this.height =
      this.rotatorEl.nativeElement.clientWidth / ACTIVITY_FIXED_HEIGHT_RATIO;

    if (this.height < 500) this.height = 500;
  }
}
