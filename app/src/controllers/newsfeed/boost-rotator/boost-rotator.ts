import { Component, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ScrollService } from '../../../services/ux/scroll';
import { Client, Upload } from '../../../services/api';

import { SessionFactory } from '../../../services/session';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'minds-newsfeed-boost-rotator',
  host: {
    '(window:blur)': 'inActive()',
    '(window:focus)': 'active()',
    '(mouseover)': 'mouseOver()',
    '(mouseout)': 'mouseOut()'
  },
  inputs: ['interval'],
  templateUrl: 'boost-rotator.html'
})

export class NewsfeedBoostRotator {

  session = SessionFactory.build();
  boosts: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;
  rotator;
  running: boolean = false;
  paused: boolean = false;
  interval: number = 5;
  currentPosition: number = 0;
  lastTs: number = Date.now();
  minds;
  scroll_listener;

  rating: number = 2; //default to Safe Mode Off
  ratingMenuToggle: boolean = false;
  plus: boolean = false;
  disabled: boolean = false;

  constructor(
    public router: Router,
    public client: Client,
    public scroll: ScrollService,
    public element: ElementRef,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.rating = this.session.getLoggedInUser().boost_rating;
    this.plus = this.session.getLoggedInUser().plus;
    this.disabled = this.session.getLoggedInUser().plus && this.session.getLoggedInUser().disabled_boost;
    this.load();
    this.scroll_listener = this.scroll.listenForView().subscribe(() => this.isVisible());
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

      this.client.get('api/v1/boost/fetch/newsfeed', { limit: 10, rating: this.rating })
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
          this.inProgress = false;
          return resolve(true);
        })
        .catch(function (e) {
          this.inProgress = false;
          return reject();
        });
    });
  }

  setRating(rating) {
    this.rating = rating;
    this.session.getLoggedInUser().boost_rating = rating;
    this.boosts = [];
    this.load().then(() => {
      this.client.post('api/v1/settings/' + this.session.getLoggedInUser().guid, {
        boost_rating : rating,
      });
    });
  }

  toggleRating() {
    if (this.rating !== 1) {
      this.setRating(1);
    } else {
      this.setRating(2);
    }
    this.detectChanges();
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
    var bounds = this.element.nativeElement.getBoundingClientRect();
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
      this.client.put('api/v1/boost/fetch/newsfeed/' + this.boosts[position].boosted_guid);
    }
    this.lastTs = Date.now();
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

  pause() {
    this.paused = true;
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

  disable() {
    this.session.getLoggedInUser().disabled_boost = true;
    this.disabled = true;
    this.client.put('api/v1/plus/boost')
      .catch(() => {
        this.session.getLoggedInUser().disabled_boost = false;
        this.disabled = false;
      });
  }

  enable() {
    this.session.getLoggedInUser().disabled_boost = false;
    this.disabled = false;
    this.client.delete('api/v1/plus/boost')
      .catch(() => {
        this.session.getLoggedInUser().disabled_boost = true;
        this.disabled = true;
      });
  }

  selectCategories() {
    this.router.navigate(['/settings/general/categories']);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.rotator)
      window.clearInterval(this.rotator);
    this.scroll.unListen(this.scroll_listener);
  }

}
