import { EventEmitter } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';

export class ChannelOnboardingService {
  slides = [];

  currentSlide: number = 0;
  completed: boolean = false;

  onOpen: EventEmitter<any> = new EventEmitter<any>();

  onClose: EventEmitter<any> = new EventEmitter<any>();

  onSlideChanged: EventEmitter<number> = new EventEmitter<number>();

  completedPercentage: number = -1;
  completedItems: Array<string> = [];
  showOnboarding: boolean = false;

  // these are updated per each slide when calculating the next one, except for the first time onboarding
  pendingItems: Array<string> = [];

  static _(client: Client, session: Session) {
    return new ChannelOnboardingService(client, session);
  }

  constructor(private client: Client, private session: Session) {
    this.session.userEmitter.subscribe(v => {
      if (!v) {
        this.reset();
      }
    });
  }

  previous() {
    if (this.currentSlide === 0) {
      return;
    }

    this.currentSlide--;

    this.onSlideChanged.emit(this.currentSlide);
  }

  next() {
    if (this.currentSlide + 1 >= this.slides.length) {
      this.completed = true;
      this.currentSlide = 0;
      this.onClose.next(true);
      return;
    }

    // first time onboarding
    if (this.completedItems.length === 1) {
      // empty is 1 because username is always there from the beginning
      this.currentSlide++;
    } else {
      // here we just go to the next slide with incomplete stuff
      const i = this.currentSlide + 1;

      this.pendingItems = [];

      const items: Array<string> = (<any>this.slides[i]).items;

      for (let item of items) {
        if (!this.completedItems.includes(item)) {
          this.pendingItems.push(item);
        }
      }

      if (this.pendingItems.length > 0) {
        this.currentSlide = i;
      } else {
        this.currentSlide++;
        this.next();
      }
    }

    this.onSlideChanged.emit(this.currentSlide);
  }

  get slide(): any {
    return this.slides[this.currentSlide];
  }

  reset() {
    this.completedPercentage = -1;
    this.completedItems = [];
    this.showOnboarding = false;
    this.pendingItems = [];
    this.currentSlide = 0;
    this.completed = false;
  }
}
